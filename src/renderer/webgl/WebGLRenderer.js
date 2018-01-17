var Class = require('../../utils/Class');
var CONST = require('../../const');

var WebGLRenderer = new Class({

    initialize:

    function WebGLRenderer (game)
    {
        var renderer = this;
        var config = {
            backgroundColor: game.config.backgroundColor,
            contextCreation: {
                alpha: false,
                depth: false, // enable when 3D is added in the future
                antialias: true,
                premultipliedAlpha: true,
                stencil: true,
                preserveDrawingBuffer: false,
                failIfMajorPerformanceCaveat: false
            }
        };

        this.game = game;
        this.type = CONST.WEBGL;
        this.width = game.config.width * game.config.resolution;
        this.height = game.config.height * game.config.resolution;
        this.canvas = game.canvas;
        this.blendModes = [];
        this.contextLost = false;
        this.autoResize = false;
        this.pipelines = null;

        for (var i = 0; i <= 16; i++)
        {
            this.blendModes.push({ func: [ WebGLRenderingContext.ONE, WebGLRenderingContext.ONE_MINUS_SRC_ALPHA ], equation: WebGLRenderingContext.FUNC_ADD });
        }

        this.blendModes[1].func = [ WebGLRenderingContext.ONE,          WebGLRenderingContext.DST_ALPHA ];
        this.blendModes[2].func = [ WebGLRenderingContext.DST_COLOR,    WebGLRenderingContext.ONE_MINUS_SRC_ALPHA ];
        this.blendModes[3].func = [ WebGLRenderingContext.ONE,          WebGLRenderingContext.ONE_MINUS_SRC_COLOR ];

        // Intenal Renderer State (Textures, Framebuffers, Pipelines, Buffers, etc)
        this.currentTextures = new Array(16);
        this.currentFramebuffer = null;
        this.currentPipeline = null;
        this.currentVertexBuffer = null;
        this.currentIndexBuffer = null;
        this.currentBlendMode = CONST.BlendModes.NORMAL;
        this.currentScissorState = { enabled: false, x: 0, y: 0, w: 0, h: 0 };

        // Setup context lost and restore event listeners
        this.canvas.addEventListener('webglcontextlost', function (event) {
            renderer.contextLost = true;
            event.preventDefault();
        }, false);

        this.canvas.addEventListener('webglcontextrestored', function (event) {
            renderer.contextLost = false;
            renderer.init(config);
        }, false);

        // This are initialized post context creation
        this.gl = null;
        this.supportedExtensions = null;
        this.extensions = {};

        this.init(config);
    },

    init: function (config)
    {
        var canvas = this.canvas;
        var clearColor = config.backgroundColor;
        var gl = canvas.getContext('webgl', config.contextCreation) || canvas.getContext('experimental-webgl', config.contextCreation);
    
        if (!gl)
        {
            this.contextLost = true;
            throw new Error('This browser does not support WebGL. Try using the Canvas pipeline.');
        }

        // Load supported extensions
        this.supportedExtensions = gl.getSupportedExtensions();

        // Setup initial WebGL state
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.SCISSOR_TEST);
        gl.enable(gl.BLEND);
        gl.clearColor(clearColor.redGL, clearColor.greenGL, clearColor.blueGL, 1.0);

        // Initialize all textures to null
        for (var index = 0; index < this.currentTextures.length; ++index)
        {
            this.currentTextures[index] = null;
        }

        // Clear previous pipelines and reload default ones
        this.pipelines = {};

        this.setBlendMode(CONST.BlendModes.NORMAL);
        this.resize(this.width, this.height, this.game.config.resolution);
    
        return this;
    },

    resize: function (width, height, resolution)
    {
        var gl = this.gl;

        this.width = width * resolution;
        this.height = height * resolution;
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        if (this.autoResize)
        {
            this.canvas.style.width = (this.width / resolution) + 'px';
            this.canvas.style.height = (this.height / resolution) + 'px';
        }

        gl.viewport(0, 0, this.width, this.height);

        // Update all registered pipelines

        return this;
    },

    hasExtension: function (extensionName)
    {
        return this.supportedExtensions ? this.supportedExtensions.indexOf(extensionName) : false;
    },

    getExtension: function (extensionName)
    {
        if (!this.hasExtension(extensionName)) return null;

        if (!(extensionName in this.extensions))
        {
            this.extensions[extensionName] = this.gl.getExtension(extensionName);
        }

        return this.extensions[extensionName];
    },

    /* Renderer State Manipulation Functions */

    hasPipeline: function (pipelineName)
    {
        return (pipelineName in this.pipelines);
    },

    getPipeline: function (pipelineName)
    {
        if (this.hasPipeline(pipelineName)) return this.pipelines[pipelineName];
        return null;
    },

    removePipeline: function (pipelineName)
    {
        delete this.pipelines[pipelineName];
        return this;
    },

    addPipeline: function (pipelineName, pipelineInstance)
    {
        if (!this.hasPipeline(pipelineName)) this.pipelines[pipelineName] = pipelineInstance;
        else console.warn('Pipeline', pipelineName, ' already exists.');

        this.pipelines[pipelineName].resize(this.width, this.height, this.game.config.resolution);

        return this;
    },

    setBlendMode: function (blendModeId)
    {
        var gl = this.gl;
        var pipeline = this.currentPipeline;
        var blendMode = this.blendModes[blendModeId];

        if (blendModeId === CONST.BlendModes.SKIP_CHECK || !pipeline)
            return;

        if (this.currentBlendMode !== blendModeId)
        {
            pipeline.flush();

            gl.enable(gl.BLEND);
            gl.blendEquation(blendMode.equation);

            if (blendMode.func.length > 2)
            {
                gl.blendFuncSeparate(blendMode.func[0], blendMode.func[1], blendMode.func[2], blendMode.func[3]);
            }
            else
            {
                gl.blendFunc(blendMode.func[0], blendMode.func[1]);
            }

            this.currentBlendMode = blendModeId;
        }

        return this;
    },

    setTexture2D: function (texture, textureUnit)
    {
        var gl = this.gl;

        if (texture !== this.currentTextures[textureUnit])
        {
            gl.activeTexture(gl.TEXTURE0 + textureUnit);
            gl.bindTexture(gl.TEXTURE_2D, texture);

            this.currentTextures[textureUnit] = texture;
        }

        return this;
    },

    setFramebuffer: function (framebuffer)
    {
        var gl = this.gl;

        if (framebuffer !== this.currentFramebuffer)
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        }

        return this;
    },

    setVertexBuffer: function (vertexBuffer)
    {
        var gl = this.gl;

        if (vertexBuffer !== this.currentVertexBuffer)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        }

        return this;
    },

    setIndexBuffer: function (indexBuffer)
    {
        var gl = this.gl;

        if (indexBuffer !== this.currentIndexBuffer)
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        }

        return this;
    },

    /* Renderer Resource Creation Functions */

    createTexture2D: function ()
    {
        
    },

    createFramebuffer: function ()
    {

    },

    createProgram: function ()
    {

    },

    createVertexBuffer: function ()
    {

    },

    createIndexBuffer: function ()
    {
        
    }

});

module.exports = WebGLRenderer;
