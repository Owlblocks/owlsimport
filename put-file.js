/*\
title: $:/plugins/Owlblocks/OwlsImport/modules/put-file.js
type: application/javascript
module-type: route
PUT /files/:filepath
\*/
(function() {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";
    
    exports.method = "PUT";
    
    exports.path = /^\/files\/(.+)$/;
    
    exports.handler = function(request,response,state) {
        var path = require("path"),
            fs = require("fs"), 
            util = require("util"),
            suppliedFilename = $tw.utils.decodeURIComponentSafe(state.params[0]),
            baseFilename = path.resolve(state.boot.wikiPath,"files"),
            filename = path.resolve(baseFilename,suppliedFilename),
            extension = path.extname(filename);
        // Check that the filename is inside the wiki files folder
        if(path.relative(baseFilename,filename).indexOf("..") !== 0) {
            // Write the file
            var data = state.data;
            var encoding = $tw.utils.getTypeEncoding(extension);
            var buf = Buffer.from(data, encoding);
            fs.writeFile(filename, buf, function(err) {
                var status,content,type = "text/plain";
                if(err) {
                    console.log("Error writing file" + filename + ": " + err.toString());
                    status = 400;
                    content = `Couldn't save file '${suppliedFilename}'.`
                } else {
                    status = 200;
                    content = "Success saving file.";

                }
                state.sendResponse(status,{"Content-Type": type},content);
            })
        } else {
            state.sendResponse(400,{"Content-Type": "text/plain"},"File '" + suppliedFilename + "' not found");
        }
    };
    
    }());