var Attribute = require('./Attribute');

var CreateAttribArray = function (gl, program, attributeDescArray)
{
    var attributes = [];
    for (var index = 0, length = attributeDescArray.length; index < length; ++index)
    {
        var desc = attributeDescArray[index];
        attributes.push(new Attribute(
            gl.getAttribLocation(program, desc.name),
            desc.size,
            desc.type,
            desc.normalized ? gl.TRUE : gl.FALSE,
            desc.stride,
            desc.offset
        ));
    }
    return attributes;
};

module.exports = CreateAttribArray;
