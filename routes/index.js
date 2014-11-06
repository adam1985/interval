
/*
 * GET home page.
 */
var rootPath = process.cwd(),
    ng = require('nodegrass'),
    querystring = require("querystring"),
    fs = require('fs'),
    userConf = require('../config/userConf'),
    taskListPath = rootPath + '/loger/tasklist.txt',
    tools = require('../module/tools'),
    getList = require('./getList');

exports.index = function(req, res){
    if( req.query.airen != 'yuanyuan') {
        res.send(403, 'forbidden!');
    }

    var platform_lists = [];
    tools.each(userConf, function(key, val){
        if( key != 'website'){
            platform_lists.push( val );
        }
    });

    taskList = [];
    if( fs.existsSync(taskListPath) ) {
        taskList = JSON.parse(fs.readFileSync(taskListPath).toString());
    }


    res.render('index', {
        title: '微信公众平台定时发布文章',
        platform_lists : platform_lists,
        fsend_lists : [],
        taskList : taskList
    });

    //getList('xiaobaoduzi', function(fsend_lists){});

};