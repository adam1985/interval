module.exports = function(req, res){

    res.set({'Content-Type':'text/plain'});
    res.send(JSON.stringify({
        success : true,
        data : Object.keys(taskObj)
    }));

};