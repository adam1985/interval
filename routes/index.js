
/*
 * GET home page.
 */
var rootPath = process.cwd(),
    userConf = require('../config/userConf'),
    tools = require('../module/tools'),
    login = require('./login'),
    ng = require('nodegrass'),
    querystring = require("querystring"),
    curUser = userConf.xiaobaoduzi;

exports.index = function(req, res){
    var platform_lists = [], fsend_lists = [];
    tools.each(userConf, function(key, val){
        if( key != 'website'){
            platform_lists.push( val );
        }
    });

    var data = {
        title: '微信公众平台定时发布文章',
        platform_lists : platform_lists
    };

    login.loginWeixin(curUser.user, curUser.pwd, function( loginRes, cookie){
        if(loginRes.base_resp.ret == 0) {
            var redirect_url = loginRes.redirect_url,
                rex = /token=(\d+)/;
                rex.test( redirect_url );
                var token = RegExp.$1;

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
                        fsend_lists.push({
                            seq : val.seq,
                            title : val.title,
                            file_id : val.file_id,
                            app_id : val.app_id
                        });
                    });
                }

                data.fsend_lists = fsend_lists;

                res.render('index', data);

            }, {
                "Cookie" : cookie,
                "Host" : "mp.weixin.qq.com",
                "Referer" :	"http://mp.weixin.qq.com"
            });
        }
    });


};