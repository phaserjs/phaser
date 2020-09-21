/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var Utils = require('./Utils');

/**
 * @classdesc
 *
 * The `WebGLPipeline` is a base class used by all of the core Phaser pipelines.
 *
 * It describes the way elements will be rendered in WebGL. Internally, it handles
 * compiling the shaders, creating vertex buffers, assigning primitive topolgy and
 * binding vertex attributes, all based on the given configuration data.
 *
 * The pipeline is configured by passing in a `WebGLPipelineConfig` object. Please
 * see the documentation for this type to fully understand the configuration options
 * available to you.
 *
 * Usually, you would not extend from this class directly, but would instead extend
 * from one of the core pipelines, such as the Multi Pipeline or Rope Pipeline.
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
         * Name of the pipeline. Used for identification.
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
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexSize
         * @type {integer}
         * @since 3.0.0
         */
        this.vertexSize = GetFastValue(config, 'vertexSize', 28);

        /**
         * Raw byte buffer of vertices.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexData
         * @type {ArrayBuffer}
         * @since 3.0.0
         */
        this.vertexData = GetFastValue(config, 'vertices', new ArrayBuffer(this.vertexCapacity * this.vertexSize));

        /**
         * The WebGLBuffer that holds the vertex data.
         * Created from the `vertices` config ArrayBuffer that was passed in, or set by default, by the pipeline.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexBuffer
         * @type {WebGLBuffer}
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
         * The handle to a WebGL program.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#program
         * @type {WebGLProgram}
         * @since 3.0.0
         */
        this.program = this.renderer.createProgram(config.vertShader, config.fragShader);

        /**
         * Array of objects that describe the vertex attributes.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#attributes
         * @type {Phaser.Types.Renderer.WebGL.WebGLPipelineAttributesConfig}
         * @since 3.0.0
         */
        this.attributes = config.attributes;

        /**
         * Array of objects that describe the shader uniforms.
         * This is populated with their locations when the shader is created.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#uniforms
         * @type {Phaser.Types.Renderer.WebGL.WebGLPipelineUniformsConfig}
         * @since 3.50.0
         */
        this.uniforms = {};

        /**
         * The primitive topology which the pipeline will use to submit draw calls.
         * Defaults to GL_TRIANGLES if not otherwise set.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#topology
         * @type {GLenum}
         * @since 3.0.0
         */
        this.topology = GetFastValue(config, 'topology', gl.TRIANGLES);

        /**
         * Uint8 view to the vertex raw buffer. Used for uploading vertex buffer resources to the GPU.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#bytes
         * @type {Uint8Array}
         * @since 3.0.0
         */
        this.bytes = new Uint8Array(this.vertexData);

        /**
         * This will store the amount of components of 32 bit length.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexComponentCount
         * @type {integer}
         * @since 3.0.0
         */
        this.vertexComponentCount = Utils.getComponentCount(this.attributes, gl);

        /**
         * Indicates if the current pipeline is flushing the contents to the GPU.
         * When the variable is set the flush function will be locked.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#flushLocked
         * @type {boolean}
         * @since 3.1.0
         */
        this.flushLocked = false;

        /**
         * Indicates if the current pipeline is active or not for this frame only.
         * Reset in the onRender method.
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
         * This boolean should be set when that is the case.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#forceZero
         * @type {boolean}
         * @since 3.50.0
         */
        this.forceZero = false;

        /**
         * Indicates if the current pipeline has booted or not.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#hasBooted
         * @type {boolean}
         * @readonly
         * @since 3.50.0
         */
        this.hasBooted = false;

        if (config.uniforms)
        {
            this.setUniformLocations(config.uniforms);
        }
    },

    /**
     * Called when the Game has fully booted and the Renderer has finished setting up.
     *
     * By this stage all Game level systems are now in place and you can perform any final
     * tasks that the pipeline may need that relied on game systems such as the Texture Manager.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#boot
     * @since 3.11.0
     */
    boot: function ()
    {
        var renderer = this.renderer;

        renderer.setProgram(this.program);
        renderer.setVertexBuffer(this.vertexBuffer);

        this.setAttribPointers(true);

        this.hasBooted = true;

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
     * Adds a description of vertex attribute to the pipeline
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
     * Resizes the properties used to describe the viewport
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

        return this;
    },

    /**
     * Binds the pipeline resources, including the program, vertex buffer and attribute pointers.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#bind
     * @since 3.0.0
     *
     * @param {boolean} [reset=false] - Should the pipeline be fully re-bound after a renderer pipeline clear?
     *
     * @return {this} This WebGLPipeline instance.
     */
    bind: function (reset)
    {
        if (reset === undefined) { reset = false; }

        var vertexBuffer = this.vertexBuffer;
        var program = this.program;
        var renderer = this.renderer;

        renderer.setProgram(program);
        renderer.setVertexBuffer(vertexBuffer);

        this.setAttribPointers(reset);

        return this;
    },

    /**
     * Sets up the `WebGLPipeline.uniforms` object, populating it with the names
     * and locations of the shader uniforms.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setUniformLocations
     * @since 3.50.0
     *
     * @param {string[]} uniformNames - An array of the uniform names to get the locations for.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setUniformLocations: function (uniformNames)
    {
        var gl = this.gl;
        var program = this.program;
        var uniforms = this.uniforms;

        for (var i = 0; i < uniformNames.length; i++)
        {
            var name = uniformNames[i];

            var location = gl.getUniformLocation(program, name);

            if (location !== null)
            {
                uniforms[name] = location;
            }
        }

        return this;
    },

    /**
     * Sets the vertex attribute pointers.
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
        var program = this.program;

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
     * This method is called every time a Game Object asks the Pipeline Manager to use this pipeline.
     *
     * Unlike the `bind` method, which is only called once per frame, this is called for every object
     * that requests it, allowing you to perform per-object GL set-up.
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
        // This is for updating uniform data it's called on each bind attempt.
        return this;
    },

    /**
     * Called before each frame is rendered, but after the canvas has been cleared.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onPreRender
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    onPreRender: function ()
    {
        // called once every frame
        return this;
    },

    /**
     * Called before a Scene's Camera is rendered.
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
        // called for each camera
        return this;
    },

    /**
     * Called after each frame has been completely rendered and snapshots have been taken.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onPostRender
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    onPostRender: function ()
    {
        // called once every frame
        return this;
    },

    /**
     * Uploads the vertex data and emits a draw call
     * for the current batch of vertices.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#flush
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    flush: function ()
    {
        if (this.flushLocked) { return this; }

        this.flushLocked = true;

        var gl = this.gl;
        var vertexCount = this.vertexCount;
        var topology = this.topology;
        var vertexSize = this.vertexSize;

        if (vertexCount === 0)
        {
            this.flushLocked = false;
            return;
        }

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));
        gl.drawArrays(topology, 0, vertexCount);

        this.vertexCount = 0;
        this.flushLocked = false;

        return this;
    },

    /**
     * Removes all object references in this WebGL Pipeline and removes its program from the WebGL context.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#destroy
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    destroy: function ()
    {
        var gl = this.gl;

        gl.deleteProgram(this.program);
        gl.deleteBuffer(this.vertexBuffer);

        delete this.program;
        delete this.vertexBuffer;
        delete this.gl;

        return this;
    },

    /**
     * Sets a 1f uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set1f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new value of the `float` uniform.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set1f: function (name, x)
    {
        this.gl.uniform1f(this.uniforms[name], x);

        return this;
    },

    /**
     * Sets a 2f uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set2f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new X component of the `vec2` uniform.
     * @param {number} y - The new Y component of the `vec2` uniform.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set2f: function (name, x, y)
    {
        this.gl.uniform2f(this.uniforms[name], x, y);

        return this;
    },

    /**
     * Sets a 3f uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set3f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new X component of the `vec3` uniform.
     * @param {number} y - The new Y component of the `vec3` uniform.
     * @param {number} z - The new Z component of the `vec3` uniform.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set3f: function (name, x, y, z)
    {
        this.gl.uniform3f(this.uniforms[name], x, y, z);

        return this;
    },

    /**
     * Sets a 4f uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set4f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - X component of the uniform
     * @param {number} y - Y component of the uniform
     * @param {number} z - Z component of the uniform
     * @param {number} w - W component of the uniform
     *
     * @return {this} This WebGLPipeline instance.
     */
    set4f: function (name, x, y, z, w)
    {
        this.gl.uniform4f(this.uniforms[name], x, y, z, w);

        return this;
    },

    /**
     * Sets a 1fv uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set1fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set1fv: function (name, arr)
    {
        this.gl.uniform1fv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 2fv uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set2fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set2fv: function (name, arr)
    {
        this.gl.uniform2fv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 3fv uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set3fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set3fv: function (name, arr)
    {
        this.gl.uniform3fv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 4fv uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set4fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set4fv: function (name, arr)
    {
        this.gl.uniform4fv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 1iv uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set1iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set1iv: function (name, arr)
    {
        this.gl.uniform1iv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 2iv uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set2iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set2iv: function (name, arr)
    {
        this.gl.uniform2iv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 3iv uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set3iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set3iv: function (name, arr)
    {
        this.gl.uniform3iv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 4iv uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set4iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set4iv: function (name, arr)
    {
        this.gl.uniform4iv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 1i uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set1i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {integer} x - The new value of the `int` uniform.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set1i: function (name, x)
    {
        this.gl.uniform1i(this.uniforms[name], x);

        return this;
    },

    /**
     * Sets a 2i uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set2i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {integer} x - The new X component of the `ivec2` uniform.
     * @param {integer} y - The new Y component of the `ivec2` uniform.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set2i: function (name, x, y)
    {
        this.gl.uniform2i(this.uniforms[name], x, y);

        return this;
    },

    /**
     * Sets a 3i uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set3i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {integer} x - The new X component of the `ivec3` uniform.
     * @param {integer} y - The new Y component of the `ivec3` uniform.
     * @param {integer} z - The new Z component of the `ivec3` uniform.
     *
     * @return {this} This WebGLPipeline instance.
     */
    set3i: function (name, x, y, z)
    {
        this.gl.uniform3i(this.uniforms[name], x, y, z);

        return this;
    },

    /**
     * Sets a 4i uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#set4i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {integer} x - X component of the uniform
     * @param {integer} y - Y component of the uniform
     * @param {integer} z - Z component of the uniform
     * @param {integer} w - W component of the uniform
     *
     * @return {this} This WebGLPipeline instance.
     */
    set4i: function (name, x, y, z, w)
    {
        this.gl.uniform4i(this.uniforms[name], x, y, z, w);

        return this;
    },

    /**
     * Sets a matrix 2fv uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix2fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {boolean} transpose - Whether to transpose the matrix. Should be `false`.
     * @param {number[]|Float32Array} matrix - The new values for the `mat2` uniform.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setMatrix2fv: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix2fv(this.uniforms[name], transpose, matrix);

        return this;
    },

    /**
     * Sets a matrix 3fv uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix3fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {boolean} transpose - Whether to transpose the matrix. Should be `false`.
     * @param {Float32Array} matrix - The new values for the `mat3` uniform.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setMatrix3fv: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix3fv(this.uniforms[name], transpose, matrix);

        return this;
    },

    /**
     * Sets a matrix 4fv uniform value based on the given name on this pipeline.
     *
     * The pipeline shader must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix4fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {boolean} transpose - Should the matrix be transpose
     * @param {Float32Array} matrix - Matrix data
     *
     * @return {this} This WebGLPipeline instance.
     */
    setMatrix4fv: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix4fv(this.uniforms[name], transpose, matrix);

        return this;
    }

});

module.exports = WebGLPipeline;
