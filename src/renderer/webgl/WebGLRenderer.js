/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../../const');
var IsSizePowerOfTwo = require('../../math/pow2/IsSizePowerOfTwo');
var Utils = require('./Utils');
var WebGLSnapshot = require('../snapshot/WebGLSnapshot');

// Default Pipelines
var BitmapMaskPipeline = require('./pipelines/BitmapMaskPipeline');
var FlatTintPipeline = require('./pipelines/FlatTintPipeline');
var ForwardDiffuseLightPipeline = require('./pipelines/ForwardDiffuseLightPipeline');
var TextureTintPipeline = require('./pipelines/TextureTintPipeline');

/**
 * @callback WebGLContextCallback
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - [description]
 */

/**
 * @typedef {object} SnapshotState
 *
 * @property {SnapshotCallback} callback - [description]
 * @property {string} type - [description]
 * @property {float} encoder - [description]
 */

/**
 * @classdesc
 * [description]
 *
 * @class WebGLRenderer
 * @memberOf Phaser.Renderer.WebGL
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - [description]
 */
var WebGLRenderer = new Class({

    initialize:

    function WebGLRenderer (game)
    {
        // eslint-disable-next-line consistent-this
        var renderer = this;

        var gameConfig = game.config;

        var contextCreationConfig = {
            alpha: gameConfig.transparent,
            depth: false, // enable when 3D is added in the future
            antialias: gameConfig.antialias,
            premultipliedAlpha: gameConfig.premultipliedAlpha,
            stencil: true,
            preserveDrawingBuffer: gameConfig.preserveDrawingBuffer,
            failIfMajorPerformanceCaveat: gameConfig.failIfMajorPerformanceCaveat,
            powerPreference: gameConfig.powerPreference
        };

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#config
         * @type {RendererConfig}
         * @since 3.0.0
         */
        this.config = {
            clearBeforeRender: gameConfig.clearBeforeRender,
            pixelArt: gameConfig.pixelArt,
            backgroundColor: gameConfig.backgroundColor,
            contextCreation: contextCreationConfig,
            resolution: gameConfig.resolution,
            autoResize: gameConfig.autoResize,
            roundPixels: gameConfig.roundPixels
        };

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#type
         * @type {integer}
         * @since 3.0.0
         */
        this.type = CONST.WEBGL;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = game.config.width;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = game.config.height;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#canvas
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.canvas = game.canvas;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#lostContextCallbacks
         * @type {WebGLContextCallback[]}
         * @since 3.0.0
         */
        this.lostContextCallbacks = [];

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#restoredContextCallbacks
         * @type {WebGLContextCallback[]}
         * @since 3.0.0
         */
        this.restoredContextCallbacks = [];

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#blendModes
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.blendModes = [];

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#nativeTextures
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.nativeTextures = [];

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#contextLost
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.contextLost = false;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#pipelines
         * @type {object}
         * @default null
         * @since 3.0.0
         */
        this.pipelines = null;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#snapshotState
         * @type {SnapshotState}
         * @since 3.0.0
         */
        this.snapshotState = {
            callback: null,
            type: null,
            encoder: null
        };

        // Internal Renderer State (Textures, Framebuffers, Pipelines, Buffers, etc)

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentActiveTextureUnit
         * @type {integer}
         * @since 3.1.0
         */
        this.currentActiveTextureUnit = 0;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentTextures
         * @type {array}
         * @since 3.0.0
         */
        this.currentTextures = new Array(16);

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentFramebuffer
         * @type {WebGLFramebuffer}
         * @default null
         * @since 3.0.0
         */
        this.currentFramebuffer = null;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentPipeline
         * @type {Phaser.Renderer.WebGL.WebGLPipeline}
         * @default null
         * @since 3.0.0
         */
        this.currentPipeline = null;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentProgram
         * @type {WebGLProgram}
         * @default null
         * @since 3.0.0
         */
        this.currentProgram = null;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentVertexBuffer
         * @type {WebGLBuffer}
         * @default null
         * @since 3.0.0
         */
        this.currentVertexBuffer = null;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentIndexBuffer
         * @type {WebGLBuffer}
         * @default null
         * @since 3.0.0
         */
        this.currentIndexBuffer = null;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentBlendMode
         * @type {integer}
         * @since 3.0.0
         */
        this.currentBlendMode = Infinity;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentScissorEnabled
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.currentScissorEnabled = false;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentScissor
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.currentScissor = new Uint32Array([ 0, 0, this.width, this.height ]);

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentScissorIdx
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.currentScissorIdx = 0;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#scissorStack
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.scissorStack = new Uint32Array(4 * 1000);

        // Setup context lost and restore event listeners

        this.canvas.addEventListener('webglcontextlost', function (event)
        {
            renderer.contextLost = true;
            event.preventDefault();

            for (var index = 0; index < renderer.lostContextCallbacks.length; ++index)
            {
                var callback = renderer.lostContextCallbacks[index];
                callback[0].call(callback[1], renderer);
            }
        }, false);

        this.canvas.addEventListener('webglcontextrestored', function ()
        {
            renderer.contextLost = false;
            renderer.init(renderer.config);
            for (var index = 0; index < renderer.restoredContextCallbacks.length; ++index)
            {
                var callback = renderer.restoredContextCallbacks[index];
                callback[0].call(callback[1], renderer);
            }
        }, false);

        // This are initialized post context creation

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#gl
         * @type {WebGLRenderingContext}
         * @default null
         * @since 3.0.0
         */
        this.gl = null;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#supportedExtensions
         * @type {object}
         * @default null
         * @since 3.0.0
         */
        this.supportedExtensions = null;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#extensions
         * @type {object}
         * @default {}
         * @since 3.0.0
         */
        this.extensions = {};

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#glFormats
         * @type {array}
         * @default []
         * @since 3.2.0
         */
        this.glFormats = [];

        this.init(this.config);
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#init
     * @since 3.0.0
     *
     * @param {object} config - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
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

        this.gl = gl;

        for (var i = 0; i <= 16; i++)
        {
            this.blendModes.push({ func: [ gl.ONE, gl.ONE_MINUS_SRC_ALPHA ], equation: gl.FUNC_ADD });
        }

        this.blendModes[1].func = [ gl.ONE, gl.DST_ALPHA ];
        this.blendModes[2].func = [ gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA ];
        this.blendModes[3].func = [ gl.ONE, gl.ONE_MINUS_SRC_COLOR ];

        this.glFormats[0] = gl.BYTE;
        this.glFormats[1] = gl.SHORT;
        this.glFormats[2] = gl.UNSIGNED_BYTE;
        this.glFormats[3] = gl.UNSIGNED_SHORT;
        this.glFormats[4] = gl.FLOAT;

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

        this.addPipeline('TextureTintPipeline', new TextureTintPipeline({ game: this.game, renderer: this }));
        this.addPipeline('FlatTintPipeline', new FlatTintPipeline({ game: this.game, renderer: this }));
        this.addPipeline('BitmapMaskPipeline', new BitmapMaskPipeline({ game: this.game, renderer: this }));
        this.addPipeline('Light2D', new ForwardDiffuseLightPipeline({ game: this.game, renderer: this }));

        this.setBlendMode(CONST.BlendModes.NORMAL);
        this.resize(this.width, this.height);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#resize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    resize: function (width, height)
    {
        var gl = this.gl;
        var pipelines = this.pipelines;
        var resolution = this.config.resolution;

        this.width = Math.floor(width * resolution);
        this.height = Math.floor(height * resolution);

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        if (this.config.autoResize)
        {
            this.canvas.style.width = (this.width / resolution) + 'px';
            this.canvas.style.height = (this.height / resolution) + 'px';
        }

        gl.viewport(0, 0, this.width, this.height);

        // Update all registered pipelines
        for (var pipelineName in pipelines)
        {
            pipelines[pipelineName].resize(width, height, resolution);
        }
                
        this.currentScissor.set([ 0, 0, this.width, this.height ]);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#onContextRestored
     * @since 3.0.0
     *
     * @param {WebGLContextCallback} callback - [description]
     * @param {object} target - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    onContextRestored: function (callback, target)
    {
        this.restoredContextCallbacks.push([ callback, target ]);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#onContextLost
     * @since 3.0.0
     *
     * @param {WebGLContextCallback} callback - [description]
     * @param {object} target - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    onContextLost: function (callback, target)
    {
        this.lostContextCallbacks.push([ callback, target ]);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#hasExtension
     * @since 3.0.0
     *
     * @param {string} extensionName - [description]
     *
     * @return {boolean} [description]
     */
    hasExtension: function (extensionName)
    {
        return this.supportedExtensions ? this.supportedExtensions.indexOf(extensionName) : false;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#getExtension
     * @since 3.0.0
     *
     * @param {string} extensionName - [description]
     *
     * @return {object} [description]
     */
    getExtension: function (extensionName)
    {
        if (!this.hasExtension(extensionName)) { return null; }

        if (!(extensionName in this.extensions))
        {
            this.extensions[extensionName] = this.gl.getExtension(extensionName);
        }

        return this.extensions[extensionName];
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#flush
     * @since 3.0.0
     */
    flush: function ()
    {
        if (this.currentPipeline)
        {
            this.currentPipeline.flush();
        }
    },

    /* Renderer State Manipulation Functions */

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#hasPipeline
     * @since 3.0.0
     *
     * @param {string} pipelineName - [description]
     *
     * @return {boolean} [description]
     */
    hasPipeline: function (pipelineName)
    {
        return (pipelineName in this.pipelines);
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#getPipeline
     * @since 3.0.0
     *
     * @param {string} pipelineName - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    getPipeline: function (pipelineName)
    {
        return (this.hasPipeline(pipelineName)) ? this.pipelines[pipelineName] : null;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#removePipeline
     * @since 3.0.0
     *
     * @param {string} pipelineName - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    removePipeline: function (pipelineName)
    {
        delete this.pipelines[pipelineName];

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#addPipeline
     * @since 3.0.0
     *
     * @param {string} pipelineName - [description]
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipelineInstance - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    addPipeline: function (pipelineName, pipelineInstance)
    {
        if (!this.hasPipeline(pipelineName))
        {
            this.pipelines[pipelineName] = pipelineInstance;
        }
        else
        {
            console.warn('Pipeline', pipelineName, ' already exists.');
        }

        pipelineInstance.name = pipelineName;

        this.pipelines[pipelineName].resize(this.width, this.height, this.config.resolution);

        return pipelineInstance;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setScissor
     * @since 3.0.0
     *
     * @param {integer} x - [description]
     * @param {integer} y - [description]
     * @param {integer} w - [description]
     * @param {integer} h - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setScissor: function (x, y, w, h)
    {
        var gl = this.gl;
        var currentScissor = this.currentScissor;
        var enabled = (x === 0 && y === 0 && w === gl.canvas.width && h === gl.canvas.height && w >= 0 && h >= 0);

        if (currentScissor[0] !== x ||
            currentScissor[1] !== y ||
            currentScissor[2] !== w ||
            currentScissor[3] !== h)
        {
            this.flush();
        }

        currentScissor[0] = x;
        currentScissor[1] = y;
        currentScissor[2] = w;
        currentScissor[3] = h;

        this.currentScissorEnabled = enabled;

        if (enabled)
        {
            gl.disable(gl.SCISSOR_TEST);

            return this;
        }

        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(x, (gl.drawingBufferHeight - y - h), w, h);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#pushScissor
     * @since 3.0.0
     *
     * @param {integer} x - [description]
     * @param {integer} y - [description]
     * @param {integer} w - [description]
     * @param {integer} h - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    pushScissor: function (x, y, w, h)
    {
        var scissorStack = this.scissorStack;
        var stackIndex = this.currentScissorIdx;
        var currentScissor = this.currentScissor;

        scissorStack[stackIndex + 0] = currentScissor[0];
        scissorStack[stackIndex + 1] = currentScissor[1];
        scissorStack[stackIndex + 2] = currentScissor[2];
        scissorStack[stackIndex + 3] = currentScissor[3];

        this.currentScissorIdx += 4;
        this.setScissor(x, y, w, h);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#popScissor
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    popScissor: function ()
    {
        var scissorStack = this.scissorStack;
        var stackIndex = this.currentScissorIdx - 4;

        var x = scissorStack[stackIndex + 0];
        var y = scissorStack[stackIndex + 1];
        var w = scissorStack[stackIndex + 2];
        var h = scissorStack[stackIndex + 3];

        this.currentScissorIdx = stackIndex;
        this.setScissor(x, y, w, h);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setPipeline
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipelineInstance - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setPipeline: function (pipelineInstance)
    {
        if (this.currentPipeline !== pipelineInstance ||
            this.currentPipeline.vertexBuffer !== this.currentVertexBuffer ||
            this.currentPipeline.program !== this.currentProgram)
        {
            this.flush();
            this.currentPipeline = pipelineInstance;
            this.currentPipeline.bind();
        }

        this.currentPipeline.onBind();

        return this.currentPipeline;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setBlendMode
     * @since 3.0.0
     *
     * @param {integer} blendModeId - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setBlendMode: function (blendModeId)
    {
        var gl = this.gl;
        var blendMode = this.blendModes[blendModeId];

        if (blendModeId !== CONST.BlendModes.SKIP_CHECK &&
            this.currentBlendMode !== blendModeId)
        {
            this.flush();

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

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#addBlendMode
     * @since 3.0.0
     *
     * @param {function} func - [description]
     * @param {function} equation - [description]
     *
     * @return {integer} [description]
     */
    addBlendMode: function (func, equation)
    {
        var index = this.blendModes.push({ func: func, equation: equation });

        return index - 1;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#updateBlendMode
     * @since 3.0.0
     *
     * @param {integer} index - [description]
     * @param {function} func - [description]
     * @param {function} equation - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    updateBlendMode: function (index, func, equation)
    {
        if (this.blendModes[index])
        {
            this.blendModes[index].func = func;

            if (equation)
            {
                this.blendModes[index].equation = equation;
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#removeBlendMode
     * @since 3.0.0
     *
     * @param {integer} index - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    removeBlendMode: function (index)
    {
        if (index > 16 && this.blendModes[index])
        {
            this.blendModes.splice(index, 1);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setTexture2D
     * @since 3.0.0
     *
     * @param {WebGLTexture} texture - [description]
     * @param {integer} textureUnit - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    setTexture2D: function (texture, textureUnit)
    {
        var gl = this.gl;

        if (texture !== this.currentTextures[textureUnit])
        {
            this.flush();

            if (this.currentActiveTextureUnit !== textureUnit)
            {
                gl.activeTexture(gl.TEXTURE0 + textureUnit);

                this.currentActiveTextureUnit = textureUnit;
            }

            gl.bindTexture(gl.TEXTURE_2D, texture);

            this.currentTextures[textureUnit] = texture;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFramebuffer
     * @since 3.0.0
     *
     * @param {WebGLFramebuffer} framebuffer - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    setFramebuffer: function (framebuffer)
    {
        var gl = this.gl;

        if (framebuffer !== this.currentFramebuffer)
        {
            this.flush();

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

            this.currentFramebuffer = framebuffer;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setProgram
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    setProgram: function (program)
    {
        var gl = this.gl;

        if (program !== this.currentProgram)
        {
            this.flush();

            gl.useProgram(program);

            this.currentProgram = program;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setVertexBuffer
     * @since 3.0.0
     *
     * @param {WebGLBuffer} vertexBuffer - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    setVertexBuffer: function (vertexBuffer)
    {
        var gl = this.gl;

        if (vertexBuffer !== this.currentVertexBuffer)
        {
            this.flush();

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

            this.currentVertexBuffer = vertexBuffer;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setIndexBuffer
     * @since 3.0.0
     *
     * @param {WebGLBuffer} indexBuffer - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    setIndexBuffer: function (indexBuffer)
    {
        var gl = this.gl;

        if (indexBuffer !== this.currentIndexBuffer)
        {
            this.flush();

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

            this.currentIndexBuffer = indexBuffer;
        }

        return this;
    },

    /* Renderer Resource Creation Functions */

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createTextureFromSource
     * @since 3.0.0
     *
     * @param {object} source - [description]
     * @param {integer} width - [description]
     * @param {integer} height - [description]
     * @param {integer} scaleMode - [description]
     *
     * @return {WebGLTexture} [description]
     */
    createTextureFromSource: function (source, width, height, scaleMode)
    {
        var gl = this.gl;
        var filter = gl.NEAREST;
        var wrap = gl.CLAMP_TO_EDGE;
        var texture = null;

        width = source ? source.width : width;
        height = source ? source.height : height;

        if (IsSizePowerOfTwo(width, height))
        {
            wrap = gl.REPEAT;
        }

        if (scaleMode === CONST.ScaleModes.LINEAR)
        {
            filter = gl.LINEAR;
        }
        else if (scaleMode === CONST.ScaleModes.NEAREST || this.config.pixelArt)
        {
            filter = gl.NEAREST;
        }

        if (!source && typeof width === 'number' && typeof height === 'number')
        {
            texture = this.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
        }
        else
        {
            texture = this.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, source);
        }

        return texture;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createTexture2D
     * @since 3.0.0
     *
     * @param {integer} mipLevel - [description]
     * @param {integer} minFilter - [description]
     * @param {integer} magFilter - [description]
     * @param {integer} wrapT - [description]
     * @param {integer} wrapS - [description]
     * @param {integer} format - [description]
     * @param {object} pixels - [description]
     * @param {integer} width - [description]
     * @param {integer} height - [description]
     * @param {boolean} pma - [description]
     *
     * @return {WebGLTexture} [description]
     */
    createTexture2D: function (mipLevel, minFilter, magFilter, wrapT, wrapS, format, pixels, width, height, pma)
    {
        var gl = this.gl;
        var texture = gl.createTexture();

        pma = (pma === undefined || pma === null) ? true : pma;

        this.setTexture2D(texture, 0);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, pma);

        if (pixels === null || pixels === undefined)
        {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, width, height, 0, format, gl.UNSIGNED_BYTE, null);
        }
        else
        {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, format, gl.UNSIGNED_BYTE, pixels);
            width = pixels.width;
            height = pixels.height;
        }

        this.setTexture2D(null, 0);

        texture.isAlphaPremultiplied = pma;
        texture.isRenderTexture = false;
        texture.width = width;
        texture.height = height;

        this.nativeTextures.push(texture);

        return texture;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createFramebuffer
     * @since 3.0.0
     *
     * @param {integer} width - [description]
     * @param {integer} height - [description]
     * @param {WebGLFramebuffer} renderTexture - [description]
     * @param {boolean} addDepthStencilBuffer - [description]
     *
     * @return {WebGLFramebuffer} [description]
     */
    createFramebuffer: function (width, height, renderTexture, addDepthStencilBuffer)
    {
        var gl = this.gl;
        var framebuffer = gl.createFramebuffer();
        var complete = 0;

        this.setFramebuffer(framebuffer);

        if (addDepthStencilBuffer)
        {
            var depthStencilBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencilBuffer);
        }

        renderTexture.isRenderTexture = true;
        renderTexture.isAlphaPremultiplied = false;

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture, 0);

        complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (complete !== gl.FRAMEBUFFER_COMPLETE)
        {
            var errors = {
                36054: 'Incomplete Attachment',
                36055: 'Missing Attachment',
                36057: 'Incomplete Dimensions',
                36061: 'Framebuffer Unsupported'
            };

            throw new Error('Framebuffer incomplete. Framebuffer status: ' + errors[complete]);
        }

        framebuffer.renderTexture = renderTexture;

        this.setFramebuffer(null);

        return framebuffer;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createProgram
     * @since 3.0.0
     *
     * @param {string} vertexShader - [description]
     * @param {string} fragmentShader - [description]
     *
     * @return {WebGLProgram} [description]
     */
    createProgram: function (vertexShader, fragmentShader)
    {
        var gl = this.gl;
        var program = gl.createProgram();
        var vs = gl.createShader(gl.VERTEX_SHADER);
        var fs = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vs, vertexShader);
        gl.shaderSource(fs, fragmentShader);
        gl.compileShader(vs);
        gl.compileShader(fs);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
        {
            throw new Error('Failed to compile Vertex Shader:\n' + gl.getShaderInfoLog(vs));
        }
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            throw new Error('Failed to compile Fragment Shader:\n' + gl.getShaderInfoLog(fs));
        }

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            throw new Error('Failed to link program:\n' + gl.getProgramInfoLog(program));
        }

        return program;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createVertexBuffer
     * @since 3.0.0
     *
     * @param {ArrayBuffer} initialDataOrSize - [description]
     * @param {integer} bufferUsage - [description]
     *
     * @return {WebGLBuffer} [description]
     */
    createVertexBuffer: function (initialDataOrSize, bufferUsage)
    {
        var gl = this.gl;
        var vertexBuffer = gl.createBuffer();

        this.setVertexBuffer(vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, initialDataOrSize, bufferUsage);

        this.setVertexBuffer(null);

        return vertexBuffer;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createIndexBuffer
     * @since 3.0.0
     *
     * @param {ArrayBuffer} initialDataOrSize - [description]
     * @param {integer} bufferUsage - [description]
     *
     * @return {WebGLBuffer} [description]
     */
    createIndexBuffer: function (initialDataOrSize, bufferUsage)
    {
        var gl = this.gl;
        var indexBuffer = gl.createBuffer();

        this.setIndexBuffer(indexBuffer);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, initialDataOrSize, bufferUsage);

        this.setIndexBuffer(null);

        return indexBuffer;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteTexture
     * @since 3.0.0
     *
     * @param {WebGLTexture} texture - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    deleteTexture: function (texture)
    {
        this.gl.deleteTexture(texture);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteFramebuffer
     * @since 3.0.0
     *
     * @param {WebGLFramebuffer} framebuffer - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    deleteFramebuffer: function (framebuffer)
    {
        this.gl.deleteFramebuffer(framebuffer);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteProgram
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    deleteProgram: function (program)
    {
        this.gl.deleteProgram(program);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteBuffer
     * @since 3.0.0
     *
     * @param {WebGLBuffer} vertexBuffer - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    deleteBuffer: function (buffer)
    {
        this.gl.deleteBuffer(buffer);

        return this;
    },

    /* Rendering Functions */

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#preRenderCamera
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    preRenderCamera: function (camera)
    {
        var resolution = this.config.resolution;

        var cx = Math.floor(camera.x * resolution);
        var cy = Math.floor(camera.y * resolution);
        var cw = Math.floor(camera.width * resolution);
        var ch = Math.floor(camera.height * resolution);

        this.pushScissor(cx, cy, cw, ch);

        if (camera.backgroundColor.alphaGL > 0)
        {
            var color = camera.backgroundColor;
            var FlatTintPipeline = this.pipelines.FlatTintPipeline;

            FlatTintPipeline.batchFillRect(
                0, 0, 1, 1, 0,
                camera.x, camera.y, camera.width, camera.height,
                Utils.getTintFromFloats(color.redGL, color.greenGL, color.blueGL, 1.0),
                color.alphaGL,
                1, 0, 0, 1, 0, 0,
                [ 1, 0, 0, 1, 0, 0 ]
            );

            FlatTintPipeline.flush();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#postRenderCamera
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    postRenderCamera: function (camera)
    {
        if (camera._fadeAlpha > 0 || camera._flashAlpha > 0)
        {
            var FlatTintPipeline = this.pipelines.FlatTintPipeline;

            // Fade
            FlatTintPipeline.batchFillRect(
                0, 0, 1, 1, 0,
                camera.x, camera.y, camera.width, camera.height,
                Utils.getTintFromFloats(camera._fadeRed, camera._fadeGreen, camera._fadeBlue, 1.0),
                camera._fadeAlpha,
                1, 0, 0, 1, 0, 0,
                [ 1, 0, 0, 1, 0, 0 ]
            );

            // Flash
            FlatTintPipeline.batchFillRect(
                0, 0, 1, 1, 0,
                camera.x, camera.y, camera.width, camera.height,
                Utils.getTintFromFloats(camera._flashRed, camera._flashGreen, camera._flashBlue, 1.0),
                camera._flashAlpha,
                1, 0, 0, 1, 0, 0,
                [ 1, 0, 0, 1, 0, 0 ]
            );

            FlatTintPipeline.flush();
        }

        this.popScissor();
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#preRender
     * @since 3.0.0
     */
    preRender: function ()
    {
        if (this.contextLost) { return; }

        var gl = this.gl;
        var color = this.config.backgroundColor;
        var pipelines = this.pipelines;

        // Bind custom framebuffer here
        gl.clearColor(color.redGL, color.greenGL, color.blueGL, color.alphaGL);

        if (this.config.clearBeforeRender)
        {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        }

        for (var key in pipelines)
        {
            pipelines[key].onPreRender();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#render
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     * @param {Phaser.GameObjects.GameObject} children - [description]
     * @param {number} interpolationPercentage - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    render: function (scene, children, interpolationPercentage, camera)
    {
        if (this.contextLost) { return; }

        var list = children.list;
        var childCount = list.length;
        var pipelines = this.pipelines;

        for (var key in pipelines)
        {
            pipelines[key].onRender(scene, camera);
        }

        this.preRenderCamera(camera);

        for (var index = 0; index < childCount; ++index)
        {
            var child = list[index];

            if (!child.willRender())
            {
                continue;
            }

            if (child.blendMode !== this.currentBlendMode)
            {
                this.setBlendMode(child.blendMode);
            }

            if (child.mask)
            {
                child.mask.preRenderWebGL(this, child, camera);
            }

            child.renderWebGL(this, child, interpolationPercentage, camera);

            if (child.mask)
            {
                child.mask.postRenderWebGL(this, child);
            }
        }

        this.flush();
        this.setBlendMode(CONST.BlendModes.NORMAL);
        this.postRenderCamera(camera);
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#postRender
     * @since 3.0.0
     */
    postRender: function ()
    {
        if (this.contextLost) { return; }

        // Unbind custom framebuffer here

        if (this.snapshotState.callback)
        {
            this.snapshotState.callback(WebGLSnapshot(this.canvas, this.snapshotState.type, this.snapshotState.encoder));
            this.snapshotState.callback = null;
        }

        var pipelines = this.pipelines;

        for (var key in pipelines)
        {
            pipelines[key].onPostRender();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#snapshot
     * @since 3.0.0
     *
     * @param {SnapshotCallback} callback - [description]
     * @param {string} type - [description]
     * @param {float} encoderOptions - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    snapshot: function (callback, type, encoderOptions)
    {
        this.snapshotState.callback = callback;
        this.snapshotState.type = type;
        this.snapshotState.encoder = encoderOptions;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#canvasToTexture
     * @since 3.0.0
     *
     * @param {HTMLCanvasElement} srcCanvas - [description]
     * @param {WebGLTexture} dstTexture - [description]
     * @param {boolean} shouldReallocate - [description]
     * @param {integer} scaleMode - [description]
     *
     * @return {WebGLTexture} [description]
     */
    canvasToTexture: function (srcCanvas, dstTexture)
    {
        var gl = this.gl;

        if (!dstTexture)
        {
            var wrapping = gl.CLAMP_TO_EDGE;

            if (IsSizePowerOfTwo(srcCanvas.width, srcCanvas.height))
            {
                wrapping = gl.REPEAT;
            }

            dstTexture = this.createTexture2D(0, gl.NEAREST, gl.NEAREST, wrapping, wrapping, gl.RGBA, srcCanvas, srcCanvas.width, srcCanvas.height, true);
        }
        else
        {
            this.setTexture2D(dstTexture, 0);

            // if (!shouldReallocate && dstTexture.width >= srcCanvas.width || dstTexture.height >= srcCanvas.height)
            // {
            //    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, srcCanvas.width, srcCanvas.height, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);
            // }
            // else
            {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);
                dstTexture.width = srcCanvas.width;
                dstTexture.height = srcCanvas.height;
            }

            this.setTexture2D(null, 0);
        }

        return dstTexture;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setTextureFilter
     * @since 3.0.0
     *
     * @param {integer} texture - [description]
     * @param {integer} filter - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setTextureFilter: function (texture, filter)
    {
        var gl = this.gl;
        var glFilter = [ gl.LINEAR, gl.NEAREST ][filter];

        this.setTexture2D(texture, 0);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter);

        this.setTexture2D(null, 0);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFloat1
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     * @param {string} name - [description]
     * @param {float} x - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setFloat1: function (program, name, x)
    {
        this.setProgram(program);

        this.gl.uniform1f(this.gl.getUniformLocation(program, name), x);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFloat2
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     * @param {string} name - [description]
     * @param {float} x - [description]
     * @param {float} y - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setFloat2: function (program, name, x, y)
    {
        this.setProgram(program);

        this.gl.uniform2f(this.gl.getUniformLocation(program, name), x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFloat3
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     * @param {string} name - [description]
     * @param {float} x - [description]
     * @param {float} y - [description]
     * @param {float} z - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setFloat3: function (program, name, x, y, z)
    {
        this.setProgram(program);

        this.gl.uniform3f(this.gl.getUniformLocation(program, name), x, y, z);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFloat4
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     * @param {string} name - [description]
     * @param {float} x - [description]
     * @param {float} y - [description]
     * @param {float} z - [description]
     * @param {float} w - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setFloat4: function (program, name, x, y, z, w)
    {
        this.setProgram(program);

        this.gl.uniform4f(this.gl.getUniformLocation(program, name), x, y, z, w);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setInt1
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     * @param {string} name - [description]
     * @param {integer} x - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setInt1: function (program, name, x)
    {
        this.setProgram(program);

        this.gl.uniform1i(this.gl.getUniformLocation(program, name), x);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setInt2
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     * @param {string} name - [description]
     * @param {integer} x - [description]
     * @param {integer} y - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setInt2: function (program, name, x, y)
    {
        this.setProgram(program);

        this.gl.uniform2i(this.gl.getUniformLocation(program, name), x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setInt3
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     * @param {string} name - [description]
     * @param {integer} x - [description]
     * @param {integer} y - [description]
     * @param {integer} z - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setInt3: function (program, name, x, y, z)
    {
        this.setProgram(program);

        this.gl.uniform3i(this.gl.getUniformLocation(program, name), x, y, z);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setInt4
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     * @param {string} name - [description]
     * @param {integer} x - [description]
     * @param {integer} y - [description]
     * @param {integer} z - [description]
     * @param {integer} w - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setInt4: function (program, name, x, y, z, w)
    {
        this.setProgram(program);

        this.gl.uniform4i(this.gl.getUniformLocation(program, name), x, y, z, w);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setMatrix2
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     * @param {string} name - [description]
     * @param {boolean} transpose - [description]
     * @param {Float32Array} matrix - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setMatrix2: function (program, name, transpose, matrix)
    {
        this.setProgram(program);

        this.gl.uniformMatrix2fv(this.gl.getUniformLocation(program, name), transpose, matrix);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setMatrix3
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     * @param {string} name - [description]
     * @param {boolean} transpose - [description]
     * @param {Float32Array} matrix - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setMatrix3: function (program, name, transpose, matrix)
    {
        this.setProgram(program);

        this.gl.uniformMatrix3fv(this.gl.getUniformLocation(program, name), transpose, matrix);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setMatrix4
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - [description]
     * @param {string} name - [description]
     * @param {boolean} transpose - [description]
     * @param {Float32Array} matrix - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} [description]
     */
    setMatrix4: function (program, name, transpose, matrix)
    {
        this.setProgram(program);

        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(program, name), transpose, matrix);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        //  Clear-up anything that should be cleared :)
        for (var key in this.pipelines)
        {
            this.pipelines[key].destroy();
            delete this.pipelines[key];
        }

        for (var index = 0; index < this.nativeTextures.length; ++index)
        {
            this.deleteTexture(this.nativeTextures[index]);
            delete this.nativeTextures[index];
        }

        if (this.hasExtension('WEBGL_lose_context'))
        {
            this.getExtension('WEBGL_lose_context').loseContext();
        }

        delete this.gl;
        delete this.game;

        this.contextLost = true;
        this.extensions = {};
        this.nativeTextures.length = 0;
    }

});

module.exports = WebGLRenderer;
