var async = require("async");
var exif = require('exif-parser');
var fs = require("fs");
var png = require('png-js');

var allFiles = [];
var queue = 0;

exports.scanDir = function(dir, callback) {
    scanDirRecursive(dir, function(err) {
        if(queue == 0) {
            setFileData(function() {
                callback(getSuspects());
            });
        }
    });
}

function scanDirRecursive(dir, callback){
    queue++;
    fs.readdir(dir, function(err, files) {
        if(err) {
            callback(err);
        }
        else {
            async.each(files, function(file, done) {
                var path = dir + "/" + file;
                fs.stat(path, function(err, stats) {
                    if(err)  {
                        callback(err);
                    }
                    else {
                        if(stats.isDirectory()) scanDirRecursive(path, callback);
                        else allFiles.push({
                            name: file,
                            path: path,
                            size: (stats.size/1000)
                        });
                    }
                    done();
                });
            }, function(err) {
                queue--;
                callback(err);
            });
        }
    });
}

function getJpegData(stream) {
    try {
        var parser = exif.create(stream);
        parser.enableImageSize(true);
        var result = parser.parse();
        var size = result.getImageSize();
        return {
            width: size.width,
            height: size.height
        }
    }
    catch(e) { console.log(e.toString()); }
}

function getPngData(stream) {
    try {
        var image = new png(stream);
        return {
            width: image.width,
            height: image.height
        }
    }
    catch(e) { console.log(e.toString()); }
}

function getUnsupportedData(file) {
    // nothing to do
}

function setFileData(callback) {
    async.each(allFiles, function(file, done) {
        fs.readFile(file.path, function(err, data){
            if(err) {
                console.log(err);
            }
            else {
                file.extension = file.name.substr(file.name.lastIndexOf(".")+1).toLowerCase();

                switch(file.extension) {
                    case "jpeg":
                    case "jpg":
                        var data = getJpegData(data);
                        file.width = data.width;
                        file.height = data.height;
                        break;
                    case "png":
                        var data = getPngData(data);
                        file.width = data.width;
                        file.height = data.height;
                        break;
                    default:
                        getUnsupportedData(file);
                }

                done();
            }
        });
    }, function(err) {
        callback();
    });
}

function getSuspects() {
    var settingsJSON = JSON.parse(fs.readFileSync(__dirname + "/config.json"));
    var suspects = [];

    for(var i = 0, count = allFiles.length; i < count; i++) {
        var file = allFiles[i];
        var settings = settingsJSON[file.extension];
        if(settings) {
            if(file.size > settings.size ||
               file.width > settings.width ||
               file.height > settings.height) {
                   suspects.push(file);
               }
        }
    }
    return suspects;
}
