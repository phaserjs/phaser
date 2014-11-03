/**
* Converts the JSON data out of YUIDoc into JSDoc documentation.
*
* Use a JSDoc plugin to handle custom @sourcefile/@sourceline and reattach meta-data.
*
* This works on the current PIXI source code (and, unfortunately, exposes a few issues it has).
*/
'use strict';

// Does not work with 'props'
function paramdesc_to_str(desc, typedescs) {
    var name = desc.name;
    var typename = desc.type;
    var description = desc.description;

    if (desc.optional) {
        if (desc.optdefault) {
            name = "[" + name + "=" + desc.optdefault + "]";
        } else {
            name = "[" + name + "]";
        }
    }

    return "{" + resolve_typename(typename, typedescs) + "} " + name + " - " + description;
}

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
*    className: {
*       items: [..] - only properties and methods
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

// Use this for anything but trivial types; it takes apart complex types
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
        part = part.replace(/[^a-zA-Z0-9_$<>.]/g, '');

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

function resolve_single_typename(typename, typedescs) {

    if (!typename || typename.toLowerCase() === "Any" || typename === "*") {
        return ""; // "Any"
    }

    var typedesc = typedescs[typename];
    if (typedesc) {
        return typedesc.module + "." + typename;
    } else {
        return typename;
    }
}

function resolve_item_name(name, typedesc, typedescs) {
    var typename = resolve_single_typename(typedesc.name, typedescs);
    return typename + "#" + name;
}

function methoddesc_to_attrs(itemdesc, typedesc, typedescs)
{
    var attrs = [];

    if (itemdesc.description) {
        attrs.push(['description', itemdesc.description]);
    }
    attrs.push(['method', resolve_item_name(itemdesc.name, typedesc, typedescs)]);
    if (itemdesc.params)
    {
        itemdesc.params.forEach(function (param, i) {
            attrs.push(['param', paramdesc_to_str(param, typedescs)]);
        });
    }

    if (itemdesc['return'])
    {
        attrs.push(['return', returndesc_to_string(itemdesc['return'], typedescs)]);
    }

    if (typedesc.file) {
        attrs.push(['sourcefile', typedesc.file]);
        attrs.push(['sourceline', typedesc.line]);
    }

    return attrs;
}

function propertydesc_to_attrs(itemdesc, typedesc, typedescs)
{
    var attrs = [];

    if (itemdesc.description) {
        attrs.push(['description', itemdesc.description]);
    }
    attrs.push(['member', resolve_item_name(itemdesc.name, typedesc, typedescs)]);
    attrs.push(['type', "{" + resolve_typename(itemdesc.type, typedescs) + "}"]);
    
    var access = itemdesc['access'];
    if (access) {
        attrs.push(['access', access]);
    }

    if (itemdesc['readonly'] !== undefined) {
        attrs.push(['readonly', '']);
    }

    if (itemdesc['default'] !== undefined) {
        attrs.push(['default', itemdesc['default']]);
    }

    if (typedesc.file) {
        attrs.push(['sourcefile', typedesc.file]);
        attrs.push(['sourceline', typedesc.line]);
    }

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

function itemdesc_to_attrs(itemdesc, typedesc, typedescs) {

    if (itemdesc.itemtype === 'method')
    {
        return methoddesc_to_attrs(itemdesc, typedesc, typedescs);
    }
    else if (itemdesc.itemtype === 'property')
    {
        return propertydesc_to_attrs(itemdesc, typedesc, typedescs);
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
* Convert a "data.json" (as JSON, not text) from YUIDoc to an equivalent JSDoc markup.
*/
function yuidocdata_to_jsdoc(data) {

    var typedescs = data.classes;
    var type_itemdesc_groups = group_typeitems(data.classitems);

    var res = [];

    Object.keys(typedescs).forEach(function (name) {
        var typedesc = typedescs[name];

        var typeattrs = typedesc_to_attrs(typedesc, typedescs);
        write_attr_block(typeattrs, res);

        var type_itemdesc = type_itemdesc_groups[name];
        if (type_itemdesc) {
            type_itemdesc.items.forEach(function (itemdesc, i) {
                var attrs = itemdesc_to_attrs(itemdesc, typedesc, typedescs);
                write_attr_block(attrs, res);
            });
        } else {
            console.log("No items for " + name);
        }
    });

    return res;

}

exports.convert = function (yuidoc) {

    return yuidocdata_to_jsdoc(yuidoc);

};
