var fs = require('fs'),
    rootPath = process.cwd(),
    tools = require('../module/tools'),
    taskListPath = rootPath + '/public/loger/tasklist.txt';

module.exports = function(req, res){
    var taskIndex = req.query.taskindex,
        callback = req.query.cb,
        targetTask = taskObj[taskIndex];

    try{
        targetTask.cancel();
    } catch (e) {

    }

    delete taskObj[taskIndex];

    var taskList = [], taskListArr = [];

    if( fs.existsSync(taskListPath) ) {
        taskList = JSON.parse(fs.readFileSync(taskListPath).toString());
    }

    tools.each(taskList, function(i, v){
        if(v.taskIndex != taskIndex) {
            taskListArr.push( v );
        }
    });

    fs.writeFileSync(taskListPath, JSON.stringify(taskListArr));

    tools.interfaceDone(res, {
        success : true
    }, callback);

};