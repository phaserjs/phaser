/**
* Transform @property tags to @member tags if it looks like @property was incorrectly used.
* - That is, there is only one property and it has the same name as the member.
* The result is less-redundancy and better type exposure in the JSDoc output.
*
* If the member type is not assigned then the property type is used.
*
* A meld of the description are used; appending the property description if appropriate.
*
* This approach works for most cases in Phaser because JSDoc automatically determines the name if not specified in @name, @method, @member or @field.
*/

var path = require('path');

function looksLikeItMightContain (haystack, needle) {

    haystack = haystack || '';
    needle = needle || '';

    haystack = haystack.replace(/[^a-z]/gi, '').toLowerCase();
    needle = needle.replace(/[^a-z]/gi, '').toLowerCase();

    return haystack.indexOf(needle) > -1;

}

exports.handlers = {};
exports.handlers.newDoclet = function (e) {

    var doclet = e.doclet;
    var props = e.doclet.properties;

    if (doclet.kind === 'member' &&
        props && props.length === 1 &&
        props[0].name === doclet.name)
    {
        // "Duplicate"
        var prop = props[0];

        if (!doclet.type)
        {
            doclet.type = prop.type;
        }

        if (!doclet.description)
        {
            doclet.description = prop.description;
        }
        else if (prop.description &&
            !looksLikeItMightContain(doclet.description, prop.description))
        {
            // Tack it on..
            doclet.description += " " + prop.description;
        }

        // And no more prop
        e.doclet.properties = undefined;
    }

};
