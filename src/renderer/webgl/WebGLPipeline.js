/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var DeepCopy = require('../../utils/object/DeepCopy');
var EventEmitter = require('eventemitter3');
var Events = require('./pipelines/events');
var GetFastValue = require('../../utils/object/GetFastValue');
var Matrix4 = require('../../math/Matrix4');
var RendererEvents = require('../events');
var RenderTarget = require('./RenderTarget');
var Utils = require('./Utils');
var WebGLShader = require('./WebGLShader');

/**
 * @classdesc
 * The `WebGLPipeline` is a base class used by all of the core Phaser pipelines.
 *
 * It describes the way elements will be rendered in WebGL. Internally, it handles
 * compiling the shaders, creating vertex buffers, assigning primitive topology and
 * binding vertex attributes, all based on the given configuration data.
 *
 * The pipeline is configured by passing in a `WebGLPipelineConfig` object. Please
 * see the documentation for this type to fully understand the configuration options
 * available to you.
 *
 * Usually, you would not extend from this class directly, but would instead extend
 * from one of the core pipelines, such as the Multi Pipeline.
 *
 * The pipeline flow per render-step is as follows:
 *
 * 1) onPreRender - called once at the start of the render step
 * 2) onRender - call for each Scene Camera that needs to render (so can be multiple times per render step)
 * 3) Internal flow:
 * 3a)   bind (only called if a Game Object is using this pipeline and it's not currently active)
 * 3b)   onBind (called for every Game Object that uses this pipeline)
 * 3c)   flush (can be called by a Game Object, internal method or from outside by changing pipeline)
 * 4) onPostRender - called once at the end of the render step
 *
 * @class WebGLPipeline
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration object for this WebGL Pipeline.
 */
