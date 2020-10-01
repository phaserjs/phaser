/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

var WebGLVertexArray = new Class({

    initialize:

    function WebGLVertexArray (renderer)
    {
        this.renderer = renderer;
        this.vaoExt = renderer.coreRenderer.vaoExtension;
        this.currentProgram;
    },

    setup: function (geometry, program)
    {
        var geometryProperties = geometry.properties;

        if (this.vaoExt)
        {
            var vao;

            if (!geometryProperties.vaos[program.id])
            {
                vao = geometryProperties.vaos[program.id] = { version: -1, object: this.createVAO() };
            }
            else
            {
                vao = geometryProperties.vaos[program.id];
            }

            this.bindVAO(vao.object);

            if (vao.version !== geometry.version)
            {
                this.setupVertexAttributes(program, geometry);

                vao.version = geometry.version;
            }
        }
        else
        {
            var geometryProgram = program.id + '_' + geometry.id + '_' + geometry.version;

            if (geometryProgram !== this.currentProgram)
            {
                this.setupVertexAttributes(program, geometry);

                this.currentProgram = geometryProgram;
            }
        }
    },

    createVAO: function ()
    {
        if (this.vaoExt)
        {
            return this.vaoExt.createVertexArrayOES();
        }
        return null;
    },

    bindVAO: function (vao)
    {
        if (this.vaoExt)
        {
            return this.vaoExt.bindVertexArrayOES(vao);
        }
    },

    resetBinding: function ()
    {
        if (this.vaoExt)
        {
            this.vaoExt.bindVertexArrayOES(null);
        }
    },

    disposeVAO: function (vao)
    {
        if (this.vaoExt)
        {
            this.vaoExt.deleteVertexArrayOES(vao);
        }
    },

    setupVertexAttributes: function (program, geometry)
    {
        var gl = this.renderer.gl;
        var attributes = program.attributes;
        var properties = geometry.properties;

        for (var key in attributes)
        {
            var programAttribute = attributes[key];
            var geometryAttribute = geometry.getAttribute(key);

            if (geometryAttribute)
            {
                var normalized = geometryAttribute.normalized;
                var size = geometryAttribute.size;

                if (programAttribute.count !== size)
                {
                    console.warn('Attribute size mis-match: ' + key + ' : ' + programAttribute.count + ' : ' + size);
                }

                var attribute;

                if (geometryAttribute.isInterleavedBufferAttribute)
                {
                    attribute = properties.attributes[geometryAttribute.data];
                }
                else
                {
                    attribute = properties.attributes[geometryAttribute];
                }

                var buffer = attribute.buffer;
                var type = attribute.type;
                var bytesPerElement = attribute.bytesPerElement;

                if (geometryAttribute.isInterleavedBufferAttribute)
                {
                    var data = geometryAttribute.data;
                    var stride = data.stride;
                    var offset = geometryAttribute.offset;

                    gl.enableVertexAttribArray(programAttribute.location);

                    if (data && data.isInstancedInterleavedBuffer)
                    {
                        if (this.renderer.coreRenderer.instancedArraysExtension)
                        {
                            this.renderer.coreRenderer.instancedArraysExtension.vertexAttribDivisorANGLE(programAttribute.location, data.meshPerAttribute);
                        }

                        if (geometry.maxInstancedCount === undefined)
                        {
                            geometry.maxInstancedCount = data.meshPerAttribute * data.count;
                        }
                    }

                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.vertexAttribPointer(programAttribute.location, programAttribute.count, type, normalized, bytesPerElement * stride, bytesPerElement * offset);
                }
                else
                {
                    gl.enableVertexAttribArray(programAttribute.location);

                    if (geometryAttribute.isInstancedBufferAttribute)
                    {
                        if (this.renderer.coreRenderer.instancedArraysExtension)
                        {
                            this.renderer.coreRenderer.instancedArraysExtension.vertexAttribDivisorANGLE(programAttribute.location, geometryAttribute.meshPerAttribute);
                        }

                        if (geometry.maxInstancedCount === undefined)
                        {
                            geometry.maxInstancedCount = geometryAttribute.meshPerAttribute * geometryAttribute.count;
                        }
                    }

                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.vertexAttribPointer(programAttribute.location, programAttribute.count, type, normalized, 0, 0);
                }
            }
        }

        if (geometry.index)
        {
            var indexProperty = properties.attributes[geometry.index];

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexProperty.buffer);
        }
    }

});

module.exports = WebGLVertexArray;
