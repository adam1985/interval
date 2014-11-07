
var rootPath = process.cwd(),
    tools = require('../module/tools'),
    ng = require('nodegrass'),
    fs = require('fs'),
    querystring = require("querystring"),
    publistPath = rootPath + '/public/loger/publist.txt';

module.exports = function(platform_name, token, cookie, cb){
    var fsend_lists = [],
        publistStr = fs.readFileSync(publistPath).toString().replace(/\s+/g, ''),
        publistObj = JSON.parse( publistStr),
        curPubList = publistObj[platform_name],
        isAppId = function(app_id){
            var _isAppId = true;
            tools.each(curPubList, function(i, v){
                if( app_id == v.app_id && v.status == 1){
                    _isAppId = false;
                    return false;
                }
            });
            return _isAppId;
        };

    var query = {
            type : 10,
            action : "list",
            begin : 0,
            count : 20,
            f : "json",
            token : token,
            lang : "zh_CN",
            ajax : 1,
            random : Math.random()
        },
        paramStr = querystring.stringify( query );

    ng.get('https://mp.weixin.qq.com/cgi-bin/appmsg?' + paramStr,function(result, status, header){
        var resObj = JSON.parse(result);
        if( resObj.base_resp.ret == 0){
            var item = resObj.app_msg_info.item;
            tools.each(item, function(key, val){

                if( isAppId(val.app_id) ){
                    fsend_lists.push({
                        seq : val.seq,
                        title : val.title,
                        file_id : val.file_id,
                        app_id : val.app_id
                    });
                }
            });
        }

        cb && cb(fsend_lists);

    }, {
        "Cookie" : cookie,
        "Host" : "mp.weixin.qq.com",
        "Referer" :	"http://mp.weixin.qq.com"
    });

};