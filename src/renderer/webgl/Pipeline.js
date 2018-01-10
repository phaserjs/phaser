var Class = require('../../utils/Class');

var Pipeline = new Class({

    initialize: 

    function Pipeline(config)
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
        this.currentRenderTarget = null;
        this.currentProgram = null;
        this.topology = config.topology;
        this.onBeginPassTarget = config.onBeginPassTarget || null;
        this.onEndPassTarget = config.onBeginPassTarget || null;
        this.onFlushTarget = config.onFlushTarget || null;
        this.onBindTarget = config.onBindTarget || null;
        this.onResizeTarget = config.onResizeTarget || null;
        this.onBeginPass = config.onBeginPass || function onBeginPassStub(pipeline) {};
        this.onEndPass = config.onEndPass || function onEndPassStub(pipeline) {};
        this.onFlush = config.onFlush || function onFlushStub(pipeline) {};
        this.onBind = config.onBind || function onBindStub(pipeline) {};
        this.onResize = config.onResize || function onResize(width, height, resolution) {};
        
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

    bind: function ()
    {
        this.onBind.call(this.onBindTarget, this);
        return this;
    },

    resize: function (width, height, resolution)
    {
        this.onResize.call(this.onResizeTarget, width, height, resolution);
        return this;
    },

    beginPass: function (renderTarget, program)
    {
        if (this.currentRenderTarget !== null ||
            this.currentProgram !== null)
        {
            this.flush();
            this.endPass();
        }

        this.currentRenderTarget = (renderTarget || null);
        this.currentProgram = (program || this.program);
        this.currentProgram.bind();
        this.vertexBuffer.bind();

        if (this.currentRenderTarget !== null)
        {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.currentRenderTarget.framebufferObject);
        }
        else
        {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }

        this.onBeginPass.call(this.onBeginPassTarget, this);

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

        this.onFlush.call(this.onFlushTarget, this);

        return this;
    },

    endPass: function ()
    {
        var renderTarget = this.currentRenderTarget;
        var program = this.currentProgram;

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this.currentRenderTarget = null;
        this.currentProgram = null;
        this.vertexCount = 0;

        this.onEndPass.call(this.onEndPassTarget, this);

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
    }

});

module.exports = Pipeline;
