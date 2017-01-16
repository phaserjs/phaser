var BindVertexArray = function (gl, vao)
{
    var attributes = vao.attributes;
    gl.bindBuffer(gl.ARRAY_BUFFER, vao.buffer);
    for (var index = 0, length = attributes.length; index < length; ++index)
    {
        var attrib = attributes[index];
        var location = attrib.location;
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(
            location,
            attrib.size,
            attrib.type,
            attrib.normalized,
            attrib.stride,
            attrib.offset
        );
    }
};
