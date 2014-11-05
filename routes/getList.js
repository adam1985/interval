
var rootPath = process.cwd(),
    userConf = require('../config/userConf'),
    login = require('./login'),
    getMassList = require('./getMassList');

module.exports = function(platform_name, cb){
    var curUser = userConf[platform_name];

    login.loginWeixin(curUser.user, curUser.pwd, function( loginRes, cookie){
        if(loginRes.base_resp.ret == 0) {
            var redirect_url = loginRes.redirect_url,
                rex = /token=(\d+)/;
                rex.test( redirect_url );
                var token = RegExp.$1;

            getMassList(platform_name, token, cookie, function(fsend_lists){
                cb && cb( fsend_lists );
            });

        }
    });

};