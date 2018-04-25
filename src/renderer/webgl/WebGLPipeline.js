/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Utils = require('./Utils');

/**
 * @classdesc
 * WebGLPipeline is a class that describes the way elements will be rendererd 
 * in WebGL, specially focused on batching vertices (batching is not provided). 
 * Pipelines are mostly used for describing 2D rendering passes but it's 
 * flexible enough to be used for any type of rendering including 3D. 
 * Internally WebGLPipeline will handle things like compiling shaders,
 * creating vertex buffers, assigning primitive topology and binding 
 * vertex attributes.
 *
 * The config properties are:
 * - game: Current game instance.
 * - renderer: Current WebGL renderer.
 * - gl: Current WebGL context.
 * - topology: This indicates how the primitives are rendered. The default value is GL_TRIANGLES.
 *              Here is the full list of rendering primitives (https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants).
 * - vertShader: Source for vertex shader as a string.
 * - fragShader: Source for fragment shader as a string.
 * - vertexCapacity: The amount of vertices that shall be allocated
 * - vertexSize: The size of a single vertex in bytes.
 * - vertices: An optional buffer of vertices
 * - attributes: An array describing the vertex attributes
 *  
 * The vertex attributes properties are:
 * - name : String - Name of the attribute in the vertex shader
 * - size : integer - How many components describe the attribute. For ex: vec3 = size of 3, float = size of 1
 * - type : GLenum - WebGL type (gl.BYTE, gl.SHORT, gl.UNSIGNED_BYTE, gl.UNSIGNED_SHORT, gl.FLOAT)
 * - normalized : boolean - Is the attribute normalized
 * - offset : integer - The offset in bytes to the current attribute in the vertex. Equivalent to offsetof(vertex, attrib) in C
 * Here you can find more information of how to describe an attribute:
 * - https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
 *
 * @class WebGLPipeline
 * @memberOf Phaser.Renderer.WebGL
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - [description]
 */
