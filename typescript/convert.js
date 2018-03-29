const dom = require('dts-dom');
const parse = require('./parse');

function convertTags (tags)
{
    const parsedTags = [];
    tags.forEach(function (tag)
    {
        switch (tag.originalTitle)
        {
            case 'generic':
                parsedTags.push(parse.parseGeneric(tag.value));
                break;
            default:
                parsedTags.push(tag.value);
                break;
        }
    });

    return parsedTags;
}

function convertType (docType)
{
    switch (docType)
    {
        case 'number':
            return dom.type.number;
        case 'integer':
            return dom.type.number;
        case 'float':
            return dom.type.number;
        case 'string':
            return dom.type.string;
        case 'boolean':
            return dom.type.boolean;
        case 'void':
            return dom.type.void;
        case 'object':
            return dom.type.any;
        case 'function':
            return dom.type.any;
        case 'array':
            // TODO: fast fix -> Problem regarding dom.type.array(dom.type.any) -> 'argument type' returns [object Object] invalid typescript
            return dom.type.any + '[]';
        default: {
            // Cannot handle tilde in namespace
            if (docType.indexOf('~') === -1)
            {
                if (docType.indexOf('Array') === 0)
                {
                    return dom.type.array(
                        docType.replace(/Array\.<(.*)>/, RegExp.$1)
                    );
                }

                return docType;
            }
            else
            {
                return dom.type.any;
            }
        }
    }
}

function convertScope (scope)
{
    switch (scope)
    {
        case 'static':
            return dom.DeclarationFlags.Static;
        case 'instance':
            return dom.DeclarationFlags.None;
        default:
            return dom.DeclarationFlags.Static;
    }
}

function convertParams (params)
{
    let paramsDOM = [];
    if (params && params.length > 0)
    {
        paramsDOM = params
            .filter(
                param =>
                    param &&
                    param.name &&
                    param.type &&
                    param.type.names &&
                    param.type.names.length > 0 &&
                    param.name.indexOf('.') === -1
            ) // Removes all object attributes & keeps inital object as any. Could be handled later to insert typed object
            .map(param =>
            {
                console.log(param);

                // Handle optional types e.g (string|number)
                return dom.create.parameter(
                    param.name,
                    param.type.names
                        .map(paramName =>
                        {
                            return convertType(paramName);
                        })
                        .join('|'),
                    dom.ParameterFlags.None
                ); // No parameter flag as default
            });
    }

    console.log(paramsDOM);
    return paramsDOM;
}

function convertReturns (returns)
{
    let returnsDOM = dom.type.void;

    if (returns && returns.length > 0 && returns[0].type)
    {
        returnsDOM = convertType(returns[0].type.names[0]);
    }

    // Returns a single return type.
    return returnsDOM;
}

function convertClass (phaserModuleDOM, docObj, memberList)
{
    console.log(docObj);
}

function convertMember (phaserModuleDOM, docObj, memberList)
{
    console.log(docObj);
}

function convertFunction (phaserModuleDOM, docObj, memberList)
{
    const parentName = (/([^.]*)$/).exec(docObj.memberof)[0];
    const parentMember = memberList[parentName];

    if (parentMember)
    {
        const parentClass = parentMember.class;
        const tags = convertTags(docObj.tags);
        const replaceTypes = {};

        /* parentClass.members.push(
            dom.create.method(
                docObj.name,
                convertParams(docObj.params),
                convertReturns(docObj.returns),
                convertScope(docObj.scope)
            )
        ); */
    }
}

module.exports = function (phaserModuleDOM, ast, memberList)
{
    ast.forEach(function (docObj)
    {
        if (!docObj.undocumented && docObj.memberof)
        {
            switch (docObj.kind)
            {
                case 'class':
                    convertClass(phaserModuleDOM, docObj, memberList);
                    break;
                case 'namespace':
                    convertClass(phaserModuleDOM, docObj, memberList);
                    break;
                case 'member':
                    convertMember(phaserModuleDOM, docObj, memberList);
                    break;
                case 'function':
                    convertFunction(phaserModuleDOM, docObj, memberList);
                    break;
            }
        }
    });
};
