/**
* Transform '{@link #x}' to '{@link longname#x x}' which saves lots of cumersome typing.
*
* This looks in @description, @classdesc and @see tags only.
*
* See https://github.com/jsdoc3/jsdoc/issues/483
*/
 
var path = require('path');
 
function expandLinks (text, parent) {
 
    return text.replace(/\{\s*@link\s+([#.])([\w$.]+)\s*\}/g, function (m, mod, name) {
        var expanded = "{@link " + parent + mod + name + " " + name + "}";
        return expanded;
    });
 
}
 
exports.handlers = {};
exports.handlers.newDoclet = function (e) {
 
    var doclet = e.doclet;
    var parent;
    if (doclet.kind === 'class' || doclet.kind === 'interface')
    {
        parent = doclet.longname;
    }
    else
    {
        // member, method, property, etc.
        parent = doclet.memberof;
    }
 
    ['description', 'classdesc'].forEach(function (p) {
        if (doclet[p])
        {
            doclet[p] = expandLinks(doclet[p], parent);
        }
    });

    if (doclet.see && doclet.see.length)
    {
        for (var i = 0; i < doclet.see.length; i++)
        {
            doclet.see[i] = expandLinks(doclet.see[i], parent);
        }
    }
 
};