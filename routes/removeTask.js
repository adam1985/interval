var fs = require('fs'),
    rootPath = process.cwd(),
    tools = require('../module/tools'),
    taskListPath = rootPath + '/loger/tasklist.txt';

module.exports = function(req, res){
    var taskIndex = req.query.taskindex,
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

    res.set({'Content-Type':'text/plain'});
    res.send(JSON.stringify({
        success : true
    }));

};