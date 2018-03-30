/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Utils = require('./Utils');

/**
 * @classdesc
 * [description]
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
         * [description]
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
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#resolution
         * @type {number}
         * @since 3.0.0
         */
        this.resolution = config.game.config.resolution;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = config.game.config.width * this.resolution;

        /**
         * [description]
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
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexCount
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.vertexCount = 0;

        /**
         * [description]
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
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexData
         * @type {ArrayBuffer}
         * @since 3.0.0
         */
        this.vertexData = (config.vertices ? config.vertices : new ArrayBuffer(config.vertexCapacity * config.vertexSize));

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexBuffer
         * @type {WebGLBuffer}
         * @since 3.0.0
         */
        this.vertexBuffer = this.renderer.createVertexBuffer((config.vertices ? config.vertices : this.vertexData.byteLength), this.gl.STREAM_DRAW);

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#program
         * @type {WebGLProgram}
         * @since 3.0.0
         */
        this.program = this.renderer.createProgram(config.vertShader, config.fragShader);

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#attributes
         * @type {object}
         * @since 3.0.0
         */
        this.attributes = config.attributes;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexSize
         * @type {integer}
         * @since 3.0.0
         */
        this.vertexSize = config.vertexSize;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#topology
         * @type {integer}
         * @since 3.0.0
         */
        this.topology = config.topology;

        /**
         * [description]
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#addAttribute
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {integer} size - [description]
     * @param {integer} type - [description]
     * @param {boolean} normalized - [description]
     * @param {integer} offset - [description]
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
     * [description]
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
     * [description]
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
     * [description]
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
     * [description]
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
     * [description]
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
     * [description]
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
     * [description]
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setFloat4
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {float} x - [description]
     * @param {float} y - [description]
     * @param {float} z - [description]
     * @param {float} w - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setFloat4: function (name, x, y, z, w)
    {

        this.renderer.setFloat4(this.program, name, x, y, z, w);
        return this;
    },

    /**
     * [description]
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
     * [description]
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
     * [description]
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setInt4
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {integer} x - [description]
     * @param {integer} y - [description]
     * @param {integer} z - [description]
     * @param {integer} w - [description]
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    setInt4: function (name, x, y, z, w)
    {
        this.renderer.setInt4(this.program, name, x, y, z, w);
        return this;
    },

    /**
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix4
     * @since 3.2.0
     *
     * @param {string} name - [description]
     * @param {boolean} transpose - [description]
     * @param {Float32Array} matrix - [description]
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
