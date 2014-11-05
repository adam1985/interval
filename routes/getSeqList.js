
var getList = require('./getList');

module.exports = function(req, res){
    var platform_name = req.query.platform_name;
    getList(platform_name, function(fsend_lists){
        res.set({'Content-Type':'text/plain'});
        res.send(JSON.stringify({
            success : true,
            data : fsend_lists
        }));
    });
};