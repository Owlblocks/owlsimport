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
            if(/^image\/(.+)$/.exec(tiddler.fields.type)) {
                // console.log(`Type ${tiddler.fields.type} IS image type`);

                var type = (tiddler.fields.type /*"application/octet-stream"*/);
                var headers = { "Content-Type": type };
                $tw.utils.httpRequest({
                    url: $tw.syncadaptor.host + "files/" + tiddler.fields.title,
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
                return new $tw.Tiddler(tiddler, { "text": "", "_canonical_uri": `./files/${tiddler.fields.title}` });
            }
            else {
                // console.log(`Type ${tiddler.type} is NOT an image type`);
                return tiddler;
            }
        });
    };
})();