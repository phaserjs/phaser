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
*   - @author, @deprecated, @version, @since, @beta
*   - Most "YUI-Specific" (@readonly is supported)
* - Does not support file-level documentation
* - All class-level documentation is put into @classdesc as there appears to be no separate
*   concept in YUIDoc for constructor vs. class documentation.
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
        var class_name = itemdesc['class'];
        var itemtype = itemdesc.itemtype;

        if (itemtype === 'method' || itemtype === 'property')
        {
            var type = types[class_name];
            if (!type) {
                type = types[class_name] = {
                    items: []
                };
            }

            type.items.push(itemdesc);
        }
    });

    return types;

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
        
        // YUIDoc is type... and JSDoc is ...type
        var repeating = false;
        if (part.match(/[.]{2,}/)) {
            repeating = true;
            part = part.replace(/[.]{2,}/g, '');
        }

        // This may happen for some terribly invalid input; ideally this would not be
        // "handled" here, but trying to work with some not-correct input..
        var origpart = part;
        part = part.replace(/[^a-zA-Z0-9_$<>.]/g, '');
        if (origpart !== part) {
            console.log("Mutilating questionable type: " + origpart);
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

function add_itemdesc_common_attrs (itemdesc, typedesc, typedescs, attrs) {

    var access = itemdesc['access'];
    if (access) {
        attrs.push(['access', access]);
    }
 
    if (typedesc.file) {
        attrs.push(['sourcefile', typedesc.file]);
        attrs.push(['sourceline', typedesc.line]);
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

    add_itemdesc_common_attrs(itemdesc, typedesc, typedescs, attrs);

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

    add_itemdesc_common_attrs(itemdesc, typedesc, typedescs, attrs);

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
    else
    {
        console.warn("Unable to process item: " + itemdesc.name);
    }

}

function typedesc_to_attrs (typedesc, typedescs) {

    var attrs = [];

    // Bug in PIXI (test) docs has a "static constructor", whoops!
    if (typedescs.is_constructor || !typedescs['static']) {

        attrs.push(['class', resolve_single_typename(typedesc.name, typedescs)]);

        if (typedesc.description) {
            attrs.push(['classdesc', typedesc.description]);
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

    if (typedesc.file) {
        attrs.push(['sourcefile', typedesc.file]);
        attrs.push(['sourceline', typedesc.line]);
    }

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
        comments.push(flatten_jsdoc_comment(typeattrs));

        var type_itemdesc = type_itemdesc_groups[name];
        if (type_itemdesc) {
            type_itemdesc.items.forEach(function (itemdesc, i) {
                var attrs = itemdesc_to_attrs(itemdesc, typedesc, typedescs);
                comments.push(flatten_jsdoc_comment(attrs));
            });
        } else {
            console.log("No items for " + name);
        }
    });

    return comments;

}

exports.convert = function (yuidoc) {

    return yuidocdata_to_jsdoc(yuidoc);

};
