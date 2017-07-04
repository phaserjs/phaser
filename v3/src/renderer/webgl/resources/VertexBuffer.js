var Class = require('../../../utils/Class');

var VertexBuffer = new Class({

    initialize:

    function VertexBuffer (gl, bufferObject)
    {
        this.gl = gl;
        this.bufferTarget = gl.ARRAY_BUFFER;
        this.bufferObject = bufferObject;
        this.attributes = [];
    },

    addAttribute: function (index, size, type, normalized, stride, offset)
    {
        this.attributes.push({
            index: index,
            size: size,
            type: type,
            normalized: normalized,
            stride: stride,
            offset: offset
        });

        return this;
    },

    updateResource: function (bufferData, offset)
    {
        var gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObject);
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, bufferData);

        return this;
    },

    bind: function ()
    {
        var gl = this.gl;
        var bufferObject = this.bufferObject;
        var attributes = this.attributes;
        var attributesLength = attributes.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, bufferObject);

        for (var index = 0; index < attributesLength; ++index)
        {
            var element = attributes[index];

            if (element !== undefined && element !== null)
            {
                gl.enableVertexAttribArray(element.index);
                gl.vertexAttribPointer(
                    element.index,
                    element.size,
                    element.type,
                    element.normalized,
                    element.stride,
                    element.offset
                );
            }
        }

        return this;
    }

});

module.exports = VertexBuffer;
