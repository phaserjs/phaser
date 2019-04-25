/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var ShaderRender = require('./ShaderRender');
var TransformMatrix = require('../components/TransformMatrix');

/**
 * @classdesc
 * A Shader Game Object.
 *
 * @class Shader
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @webglOnly
 * @since 3.17.0
 *
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var Shader = new Class({

    Extends: GameObject,

    Mixins: [
        Components.ComputedSize,
        Components.Depth,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.ScrollFactor,
        Components.Transform,
        Components.Visible,
        ShaderRender
    ],

    initialize:

    function Shader (scene, x, y, width, height, vert, frag)
    {
        GameObject.call(this, scene, 'Shader');

        //  This Game Object cannot have a blend mode, so skip all checks
        this.blendMode = -1;

        this.vertexCount = 0;
        this.vertexCapacity = 6;

        var renderer = scene.sys.renderer;

        this.renderer = renderer;

        /**
         * The size in bytes of the vertex.
         * The attribute sizes all added together (2 + 2 + 1 + 4)
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexSize
         * @type {integer}
         * @since 3.0.0
         */
        this.vertexSize = Float32Array.BYTES_PER_ELEMENT * 2;

        /**
         * The WebGL context this WebGL Pipeline uses.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#gl
         * @type {WebGLRenderingContext}
         * @since 3.17.0
         */
        this.gl = this.renderer.gl;

        /**
         * Raw byte buffer of vertices.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexData
         * @type {ArrayBuffer}
         * @since 3.0.0
         */
        this.vertexData = new ArrayBuffer(this.vertexCapacity * this.vertexSize);

        /**
         * The handle to a WebGL vertex buffer object.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexBuffer
         * @type {WebGLBuffer}
         * @since 3.0.0
         */
        this.vertexBuffer = renderer.createVertexBuffer(this.vertexData.byteLength, this.gl.STREAM_DRAW);

        /**
         * The handle to a WebGL program
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#program
         * @type {WebGLProgram}
         * @since 3.0.0
         */
        this.program = null;

        /**
         * Array of objects that describe the vertex attributes
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#attributes
         * @type {object}
         * @since 3.0.0
         */
        this.attributes = [
            {
                name: 'inPosition',
                size: 2,
                type: this.gl.FLOAT,
                normalized: false,
                offset: 0
            }
        ];

        /**
         * The primitive topology which the pipeline will use to submit draw calls
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#topology
         * @type {integer}
         * @since 3.0.0
         */
        this.topology = this.gl.TRIANGLES;

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
         * Float32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.17.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix3 = new TransformMatrix();

        /**
         * View matrix
         * 
         * @name Phaser.Renderer.WebGL.Pipelines.ModelViewProjection#viewMatrix
         * @type {?Float32Array}
         * @readonly
         * @since 3.0.0
         */
        this.viewMatrix = new Float32Array([ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]);

        /**
         * Projection matrix
         * 
         * @name Phaser.Renderer.WebGL.Pipelines.ModelViewProjection#projectionMatrix
         * @type {?Float32Array}
         * @readonly
         * @since 3.0.0
         */
        this.projectionMatrix = new Float32Array([ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]);

        this._rendererWidth = renderer.width;
        this._rendererHeight = renderer.height;

        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0.5, 0.5);

        this.setShader(vert, frag);

        this.projOrtho(0, renderer.width, renderer.height, 0);
    },

    setShader: function (vertSource, fragSource)
    {
        var gl = this.gl;
        var renderer = this.renderer;

        if (this.program)
        {
            gl.deleteProgram(this.program);
        }

        var program = renderer.createProgram(vertSource, fragSource);

        renderer.setMatrix4(program, 'uViewMatrix', false, this.viewMatrix);
        renderer.setMatrix4(program, 'uProjectionMatrix', false, this.projectionMatrix);

        this.program = program;
    },

    /**
     * Sets up an orthographics projection matrix
     * 
     * @method Phaser.Renderer.WebGL.Pipelines.ModelViewProjection#projOrtho
     * @since 3.0.0
     *
     * @param {number} left - The left value.
     * @param {number} right - The right value.
     * @param {number} bottom - The bottom value.
     * @param {number} top - The top value.
     *
     * @return {this} This Model View Projection.
     */
    projOrtho: function (left, right, bottom, top)
    {
        var near = -1000;
        var far = 1000;

        var leftRight = 1 / (left - right);
        var bottomTop = 1 / (bottom - top);
        var nearFar = 1 / (near - far);

        var pm = this.projectionMatrix;

        pm[0] = -2 * leftRight;
        pm[5] = -2 * bottomTop;
        pm[10] = 2 * nearFar;
        pm[12] = (left + right) * leftRight;
        pm[13] = (top + bottom) * bottomTop;
        pm[14] = (far + near) * nearFar;

        var program = this.program;

        this.renderer.setMatrix4(program, 'uProjectionMatrix', false, this.projectionMatrix);

        this._rendererWidth = right;
        this._rendererHeight = bottom;
    },

    load: function (matrix2D)
    {
        //  ITRS

        var program = this.program;

        var x = -this._displayOriginX;
        var y = -this._displayOriginX;

        var vm = this.viewMatrix;

        vm[0] = matrix2D[0];
        vm[1] = matrix2D[1];
        vm[4] = matrix2D[2];
        vm[5] = matrix2D[3];
        vm[8] = matrix2D[4];
        vm[9] = matrix2D[5];
        vm[12] = vm[0] * x + vm[4] * y;
        vm[13] = vm[1] * x + vm[5] * y;

        this.renderer.setMatrix4(program, 'uViewMatrix', false, this.viewMatrix);

        //  Bind

        var gl = this.gl;
        var vertexBuffer = this.vertexBuffer;
        var attributes = this.attributes;
        var renderer = this.renderer;
        var vertexSize = this.vertexSize;

        renderer.setProgram(program);
        renderer.setVertexBuffer(vertexBuffer);

        for (var index = 0; index < attributes.length; index++)
        {
            var element = attributes[index];
            var location = gl.getAttribLocation(program, element.name);

            if (location >= 0)
            {
                gl.enableVertexAttribArray(location);
                gl.vertexAttribPointer(location, element.size, element.type, element.normalized, vertexSize, element.offset);
            }
            else if (location !== -1)
            {
                gl.disableVertexAttribArray(location);
            }
        }

        this.setFloat1('time', this.renderer.game.loop.time / 1000);
        this.setFloat2('resolution', this.width, this.height);

        //  Draw

        var width = this.width;
        var height = this.height;

        var vf = this.vertexViewF32;

        vf[3] = height;
        vf[4] = width;
        vf[5] = height;
        vf[8] = width;
        vf[9] = height;
        vf[10] = width;

        //  Flush

        var vertexCount = 6;
        var topology = this.topology;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));

        gl.drawArrays(topology, 0, vertexCount);
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
            offset: offset
        });

        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setFloat1
     * @since 3.2.0
     *
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {number} x - The new value of the `float` uniform.
     *
     * @return {this} This WebGLPipeline instance.
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
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {number} x - The new X component of the `vec2` uniform.
     * @param {number} y - The new Y component of the `vec2` uniform.
     *
     * @return {this} This WebGLPipeline instance.
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
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {number} x - The new X component of the `vec3` uniform.
     * @param {number} y - The new Y component of the `vec3` uniform.
     * @param {number} z - The new Z component of the `vec3` uniform.
     *
     * @return {this} This WebGLPipeline instance.
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
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {number} x - X component of the uniform
     * @param {number} y - Y component of the uniform
     * @param {number} z - Z component of the uniform
     * @param {number} w - W component of the uniform
     *
     * @return {this} This WebGLPipeline instance.
     */
    setFloat4: function (name, x, y, z, w)
    {
        this.renderer.setFloat4(this.program, name, x, y, z, w);

        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setFloat1v
     * @since 3.13.0
     *
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setFloat1v: function (name, arr)
    {
        this.renderer.setFloat1v(this.program, name, arr);

        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setFloat2v
     * @since 3.13.0
     *
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setFloat2v: function (name, arr)
    {
        this.renderer.setFloat2v(this.program, name, arr);

        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setFloat3v
     * @since 3.13.0
     *
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setFloat3v: function (name, arr)
    {
        this.renderer.setFloat3v(this.program, name, arr);

        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setFloat4v
     * @since 3.13.0
     *
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setFloat4v: function (name, arr)
    {
        this.renderer.setFloat4v(this.program, name, arr);

        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setInt1
     * @since 3.2.0
     *
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {integer} x - The new value of the `int` uniform.
     *
     * @return {this} This WebGLPipeline instance.
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
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {integer} x - The new X component of the `ivec2` uniform.
     * @param {integer} y - The new Y component of the `ivec2` uniform.
     *
     * @return {this} This WebGLPipeline instance.
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
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {integer} x - The new X component of the `ivec3` uniform.
     * @param {integer} y - The new Y component of the `ivec3` uniform.
     * @param {integer} z - The new Z component of the `ivec3` uniform.
     *
     * @return {this} This WebGLPipeline instance.
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
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {integer} x - X component of the uniform
     * @param {integer} y - Y component of the uniform
     * @param {integer} z - Z component of the uniform
     * @param {integer} w - W component of the uniform
     *
     * @return {this} This WebGLPipeline instance.
     */
    setInt4: function (name, x, y, z, w)
    {
        this.renderer.setInt4(this.program, name, x, y, z, w);

        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix2
     * @since 3.2.0
     *
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {boolean} transpose - Whether to transpose the matrix. Should be `false`.
     * @param {Float32Array} matrix - The new values for the `mat2` uniform.
     *
     * @return {this} This WebGLPipeline instance.
     */
    setMatrix2: function (name, transpose, matrix)
    {
        this.renderer.setMatrix2(this.program, name, transpose, matrix);

        return this;
    },

    /**
     * Set a uniform value of the current pipeline program.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#setMatrix3
     * @since 3.2.0
     *
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {boolean} transpose - Whether to transpose the matrix. Should be `false`.
     * @param {Float32Array} matrix - The new values for the `mat3` uniform.
     *
     * @return {this} This WebGLPipeline instance.
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
     * @param {string} name - The name of the uniform to look-up and modify.
     * @param {boolean} transpose - Should the matrix be transpose
     * @param {Float32Array} matrix - Matrix data
     *
     * @return {this} This WebGLPipeline instance.
     */
    setMatrix4: function (name, transpose, matrix)
    {
        this.renderer.setMatrix4(this.program, name, transpose, matrix);

        return this;
    },

    /**
     * Removes all object references in this WebGL Pipeline and removes its program from the WebGL context.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        var gl = this.gl;

        gl.deleteProgram(this.program);
        gl.deleteBuffer(this.vertexBuffer);

    }

});

module.exports = Shader;
