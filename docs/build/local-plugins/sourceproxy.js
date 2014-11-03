/**
* For use with custom `@sourcepath`, `@sourceline`, `@nosource` properties
* (which are used in YUIDoc-to-JSDoc to supply source documentation)
*/

var path = require('path');

exports.defineTags = function(dictionary) {

    dictionary.defineTag('nosource', {
        onTagged: function (doclet, tag) {
            doclet.meta.nosource = true;
            //doclet.meta.path = '';
            //doclet.meta.filename = '';
        }
    });

    dictionary.defineTag('sourcefile', {
        onTagged: function (doclet, tag) {
            var filename = tag.value;
            doclet.meta.path = path.dirname(filename);
            doclet.meta.filename = path.basename(filename);
        }
    });

    dictionary.defineTag('sourceline', {
       onTagged: function (doclet, tag) {
           var lineno = tag.value;
           doclet.meta.lineno = lineno;
       }
    });

}

exports.handlers = {};
exports.handlers.newDoclet = function (e) {

};
