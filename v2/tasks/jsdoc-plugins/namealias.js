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

// Regular expression to match a line starting with what appears to be a doclet tag.
// This only works for solo single-line doclet tags. The line start is captured in $1,
// the doclet tag in $2 and everything else in $3.
var extract = /^(\s*(?:\/\*{2,}|\*{1,})\s*)(@\w+)\s*?([^\r\n]*)/mg;

exports.handlers = {};
exports.handlers.jsdocCommentFound = function (e) {

    var raw = e.comment;

    var classdoc = /@class\b/.exec(raw);
    var sourcefile = /@sourcefile\b/.exec(raw);

    // PIXI docs generated from YUIDocs have @sourcefile (but no code) and need to be excluded
    if (classdoc && !sourcefile)
    {
        raw = raw.replace(extract, function (m, pre, doclet, extra) {
            if (doclet === '@class' && extra.trim()) {
                return pre + '@alias ' + extra.trim() + '\n' + pre + '@class';
            } else if (doclet === '@constructor') {
                return '';
            } else {
                return m;
            }
        });

        e.comment = raw;
    }

};
