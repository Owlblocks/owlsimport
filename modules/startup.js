/*\
title: $:/plugins/Owlblocks/OwlsImport/modules/startup.js
type: application/javascript
module-type: startup

\*/
(function() {

    /*jslint node: true, browser: true */
    /*global $tw: false, exports: true */
    "use strict";

    exports.name = "OwlsImport";
    exports.platforms = ["browser"];
    exports.after = ["startup"];
    exports.synchronous = true;

    var IMPORT_LOGIC = "$:/Owlblocks/OwlsImport/ImportLogic";
    var SUBFOLDER_VAR = "image-subfolder";

    exports.startup = function() {
        /*
        $tw.hooks.addHook("th-importing-file", function(info) {
            console.log("importing-file");
            return false;
        });
        */
        /*
        $tw.hooks.addHook("th-before-importing", function(importTiddler) {
            console.log("before-importing");
            return importTiddler;
        });
        */
       console.log($tw.config);
        $tw.hooks.addHook("th-importing-tiddler", function(tiddler) {
            console.log("importing-tiddler");
            if($tw.config.contentTypeInfo[tiddler.fields.type].flags.includes("image")) {
                // console.log(`Type ${tiddler.fields.type} IS image type`);

                var logic = $tw.wiki.getTiddler(IMPORT_LOGIC);
                var subfolder = "";
                if(logic && logic.fields[SUBFOLDER_VAR]) {
                    subfolder = logic.fields[SUBFOLDER_VAR];
                    if(subfolder.startsWith("/")) {
                        subfolder = subfolder.substring(1);
                    }
                    if(!subfolder.endsWith("/")) {
                        subfolder += "/";
                    }
                }

                var type = (tiddler.fields.type /*"application/octet-stream"*/);
                var headers = { "Content-Type": type };
                $tw.utils.httpRequest({
                    url: $tw.syncadaptor.host + "files/" + subfolder + tiddler.fields.title,
                    type: "PUT",
                    headers: headers,
                    data: tiddler.fields.text,
                    callback: function(err,data,xhr) {
                        if(err) {
                            console.log(err);
                        }
                        else {
                        //    console.log("Success");
                        }
                    }
                });
                return new $tw.Tiddler(tiddler, { "text": "", "_canonical_uri": "./files/" + subfolder + tiddler.fields.title });
            }
            else {
                // console.log(`Type ${tiddler.type} is NOT an image type`);
                return tiddler;
            }
        });
    };
})();