var WebGLPipeline = new Class({

    initialize:

    function WebGLPipeline (config)
    {
        /**
         * Name of the Pipeline. Used for identifying
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = 'WebGLPipeline';

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = config.game;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#view
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.view = config.game.canvas;

        /**
         * Used to store the current game resolution
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#resolution
         * @type {number}
         * @since 3.0.0
         */
        this.resolution = config.game.config.resolution;

        /**
         * Width of the current viewport
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = config.game.config.width * this.resolution;

        /**
         * Height of the current viewport
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = config.game.config.height * this.resolution;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#gl
         * @type {WebGLRenderingContext}
         * @since 3.0.0
         */
        this.gl = config.gl;

        /**
         * How many vertices have been fed to the current pipeline.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexCount
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.vertexCount = 0;

        /**
         * The limit of vertices that the pipeline can hold
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexCapacity
         * @type {integer}
         * @since 3.0.0
         */
        this.vertexCapacity = config.vertexCapacity;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 3.0.0
         */
        this.renderer = config.renderer;

        /**
         * Raw byte buffer of vertices.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexData
         * @type {ArrayBuffer}
         * @since 3.0.0
         */
        this.vertexData = (config.vertices ? config.vertices : new ArrayBuffer(config.vertexCapacity * config.vertexSize));

        /**
         * The handle to a WebGL vertex buffer object.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexBuffer
         * @type {WebGLBuffer}
         * @since 3.0.0
         */
        this.vertexBuffer = this.renderer.createVertexBuffer((config.vertices ? config.vertices : this.vertexData.byteLength), this.gl.STREAM_DRAW);

        /**
         * The handle to a WebGL program
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#program
         * @type {WebGLProgram}
         * @since 3.0.0
         */
        this.program = this.renderer.createProgram(config.vertShader, config.fragShader);

        /**
         * Array of objects that describe the vertex attributes
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#attributes
         * @type {object}
         * @since 3.0.0
         */
        this.attributes = config.attributes;

        /**
         * The size in bytes of the vertex
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexSize
         * @type {integer}
         * @since 3.0.0
         */
        this.vertexSize = config.vertexSize;

        /**
         * The primitive topology which the pipeline will use to submit draw calls
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#topology
         * @type {integer}
         * @since 3.0.0
         */
        this.topology = config.topology;

        /**
         * Uint8 view to the vertex raw buffer. Used for uploading vertex buffer resources
         * to the GPU.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#bytes
         * @type {Uint8Array}
         * @since 3.0.0
         */
        this.bytes = new Uint8Array(this.vertexData);

        /**
         * This will store the amount of components of 32 bit length
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexComponentCount
         * @type {integer}
         * @since 3.0.0
         */
        this.vertexComponentCount = Utils.getComponentCount(config.attributes, this.gl);

        /**
         * Indicates if the current pipeline is flushing the contents to the GPU.
         * When the variable is set the flush function will be locked.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#flushLocked
         * @type {boolean}
         * @since 3.1.0
         */
        this.flushLocked = false;
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
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    addAttribute: function (name, size, type, normalized, offset)
    {
        this.attributes.push({
            name: name,
            size: size,
            type: this.renderer.glFormats[type],
            normalized: normalized,
            offset: offset
        });

        return this;
    },

    /**
     * Check if the current batch of vertices is full.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#shouldFlush
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    shouldFlush: function ()
    {
        return (this.vertexCount >= this.vertexCapacity);
    },

    /**
     * Resizes the properties used to describe the viewport
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#resize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} resolution - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    resize: function (width, height, resolution)
    {
        this.width = width * resolution;
        this.height = height * resolution;
        return this;
    },

    /**
     * Binds the pipeline resources, including programs, vertex buffers and binds attributes
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#bind
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    bind: function ()
    {
        var gl = this.gl;
        var vertexBuffer = this.vertexBuffer;
        var attributes = this.attributes;
        var program = this.program;
        var renderer = this.renderer;
        var vertexSize = this.vertexSize;

        renderer.setProgram(program);
        renderer.setVertexBuffer(vertexBuffer);

        for (var index = 0; index < attributes.length; ++index)
        {
            var element = attributes[index];
            var location = gl.getAttribLocation(program, element.name);

            if (location >= 0)
            {
                gl.enableVertexAttribArray(location);
                gl.vertexAttribPointer(location, element.size, element.type, element.normalized, vertexSize, element.offset);
            }
            else
            {
                gl.disableVertexAttribArray(location);
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onBind
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    onBind: function ()
    {
        // This is for updating uniform data it's called on each bind attempt.
        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onPreRender
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    onPreRender: function ()
    {
        // called once every frame
        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onRender
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    onRender: function ()
    {
        // called for each camera
        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#onPostRender
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
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
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#destroy
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
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
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setFloat1
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {float} x - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setFloat1: function (name, x)
    {
        this.renderer.setFloat1(this.program, name, x);
        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setFloat2
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {float} x - [description]
     * @param {float} y - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setFloat2: function (name, x, y)
    {

        this.renderer.setFloat2(this.program, name, x, y);
        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setFloat3
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {float} x - [description]
     * @param {float} y - [description]
     * @param {float} z - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setFloat3: function (name, x, y, z)
    {

        this.renderer.setFloat3(this.program, name, x, y, z);
        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setFloat4
     * @since 3.2.0
     *
     * @param {string} name - Name of the uniform
     * @param {float} x - X component of the uniform
     * @param {float} y - Y component of the uniform
     * @param {float} z - Z component of the uniform
     * @param {float} w - W component of the uniform
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setFloat4: function (name, x, y, z, w)
    {

        this.renderer.setFloat4(this.program, name, x, y, z, w);
        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setInt1
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {integer} x - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setInt1: function (name, x)
    {
        this.renderer.setInt1(this.program, name, x);
        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setInt2
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {integer} x - [description]
     * @param {integer} y - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setInt2: function (name, x, y)
    {
        this.renderer.setInt2(this.program, name, x, y);
        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setInt3
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {integer} x - [description]
     * @param {integer} y - [description]
     * @param {integer} z - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setInt3: function (name, x, y, z)
    {
        this.renderer.setInt3(this.program, name, x, y, z);
        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setInt4
     * @since 3.2.0
     *
     * @param {string} name - Name of the uniform
     * @param {integer} x - X component of the uniform
     * @param {integer} y - Y component of the uniform
     * @param {integer} z - Z component of the uniform
     * @param {integer} w - W component of the uniform
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setInt4: function (name, x, y, z, w)
    {
        this.renderer.setInt4(this.program, name, x, y, z, w);
        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix2
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {boolean} transpose - [description]
     * @param {Float32Array} matrix - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setMatrix2: function (name, transpose, matrix)
    {
        this.renderer.setMatrix2(this.program, name, transpose, matrix);
        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     * [description]
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix3
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {boolean} transpose - [description]
     * @param {Float32Array} matrix - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setMatrix3: function (name, transpose, matrix)
    {
        this.renderer.setMatrix3(this.program, name, transpose, matrix);
        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix4
     * @since 3.2.0
     *
     * @param {string} name - Name of the uniform
     * @param {boolean} transpose - Should the matrix be transpose
     * @param {Float32Array} matrix - Matrix data
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setMatrix4: function (name, transpose, matrix)
    {
        this.renderer.setMatrix4(this.program, name, transpose, matrix);
        return this;
    }

});

module.exports = WebGLPipeline;
