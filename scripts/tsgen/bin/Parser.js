"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom = require("dts-dom");
const regexEndLine = /^(.*)\r\n|\n|\r/gm;
class Parser {
    constructor(docs) {
        this.topLevel = [];
        this.objects = {};
        this.namespaces = {};
        // parse doclets and create corresponding dom objects
        this.parseObjects(docs);
        this.resolveObjects(docs);
        // removes members inherited from classes
        // possibly could be avoided if mixins were defined as such before JSDoc parses them and then we could globally remove all inherited (not
        // overriden) members globally from the parsed DB
        this.resolveInheritance(docs);
        this.resolveParents(docs);
        // add integer alias
        this.topLevel.push(dom.create.alias('integer', dom.type.number));
        // add declare module
        const phaserPkgModuleDOM = dom.create.module('phaser');
        phaserPkgModuleDOM.members.push(dom.create.exportEquals('Phaser'));
        this.topLevel.push(phaserPkgModuleDOM);
    }
    emit() {
        let ignored = [];
        let result = this.topLevel.reduce((out, obj) => {
            // TODO: remove once stable
            // if (<string>obj.kind === 'property') {
            //     ignored.push((<any>obj).name);
            //     return out;
            // }
            //////////////////////////
            return out + dom.emit(obj);
        }, '');
        if (ignored.length > 0) {
            console.log('ignored top level properties:');
            console.log(ignored);
        }
        return result;
    }
    parseObjects(docs) {
        for (let i = 0; i < docs.length; i++) {
            let doclet = docs[i];
            // TODO: Custom temporary rules
            switch (doclet.longname) {
                case 'Phaser.GameObjects.Components.Alpha':
                case 'Phaser.GameObjects.Components.Animation':
                case 'Phaser.GameObjects.Components.BlendMode':
                case 'Phaser.GameObjects.Components.ComputedSize':
                case 'Phaser.GameObjects.Components.Crop':
                case 'Phaser.GameObjects.Components.Depth':
                case 'Phaser.GameObjects.Components.Flip':
                case 'Phaser.GameObjects.Components.GetBounds':
                case 'Phaser.GameObjects.Components.Mask':
                case 'Phaser.GameObjects.Components.Origin':
                case 'Phaser.GameObjects.Components.PathFollower':
                case 'Phaser.GameObjects.Components.Pipeline':
                case 'Phaser.GameObjects.Components.ScrollFactor':
                case 'Phaser.GameObjects.Components.Size':
                case 'Phaser.GameObjects.Components.Texture':
                case 'Phaser.GameObjects.Components.TextureCrop':
                case 'Phaser.GameObjects.Components.Tint':
                case 'Phaser.GameObjects.Components.ToJSON':
                case 'Phaser.GameObjects.Components.Transform':
                case 'Phaser.GameObjects.Components.Visible':
                case 'Phaser.Renderer.WebGL.Pipelines.ModelViewProjection':
                    doclet.kind = 'mixin';
                    break;
                //  Because, sod you TypeScript
                case 'Phaser.BlendModes':
                case 'Phaser.ScaleModes':
                case 'Phaser.Physics.Impact.TYPE':
                case 'Phaser.Physics.Impact.COLLIDES':
                case 'Phaser.Scale.Center':
                case 'Phaser.Scale.Orientation':
                case 'Phaser.Scale.ScaleModes':
                case 'Phaser.Scale.Zoom':
                case 'Phaser.Textures.FilterMode':
                    // console.log('Forcing enum for ' + doclet.longname);
                    doclet.kind = 'member';
                    doclet.isEnum = true;
                    break;
            }
            if ((doclet.longname.indexOf('Phaser.Physics.Arcade.Components.') == 0 || doclet.longname.indexOf('Phaser.Physics.Impact.Components.') == 0 || doclet.longname.indexOf('Phaser.Physics.Matter.Components.') == 0) && doclet.longname.indexOf('#') == -1) {
                doclet.kind = 'mixin';
            }
            let obj;
            let container = this.objects;
            switch (doclet.kind) {
                case 'namespace':
                    obj = this.createNamespace(doclet);
                    container = this.namespaces;
                    break;
                case 'class':
                    obj = this.createClass(doclet);
                    break;
                case 'mixin':
                    obj = this.createInterface(doclet);
                    break;
                case 'member':
                    if (doclet.isEnum === true) {
                        obj = this.createEnum(doclet);
                        break;
                    }
                case 'constant':
                    obj = this.createMember(doclet);
                    break;
                case 'function':
                    obj = this.createFunction(doclet);
                    break;
                case 'typedef':
                    obj = this.createTypedef(doclet);
                    break;
                case 'event':
                    obj = this.createEvent(doclet);
                    break;
                default:
                    console.log('Ignored doclet kind: ' + doclet.kind);
                    break;
            }
            if (obj) {
                if (container[doclet.longname]) {
                    console.log('Warning: ignoring duplicate doc name: ' + doclet.longname);
                    docs.splice(i--, 1);
                    continue;
                }
                container[doclet.longname] = obj;
                if (doclet.description) {
                    let otherDocs = obj.jsDocComment || '';
                    obj.jsDocComment = doclet.description.replace(regexEndLine, '$1\n') + otherDocs;
                }
            }
        }
    }
    resolveObjects(docs) {
        let allTypes = new Set();
        for (let doclet of docs) {
            let obj = doclet.kind === 'namespace' ? this.namespaces[doclet.longname] : this.objects[doclet.longname];
            if (!obj) {
                //  TODO
                console.log(`Warning: Didn't find object for ${doclet.longname}`);
                continue;
            }
            if (!doclet.memberof) {
                this.topLevel.push(obj);
            }
            else {
                let isNamespaceMember = doclet.kind === 'class' || doclet.kind === 'typedef' || doclet.kind == 'namespace' || doclet.isEnum;
                let parent = isNamespaceMember ? this.namespaces[doclet.memberof] : (this.objects[doclet.memberof] || this.namespaces[doclet.memberof]);
                //TODO: this whole section should be removed once stable
                if (!parent) {
                    console.log(`${doclet.longname} in ${doclet.meta.filename}@${doclet.meta.lineno} has parent '${doclet.memberof}' that is not defined.`);
                    let parts = doclet.memberof.split('.');
                    let newParts = [parts.pop()];
                    while (parts.length > 0 && this.objects[parts.join('.')] == null)
                        newParts.unshift(parts.pop());
                    parent = this.objects[parts.join('.')];
                    if (parent == null) {
                        parent = dom.create.namespace(doclet.memberof);
                        this.namespaces[doclet.memberof] = parent;
                        this.topLevel.push(parent);
                    }
                    else {
                        while (newParts.length > 0) {
                            let oldParent = parent;
                            parent = dom.create.namespace(newParts.shift());
                            parts.push(parent.name);
                            this.namespaces[parts.join('.')] = parent;
                            oldParent.members.push(parent);
                            parent._parent = oldParent;
                        }
                    }
                }
                ///////////////////////////////////////////////////////
                if (parent.members) {
                    parent.members.push(obj);
                }
                else {
                    console.log('Cannot find members array for:');
                    console.log(parent);
                }
                obj._parent = parent;
                // class/interface members have methods, not functions
                if ((parent.kind === 'class' || parent.kind === 'interface')
                    && obj.kind === 'function')
                    obj.kind = 'method';
                // namespace members are vars or consts, not properties
                if (parent.kind === 'namespace' && obj.kind === 'property') {
                    if (doclet.kind == 'constant')
                        obj.kind = 'const';
                    else
                        obj.kind = 'var';
                }
            }
        }
    }
    resolveInheritance(docs) {
        for (let doclet of docs) {
            let obj = doclet.kind === 'namespace' ? this.namespaces[doclet.longname] : this.objects[doclet.longname];
            if (!obj) {
                //  TODO
                console.log(`Didn't find type ${doclet.longname} ???`);
                continue;
            }
            if (!obj._parent)
                continue;
            if (doclet.inherited) { // remove inherited members if they aren't from an interface
                let from = this.objects[doclet.inherits];
                if (!from || !from._parent)
                    throw `'${doclet.longname}' should inherit from '${doclet.inherits}', which is not defined.`;
                if (from._parent.kind != 'interface') {
                    obj._parent.members.splice(obj._parent.members.indexOf(obj), 1);
                    obj._parent = null;
                }
            }
        }
    }
    resolveParents(docs) {
        for (let doclet of docs) {
            let obj = this.objects[doclet.longname];
            if (!obj || doclet.kind !== 'class')
                continue;
            let o = obj;
            // resolve augments
            if (doclet.augments && doclet.augments.length) {
                for (let augment of doclet.augments) {
                    let name = this.prepareTypeName(augment);
                    let wrappingName = name.match(/[^<]+/s)[0]; //gets everything up to a first < (to handle augments with type parameters)
                    let baseType = this.objects[wrappingName];
                    if (!baseType) {
                        console.log(`ERROR: Did not find base type: ${augment} for ${doclet.longname}`);
                    }
                    else {
                        if (baseType.kind == 'class') {
                            o.baseType = dom.create.class(name);
                        }
                        else {
                            o.implements.push(dom.create.interface(name));
                        }
                    }
                }
            }
        }
    }
    createNamespace(doclet) {
        /**
         namespace: { comment: '',
        meta:
         { filename: 'index.js',
           lineno: 10,
           columnno: 0,
           path: '/Users/rich/Documents/GitHub/phaser/src/tweens',
           code: {} },
        kind: 'namespace',
        name: 'Tweens',
        memberof: 'Phaser',
        longname: 'Phaser.Tweens',
        scope: 'static',
        ___id: 'T000002R034468',
        ___s: true }
         */
        // console.log('namespace:', doclet.longname);
        let obj = dom.create.namespace(doclet.name);
        return obj;
    }
    createClass(doclet) {
        let obj = dom.create.class(doclet.name);
        let params = null;
        if (doclet.params) {
            let ctor = dom.create.constructor(null);
            this.setParams(doclet, ctor);
            params = ctor.parameters;
            obj.members.push(ctor);
            ctor._parent = obj;
        }
        this.processGeneric(doclet, obj, params);
        if (doclet.classdesc)
            doclet.description = doclet.classdesc.replace(regexEndLine, '$1\n'); // make sure docs will be added
        return obj;
    }
    createInterface(doclet) {
        return dom.create.interface(doclet.name);
    }
    createMember(doclet) {
        let type = this.parseType(doclet);
        let obj = dom.create.property(doclet.name, type);
        this.processGeneric(doclet, obj, null);
        this.processFlags(doclet, obj);
        return obj;
    }
    createEvent(doclet) {
        let type = this.parseType(doclet);
        let obj = dom.create.const(doclet.name, type);
        this.processFlags(doclet, obj);
        return obj;
    }
    createEnum(doclet) {
        let obj = dom.create.enum(doclet.name, false);
        this.processFlags(doclet, obj);
        return obj;
    }
    createFunction(doclet) {
        let returnType = dom.type.void;
        if (doclet.returns) {
            returnType = this.parseType(doclet.returns[0]);
        }
        let obj = dom.create.function(doclet.name, null, returnType);
        this.setParams(doclet, obj);
        this.processGeneric(doclet, obj, obj.parameters);
        this.processFlags(doclet, obj);
        return obj;
    }
    createTypedef(doclet) {
        const typeName = doclet.type.names[0];
        let type = null;
        if (doclet.type.names[0] === 'object') {
            let properties = [];
            for (let propDoc of doclet.properties) {
                let prop = this.createMember(propDoc);
                properties.push(prop);
                if (propDoc.description)
                    prop.jsDocComment = propDoc.description.replace(regexEndLine, '$1\n');
            }
            type = dom.create.objectType(properties);
            if (doclet.augments && doclet.augments.length) {
                let intersectionTypes = [];
                for (let i = 0; i < doclet.augments.length; i++) {
                    intersectionTypes.push(dom.create.namedTypeReference(doclet.augments[i]));
                }
                intersectionTypes.push(type);
                type = dom.create.intersection(intersectionTypes);
            }
        }
        else {
            if (doclet.type.names[0] == "function") {
                type = dom.create.functionType(null, dom.type.void);
                this.setParams(doclet, type);
            }
            else {
                type = this.parseType(doclet);
            }
        }
        let alias = dom.create.alias(doclet.name, type);
        this.processGeneric(doclet, alias, null);
        return alias;
    }
    setParams(doclet, obj) {
        let parameters = [];
        if (doclet.params) {
            let optional = false;
            obj.jsDocComment = '';
            for (let paramDoc of doclet.params) {
                // TODO REMOVE TEMP FIX
                if (paramDoc.name.indexOf('.') != -1) {
                    console.log(`Warning: ignoring param with '.' for '${doclet.longname}' in ${doclet.meta.filename}@${doclet.meta.lineno}`);
                    let defaultVal = paramDoc.defaultvalue !== undefined ? ` Default ${String(paramDoc.defaultvalue)}.` : '';
                    if (paramDoc.description)
                        obj.jsDocComment += `\n@param ${paramDoc.name} ${paramDoc.description.replace(regexEndLine, '$1\n')}` + defaultVal;
                    else if (defaultVal.length)
                        obj.jsDocComment += `\n@param ${paramDoc.name} ` + defaultVal;
                    continue;
                }
                ///////////////////////
                let param = dom.create.parameter(paramDoc.name, this.parseType(paramDoc));
                parameters.push(param);
                if (optional && paramDoc.optional != true) {
                    console.log(`Warning: correcting to optional: parameter '${paramDoc.name}' for '${doclet.longname}' in ${doclet.meta.filename}@${doclet.meta.lineno}`);
                    paramDoc.optional = true;
                }
                this.processFlags(paramDoc, param);
                optional = optional || paramDoc.optional === true;
                let defaultVal = paramDoc.defaultvalue !== undefined ? ` Default ${String(paramDoc.defaultvalue)}.` : '';
                if (paramDoc.description)
                    obj.jsDocComment += `\n@param ${paramDoc.name} ${paramDoc.description.replace(regexEndLine, '$1\n')}` + defaultVal;
                else if (defaultVal.length)
                    obj.jsDocComment += `\n@param ${paramDoc.name} ` + defaultVal;
            }
        }
        obj.parameters = parameters;
    }
    parseType(typeDoc) {
        if (!typeDoc || !typeDoc.type) {
            return dom.type.any;
        }
        else {
            let types = [];
            for (let name of typeDoc.type.names) {
                name = this.prepareTypeName(name);
                let type = dom.create.namedTypeReference(this.processTypeName(name));
                types.push(type);
            }
            if (types.length == 1)
                return types[0];
            else
                return dom.create.union(types);
        }
    }
    prepareTypeName(name) {
        if (name.indexOf('*') != -1) {
            name = name.split('*').join('any');
        }
        if (name.indexOf('.<') != -1) {
            name = name.split('.<').join('<');
        }
        return name;
    }
    processTypeName(name) {
        if (name === 'float')
            return 'number';
        if (name === 'function')
            return 'Function';
        if (name === 'array')
            return 'any[]';
        if (name.startsWith('Array<')) {
            let matches = name.match(/^Array<(.*)>$/);
            if (matches && matches[1]) {
                return this.processTypeName(matches[1]) + '[]';
            }
        }
        else if (name.startsWith('Object<')) {
            let matches = name.match(/^Object<(.*)>$/);
            if (matches && matches[1]) {
                if (matches[1].indexOf(',') != -1) {
                    let parts = matches[1].split(',');
                    return `{[key: ${this.processTypeName(parts[0])}]: ${this.processTypeName(parts[1])}}`;
                }
                else {
                    return `{[key: string]: ${this.processTypeName(matches[1])}}`;
                }
            }
        }
        return name;
    }
    processFlags(doclet, obj) {
        obj.flags = dom.DeclarationFlags.None;
        if (doclet.variable === true) {
            obj.flags |= dom.ParameterFlags.Rest;
            let type = obj.type;
            if (!type.name.endsWith('[]')) {
                if (type.name != 'any')
                    console.log(`Warning: rest parameter should be an array type for ${doclet.longname}`);
                type.name = type.name + '[]'; // Must be an array
            }
        }
        else if (doclet.optional === true) { // Rest implies Optional – no need to flag it as such
            if (obj['kind'] === 'parameter')
                obj.flags |= dom.ParameterFlags.Optional;
            else
                obj.flags |= dom.DeclarationFlags.Optional;
        }
        switch (doclet.access) {
            case 'protected':
                obj.flags |= dom.DeclarationFlags.Protected;
                break;
            case 'private':
                obj.flags |= dom.DeclarationFlags.Private;
                break;
        }
        if (doclet.readonly || doclet.kind === 'constant')
            obj.flags |= dom.DeclarationFlags.ReadOnly;
        if (doclet.scope === 'static')
            obj.flags |= dom.DeclarationFlags.Static;
    }
    processGeneric(doclet, obj, params) {
        if (doclet.tags)
            for (let tag of doclet.tags) {
                if (tag.originalTitle === 'generic') {
                    let matches = tag.value.match(/(?:(?:{)([^}]+)(?:}))?\s?([^\s]+)(?:\s?-\s?(?:\[)(.+)(?:\]))?/);
                    let typeParam = dom.create.typeParameter(matches[2], matches[1] == null ? null : dom.create.typeParameter(matches[1]));
                    obj.typeParameters.push(typeParam);
                    handleOverrides(matches[3], matches[2]);
                }
                else if (tag.originalTitle === 'genericUse') {
                    let matches = tag.value.match(/(?:(?:{)([^}]+)(?:}))(?:\s?-\s?(?:\[)(.+)(?:\]))?/);
                    let overrideType = this.prepareTypeName(matches[1]);
                    handleOverrides(matches[2], this.processTypeName(overrideType));
                }
            }
        function handleOverrides(matchedString, overrideType) {
            if (matchedString != null) {
                let overrides = matchedString.split(',');
                if (params != null) {
                    for (let param of params) {
                        if (overrides.indexOf(param.name) != -1) {
                            param.type = dom.create.namedTypeReference(overrideType);
                        }
                    }
                }
                if (overrides.indexOf('$return') != -1) { // has $return, must be a function
                    obj.returnType = dom.create.namedTypeReference(overrideType);
                }
                if (overrides.indexOf('$type') != -1) { // has $type, must be a property
                    obj.type = dom.create.namedTypeReference(overrideType);
                }
            }
        }
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map