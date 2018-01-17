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
        this.manager = config.manager;
        this.resources = config.manager.resourceManager;
        this.vertexData = new ArrayBuffer(config.vertexCapacity * config.vertexSize);
        this.vertexBuffer = null;
        this.program = null;
        this.vertexLayout = config.vertexLayout;
        this.vertexSize = config.vertexSize;
        this.topology = config.topology;
        
        // Initialize Shaders and Buffers
        {
            var gl = this.gl;
            var resources = this.resources;
            var vertexSize = this.vertexSize;
            var vertexLayout = this.vertexLayout;
            var program = resources.createShader(this.name, config.shader);
            var vertexBuffer = resources.createBuffer(gl.ARRAY_BUFFER, this.vertexData.byteLength, gl.STREAM_DRAW);

            for (var key in vertexLayout)
            {
                var element = vertexLayout[key];

                vertexBuffer.addAttribute(
                    program.getAttribLocation(key),
                    element.size,
                    element.type,
                    element.normalize,
                    vertexSize,
                    element.offset
                );
            }

            this.vertexBuffer = vertexBuffer;
            this.program = program;
        }
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
        // Check if we're using a custom program or 
        // the default one from the pipeline.
        if (!overrideProgram) this.program.bind();
        else overrideProgram.bind();

        this.vertexBuffer.bind();

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

        vertexBuffer.updateResource(vertexData, 0);
        gl.drawArrays(topology, 0, vertexCount);

        this.vertexCount = 0;

        return this;
    },

    destroy: function ()
    {
        var resources = this.resources;

        resources.deleteShader(this.program);
        resources.deleteBuffer(this.vertexBuffer);

        this.program = null;
        this.vertexBuffer = null;

        return this;
    },

    setFloat1: function (name, x)
    {
        this.gl.uniform1f(this.gl.getUniformLocation(this.program.program, name), x);
        return this;
    },

    setFloat2: function (name, x, y)
    {
        this.gl.uniform2f(this.gl.getUniformLocation(this.program.program, name), x, y);
        return this;
    },

    setFloat3: function (name, x, y, z)
    {
        this.gl.uniform3f(this.gl.getUniformLocation(this.program.program, name), x, y, z);
        return this;
    },

    setFloat4: function (name, x, y, z, w)
    {
        this.gl.uniform4f(this.gl.getUniformLocation(this.program.program, name), x, y, z, w);
        return this;
    },

    setInt1: function (name, x)
    {
        this.gl.uniform1i(this.gl.getUniformLocation(this.program.program, name), x);
        return this;
    },

    setInt2: function (name, x, y)
    {
        this.gl.uniform2i(this.gl.getUniformLocation(this.program.program, name), x, y);
        return this;
    },

    setInt3: function (name, x, y, z)
    {
        this.gl.uniform3i(this.gl.getUniformLocation(this.program.program, name), x, y, z);
        return this;
    },

    setInt4: function (name, x, y, z, w)
    {
        this.gl.uniform4i(this.gl.getUniformLocation(this.program.program, name), x, y, z, w);
        return this;
    },

    setMatrix2: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix2fv(this.gl.getUniformLocation(this.program.program, name), transpose, matrix);
        return this;
    },

    setMatrix3: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix2fv(this.gl.getUniformLocation(this.program.program, name), transpose, matrix);
        return this;
    },

    setMatrix4: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix2fv(this.gl.getUniformLocation(this.program.program, name), transpose, matrix);
        return this;
    }

});

module.exports = WebGLPipeline;
