/**
* When JSdoc encounters names it disables the automatic code inspection ability;
* this is especially problematic for cases like
*
* > @class MyClass
* > @constructor
*
* because the properties without an explicit @memberof or fullname are not being included in
* in the newer JSDoc output.
*
* This is a simple plugin, as discussed https://github.com/jsdoc3/jsdoc/issues/804#event-195287680
* to rewrite the @class [@constructor] to @alias @class which enables JSDoc to collect better data.
*/

exports.handlers = {};
exports.handlers.jsdocCommentFound = function (e) {

    var raw = e.comment;

    if (/^(\s*[*])\s*@class\b/m.exec(raw))
    {
        // @class X / @constructor -> @alias X / @class
        raw = raw.replace(/^(\s*[*])\s*@class\s+(\S+).*?$/mg, "$1 @alias $2\n$1 @class");
        raw = raw.replace(/^(\s*[*])\s*@constructor\b.*?$/mg, "$1");

        e.comment = raw;
    }

};
