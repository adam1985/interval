
/*
 * GET home page.
 */
var rootPath = process.cwd(),
    ng = require('nodegrass'),
    querystring = require("querystring"),
    userConf = require('../config/userConf'),
    tools = require('../module/tools'),
    getList = require('./getList');

exports.index = function(req, res){
    var platform_lists = [];
    tools.each(userConf, function(key, val){
        if( key != 'website'){
            platform_lists.push( val );
        }
    });

    res.render('index', {
        title: '微信公众平台定时发布文章',
        platform_lists : platform_lists,
        fsend_lists : []
    });

    //getList('xiaobaoduzi', function(fsend_lists){});

};