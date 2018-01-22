var Class = require('../../utils/Class');
var Utils = require('./Utils');

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
        this.vertexBuffer = this.renderer.createVertexBuffer(this.vertexData.byteLength, this.gl.STREAM_DRAW);
        this.program = this.renderer.createProgram(config.vertShader, config.fragShader);
        this.attributes = config.attributes;
        this.vertexSize = config.vertexSize;
        this.topology = config.topology;
        this.currentProgram = this.program;
        this.bytes = new Uint8Array(this.vertexData);
        // This will store the amount of components of 32 bit length
        this.vertexComponentCount = Utils.getComponentCount(config.attributes.length);
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

        this.currentProgram = program;

        return this;
    },

    flush: function ()
    {
        var gl = this.gl;
        var vertexCount = this.vertexCount;
        var vertexBuffer = this.vertexBuffer;
        var vertexData = this.vertexData;
        var topology = this.topology;
        var vertexSize = this.vertexSize;

        if (vertexCount === 0) return;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));
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
    }

});

module.exports = WebGLPipeline;
