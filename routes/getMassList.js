
var rootPath = process.cwd(),
    tools = require('../module/tools'),
    ng = require('nodegrass'),
    fs = require('fs'),
    querystring = require("querystring");

module.exports = function(platform_name, token, cookie, cb){
    var fsend_lists = [];

    var listQuery = {
            type : 10,
            action : "list",
            begin : 0,
            count : 50,
            f : "json",
            token : token,
            lang : "zh_CN",
            ajax : 1,
            random : Math.random()
        },
        historyQuery = {
            t : "mass/list",
            action : "history",
            begin : 0,
            count : 50,
            f : "json",
            token : token,
            lang : "zh_CN",
            ajax : 1,
            random : Math.random()
        },
        header = {
            "Cookie" : cookie,
            "Host" : "mp.weixin.qq.com",
            "Referer" : "http://mp.weixin.qq.com"
        },
        listParamStr = querystring.stringify( listQuery ),
        historyParamStr = querystring.stringify( historyQuery );

    ng.get('https://mp.weixin.qq.com/cgi-bin/appmsg?' + listParamStr,function(result){
        var resObj = JSON.parse(result);
        if( resObj.base_resp.ret == 0){
            var item = resObj.app_msg_info.item;

            ng.get('https://mp.weixin.qq.com/cgi-bin/masssendpage?' + historyParamStr, function(historyRes){
                var historyObj = JSON.parse(historyRes),
                    msg_item = JSON.parse(historyObj.msg_items).msg_item;
                    tools.each(item, function(key, val){
                        var isAppand = true;
                        tools.each(msg_item, function(k, v){
                            if( val.file_id == v.file_id || val.title == v.title ) {
                                isAppand = false;
                                return false;
                            }
                        });

                        if( isAppand ) {
                            fsend_lists.push({
                                seq : val.seq,
                                title : val.title,
                                file_id : val.file_id,
                                app_id : val.app_id
                            });
                        }
                    });

                    cb && cb(fsend_lists);

            }, header);
        }

    }, header);

};