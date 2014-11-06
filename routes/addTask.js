var fs = require('fs'),
    schedule = require("node-schedule"),
    tools = require('../module/tools'),
    startMass = require("./startMass");

var rootPath = process.cwd(),
    setInterTime = function(intervalTime, mode, cb){
        var args = arguments,
            now = new Date(),
            inter,
            timeParams,
            nowMilli,
            interMilli,
            _timeout,
            timeout;
        if( mode == 0 ) {
            inter = new Date();
            var dayMilli = 24 * 60 * 60 * 1000;
                _timeout = dayMilli;
            if( intervalTime ) {
                timeParams = intervalTime.replace(/\s+/, '').split(/:/);
                inter.setHours(+timeParams[0]);
                inter.setMinutes(+timeParams[1]);
                inter.setSeconds(+timeParams[2]);

                    nowMilli = now.getTime();
                    interMilli = inter.getTime();
                    _timeout = interMilli - nowMilli;
                if( _timeout < 0 ) {
                    _timeout = dayMilli + _timeout;
                }
            }

            timeout = setTimeout(function(){
                cb && cb( timeout );
                args.callee(null, mode, cb);
            }, _timeout);

        } else if( mode == 1 ){
            timeParams = intervalTime.split(/\D/);
            inter = new Date(Date.apply(null, timeParams));

            nowMilli = now.getTime();
            interMilli = inter.getTime();
            _timeout = interMilli - nowMilli;

            if( _timeout ) {
                timeout = setTimeout(function(){
                    cb && cb( timeout );
                }, _timeout);
            }
        }

        return timeout;
    },

    taskListPath = rootPath + '/loger/tasklist.txt',
    publistPath = rootPath + '/loger/publist.txt';

module.exports = function(req, res){
    var query = req.query,
        mode = query.mode,
        platform = query.platform,
        time = query.time,
        app_id = query.app_id,
        title = query.title,
        task,
        timeParams,
        milli = new Date().getTime();

    if( mode == 0) {
        var rule = new schedule.RecurrenceRule();
        timeParams = time.replace(/\s+/, '').split(/:/);
        rule.hour = +timeParams[0];
        rule.minute = +timeParams[1];
        rule.second = +timeParams[2];

        var writeLoger = function(data, taskIndex, app_id, platform_name, title){
            console.log(data);
            var publist = {};
            if( fs.existsSync(publistPath) ) {
                publist = JSON.parse(fs.readFileSync(publistPath).toString());
            }
            var noFount  = true, status = 0;

            if( data.ret == 0) {
                status = 1;
            } else {
                status = -1;
            }

            if( publist[platform_name] ) {
                tools.each(publist[platform_name], function(i, v){
                    if(v.app_id == app_id){
                        noFount = false;
                        publist[platform_name][i].status = status;
                        return false;
                    }
                });

                if( noFount ){
                    publist[platform_name].push({
                        "app_id": app_id,
                        "status": status,
                        "title": title
                    });
                }

                fs.writeFileSync(publistPath, JSON.stringify(publist));
            }


            var taskList = [];
            if( fs.existsSync(taskListPath) ) {
                taskList = JSON.parse(fs.readFileSync(taskListPath).toString());
            }

            if( taskList.length ){
                tools.each(taskList, function(i, v){

                    if(v.taskIndex == taskIndex){
                        taskList[i].prevTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                        taskList[i].successStatus = status;
                        if( taskList[i].excuteNum != undefined ) {
                            taskList[i].excuteNum++;
                        } else {
                            taskList[i].excuteNum = 1;
                        }

                    }
                });

                fs.writeFileSync(taskListPath, JSON.stringify(taskList));
            }
        };

        task = schedule.scheduleJob(rule, function(){
            startMass({
                platform_name : platform,
                taskIndex : milli,
                cb : function( data, taskIndex, app_id, platform_name, title ){
                    writeLoger( data, taskIndex, app_id, platform_name, title );

                }
            });
        });

    } else if( mode == 1){
        timeParams = time.split(/\D/);
        var date =  new Date(Date.apply(null, timeParams));

        task = schedule.scheduleJob(date, function(){
            startMass({
                platform_name : platform,
                taskIndex : milli,
                app_id : app_id,
                title : title,
                cb : function( data, taskIndex, app_id, platform_name, title ){
                    writeLoger( data, taskIndex, app_id, platform_name, title );
                }
            });
        });
    }

    taskObj[milli] = task;

    var taskList = [];
    if( fs.existsSync(taskListPath) ) {
        var taskListStr = fs.readFileSync(taskListPath).toString();
            taskList = JSON.parse(taskListStr) ;
    }

    var taskData = {
        taskIndex : milli,
        mode : mode,
        platform : platform,
        time : time,
        app_id : app_id || null,
        title : title || null
    };

    taskList.push(taskData);


    fs.writeFileSync(taskListPath, JSON.stringify(taskList));

    res.set({'Content-Type':'text/plain'});
    res.send(JSON.stringify({
        success : true,
        data : [taskData]
    }));

};