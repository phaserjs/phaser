/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var DeepCopy = require('../../utils/object/DeepCopy');
var Events = require('./events');
var GetFastValue = require('../../utils/object/GetFastValue');
var Matrix4 = require('../../math/Matrix4');
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
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration object for this WebGL Pipeline.
 */
var WebGLPipeline = new Class({

    initialize:

    function WebGLPipeline (config)
    {
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
         * This defaults to `renderer batchSize * 7`, where `batchSize` is defined in the Renderer Config.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexCapacity
         * @type {number}
         * @since 3.0.0
         */
        this.vertexCapacity = 0;

        /**
         * Raw byte buffer of vertices.
         *
         * Either set via the config object, or generates a new Array Buffer of size `vertexCapacity * vertexSize`.
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
         * Created from the `vertices` config ArrayBuffer that was passed in, or set by default, by the pipeline.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexBuffer
         * @type {WebGLBuffer}
         * @readonly
         * @since 3.0.0
         */
        this.vertexBuffer;

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
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertexViewF32;

        /**
         * Uint32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#vertexViewU32
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.vertexViewU32;

        /**
         * Indicates if the current pipeline is active, or not, for this frame only.
         *
         * Reset to `true` in the `onRender` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#active
         * @type {boolean}
         * @since 3.10.0
         */
        this.active = false;

        /**
         * Holds the most recently assigned texture unit.

         * Treat this value as read-only.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.WebGLPipeline#currentUnit
         * @type {number}
         * @since 3.50.0
         */
        this.currentUnit = 0;

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
    },

    /**
     * Called when the Game has fully booted and the Renderer has finished setting up.
     *
     * By this stage all Game level systems are now in place. You can perform any final tasks that the
     * pipeline may need, that relies on game systems such as the Texture Manager being ready.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#boot
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
                renderTargets.push(new RenderTarget(this, width, height, 1, 0, true));
            }
        }
        else if (Array.isArray(targets))
        {
            for (i = 0; i < targets.length; i++)
            {
                var scale = GetFastValue(targets[i], 'scale', 1);
                var minFilter = GetFastValue(targets[i], 'minFilter', 0);
                var autoClear = GetFastValue(targets[i], 'autoClear', 1);

                renderTargets.push(new RenderTarget(this, width, height, scale, minFilter, autoClear));
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

        var data = GetFastValue(config, 'vertices', new ArrayBuffer(this.vertexCapacity * vertexSize));

        this.vertexData = data;

        if (GetFastValue(config, 'vertices', null))
        {
            this.vertexBuffer = renderer.createVertexBuffer(data, gl.STATIC_DRAW);
        }
        else
        {
            this.vertexBuffer = renderer.createVertexBuffer(data.byteLength, gl.DYNAMIC_DRAW);
        }

        this.bytes = new Uint8Array(data);

        this.vertexViewF32 = new Float32Array(data);

        this.vertexViewU32 = new Uint32Array(data);

        //  Set-up shaders

        this.renderer.setVertexBuffer(this.vertexBuffer);

        for (i = 0; i < shaders.length; i++)
        {
            shaders[i].rebind();
        }

        this.currentShader.bind();

        this.hasBooted = true;

        renderer.on(Events.RESIZE, this.resize, this);
        renderer.on(Events.PRE_RENDER, this.onPreRender, this);
        renderer.on(Events.RENDER, this.onRender, this);
        renderer.on(Events.POST_RENDER, this.onPostRender, this);

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
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} shader - The shader to set as being current.
     * @param {boolean} [setAttributes=false] - Should the vertex attribute pointers be set?
     *
     * @return {this} This WebGLPipeline instance.
     */
    setShader: function (shader, setAttributes)
    {
        var renderer = this.renderer;

        if (shader !== this.currentShader || renderer.currentProgram !== this.currentShader.program)
        {
            this.flush();

            renderer.resetTextures();

            renderer.setVertexBuffer(this.vertexBuffer);

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
        var uName = 'uniforms';
        var aName = 'attributes';

        var defaultVertShader = GetFastValue(config, vName, null);
        var defaultFragShader = Utils.parseFragmentShaderMaxTextures(GetFastValue(config, fName, null), renderer.maxTextures);
        var defaultUniforms = GetFastValue(config, uName, null);
        var defaultAttribs = GetFastValue(config, aName, null);

        var configShaders = GetFastValue(config, 'shaders', []);

        var len = configShaders.length;

        if (len === 0)
        {
            if (defaultVertShader && defaultFragShader)
            {
                this.shaders = [ new WebGLShader(this, 'default', defaultVertShader, defaultFragShader, DeepCopy(defaultAttribs), DeepCopy(defaultUniforms)) ];
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
                var uniforms = GetFastValue(shaderEntry, uName, defaultUniforms);

                if (vertShader && fragShader)
                {
                    newShaders.push(new WebGLShader(this, name, vertShader, fragShader, DeepCopy(attributes), DeepCopy(uniforms)));
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
     * Custom pipelines can use this method in order to perform any required pre-batch tasks
     * for the given Game Object. It must return the texture unit the Game Object was assigned.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.WebGLPipeline#setGameObject
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

        this.currentUnit = this.renderer.setTextureSource(frame.source);

        return this.currentUnit;
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
     * @param {integer} [amount=0] - Will the batch need to flush if this many vertices are added to it?
     *
     * @return {boolean} `true` if the current batch should be flushed, otherwise `false`.
     */
    shouldFlush: function (amount)
    {
        if (amount === undefined) { amount = 0; }

        return (this.vertexCount + amount > this.vertexCapacity);
    },

    /**
     * Resizes the properties used to describe the viewport.
     *
     * This method is called automatically by the renderer during its resize handler.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#resize
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

        var projectionMatrix = this.projectionMatrix;

        //  Because Post FX Pipelines don't have them
        if (projectionMatrix)
        {
            projectionMatrix.ortho(0, width, height, 0, -1000, 1000);
        }

        var i;

        var targets = this.renderTargets;

        for (i = 0; i < targets.length; i++)
        {
            targets[i].resize(width, height);
        }

        var shaders = this.shaders;

        for (i = 0; i < shaders.length; i++)
        {
            var shader = shaders[i];

            if (shader.hasUniform('uProjectionMatrix'))
            {
                this.setMatrix4fv('uProjectionMatrix', false, projectionMatrix.val, shader);
            }
        }

        this.onResize(width, height);

        return this;
    },

    /**
     * This method is called every time the Pipeline Manager makes this pipeline the currently active one.
     *
     * It binds the resources and shader needed for this pipeline, including setting the vertex buffer
     * and attribute pointers.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#bind
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLShader} [currentShader] - The shader to set as being current.
     *
     * @return {this} This WebGLPipeline instance.
     */
    bind: function (currentShader)
    {
        if (currentShader === undefined) { currentShader = this.currentShader; }

        var wasBound = this.renderer.setVertexBuffer(this.vertexBuffer);

        currentShader.bind(wasBound);

        this.currentShader = currentShader;

        return this;
    },

    /**
     * This method is called every time the Pipeline Manager rebinds this pipeline.
     *
     * It resets all shaders this pipeline uses, setting their attributes again.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#rebind
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    rebind: function ()
    {
        this.renderer.setVertexBuffer(this.vertexBuffer);

        var shaders = this.shaders;

        for (var i = 0; i < shaders.length; i++)
        {
            shaders[i].rebind();
        }

        this.currentShader = shaders[0];

        this.onRebind();

        return this;
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
     * This method is only used by Post FX Pipelines and those that extend from them.
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
     * @since 3.0.0
     *
     * @param {boolean} [isPostFlush=false] - Was this flush invoked as part of a post-process, or not?
     *
     * @return {this} This WebGLPipeline instance.
     */
    flush: function (isPostFlush)
    {
        if (isPostFlush === undefined) { isPostFlush = false; }

        var vertexCount = this.vertexCount;

        if (vertexCount > 0)
        {
            this.onBeforeFlush(isPostFlush);

            var gl = this.gl;
            var vertexSize = this.currentShader.vertexSize;

            if (vertexCount === this.vertexCapacity)
            {
                gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.DYNAMIC_DRAW);
            }
            else
            {
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));
            }

            gl.drawArrays(this.topology, 0, vertexCount);

            this.vertexCount = 0;

            this.onAfterFlush(isPostFlush);
        }

        return this;
    },

    /**
     * By default this is an empty method hook that you can override and use in your own custom pipelines.
     *
     * This method is called every time a **Game Object** asks the Pipeline Manager to use this pipeline.
     *
     * Unlike the `bind` method, which is only called once per frame, this is called for every object
     * that requests use of this pipeline, allowing you to perform per-object set-up, such as loading
     * shader uniform data.
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
     * as a result of a Game Object, then the Game Object refernce is passed to this hook too.
     *
     * This hook is called _after_ the quad (or tri) has been added to the batch, so you can safely
     * call 'flush' from within this.
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
     * has been cleared. If this pipeline has a targetTexture, it will be cleared.
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
     * This method is called once per frame, for every Camera in a Scene that wants to render.
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
     * This method is called once per frame, after all rendering has happened and snapshots have been taken.
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
     * It is called immediately before the gl.bufferData and gl.drawArray calls are made, so you can
     * perform any final pre-render modifications. To apply changes post-render, see `onPostBatch`.
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
     * @param {integer} unit - Texture unit to which the texture needs to be bound.
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
     * @param {integer} [unit=0] - Texture unit to which the texture needs to be bound.
     *
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchQuad: function (gameObject, x0, y0, x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, unit)
    {
        if (unit === undefined) { unit = this.currentUnit; }

        var postPipeline = (gameObject && gameObject.hasPostPipeline);

        if (postPipeline)
        {
            this.manager.preBatch(gameObject);
        }

        var hasFlushed = false;

        if (this.shouldFlush(6))
        {
            this.flush();

            hasFlushed = true;

            unit = this.setTexture2D(texture);
        }

        this.batchVert(x0, y0, u0, v0, unit, tintEffect, tintTL);
        this.batchVert(x1, y1, u0, v1, unit, tintEffect, tintBL);
        this.batchVert(x2, y2, u1, v1, unit, tintEffect, tintBR);
        this.batchVert(x0, y0, u0, v0, unit, tintEffect, tintTL);
        this.batchVert(x2, y2, u1, v1, unit, tintEffect, tintBR);
        this.batchVert(x3, y3, u1, v0, unit, tintEffect, tintTR);

        this.onBatch(gameObject);

        if (postPipeline)
        {
            this.manager.postBatch(gameObject);
        }

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
     * @param {integer} [unit=0] - Texture unit to which the texture needs to be bound.
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

            unit = this.setTexture2D(texture);
        }

        this.batchVert(x0, y0, u0, v0, unit, tintEffect, tintTL);
        this.batchVert(x1, y1, u0, v1, unit, tintEffect, tintTR);
        this.batchVert(x2, y2, u1, v1, unit, tintEffect, tintBL);

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
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#drawFillRect
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
        if (texture === undefined) { texture = this.renderer.whiteTexture.glTexture; }
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
        if (texture === undefined) { texture = this.renderer.whiteTexture.glTexture; }

        this.currentUnit = this.renderer.setTexture2D(texture);

        return this.currentUnit;
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
     * @param {integer} x - The new value of the `int` uniform.
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
     * @param {integer} x - The new X component of the `ivec2` uniform.
     * @param {integer} y - The new Y component of the `ivec2` uniform.
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
     * @param {integer} x - The new X component of the `ivec3` uniform.
     * @param {integer} y - The new Y component of the `ivec3` uniform.
     * @param {integer} z - The new Z component of the `ivec3` uniform.
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
     * @param {integer} x - X component of the uniform.
     * @param {integer} y - Y component of the uniform.
     * @param {integer} z - Z component of the uniform.
     * @param {integer} w - W component of the uniform.
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
     * @param {boolean} transpose - Should the matrix be transpose
     * @param {Float32Array} matrix - Matrix data
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
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    destroy: function ()
    {
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

        renderer.off(Events.RESIZE, this.resize, this);
        renderer.off(Events.PRE_RENDER, this.onPreRender, this);
        renderer.off(Events.RENDER, this.onRender, this);
        renderer.off(Events.POST_RENDER, this.onPostRender, this);

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

        return this;
    }

});

module.exports = WebGLPipeline;
