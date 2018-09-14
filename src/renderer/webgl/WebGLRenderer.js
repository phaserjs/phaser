/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BaseCamera = require('../../cameras/2d/BaseCamera');
var Class = require('../../utils/Class');
var CONST = require('../../const');
var IsSizePowerOfTwo = require('../../math/pow2/IsSizePowerOfTwo');
var SpliceOne = require('../../utils/array/SpliceOne');
var TransformMatrix = require('../../gameobjects/components/TransformMatrix');
var Utils = require('./Utils');
var WebGLSnapshot = require('../snapshot/WebGLSnapshot');

// Default Pipelines
var BitmapMaskPipeline = require('./pipelines/BitmapMaskPipeline');
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
 * @property {number} encoder - [description]
 */

/**
 * @classdesc
 * WebGLRenderer is a class that contains the needed functionality to keep the
 * WebGLRenderingContext state clean. The main idea of the WebGLRenderer is to keep track of
 * any context change that happens for WebGL rendering inside of Phaser. This means
 * if raw webgl functions are called outside the WebGLRenderer of the Phaser WebGL
 * rendering ecosystem they might pollute the current WebGLRenderingContext state producing
 * unexpected behavior. It's recommended that WebGL interaction is done through
 * WebGLRenderer and/or WebGLPipeline.
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
            antialias: gameConfig.antialias,
            backgroundColor: gameConfig.backgroundColor,
            contextCreation: contextCreationConfig,
            resolution: gameConfig.resolution,
            autoResize: gameConfig.autoResize,
            roundPixels: gameConfig.roundPixels,
            maxTextures: gameConfig.maxTextures,
            maxTextureSize: gameConfig.maxTextureSize,
            batchSize: gameConfig.batchSize
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
         * Keeps track of any WebGLTexture created with the current WebGLRenderingContext
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
         * This object will store all pipelines created through addPipeline
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
         * Cached value for the last texture unit that was used
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentActiveTextureUnit
         * @type {integer}
         * @since 3.1.0
         */
        this.currentActiveTextureUnit = 0;

        /**
         * An array of the last texture handles that were bound to the WebGLRenderingContext
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentTextures
         * @type {array}
         * @since 3.0.0
         */
        this.currentTextures = new Array(16);

        /**
         * Current framebuffer in use
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentFramebuffer
         * @type {WebGLFramebuffer}
         * @default null
         * @since 3.0.0
         */
        this.currentFramebuffer = null;

        /**
         * Current WebGLPipeline in use
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentPipeline
         * @type {Phaser.Renderer.WebGL.WebGLPipeline}
         * @default null
         * @since 3.0.0
         */
        this.currentPipeline = null;

        /**
         * Current WebGLProgram in use
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentProgram
         * @type {WebGLProgram}
         * @default null
         * @since 3.0.0
         */
        this.currentProgram = null;

        /**
         * Current WebGLBuffer (Vertex buffer) in use
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentVertexBuffer
         * @type {WebGLBuffer}
         * @default null
         * @since 3.0.0
         */
        this.currentVertexBuffer = null;

        /**
         * Current WebGLBuffer (Index buffer) in use
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentIndexBuffer
         * @type {WebGLBuffer}
         * @default null
         * @since 3.0.0
         */
        this.currentIndexBuffer = null;

        /**
         * Current blend mode in use
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentBlendMode
         * @type {integer}
         * @since 3.0.0
         */
        this.currentBlendMode = Infinity;

        /**
         * Indicates if the the scissor state is enabled in WebGLRenderingContext
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentScissorEnabled
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.currentScissorEnabled = false;

        /**
         * Stores the current scissor data
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentScissor
         * @type {Uint32Array}
         * @since 3.0.0
         */
        // this.currentScissor = new Uint32Array([ 0, 0, this.width, this.height ]);
        this.currentScissor = null;

        /**
         * Stack of scissor data
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#scissorStack
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.scissorStack = [];

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

        // These are initialized post context creation

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
         * Array of strings that indicate which WebGL extensions are supported by the browser
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#supportedExtensions
         * @type {object}
         * @default null
         * @since 3.0.0
         */
        this.supportedExtensions = null;

        /**
         * Extensions loaded into the current context
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#extensions
         * @type {object}
         * @default {}
         * @since 3.0.0
         */
        this.extensions = {};

        /**
         * Stores the current WebGL component formats for further use
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#glFormats
         * @type {array}
         * @default []
         * @since 3.2.0
         */
        this.glFormats = [];

        /**
         * Stores the supported WebGL texture compression formats.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#compression
         * @type {array}
         * @since 3.8.0
         */
        this.compression = {
            ETC1: false,
            PVRTC: false,
            S3TC: false
        };

        /**
         * Cached drawing buffer height to reduce gl calls.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#drawingBufferHeight
         * @type {number}
         * @readOnly
         * @since 3.11.0
         */
        this.drawingBufferHeight = 0;

        /**
         * A blank 32x32 transparent texture, as used by the Graphics system where needed.
         * This is set in the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#blankTexture
         * @type {WebGLTexture}
         * @readOnly
         * @since 3.12.0
         */
        this.blankTexture = null;

        this.defaultCamera = new BaseCamera(0, 0, 0, 0);

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix3 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#_tempMatrix4
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix4 = new TransformMatrix();

        this.init(this.config);
    },

    /**
     * Creates a new WebGLRenderingContext and initializes all internal
     * state.
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
        var gl;
        var canvas = this.canvas;
        var clearColor = config.backgroundColor;

        //  Did they provide their own context?
        if (this.game.config.context)
        {
            gl = this.game.config.context;
        }
        else
        {
            gl = canvas.getContext('webgl', config.contextCreation) || canvas.getContext('experimental-webgl', config.contextCreation);
        }

        if (!gl || gl.isContextLost())
        {
            this.contextLost = true;

            throw new Error('WebGL unsupported');
        }

        this.gl = gl;

        //  Set it back into the Game, so developers can access it from there too
        this.game.context = gl;

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
        var exts = gl.getSupportedExtensions();

        if (!config.maxTextures)
        {
            config.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        }

        if (!config.maxTextureSize)
        {
            config.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        }

        var extString = 'WEBGL_compressed_texture_';
        var wkExtString = 'WEBKIT_' + extString;

        this.compression.ETC1 = gl.getExtension(extString + 'etc1') || gl.getExtension(wkExtString + 'etc1');
        this.compression.PVRTC = gl.getExtension(extString + 'pvrtc') || gl.getExtension(wkExtString + 'pvrtc');
        this.compression.S3TC = gl.getExtension(extString + 's3tc') || gl.getExtension(wkExtString + 's3tc');

        this.supportedExtensions = exts;

        // Setup initial WebGL state
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

        // gl.disable(gl.SCISSOR_TEST);

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
        this.addPipeline('BitmapMaskPipeline', new BitmapMaskPipeline({ game: this.game, renderer: this }));
        this.addPipeline('Light2D', new ForwardDiffuseLightPipeline({ game: this.game, renderer: this }));

        this.setBlendMode(CONST.BlendModes.NORMAL);

        this.resize(this.width, this.height);

        this.game.events.once('texturesready', this.boot, this);

        return this;
    },

    /**
     * Internal boot handler. Calls 'boot' on each pipeline.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#boot
     * @private
     * @since 3.11.0
     */
    boot: function ()
    {
        for (var pipelineName in this.pipelines)
        {
            this.pipelines[pipelineName].boot();
        }

        var blank = this.game.textures.getFrame('__DEFAULT');

        this.pipelines.TextureTintPipeline.currentFrame = blank;

        this.blankTexture = blank;
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

        //  Update all registered pipelines
        for (var pipelineName in pipelines)
        {
            pipelines[pipelineName].resize(width, height, resolution);
        }

        this.drawingBufferHeight = gl.drawingBufferHeight;

        this.defaultCamera.setSize(width, height);

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
     * Checks if a WebGL extension is supported
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#hasExtension
     * @since 3.0.0
     *
     * @param {string} extensionName - Name of the WebGL extension
     *
     * @return {boolean} [description]
     */
    hasExtension: function (extensionName)
    {
        return this.supportedExtensions ? this.supportedExtensions.indexOf(extensionName) : false;
    },

    /**
     * Loads a WebGL extension
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#getExtension
     * @since 3.0.0
     *
     * @param {string} extensionName - [description]
     *
     * @return {object} WebGL extension if the extension is supported
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
     * Flushes the current pipeline if the pipeline is bound
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
     * Checks if a pipeline is present in the current WebGLRenderer
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#hasPipeline
     * @since 3.0.0
     *
     * @param {string} pipelineName - Name of the pipeline
     *
     * @return {boolean} [description]
     */
    hasPipeline: function (pipelineName)
    {
        return (pipelineName in this.pipelines);
    },

    /**
     * Returns the pipeline by name if the pipeline exists
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
     * Removes a pipeline by name
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
     * Adds a pipeline instance into the collection of pipelines
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#addPipeline
     * @since 3.0.0
     *
     * @param {string} pipelineName - [description]
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipelineInstance - Pipeline instance must extend WebGLPipeline
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} The instance that was passed.
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
     * Pushes a new scissor state. This is used to set nested scissor states.
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

        var scissor = [ x, y, w, h ];

        scissorStack.push(scissor);

        this.setScissor(x, y, w, h);

        this.currentScissor = scissor;

        return scissor;
    },

    /**
     * Sets the current scissor state
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setScissor
     * @since 3.0.0
     */
    setScissor: function (x, y, w, h)
    {
        var gl = this.gl;

        var current = this.currentScissor;

        var cx = current[0];
        var cy = current[1];
        var cw = current[2];
        var ch = current[3];

        if (cx !== x || cy !== y || cw !== w || ch !== h)
        {
            this.flush();

            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor

            if (w > 0 && h > 0)
            {
                gl.scissor(x, (this.drawingBufferHeight - y - h), w, h);
            }
        }
    },

    /**
     * Pops the last scissor state and sets it.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#popScissor
     * @since 3.0.0
     */
    popScissor: function ()
    {
        var scissorStack = this.scissorStack;

        //  Remove the current scissor
        scissorStack.pop();

        //  Reset the previous scissor
        var scissor = scissorStack[scissorStack.length - 1];

        if (scissor)
        {
            this.setScissor(scissor[0], scissor[1], scissor[2], scissor[3]);
        }

        this.currentScissor = scissor;
    },

    /**
     * Binds a WebGLPipeline and sets it as the current pipeline to be used.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setPipeline
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipelineInstance - The pipeline instance to be activated.
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object that invoked this pipeline, if any.
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} The pipeline that was activated.
     */
    setPipeline: function (pipelineInstance, gameObject)
    {
        if (this.currentPipeline !== pipelineInstance ||
            this.currentPipeline.vertexBuffer !== this.currentVertexBuffer ||
            this.currentPipeline.program !== this.currentProgram)
        {
            this.flush();
            this.currentPipeline = pipelineInstance;
            this.currentPipeline.bind();
        }

        this.currentPipeline.onBind(gameObject);

        return this.currentPipeline;
    },

    /**
     * Sets the blend mode to the value given.
     *
     * If the current blend mode is different from the one given, the pipeline is flushed and the new
     * blend mode is enabled.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setBlendMode
     * @since 3.0.0
     *
     * @param {integer} blendModeId - The blend mode to be set. Can be a `BlendModes` const or an integer value.
     *
     * @return {boolean} `true` if the blend mode was changed as a result of this call, forcing a flush, otherwise `false`.
     */
    setBlendMode: function (blendModeId)
    {
        var gl = this.gl;
        var blendMode = this.blendModes[blendModeId];

        if (blendModeId !== CONST.BlendModes.SKIP_CHECK && this.currentBlendMode !== blendModeId)
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

            return true;
        }

        return false;
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
     * Sets the current active texture for texture unit zero to be a blank texture.
     * This only happens if there isn't a texture already in use by texture unit zero.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setBlankTexture
     * @private
     * @since 3.12.0
     *
     * @param {boolean} [force=false] - Force a blank texture set, regardless of what's already bound?
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    setBlankTexture: function (force)
    {
        if (force === undefined) { force = false; }

        if (force || this.currentActiveTextureUnit !== 0 || !this.currentTextures[0])
        {
            this.setTexture2D(this.blankTexture.glTexture, 0);
        }
    },

    /**
     * Binds a texture at a texture unit. If a texture is already
     * bound to that unit it will force a flush on the current pipeline.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setTexture2D
     * @since 3.0.0
     *
     * @param {WebGLTexture} texture - The WebGL texture that needs to be bound
     * @param {integer} textureUnit - The texture unit to which the texture will be bound
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
     * Binds a framebuffer. If there was another framebuffer already bound
     * it will force a pipeline flush.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFramebuffer
     * @since 3.0.0
     *
     * @param {WebGLFramebuffer} framebuffer - The framebuffer that needs to be bound.
     *
     * @return {Phaser.Renderer.WebGL.WebGLRenderer} This WebGL Renderer.
     */
    setFramebuffer: function (framebuffer)
    {
        var gl = this.gl;

        var width = this.width;
        var height = this.height;

        if (framebuffer !== this.currentFramebuffer)
        {
            if (framebuffer && framebuffer.renderTexture)
            {
                width = framebuffer.renderTexture.width;
                height = framebuffer.renderTexture.height;
            }
            else
            {
                this.flush();
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

            gl.viewport(0, 0, width, height);

            this.currentFramebuffer = framebuffer;
        }

        return this;
    },

    /**
     * Binds a program. If there was another program already bound
     * it will force a pipeline flush
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setProgram
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - The program that needs to be bound
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
     * Bounds a vertex buffer. If there is a vertex buffer already bound
     * it'll force a pipeline flush.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setVertexBuffer
     * @since 3.0.0
     *
     * @param {WebGLBuffer} vertexBuffer - The buffer that needs to be bound
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
     * Bounds a index buffer. If there is a index buffer already bound
     * it'll force a pipeline flush.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setIndexBuffer
     * @since 3.0.0
     *
     * @param {WebGLBuffer} indexBuffer - The buffer the needs to be bound
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
     * Creates a texture from an image source. If the source is not valid
     * it creates an empty texture
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

        if (scaleMode === CONST.ScaleModes.LINEAR && this.config.antialias)
        {
            filter = gl.LINEAR;
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
     * A wrapper for creating a WebGLTexture. If not pixel data is passed
     * it will create an empty texture.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createTexture2D
     * @since 3.0.0
     *
     * @param {integer} mipLevel - Mip level of the texture
     * @param {integer} minFilter - Filtering of the texture
     * @param {integer} magFilter - Filtering of the texture
     * @param {integer} wrapT - Wrapping mode of the texture
     * @param {integer} wrapS - Wrapping mode of the texture
     * @param {integer} format - Which format does the texture use
     * @param {object} pixels - pixel data
     * @param {integer} width - Width of the texture in pixels
     * @param {integer} height - Height of the texture in pixels
     * @param {boolean} pma - Does the texture have premultiplied alpha?
     *
     * @return {WebGLTexture} Raw WebGLTexture
     */
    createTexture2D: function (mipLevel, minFilter, magFilter, wrapT, wrapS, format, pixels, width, height, pma)
    {
        pma = (pma === undefined || pma === null) ? true : pma;

        var gl = this.gl;
        var texture = gl.createTexture();

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
     * Wrapper for creating WebGLFramebuffer.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createFramebuffer
     * @since 3.0.0
     *
     * @param {integer} width - Width in pixels of the framebuffer
     * @param {integer} height - Height in pixels of the framebuffer
     * @param {WebGLTexture} renderTexture - The color texture to where the color pixels are written
     * @param {boolean} addDepthStencilBuffer - Indicates if the current framebuffer support depth and stencil buffers
     *
     * @return {WebGLFramebuffer} Raw WebGLFramebuffer
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
     * Wrapper for creating a WebGLProgram
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createProgram
     * @since 3.0.0
     *
     * @param {string} vertexShader - Source to the vertex shader
     * @param {string} fragmentShader - Source to the fragment shader
     *
     * @return {WebGLProgram} Raw WebGLProgram
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
     * Wrapper for creating a vertex buffer.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createVertexBuffer
     * @since 3.0.0
     *
     * @param {ArrayBuffer} initialDataOrSize - It's either ArrayBuffer or an integer indicating the size of the vbo
     * @param {integer} bufferUsage - How the buffer is used. gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW
     *
     * @return {WebGLBuffer} Raw vertex buffer
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
     * Wrapper for creating a vertex buffer.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createIndexBuffer
     * @since 3.0.0
     *
     * @param {ArrayBuffer} initialDataOrSize - It's either ArrayBuffer or an integer indicating the size of the vbo
     * @param {integer} bufferUsage - How the buffer is used. gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW
     *
     * @return {WebGLBuffer} Raw index buffer
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
        var index = this.nativeTextures.indexOf(texture);

        if (index !== -1)
        {
            SpliceOne(this.nativeTextures, index);
        }

        this.gl.deleteTexture(texture);

        return this;
    },

    /**
     * Wrapper for deleting a raw WebGLFramebuffer
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
     * Wrapper for deleting a vertex or index buffer
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
     * Handles any clipping needed by the camera and renders the background
     * color if a color is visible.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#preRenderCamera
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    preRenderCamera: function (camera)
    {
        var cx = camera._cx;
        var cy = camera._cy;
        var cw = camera._cw;
        var ch = camera._ch;

        var TextureTintPipeline = this.pipelines.TextureTintPipeline;

        var color = camera.backgroundColor;

        if (camera.renderToTexture)
        {
            this.flush();

            this.pushScissor(cx, cy, cw, -ch);

            this.setFramebuffer(camera.framebuffer);

            var gl = this.gl;

            gl.clearColor(0, 0, 0, 0);

            gl.clear(gl.COLOR_BUFFER_BIT);

            TextureTintPipeline.projOrtho(cx, cw + cx, cy, ch + cy, -1000, 1000);

            if (color.alphaGL > 0)
            {
                TextureTintPipeline.drawFillRect(
                    cx, cy, cw + cx, ch + cy,
                    Utils.getTintFromFloats(color.redGL, color.greenGL, color.blueGL, 1),
                    color.alphaGL
                );
            }
            
            camera.emit('prerender', camera);
        }
        else if (color.alphaGL > 0)
        {
            this.pushScissor(cx, cy, cw, ch);

            TextureTintPipeline.drawFillRect(
                cx, cy, cw , ch,
                Utils.getTintFromFloats(color.redGL, color.greenGL, color.blueGL, 1),
                color.alphaGL
            );
        }
        else
        {
            this.pushScissor(cx, cy, cw, ch);
        }
    },

    /**
     * Renders the foreground camera effects like flash and fading.
     * It resets the current scissor state.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#postRenderCamera
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    postRenderCamera: function (camera)
    {
        var TextureTintPipeline = this.pipelines.TextureTintPipeline;

        camera.flashEffect.postRenderWebGL(TextureTintPipeline, Utils.getTintFromFloats);
        camera.fadeEffect.postRenderWebGL(TextureTintPipeline, Utils.getTintFromFloats);

        camera.dirty = false;

        this.popScissor();

        if (camera.renderToTexture)
        {
            TextureTintPipeline.flush();

            this.setFramebuffer(null);

            camera.emit('postrender', camera);

            TextureTintPipeline.projOrtho(0, TextureTintPipeline.width, TextureTintPipeline.height, 0, -1000.0, 1000.0);

            var getTint = Utils.getTintAppendFloatAlpha;

            var pipeline = (camera.pipeline) ? camera.pipeline : TextureTintPipeline;

            pipeline.batchTexture(
                camera,
                camera.glTexture,
                camera.width, camera.height,
                camera.x, camera.y,
                camera.width, camera.height,
                camera.zoom, camera.zoom,
                camera.rotation,
                camera.flipX, !camera.flipY,
                1, 1,
                0, 0,
                0, 0, camera.width, camera.height,
                getTint(camera._tintTL, camera._alphaTL),
                getTint(camera._tintTR, camera._alphaTR),
                getTint(camera._tintBL, camera._alphaBL),
                getTint(camera._tintBR, camera._alphaBR),
                (camera._isTinted && camera.tintFill),
                0, 0,
                this.defaultCamera,
                null
            );

            //  Force clear the current texture so that items next in the batch (like Graphics) don't try and use it
            this.setBlankTexture(true);
        }
    },

    /**
     * Clears the current vertex buffer and updates pipelines.
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

        if (this.config.clearBeforeRender)
        {
            gl.clearColor(color.redGL, color.greenGL, color.blueGL, color.alphaGL);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        }

        gl.enable(gl.SCISSOR_TEST);

        for (var key in pipelines)
        {
            pipelines[key].onPreRender();
        }

        //  TODO - Find a way to stop needing to create these arrays every frame
        //  and equally not need a huge array buffer created to hold them

        this.currentScissor = [ 0, 0, this.width, this.height ];
        this.scissorStack = [ this.currentScissor ];

        if (this.game.scene.customViewports)
        {
            gl.scissor(0, (this.drawingBufferHeight - this.height), this.width, this.height);
        }

        this.setPipeline(this.pipelines.TextureTintPipeline);
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

        //   Apply scissor for cam region + render background color, if not transparent
        this.preRenderCamera(camera);

        for (var i = 0; i < childCount; i++)
        {
            var child = list[i];

            if (!child.willRender(camera))
            {
                continue;
            }

            if (child.blendMode !== this.currentBlendMode)
            {
                this.setBlendMode(child.blendMode);
            }

            var mask = child.mask;

            if (mask)
            {
                mask.preRenderWebGL(this, child, camera);

                child.renderWebGL(this, child, interpolationPercentage, camera);

                mask.postRenderWebGL(this, child);
            }
            else
            {
                child.renderWebGL(this, child, interpolationPercentage, camera);
            }
        }

        this.setBlendMode(CONST.BlendModes.NORMAL);

        //  Applies camera effects and pops the scissor, if set
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

        this.flush();

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
     * @param {number} encoderOptions - [description]
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
     * Creates a WebGL Texture based on the given canvas element.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#canvasToTexture
     * @since 3.0.0
     *
     * @param {HTMLCanvasElement} srcCanvas - The Canvas element that will be used to populate the texture.
     * @param {WebGLTexture} [dstTexture] - Is this going to replace an existing texture? If so, pass it here.
     *
     * @return {WebGLTexture} The newly created WebGL Texture.
     */
    canvasToTexture: function (srcCanvas, dstTexture)
    {
        var gl = this.gl;

        if (dstTexture)
        {
            this.deleteTexture(dstTexture);
        }

        var wrapping = gl.CLAMP_TO_EDGE;

        if (IsSizePowerOfTwo(srcCanvas.width, srcCanvas.height))
        {
            wrapping = gl.REPEAT;
        }

        return this.createTexture2D(0, gl.NEAREST, gl.NEAREST, wrapping, wrapping, gl.RGBA, srcCanvas, srcCanvas.width, srcCanvas.height, true);
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
     * @return {this} This WebGL Renderer instance.
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
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {number} x - [description]
     *
     * @return {this} This WebGL Renderer instance.
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
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {this} This WebGL Renderer instance.
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
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} z - [description]
     *
     * @return {this} This WebGL Renderer instance.
     */
    setFloat3: function (program, name, x, y, z)
    {
        this.setProgram(program);

        this.gl.uniform3f(this.gl.getUniformLocation(program, name), x, y, z);

        return this;
    },

    /**
     * Sets uniform of a WebGLProgram
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFloat4
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {number} x - X component
     * @param {number} y - Y component
     * @param {number} z - Z component
     * @param {number} w - W component
     *
     * @return {this} This WebGL Renderer instance.
     */
    setFloat4: function (program, name, x, y, z, w)
    {
        this.setProgram(program);

        this.gl.uniform4f(this.gl.getUniformLocation(program, name), x, y, z, w);

        return this;
    },

    /**
     * Sets the value of a uniform variable in the given WebGLProgram.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFloat1v
     * @since 3.13.0
     *
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGL Renderer instance.
     */
    setFloat1v: function (program, name, arr)
    {
        this.setProgram(program);

        this.gl.uniform1fv(this.gl.getUniformLocation(program, name), arr);

        return this;
    },

    /**
     * Sets the value of a uniform variable in the given WebGLProgram.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFloat2v
     * @since 3.13.0
     *
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGL Renderer instance.
     */
    setFloat2v: function (program, name, arr)
    {
        this.setProgram(program);

        this.gl.uniform2fv(this.gl.getUniformLocation(program, name), arr);

        return this;
    },

    /**
     * Sets the value of a uniform variable in the given WebGLProgram.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFloat3v
     * @since 3.13.0
     *
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGL Renderer instance.
     */
    setFloat3v: function (program, name, arr)
    {
        this.setProgram(program);

        this.gl.uniform3fv(this.gl.getUniformLocation(program, name), arr);

        return this;
    },

    /**
     * Sets the value of a uniform variable in the given WebGLProgram.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFloat4v
     * @since 3.13.0
     *
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGL Renderer instance.
     */

    setFloat4v: function (program, name, arr)
    {
        this.setProgram(program);

        this.gl.uniform4fv(this.gl.getUniformLocation(program, name), arr);

        return this;
    },

    /**
     * Sets the value of a uniform variable in the given WebGLProgram.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setInt1
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {integer} x - [description]
     *
     * @return {this} This WebGL Renderer instance.
     */
    setInt1: function (program, name, x)
    {
        this.setProgram(program);

        this.gl.uniform1i(this.gl.getUniformLocation(program, name), x);

        return this;
    },

    /**
     * Sets the value of a uniform variable in the given WebGLProgram.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setInt2
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {integer} x - [description]
     * @param {integer} y - [description]
     *
     * @return {this} This WebGL Renderer instance.
     */
    setInt2: function (program, name, x, y)
    {
        this.setProgram(program);

        this.gl.uniform2i(this.gl.getUniformLocation(program, name), x, y);

        return this;
    },

    /**
     * Sets the value of a uniform variable in the given WebGLProgram.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setInt3
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {integer} x - [description]
     * @param {integer} y - [description]
     * @param {integer} z - [description]
     *
     * @return {this} This WebGL Renderer instance.
     */
    setInt3: function (program, name, x, y, z)
    {
        this.setProgram(program);

        this.gl.uniform3i(this.gl.getUniformLocation(program, name), x, y, z);

        return this;
    },

    /**
     * Sets the value of a uniform variable in the given WebGLProgram.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setInt4
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {integer} x - X component
     * @param {integer} y - Y component
     * @param {integer} z - Z component
     * @param {integer} w - W component
     *
     * @return {this} This WebGL Renderer instance.
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
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {boolean} transpose - [description]
     * @param {Float32Array} matrix - [description]
     *
     * @return {this} This WebGL Renderer instance.
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
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {boolean} transpose - [description]
     * @param {Float32Array} matrix - [description]
     *
     * @return {this} This WebGL Renderer instance.
     */
    setMatrix3: function (program, name, transpose, matrix)
    {
        this.setProgram(program);

        this.gl.uniformMatrix3fv(this.gl.getUniformLocation(program, name), transpose, matrix);

        return this;
    },

    /**
     * Sets uniform of a WebGLProgram
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setMatrix4
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - The target WebGLProgram from which the uniform location will be looked-up.
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {boolean} transpose - Is the matrix transposed
     * @param {Float32Array} matrix - Matrix data
     *
     * @return {this} This WebGL Renderer instance.
     */
    setMatrix4: function (program, name, transpose, matrix)
    {
        this.setProgram(program);

        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(program, name), transpose, matrix);

        return this;
    },

    /**
     * Returns the maximum number of texture units that can be used in a fragment shader.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#getMaxTextures
     * @since 3.8.0
     *
     * @return {integer} The maximum number of textures WebGL supports.
     */
    getMaxTextures: function ()
    {
        return this.config.maxTextures;
    },

    /**
     * Returns the largest texture size (either width or height) that can be created.
     * Note that VRAM may not allow a texture of any given size, it just expresses
     * hardware / driver support for a given size.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#getMaxTextureSize
     * @since 3.8.0
     *
     * @return {integer} The maximum supported texture size.
     */
    getMaxTextureSize: function ()
    {
        return this.config.maxTextureSize;
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

        delete this.gl;
        delete this.game;

        this.contextLost = true;
        this.extensions = {};
        this.nativeTextures.length = 0;
    }

});

module.exports = WebGLRenderer;
