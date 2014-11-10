var tools = require('../module/tools');

module.exports = function(req, res){
	var callback = req.query.cb;

    tools.interfaceDone(res, {
        success : true,
        data : Object.keys(taskObj)
    }, callback);


};