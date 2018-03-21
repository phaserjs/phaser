/**
    @overview Export the jsdoc comments in a json file
    @version 1.0
 */
'use strict';

var path = require('jsdoc/path');

function findClass(parentNode, className)
{
    var elements =
    parentNode.classes
    .filter(function (element) {
        return (element.name === className);
    });
    
    return elements[0];
}

function graft2(parentNode, childNodes) {
    if (!parentNode.classes) {
        parentNode.classes = [];
    }

    childNodes.forEach(function (element, index) {
        if (element.kind === 'class') {
            var thisClass = {
                'name': element.longname,
                'description': element.classdesc || element.description || '',
                'constructor': {
                    'name': element.name,
                    'description': element.description || '',
                    'parameters': []
                },
                'functions': [],
                'members': []
            };

            if (element.params) {
                for (i = 0, len = element.params.length; i < len; i++) {
                    thisClass.constructor.parameters.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type ? (element.params[i].type.names.length === 1 ? element.params[i].type.names[0] : element.params[i].type.names) : '',
                        'description': element.params[i].description || '',
                        'default': element.params[i].defaultvalue || '',
                        'optional': typeof element.params[i].optional === 'boolean' ? element.params[i].optional : '',
                        'nullable': typeof element.params[i].nullable === 'boolean' ? element.params[i].nullable : ''
                    });
                }
            }

            parentNode.classes.push(thisClass);
        }
        else if (element.kind === 'function')
        {
            var parentClass = findClass(parentNode, element.memberof);

            var thisFunction = {
                'name': element.name,
                'description': element.description || '',
                'parameters': []
            };

            if (parentClass != null) {

                parentClass.functions.push(thisFunction);

                if (element.returns) {
                    thisFunction.returns = {
                        'type': element.returns[0].type ? (element.returns[0].type.names.length === 1 ? element.returns[0].type.names[0] : element.returns[0].type.names) : '',
                        'description': element.returns[0].description || ''
                    };
                }

                if (element.params) {
                    for (i = 0, len = element.params.length; i < len; i++) {
                        thisFunction.parameters.push({
                            'name': element.params[i].name,
                            'type': element.params[i].type ? (element.params[i].type.names.length === 1 ? element.params[i].type.names[0] : element.params[i].type.names) : '',
                            'description': element.params[i].description || '',
                            'default': element.params[i].defaultvalue || '',
                            'optional': typeof element.params[i].optional === 'boolean' ? element.params[i].optional : '',
                            'nullable': typeof element.params[i].nullable === 'boolean' ? element.params[i].nullable : ''
                        });
                    }
                }
            }
        }
        else if ((element.kind === 'member') || (element.kind == 'constant')) {
            var parentClass = findClass(parentNode, element.memberof);
            if (parentClass != null) {
                parentClass.members.push({
                    'name': element.name,
                    'access': element.access || '',
                    'virtual': !!element.virtual,
                    'description': element.description || (((element.properties !== undefined) && (element.properties.length === 1)) ? (element.properties[0].description || '') : ''), //properties
                    'type': element.type ? (element.type.length === 1 ? element.type[0] : element.type) : '',
                    'default': element.defaultvalue || '',
                });
            }
        }
    });
}
/**
    @param {TAFFY} data
    @param {object} opts
 */
exports.publish = function (data, opts) {
    var root = {};
    data({undocumented: true}).remove();

    graft2(root, data().get());
    var fs = require('fs');
    fs.writeFileSync(path.join(env.opts.destination, 'docs.json'), JSON.stringify(root), 'utf8');
};