var WebGLPipeline = new Class({

    Extends: EventEmitter,

    initialize:

    function WebGLPipeline (config)
    {
        EventEmitter.call(this);

        var game = config.game;
        var renderer = game.renderer;
        var gl = renderer.gl;

        /**
         * Name of the pipeline. Used for identification and setting from Game Objects.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = GetFastValue(config, 'name', 'WebGLPipeline');

        /**
         * The Phaser Game instance to which this pipeline is bound.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * The WebGL Renderer instance to which this pipeline is bound.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 3.0.0
         */
        this.renderer = renderer;

        /**
         * A reference to the WebGL Pipeline Manager.
         *
         * This is initially undefined and only set when this pipeline is added
         * to the manager.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#manager
         * @type {?Phaser.Renderer.WebGL.PipelineManager}
         * @since 3.50.0
         */
        this.manager;

        /**
         * The WebGL context this WebGL Pipeline uses.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#gl
         * @type {WebGLRenderingContext}
         * @since 3.0.0
         */
        this.gl = gl;

        /**
         * The canvas which this WebGL Pipeline renders to.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#view
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.view = game.canvas;

        /**
         * Width of the current viewport.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = 0;

        /**
         * Height of the current viewport.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = 0;

        /**
         * The current number of vertices that have been added to the pipeline batch.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexCount
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.vertexCount = 0;

        /**
         * The total number of vertices that this pipeline batch can hold before it will flush.
         *
         * This defaults to `renderer batchSize * 6`, where `batchSize` is defined in the Renderer Game Config.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexCapacity
         * @type {number}
         * @since 3.0.0
         */
        this.vertexCapacity = 0;

        /**
         * Raw byte buffer of vertices.
         *
         * Either set via the config object `vertices` property, or generates a new Array Buffer of
         * size `vertexCapacity * vertexSize`.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexData
         * @type {ArrayBuffer}
         * @readonly
         * @since 3.0.0
         */
        this.vertexData;

        /**
         * The WebGLBuffer that holds the vertex data.
         *
         * Created from the `vertexData` ArrayBuffer. If `vertices` are set in the config, a `STATIC_DRAW` buffer
         * is created. If not, a `DYNAMIC_DRAW` buffer is created.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexBuffer
         * @type {WebGLBuffer}
         * @readonly
         * @since 3.0.0
         */
        this.vertexBuffer;

        /**
         * The currently active WebGLBuffer.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#activeBuffer
         * @type {WebGLBuffer}
         * @since 3.60.0
         */
        this.activeBuffer;

        /**
         * The primitive topology which the pipeline will use to submit draw calls.
         *
         * Defaults to GL_TRIANGLES if not otherwise set in the config.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#topology
         * @type {GLenum}
         * @since 3.0.0
         */
        this.topology = GetFastValue(config, 'topology', gl.TRIANGLES);

        /**
         * Uint8 view to the `vertexData` ArrayBuffer. Used for uploading vertex buffer resources to the GPU.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#bytes
         * @type {Uint8Array}
         * @since 3.0.0
         */
        this.bytes;

        /**
         * Float32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertexViewF32;

        /**
         * Uint32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexViewU32
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.vertexViewU32;

        /**
         * Indicates if the current pipeline is active, or not.
         *
         * Toggle this property to enable or disable a pipeline from rendering anything.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#active
         * @type {boolean}
         * @since 3.10.0
         */
        this.active = true;

        /**
         * Some pipelines require the forced use of texture zero (like the light pipeline).
         *
         * This property should be set when that is the case.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#forceZero
         * @type {boolean}
         * @since 3.50.0
         */
        this.forceZero = GetFastValue(config, 'forceZero', false);

        /**
         * Indicates if this pipeline has booted or not.
         *
         * A pipeline boots only when the Game instance itself, and all associated systems, is
         * fully ready.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#hasBooted
         * @type {boolean}
         * @readonly
         * @since 3.50.0
         */
        this.hasBooted = false;

        /**
         * Indicates if this is a Post FX Pipeline, or not.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#isPostFX
         * @type {boolean}
         * @readonly
         * @since 3.50.0
         */
        this.isPostFX = false;

        /**
         * Indicates if this is a Sprite FX Pipeline, or not.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#isSpriteFX
         * @type {boolean}
         * @readonly
         * @since 3.60.0
         */
        this.isSpriteFX = false;

        /**
         * An array of RenderTarget instances that belong to this pipeline.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#renderTargets
         * @type {Phaser.Renderer.WebGL.RenderTarget[]}
         * @since 3.50.0
         */
        this.renderTargets = [];

        /**
         * A reference to the currently bound Render Target instance from the `WebGLPipeline.renderTargets` array.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#currentRenderTarget
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.50.0
         */
        this.currentRenderTarget;

        /**
         * An array of all the WebGLShader instances that belong to this pipeline.
         *
         * Shaders manage their own attributes and uniforms, but share the same vertex data buffer,
         * which belongs to this pipeline.
         *
         * Shaders are set in a call to the `setShadersFromConfig` method, which happens automatically,
         * but can also be called at any point in your game. See the method documentation for details.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#shaders
         * @type {Phaser.Renderer.WebGL.WebGLShader[]}
         * @since 3.50.0
         */
        this.shaders = [];

        /**
         * A reference to the currently bound WebGLShader instance from the `WebGLPipeline.shaders` array.
         *
         * For lots of pipelines, this is the only shader, so it is a quick way to reference it without
         * an array look-up.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#currentShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @since 3.50.0
         */
        this.currentShader;

        /**
         * The Projection matrix, used by shaders as 'uProjectionMatrix' uniform.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#projectionMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.projectionMatrix;

        /**
         * The cached width of the Projection matrix.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#projectionWidth
         * @type {number}
         * @since 3.50.0
         */
        this.projectionWidth = 0;

        /**
         * The cached height of the Projection matrix.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#projectionHeight
         * @type {number}
         * @since 3.50.0
         */
        this.projectionHeight = 0;

        /**
         * The configuration object that was used to create this pipeline.
         *
         * Treat this object as 'read only', because changing it post-creation will not
         * impact this pipeline in any way. However, it is used internally for cloning
         * and post-boot set-up.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#config
         * @type {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig}
         * @since 3.50.0
         */
        this.config = config;

        /**
         * Has the GL Context been reset to the Phaser defaults since the last time
         * this pipeline was bound? This is set automatically when the Pipeline Manager
         * resets itself, usually after handing off to a 3rd party renderer like Spine.
         *
         * You should treat this property as read-only.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#glReset
         * @type {boolean}
         * @since 3.53.0
         */
        this.glReset = false;

        /**
         * The temporary Pipeline batch. This array contains the batch entries for
         * the current frame, which is a package of textures and vertex offsets used
         * for drawing. This package is built dynamically as the frame is built
         * and cleared during the flush method.
         *
         * Treat this array and all of its contents as read-only.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#batch
         * @type {Phaser.Types.Renderer.WebGL.WebGLPipelineBatchEntry[]}
         * @since 3.60.0
         */
        this.batch = [];

        /**
         * The most recently created Pipeline batch entry.
         *
         * Reset to null as part of the flush method.
         *
         * Treat this value as read-only.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#currentBatch
         * @type {?Phaser.Types.Renderer.WebGL.WebGLPipelineBatchEntry}
         * @since 3.60.0
         */
        this.currentBatch = null;

        /**
         * The most recently bound WebGLTexture, used as part of the batch process.
         *
         * Reset to null as part of the flush method.
         *
         * Treat this value as read-only.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#currentTexture
         * @type {?WebGLTexture}
         * @since 3.60.0
         */
        this.currentTexture = null;

        /**
         * Holds the most recently assigned texture unit.
         *
         * Treat this value as read-only.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#currentUnit
         * @type {number}
         * @since 3.50.0
         */
        this.currentUnit = 0;

        /**
         * The currently active WebGLTextures, used as part of the batch process.
         *
         * Reset to empty as part of the bind method.
         *
         * Treat this array as read-only.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#activeTextures
         * @type {WebGLTexture[]}
         * @since 3.60.0
         */
        this.activeTextures = [];
    },

    /**
     * Called when the Game has fully booted and the Renderer has finished setting up.
     *
     * By this stage all Game level systems are now in place. You can perform any final tasks that the
     * pipeline may need, that relies on game systems such as the Texture Manager being ready.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#boot
     * @fires Phaser.Renderer.WebGL.Pipelines.Events#BOOT
     * @since 3.11.0
     */
    boot: function ()
    {
        var i;
        var gl = this.gl;
        var config = this.config;
        var renderer = this.renderer;

        if (!this.isPostFX)
        {
            this.projectionMatrix = new Matrix4().identity();
        }

        //  Create the Render Targets

        var renderTargets = this.renderTargets;

        var targets = GetFastValue(config, 'renderTarget', false);

        //  If boolean, set to number = 1
        if (typeof(targets) === 'boolean' && targets)
        {
            targets = 1;
        }

        var width = renderer.width;
        var height = renderer.height;

        if (typeof(targets) === 'number')
        {
            //  Create this many default RTs
            for (i = 0; i < targets; i++)
            {
                renderTargets.push(new RenderTarget(renderer, width, height, 1, 0, true));
            }
        }
        else if (Array.isArray(targets))
        {
            for (i = 0; i < targets.length; i++)
            {
                var scale = GetFastValue(targets[i], 'scale', 1);
                var minFilter = GetFastValue(targets[i], 'minFilter', 0);
                var autoClear = GetFastValue(targets[i], 'autoClear', 1);
                var targetWidth = GetFastValue(targets[i], 'width', null);
                var targetHeight = GetFastValue(targets[i], 'height', targetWidth);

                if (targetWidth)
                {
                    renderTargets.push(new RenderTarget(renderer, targetWidth, targetHeight, 1, minFilter, autoClear));
                }
                else
                {
                    renderTargets.push(new RenderTarget(renderer, width, height, scale, minFilter, autoClear));
                }
            }
        }

        if (renderTargets.length)
        {
            //  Default to the first one in the array
            this.currentRenderTarget = renderTargets[0];
        }

        //  Create the Shaders

        this.setShadersFromConfig(config);

        //  Which shader has the largest vertex size?
        var shaders = this.shaders;
        var vertexSize = 0;

        for (i = 0; i < shaders.length; i++)
        {
            if (shaders[i].vertexSize > vertexSize)
            {
                vertexSize = shaders[i].vertexSize;
            }
        }

        var batchSize = GetFastValue(config, 'batchSize', renderer.config.batchSize);

        //  * 6 because there are 6 vertices in a quad and 'batchSize' represents the quantity of quads in the batch

        this.vertexCapacity = batchSize * 6;

        var data = new ArrayBuffer(this.vertexCapacity * vertexSize);

        this.vertexData = data;
        this.bytes = new Uint8Array(data);
        this.vertexViewF32 = new Float32Array(data);
        this.vertexViewU32 = new Uint32Array(data);

        var configVerts = GetFastValue(config, 'vertices', null);

        if (configVerts)
        {
            this.vertexViewF32.set(configVerts);

            this.vertexBuffer = renderer.createVertexBuffer(data, gl.STATIC_DRAW);
        }
        else
        {
            this.vertexBuffer = renderer.createVertexBuffer(data.byteLength, gl.DYNAMIC_DRAW);
        }

        //  Set-up shaders

        this.setVertexBuffer();

        for (i = shaders.length - 1; i >= 0; i--)
        {
            shaders[i].rebind();
        }

        this.hasBooted = true;

        renderer.on(RendererEvents.RESIZE, this.resize, this);
        renderer.on(RendererEvents.PRE_RENDER, this.onPreRender, this);
        renderer.on(RendererEvents.RENDER, this.onRender, this);
        renderer.on(RendererEvents.POST_RENDER, this.onPostRender, this);

        this.emit(Events.BOOT, this);

        this.onBoot();
    },

    /**
     * This method is called once when this pipeline has finished being set-up
     * at the end of the boot process. By the time this method is called, all
     * of the shaders are ready and configured.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onBoot
     * @since 3.50.0
     */
    onBoot: function ()
    {
    },

    /**
     * This method is called once when this pipeline has finished being set-up
     * at the end of the boot process. By the time this method is called, all
     * of the shaders are ready and configured. It's also called if the renderer
     * changes size.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onResize
     * @since 3.50.0
     *
     * @param {number} width - The new width of this WebGL Pipeline.
     * @param {number} height - The new height of this WebGL Pipeline.
     */
    onResize: function ()
    {
    },

    /**
     * Sets the currently active shader within this pipeline.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setShader
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLShader} shader - The shader to set as being current.
     * @param {boolean} [setAttributes=false] - Should the vertex attribute pointers be set?
     * @param {WebGLBuffer} [vertexBuffer] - The vertex buffer to be set before the shader is bound. Defaults to the one owned by this pipeline.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setShader: function (shader, setAttributes, vertexBuffer)
    {
        var renderer = this.renderer;

        if (shader !== this.currentShader || renderer.currentProgram !== this.currentShader.program)
        {
            this.flush();

            var wasBound = this.setVertexBuffer(vertexBuffer);

            if (wasBound && !setAttributes)
            {
                setAttributes = true;
            }

            shader.bind(setAttributes, false);

            this.currentShader = shader;
        }

        return this;
    },

    /**
     * Searches all shaders in this pipeline for one matching the given name, then returns it.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#getShaderByName
     * @since 3.50.0
     *
     * @param {string} name - The index of the shader to set.
     *
     * @return {Phaser.Renderer.WebGL.WebGLShader} The WebGLShader instance, if found.
     */
    getShaderByName: function (name)
    {
        var shaders = this.shaders;

        for (var i = 0; i < shaders.length; i++)
        {
            if (shaders[i].name === name)
            {
                return shaders[i];
            }
        }
    },

    /**
     * Destroys all shaders currently set in the `WebGLPipeline.shaders` array and then parses the given
     * `config` object, extracting the shaders from it, creating `WebGLShader` instances and finally
     * setting them into the `shaders` array of this pipeline.
     *
     * This is a destructive process. Be very careful when you call it, should you need to.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setShadersFromConfig
     * @since 3.50.0
     *
     * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration object for this WebGL Pipeline.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setShadersFromConfig: function (config)
    {
        var i;
        var shaders = this.shaders;
        var renderer = this.renderer;

        for (i = 0; i < shaders.length; i++)
        {
            shaders[i].destroy();
        }

        var vName = 'vertShader';
        var fName = 'fragShader';
        var aName = 'attributes';

        var defaultVertShader = GetFastValue(config, vName, null);
        var defaultFragShader = Utils.parseFragmentShaderMaxTextures(GetFastValue(config, fName, null), renderer.maxTextures);
        var defaultAttribs = GetFastValue(config, aName, null);

        var configShaders = GetFastValue(config, 'shaders', []);

        var len = configShaders.length;

        if (len === 0)
        {
            if (defaultVertShader && defaultFragShader)
            {
                this.shaders = [ new WebGLShader(this, 'default', defaultVertShader, defaultFragShader, DeepCopy(defaultAttribs)) ];
            }
        }
        else
        {
            var newShaders = [];

            for (i = 0; i < len; i++)
            {
                var shaderEntry = configShaders[i];

                var name = GetFastValue(shaderEntry, 'name', 'default');

                var vertShader = GetFastValue(shaderEntry, vName, defaultVertShader);
                var fragShader = Utils.parseFragmentShaderMaxTextures(GetFastValue(shaderEntry, fName, defaultFragShader), renderer.maxTextures);
                var attributes = GetFastValue(shaderEntry, aName, defaultAttribs);

                if (vertShader && fragShader)
                {
                    newShaders.push(new WebGLShader(this, name, vertShader, fragShader, DeepCopy(attributes)));
                }
            }

            this.shaders = newShaders;
        }

        if (this.shaders.length === 0)
        {
            console.warn('Pipeline: ' + this.name + ' - Invalid shader config');
        }
        else
        {
            this.currentShader = this.shaders[0];
        }

        return this;
    },

    /**
     * Creates a new WebGL Pipeline Batch Entry, sets the texture unit as zero
     * and pushes the entry into the batch.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#createBatch
     * @since 3.60.0
     *
     * @param {WebGLTexture} texture - The WebGLTexture assigned to this batch entry.
     *
     * @return {number} The texture unit that was bound.
     */
    createBatch: function (texture)
    {
        this.currentBatch = {
            start: this.vertexCount,
            count: 0,
            texture: [ texture ],
            unit: 0,
            maxUnit: 0
        };

        this.currentUnit = 0;
        this.currentTexture = texture;

        this.batch.push(this.currentBatch);

        return 0;
    },

    /**
     * Adds the given texture to the current WebGL Pipeline Batch Entry and
     * increases the batch entry unit and maxUnit values by 1.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#addTextureToBatch
     * @since 3.60.0
     *
     * @param {WebGLTexture} texture - The WebGLTexture assigned to this batch entry.
     */
    addTextureToBatch: function (texture)
    {
        var batch = this.currentBatch;

        if (batch)
        {
            batch.texture.push(texture);
            batch.unit++;
            batch.maxUnit++;
        }
    },

    /**
     * Takes the given WebGLTexture and determines what to do with it.
     *
     * If there is no current batch (i.e. after a flush) it will create a new
     * batch from it.
     *
     * If the texture is already bound, it will return the current texture unit.
     *
     * If the texture already exists in the current batch, the unit gets reset
     * to match it.
     *
     * If the texture cannot be found in the current batch, and it supports
     * multiple textures, it's added into the batch and the unit indexes are
     * advanced.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#pushBatch
     * @since 3.60.0
     *
     * @param {WebGLTexture} texture - The WebGLTexture assigned to this batch entry.
     *
     * @return {number} The texture unit that was bound.
     */
    pushBatch: function (texture)
    {
        //  No current batch? Create one and return
        if (!this.currentBatch || (this.forceZero && texture !== this.currentTexture))
        {
            return this.createBatch(texture);
        }

        //  Otherwise, check if the texture is in the current batch
        if (texture === this.currentTexture)
        {
            return this.currentUnit;
        }
        else
        {
            var current = this.currentBatch;

            var idx = current.texture.indexOf(texture);

            if (idx === -1)
            {
                //  This is a brand new texture, not in the current batch

                //  Have we exceed our limit?
                if (current.texture.length === this.renderer.maxTextures)
                {
                    return this.createBatch(texture);
                }
                else
                {
                    //  We're good, push it in
                    current.unit++;
                    current.maxUnit++;
                    current.texture.push(texture);

                    this.currentUnit = current.unit;
                    this.currentTexture = texture;

                    return current.unit;
                }
            }
            else
            {
                this.currentUnit = idx;
                this.currentTexture = texture;

                return idx;
            }
        }
    },

    /**
     * Custom pipelines can use this method in order to perform any required pre-batch tasks
     * for the given Game Object. It must return the texture unit the Game Object was assigned.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setGameObject
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered or added to the batch.
     * @param {Phaser.Textures.Frame} [frame] - Optional frame to use. Can override that of the Game Object.
     *
     * @return {number} The texture unit the Game Object has been assigned.
     */
    setGameObject: function (gameObject, frame)
    {
        if (frame === undefined) { frame = gameObject.frame; }

        return this.pushBatch(frame.source.glTexture);
    },

    /**
     * Check if the current batch of vertices is full.
     *
     * You can optionally provide an `amount` parameter. If given, it will check if the batch
     * needs to flush _if_ the `amount` is added to it. This allows you to test if you should
     * flush before populating the batch.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#shouldFlush
     * @since 3.0.0
     *
     * @param {number} [amount=0] - Will the batch need to flush if this many vertices are added to it?
     *
     * @return {boolean} `true` if the current batch should be flushed, otherwise `false`.
     */
    shouldFlush: function (amount)
    {
        if (amount === undefined) { amount = 0; }

        return (this.vertexCount + amount > this.vertexCapacity);
    },

    /**
     * Returns the number of vertices that can be added to the current batch before
     * it will trigger a flush to happen.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#vertexAvailable
     * @since 3.60.0
     *
     * @return {number} The number of vertices that can still be added to the current batch before it will flush.
     */
    vertexAvailable: function ()
    {
        return this.vertexCapacity - this.vertexCount;
    },

    /**
     * Resizes the properties used to describe the viewport.
     *
     * This method is called automatically by the renderer during its resize handler.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#resize
     * @fires Phaser.Renderer.WebGL.Pipelines.Events#RESIZE
     * @since 3.0.0
     *
     * @param {number} width - The new width of this WebGL Pipeline.
     * @param {number} height - The new height of this WebGL Pipeline.
     *
     * @return {this} This WebGLPipeline instance.
     */
    resize: function (width, height)
    {
        if (width !== this.width || height !== this.height)
        {
            this.flush();
        }

        this.width = width;
        this.height = height;

        var targets = this.renderTargets;

        for (var i = 0; i < targets.length; i++)
        {
            targets[i].resize(width, height);
        }

        this.setProjectionMatrix(width, height);

        this.emit(Events.RESIZE, width, height, this);

        this.onResize(width, height);

        return this;
    },

    /**
     * Adjusts this pipelines ortho Projection Matrix to use the given dimensions
     * and resets the `uProjectionMatrix` uniform on all bound shaders.
     *
     * This method is called automatically by the renderer during its resize handler.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setProjectionMatrix
     * @since 3.50.0
     *
     * @param {number} width - The new width of this WebGL Pipeline.
     * @param {number} height - The new height of this WebGL Pipeline.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setProjectionMatrix: function (width, height)
    {
        var projectionMatrix = this.projectionMatrix;

        //  Because not all pipelines have them
        if (!projectionMatrix)
        {
            return this;
        }

        this.projectionWidth = width;
        this.projectionHeight = height;

        projectionMatrix.ortho(0, width, height, 0, -1000, 1000);

        var shaders = this.shaders;

        var name = 'uProjectionMatrix';

        for (var i = 0; i < shaders.length; i++)
        {
            var shader = shaders[i];

            if (shader.hasUniform(name))
            {
                shader.resetUniform(name);

                shader.setMatrix4fv(name, false, projectionMatrix.val, shader);
            }
        }

        return this;
    },

    /**
     * Adjusts this pipelines ortho Projection Matrix to flip the y
     * and bottom values. Call with 'false' as the parameter to flip
     * them back again.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#flipProjectionMatrix
     * @since 3.60.0
     *
     * @param {boolean} [flipY=true] - Flip the y and bottom values?
     */
    flipProjectionMatrix: function (flipY)
    {
        if (flipY === undefined) { flipY = true; }

        var projectionMatrix = this.projectionMatrix;

        //  Because not all pipelines have them
        if (!projectionMatrix)
        {
            return this;
        }

        var width = this.projectionWidth;
        var height = this.projectionHeight;

        if (flipY)
        {
            projectionMatrix.ortho(0, width, 0, height, -1000, 1000);
        }
        else
        {
            projectionMatrix.ortho(0, width, height, 0, -1000, 1000);
        }

        this.setMatrix4fv('uProjectionMatrix', false, projectionMatrix.val);
    },

    /**
     * Adjusts this pipelines ortho Projection Matrix to match that of the global
     * WebGL Renderer Projection Matrix.
     *
     * This method is called automatically by the Pipeline Manager when this
     * pipeline is set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#updateProjectionMatrix
     * @since 3.50.0
     */
    updateProjectionMatrix: function ()
    {
        if (this.projectionMatrix)
        {
            var globalWidth = this.renderer.projectionWidth;
            var globalHeight = this.renderer.projectionHeight;

            if (this.projectionWidth !== globalWidth || this.projectionHeight !== globalHeight)
            {
                this.setProjectionMatrix(globalWidth, globalHeight);
            }
        }
    },

    /**
     * This method is called every time the Pipeline Manager makes this pipeline the currently active one.
     *
     * It binds the resources and shader needed for this pipeline, including setting the vertex buffer
     * and attribute pointers.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#bind
     * @fires Phaser.Renderer.WebGL.Pipelines.Events#BIND
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLShader} [currentShader] - The shader to set as being current.
     *
     * @return {this} This WebGLPipeline instance.
     */
    bind: function (currentShader)
    {
        if (currentShader === undefined) { currentShader = this.currentShader; }

        if (this.glReset)
        {
            return this.rebind(currentShader);
        }

        var wasBound = false;

        var gl = this.gl;

        if (gl.getParameter(gl.ARRAY_BUFFER_BINDING) !== this.vertexBuffer)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            this.activeBuffer = this.vertexBuffer;

            wasBound = true;
        }

        currentShader.bind(wasBound);

        this.currentShader = currentShader;

        this.activeTextures.length = 0;

        this.emit(Events.BIND, this, currentShader);

        this.onActive(currentShader);

        return this;
    },

    /**
     * This method is called every time the Pipeline Manager rebinds this pipeline.
     *
     * It resets all shaders this pipeline uses, setting their attributes again.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#rebind
     * @fires Phaser.Renderer.WebGL.Pipelines.Events#REBIND
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLShader} [currentShader] - The shader to set as being current.
     *
     * @return {this} This WebGLPipeline instance.
     */
    rebind: function (currentShader)
    {
        this.activeBuffer = null;

        this.setVertexBuffer();

        var shaders = this.shaders;

        //  Loop in reverse, so the first shader in the array is left as being bound
        for (var i = shaders.length - 1; i >= 0; i--)
        {
            var shader = shaders[i].rebind();

            if (!currentShader || shader === currentShader)
            {
                this.currentShader = shader;
            }
        }

        this.activeTextures.length = 0;

        this.emit(Events.REBIND, this.currentShader);

        this.onActive(this.currentShader);

        this.onRebind();

        this.glReset = false;

        return this;
    },

    /**
     * Binds the vertex buffer to be the active ARRAY_BUFFER on the WebGL context.
     *
     * It first checks to see if it's already set as the active buffer and only
     * binds itself if not.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setVertexBuffer
     * @since 3.50.0
     *
     * @param {WebGLBuffer} [buffer] - The Vertex Buffer to be bound. Defaults to the one owned by this pipeline.
     *
     * @return {boolean} `true` if the vertex buffer was bound, or `false` if it was already bound.
     */
    setVertexBuffer: function (buffer)
    {
        if (buffer === undefined) { buffer = this.vertexBuffer; }

        if (buffer !== this.activeBuffer)
        {
            var gl = this.gl;

            this.gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            this.activeBuffer = buffer;

            return true;
        }

        return false;
    },

    /**
     * This method is called as a result of the `WebGLPipeline.batchQuad` method, right before a quad
     * belonging to a Game Object is about to be added to the batch. When this is called, the
     * renderer has just performed a flush. It will bind the current render target, if any are set
     * and finally call the `onPreBatch` hook.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#preBatch
     * @since 3.50.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.Cameras.Scene2D.Camera)} [gameObject] - The Game Object or Camera that invoked this pipeline, if any.
     *
     * @return {this} This WebGLPipeline instance.
     */
    preBatch: function (gameObject)
    {
        if (this.currentRenderTarget)
        {
            this.currentRenderTarget.bind();
        }

        this.onPreBatch(gameObject);

        return this;
    },

    /**
     * This method is called as a result of the `WebGLPipeline.batchQuad` method, right after a quad
     * belonging to a Game Object has been added to the batch. When this is called, the
     * renderer has just performed a flush.
     *
     * It calls the `onDraw` hook followed by the `onPostBatch` hook, which can be used to perform
     * additional Post FX Pipeline processing.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#postBatch
     * @since 3.50.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.Cameras.Scene2D.Camera)} [gameObject] - The Game Object or Camera that invoked this pipeline, if any.
     *
     * @return {this} This WebGLPipeline instance.
     */
    postBatch: function (gameObject)
    {
        this.onDraw(this.currentRenderTarget);

        this.onPostBatch(gameObject);

        return this;
    },

    /**
     * This method is only used by Sprite FX and Post FX Pipelines and those that extend from them.
     *
     * This method is called every time the `postBatch` method is called and is passed a
     * reference to the current render target.
     *
     * At the very least a Post FX Pipeline should call `this.bindAndDraw(renderTarget)`,
     * however, you can do as much additional processing as you like in this method if
     * you override it from within your own pipelines.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onDraw
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} renderTarget - The Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [swapTarget] - A Swap Render Target, useful for double-buffer effects. Only set by SpriteFX Pipelines.
     */
    onDraw: function ()
    {
    },

    /**
     * This method is called every time the Pipeline Manager deactivates this pipeline, swapping from
     * it to another one. This happens after a call to `flush` and before the new pipeline is bound.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#unbind
     * @since 3.50.0
     */
    unbind: function ()
    {
        if (this.currentRenderTarget)
        {
            this.currentRenderTarget.unbind();
        }
    },

    /**
     * Uploads the vertex data and emits a draw call for the current batch of vertices.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#flush
     * @fires Phaser.Renderer.WebGL.Pipelines.Events#BEFORE_FLUSH
     * @fires Phaser.Renderer.WebGL.Pipelines.Events#AFTER_FLUSH
     * @since 3.0.0
     *
     * @param {boolean} [isPostFlush=false] - Was this flush invoked as part of a post-process, or not?
     *
     * @return {this} This WebGLPipeline instance.
     */
    flush: function (isPostFlush)
    {
        if (isPostFlush === undefined) { isPostFlush = false; }

        if (this.vertexCount > 0)
        {
            this.emit(Events.BEFORE_FLUSH, this, isPostFlush);

            this.onBeforeFlush(isPostFlush);

            var gl = this.gl;
            var vertexCount = this.vertexCount;
            var vertexSize = this.currentShader.vertexSize;
            var topology = this.topology;

            if (this.active)
            {
                this.setVertexBuffer();

                if (vertexCount === this.vertexCapacity)
                {
                    gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.DYNAMIC_DRAW);
                }
                else
                {
                    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));
                }

                var i;
                var entry;
                var texture;
                var batch = this.batch;
                var activeTextures = this.activeTextures;

                if (this.forceZero)
                {
                    //  Single Texture Pipeline
                    if (!activeTextures[0])
                    {
                        gl.activeTexture(gl.TEXTURE0);
                    }

                    for (i = 0; i < batch.length; i++)
                    {
                        entry = batch[i];
                        texture = entry.texture[0];

                        if (activeTextures[0] !== texture)
                        {
                            gl.bindTexture(gl.TEXTURE_2D, texture);

                            activeTextures[0] = texture;
                        }

                        gl.drawArrays(topology, entry.start, entry.count);
                    }
                }
                else
                {
                    for (i = 0; i < batch.length; i++)
                    {
                        entry = batch[i];

                        for (var t = 0; t <= entry.maxUnit; t++)
                        {
                            texture = entry.texture[t];

                            if (activeTextures[t] !== texture)
                            {
                                gl.activeTexture(gl.TEXTURE0 + t);
                                gl.bindTexture(gl.TEXTURE_2D, texture);

                                activeTextures[t] = texture;
                            }
                        }

                        gl.drawArrays(topology, entry.start, entry.count);
                    }
                }
            }

            this.vertexCount = 0;

            this.batch.length = 0;
            this.currentBatch = null;
            this.currentTexture = null;
            this.currentUnit = 0;

            this.emit(Events.AFTER_FLUSH, this, isPostFlush);

            this.onAfterFlush(isPostFlush);
        }

        return this;
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called every time the Pipeline Manager makes this the active pipeline. It is called
     * at the end of the `WebGLPipeline.bind` method, after the current shader has been set. The current
     * shader is passed to this hook.
     *
     * For example, if a display list has 3 Sprites in it that all use the same pipeline, this hook will
     * only be called for the first one, as the 2nd and 3rd Sprites do not cause the pipeline to be changed.
     *
     * If you need to listen for that event instead, use the `onBind` hook.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onActive
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLShader} currentShader - The shader that was set as current.
     */
    onActive: function ()
    {
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called every time a **Game Object** asks the Pipeline Manager to use this pipeline,
     * even if the pipeline is already active.
     *
     * Unlike the `onActive` method, which is only called when the Pipeline Manager makes this pipeline
     * active, this hook is called for every Game Object that requests use of this pipeline, allowing you to
     * perform per-object set-up, such as loading shader uniform data.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onBind
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object that invoked this pipeline, if any.
     */
    onBind: function ()
    {
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called when the Pipeline Manager needs to rebind this pipeline. This happens after a
     * pipeline has been cleared, usually when passing control over to a 3rd party WebGL library, like Spine,
     * and then returing to Phaser again.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onRebind
     * @since 3.50.0
     */
    onRebind: function ()
    {
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called every time the `batchQuad` or `batchTri` methods are called. If this was
     * as a result of a Game Object, then the Game Object reference is passed to this hook too.
     *
     * This hook is called _after_ the quad (or tri) has been added to the batch, so you can safely
     * call 'flush' from within this.
     *
     * Note that Game Objects may call `batchQuad` or `batchTri` multiple times for a single draw,
     * for example the Graphics Game Object.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onBatch
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object that invoked this pipeline, if any.
     */
    onBatch: function ()
    {
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called immediately before a **Game Object** is about to add itself to the batch.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onPreBatch
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object that invoked this pipeline, if any.
     */
    onPreBatch: function ()
    {
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called immediately after a **Game Object** has been added to the batch.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onPostBatch
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object that invoked this pipeline, if any.
     */
    onPostBatch: function ()
    {
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called once per frame, right before anything has been rendered, but after the canvas
     * has been cleared. If this pipeline has a render target, it will also have been cleared by this point.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onPreRender
     * @since 3.50.0
     */
    onPreRender: function ()
    {
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called _once per frame_, by every Camera in a Scene that wants to render.
     *
     * It is called at the start of the rendering process, before anything has been drawn to the Camera.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onRender
     * @since 3.50.0
     *
     * @param {Phaser.Scene} scene - The Scene being rendered.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Scene Camera being rendered with.
     */
    onRender: function ()
    {
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called _once per frame_, after all rendering has happened and snapshots have been taken.
     *
     * It is called at the very end of the rendering process, once all Cameras, for all Scenes, have
     * been rendered.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onPostRender
     * @since 3.50.0
     */
    onPostRender: function ()
    {
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called every time this pipeline is asked to flush its batch.
     *
     * It is called immediately before the `gl.bufferData` and `gl.drawArrays` calls are made, so you can
     * perform any final pre-render modifications. To apply changes post-render, see `onAfterFlush`.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onBeforeFlush
     * @since 3.50.0
     *
     * @param {boolean} [isPostFlush=false] - Was this flush invoked as part of a post-process, or not?
     */
    onBeforeFlush: function ()
    {
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called immediately after this pipeline has finished flushing its batch.
     *
     * It is called after the `gl.drawArrays` call.
     *
     * You can perform additional post-render effects, but be careful not to call `flush`
     * on this pipeline from within this method, or you'll cause an infinite loop.
     *
     * To apply changes pre-render, see `onBeforeFlush`.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onAfterFlush
     * @since 3.50.0
     *
     * @param {boolean} [isPostFlush=false] - Was this flush invoked as part of a post-process, or not?
     */
    onAfterFlush: function ()
    {
    },

    /**
     * Adds a single vertex to the current vertex buffer and increments the
     * `vertexCount` property by 1.
     *
     * This method is called directly by `batchTri` and `batchQuad`.
     *
     * It does not perform any batch limit checking itself, so if you need to call
     * this method directly, do so in the same way that `batchQuad` does, for example.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#batchVert
     * @since 3.50.0
     *
     * @param {number} x - The vertex x position.
     * @param {number} y - The vertex y position.
     * @param {number} u - UV u value.
     * @param {number} v - UV v value.
     * @param {number} unit - Texture unit to which the texture needs to be bound.
     * @param {(number|boolean)} tintEffect - The tint effect for the shader to use.
     * @param {number} tint - The tint color value.
     */
    batchVert: function (x, y, u, v, unit, tintEffect, tint)
    {
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.currentShader.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x;
        vertexViewF32[++vertexOffset] = y;
        vertexViewF32[++vertexOffset] = u;
        vertexViewF32[++vertexOffset] = v;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tint;

        this.vertexCount++;

        this.currentBatch.count = (this.vertexCount - this.currentBatch.start);
    },

    /**
     * Adds the vertices data into the batch and flushes if full.
     *
     * Assumes 6 vertices in the following arrangement:
     *
     * ```
     * 0----3
     * |\  B|
     * | \  |
     * |  \ |
     * | A \|
     * |    \
     * 1----2
     * ```
     *
     * Where tx0/ty0 = 0, tx1/ty1 = 1, tx2/ty2 = 2 and tx3/ty3 = 3
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#batchQuad
     * @since 3.50.0
     *
     * @param {(Phaser.GameObjects.GameObject|null)} gameObject - The Game Object, if any, drawing this quad.
     * @param {number} x0 - The top-left x position.
     * @param {number} y0 - The top-left y position.
     * @param {number} x1 - The bottom-left x position.
     * @param {number} y1 - The bottom-left y position.
     * @param {number} x2 - The bottom-right x position.
     * @param {number} y2 - The bottom-right y position.
     * @param {number} x3 - The top-right x position.
     * @param {number} y3 - The top-right y position.
     * @param {number} u0 - UV u0 value.
     * @param {number} v0 - UV v0 value.
     * @param {number} u1 - UV u1 value.
     * @param {number} v1 - UV v1 value.
     * @param {number} tintTL - The top-left tint color value.
     * @param {number} tintTR - The top-right tint color value.
     * @param {number} tintBL - The bottom-left tint color value.
     * @param {number} tintBR - The bottom-right tint color value.
     * @param {(number|boolean)} tintEffect - The tint effect for the shader to use.
     * @param {WebGLTexture} [texture] - WebGLTexture that will be assigned to the current batch if a flush occurs.
     * @param {number} [unit=0] - Texture unit to which the texture needs to be bound.
     *
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchQuad: function (gameObject, x0, y0, x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, unit)
    {
        if (unit === undefined) { unit = this.currentUnit; }

        var hasFlushed = false;

        if (this.shouldFlush(6))
        {
            this.flush();

            hasFlushed = true;
        }

        if (!this.currentBatch)
        {
            unit = this.setTexture2D(texture);
        }

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.currentShader.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x0;
        vertexViewF32[++vertexOffset] = y0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = x1;
        vertexViewF32[++vertexOffset] = y1;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBL;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBR;

        vertexViewF32[++vertexOffset] = x0;
        vertexViewF32[++vertexOffset] = y0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBR;

        vertexViewF32[++vertexOffset] = x3;
        vertexViewF32[++vertexOffset] = y3;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTR;

        this.vertexCount += 6;

        this.currentBatch.count = (this.vertexCount - this.currentBatch.start);

        this.onBatch(gameObject);

        return hasFlushed;
    },

    /**
     * Adds the vertices data into the batch and flushes if full.
     *
     * Assumes 3 vertices in the following arrangement:
     *
     * ```
     * 0
     * |\
     * | \
     * |  \
     * |   \
     * |    \
     * 1-----2
     * ```
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#batchTri
     * @since 3.50.0
     *
     * @param {(Phaser.GameObjects.GameObject|null)} gameObject - The Game Object, if any, drawing this quad.
     * @param {number} x1 - The bottom-left x position.
     * @param {number} y1 - The bottom-left y position.
     * @param {number} x2 - The bottom-right x position.
     * @param {number} y2 - The bottom-right y position.
     * @param {number} x3 - The top-right x position.
     * @param {number} y3 - The top-right y position.
     * @param {number} u0 - UV u0 value.
     * @param {number} v0 - UV v0 value.
     * @param {number} u1 - UV u1 value.
     * @param {number} v1 - UV v1 value.
     * @param {number} tintTL - The top-left tint color value.
     * @param {number} tintTR - The top-right tint color value.
     * @param {number} tintBL - The bottom-left tint color value.
     * @param {(number|boolean)} tintEffect - The tint effect for the shader to use.
     * @param {WebGLTexture} [texture] - WebGLTexture that will be assigned to the current batch if a flush occurs.
     * @param {number} [unit=0] - Texture unit to which the texture needs to be bound.
     *
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchTri: function (gameObject, x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintEffect, texture, unit)
    {
        if (unit === undefined) { unit = this.currentUnit; }

        var hasFlushed = false;

        if (this.shouldFlush(3))
        {
            this.flush();

            hasFlushed = true;
        }

        if (!this.currentBatch)
        {
            unit = this.setTexture2D(texture);
        }

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.currentShader.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x0;
        vertexViewF32[++vertexOffset] = y0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = x1;
        vertexViewF32[++vertexOffset] = y1;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTR;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBL;

        this.vertexCount += 3;

        this.currentBatch.count = (this.vertexCount - this.currentBatch.start);

        this.onBatch(gameObject);

        return hasFlushed;
    },

    /**
     * Pushes a filled rectangle into the vertex batch.
     *
     * The dimensions are run through `Math.floor` before the quad is generated.
     *
     * Rectangle has no transform values and isn't transformed into the local space.
     *
     * Used for directly batching untransformed rectangles, such as Camera background colors.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#drawFillRect
     * @since 3.50.0
     *
     * @param {number} x - Horizontal top left coordinate of the rectangle.
     * @param {number} y - Vertical top left coordinate of the rectangle.
     * @param {number} width - Width of the rectangle.
     * @param {number} height - Height of the rectangle.
     * @param {number} color - Color of the rectangle to draw.
     * @param {number} alpha - Alpha value of the rectangle to draw.
     * @param {WebGLTexture} [texture] - WebGLTexture that will be assigned to the current batch if a flush occurs.
     * @param {boolean} [flipUV=true] - Flip the vertical UV coordinates of the texture before rendering?
     */
    drawFillRect: function (x, y, width, height, color, alpha, texture, flipUV)
    {
        if (texture === undefined) { texture = this.renderer.whiteTexture; }
        if (flipUV === undefined) { flipUV = true; }

        x = Math.floor(x);
        y = Math.floor(y);

        var xw = Math.floor(x + width);
        var yh = Math.floor(y + height);

        var unit = this.setTexture2D(texture);

        var tint = Utils.getTintAppendFloatAlphaAndSwap(color, alpha);

        var u0 = 0;
        var v0 = 0;
        var u1 = 1;
        var v1 = 1;

        if (flipUV)
        {
            v0 = 1;
            v1 = 0;
        }

        this.batchQuad(null, x, y, x, yh, xw, yh, xw, y, u0, v0, u1, v1, tint, tint, tint, tint, 0, texture, unit);
    },

    /**
     * Sets the texture to be bound to the next available texture unit and returns
     * the unit id.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setTexture2D
     * @since 3.50.0
     *
     * @param {WebGLTexture} [texture] - WebGLTexture that will be assigned to the current batch. If not given uses `whiteTexture`.
     *
     * @return {number} The assigned texture unit.
     */
    setTexture2D: function (texture)
    {
        if (texture === undefined) { texture = this.renderer.whiteTexture; }

        return this.pushBatch(texture);
    },

    /**
     * Activates the given WebGL Texture and binds it to the requested texture slot.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#bindTexture
     * @since 3.50.0
     *
     * @param {WebGLTexture} [target] - The WebGLTexture to activate and bind.
     * @param {number} [unit=0] - The WebGL texture ID to activate. Defaults to `gl.TEXTURE0`.
     *
     * @return {this} This WebGL Pipeline instance.
     */
    bindTexture: function (texture, unit)
    {
        if (unit === undefined) { unit = 0; }

        var gl = this.gl;

        gl.activeTexture(gl.TEXTURE0 + unit);

        gl.bindTexture(gl.TEXTURE_2D, texture);

        return this;
    },

    /**
     * Activates the given Render Target texture and binds it to the
     * requested WebGL texture slot.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#bindRenderTarget
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The Render Target to activate and bind.
     * @param {number} [unit=0] - The WebGL texture ID to activate. Defaults to `gl.TEXTURE0`.
     *
     * @return {this} This WebGL Pipeline instance.
     */
    bindRenderTarget: function (target, unit)
    {
        return this.bindTexture(target.texture, unit);
    },

    /**
     * Sets the current duration into a 1f uniform value based on the given name.
     *
     * This can be used for mapping time uniform values, such as `iTime`.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setTime
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setTime: function (uniform)
    {
        this.set1f(uniform, this.game.loop.getDuration());

        return this;
    },

    /**
     * Sets a boolean uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setBoolean
     * @since 3.60.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {boolean} value - The new value of the `boolean` uniform.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setBoolean: function (name, value, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.setBoolean(name, value);

        return this;
    },

    /**
     * Sets a 1f uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set1f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new value of the `float` uniform.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set1f: function (name, x, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set1f(name, x);

        return this;
    },

    /**
     * Sets a 2f uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set2f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new X component of the `vec2` uniform.
     * @param {number} y - The new Y component of the `vec2` uniform.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set2f: function (name, x, y, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set2f(name, x, y);

        return this;
    },

    /**
     * Sets a 3f uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set3f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new X component of the `vec3` uniform.
     * @param {number} y - The new Y component of the `vec3` uniform.
     * @param {number} z - The new Z component of the `vec3` uniform.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set3f: function (name, x, y, z, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set3f(name, x, y, z);

        return this;
    },

    /**
     * Sets a 4f uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set4f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - X component of the uniform
     * @param {number} y - Y component of the uniform
     * @param {number} z - Z component of the uniform
     * @param {number} w - W component of the uniform
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set4f: function (name, x, y, z, w, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set4f(name, x, y, z, w);

        return this;
    },

    /**
     * Sets a 1fv uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set1fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set1fv: function (name, arr, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set1fv(name, arr);

        return this;
    },

    /**
     * Sets a 2fv uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set2fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set2fv: function (name, arr, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set2fv(name, arr);

        return this;
    },

    /**
     * Sets a 3fv uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set3fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set3fv: function (name, arr, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set3fv(name, arr);

        return this;
    },

    /**
     * Sets a 4fv uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set4fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set4fv: function (name, arr, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set4fv(name, arr);

        return this;
    },

    /**
     * Sets a 1iv uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set1iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set1iv: function (name, arr, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set1iv(name, arr);

        return this;
    },

    /**
     * Sets a 2iv uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set2iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set2iv: function (name, arr, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set2iv(name, arr);

        return this;
    },

    /**
     * Sets a 3iv uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set3iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set3iv: function (name, arr, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set3iv(name, arr);

        return this;
    },

    /**
     * Sets a 4iv uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set4iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set4iv: function (name, arr, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set4iv(name, arr);

        return this;
    },

    /**
     * Sets a 1i uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set1i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new value of the `int` uniform.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set1i: function (name, x, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set1i(name, x);

        return this;
    },

    /**
     * Sets a 2i uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set2i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new X component of the `ivec2` uniform.
     * @param {number} y - The new Y component of the `ivec2` uniform.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set2i: function (name, x, y, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set2i(name, x, y);

        return this;
    },

    /**
     * Sets a 3i uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set3i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new X component of the `ivec3` uniform.
     * @param {number} y - The new Y component of the `ivec3` uniform.
     * @param {number} z - The new Z component of the `ivec3` uniform.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set3i: function (name, x, y, z, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set3i(name, x, y, z);

        return this;
    },

    /**
     * Sets a 4i uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set4i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - X component of the uniform.
     * @param {number} y - Y component of the uniform.
     * @param {number} z - Z component of the uniform.
     * @param {number} w - W component of the uniform.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set4i: function (name, x, y, z, w, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.set4i(name, x, y, z, w);

        return this;
    },

    /**
     * Sets a matrix 2fv uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix2fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {boolean} transpose - Whether to transpose the matrix. Should be `false`.
     * @param {number[]|Float32Array} matrix - The new values for the `mat2` uniform.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setMatrix2fv: function (name, transpose, matrix, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.setMatrix2fv(name, transpose, matrix);

        return this;
    },

    /**
     * Sets a matrix 3fv uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix3fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {boolean} transpose - Whether to transpose the matrix. Should be `false`.
     * @param {Float32Array} matrix - The new values for the `mat3` uniform.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setMatrix3fv: function (name, transpose, matrix, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.setMatrix3fv(name, transpose, matrix);

        return this;
    },

    /**
     * Sets a matrix 4fv uniform value based on the given name on the currently set shader.
     *
     * The current shader is bound, before the uniform is set, making it active within the
     * WebGLRenderer. This means you can safely call this method from a location such as
     * a Scene `create` or `update` method. However, when working within a Shader file
     * directly, use the `WebGLShader` method equivalent instead, to avoid the program
     * being set.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix4fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {boolean} transpose - Whether to transpose the matrix. Should be `false`.
     * @param {Float32Array} matrix - The matrix data. If using a Matrix4 this should be the `Matrix4.val` property.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to set the value on. If not given, the `currentShader` is used.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setMatrix4fv: function (name, transpose, matrix, shader)
    {
        if (shader === undefined) { shader = this.currentShader; }

        shader.setMatrix4fv(name, transpose, matrix);

        return this;
    },

    /**
     * Destroys all shader instances, removes all object references and nulls all external references.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#destroy
     * @fires Phaser.Renderer.WebGL.Pipelines.Events#DESTROY
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    destroy: function ()
    {
        this.emit(Events.DESTROY, this);

        var i;

        var shaders = this.shaders;

        for (i = 0; i < shaders.length; i++)
        {
            shaders[i].destroy();
        }

        var targets = this.renderTargets;

        for (i = 0; i < targets.length; i++)
        {
            targets[i].destroy();
        }

        this.gl.deleteBuffer(this.vertexBuffer);

        var renderer = this.renderer;

        renderer.off(RendererEvents.RESIZE, this.resize, this);
        renderer.off(RendererEvents.PRE_RENDER, this.onPreRender, this);
        renderer.off(RendererEvents.RENDER, this.onRender, this);
        renderer.off(RendererEvents.POST_RENDER, this.onPostRender, this);

        this.removeAllListeners();

        this.game = null;
        this.renderer = null;
        this.manager = null;
        this.gl = null;
        this.view = null;
        this.shaders = null;
        this.renderTargets = null;
        this.bytes = null;
        this.vertexViewF32 = null;
        this.vertexViewU32 = null;
        this.vertexData = null;
        this.vertexBuffer = null;
        this.currentShader = null;
        this.currentRenderTarget = null;
        this.activeTextures = null;

        return this;
    }

});

module.exports = WebGLPipeline;
