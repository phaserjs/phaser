/**
* Converts the JSON data out of YUIDoc into JSDoc documentation.
*
* Use a JSDoc plugin to handle custom @sourcefile/@sourceline and reattach meta-data.
*
* This works on the current PIXI source code (and exposes a few documentation bugs).
*
* Known limitations:
* - Does not support (from YUIDoc):
*   - @namespace/@module (although all types in the output are fully-resolved)
*   - @event, @bubbles, @for, @uses, @chainable, @async
*   - @beta
*   - Most "YUI-Specific" (but @readOnly is supported)
* - File-level documentation is probably lost.
* - All class-level documentation is put into the constructor's @description as there appears
*   to be no separate concept in YUIDoc for constructor vs. class documentation.
* - Probably doesn't work with nested modules/namespaces.
*   (And many unknown)
*
*/
'use strict';

/**
* Convert a parameter into a parameter tag string; also do this for each desc.props, specifying the baseprop.
*/
function paramdesc_to_str(desc, typedescs, basename) {
    var name = desc.name;
    var typename = desc.type;
    var description = desc.description;

    if (basename) {
        name = basename + "." + name;
    }

    if (desc.optional) {
        if (desc.optdefault) {
            name = "[" + name + "=" + desc.optdefault + "]";
        } else {
            name = "[" + name + "]";
        }
    }

    return "{" + resolve_typename(typename, typedescs) + "} " + name + " - " + description;
}

/**
* Convert a parameter to as many @params as required; this is to map YUIDoc "props"
*/
function paramdesc_to_attrs(desc, typedescs, attrs, baseprop) {

    attrs = attrs || [];

    attrs.push(paramdesc_to_str(desc, typedescs, baseprop ? baseprop.name : ''));

    if (desc.props) {
        desc.props.forEach(function (prop) {
            paramdesc_to_attrs(prop, typedescs, attrs, desc);
        });
    }

    return attrs;

}

/**
* Convert a return into a return tag string.
*/
function returndesc_to_string(desc, typedescs) {
    var typename = desc.type;
    var description = desc.description;
    if (typename) {
        return "{" + resolve_typename(typename, typedescs) + "} " + description;
    } else {
        return description;
    }
}

/**
* Convert flat 'typeitems' found in YUIDoc to a dictionary:
*    typename: {
*       items: [..] - properties and methods
*    }
*/
function group_typeitems(typeitems) {

    var types = {};

    typeitems.forEach(function (itemdesc, i) {
        var typename = itemdesc['class'];

        var type = types[typename];
        if (!type) {
            type = types[typename] = {
                items: []
            };
        }

        type.items.push(itemdesc);
    });

    return types;

}

/**
* Convert ident to the "closest" valid non-quoted identifier.
* May return the empty string (which is not a valid identifier).
*/
function as_valid_identifier (ident) {
    ident = ident.replace(/\s/g, '_');
    ident = ident.replace(/[^\w_$]/g, '');
    ident = ident.replace(/^(\d)/, '_$1');

    return ident;
}

/**
* YUIDoc has no concept of generic types and various projects use inconsistent mashups.
* This is a simple hack to provide some normalization; only spome formats
* (in particular, that seen in the pixi project) and a few types of input are
* correctly accepted and nested arrays are not supported.
*
* Returns the corrected type if successful
*/
function fixup_yuidoc_array (rawtype) {
    // Accept examples, where the angle braces represent all braces.
    // 1. X < >
    // 2. Array < X >
    // 3. Array..of < X >
    var r = rawtype;
    var m;

    // Trim spaces
    r = r.replace(/^\s+|\s+$/g, '');
    // make all brackets angles 
    r = r.replace(/[({[]/g, '<').replace(/[)}\]]/g, '>');
    // remove whitespace and periods next to brackets
    r = r.replace(/[\s.]*([<>])[\s.]*/g, '$1');

    // match T<..>, where T != 'array'
    m = r.match(/^([\w$.]+)(?:<.*>)$/i);
    if (m && m[1].toLowerCase() !== 'array') {
        return 'Array<' + (as_valid_identifier(m[1]) || 'unknown') + '>';
    }

    // match Array <T>
    m = r.match(/^Array<(.*)>$/i);
    if (m) {
        return 'Array<' + (as_valid_identifier(m[1]) || 'unknown') + '>';
    }

    // match Array..of T
    m = r.match(/^Array.*?of\b\s*(.*)$/i);
    if (m) {
        return 'Array<' + (as_valid_identifier(m[1]) || 'unknown') + '>';
    }

    return '';
}

