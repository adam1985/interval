var fs = require('fs'),
    schedule = require("node-schedule"),
    tools = require('../module/tools'),
    startMass = require("./startMass");

var rootPath = process.cwd(),

    taskListPath = rootPath + '/public/loger/tasklist.txt';

module.exports = function(req, res){
    var query = req.query,
        mode = query.mode,
        platform = query.platform,
        time = query.time,
        app_id = query.app_id,
        title = query.title,
        callback = req.query.cb,
        task,
        timeParams,
        milli = new Date().getTime();

    var writeLoger = function(data, taskIndex, app_id, platform_name, title){

        var noFount  = true, status = 0;

        if( data.ret == 0) {
            status = 1;
        } else {
            status = -1;
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

    if( mode == 0) {
        var rule = new schedule.RecurrenceRule();
        timeParams = time.replace(/\s+/, '').split(/:/);
        rule.hour = +timeParams[0];
        rule.minute = +timeParams[1];
        rule.second = +timeParams[2];

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
        var date =  new Date(
            +timeParams[0],
            +timeParams[1] - 1,
            +timeParams[2],
            +timeParams[3],
            +timeParams[4],
            +timeParams[5]);

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

    tools.interfaceDone(res, {
        success : true,
        data : [taskData]
    }, callback);

};