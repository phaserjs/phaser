/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArrayEach = require('../../utils/array/Each');
var ArrayRemove = require('../../utils/array/Remove');
var Class = require('../../utils/Class');
var CONST = require('../../const');
var EventEmitter = require('eventemitter3');
var Events = require('../events');
var IsSizePowerOfTwo = require('../../math/pow2/IsSizePowerOfTwo');
var Matrix4 = require('../../math/Matrix4');
var NOOP = require('../../utils/NOOP');
var DrawingContext = require('./DrawingContext');
var ScaleEvents = require('../../scale/events');
var TextureEvents = require('../../textures/events');
var Utils = require('./Utils');
var WebGLSnapshot = require('../snapshot/WebGLSnapshot');
var WebGLBufferWrapper = require('./wrappers/WebGLBufferWrapper');
var WebGLGlobalWrapper = require('./wrappers/WebGLGlobalWrapper');
var WebGLProgramWrapper = require('./wrappers/WebGLProgramWrapper');
var WebGLShaderSetterWrapper = require('./wrappers/WebGLShaderSetterWrapper');
var WebGLTextureWrapper = require('./wrappers/WebGLTextureWrapper');
var WebGLTextureUnitsWrapper = require('./wrappers/WebGLTextureUnitsWrapper');
var WebGLFramebufferWrapper = require('./wrappers/WebGLFramebufferWrapper');
var WebGLVAOWrapper = require('./wrappers/WebGLVAOWrapper');
var WebGLBlendParametersFactory = require('./parameters/WebGLBlendParametersFactory');
var WebGLGlobalParametersFactory = require('./parameters/WebGLGlobalParametersFactory');
var RenderNodeManager = require('./renderNodes/RenderNodeManager');
var DrawingContextPool = require('./DrawingContextPool');
var ShaderProgramFactory = require('./ShaderProgramFactory');

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
 * WebGLRenderer and/or built-in RenderNodes.
 *
 * Persistent WebGL objects are stored in "wrappers" which are created by the WebGLRenderer.
 * Wrappers contain WebGL objects and metadata about those objects.
 * This can be used to recreate the WebGL state after a context loss.
 * Prefer to pass references to the wrappers, rather than the raw WebGL objects,
 * as the raw objects may be destroyed or replaced at any time.
 * Extract them only when needed.
 *
 * WebGL state, such as blend mode or texture units, is managed by the WebGLRenderer.
 * Use `WebGLRenderer.glWrapper` to manage the current state
 * rather than setting it directly on the WebGLRenderingContext.
 * The state wrapper will ensure that the state is only set if it has changed,
 * and can restore the state after a context loss or external render call.
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
            pathDetailThreshold: gameConfig.pathDetailThreshold,
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
         * An instance of the RenderNodeManager class which handles all
         * RenderNodes used by the WebGLRenderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#renderNodes
         * @type {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager}
         * @since 4.0.0
         */
        this.renderNodes = null;

        /**
         * The RenderNode to use for rendering individual cameras.
         *
         * This will be populated during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#cameraRenderNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.RenderNode}
         * @since 4.0.0
         */
        this.cameraRenderNode = null;

        /**
         * The shader program factory for managing variant shaders.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#shaderProgramFactory
         * @type {Phaser.Renderer.WebGL.ShaderProgramFactory}
         * @since 4.0.0
         */
        this.shaderProgramFactory = new ShaderProgramFactory(this);

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
         * @type {Phaser.Types.Renderer.WebGL.WebGLBlendParameters[]}
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
            bufferHeight: 0,
            unpremultiplyAlpha: true
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
         * A list containing the indices of all available texture units.
         * This is populated during the `init` method.
         * It is used internally to connect texture units to shaders.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#textureUnitIndices
         * @type {number[]}
         * @since 4.0.0
         */
        this.textureUnitIndices = [];

        /**
         * A list of all WebGLBufferWrappers that have been created by this renderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#glBufferWrappers
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper[]}
         * @since 3.80.0
         */
        this.glBufferWrappers = [];

        /**
         * A list of all WebGLProgramWrappers that have been created by this renderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#glProgramWrappers
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper[]}
         * @since 3.80.0
         */
        this.glProgramWrappers = [];

        /**
         * A list of all WebGLTextureWrappers that have been created by this renderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#glTextureWrappers
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]}
         * @since 3.80.0
         */
        this.glTextureWrappers = [];

        /**
         * A list of all WebGLFramebufferWrappers that have been created by this renderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#glFramebufferWrappers
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper[]}
         * @since 3.80.0
         */
        this.glFramebufferWrappers = [];

        /**
         * A list of all WebGLVAOWrappers that have been created by this renderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#glVAOWrappers
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper[]}
         * @since 4.0.0
         */
        this.glVAOWrappers = [];

        /**
         * A generic quad index buffer. This is a READ-ONLY buffer.
         * It describes the four corners of a quad,
         * a structure which is used in several places in the renderer.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#genericQuadIndexBuffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 4.0.0
         * @readonly
         */
        this.genericQuadIndexBuffer = null;

        /**
         * The DrawingContext used for the base canvas.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#baseDrawingContext
         * @type {Phaser.Renderer.WebGL.DrawingContext}
         * @since 4.0.0
         */
        this.baseDrawingContext = null;

        /**
         * The camera currently being rendered by `render`.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#currentViewCamera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @since 4.0.0
         * @default null
         */
        this.currentViewCamera = null;

        /**
         * A pool of DrawingContexts which can be reused.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#drawingContextPool
         * @type {Phaser.Renderer.WebGL.DrawingContextPool}
         * @since 4.0.0
         */
        this.drawingContextPool = new DrawingContextPool(this, 1000, 1024);

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
         * The previous contextLostHandler that was in use.
         * This is set when `setContextHandlers` is called.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#previousContextLostHandler
         * @type {function}
         * @since 3.85.0
         */
        this.previousContextLostHandler = NOOP;

        /**
         * The previous contextRestoredHandler that was in use.
         * This is set when `setContextHandlers` is called.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#previousContextRestoredHandler
         * @type {function}
         * @since 3.85.0
         */
        this.previousContextRestoredHandler = NOOP;

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
         * The current WebGLRenderingContext state.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#glWrapper
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper}
         * @default null
         * @since 4.0.0
         */
        this.glWrapper = null;

        /**
         * The current WebGL texture units in use.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#glTextureUnits
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureUnitsWrapper}
         * @default null
         * @since 4.0.0
         */
        this.glTextureUnits = null;

        /**
         * Array of strings that indicate which WebGL extensions are supported by the browser.
         * This is populated in the `setExtensions` method.
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
         * This is populated in the `setExtensions` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#instancedArraysExtension
         * @type {ANGLE_instanced_arrays}
         * @default null
         * @since 3.50.0
         */
        this.instancedArraysExtension = null;

        /**
         * If the browser supports the `KHR_parallel_shader_compile` extension,
         * this property will hold a reference to the glExtension for it.
         *
         * This is populated in the `setExtensions` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#parallelShaderCompileExtension
         * @type {KHR_parallel_shader_compile}
         * @default null
         * @since 4.0.0
         */
        this.parallelShaderCompileExtension = null;

        /**
         * If the browser supports the `OES_standard_derivatives` extension,
         * and the `smoothPixelArt` config option is true,
         * this property will hold a reference to the glExtension for it.
         *
         * This is populated in the `setExtensions` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#standardDerivativesExtension
         * @type {OES_standard_derivatives}
         * @default null
         * @since 4.0.0
         */
        this.standardDerivativesExtension = null;

        /**
         * If the browser supports the `OES_vertex_array_object` extension, this property will hold
         * a reference to the glExtension for it.
         *
         * This is populated in the `setExtensions` method.
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
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @readonly
         * @since 3.12.0
         */
        this.blankTexture = null;

        /**
         * A blank 1x1 #7f7fff texture, a flat normal map,
         * as used by the Graphics system where needed.
         * This is set in the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#normalTexture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @readonly
         * @since 3.80.0
         */
        this.normalTexture = null;

        /**
         * A pure white 4x4 texture, as used by the Graphics system where needed.
         * This is set in the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#whiteTexture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @readonly
         * @since 3.50.0
         */
        this.whiteTexture = null;

        /**
         * Internal gl function mapping for uniform and attribute look-up.
         *
         * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
         *
         * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#shaderSetters
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLShaderSetterWrapper}
         * @since 4.0.0
         */
        this.shaderSetters = null;

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
         * Has this renderer fully booted yet?
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#isBooted
         * @type {boolean}
         * @since 3.50.0
         */
        this.isBooted = false;

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
         * The cached flipY state of the Projection matrix.
         *
         * This is usually `false`, preserving WebGL coordinate space.
         *
         * @name Phaser.Renderer.WebGL.WebGLRenderer#projectionFlipY
         * @type {boolean}
         * @since 4.0.0
         */
        this.projectionFlipY = false;

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

        this.setExtensions();

        this.setContextHandlers();

        //  Set it back into the Game, so developers can access it from there too
        game.context = gl;

        for (var i = 0; i <= 27; i++)
        {
            this.blendModes.push(WebGLBlendParametersFactory.createCombined(this));
        }

        //  ADD
        this.blendModes[1].func = [ gl.ONE, gl.DST_ALPHA, gl.ONE, gl.DST_ALPHA ];

        //  MULTIPLY
        this.blendModes[2].func = [ gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA ];

        //  SCREEN
        this.blendModes[3].func = [ gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_COLOR ];

        //  ERASE
        this.blendModes[17].equation = [ gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_REVERSE_SUBTRACT ];
        this.blendModes[17].func = [ gl.ZERO, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE_MINUS_SRC_ALPHA ];

        this.glFormats = [ gl.BYTE, gl.SHORT, gl.UNSIGNED_BYTE, gl.UNSIGNED_SHORT, gl.FLOAT ];

        this.shaderSetters = new WebGLShaderSetterWrapper(this);

        if (!config.maxTextures || config.maxTextures === -1)
        {
            config.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        }

        if (!config.maxTextureSize)
        {
            config.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        }

        this.compression = this.getCompressedTextures();

        //  Setup initial WebGL state
        this.glWrapper = new WebGLGlobalWrapper(this);
        this.glWrapper.update(undefined, true);

        gl.clearColor(clearColor.redGL, clearColor.greenGL, clearColor.blueGL, clearColor.alphaGL);

        //  Mipmaps
        var validMipMaps = [ 'NEAREST', 'LINEAR', 'NEAREST_MIPMAP_NEAREST', 'LINEAR_MIPMAP_NEAREST', 'NEAREST_MIPMAP_LINEAR', 'LINEAR_MIPMAP_LINEAR' ];

        if (validMipMaps.indexOf(config.mipmapFilter) !== -1)
        {
            this.mipmapFilter = gl[config.mipmapFilter];
        }

        //  Check maximum supported textures
        this.maxTextures = Utils.checkShaderMax(gl, config.maxTextures);
        for (i = 0; i < this.maxTextures; i++)
        {
            this.textureUnitIndices.push(i);
        }

        this.glTextureUnits = new WebGLTextureUnitsWrapper(this);

        this.projectionMatrix = new Matrix4().identity();

        game.textures.once(TextureEvents.READY, this.boot, this);

        return this;
    },

    /**
     * Internal boot handler.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#boot
     * @private
     * @since 3.11.0
     */
    boot: function ()
    {
        var game = this.game;
        var gl = this.gl;

        var baseSize = game.scale.baseSize;

        var width = baseSize.width;
        var height = baseSize.height;

        this.width = width;
        this.height = height;

        this.isBooted = true;

        // Provision the generic quad index buffer.
        // Ensure that there is no VAO bound, because the following index buffer
        // will modify any currently bound VAO.
        this.glWrapper.updateVAO({ vao: null });
        this.genericQuadIndexBuffer = this.createIndexBuffer(new Uint16Array([ 0, 1, 2, 3 ]), gl.STATIC_DRAW);

        // Set up render nodes.
        this.renderNodes = new RenderNodeManager(this);

        this.cameraRenderNode = this.renderNodes.getNode('Camera');

        //  Set-up default textures, fbo and scissor

        this.blankTexture = game.textures.getFrame('__DEFAULT').glTexture;
        this.normalTexture = game.textures.getFrame('__NORMAL').glTexture;
        this.whiteTexture = game.textures.getFrame('__WHITE').glTexture;

        // Set up drawing contexts.
        this.baseDrawingContext = new DrawingContext(this,
            {
                autoClear: true,
                useCanvas: true,
                clearColor: [
                    this.config.backgroundColor.redGL,
                    this.config.backgroundColor.greenGL,
                    this.config.backgroundColor.blueGL,
                    this.config.backgroundColor.alphaGL
                ]
            }
        );
        this.on(Events.RESIZE, this.baseDrawingContext.resize, this.baseDrawingContext);

        game.scale.on(ScaleEvents.RESIZE, this.onResize, this);

        this.resize(width, height);
    },

    /**
     * Queries the GL context to get the supported extensions.
     * 
     * Then sets them into the `supportedExtensions`, `instancedArraysExtension` and `vaoExtension` properties.
     * 
     * Called automatically during the `init` method.
     * 
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setExtensions
     * @since 3.85.2
     */
    setExtensions: function ()
    {
        var gl = this.gl;
        var game = this.game;

        var exts = gl.getSupportedExtensions();

        this.supportedExtensions = exts;

        var angleString = 'ANGLE_instanced_arrays';

        this.instancedArraysExtension = (exts.indexOf(angleString) > -1) ? gl.getExtension(angleString) : null;

        if (game.config.skipUnreadyShaders)
        {
            var parallelShaderCompileString = 'KHR_parallel_shader_compile';

            this.parallelShaderCompileExtension = (exts.indexOf(parallelShaderCompileString) > -1) ? gl.getExtension(parallelShaderCompileString) : null;

            if (!this.parallelShaderCompileExtension)
            {
                // Disable the option if the extension is not supported.
                game.config.skipUnreadyShaders = false;
            }
        }

        var vaoString = 'OES_vertex_array_object';

        this.vaoExtension = (exts.indexOf(vaoString) > -1) ? gl.getExtension(vaoString) : null;

        if (game.config.smoothPixelArt)
        {
            var stdDerivativesString = 'OES_standard_derivatives';

            this.standardDerivativesExtension = (exts.indexOf(stdDerivativesString) > -1) ? gl.getExtension(stdDerivativesString) : null;
        }

        // Make WebGL2 core features which were extensions available on the WebGL1 context.
        // This allows us to use a WebGL2 context.
        if (gl instanceof WebGLRenderingContext)
        {
            // Incorporate instanced arrays.
            if (this.instancedArraysExtension)
            {
                gl.vertexAttribDivisor = this.instancedArraysExtension.vertexAttribDivisorANGLE.bind(this.instancedArraysExtension);
                gl.drawArraysInstanced = this.instancedArraysExtension.drawArraysInstancedANGLE.bind(this.instancedArraysExtension);
                gl.drawElementsInstanced = this.instancedArraysExtension.drawElementsInstancedANGLE.bind(this.instancedArraysExtension);
            }
            else
            {
                throw new Error('ANGLE_instanced_arrays extension not supported. Required for rendering.');
            }

            // Incorporate vertex array objects.
            if (this.vaoExtension)
            {
                gl.createVertexArray = this.vaoExtension.createVertexArrayOES.bind(this.vaoExtension);
                gl.bindVertexArray = this.vaoExtension.bindVertexArrayOES.bind(this.vaoExtension);
                gl.deleteVertexArray = this.vaoExtension.deleteVertexArrayOES.bind(this.vaoExtension);
                gl.isVertexArray = this.vaoExtension.isVertexArrayOES.bind(this.vaoExtension);
            }
            else
            {
                throw new Error('OES_vertex_array_object extension not supported. Required for rendering.');
            }

            // Incorporate standard derivatives.
            if (this.standardDerivativesExtension)
            {
                gl.FRAGMENT_SHADER_DERIVATIVE_HINT = this.standardDerivativesExtension.FRAGMENT_SHADER_DERIVATIVE_HINT_OES;
            }
            else if (game.config.smoothPixelArt)
            {
                throw new Error('OES_standard_derivatives extension not supported. Cannot use smoothPixelArt.');
            }
        }
    },

    /**
     * Sets the handlers that are called when WebGL context is lost or restored by the browser.
     * 
     * The default handlers are referenced via the properties `WebGLRenderer.contextLostHandler` and `WebGLRenderer.contextRestoredHandler`.
     * By default, these map to the methods `WebGLRenderer.dispatchContextLost` and `WebGLRenderer.dispatchContextRestored`.
     * 
     * You can override these handlers with your own via this method.
     * 
     * If you do override them, make sure that your handlers invoke the methods `WebGLRenderer.dispatchContextLost` and `WebGLRenderer.dispatchContextRestored` in due course, otherwise the renderer will not be able to restore itself fully.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setContextHandlers
     * @since 3.85.0
     *
     * * @param {function} [contextLost] - Custom handler for responding to the WebGL context lost event. Set as `undefined` to use the default handler.
     * @param {function} [contextRestored] - Custom handler for responding to the WebGL context restored event. Set as `undefined` to use the default handler.
     */
    setContextHandlers: function (contextLost, contextRestored)
    {
        if (this.previousContextLostHandler)
        {
            this.canvas.removeEventListener('webglcontextlost', this.previousContextLostHandler, false);
        }
        if (this.previousContextRestoredHandler)
        {
            this.canvas.removeEventListener('webglcontextlost', this.previousContextRestoredHandler, false);
        }

        if (typeof contextLost === 'function')
        {
            this.contextLostHandler = contextLost.bind(this);
        }
        else
        {
            this.contextLostHandler = this.dispatchContextLost.bind(this);
        }

        if (typeof contextRestored === 'function')
        {
            this.contextRestoredHandler = contextRestored.bind(this);
        }
        else
        {
            this.contextRestoredHandler = this.dispatchContextRestored.bind(this);
        }

        this.canvas.addEventListener('webglcontextlost', this.contextLostHandler, false);
        this.canvas.addEventListener('webglcontextrestored', this.contextRestoredHandler, false);

        this.previousContextLostHandler = this.contextLostHandler;
        this.previousContextRestoredHandler = this.contextRestoredHandler;
    },

    /**
     * This method is called when the WebGL context is lost. By default this is bound to the property `WebGLRenderer.contextLostHandler`.
     * If you override the context loss handler via the `setContextHandlers` method then be sure to invoke this method in due course.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#dispatchContextLost
     * @since 3.85.0
     * 
     * @param {WebGLContextEvent } event - The WebGL context lost Event.
     */
    dispatchContextLost: function (event)
    {
        this.contextLost = true;

        if (console)
        {
            console.warn('WebGL Context lost. Renderer disabled');
        }

        this.emit(Events.LOSE_WEBGL, this);

        event.preventDefault();
    },

    /**
     * This method is called when the WebGL context is restored. By default this is bound to the property `WebGLRenderer.contextRestoredHandler`.
     * If you override the context restored handler via the `setContextHandlers` method then be sure to invoke this method in due course.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#dispatchContextRestored
     * @since 3.85.0
     * 
     * @param {WebGLContextEvent } event - The WebGL context restored Event.

     */
    dispatchContextRestored: function (event)
    {
        var gl = this.gl;

        if (gl.isContextLost())
        {
            if (console)
            {
                console.log('WebGL Context restored, but context is still lost');
            }

            return;
        }

        // Restore GL extensions.
        this.setExtensions();

        // Force update the GL state.
        this.glWrapper.update(WebGLGlobalParametersFactory.getDefault(this), true);
        this.glTextureUnits.init();

        // Re-enable compressed texture formats.
        this.compression = this.getCompressedTextures();

        // Restore wrapped GL objects.
        // Order matters, as some wrappers depend on others.
        var wrapperCreateResource = function (wrapper)
        {
            wrapper.createResource();
        };
        ArrayEach(this.glTextureWrappers, wrapperCreateResource);
        ArrayEach(this.glBufferWrappers, wrapperCreateResource);
        ArrayEach(this.glFramebufferWrappers, wrapperCreateResource);
        ArrayEach(this.glProgramWrappers, wrapperCreateResource);
        ArrayEach(this.glVAOWrappers, wrapperCreateResource);

        // Restore texture unit assignment.
        this.glTextureUnits.bindUnits(this.glTextureUnits.units, true);

        // Apply resize.
        this.resize(this.game.scale.baseSize.width, this.game.scale.baseSize.height);

        // Context has been restored.

        this.contextLost = false;

        if (console)
        {
            console.warn('WebGL Context restored. Renderer running again.');
        }

        this.emit(Events.RESTORE_WEBGL, this);

        event.preventDefault();
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

        this.drawingBufferHeight = gl.drawingBufferHeight;

        this.glWrapper.update({
            scissor: {
                box: [ 0, (gl.drawingBufferHeight - height), width, height ]
            },
            viewport: [ 0, 0, width, height ]
        });

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
        var extEXTString = 'EXT_texture_compression_';

        var hasExt = function (gl, format)
        {
            var results = gl.getExtension(extString + format) || gl.getExtension(wkExtString + format) || gl.getExtension(extEXTString + format);

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
     * @param {boolean} [flipY=false] - Should the Y axis be flipped?
     *
     * @return {this} This WebGLRenderer instance.
     */
    setProjectionMatrix: function (width, height, flipY)
    {
        if (width !== this.projectionWidth || height !== this.projectionHeight || flipY !== this.projectionFlipY)
        {
            this.projectionWidth = width;
            this.projectionHeight = height;
            this.projectionFlipY = !!flipY;

            if (flipY)
            {
                this.projectionMatrix.ortho(0, width, 0, height, -1000, 1000);
            }
            else
            {
                this.projectionMatrix.ortho(0, width, height, 0, -1000, 1000);
            }
        }

        return this;
    },

    /**
     * Sets the Projection Matrix of this renderer to match the given drawing context.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setProjectionMatrixFromDrawingContext
     * @since 4.0.0
     *
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The drawing context to set the projection matrix from.
     *
     * @return {this} This WebGLRenderer instance.
     */
    setProjectionMatrixFromDrawingContext: function (drawingContext)
    {
        return this.setProjectionMatrix(
            drawingContext.width,
            drawingContext.height,
            false
        );
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
        var index = this.blendModes.push(WebGLBlendParametersFactory.createCombined(this, true, undefined, equation, func[0], func[1])) - 1;

        return index - 1;
    },

    /**
     * Updates the function bound to a given custom blend mode.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#updateBlendMode
     * @since 3.0.0
     *
     * @param {number} index - The index of the custom blend mode.
     * @param {GLenum[]} func - The function to use for the blend mode. Specify either 2 elements for src and dest, or 4 elements for separate srcRGB, destRGB, srcAlpha, destAlpha.
     * @param {GLenum|GLenum[]} equation - The equation to use for the blend mode. This can be either a single equation for both source and destination, or an array containing separate equations for source and destination.
     *
     * @return {this} This WebGLRenderer instance.
     */
    updateBlendMode: function (index, func, equation)
    {
        if (index > 17 && this.blendModes[index])
        {
            var blendMode = this.blendModes[index];
            if (func.length === 2)
            {
                blendMode.func = [ func[0], func[1], func[0], func[1] ];
            }
            else
            {
                blendMode.func = [ func[0], func[1], func[2], func[3] ];
            }

            if (typeof equation === 'number')
            {
                blendMode.equation = [ equation, equation ];
            }
            else
            {
                blendMode.equation = [ equation[0], equation[1] ];
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
     * Clear the current framebuffer to the given color.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#clearFramebuffer
     * @since 4.0.0
     * @param {number[]} [color] - The color to clear to. Four values in the range 0.0 - 1.0.
     * @param {number} [stencil] - The stencil value to clear to.
     * @param {number} [depth] - The depth value to clear to. Currently, this is not set, and only determines whether the depth buffer is cleared.
     */
    clearFramebuffer: function (color, stencil, depth)
    {
        var gl = this.gl;
        var bits = 0;
        if (color)
        {
            this.glWrapper.updateColorClearValue({ colorClearValue: color });
            bits = bits | gl.COLOR_BUFFER_BIT;
        }
        if (stencil !== undefined)
        {
            this.glWrapper.updateStencilClear({ stencil: { clear: stencil }});
            bits = bits | gl.STENCIL_BUFFER_BIT;
        }
        if (depth !== undefined)
        {
            bits = bits | gl.DEPTH_BUFFER_BIT;
        }
        gl.clear(bits);
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
     * @param {boolean} [flipY=true] - Sets the `UNPACK_FLIP_Y_WEBGL` flag the WebGL Texture uses during upload.
     *
     * @return {?Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The WebGLTextureWrapper that was created, or `null` if it couldn't be created.
     */
    createTextureFromSource: function (source, width, height, scaleMode, forceClamp, flipY)
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
            var isCompressed = source && source.compressed;
            var isMip = (!isCompressed && pow) || (isCompressed && source.mipmaps.length > 1);

            // Filters above LINEAR only work with MIPmaps.
            // These are only generated for power of two (POT) textures.
            // Compressed textures with mipmaps are always POT,
            // but POT compressed textures might not have mipmaps.
            minFilter = (this.mipmapFilter && isMip) ? this.mipmapFilter : gl.LINEAR;
            magFilter = gl.LINEAR;
        }

        if (!source && typeof width === 'number' && typeof height === 'number')
        {
            texture = this.createTexture2D(0, minFilter, magFilter, wrap, wrap, gl.RGBA, null, width, height, undefined, undefined, flipY);
        }
        else
        {
            texture = this.createTexture2D(0, minFilter, magFilter, wrap, wrap, gl.RGBA, source, undefined, undefined, undefined, undefined, flipY);
        }

        return texture;
    },

    /**
     * A wrapper for creating a WebGLTextureWrapper. If no pixel data is passed it will create an empty texture.
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
     * @param {?number} width - Width of the texture in pixels. If not supplied, it must be derived from `pixels`.
     * @param {?number} height - Height of the texture in pixels. If not supplied, it must be derived from `pixels`.
     * @param {boolean} [pma=true] - Does the texture have premultiplied alpha?
     * @param {boolean} [forceSize=false] - If `true` it will use the width and height passed to this method, regardless of the pixels dimension.
     * @param {boolean} [flipY=true] - Sets the `UNPACK_FLIP_Y_WEBGL` flag the WebGL Texture uses during upload.
     *
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The WebGLTextureWrapper that was created.
     */
    createTexture2D: function (mipLevel, minFilter, magFilter, wrapT, wrapS, format, pixels, width, height, pma, forceSize, flipY)
    {
        if (typeof width !== 'number') { width = pixels ? pixels.width : 1; }
        if (typeof height !== 'number') { height = pixels ? pixels.height : 1; }

        var texture = new WebGLTextureWrapper(this, mipLevel, minFilter, magFilter, wrapT, wrapS, format, pixels, width, height, pma, forceSize, flipY);

        this.glTextureWrappers.push(texture);

        return texture;
    },

    /**
     * Creates a WebGL Framebuffer object and optionally binds a depth stencil render buffer.
     *
     * This will unbind any currently bound framebuffer.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createFramebuffer
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper|Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]|null} renderTexture - The color texture where the color pixels are written. Specify an array for multiple color attachments, but WebGL1 only supports the first by default. Specify `null` to create a framebuffer for the base canvas.
     * @param {boolean} [addStencilBuffer=false] - Create a Renderbuffer for the stencil?
     * @param {boolean} [addDepthBuffer=false] - Create a Renderbuffer for the depth?
     *
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper} Wrapped framebuffer which is safe to use with the renderer.
     */
    createFramebuffer: function (renderTexture, addStencilBuffer, addDepthBuffer)
    {
        if (!Array.isArray(renderTexture) && renderTexture !== null)
        {
            renderTexture = [ renderTexture ];
        }
        var framebuffer = new WebGLFramebufferWrapper(
            this,
            renderTexture,
            addStencilBuffer,
            addDepthBuffer
        );

        this.glFramebufferWrappers.push(framebuffer);

        return framebuffer;
    },

    /**
     * Creates a WebGLProgram instance based on the given vertex and fragment shader source.
     *
     * Then compiles, attaches and links the program before wrapping and returning it.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createProgram
     * @since 3.0.0
     *
     * @param {string} vertexShader - The vertex shader source code as a single string.
     * @param {string} fragmentShader - The fragment shader source code as a single string.
     *
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} The wrapped, linked WebGLProgram created from the given shader source.
     */
    createProgram: function (vertexShader, fragmentShader)
    {
        var wrapper = new WebGLProgramWrapper(this, vertexShader, fragmentShader);
        this.glProgramWrappers.push(wrapper);
        return wrapper;
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
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} Wrapped vertex buffer
     */
    createVertexBuffer: function (initialDataOrSize, bufferUsage)
    {
        var gl = this.gl;
        var vertexBuffer = new WebGLBufferWrapper(this, initialDataOrSize, gl.ARRAY_BUFFER, bufferUsage);
        this.glBufferWrappers.push(vertexBuffer);
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
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} Wrapped index buffer
     */
    createIndexBuffer: function (initialDataOrSize, bufferUsage)
    {
        var gl = this.gl;
        var indexBuffer = new WebGLBufferWrapper(this, initialDataOrSize, gl.ELEMENT_ARRAY_BUFFER, bufferUsage);
        this.glBufferWrappers.push(indexBuffer);
        return indexBuffer;
    },

    /**
     * Wrapper for creating a vertex array object.
     * This manages a vertex attribute binding state.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createVAO
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} program - The program to bind the VAO to.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} indexBuffer - The index buffer.
     * @param {Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout[]} attributeBufferLayouts - The attribute buffer layouts.
     */
    createVAO: function (program, indexBuffer, attributeBufferLayouts)
    {
        var vao = new WebGLVAOWrapper(this, program, indexBuffer, attributeBufferLayouts);
        this.glVAOWrappers.push(vao);
        return vao;
    },

    /**
     * Removes a texture from the GPU.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteTexture
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} texture - The WebGL Texture to be deleted.
     *
     * @return {this} This WebGLRenderer instance.
     */
    deleteTexture: function (texture)
    {
        if (!texture)
        {
            return;
        }
        ArrayRemove(this.glTextureWrappers, texture);
        texture.destroy();
        return this;
    },

    /**
     * Deletes a Framebuffer from the GL instance.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteFramebuffer
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper|null)} framebuffer - The Framebuffer to be deleted.
     *
     * @return {this} This WebGLRenderer instance.
     */
    deleteFramebuffer: function (framebuffer)
    {
        if (!framebuffer)
        {
            return this;
        }
        ArrayRemove(this.glFramebufferWrappers, framebuffer);
        framebuffer.destroy();
        return this;
    },

    /**
     * Deletes a WebGLProgram from the GL instance.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteProgram
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} program - The shader program to be deleted.
     *
     * @return {this} This WebGLRenderer instance.
     */
    deleteProgram: function (program)
    {
        if (program)
        {
            ArrayRemove(this.glProgramWrappers, program);
            program.destroy();
        }

        return this;
    },

    /**
     * Deletes a WebGLBuffer from the GL instance.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#deleteBuffer
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} vertexBuffer - The WebGLBuffer to be deleted.
     *
     * @return {this} This WebGLRenderer instance.
     */
    deleteBuffer: function (buffer)
    {
        if (!buffer) { return this; }
        ArrayRemove(this.glBufferWrappers, buffer);
        buffer.destroy();
        return this;
    },

    /**
     * Clears the base DrawingContext and readies it for use.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#preRender
     * @fires Phaser.Renderer.Events#PRE_RENDER_CLEAR
     * @fires Phaser.Renderer.Events#PRE_RENDER
     * @since 3.0.0
     */
    preRender: function ()
    {
        if (this.contextLost) { return; }

        this.emit(Events.PRE_RENDER_CLEAR);

        // Sync the background color to the DrawingContext.
        var baseDrawingContext = this.baseDrawingContext;
        if (this.config.clearBeforeRender)
        {
            var backgroundColor = this.config.backgroundColor;
            baseDrawingContext.setClearColor(
                backgroundColor.redGL,
                backgroundColor.greenGL,
                backgroundColor.blueGL,
                backgroundColor.alphaGL
            );
            baseDrawingContext.setAutoClear(true, true, true);
        }
        else
        {
            baseDrawingContext.setAutoClear(false, false, false);
        }

        baseDrawingContext.use();

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

        this.emit(Events.RENDER, scene, camera);

        this.currentViewCamera = camera;

        this.cameraRenderNode.run(this.baseDrawingContext, children, camera);

        this.currentViewCamera = null;
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
        this.baseDrawingContext.release();

        if (this.contextLost) { return; }

        this.emit(Events.POST_RENDER);

        // Handle snapshot requests.
        var state = this.snapshotState;
        if (state.callback)
        {
            WebGLSnapshot(this.gl, state);

            state.callback = null;
        }
    },

    /**
     * Draw a number of vertices to a drawing context.
     *
     * This draws the vertices using an index buffer. The buffer should be
     * bound to the VAO. Vertices are drawn as a `TRIANGLE_STRIP` by default.
     *
     * This is the primary render method. It requires all the WebGL resources
     * necessary to render the vertices, so they don't have to be set up
     * ad-hoc elsewhere.
     *
     * It does not upload vertex data to buffers. Ensure that this is done
     * before calling this method.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#drawElements
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The DrawingContext to draw to.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]} textures - An array of textures to bind. Textures are bound to units corresponding to their indices in the array.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} program - The shader program to use.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper} vao - The Vertex Array Object to bind. It must have an index buffer attached.
     * @param {number} count - The number of vertices to draw. Because of the TRIANGLE_STRIP topology, this should be `n + 2`, where `n` is the number of triangles to draw, including degenerate triangles.
     * @param {number} offset - The offset to start drawing from in the index buffer. This is in bytes, and should be a multiple of 2 (for 16-bit `UNSIGNED_SHORT` indices).
     * @param {number} topology - The type of primitives to render. Defaults to `TRIANGLE_STRIP`.
     */
    drawElements: function (drawingContext, textures, program, vao, count, offset, topology)
    {
        var gl = this.gl;

        drawingContext.beginDraw();

        program.bind();

        vao.bind();

        this.glTextureUnits.bindUnits(textures);

        gl.drawElements(topology || gl.TRIANGLE_STRIP, count, gl.UNSIGNED_SHORT, offset);
    },

    /**
     * Draw a number of instances to a drawing context.
     *
     * This draws vertices using the ANGLE_instanced_arrays extension.
     * This typically uses an instance buffer and a vertex buffer.
     * Both should be bound to the VAO. Vertices are drawn as a `TRIANGLE_STRIP` by default.
     *
     * It does not upload vertex data to buffers. Ensure that this is done
     * before calling this method.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#drawInstancedArrays
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The DrawingContext to draw to.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]} textures - An array of textures to bind. Textures are bound to units corresponding to their indices in the array.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} program - The shader program to use.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper} vao - The Vertex Array Object to bind. It does not need an index buffer attached.
     * @param {number} first - The starting index in the array of vector points.
     * @param {number} count - The number of vertices to draw.
     * @param {number} instanceCount - The number of instances to render.
     */
    drawInstancedArrays: function (drawingContext, textures, program, vao, first, count, instanceCount, topology)
    {
        var gl = this.gl;

        drawingContext.beginDraw();

        program.bind();

        vao.bind();

        this.glTextureUnits.bindUnits(textures);

        gl.drawArraysInstanced(topology || gl.TRIANGLE_STRIP, first, count, instanceCount);
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
        state.unpremultiplyAlpha = this.game.config.premultipliedAlpha;

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
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper} framebuffer - The framebuffer to grab from.
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

        this.snapshotArea(x, y, width, height, callback, type, encoderOptions);

        var state = this.snapshotState;

        state.getPixel = getPixel;

        state.isFramebuffer = true;
        state.bufferWidth = bufferWidth;
        state.bufferHeight = bufferHeight;

        //  Ensure they're not trying to grab an area larger than the framebuffer
        state.width = Math.min(state.width, bufferWidth);
        state.height = Math.min(state.height, bufferHeight);

        this.glWrapper.updateBindingsFramebuffer({ bindings: { framebuffer: framebuffer } });

        WebGLSnapshot(this.gl, state);

        // We don't need to unbind the framebuffer,
        // because the next time we draw it will be bound again.

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
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} [dstTexture] - The destination WebGLTextureWrapper to set.
     * @param {boolean} [noRepeat=false] - Should this canvas be allowed to set `REPEAT` (such as for Text objects?)
     * @param {boolean} [flipY=true] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     *
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The newly created, or updated, WebGLTextureWrapper.
     */
    canvasToTexture: function (srcCanvas, dstTexture, noRepeat, flipY)
    {
        if (noRepeat === undefined) { noRepeat = false; }
        if (flipY === undefined) { flipY = true; }

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

        if (!dstTexture)
        {
            return this.createTexture2D(0, minFilter, magFilter, wrapping, wrapping, gl.RGBA, srcCanvas, width, height, true, false, flipY);
        }
        else
        {
            dstTexture.update(srcCanvas, width, height, flipY, wrapping, wrapping, minFilter, magFilter, dstTexture.format);

            return dstTexture;
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
     * @param {boolean} [flipY=true] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     *
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The newly created WebGLTextureWrapper.
     */
    createCanvasTexture: function (srcCanvas, noRepeat, flipY)
    {
        if (noRepeat === undefined) { noRepeat = false; }
        if (flipY === undefined) { flipY = true; }

        return this.canvasToTexture(srcCanvas, null, noRepeat, flipY);
    },

    /**
     * Updates a WebGL Texture based on the given Canvas Element.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#updateCanvasTexture
     * @since 3.20.0
     *
     * @param {HTMLCanvasElement} srcCanvas - The Canvas to update the WebGL Texture from.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} dstTexture - The destination WebGLTextureWrapper to update.
     * @param {boolean} [flipY=true] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     * @param {boolean} [noRepeat=false] - Should this canvas be allowed to set `REPEAT` (such as for Text objects?)
     *
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The updated WebGLTextureWrapper. This is the same wrapper object as `dstTexture`.
     */
    updateCanvasTexture: function (srcCanvas, dstTexture, flipY, noRepeat)
    {
        if (flipY === undefined) { flipY = true; }
        if (noRepeat === undefined) { noRepeat = false; }

        return this.canvasToTexture(srcCanvas, dstTexture, noRepeat, flipY);
    },

    /**
     * Creates or updates a WebGL Texture based on the given HTML Video Element.
     *
     * If the `dstTexture` parameter is given, the WebGL Texture is updated, rather than created fresh.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#videoToTexture
     * @since 4.0.0
     *
     * @param {HTMLVideoElement} srcVideo - The Video to create the WebGL Texture from
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} [dstTexture] - The destination WebGLTextureWrapper to set.
     * @param {boolean} [noRepeat=false] - Should this canvas be allowed to set `REPEAT`?
     * @param {boolean} [flipY=true] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     *
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The newly created, or updated, WebGLTextureWrapper.
     */
    videoToTexture: function (srcVideo, dstTexture, noRepeat, flipY)
    {
        if (noRepeat === undefined) { noRepeat = false; }
        if (flipY === undefined) { flipY = true; }

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

        if (!dstTexture)
        {
            return this.createTexture2D(0, minFilter, magFilter, wrapping, wrapping, gl.RGBA, srcVideo, width, height, true, true, flipY);
        }
        else
        {
            dstTexture.update(srcVideo, width, height, flipY, wrapping, wrapping, minFilter, magFilter, dstTexture.format);

            return dstTexture;
        }
    },

    /**
     * Creates a new WebGL Texture based on the given HTML Video Element.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createVideoTexture
     * @since 3.20.0
     *
     * @param {HTMLVideoElement} srcVideo - The Video to create the WebGL Texture from
     * @param {boolean} [noRepeat=false] - Should this canvas be allowed to set `REPEAT`?
     * @param {boolean} [flipY=true] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     *
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The newly created WebGLTextureWrapper.
     */
    createVideoTexture: function (srcVideo, noRepeat, flipY)
    {
        if (noRepeat === undefined) { noRepeat = false; }
        if (flipY === undefined) { flipY = true; }

        return this.videoToTexture(srcVideo, null, noRepeat, flipY);
    },

    /**
     * Updates a WebGL Texture based on the given HTML Video Element.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#updateVideoTexture
     * @since 3.20.0
     *
     * @param {HTMLVideoElement} srcVideo - The Video to update the WebGL Texture with.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} dstTexture - The destination WebGLTextureWrapper to update.
     * @param {boolean} [flipY=true] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     * @param {boolean} [noRepeat=false] - Should this canvas be allowed to set `REPEAT`?
     *
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The updated WebGLTextureWrapper. This is the same wrapper object as `dstTexture`.
     */
    updateVideoTexture: function (srcVideo, dstTexture, flipY, noRepeat)
    {
        if (flipY === undefined) { flipY = true; }
        if (noRepeat === undefined) { noRepeat = false; }

        return this.videoToTexture(srcVideo, dstTexture, noRepeat, flipY);
    },

    /**
     * Create a WebGLTexture from a Uint8Array.
     *
     * The Uint8Array is assumed to be RGBA values, one byte per color component.
     *
     * The texture will be filtered with `gl.NEAREST` and will not be mipped.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#createUint8ArrayTexture
     * @since 3.80.0
     * @param {Uint8Array} data - The Uint8Array to create the texture from.
     * @param {number} width - The width of the texture.
     * @param {number} height - The height of the texture.
     * @param {boolean} [pma = true] - Should the texture be set as having premultiplied alpha?
     * @param {boolean} [flipY = true] - Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`?
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The newly created WebGLTextureWrapper.
     */
    createUint8ArrayTexture: function (data, width, height, pma, flipY)
    {
        var gl = this.gl;
        var minFilter = gl.NEAREST;
        var magFilter = gl.NEAREST;
        var wrap = gl.CLAMP_TO_EDGE;

        var pow = IsSizePowerOfTwo(width, height);

        if (pow)
        {
            wrap = gl.REPEAT;
        }

        if (pma === undefined) { pma = true; }
        if (flipY === undefined) { flipY = true; }

        return this.createTexture2D(0, minFilter, magFilter, wrap, wrap, gl.RGBA, data, width, height, pma, false, flipY);
    },

    /**
     * Sets the minification and magnification filter for a texture.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#setTextureFilter
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} texture - The texture to set the filter for.
     * @param {number} filter - The filter to set. 0 for linear filtering, 1 for nearest neighbor (blocky) filtering.
     *
     * @return {this} This WebGL Renderer instance.
     */
    setTextureFilter: function (texture, filter)
    {
        var gl = this.gl;
        var glFilter = (filter === 0) ? gl.LINEAR : gl.NEAREST;

        var texUnits = this.glTextureUnits;
        var currentTexture = texUnits.units[0];
        texUnits.bind(texture, 0);
        texture.update(
            texture.pixels,
            texture.width,
            texture.height,
            texture.flipY,
            texture.wrapS,
            texture.wrapT,
            glFilter,
            glFilter,
            texture.format
        );
        if (currentTexture)
        {
            texUnits.bind(currentTexture, 0);
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
     * Destroy this WebGLRenderer, cleaning up all related resources such as wrappers, native textures, etc.
     *
     * @method Phaser.Renderer.WebGL.WebGLRenderer#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.off(Events.RESIZE, this.baseDrawingContext.resize, this.baseDrawingContext);

        this.canvas.removeEventListener('webglcontextlost', this.contextLostHandler, false);

        this.canvas.removeEventListener('webglcontextrestored', this.contextRestoredHandler, false);

        var wrapperDestroy = function (wrapper)
        {
            wrapper.destroy();
        };
        ArrayEach(this.glBufferWrappers, wrapperDestroy);
        ArrayEach(this.glFramebufferWrappers, wrapperDestroy);
        ArrayEach(this.glProgramWrappers, wrapperDestroy);
        ArrayEach(this.glTextureWrappers, wrapperDestroy);

        this.removeAllListeners();

        this.extensions = {};

        this.gl = null;
        this.game = null;
        this.canvas = null;
        this.contextLost = true;

        if (DEBUG)
        {
            this.spector = null;
        }
    }
});

module.exports = WebGLRenderer;
