var fs = require('fs'),
    schedule = require("node-schedule");

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

    tastListPath = rootPath + '/loger/tastlist.txt',
    index = 0,
    taskObj = {};

module.exports = function(req, res){
    var query = req.query,
        mode = query.mode,
        platform = query.platform,
        time = query.time,
        app_id = query.app_id,
        task,
        timeParams;

    if( mode == 0) {
        var rule = new schedule.RecurrenceRule();
        timeParams = time.replace(/\s+/, '').split(/:/);
        rule.hour = +timeParams[0];
        rule.minute = +timeParams[1];
        rule.second = +timeParams[2];

        task = schedule.scheduleJob(rule, function(){

        });

    } else if( mode == 1){
        timeParams = time.split(/\D/);
        var date =  new Date(Date.apply(null, timeParams));

        task = schedule.scheduleJob(date, function(){

        });

    }

    taskObj[index] = task;

    var taskList = [];
    if( fs.existsSync(tastListPath) ) {
        var taskListStr = fs.readFileSync(tastListPath).toString();
            taskList = JSON.parse(taskListStr) ;
    }

    taskList.push({
        index : index,
        mode : mode,
        platform : platform,
        time : time,
        app_id : app_id || null
    });

    index++;

    console.log(taskList);

    fs.writeFileSync(tastListPath, JSON.stringify(taskList));

    res.set({'Content-Type':'text/plain'});
    res.send(JSON.stringify({
        success : true
    }));

};