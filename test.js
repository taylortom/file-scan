var fileScan = require("./file_scan/fileScan.js");

fileScan.scanDir("adapt_framework/src/course", function(err, data) {
    if(err) console.log(err);
    else console.log(data);
});
