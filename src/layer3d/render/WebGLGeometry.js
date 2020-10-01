/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

var WebGLGeometry = new Class({

    initialize:

    function WebGLGeometry (renderer)
    {
        this.renderer = renderer;
        this.vertexArrayBindings = renderer.vertexArrayBindings;
    },

    setGeometry: function (geometry)
    {
        var gl = this.renderer.gl;

        var properties = geometry.sceneProperties;

        if (geometry.index !== null)
        {
            this.updateAttribute(properties, geometry.index, gl.ELEMENT_ARRAY_BUFFER);
        }

        for (var name in geometry.attributes)
        {
            this.updateAttribute(properties, geometry.attributes[name], gl.ARRAY_BUFFER);
        }

        return properties;
    },

    updateAttribute: function (properties, attribute, bufferType)
    {
        if (attribute.isInterleavedBufferAttribute)
        {
            attribute = attribute.data;
        }

        var data = properties.attributes[attribute];

        if (!data)
        {
            data = { buffer: null, type: null, bytesPerElement: 0, version: 0 };

            properties.attributes[attribute] = data;
        }

        if (!data.buffer)
        {
            this.createBuffer(data, attribute, bufferType);
        }
        else if (data.version < attribute.version)
        {
            this.updateBuffer(data.buffer, attribute, bufferType);

            data.version = attribute.version;
        }
    },

    removeAttribute: function (properties, attribute)
    {
        if (attribute.isInterleavedBufferAttribute)
        {
            attribute = attribute.data;
        }

        var data = properties.attributes[attribute];

        if (data.buffer)
        {
            this.renderer.gl.deleteBuffer(data.buffer);
        }

        properties.attributes.delete(attribute);
    },

    createBuffer: function (data, attribute, bufferType)
    {
        var gl = this.renderer.gl;

        var array = attribute.array;
        var usage = attribute.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

        var buffer = gl.createBuffer();

        gl.bindBuffer(bufferType, buffer);
        gl.bufferData(bufferType, array, usage);

        var type = gl.FLOAT;

        if (array instanceof Float32Array)
        {
            type = gl.FLOAT;
        }
        else if (array instanceof Uint16Array)
        {
            type = gl.UNSIGNED_SHORT;
        }
        else if (array instanceof Int16Array)
        {
            type = gl.SHORT;
        }
        else if (array instanceof Uint32Array)
        {
            type = gl.UNSIGNED_INT;
        }
        else if (array instanceof Int32Array)
        {
            type = gl.INT;
        }
        else if (array instanceof Int8Array)
        {
            type = gl.BYTE;
        }
        else if (array instanceof Uint8Array)
        {
            type = gl.UNSIGNED_BYTE;
        }

        data.buffer = buffer;
        data.type = type;
        data.bytesPerElement = array.BYTES_PER_ELEMENT;
        data.version = attribute.version;
    },

    updateBuffer: function (buffer, attribute, bufferType)
    {
        var gl = this.renderer.gl;
        var array = attribute.array;
        var updateRange = attribute.updateRange;

        gl.bindBuffer(bufferType, buffer);

        if (attribute.dynamic === false)
        {
            gl.bufferData(bufferType, array, gl.STATIC_DRAW);
        }
        else if (updateRange.count === -1)
        {
            gl.bufferSubData(bufferType, 0, array);
        }
        else
        {
            gl.bufferSubData(bufferType, updateRange.offset * array.BYTES_PER_ELEMENT, array.subarray(updateRange.offset, updateRange.offset + updateRange.count));

            updateRange.count = -1;
        }
    },

    destroyGeometry: function (geometry)
    {
        var properties = geometry.sceneProperties;

        if (geometry.index !== null)
        {
            this.removeAttribute(properties, geometry.index);
        }

        var name;

        for (name in geometry.attributes)
        {
            this.removeAttribute(properties, geometry.attributes[name]);
        }

        for (var key in properties.vaos)
        {
            var vao = properties[key];

            if (vao)
            {
                this.vertexArrayBindings.disposeVAO(vao.object);
            }
        }

        properties.vaos = {};
        properties.created = false;
    }

});

module.exports = WebGLGeometry;
