var ng = require('nodegrass'),
    querystring = require("querystring"),
    login = require("./login");

module.exports = function( name, pwd, cb ){
    login.loginWeixin( name, cb, function(loginRes, cookie){
        if( loginRes.base_resp.ret == 0 ) {
            var redirect_url = loginRes.redirect_url,
                rex = /token=(\d+)/;
            rex.test( redirect_url );
            var token = RegExp.$1;

            var query = {
                    t : "mass/send",
                    token : token,
                    lang : "zh_CN"
                },
                paramStr = querystring.stringify( query );

            ng.get('https://mp.weixin.qq.com/cgi-bin/masssendpage?' + paramStr,function(data, status, header){
                data = data.replace(/\s+/g, '');

                /operation_seq:"(\d+)"/m.test(data);

                operation_seq = RegExp.$1.length;

                cb && cb(operation_seq, token, loginRes, cookie);

            }, {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie" : cookie,
                "Host" : "mp.weixin.qq.com",
                "Referer" :	"http://mp.weixin.qq.com"
            }, {}, 'utf8');
        }

    });
};



