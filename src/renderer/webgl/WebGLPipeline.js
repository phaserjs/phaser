var Class = require('../../utils/Class');

var WebGLPipeline = new Class({

    initialize: 

    function WebGLPipeline(config)
    {
        this.name = config.name;
        this.game = config.game;
        this.view = config.game.canvas;
        this.resolution = config.game.config.resolution;
        this.width = config.game.config.width * this.resolution;
        this.height = config.game.config.height * this.resolution;
        this.gl = config.gl;
        this.vertexCount = 0;
        this.vertexCapacity = config.vertexCapacity;
        this.renderer = config.renderer;
        this.vertexData = new ArrayBuffer(config.vertexCapacity * config.vertexSize);
        this.vertexBuffer = renderer.createVertexBuffer(this.vertexData.byteLength, gl.STREAM_DRAW);
        this.program = renderer.createProgram(config.shader.vert, config.shader.frag);
        this.attributes = config.attributes;
        this.vertexSize = config.vertexSize;
        this.topology = config.topology;
    },

    shouldFlush: function ()
    {
        return this.vertexCount >= this.vertexCapacity;
    },

    resize: function (width, height, resolution)
    {
        this.width = width * resolution;
        this.height = height * resolution;
        return this;
    },

    bind: function (overrideProgram)
    {
        var gl = this.gl;
        var vertexBuffer = this.vertexBuffer;
        var attributes = this.attributes;
        var program = (!overrideProgram ? this.program : overrideProgram); 
        var renderer = this.renderer;
        var vertexSize = this.vertexSize;

        renderer.setProgram(program);
        renderer.setVertexBuffer(vertexBuffer);

        for (var index = 0; index < attributes.length; ++index)
        {
            var element = attributes[index];
            var location = gl.getAttribLocation(program, element.name);

            if (location >= 0)
            {
                gl.enableVertexAttribArray(location);
                gl.vertexAttribPointer(location, element.size, element.type, element.normalized, vertexSize, element.offset);
            }
            else
            {
                gl.disableVertexAttribArray(location);
            }
        }

        return this;
    },

    flush: function ()
    {
        var gl = this.gl;
        var vertexCount = this.vertexCount;
        var vertexBuffer = this.vertexBuffer;
        var vertexData = this.vertexData;
        var topology = this.topology;

        if (vertexCount === 0) return;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertexData);
        gl.drawArrays(topology, 0, vertexCount);

        this.vertexCount = 0;

        return this;
    },

    destroy: function ()
    {
        var gl = this.gl;

        gl.deleteShader(this.program);
        gl.deleteBuffer(this.vertexBuffer);

        this.program = null;
        this.vertexBuffer = null;

        return this;
    },

    setFloat1: function (name, x)
    {
        this.gl.uniform1f(this.gl.getUniformLocation(this.program, name), x);
        return this;
    },

    setFloat2: function (name, x, y)
    {
        this.gl.uniform2f(this.gl.getUniformLocation(this.program, name), x, y);
        return this;
    },

    setFloat3: function (name, x, y, z)
    {
        this.gl.uniform3f(this.gl.getUniformLocation(this.program, name), x, y, z);
        return this;
    },

    setFloat4: function (name, x, y, z, w)
    {
        this.gl.uniform4f(this.gl.getUniformLocation(this.program, name), x, y, z, w);
        return this;
    },

    setInt1: function (name, x)
    {
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), x);
        return this;
    },

    setInt2: function (name, x, y)
    {
        this.gl.uniform2i(this.gl.getUniformLocation(this.program, name), x, y);
        return this;
    },

    setInt3: function (name, x, y, z)
    {
        this.gl.uniform3i(this.gl.getUniformLocation(this.program, name), x, y, z);
        return this;
    },

    setInt4: function (name, x, y, z, w)
    {
        this.gl.uniform4i(this.gl.getUniformLocation(this.program, name), x, y, z, w);
        return this;
    },

    setMatrix2: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix2fv(this.gl.getUniformLocation(this.program, name), transpose, matrix);
        return this;
    },

    setMatrix3: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix2fv(this.gl.getUniformLocation(this.program, name), transpose, matrix);
        return this;
    },

    setMatrix4: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix2fv(this.gl.getUniformLocation(this.program, name), transpose, matrix);
        return this;
    }

});

module.exports = WebGLPipeline;