/**
* Try to fixup a type if it looks like it may conform to `{key: value, ..}`.
* Nesting is not supported and quoted keys are not supported.
*
* Returns the fixed up version or ''.
*/
function fixup_jsobject_like (rawType) {

    var r = rawType;

    // Trim spaces
    r = r.replace(/^\s+|\s+$/g, '');
    // And duplicate brackets
    if (r.match(/^{\s*{.*}\s*}$/)) {
        r = r.replace(/^{\s*(.*?)\s*}$/, '$1');
    }

    if (r.match(/^{([\w$.]+:\s*[\w$.]+,?\s*)+}$/)) {
        r = r.replace(/([\w$.]+):\s*([\w$.]+)(,?\s*)/g, function (m, a, b, c) {
            if (c) { c = ", "; }
            return as_valid_identifier(a) + ": " + as_valid_identifier(b) + c;
        });
        return r;
    }
    else
    {
        return '';
    }

}

/**
* Process a complex (possibly multiple) type.
* (This has limited ability now: will not recurse, handle special arrays, etc.)
*/
function resolve_typename(typename, typedescs) {

    if (!typename) { typename = "Any"; }

    var typenames;
    if (typename.indexOf('|') > -1) {
        typenames = typename.split(/[|]/g);
    } else {
        typenames = [typename];
    }

    typenames = typenames.map(function (part) {

        var orig = part;
        var prev;
        var loss = false;
        var repeating = false;
        var array = false;
        var objlike = false;

        // Don't accept quotes in names from upstream
        prev = part;
        part = part.replace(/"/g, '');
        loss = loss || prev !== part;

        // YUIDoc is type... and JSDoc is ...type
        prev = part;
        part = part.replace(/^\.{3,}|\.{3,}$/g, '');
        repeating = prev !== part;

        prev = part;
        part = fixup_jsobject_like(part);
        if (part) {
            objlike = true;
        } else {
            part = prev;
        }

        prev = part;
        part = fixup_yuidoc_array(part);
        if (part) {
            array = true;
        } else {
            part = prev;
        }

        if (objlike) {
            loss = loss || orig.replace(/\W+/g, '') !== part.replace(/\W+/g, '');
        } else if (array) {
            loss = loss || orig.replace(/^\W/, '') !== part.replace(/^\W/, '');
        } else {
            prev = part;
            var m = part.match(/[\w$.]+/); // Take possible '.' to start
            part = (m && m[0]) || '';
            part = as_valid_identifier(part);
            loss = loss || prev !== part;
        }

        if (loss) {
            console.log("Mutilating type: (" + orig + "=>" + part + ")");
        }

        var resolved = resolve_single_typename(part, typedescs);
        if (repeating) {
            return "..." + resolved;
        } else {
            return resolved;
        }
    });

    if (typenames.length > 1) {
        return "(" + typenames.join("|") + ")";
    } else {
        return typenames[0];
    }
}

/**
* Process a single type
*/
function resolve_single_typename(typename, typedescs) {

    if (!typename || typename.toLowerCase() === "any" || typename === "*") {
        return ""; // "Any"
    }

    var typedesc = typedescs[typename];
    if (typedesc) {
        return typedesc.module + "." + typename;
    } else {
        return typename;
    }
}

function resolve_item_qualifiedname(itemdesc, typedesc, typedescs) {
    var name = itemdesc.name;
    var typename = resolve_single_typename(typedesc.name, typedescs);
    if (itemdesc['static']) {
        return typename + "." + name;
    } else {
        return typename + "#" + name;
    }
}

function add_generic_attrs (desc, attrs) {

    var map = ['access', 'author', 'version', 'since', 'deprecated'];

    map.forEach(function (m) {
        var key = m;
        var value = desc[key];
        if (value) {
            attrs.push([key, value]);
        }
    });

    if (desc.file) {
        attrs.push(['sourcefile', desc.file]);
        attrs.push(['sourceline', desc.line]);
    }

}

/**
* Process Method
*/
function methoddesc_to_attrs(itemdesc, typedesc, typedescs)
{
    var attrs = [];

    if (itemdesc.description) {
        attrs.push(['description', itemdesc.description]);
    }
    attrs.push(['method', resolve_item_qualifiedname(itemdesc, typedesc, typedescs)]);
    if (itemdesc.params)
    {
        itemdesc.params.forEach(function (param, i) {
            var paramattrs = paramdesc_to_attrs(param, typedescs);
            paramattrs.forEach(function (paramattr) {
                attrs.push(['param', paramattr]);
            });
        });
    }

    if (itemdesc['return'])
    {
        attrs.push(['return', returndesc_to_string(itemdesc['return'], typedescs)]);
    }

    add_generic_attrs(itemdesc, attrs);

    return attrs;
}

/**
* Process Property - Member in JSDoc
*/
function propertydesc_to_attrs(itemdesc, typedesc, typedescs)
{
    var attrs = [];

    if (itemdesc.description) {
        attrs.push(['description', itemdesc.description]);
    }
    attrs.push(['member', resolve_item_qualifiedname(itemdesc, typedesc, typedescs)]);
    attrs.push(['type', "{" + resolve_typename(itemdesc.type, typedescs) + "}"]);
    
    if (itemdesc['readonly'] !== undefined) {
        attrs.push(['readonly', '']);
    }

    if (itemdesc['default'] !== undefined) {
        attrs.push(['default', itemdesc['default']]);
    }

    add_generic_attrs(itemdesc, attrs);

    return attrs;
}

function write_attr_block (attrs, res) {

    if (attrs) {
        res.push("/**");

        attrs.forEach(function (attr) {
            var name = attr[0];
            var value = attr[1];
            if (value !== undefined) {
                res.push("* @" + name + " " + value);
            } else {
                res.push("* @" + name);
            }
        });

        res.push("*/");
    }

}

/**
* Turns an array of "attributes" into a JSDoc comment block.
*/
function flatten_jsdoc_comment (attrs) {

    var res = [];
    write_attr_block(attrs, res);
    return res.join("\n");

}

function itemdesc_to_attrs(itemdesc, typedesc, typedescs) {

    if (itemdesc.itemtype === 'method')
    {
        return methoddesc_to_attrs(itemdesc, typedesc, typedescs);
    }
    else if (itemdesc.itemtype === 'property')
    {
        return propertydesc_to_attrs(itemdesc, typedesc, typedescs);
    }
    else if (!typedesc._loggedLooseComment)
    {
        typedesc._loggedLooseComment = true;
        var name = itemdesc.file.match(/([^\/\\]*)$/)[1];
        console.log("Skipping loose comment: " + name + ":" + itemdesc.line + " (first)");
    }

}

function typedesc_to_attrs (typedesc, typedescs) {

    var attrs = [];

    // Bug in PIXI (test) docs has a "static constructor", whoops!
    if (typedescs.is_constructor || !typedescs['static']) {

        attrs.push(['class', resolve_single_typename(typedesc.name, typedescs)]);

        if (typedesc.description) {
            attrs.push(['description', typedesc.description]);
        }

    } else {
        // Not constructor, possibly static ..

        attrs.push(['description', typedesc.description]);
        attrs.push(['namespace', resolve_single_typename(typedesc.name, typedescs)]);

    }

    var extendsname = typedesc['extends'];
    if (extendsname) {
        var extenddesc = typedescs[extendsname];
        if (extenddesc) {
            attrs.push(['augments', resolve_single_typename(extendsname, typedescs)]);
        } else {
            attrs.push(['augments', extendsname]);
        }
    }

    if (typedesc.params)
    {
        typedesc.params.forEach(function (paramdesc, i) {
            attrs.push(['param', paramdesc_to_str(paramdesc, typedescs)]);
        });
    }

    add_generic_attrs(typedesc, attrs);

    return attrs;

}

function filedesc_to_attrs (filedesc) {

    var attrs = [];

    attrs.push(['fileoverview', filedesc.description]);

    add_generic_attrs(filedesc, attrs);

    return attrs;

}

/**
* Converts YUIDoc JSON (as found in data.json after generating documentation) into JSDoc comments.
*
* @method
* @param {} data - YUIDoc data.
* @return {string[]} An array of comment blocks.
*/
function yuidocdata_to_jsdoc(data) {

    var typedescs = data.classes;
    var type_itemdesc_groups = group_typeitems(data.classitems);

    var comments = [];

    Object.keys(typedescs).forEach(function (name) {
        var typedesc = typedescs[name];

        var typeattrs = typedesc_to_attrs(typedesc, typedescs);
        var type_comments = [];

        var type_itemdesc = type_itemdesc_groups[name];
        if (type_itemdesc) {

            // First item might be a file-level comment
            var first_item = type_itemdesc.items[0];
            if (first_item.itemtype === undefined) {
                type_itemdesc.items.shift();

                var file_attrs = filedesc_to_attrs(first_item);
                comments.push(flatten_jsdoc_comment(file_attrs));
            }

            type_itemdesc.items.forEach(function (itemdesc, i) {
                var attrs = itemdesc_to_attrs(itemdesc, typedesc, typedescs);
                type_comments.push(flatten_jsdoc_comment(attrs));
            });
        } else {
            console.log("No items for " + name);
        }

        comments.push(flatten_jsdoc_comment(typeattrs));
        comments.push.apply(comments, type_comments);

    });

    return comments;

}

exports.convert = function (yuidoc) {

    return yuidocdata_to_jsdoc(yuidoc);

};
