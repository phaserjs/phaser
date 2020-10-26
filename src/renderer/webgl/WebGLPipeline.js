/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var Matrix4 = require('../../math/Matrix4');
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
         * The total number of vertices that the pipeline batch can hold before it will flush.
         * This defaults to `batchSize * 6`, where `batchSize` is defined in the Renderer Config.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexCapacity
         * @type {integer}
         * @since 3.0.0
         */
        this.vertexCapacity = GetFastValue(config, 'vertexCapacity', renderer.config.batchSize * 6);

        /**
         * The size, in bytes, of a single vertex.
         *
         * This is derived by adding together all of the vertex attributes.
         *
         * For example, the Multi Pipeline has the following attributes:
         *
         * inPosition - (size 2 x gl.FLOAT) = 8
         * inTexCoord - (size 2 x gl.FLOAT) = 8
         * inTexId - (size 1 x gl.FLOAT) = 4
         * inTintEffect - (size 1 x gl.FLOAT) = 4
         * inTint - (size 4 x gl.UNSIGNED_BYTE) = 4
         *
         * The total is 8 + 8 + 4 + 4 + 4 = 28, which is the default for this property.
         *
         * Other pipelines may require different totals. Use the config property to set it, as it can't be changed post-creation.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexSize
         * @type {integer}
         * @readonly
         * @since 3.0.0
         */
        this.vertexSize = GetFastValue(config, 'vertexSize', 28);

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
        this.vertexData = GetFastValue(config, 'vertices', new ArrayBuffer(this.vertexCapacity * this.vertexSize));

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
        if (GetFastValue(config, 'vertices', null))
        {
            this.vertexBuffer = this.renderer.createVertexBuffer(this.vertexData, this.gl.STREAM_DRAW);
        }
        else
        {
            this.vertexBuffer = this.renderer.createVertexBuffer(this.vertexData.byteLength, this.gl.STREAM_DRAW);
        }

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
        this.bytes = new Uint8Array(this.vertexData);

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
        this.forceZero = false;

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
         * Array of objects that describe the vertex attributes.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#attributes
         * @type {Phaser.Types.Renderer.WebGL.WebGLPipelineAttributesConfig}
         * @since 3.0.0
         */
        this.attributes = config.attributes;

        /**
         * The amount of vertex attribute components of 32 bit length.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexComponentCount
         * @type {integer}
         * @since 3.0.0
         */
        this.vertexComponentCount = Utils.getComponentCount(this.attributes, this.gl);

        /**
         * An array of all the WebGLShader instances that belong to this pipeline.
         *
         * All shaders must use the same attributes, as set by this pipeline, but can manage their own
         * uniforms.
         *
         * These are set in a call to the `setShadersFromConfig` method, which happens automatically,
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
         * The Model matrix, used by shaders as 'uModelMatrix' uniform.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#modelMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.modelMatrix = new Matrix4().identity();

        /**
         * The View matrix, used by shaders as 'uViewMatrix' uniform.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#viewMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.viewMatrix = new Matrix4().identity();

        /**
         * The Projection matrix, used by shaders as 'uProjectionMatrix' uniform.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#projectionMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.projectionMatrix = new Matrix4().identity();

        this.mvpDirty = true;

        this.tempConfig = config;
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
        this.setShadersFromConfig(this.tempConfig);

        this.renderer.setVertexBuffer(this.vertexBuffer);

        this.setAttribPointers(true);

        this.hasBooted = true;

        return this;
    },

    /**
     * Sets the model, projection and view matrices to identity matrices.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#mvpInit
     * @since 3.50.0
     */
    mvpInit: function ()
    {
        this.modelMatrix.identity();
        this.projectionMatrix.identity();
        this.viewMatrix.identity();
    },

    /**
     * Sets the currently active shader within this pipeline.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setShader
     * @since 3.50.0
     *
     * @param {number} index - The index of the shader to set.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setShader: function (index)
    {
        var shader = this.shaders[index];

        if (shader)
        {
            shader.bind();

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

        for (i = 0; i < shaders.length; i++)
        {
            shaders[i].destroy();
        }

        var defaultVertShader = GetFastValue(config, 'vertShader', null);
        var defaultFragShader = GetFastValue(config, 'fragShader', null);
        var defaultUniforms = GetFastValue(config, 'uniforms', null);

        var configShaders = GetFastValue(config, 'shaders', []);

        var len = configShaders.length;

        if (len === 0)
        {
            this.shaders = [ new WebGLShader(this, 'default', defaultVertShader, defaultFragShader, defaultUniforms) ];
        }
        else
        {
            for (i = 0; i < len; i++)
            {
                var shaderEntry = configShaders[i];

                var name = GetFastValue(shaderEntry, 'name', 'default');

                var vertShader = GetFastValue(shaderEntry, 'vertShader', defaultVertShader);
                var fragShader = GetFastValue(shaderEntry, 'fragShader', defaultFragShader);
                var uniforms = GetFastValue(shaderEntry, 'uniforms', defaultUniforms);

                configShaders.push(new WebGLShader(this, name, vertShader, fragShader, uniforms));
            }

            this.shaders = configShaders;
        }

        this.currentShader = this.shaders[0];

        return this;
    },

    /**
     * Adds a description of vertex attribute to the pipeline.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#addAttribute
     * @since 3.2.0
     *
     * @param {string} name - Name of the vertex attribute
     * @param {integer} size - Vertex component size
     * @param {integer} type - Type of the attribute
     * @param {boolean} normalized - Is the value normalized to a range
     * @param {integer} offset - Byte offset to the beginning of the first element in the vertex
     *
     * @return {this} This WebGLPipeline instance.
     */
    addAttribute: function (name, size, type, normalized, offset)
    {
        this.attributes.push({
            name: name,
            size: size,
            type: this.renderer.glFormats[type],
            normalized: normalized,
            offset: offset,
            enabled: false,
            location: -1
        });

        this.vertexComponentCount = Utils.getComponentCount(this.attributes, this.gl);

        return this;
    },

    /**
     * Sets the vertex attribute pointers.
     *
     * This should only be called after the vertex buffer has been bound.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setAttribPointers
     * @since 3.50.0
     *
     * @param {boolean} [reset=false] - Reset the vertex attribute locations?
     *
     * @return {this} This WebGLPipeline instance.
     */
    setAttribPointers: function (reset)
    {
        if (reset === undefined) { reset = false; }

        var gl = this.gl;
        var attributes = this.attributes;
        var vertexSize = this.vertexSize;
        var program = this.currentShader.program;

        for (var i = 0; i < attributes.length; i++)
        {
            var element = attributes[i];

            if (reset)
            {
                var location = gl.getAttribLocation(program, element.name);

                if (location >= 0)
                {
                    gl.enableVertexAttribArray(location);
                    gl.vertexAttribPointer(location, element.size, element.type, element.normalized, vertexSize, element.offset);
                    element.enabled = true;
                    element.location = location;
                }
                else if (location !== -1)
                {
                    gl.disableVertexAttribArray(location);
                }
            }
            else if (element.enabled)
            {
                gl.vertexAttribPointer(element.location, element.size, element.type, element.normalized, vertexSize, element.offset);
            }
            else if (!element.enabled && element.location > -1)
            {
                gl.disableVertexAttribArray(element.location);
                element.location = -1;
            }
        }
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

        return (this.vertexCount + amount >= this.vertexCapacity);
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
        this.width = width;
        this.height = height;

        this.projectionMatrix.ortho(0, width, height, 0, -1000, 1000);

        this.mvpDirty = true;

        return this;
    },

    /**
     * Binds the pipeline resources, including the give shader, vertex buffer and attribute pointers.
     *
     * This method is called every time this pipeline is made the current active pipeline.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#bind
     * @since 3.0.0
     *
     * @param {boolean} [reset=false] - Should the pipeline be fully re-bound after a renderer pipeline clear?
     * @param {number} [shader=0] - If this is a multi-shader pipeline, which shader should be bound?
     *
     * @return {this} This WebGLPipeline instance.
     */
    bind: function (reset, shader)
    {
        if (reset === undefined) { reset = false; }

        if (shader !== undefined)
        {
            this.setShader(shader);
        }

        this.currentShader.bind();

        this.renderer.setVertexBuffer(this.vertexBuffer);

        this.setAttribPointers(reset);

        return this;
    },

    /**
     * This method is called every time a **Game Object** asks the Pipeline Manager to use this pipeline.
     *
     * Unlike the `bind` method, which is only called once per frame, this is called for every object
     * that requests use of this pipeline, allowing you to perform per-object set-up, such as loading
     * shader uniform data.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onBind
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object that invoked this pipeline, if any.
     *
     * @return {this} This WebGLPipeline instance.
     */
    onBind: function ()
    {
        return this;
    },

    /**
     * This method is called once per frame, right before anything has been rendered, but after the canvas
     * has been cleared.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onPreRender
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    onPreRender: function ()
    {
        return this;
    },

    /**
     * This method is called once per frame, for every Camera in a Scene that wants to render.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onRender
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene being rendered.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Scene Camera being rendered with.
     *
     * @return {this} This WebGLPipeline instance.
     */
    onRender: function ()
    {
        return this;
    },

    /**
     * This method is called once per frame, after all rendering has happened and snapshots have been taken.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onPostRender
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    onPostRender: function ()
    {
        return this;
    },

    /**
     * Uploads the vertex data and emits a draw call for the current batch of vertices.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#flush
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    flush: function ()
    {
        var gl = this.gl;
        var vertexCount = this.vertexCount;
        var topology = this.topology;
        var vertexSize = this.vertexSize;

        if (vertexCount === 0)
        {
            return;
        }

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));
        gl.drawArrays(topology, 0, vertexCount);

        this.vertexCount = 0;

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
        var shaders = this.shaders;

        for (var i = 0; i < shaders.length; i++)
        {
            shaders[i].destroy();
        }

        this.gl.deleteBuffer(this.vertexBuffer);

        this.game = null;
        this.renderer = null;
        this.gl = null;
        this.view = null;
        this.shaders = null;
        this.vertexData = null;
        this.vertexBuffer = null;

        return this;
    }

});

module.exports = WebGLPipeline;
