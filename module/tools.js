var dateFormat = require("./dateFormat"),
    fs = require('fs'),
    path = require('path');
    dateFormat.format();
var tools_ = {};
tools_.toDate = function( str ){
        str = str.toString();
        var year = +str.substr(0, 4),
            mouth = +str.substr(4, 2) - 1,
            day = +str.substr(6, 2),
            hour = +str.substr(8, 2),
            minute= +str.substr(10, 2),
            second  = +str.substr(12);

        return new Date (year, mouth, day, hour, minute, second);

};

tools_.disposeDirSort = function( dirlists ){
    var obj = {}, list = [];

    if( dirlists.length  ) {
        dirlists.forEach(function(v){
            list.push({
                val1 : v,
                val2 : parseInt(v.replace(/\D/g, ''))
            });
        });

        list = list.sort(function(a, b){
            return b.val2 - a.val2;
        });

        obj.latest = {
            text : toDate(list[0].val2).format("yyyy-MM-dd hh:mm:ss"),
            value : list[0].val1
        };

        obj.list = [];

        list.forEach(function(v){
            obj.list.push({
                text : toDate(v.val2).format("yyyy-MM-dd hh:mm:ss"),
                value : v.val1
            });
        });
    }



    return obj;

};


tools_.readDirNames = function(dirname) {
    var dirlists = [];
    var basenames = fs.readdirSync(dirname);
    basenames.forEach(function (basename) {
        var filename = path.join(dirname, basename);
        var stats = fs.statSync(filename);
        if (stats.isDirectory()) {
            dirlists.push(basename);
        }
    });

    return dirlists;

};

tools_.each = function( obj, callback, args ) {
    var name,
        i = 0,
        length = obj.length,
        isObj =true;

    if ( args ) {
        if ( isObj ) {
            for ( name in obj ) {
                if ( callback.apply( obj[ name ], args ) === false ) {
                    break;
                }
            }
        } else {
            for ( ; i < length; ) {
                if ( callback.apply( obj[ i++ ], args ) === false ) {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    } else {
        if ( isObj ) {
            for ( name in obj ) {
                if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
                    break;
                }
            }
        } else {
            for ( ; i < length; ) {
                if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
                    break;
                }
            }
        }
    }

    return obj;
};

/**
 * 模拟jQuery.extend方法
 * @param arg 源数据
 * @param dft 新数据
 * @param cover 是否覆盖
 * @returns {object}
 */
tools_.extend = function (arg, dft, cover) {
    for (var key in dft) {
        if ( cover ) {
            arg[key] = dft[key];
        } else {
            if (typeof arg[key] == 'undefined') {
                arg[key] = dft[key];
            }
        }

    }
    return arg;
};

module.exports = tools_;

