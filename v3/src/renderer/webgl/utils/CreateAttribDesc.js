var Attribute = require('./Attribute');

var CreateAttribDesc = function (gl, program, name, size, type, normalized, stride, offset)
{
    return new Attribute(
        gl.getAttribLocation(program, name),
        size,
        type,
        normalized,
        stride,
        offset
    );
};
