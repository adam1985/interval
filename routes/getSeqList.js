
var tools = require('../module/tools'),
	getList = require('./getList');

module.exports = function(req, res){
    var platform_name = req.query.platform_name,
    	callback = req.query.cb;
    getList(platform_name, function(fsend_lists){

        tools.interfaceDone(res, {
            success : true,
            data : fsend_lists
        }, callback);

    });
};