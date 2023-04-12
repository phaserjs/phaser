/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArrayRemove = require('../../utils/array/Remove');
var CameraEvents = require('../../cameras/2d/events');
var Class = require('../../utils/Class');
var CONST = require('../../const');
var EventEmitter = require('eventemitter3');
var Events = require('../events');
var IsSizePowerOfTwo = require('../../math/pow2/IsSizePowerOfTwo');
var Matrix4 = require('../../math/Matrix4');
var NOOP = require('../../utils/NOOP');
var PipelineManager = require('./PipelineManager');
var RenderTarget = require('./RenderTarget');
var ScaleEvents = require('../../scale/events');
var TextureEvents = require('../../textures/events');
var Utils = require('./Utils');
var WebGLSnapshot = require('../snapshot/WebGLSnapshot');

var DEBUG = false;

if (typeof WEBGL_DEBUG)
{
    var SPECTOR = require('phaser3spectorjs');
    DEBUG = true;
}

/**
 * @callback WebGLContextCallback
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer which owns the context.
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
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Game instance which owns this WebGL Renderer.
 */
var WebGLRenderer = new Class({

    Extends: EventEmitter,

    initialize:

    function WebGLRenderer (game)
    {
        EventEmitter.call(this);

        var gameConfig = game.config;

        var contextCreationConfig = {
            alpha: gameConfig.transparent,
            desynchronized: gameConfig.desynchronized,
            depth: true,
            antialias: gameConfig.antialiasGL,
            premultipliedAlpha: gameConfig.premultipliedAlpha,
            stencil: true,
            failIfMajorPerformanceCaveat: gameConfig.failIfMajorPerformanceCaveat,
            powerPreference: gameConfig.powerPreference,
            preserveDrawingBuffer: gameConfig.preserveDrawingBuffer,
            willReadFrequently: false
        };

        /**
         * The local configuration settings of this WebGL Renderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#config
         * @type {object}
         * @since 3.0.0
         */
        this.config = {
            clearBeforeRender: gameConfig.clearBeforeRender,
            antialias: gameConfig.antialias,
            backgroundColor: gameConfig.backgroundColor,
            contextCreation: contextCreationConfig,
            roundPixels: gameConfig.roundPixels,
            maxTextures: gameConfig.maxTextures,
            maxTextureSize: gameConfig.maxTextureSize,
            batchSize: gameConfig.batchSize,
            maxLights: gameConfig.maxLights,
            mipmapFilter: gameConfig.mipmapFilter
        };

        /**
         * The Game instance which owns this WebGL Renderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * A constant which allows the renderer to be easily identified as a WebGL Renderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#type
         * @type {number}
         * @since 3.0.0
         */
        this.type = CONST.WEBGL;

        /**
         * An instance of the Pipeline Manager class, that handles all WebGL Pipelines.
         *
         * Use this to manage all of your interactions with pipelines, such as adding, getting,
         * setting and rendering them.
         *
         * The Pipeline Manager class is created in the `init` method and then populated
         * with pipelines during the `boot` method.
         *
         * Prior to Phaser v3.50.0 this was just a plain JavaScript object, not a class.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#pipelines
         * @type {Phaser.Renderer.WebGL.PipelineManager}
         * @since 3.50.0
         */
        this.pipelines = null;

        /**
         * The width of the canvas being rendered to.
         * This is populated in the onResize event handler.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = 0;

        /**
         * The height of the canvas being rendered to.
         * This is populated in the onResize event handler.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = 0;

        /**
         * The canvas which this WebGL Renderer draws to.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#canvas
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.canvas = game.canvas;

        /**
         * An array of blend modes supported by the WebGL Renderer.
         *
         * This array includes the default blend modes as well as any custom blend modes added through {@link #addBlendMode}.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#blendModes
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.blendModes = [];

        /**
         * This property is set to `true` if the WebGL context of the renderer is lost.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#contextLost
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.contextLost = false;

        /**
         * Details about the currently scheduled snapshot.
         *
         * If a non-null `callback` is set in this object, a snapshot of the canvas will be taken after the current frame is fully rendered.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#snapshotState
         * @type {Phaser.Types.Renderer.Snapshot.SnapshotState}
         * @since 3.0.0
         */
        this.snapshotState = {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            getPixel: false,
            callback: null,
            type: 'image/png',
            encoder: 0.92,
            isFramebuffer: false,
            bufferWidth: 0,
            bufferHeight: 0
        };

        /**
         * The maximum number of textures the GPU can handle. The minimum under the WebGL1 spec is 8.
         * This is set via the Game Config `maxTextures` property and should never be changed after boot.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#maxTextures
         * @type {number}
         * @since 3.50.0
         */
        this.maxTextures = 0;

        /**
         * An array of the available WebGL texture units, used to populate the uSampler uniforms.
         *
         * This array is populated during the init phase and should never be changed after boot.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#textureIndexes
         * @type {array}
         * @since 3.50.0
         */
        this.textureIndexes;

        /**
         * The currently bound framebuffer in use.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentFramebuffer
         * @type {WebGLFramebuffer}
         * @default null
         * @since 3.0.0
         */
        this.currentFramebuffer = null;

        /**
         * A stack into which the frame buffer objects are pushed and popped.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#fboStack
         * @type {WebGLFramebuffer[]}
         * @since 3.50.0
         */
        this.fboStack = [];

        /**
         * Current WebGLProgram in use.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentProgram
         * @type {WebGLProgram}
         * @default null
         * @since 3.0.0
         */
        this.currentProgram = null;

        /**
         * Current blend mode in use
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentBlendMode
         * @type {number}
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
        this.currentScissor = null;

        /**
         * Stack of scissor data
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#scissorStack
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.scissorStack = [];

        /**
         * The handler to invoke when the context is lost.
         * This should not be changed and is set in the boot method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#contextLostHandler
         * @type {function}
         * @since 3.19.0
         */
        this.contextLostHandler = NOOP;

        /**
         * The handler to invoke when the context is restored.
         * This should not be changed and is set in the boot method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#contextRestoredHandler
         * @type {function}
         * @since 3.19.0
         */
        this.contextRestoredHandler = NOOP;

        /**
         * The underlying WebGL context of the renderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#gl
         * @type {WebGLRenderingContext}
         * @default null
         * @since 3.0.0
         */
        this.gl = null;

        /**
         * Array of strings that indicate which WebGL extensions are supported by the browser.
         * This is populated in the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#supportedExtensions
         * @type {string[]}
         * @default null
         * @since 3.0.0
         */
        this.supportedExtensions = null;

        /**
         * If the browser supports the `ANGLE_instanced_arrays` extension, this property will hold
         * a reference to the glExtension for it.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#instancedArraysExtension
         * @type {ANGLE_instanced_arrays}
         * @default null
         * @since 3.50.0
         */
        this.instancedArraysExtension = null;

        /**
         * If the browser supports the `OES_vertex_array_object` extension, this property will hold
         * a reference to the glExtension for it.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#vaoExtension
         * @type {OES_vertex_array_object}
         * @default null
         * @since 3.50.0
         */
        this.vaoExtension = null;

        /**
         * The WebGL Extensions loaded into the current context.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#extensions
         * @type {object}
         * @default {}
         * @since 3.0.0
         */
        this.extensions = {};

        /**
         * Stores the current WebGL component formats for further use.
         *
         * This array is populated in the `init` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#glFormats
         * @type {array}
         * @since 3.2.0
         */
        this.glFormats;

        /**
         * Stores the WebGL texture compression formats that this device and browser supports.
         *
         * Support for using compressed texture formats was added in Phaser version 3.60.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#compression
         * @type {Phaser.Types.Renderer.WebGL.WebGLTextureCompression}
         * @since 3.8.0
         */
        this.compression;

        /**
         * Cached drawing buffer height to reduce gl calls.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#drawingBufferHeight
         * @type {number}
         * @readonly
         * @since 3.11.0
         */
        this.drawingBufferHeight = 0;

        /**
         * A blank 32x32 transparent texture, as used by the Graphics system where needed.
         * This is set in the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#blankTexture
         * @type {WebGLTexture}
         * @readonly
         * @since 3.12.0
         */
        this.blankTexture = null;

        /**
         * A pure white 4x4 texture, as used by the Graphics system where needed.
         * This is set in the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#whiteTexture
         * @type {WebGLTexture}
         * @readonly
         * @since 3.50.0
         */
        this.whiteTexture = null;

        /**
         * The total number of masks currently stacked.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#maskCount
         * @type {number}
         * @since 3.17.0
         */
        this.maskCount = 0;

        /**
         * The mask stack.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#maskStack
         * @type {Phaser.Display.Masks.GeometryMask[]}
         * @since 3.17.0
         */
        this.maskStack = [];

        /**
         * Internal property that tracks the currently set mask.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentMask
         * @type {any}
         * @since 3.17.0
         */
        this.currentMask = { mask: null, camera: null };

        /**
         * Internal property that tracks the currently set camera mask.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentCameraMask
         * @type {any}
         * @since 3.17.0
         */
        this.currentCameraMask = { mask: null, camera: null };

        /**
         * Internal gl function mapping for uniform look-up.
         * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#glFuncMap
         * @type {any}
         * @since 3.17.0
         */
        this.glFuncMap = null;

        /**
         * The `type` of the Game Object being currently rendered.
         * This can be used by advanced render functions for batching look-ahead.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentType
         * @type {string}
         * @since 3.19.0
         */
        this.currentType = '';

        /**
         * Is the `type` of the Game Object being currently rendered different than the
         * type of the object before it in the display list? I.e. it's a 'new' type.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#newType
         * @type {boolean}
         * @since 3.19.0
         */
        this.newType = false;

        /**
         * Does the `type` of the next Game Object in the display list match that
         * of the object being currently rendered?
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#nextTypeMatch
         * @type {boolean}
         * @since 3.19.0
         */
        this.nextTypeMatch = false;

        /**
         * Is the Game Object being currently rendered the final one in the list?
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#finalType
         * @type {boolean}
         * @since 3.50.0
         */
        this.finalType = false;

        /**
         * The mipmap magFilter to be used when creating textures.
         *
         * You can specify this as a string in the game config, i.e.:
         *
         * `render: { mipmapFilter: 'NEAREST_MIPMAP_LINEAR' }`
         *
         * The 6 options for WebGL1 are, in order from least to most computationally expensive:
         *
         * NEAREST (for pixel art)
         * LINEAR (the default)
         * NEAREST_MIPMAP_NEAREST
         * LINEAR_MIPMAP_NEAREST
         * NEAREST_MIPMAP_LINEAR
         * LINEAR_MIPMAP_LINEAR
         *
         * Mipmaps only work with textures that are fully power-of-two in size.
         *
         * For more details see https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
         *
         * As of v3.60 no mipmaps will be generated unless a string is given in
         * the game config. This saves on VRAM use when it may not be required.
         * To obtain the previous result set the property to `LINEAR` in the config.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#mipmapFilter
         * @type {GLenum}
         * @since 3.21.0
         */
        this.mipmapFilter = null;

        /**
         * The default scissor, set during `preRender` and modified during `resize`.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#defaultScissor
         * @type {number[]}
         * @private
         * @since 3.50.0
         */
        this.defaultScissor = [ 0, 0, 0, 0 ];

        /**
         * Has this renderer fully booted yet?
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#isBooted
         * @type {boolean}
         * @since 3.50.0
         */
        this.isBooted = false;

        /**
         * A Render Target you can use to capture the current state of the Renderer.
         *
         * A Render Target encapsulates a framebuffer and texture for the WebGL Renderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#renderTarget
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.50.0
         */
        this.renderTarget = null;

        /**
         * The global game Projection matrix, used by shaders as 'uProjectionMatrix' uniform.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#projectionMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.projectionMatrix;

        /**
         * The cached width of the Projection matrix.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#projectionWidth
         * @type {number}
         * @since 3.50.0
         */
        this.projectionWidth = 0;

        /**
         * The cached height of the Projection matrix.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#projectionHeight
         * @type {number}
         * @since 3.50.0
         */
        this.projectionHeight = 0;

        /**
         * A RenderTarget used by the BitmapMask Pipeline.
         *
         * This is the source, i.e. the masked Game Object itself.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#maskSource
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.60.0
         */
        this.maskSource = null;

        /**
         * A RenderTarget used by the BitmapMask Pipeline.
         *
         * This is the target, i.e. the framebuffer the masked objects are drawn to.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#maskTarget
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.60.0
         */
        this.maskTarget = null;

        /**
         * An instance of SpectorJS used for WebGL Debugging.
         *
         * Only available in the Phaser Debug build.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#spector
         * @type {function}
         * @since 3.60.0
         */
        this.spector = null;

        /**
         * Is Spector currently capturing a WebGL frame?
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#_debugCapture
         * @type {boolean}
         * @private
         * @since 3.60.0
         */
        this._debugCapture = false;

        this.init(this.config);
    },

    /**
     * Creates a new WebGLRenderingContext and initializes all internal state.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#init
     * @since 3.0.0
     *
     * @param {object} config - The configuration object for the renderer.
     *
     * @return {this} This WebGLRenderer instance.
     */
    init: function (config)
    {
        var gl;
        var game = this.game;
        var canvas = this.canvas;
        var clearColor = config.backgroundColor;

        if (DEBUG)
        {
            this.spector = new SPECTOR.Spector();

            this.spector.onCapture.add(this.onCapture.bind(this));
        }

        //  Did they provide their own context?
        if (game.config.context)
        {
            gl = game.config.context;
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

        var _this = this;

        this.contextLostHandler = function (event)
        {
            _this.contextLost = true;

            if (console)
            {
                console.warn('WebGL Context lost. Renderer disabled');
            }

            event.preventDefault();
        };

        canvas.addEventListener('webglcontextlost', this.contextLostHandler, false);

        //  Set it back into the Game, so developers can access it from there too
        game.context = gl;

        for (var i = 0; i <= 27; i++)
        {
            this.blendModes.push({ func: [ gl.ONE, gl.ONE_MINUS_SRC_ALPHA ], equation: gl.FUNC_ADD });
        }

        //  ADD
        this.blendModes[1].func = [ gl.ONE, gl.DST_ALPHA ];

        //  MULTIPLY
        this.blendModes[2].func = [ gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA ];

        //  SCREEN
        this.blendModes[3].func = [ gl.ONE, gl.ONE_MINUS_SRC_COLOR ];

        //  ERASE
        this.blendModes[17] = { func: [ gl.ZERO, gl.ONE_MINUS_SRC_ALPHA ], equation: gl.FUNC_REVERSE_SUBTRACT };

        this.glFormats = [ gl.BYTE, gl.SHORT, gl.UNSIGNED_BYTE, gl.UNSIGNED_SHORT, gl.FLOAT ];

        //  Set the gl function map
        this.glFuncMap = {

            mat2: { func: gl.uniformMatrix2fv, length: 1, matrix: true },
            mat3: { func: gl.uniformMatrix3fv, length: 1, matrix: true },
            mat4: { func: gl.uniformMatrix4fv, length: 1, matrix: true },

            '1f': { func: gl.uniform1f, length: 1 },
            '1fv': { func: gl.uniform1fv, length: 1 },
            '1i': { func: gl.uniform1i, length: 1 },
            '1iv': { func: gl.uniform1iv, length: 1 },

            '2f': { func: gl.uniform2f, length: 2 },
            '2fv': { func: gl.uniform2fv, length: 1 },
            '2i': { func: gl.uniform2i, length: 2 },
            '2iv': { func: gl.uniform2iv, length: 1 },

            '3f': { func: gl.uniform3f, length: 3 },
            '3fv': { func: gl.uniform3fv, length: 1 },
            '3i': { func: gl.uniform3i, length: 3 },
            '3iv': { func: gl.uniform3iv, length: 1 },

            '4f': { func: gl.uniform4f, length: 4 },
            '4fv': { func: gl.uniform4fv, length: 1 },
            '4i': { func: gl.uniform4i, length: 4 },
            '4iv': { func: gl.uniform4iv, length: 1 }

        };

        //  Load supported extensions
        var exts = gl.getSupportedExtensions();

        if (!config.maxTextures || config.maxTextures === -1)
        {
            config.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        }

        if (!config.maxTextureSize)
        {
            config.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        }

        this.compression = this.getCompressedTextures();

        this.supportedExtensions = exts;

        var angleString = 'ANGLE_instanced_arrays';

        this.instancedArraysExtension = (exts.indexOf(angleString) > -1) ? gl.getExtension(angleString) : null;

        var vaoString = 'OES_vertex_array_object';

        this.vaoExtension = (exts.indexOf(vaoString) > -1) ? gl.getExtension(vaoString) : null;

        //  Setup initial WebGL state
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

        gl.enable(gl.BLEND);

        gl.clearColor(clearColor.redGL, clearColor.greenGL, clearColor.blueGL, clearColor.alphaGL);

        //  Mipmaps
        if (config.mipmapFilter !== '')
        {
            this.mipmapFilter = gl[config.mipmapFilter];
        }

        //  Check maximum supported textures
        this.maxTextures = Utils.checkShaderMax(gl, config.maxTextures);

        this.textureIndexes = [];

        //  Create temporary WebGL textures to stop WebGL errors on mac os
        for (var index = 0; index < this.maxTextures; index++)
        {
            var tempTexture = gl.createTexture();

            gl.activeTexture(gl.TEXTURE0 + index);

            gl.bindTexture(gl.TEXTURE_2D, tempTexture);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([ 0, 0, 255, 255 ]));

            this.textureIndexes.push(index);
        }

        this.pipelines = new PipelineManager(this);

        this.setBlendMode(CONST.BlendModes.NORMAL);

        this.projectionMatrix = new Matrix4().identity();

        game.textures.once(TextureEvents.READY, this.boot, this);

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
        var game = this.game;
        var pipelineManager = this.pipelines;

        var baseSize = game.scale.baseSize;

        var width = baseSize.width;
        var height = baseSize.height;

        this.width = width;
        this.height = height;

        this.isBooted = true;

        this.renderTarget = new RenderTarget(this, width, height, 1, 0, true, true);

        this.maskTarget = new RenderTarget(this, width, height, 1, 0, true, true);
        this.maskSource = new RenderTarget(this, width, height, 1, 0, true, true);

        //  Set-up pipelines
        var config = game.config;

        pipelineManager.boot(config.pipeline, config.defaultPipeline, config.autoMobilePipeline);

        //  Set-up default textures, fbo and scissor

        this.blankTexture = game.textures.getFrame('__DEFAULT').glTexture;
        this.whiteTexture = game.textures.getFrame('__WHITE').glTexture;

        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.enable(gl.SCISSOR_TEST);

        game.scale.on(ScaleEvents.RESIZE, this.onResize, this);

        this.resize(width, height);
    },

    /**
     * This method is only available in the Debug Build of Phaser, or a build with the
     * `WEBGL_DEBUG` flag set in the Webpack Config.
     *
     * Phaser v3.60 Debug has a build of Spector.js embedded in it, which is a WebGL inspector
     * that allows for live inspection of your WebGL calls. Although it's easy to add the Spector
     * extension to a desktop browsr, by embedding it in Phaser we can make it available in mobile
     * browsers too, making it a powerful tool for debugging WebGL games on mobile devices where
     * extensions are not permitted.
     *
     * See https://github.com/BabylonJS/Spector.js for more details.
     *
     * This method will capture the current WebGL frame and send it to the Spector.js tool for inspection.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#captureFrame
     * @since 3.60.0
     *
     * @param {boolean} [quickCapture=false] - If `true` thumbnails are not captured in order to speed up the capture.
     * @param {boolean} [fullCapture=false] - If `true` all details are captured.
     */
    captureFrame: function (quickCapture, fullCapture)
    {
        if (quickCapture === undefined) { quickCapture = false; }
        if (fullCapture === undefined) { fullCapture = false; }

        if (DEBUG && this.spector && !this._debugCapture)
        {
            this.spector.captureCanvas(this.canvas, 0, quickCapture, fullCapture);

            this._debugCapture = true;
        }
    },

    /**
     * This method is only available in the Debug Build of Phaser, or a build with the
     * `WEBGL_DEBUG` flag set in the Webpack Config.
     *
     * Phaser v3.60 Debug has a build of Spector.js embedded in it, which is a WebGL inspector
     * that allows for live inspection of your WebGL calls. Although it's easy to add the Spector
     * extension to a desktop browsr, by embedding it in Phaser we can make it available in mobile
     * browsers too, making it a powerful tool for debugging WebGL games on mobile devices where
     * extensions are not permitted.
     *
     * See https://github.com/BabylonJS/Spector.js for more details.
     *
     * This method will capture the next WebGL frame and send it to the Spector.js tool for inspection.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#captureNextFrame
     * @since 3.60.0
     */
    captureNextFrame: function ()
    {
        if (DEBUG && this.spector && !this._debugCapture)
        {
            this._debugCapture = true;

            this.spector.captureNextFrame(this.canvas);
        }
    },

    /**
     * This method is only available in the Debug Build of Phaser, or a build with the
     * `WEBGL_DEBUG` flag set in the Webpack Config.
     *
     * Phaser v3.60 Debug has a build of Spector.js embedded in it, which is a WebGL inspector
     * that allows for live inspection of your WebGL calls. Although it's easy to add the Spector
     * extension to a desktop browsr, by embedding it in Phaser we can make it available in mobile
     * browsers too, making it a powerful tool for debugging WebGL games on mobile devices where
     * extensions are not permitted.
     *
     * See https://github.com/BabylonJS/Spector.js for more details.
     *
     * This method will return the current FPS of the WebGL canvas.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#getFps
     * @since 3.60.0
     *
     * @return {number} The current FPS of the WebGL canvas.
     */
    getFps: function ()
    {
        if (DEBUG && this.spector)
        {
            return this.spector.getFps();
        }
    },

    /**
     * This method is only available in the Debug Build of Phaser, or a build with the
     * `WEBGL_DEBUG` flag set in the Webpack Config.
     *
     * Phaser v3.60 Debug has a build of Spector.js embedded in it, which is a WebGL inspector
     * that allows for live inspection of your WebGL calls. Although it's easy to add the Spector
     * extension to a desktop browsr, by embedding it in Phaser we can make it available in mobile
     * browsers too, making it a powerful tool for debugging WebGL games on mobile devices where
     * extensions are not permitted.
     *
     * See https://github.com/BabylonJS/Spector.js for more details.
     *
     * This method adds a command with the name value in the list. This can be filtered in the search.
     * All logs can be filtered searching for "LOG".
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#log
     * @since 3.60.0
     *
     * @param {...*} arguments - The arguments to log to Spector.
     *
     * @return {string} The current log.
     */
    log: function ()
    {
        if (DEBUG && this.spector)
        {
            var t = Array.prototype.slice.call(arguments).join(' ');

            return this.spector.log(t);
        }
    },

    /**
     * This method is only available in the Debug Build of Phaser, or a build with the
     * `WEBGL_DEBUG` flag set in the Webpack Config.
     *
     * Phaser v3.60 Debug has a build of Spector.js embedded in it, which is a WebGL inspector
     * that allows for live inspection of your WebGL calls. Although it's easy to add the Spector
     * extension to a desktop browsr, by embedding it in Phaser we can make it available in mobile
     * browsers too, making it a powerful tool for debugging WebGL games on mobile devices where
     * extensions are not permitted.
     *
     * See https://github.com/BabylonJS/Spector.js for more details.
     *
     * This method will start a capture on the Phaser canvas. The capture will stop once it reaches
     * the number of commands specified as a parameter, or after 10 seconds. If quick capture is true,
     * the thumbnails are not captured in order to speed up the capture.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#startCapture
     * @since 3.60.0
     *
     * @param {number} [commandCount=0] - The number of commands to capture. If zero it will capture for 10 seconds.
     * @param {boolean} [quickCapture=false] - If `true` thumbnails are not captured in order to speed up the capture.
     * @param {boolean} [fullCapture=false] - If `true` all details are captured.
     */
    startCapture: function (commandCount, quickCapture, fullCapture)
    {
        if (commandCount === undefined) { commandCount = 0; }
        if (quickCapture === undefined) { quickCapture = false; }
        if (fullCapture === undefined) { fullCapture = false; }

        if (DEBUG && this.spector && !this._debugCapture)
        {
            this.spector.startCapture(this.canvas, commandCount, quickCapture, fullCapture);

            this._debugCapture = true;
        }
    },

    /**
     * This method is only available in the Debug Build of Phaser, or a build with the
     * `WEBGL_DEBUG` flag set in the Webpack Config.
     *
     * Phaser v3.60 Debug has a build of Spector.js embedded in it, which is a WebGL inspector
     * that allows for live inspection of your WebGL calls. Although it's easy to add the Spector
     * extension to a desktop browsr, by embedding it in Phaser we can make it available in mobile
     * browsers too, making it a powerful tool for debugging WebGL games on mobile devices where
     * extensions are not permitted.
     *
     * See https://github.com/BabylonJS/Spector.js for more details.
     *
     * This method will stop the current capture and returns the result in JSON. It displays the
     * result if the UI has been displayed. This returns undefined if the capture has not been completed
     * or did not find any commands.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#stopCapture
     * @since 3.60.0
     *
     * @return {object} The current capture.
     */
    stopCapture: function ()
    {
        if (DEBUG && this.spector && this._debugCapture)
        {
            return this.spector.stopCapture();
        }
    },

    /**
     * This method is only available in the Debug Build of Phaser, or a build with the
     * `WEBGL_DEBUG` flag set in the Webpack Config.
     *
     * Internal onCapture handler.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#onCapture
     * @private
     * @since 3.60.0
     *
     * @param {object} capture - The capture data.
     */
    onCapture: function (capture)
    {
        if (DEBUG)
        {
            var view = this.spector.getResultUI();

            view.display(capture);

            this._debugCapture = false;
        }
    },

    /**
     * The event handler that manages the `resize` event dispatched by the Scale Manager.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#onResize
     * @since 3.16.0
     *
     * @param {Phaser.Structs.Size} gameSize - The default Game Size object. This is the un-modified game dimensions.
     * @param {Phaser.Structs.Size} baseSize - The base Size object. The game dimensions. The canvas width / height values match this.
     */
    onResize: function (gameSize, baseSize)
    {
        //  Has the underlying canvas size changed?
        if (baseSize.width !== this.width || baseSize.height !== this.height)
        {
            this.resize(baseSize.width, baseSize.height);
        }
    },

    /**
     * Binds the WebGL Renderers Render Target, so all drawn content is now redirected to it.
     *
     * Make sure to call `endCapture` when you are finished.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#beginCapture
     * @since 3.50.0
     *
     * @param {number} [width] - Optional new width of the Render Target.
     * @param {number} [height] - Optional new height of the Render Target.
     */
    beginCapture: function (width, height)
    {
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = this.height; }

        this.renderTarget.bind(true, width, height);

        this.setProjectionMatrix(width, height);
    },

    /**
     * Unbinds the WebGL Renderers Render Target and returns it, stopping any further content being drawn to it.
     *
     * If the viewport or scissors were modified during the capture, you should reset them by calling
     * `resetViewport` and `resetScissor` accordingly.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#endCapture
     * @since 3.50.0
     *
     * @return {Phaser.Renderer.WebGL.RenderTarget} A reference to the WebGL Renderer Render Target.
     */
    endCapture: function ()
    {
        this.renderTarget.unbind(true);

        this.resetProjectionMatrix();

        return this.renderTarget;
    },

    /**
     * Resizes the drawing buffer to match that required by the Scale Manager.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#resize
     * @fires Phaser.Renderer.Events#RESIZE
     * @since 3.0.0
     *
     * @param {number} [width] - The new width of the renderer.
     * @param {number} [height] - The new height of the renderer.
     *
     * @return {this} This WebGLRenderer instance.
     */
    resize: function (width, height)
    {
        var gl = this.gl;

        this.width = width;
        this.height = height;

        this.setProjectionMatrix(width, height);

        gl.viewport(0, 0, width, height);

        this.drawingBufferHeight = gl.drawingBufferHeight;

        gl.scissor(0, (gl.drawingBufferHeight - height), width, height);

        this.defaultScissor[2] = width;
        this.defaultScissor[3] = height;

        this.emit(Events.RESIZE, width, height);

        return this;
    },

    /**
     * Determines which compressed texture formats this browser and device supports.
     *
     * Called automatically as part of the WebGL Renderer init process. If you need to investigate
     * which formats it supports, see the `Phaser.Renderer.WebGL.WebGLRenderer#compression` property instead.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#getCompressedTextures
     * @since 3.60.0
     *
     * @return {Phaser.Types.Renderer.WebGL.WebGLTextureCompression} The compression object.
     */
    getCompressedTextures: function ()
    {
        var extString = 'WEBGL_compressed_texture_';
        var wkExtString = 'WEBKIT_' + extString;

        var hasExt = function (gl, format)
        {
            var results = gl.getExtension(extString + format) || gl.getExtension(wkExtString + format);

            if (results)
            {
                var glEnums = {};

                for (var key in results)
                {
                    glEnums[results[key]] = key;
                }

                return glEnums;
            }
        };

        var gl = this.gl;

        return {
            ETC: hasExt(gl, 'etc'),
            ETC1: hasExt(gl, 'etc1'),
            ATC: hasExt(gl, 'atc'),
            ASTC: hasExt(gl, 'astc'),
            BPTC: hasExt(gl, 'bptc'),
            RGTC: hasExt(gl, 'rgtc'),
            PVRTC: hasExt(gl, 'pvrtc'),
            S3TC: hasExt(gl, 's3tc'),
            S3TCSRGB: hasExt(gl, 's3tc_srgb'),
            IMG: true
        };
    },

    /**
     * Returns a compressed texture format GLenum name based on the given format.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#getCompressedTextureName
     * @since 3.60.0
     *
     * @param {string} baseFormat - The Base Format to check.
     * @param {GLenum} [format] - An optional GLenum format to check within the base format.
     *
     * @return {string} The compressed texture format name, as a string.
     */
    getCompressedTextureName: function (baseFormat, format)
    {
        var supportedFormats = this.compression[baseFormat.toUpperCase()];

        if (format in supportedFormats)
        {
            return supportedFormats[format];
        }
    },

    /**
     * Checks if the given compressed texture format is supported, or not.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#supportsCompressedTexture
     * @since 3.60.0
     *
     * @param {string} baseFormat - The Base Format to check.
     * @param {GLenum} [format] - An optional GLenum format to check within the base format.
     *
     * @return {boolean} True if the format is supported, otherwise false.
     */
    supportsCompressedTexture: function (baseFormat, format)
    {
        var supportedFormats = this.compression[baseFormat.toUpperCase()];

        if (supportedFormats)
        {
            if (format)
            {
                return format in supportedFormats;
            }
            else
            {
                return true;
            }
        }

        return false;
    },

    /**
     * Gets the aspect ratio of the WebGLRenderer dimensions.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#getAspectRatio
     * @since 3.50.0
     *
     * @return {number} The aspect ratio of the WebGLRenderer dimensions.
     */
    getAspectRatio: function ()
    {
        return this.width / this.height;
    },

    /**
     * Sets the Projection Matrix of this renderer to the given dimensions.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setProjectionMatrix
     * @since 3.50.0
     *
     * @param {number} width - The new width of the Projection Matrix.
     * @param {number} height - The new height of the Projection Matrix.
     *
     * @return {this} This WebGLRenderer instance.
     */
    setProjectionMatrix: function (width, height)
    {
        if (width !== this.projectionWidth || height !== this.projectionHeight)
        {
            this.projectionWidth = width;
            this.projectionHeight = height;

            this.projectionMatrix.ortho(0, width, height, 0, -1000, 1000);
        }

        return this;
    },

    /**
     * Resets the Projection Matrix back to this renderers width and height.
     *
     * This is called during `endCapture`, should the matrix have been changed
     * as a result of the capture process.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#resetProjectionMatrix
     * @since 3.50.0
     *
     * @return {this} This WebGLRenderer instance.
     */
    resetProjectionMatrix: function ()
    {
        return this.setProjectionMatrix(this.width, this.height);
    },

    /**
     * Checks if a WebGL extension is supported
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#hasExtension
     * @since 3.0.0
     *
     * @param {string} extensionName - Name of the WebGL extension
     *
     * @return {boolean} `true` if the extension is supported, otherwise `false`.
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
     * @param {string} extensionName - The name of the extension to load.
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
        this.pipelines.flush();
    },

    /**
     * Pushes a new scissor state. This is used to set nested scissor states.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#pushScissor
     * @since 3.0.0
     *
     * @param {number} x - The x position of the scissor.
     * @param {number} y - The y position of the scissor.
     * @param {number} width - The width of the scissor.
     * @param {number} height - The height of the scissor.
     * @param {number} [drawingBufferHeight] - Optional drawingBufferHeight override value.
     *
     * @return {number[]} An array containing the scissor values.
     */
    pushScissor: function (x, y, width, height, drawingBufferHeight)
    {
        if (drawingBufferHeight === undefined) { drawingBufferHeight = this.drawingBufferHeight; }

        var scissorStack = this.scissorStack;

        var scissor = [ x, y, width, height ];

        scissorStack.push(scissor);

        this.setScissor(x, y, width, height, drawingBufferHeight);

        this.currentScissor = scissor;

        return scissor;
    },

    /**
     * Sets the current scissor state.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setScissor
     * @since 3.0.0
     *
     * @param {number} x - The x position of the scissor.
     * @param {number} y - The y position of the scissor.
     * @param {number} width - The width of the scissor.
     * @param {number} height - The height of the scissor.
     * @param {number} [drawingBufferHeight] - Optional drawingBufferHeight override value.
     */
    setScissor: function (x, y, width, height, drawingBufferHeight)
    {
        if (drawingBufferHeight === undefined) { drawingBufferHeight = this.drawingBufferHeight; }

        var gl = this.gl;

        var current = this.currentScissor;

        var setScissor = (width > 0 && height > 0);

        if (current && setScissor)
        {
            var cx = current[0];
            var cy = current[1];
            var cw = current[2];
            var ch = current[3];

            setScissor = (cx !== x || cy !== y || cw !== width || ch !== height);
        }

        if (setScissor)
        {
            this.flush();

            // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor
            gl.scissor(x, (drawingBufferHeight - y - height), width, height);
        }
    },

    /**
     * Resets the gl scissor state to be whatever the current scissor is, if there is one, without
     * modifying the scissor stack.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#resetScissor
     * @since 3.50.0
     */
    resetScissor: function ()
    {
        var gl = this.gl;

        gl.enable(gl.SCISSOR_TEST);

        var current = this.currentScissor;

        if (current)
        {
            var x = current[0];
            var y = current[1];
            var width = current[2];
            var height = current[3];

            if (width > 0 && height > 0)
            {
                gl.scissor(x, (this.drawingBufferHeight - y - height), width, height);
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
     * Is there an active stencil mask?
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#hasActiveStencilMask
     * @since 3.17.0
     *
     * @return {boolean} `true` if there is an active stencil mask, otherwise `false`.
     */
    hasActiveStencilMask: function ()
    {
        var mask = this.currentMask.mask;
        var camMask = this.currentCameraMask.mask;

        return ((mask && mask.isStencil) || (camMask && camMask.isStencil));
    },

    /**
     * Resets the gl viewport to the current renderer dimensions.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#resetViewport
     * @since 3.50.0
     */
    resetViewport: function ()
    {
        var gl = this.gl;

        gl.viewport(0, 0, this.width, this.height);

        this.drawingBufferHeight = gl.drawingBufferHeight;
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
     * @param {number} blendModeId - The blend mode to be set. Can be a `BlendModes` const or an integer value.
     * @param {boolean} [force=false] - Force the blend mode to be set, regardless of the currently set blend mode.
     *
     * @return {boolean} `true` if the blend mode was changed as a result of this call, forcing a flush, otherwise `false`.
     */
    setBlendMode: function (blendModeId, force)
    {
        if (force === undefined) { force = false; }

        var gl = this.gl;
        var blendMode = this.blendModes[blendModeId];

        if (force || (blendModeId !== CONST.BlendModes.SKIP_CHECK && this.currentBlendMode !== blendModeId))
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
     * Creates a new custom blend mode for the renderer.
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Blending_modes
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#addBlendMode
     * @since 3.0.0
     *
     * @param {GLenum[]} func - An array containing the WebGL functions to use for the source and the destination blending factors, respectively. See the possible constants for {@link WebGLRenderingContext#blendFunc()}.
     * @param {GLenum} equation - The equation to use for combining the RGB and alpha components of a new pixel with a rendered one. See the possible constants for {@link WebGLRenderingContext#blendEquation()}.
     *
     * @return {number} The index of the new blend mode, used for referencing it in the future.
     */
    addBlendMode: function (func, equation)
    {
        var index = this.blendModes.push({ func: func, equation: equation });

        return index - 1;
    },

    /**
     * Updates the function bound to a given custom blend mode.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#updateBlendMode
     * @since 3.0.0
     *
     * @param {number} index - The index of the custom blend mode.
     * @param {function} func - The function to use for the blend mode.
     * @param {function} equation - The equation to use for the blend mode.
     *
     * @return {this} This WebGLRenderer instance.
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
     * Removes a custom blend mode from the renderer.
     * Any Game Objects still using this blend mode will error, so be sure to clear them first.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#removeBlendMode
     * @since 3.0.0
     *
     * @param {number} index - The index of the custom blend mode to be removed.
     *
     * @return {this} This WebGLRenderer instance.
     */
    removeBlendMode: function (index)
    {
        if (index > 17 && this.blendModes[index])
        {
            this.blendModes.splice(index, 1);
        }

        return this;
    },

    /**
     * Pushes a new framebuffer onto the FBO stack and makes it the currently bound framebuffer.
     *
     * If there was another framebuffer already bound it will force a pipeline flush.
     *
     * Call `popFramebuffer` to remove it again.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#pushFramebuffer
     * @since 3.50.0
     *
     * @param {WebGLFramebuffer} framebuffer - The framebuffer that needs to be bound.
     * @param {boolean} [updateScissor=false] - Set the gl scissor to match the frame buffer size? Or, if `null` given, pop the scissor from the stack.
     * @param {boolean} [setViewport=true] - Should the WebGL viewport be set?
     * @param {WebGLTexture} [texture=null] - Bind the given frame buffer texture?
     * @param {boolean} [clear=false] - Clear the frame buffer after binding?
     *
     * @return {this} This WebGLRenderer instance.
     */
    pushFramebuffer: function (framebuffer, updateScissor, setViewport, texture, clear)
    {
        if (framebuffer === this.currentFramebuffer)
        {
            return this;
        }

        this.fboStack.push(framebuffer);

        return this.setFramebuffer(framebuffer, updateScissor, setViewport, texture, clear);
    },

    /**
     * Sets the given framebuffer as the active and currently bound framebuffer.
     *
     * If there was another framebuffer already bound it will force a pipeline flush.
     *
     * Typically, you should call `pushFramebuffer` instead of this method.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setFramebuffer
     * @since 3.0.0
     *
     * @param {WebGLFramebuffer} framebuffer - The framebuffer that needs to be bound.
     * @param {boolean} [updateScissor=false] - If a framebuffer is given, set the gl scissor to match the frame buffer size? Or, if `null` given, pop the scissor from the stack.
     * @param {boolean} [setViewport=true] - Should the WebGL viewport be set?
     * @param {WebGLTexture} [texture=null] - Bind the given frame buffer texture?
     * @param {boolean} [clear=false] - Clear the frame buffer after binding?
     *
     * @return {this} This WebGLRenderer instance.
     */
    setFramebuffer: function (framebuffer, updateScissor, setViewport, texture, clear)
    {
        if (updateScissor === undefined) { updateScissor = false; }
        if (setViewport === undefined) { setViewport = true; }
        if (texture === undefined) { texture = null; }
        if (clear === undefined) { clear = false; }

        if (framebuffer === this.currentFramebuffer)
        {
            return this;
        }

        var gl = this.gl;

        var width = this.width;
        var height = this.height;

        if (framebuffer && framebuffer.renderTexture && setViewport)
        {
            width = framebuffer.renderTexture.width;
            height = framebuffer.renderTexture.height;
        }
        else
        {
            this.flush();
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        if (setViewport)
        {
            gl.viewport(0, 0, width, height);
        }

        if (texture)
        {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        }

        if (clear)
        {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        if (updateScissor)
        {
            if (framebuffer)
            {
                this.drawingBufferHeight = height;

                this.pushScissor(0, 0, width, height);
            }
            else
            {
                this.drawingBufferHeight = this.height;

                this.popScissor();
            }
        }

        this.currentFramebuffer = framebuffer;

        return this;
    },

    /**
     * Pops the previous framebuffer from the fbo stack and sets it.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#popFramebuffer
     * @since 3.50.0
     *
     * @param {boolean} [updateScissor=false] - If a framebuffer is given, set the gl scissor to match the frame buffer size? Or, if `null` given, pop the scissor from the stack.
     * @param {boolean} [setViewport=true] - Should the WebGL viewport be set?
     *
     * @return {WebGLFramebuffer} The Framebuffer that was set, or `null` if there aren't any more in the stack.
     */
    popFramebuffer: function (updateScissor, setViewport)
    {
        if (updateScissor === undefined) { updateScissor = false; }
        if (setViewport === undefined) { setViewport = true; }

        var fboStack = this.fboStack;

        //  Remove the current fbo
        fboStack.pop();

        //  Reset the previous framebuffer
        var framebuffer = fboStack[fboStack.length - 1];

        if (!framebuffer)
        {
            framebuffer = null;
        }

        this.setFramebuffer(framebuffer, updateScissor, setViewport);

        return framebuffer;
    },

    /**
     * Restores the previous framebuffer from the fbo stack and sets it.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#restoreFramebuffer
     * @since 3.60.0
     *
     * @param {boolean} [updateScissor=false] - If a framebuffer is given, set the gl scissor to match the frame buffer size? Or, if `null` given, pop the scissor from the stack.
     * @param {boolean} [setViewport=true] - Should the WebGL viewport be set?
     */
    restoreFramebuffer: function (updateScissor, setViewport)
    {
        if (updateScissor === undefined) { updateScissor = false; }
        if (setViewport === undefined) { setViewport = true; }

        var fboStack = this.fboStack;

        var framebuffer = fboStack[fboStack.length - 1];

        if (!framebuffer)
        {
            framebuffer = null;
        }

        this.currentFramebuffer = null;

        this.setFramebuffer(framebuffer, updateScissor, setViewport);
    },

    /**
     * Binds a shader program.
     *
     * If there was a different program already bound it will force a pipeline flush first.
     *
     * If the same program given to this method is already set as the current program, no change
     * will take place and this method will return `false`.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setProgram
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - The program that needs to be bound.
     *
     * @return {boolean} `true` if the given program was bound, otherwise `false`.
     */
    setProgram: function (program)
    {
        if (program !== this.currentProgram)
        {
            this.flush();

            this.gl.useProgram(program);

            this.currentProgram = program;

            return true;
        }

        return false;
    },

    /**
     * Rebinds whatever program `WebGLRenderer.currentProgram` is set as, without
     * changing anything, or flushing.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#resetProgram
     * @since 3.50.0
     *
     * @return {this} This WebGLRenderer instance.
     */
    resetProgram: function ()
    {
        this.gl.useProgram(this.currentProgram);

        return this;
    },

    /**
     * Creates a texture from an image source. If the source is not valid it creates an empty texture.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createTextureFromSource
     * @since 3.0.0
     *
     * @param {object} source - The source of the texture.
     * @param {number} width - The width of the texture.
     * @param {number} height - The height of the texture.
     * @param {number} scaleMode - The scale mode to be used by the texture.
     * @param {boolean} [forceClamp=false] - Force the texture to use the CLAMP_TO_EDGE wrap mode, even if a power of two?
     *
     * @return {?WebGLTexture} The WebGL Texture that was created, or `null` if it couldn't be created.
     */
    createTextureFromSource: function (source, width, height, scaleMode, forceClamp)
    {
        if (forceClamp === undefined) { forceClamp = false; }

        var gl = this.gl;
        var minFilter = gl.NEAREST;
        var magFilter = gl.NEAREST;
        var wrap = gl.CLAMP_TO_EDGE;
        var texture = null;

        width = source ? source.width : width;
        height = source ? source.height : height;

        var pow = IsSizePowerOfTwo(width, height);

        if (pow && !forceClamp)
        {
            wrap = gl.REPEAT;
        }

        if (scaleMode === CONST.ScaleModes.LINEAR && this.config.antialias)
        {
            minFilter = (pow && this.mipmapFilter) ? this.mipmapFilter : gl.LINEAR;
            magFilter = gl.LINEAR;
        }

        if (source && source.compressed)
        {
            //  If you don't set minFilter to LINEAR then the compressed textures don't work!
            minFilter = gl.LINEAR;
            magFilter = gl.LINEAR;
        }

        if (!source && typeof width === 'number' && typeof height === 'number')
        {
            texture = this.createTexture2D(0, minFilter, magFilter, wrap, wrap, gl.RGBA, null, width, height);
        }
        else
        {
            texture = this.createTexture2D(0, minFilter, magFilter, wrap, wrap, gl.RGBA, source);
        }

        return texture;
    },

    /**
     * A wrapper for creating a WebGLTexture. If no pixel data is passed it will create an empty texture.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createTexture2D
     * @since 3.0.0
     *
     * @param {number} mipLevel - Mip level of the texture.
     * @param {number} minFilter - Filtering of the texture.
     * @param {number} magFilter - Filtering of the texture.
     * @param {number} wrapT - Wrapping mode of the texture.
     * @param {number} wrapS - Wrapping mode of the texture.
     * @param {number} format - Which format does the texture use.
     * @param {?object} pixels - pixel data.
     * @param {number} width - Width of the texture in pixels.
     * @param {number} height - Height of the texture in pixels.
     * @param {boolean} [pma=true] - Does the texture have premultiplied alpha?
     * @param {boolean} [forceSize=false] - If `true` it will use the width and height passed to this method, regardless of the pixels dimension.
     * @param {boolean} [flipY=false] - Sets the `UNPACK_FLIP_Y_WEBGL` flag the WebGL Texture uses during upload.
     *
     * @return {WebGLTexture} The WebGLTexture that was created.
     */
    createTexture2D: function (mipLevel, minFilter, magFilter, wrapT, wrapS, format, pixels, width, height, pma, forceSize, flipY)
    {
        pma = (pma === undefined || pma === null) ? true : pma;
        if (forceSize === undefined) { forceSize = false; }
        if (flipY === undefined) { flipY = false; }

        var gl = this.gl;
        var texture = gl.createTexture();

        gl.activeTexture(gl.TEXTURE0);

        var currentTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, pma);

        if (flipY)
        {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }

        var generateMipmap = false;

        if (pixels === null || pixels === undefined)
        {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, width, height, 0, format, gl.UNSIGNED_BYTE, null);

            generateMipmap = IsSizePowerOfTwo(width, height);
        }
        else if (pixels.compressed)
        {
            width = pixels.width;
            height = pixels.height;
            generateMipmap = pixels.generateMipmap;

            for (var i = 0; i < pixels.mipmaps.length; i++)
            {
                gl.compressedTexImage2D(gl.TEXTURE_2D, i, pixels.internalFormat, pixels.mipmaps[i].width, pixels.mipmaps[i].height, 0, pixels.mipmaps[i].data);
            }
        }
        else
        {
            if (!forceSize)
            {
                width = pixels.width;
                height = pixels.height;
            }

            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, format, gl.UNSIGNED_BYTE, pixels);

            generateMipmap = IsSizePowerOfTwo(width, height);
        }

        if (generateMipmap)
        {
            gl.generateMipmap(gl.TEXTURE_2D);
        }

        if (currentTexture)
        {
            gl.bindTexture(gl.TEXTURE_2D, currentTexture);
        }

        texture.isAlphaPremultiplied = pma;
        texture.isRenderTexture = false;
        texture.width = width;
        texture.height = height;

        return texture;
    },

    /**
     * Creates a WebGL Framebuffer object and optionally binds a depth stencil render buffer.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createFramebuffer
     * @since 3.0.0
     *
     * @param {number} width - If `addDepthStencilBuffer` is true, this controls the width of the depth stencil.
     * @param {number} height - If `addDepthStencilBuffer` is true, this controls the height of the depth stencil.
     * @param {WebGLTexture} renderTexture - The color texture where the color pixels are written.
     * @param {boolean} [addDepthStencilBuffer=false] - Create a Renderbuffer for the depth stencil?
     *
     * @return {WebGLFramebuffer} Raw WebGLFramebuffer
     */
    createFramebuffer: function (width, height, renderTexture, addDepthStencilBuffer)
    {
        if (addDepthStencilBuffer === undefined) { addDepthStencilBuffer = true; }

        var gl = this.gl;
        var framebuffer = gl.createFramebuffer();
        var complete = 0;

        this.setFramebuffer(framebuffer);

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

            throw new Error('Framebuffer status: ' + (errors[complete] || complete));
        }

        framebuffer.renderTexture = renderTexture;

        if (addDepthStencilBuffer)
        {
            var depthStencilBuffer = gl.createRenderbuffer();

            gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencilBuffer);
        }

        this.setFramebuffer(null);

        return framebuffer;
    },

    /**
     * Binds necessary resources and renders the mask to a separated framebuffer.
     * The framebuffer for the masked object is also bound for further use.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#beginBitmapMask
     * @since 3.60.0
     *
     * @param {Phaser.Display.Masks.BitmapMask} mask - The BitmapMask instance that called beginMask.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera rendering the current mask.
     */
    beginBitmapMask: function (bitmapMask, camera)
    {
        var gl = this.gl;

        if (gl)
        {
            this.flush();

            this.maskTarget.bind();

            if (this.currentCameraMask.mask !== bitmapMask)
            {
                this.currentMask.mask = bitmapMask;
                this.currentMask.camera = camera;
            }
        }
    },

    /**
     * Binds necessary resources and renders the mask to a separated framebuffer.
     * The framebuffer for the masked object is also bound for further use.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#drawBitmapMask
     * @since 3.60.0
     *
     * @param {Phaser.Display.Masks.BitmapMask} mask - The BitmapMask instance that called beginMask.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera rendering the current mask.
     * @param {Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline} bitmapMaskPipeline - The BitmapMask Pipeline instance that is requesting the draw.
     */
    drawBitmapMask: function (bitmapMask, camera, bitmapMaskPipeline)
    {
        //  mask.mainFramebuffer should now contain all the Game Objects we want masked
        this.flush();

        this.maskSource.bind();

        this.setBlendMode(0, true);

        bitmapMask.renderWebGL(this, bitmapMask, camera);

        this.maskSource.unbind(true);
        this.maskTarget.unbind();

        //  Is there a stencil further up the stack?
        var gl = this.gl;
        var prev = this.getCurrentStencilMask();

        if (prev)
        {
            gl.enable(gl.STENCIL_TEST);

            prev.mask.applyStencil(this, prev.camera, true);
        }
        else
        {
            this.currentMask.mask = null;
        }

        //  Bind this pipeline and draw
        this.pipelines.set(bitmapMaskPipeline);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.maskTarget.texture);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.maskSource.texture);
    },

    /**
     * Creates a WebGLProgram instance based on the given vertex and fragment shader source.
     *
     * Then compiles, attaches and links the program before returning it.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createProgram
     * @since 3.0.0
     *
     * @param {string} vertexShader - The vertex shader source code as a single string.
     * @param {string} fragmentShader - The fragment shader source code as a single string.
     *
     * @return {WebGLProgram} The linked WebGLProgram created from the given shader source.
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

        var failed = 'Shader failed:\n';

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
        {
            throw new Error('Vertex ' + failed + gl.getShaderInfoLog(vs));
        }

        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            throw new Error('Fragment ' + failed + gl.getShaderInfoLog(fs));
        }

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            throw new Error('Link ' + failed + gl.getProgramInfoLog(program));
        }

        gl.useProgram(program);

        return program;
    },

    /**
     * Wrapper for creating a vertex buffer.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createVertexBuffer
     * @since 3.0.0
     *
     * @param {ArrayBuffer} initialDataOrSize - It's either ArrayBuffer or an integer indicating the size of the vbo
     * @param {number} bufferUsage - How the buffer is used. gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW
     *
     * @return {WebGLBuffer} Raw vertex buffer
     */
    createVertexBuffer: function (initialDataOrSize, bufferUsage)
    {
        var gl = this.gl;
        var vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, initialDataOrSize, bufferUsage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return vertexBuffer;
    },

    /**
     * Wrapper for creating a vertex buffer.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createIndexBuffer
     * @since 3.0.0
     *
     * @param {ArrayBuffer} initialDataOrSize - Either ArrayBuffer or an integer indicating the size of the vbo.
     * @param {number} bufferUsage - How the buffer is used. gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW.
     *
     * @return {WebGLBuffer} Raw index buffer
     */
    createIndexBuffer: function (initialDataOrSize, bufferUsage)
    {
        var gl = this.gl;
        var indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, initialDataOrSize, bufferUsage);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return indexBuffer;
    },

    /**
     * Calls `GL.deleteTexture` on the given WebGLTexture and also optionally
     * resets the currently defined textures.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteTexture
     * @since 3.0.0
     *
     * @param {WebGLTexture} texture - The WebGL Texture to be deleted.
     *
     * @return {this} This WebGLRenderer instance.
     */
    deleteTexture: function (texture)
    {
        if (texture)
        {
            this.gl.deleteTexture(texture);
        }

        return this;
    },

    /**
     * Deletes a WebGLFramebuffer from the GL instance.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteFramebuffer
     * @since 3.0.0
     *
     * @param {WebGLFramebuffer} framebuffer - The Framebuffer to be deleted.
     *
     * @return {this} This WebGLRenderer instance.
     */
    deleteFramebuffer: function (framebuffer)
    {
        if (framebuffer)
        {
            var gl = this.gl;

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

            var renderBuffer = gl.getParameter(gl.RENDERBUFFER_BINDING);

            if (renderBuffer)
            {
                gl.deleteRenderbuffer(renderBuffer);
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            gl.deleteFramebuffer(framebuffer);

            ArrayRemove(this.fboStack, framebuffer);

            if (this.currentFramebuffer === framebuffer)
            {
                this.currentFramebuffer = null;
            }
        }

        return this;
    },

    /**
     * Deletes a WebGLProgram from the GL instance.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteProgram
     * @since 3.0.0
     *
     * @param {WebGLProgram} program - The shader program to be deleted.
     *
     * @return {this} This WebGLRenderer instance.
     */
    deleteProgram: function (program)
    {
        if (program)
        {
            this.gl.deleteProgram(program);
        }

        return this;
    },

    /**
     * Deletes a WebGLBuffer from the GL instance.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteBuffer
     * @since 3.0.0
     *
     * @param {WebGLBuffer} vertexBuffer - The WebGLBuffer to be deleted.
     *
     * @return {this} This WebGLRenderer instance.
     */
    deleteBuffer: function (buffer)
    {
        this.gl.deleteBuffer(buffer);

        return this;
    },

    /**
     * Controls the pre-render operations for the given camera.
     * Handles any clipping needed by the camera and renders the background color if a color is visible.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#preRenderCamera
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to pre-render.
     */
    preRenderCamera: function (camera)
    {
        var cx = camera.x;
        var cy = camera.y;
        var cw = camera.width;
        var ch = camera.height;

        var color = camera.backgroundColor;

        camera.emit(CameraEvents.PRE_RENDER, camera);

        this.pipelines.preBatchCamera(camera);

        this.pushScissor(cx, cy, cw, ch);

        if (camera.mask)
        {
            this.currentCameraMask.mask = camera.mask;
            this.currentCameraMask.camera = camera._maskCamera;

            camera.mask.preRenderWebGL(this, camera, camera._maskCamera);
        }

        if (color.alphaGL > 0)
        {
            var pipeline = this.pipelines.setMulti();

            pipeline.drawFillRect(
                cx, cy, cw, ch,
                Utils.getTintFromFloats(color.blueGL, color.greenGL, color.redGL, 1),
                color.alphaGL
            );
        }
    },

    /**
     * Return the current stencil mask.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#getCurrentStencilMask
     * @private
     * @since 3.50.0
     */
    getCurrentStencilMask: function ()
    {
        var prev = null;
        var stack = this.maskStack;
        var cameraMask = this.currentCameraMask;

        if (stack.length > 0)
        {
            prev = stack[stack.length - 1];
        }
        else if (cameraMask.mask && cameraMask.mask.isStencil)
        {
            prev = cameraMask;
        }

        return prev;
    },

    /**
     * Controls the post-render operations for the given camera.
     *
     * Renders the foreground camera effects like flash and fading, then resets the current scissor state.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#postRenderCamera
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to post-render.
     */
    postRenderCamera: function (camera)
    {
        var flashEffect = camera.flashEffect;
        var fadeEffect = camera.fadeEffect;

        if (flashEffect.isRunning || (fadeEffect.isRunning || fadeEffect.isComplete))
        {
            var pipeline = this.pipelines.setMulti();

            flashEffect.postRenderWebGL(pipeline, Utils.getTintFromFloats);
            fadeEffect.postRenderWebGL(pipeline, Utils.getTintFromFloats);
        }

        camera.dirty = false;

        this.popScissor();

        if (camera.mask)
        {
            this.currentCameraMask.mask = null;

            camera.mask.postRenderWebGL(this, camera._maskCamera);
        }

        this.pipelines.postBatchCamera(camera);

        camera.emit(CameraEvents.POST_RENDER, camera);
    },

    /**
     * Clears the current vertex buffer and updates pipelines.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#preRender
     * @fires Phaser.Renderer.Events#PRE_RENDER
     * @since 3.0.0
     */
    preRender: function ()
    {
        if (this.contextLost) { return; }

        var gl = this.gl;

        //  Make sure we are bound to the main frame buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        if (this.config.clearBeforeRender)
        {
            var clearColor = this.config.backgroundColor;

            gl.clearColor(clearColor.redGL, clearColor.greenGL, clearColor.blueGL, clearColor.alphaGL);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        }

        gl.enable(gl.SCISSOR_TEST);

        this.currentScissor = this.defaultScissor;

        this.scissorStack.length = 0;
        this.scissorStack.push(this.currentScissor);

        if (this.game.scene.customViewports)
        {
            gl.scissor(0, (this.drawingBufferHeight - this.height), this.width, this.height);
        }

        this.currentMask.mask = null;
        this.currentCameraMask.mask = null;
        this.maskStack.length = 0;

        this.emit(Events.PRE_RENDER);
    },

    /**
     * The core render step for a Scene Camera.
     *
     * Iterates through the given array of Game Objects and renders them with the given Camera.
     *
     * This is called by the `CameraManager.render` method. The Camera Manager instance belongs to a Scene, and is invoked
     * by the Scene Systems.render method.
     *
     * This method is not called if `Camera.visible` is `false`, or `Camera.alpha` is zero.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#render
     * @fires Phaser.Renderer.Events#RENDER
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene to render.
     * @param {Phaser.GameObjects.GameObject[]} children - An array of filtered Game Objects that can be rendered by the given Camera.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Scene Camera to render with.
     */
    render: function (scene, children, camera)
    {
        if (this.contextLost) { return; }

        var childCount = children.length;

        this.emit(Events.RENDER, scene, camera);

        //   Apply scissor for cam region + render background color, if not transparent
        this.preRenderCamera(camera);

        //  Nothing to render, so bail out
        if (childCount === 0)
        {
            this.setBlendMode(CONST.BlendModes.NORMAL);

            //  Applies camera effects and pops the scissor, if set
            this.postRenderCamera(camera);

            return;
        }

        //  Reset the current type
        this.currentType = '';

        var current = this.currentMask;

        for (var i = 0; i < childCount; i++)
        {
            this.finalType = (i === childCount - 1);

            var child = children[i];

            var mask = child.mask;

            current = this.currentMask;

            if (current.mask && current.mask !== mask)
            {
                //  Render out the previously set mask
                current.mask.postRenderWebGL(this, current.camera);
            }

            if (mask && current.mask !== mask)
            {
                mask.preRenderWebGL(this, child, camera);
            }

            if (child.blendMode !== this.currentBlendMode)
            {
                this.setBlendMode(child.blendMode);
            }

            var type = child.type;

            if (type !== this.currentType)
            {
                this.newType = true;
                this.currentType = type;
            }

            if (!this.finalType)
            {
                this.nextTypeMatch = (children[i + 1].type === this.currentType);
            }
            else
            {
                this.nextTypeMatch = false;
            }

            child.renderWebGL(this, child, camera);

            this.newType = false;
        }

        current = this.currentMask;

        if (current.mask)
        {
            //  Render out the previously set mask, if it was the last item in the display list
            current.mask.postRenderWebGL(this, current.camera);
        }

        this.setBlendMode(CONST.BlendModes.NORMAL);

        //  Applies camera effects and pops the scissor, if set
        this.postRenderCamera(camera);
    },

    /**
     * The post-render step happens after all Cameras in all Scenes have been rendered.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#postRender
     * @fires Phaser.Renderer.Events#POST_RENDER
     * @since 3.0.0
     */
    postRender: function ()
    {
        if (this.contextLost) { return; }

        this.flush();

        this.emit(Events.POST_RENDER);

        var state = this.snapshotState;

        if (state.callback)
        {
            WebGLSnapshot(this.gl, state);

            state.callback = null;
        }
    },

    /**
     * Disables the STENCIL_TEST but does not change the status
     * of the current stencil mask.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#clearStencilMask
     * @since 3.60.0
     */
    clearStencilMask: function ()
    {
        this.gl.disable(this.gl.STENCIL_TEST);
    },

    /**
     * Restores the current stencil function to the one that was in place
     * before `clearStencilMask` was called.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#restoreStencilMask
     * @since 3.60.0
     */
    restoreStencilMask: function ()
    {
        var gl = this.gl;

        var current = this.getCurrentStencilMask();

        if (current)
        {
            var mask = current.mask;

            gl.enable(gl.STENCIL_TEST);

            //  colorMask + stencilOp(KEEP)

            if (mask.invertAlpha)
            {
                gl.stencilFunc(gl.NOTEQUAL, mask.level, 0xff);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL, mask.level, 0xff);
            }
        }
    },

    /**
     * Schedules a snapshot of the entire game viewport to be taken after the current frame is rendered.
     *
     * To capture a specific area see the `snapshotArea` method. To capture a specific pixel, see `snapshotPixel`.
     *
     * Only one snapshot can be active _per frame_. If you have already called `snapshotPixel`, for example, then
     * calling this method will override it.
     *
     * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer into an ArrayBufferView.
     * It then parses this, copying the contents to a temporary Canvas and finally creating an Image object from it,
     * which is the image returned to the callback provided. All in all, this is a computationally expensive and blocking process,
     * which gets more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#snapshot
     * @since 3.0.0
     *
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot image is created.
     * @param {string} [type='image/png'] - The format of the image to create, usually `image/png` or `image/jpeg`.
     * @param {number} [encoderOptions=0.92] - The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`.
     *
     * @return {this} This WebGL Renderer.
     */
    snapshot: function (callback, type, encoderOptions)
    {
        return this.snapshotArea(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, callback, type, encoderOptions);
    },

    /**
     * Schedules a snapshot of the given area of the game viewport to be taken after the current frame is rendered.
     *
     * To capture the whole game viewport see the `snapshot` method. To capture a specific pixel, see `snapshotPixel`.
     *
     * Only one snapshot can be active _per frame_. If you have already called `snapshotPixel`, for example, then
     * calling this method will override it.
     *
     * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer into an ArrayBufferView.
     * It then parses this, copying the contents to a temporary Canvas and finally creating an Image object from it,
     * which is the image returned to the callback provided. All in all, this is a computationally expensive and blocking process,
     * which gets more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#snapshotArea
     * @since 3.16.0
     *
     * @param {number} x - The x coordinate to grab from. This is based on the game viewport, not the world.
     * @param {number} y - The y coordinate to grab from. This is based on the game viewport, not the world.
     * @param {number} width - The width of the area to grab.
     * @param {number} height - The height of the area to grab.
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot image is created.
     * @param {string} [type='image/png'] - The format of the image to create, usually `image/png` or `image/jpeg`.
     * @param {number} [encoderOptions=0.92] - The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`.
     *
     * @return {this} This WebGL Renderer.
     */
    snapshotArea: function (x, y, width, height, callback, type, encoderOptions)
    {
        var state = this.snapshotState;

        state.callback = callback;
        state.type = type;
        state.encoder = encoderOptions;
        state.getPixel = false;
        state.x = x;
        state.y = y;
        state.width = width;
        state.height = height;

        return this;
    },

    /**
     * Schedules a snapshot of the given pixel from the game viewport to be taken after the current frame is rendered.
     *
     * To capture the whole game viewport see the `snapshot` method. To capture a specific area, see `snapshotArea`.
     *
     * Only one snapshot can be active _per frame_. If you have already called `snapshotArea`, for example, then
     * calling this method will override it.
     *
     * Unlike the other two snapshot methods, this one will return a `Color` object containing the color data for
     * the requested pixel. It doesn't need to create an internal Canvas or Image object, so is a lot faster to execute,
     * using less memory.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#snapshotPixel
     * @since 3.16.0
     *
     * @param {number} x - The x coordinate of the pixel to get. This is based on the game viewport, not the world.
     * @param {number} y - The y coordinate of the pixel to get. This is based on the game viewport, not the world.
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot pixel data is extracted.
     *
     * @return {this} This WebGL Renderer.
     */
    snapshotPixel: function (x, y, callback)
    {
        this.snapshotArea(x, y, 1, 1, callback);

        this.snapshotState.getPixel = true;

        return this;
    },

    /**
     * Takes a snapshot of the given area of the given frame buffer.
     *
     * Unlike the other snapshot methods, this one is processed immediately and doesn't wait for the next render.
     *
     * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer into an ArrayBufferView.
     * It then parses this, copying the contents to a temporary Canvas and finally creating an Image object from it,
     * which is the image returned to the callback provided. All in all, this is a computationally expensive and blocking process,
     * which gets more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#snapshotFramebuffer
     * @since 3.19.0
     *
     * @param {WebGLFramebuffer} framebuffer - The framebuffer to grab from.
     * @param {number} bufferWidth - The width of the framebuffer.
     * @param {number} bufferHeight - The height of the framebuffer.
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot image is created.
     * @param {boolean} [getPixel=false] - Grab a single pixel as a Color object, or an area as an Image object?
     * @param {number} [x=0] - The x coordinate to grab from. This is based on the framebuffer, not the world.
     * @param {number} [y=0] - The y coordinate to grab from. This is based on the framebuffer, not the world.
     * @param {number} [width=bufferWidth] - The width of the area to grab.
     * @param {number} [height=bufferHeight] - The height of the area to grab.
     * @param {string} [type='image/png'] - The format of the image to create, usually `image/png` or `image/jpeg`.
     * @param {number} [encoderOptions=0.92] - The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`.
     *
     * @return {this} This WebGL Renderer.
     */
    snapshotFramebuffer: function (framebuffer, bufferWidth, bufferHeight, callback, getPixel, x, y, width, height, type, encoderOptions)
    {
        if (getPixel === undefined) { getPixel = false; }
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = bufferWidth; }
        if (height === undefined) { height = bufferHeight; }

        if (type === 'pixel')
        {
            getPixel = true;
            type = 'image/png';
        }

        var currentFramebuffer = this.currentFramebuffer;

        this.snapshotArea(x, y, width, height, callback, type, encoderOptions);

        var state = this.snapshotState;

        state.getPixel = getPixel;

        state.isFramebuffer = true;
        state.bufferWidth = bufferWidth;
        state.bufferHeight = bufferHeight;

        //  Ensure they're not trying to grab an area larger than the framebuffer
        state.width = Math.min(state.width, bufferWidth);
        state.height = Math.min(state.height, bufferHeight);

        this.setFramebuffer(framebuffer);

        WebGLSnapshot(this.gl, state);

        this.setFramebuffer(currentFramebuffer);

        state.callback = null;
        state.isFramebuffer = false;

        return this;
    },

    /**
     * Creates a new WebGL Texture based on the given Canvas Element.
     *
     * If the `dstTexture` parameter is given, the WebGL Texture is updated, rather than created fresh.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#canvasToTexture
     * @since 3.0.0
     *
     * @param {HTMLCanvasElement} srcCanvas - The Canvas to create the WebGL Texture from
     * @param {WebGLTexture} [dstTexture] - The destination WebGL Texture to set.
     * @param {boolean} [noRepeat=false] - Should this canvas be allowed to set `REPEAT` (such as for Text objects?)
     * @param {boolean} [flipY=false] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     *
     * @return {WebGLTexture} The newly created, or updated, WebGL Texture.
     */
    canvasToTexture: function (srcCanvas, dstTexture, noRepeat, flipY)
    {
        if (noRepeat === undefined) { noRepeat = false; }
        if (flipY === undefined) { flipY = false; }

        if (!dstTexture)
        {
            return this.createCanvasTexture(srcCanvas, noRepeat, flipY);
        }
        else
        {
            return this.updateCanvasTexture(srcCanvas, dstTexture, flipY);
        }
    },

    /**
     * Creates a new WebGL Texture based on the given Canvas Element.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createCanvasTexture
     * @since 3.20.0
     *
     * @param {HTMLCanvasElement} srcCanvas - The Canvas to create the WebGL Texture from.
     * @param {boolean} [noRepeat=false] - Should this canvas be allowed to set `REPEAT` (such as for Text objects?)
     * @param {boolean} [flipY=false] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     *
     * @return {WebGLTexture} The newly created WebGL Texture.
     */
    createCanvasTexture: function (srcCanvas, noRepeat, flipY)
    {
        if (noRepeat === undefined) { noRepeat = false; }
        if (flipY === undefined) { flipY = false; }

        var gl = this.gl;
        var minFilter = gl.NEAREST;
        var magFilter = gl.NEAREST;

        var width = srcCanvas.width;
        var height = srcCanvas.height;

        var wrapping = gl.CLAMP_TO_EDGE;

        var pow = IsSizePowerOfTwo(width, height);

        if (!noRepeat && pow)
        {
            wrapping = gl.REPEAT;
        }

        if (this.config.antialias)
        {
            minFilter = (pow && this.mipmapFilter) ? this.mipmapFilter : gl.LINEAR;
            magFilter = gl.LINEAR;
        }

        return this.createTexture2D(0, minFilter, magFilter, wrapping, wrapping, gl.RGBA, srcCanvas, width, height, true, false, flipY);
    },

    /**
     * Updates a WebGL Texture based on the given Canvas Element.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#updateCanvasTexture
     * @since 3.20.0
     *
     * @param {HTMLCanvasElement} srcCanvas - The Canvas to update the WebGL Texture from.
     * @param {WebGLTexture} dstTexture - The destination WebGL Texture to update.
     * @param {boolean} [flipY=false] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     *
     * @return {WebGLTexture} The updated WebGL Texture.
     */
    updateCanvasTexture: function (srcCanvas, dstTexture, flipY)
    {
        if (flipY === undefined) { flipY = false; }

        var gl = this.gl;

        var width = srcCanvas.width;
        var height = srcCanvas.height;

        if (width > 0 && height > 0)
        {
            gl.activeTexture(gl.TEXTURE0);
            var currentTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
            gl.bindTexture(gl.TEXTURE_2D, dstTexture);

            if (flipY)
            {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            }

            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);

            dstTexture.width = width;
            dstTexture.height = height;

            if (currentTexture)
            {
                gl.bindTexture(gl.TEXTURE_2D, currentTexture);
            }
        }

        return dstTexture;
    },

    /**
     * Creates a new WebGL Texture based on the given HTML Video Element.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createVideoTexture
     * @since 3.20.0
     *
     * @param {HTMLVideoElement} srcVideo - The Video to create the WebGL Texture from
     * @param {boolean} [noRepeat=false] - Should this canvas be allowed to set `REPEAT`?
     * @param {boolean} [flipY=false] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     *
     * @return {WebGLTexture} The newly created WebGL Texture.
     */
    createVideoTexture: function (srcVideo, noRepeat, flipY)
    {
        if (noRepeat === undefined) { noRepeat = false; }
        if (flipY === undefined) { flipY = false; }

        var gl = this.gl;
        var minFilter = gl.NEAREST;
        var magFilter = gl.NEAREST;

        var width = srcVideo.videoWidth;
        var height = srcVideo.videoHeight;

        var wrapping = gl.CLAMP_TO_EDGE;

        var pow = IsSizePowerOfTwo(width, height);

        if (!noRepeat && pow)
        {
            wrapping = gl.REPEAT;
        }

        if (this.config.antialias)
        {
            minFilter = (pow && this.mipmapFilter) ? this.mipmapFilter : gl.LINEAR;
            magFilter = gl.LINEAR;
        }

        return this.createTexture2D(0, minFilter, magFilter, wrapping, wrapping, gl.RGBA, srcVideo, width, height, true, true, flipY);
    },

    /**
     * Updates a WebGL Texture based on the given HTML Video Element.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#updateVideoTexture
     * @since 3.20.0
     *
     * @param {HTMLVideoElement} srcVideo - The Video to update the WebGL Texture with.
     * @param {WebGLTexture} dstTexture - The destination WebGL Texture to update.
     * @param {boolean} [flipY=false] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     *
     * @return {WebGLTexture} The updated WebGL Texture.
     */
    updateVideoTexture: function (srcVideo, dstTexture, flipY)
    {
        if (flipY === undefined) { flipY = false; }

        var gl = this.gl;

        var width = srcVideo.videoWidth;
        var height = srcVideo.videoHeight;

        if (width > 0 && height > 0)
        {
            gl.activeTexture(gl.TEXTURE0);
            var currentTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
            gl.bindTexture(gl.TEXTURE_2D, dstTexture);

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcVideo);

            dstTexture.width = width;
            dstTexture.height = height;

            if (currentTexture)
            {
                gl.bindTexture(gl.TEXTURE_2D, currentTexture);
            }
        }

        return dstTexture;
    },

    /**
     * Sets the minification and magnification filter for a texture.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setTextureFilter
     * @since 3.0.0
     *
     * @param {number} texture - The texture to set the filter for.
     * @param {number} filter - The filter to set. 0 for linear filtering, 1 for nearest neighbor (blocky) filtering.
     *
     * @return {this} This WebGL Renderer instance.
     */
    setTextureFilter: function (texture, filter)
    {
        var gl = this.gl;
        var glFilter = [ gl.LINEAR, gl.NEAREST ][filter];

        gl.activeTexture(gl.TEXTURE0);

        var currentTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter);

        if (currentTexture)
        {
            gl.bindTexture(gl.TEXTURE_2D, currentTexture);
        }

        return this;
    },

    /**
     * Returns the largest texture size (either width or height) that can be created.
     * Note that VRAM may not allow a texture of any given size, it just expresses
     * hardware / driver support for a given size.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#getMaxTextureSize
     * @since 3.8.0
     *
     * @return {number} The maximum supported texture size.
     */
    getMaxTextureSize: function ()
    {
        return this.config.maxTextureSize;
    },

    /**
     * Destroy this WebGLRenderer, cleaning up all related resources such as pipelines, native textures, etc.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.canvas.removeEventListener('webglcontextlost', this.contextLostHandler, false);

        this.maskTarget.destroy();
        this.maskSource.destroy();

        this.pipelines.destroy();

        this.removeAllListeners();

        this.fboStack = [];
        this.maskStack = [];
        this.extensions = {};
        this.textureIndexes = [];

        this.gl = null;
        this.game = null;
        this.canvas = null;
        this.contextLost = true;
        this.currentMask = null;
        this.currentCameraMask = null;

        if (DEBUG)
        {
            this.spector = null;
        }
    }

});

module.exports = WebGLRenderer;
