/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var Merge = require('../../utils/object/Merge');
var ShaderRender = require('./ShaderRender');
var TransformMatrix = require('../components/TransformMatrix');

/**
 * @classdesc
 * A Shader Game Object.
 * 
 * TODO:
 * 
 * Test with sampler2D shader
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
 * @param {string} key - The key of the shader to use from the shader cache.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
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

    function Shader (scene, key, x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }

        GameObject.call(this, scene, 'Shader');

        /**
         * This Game Object cannot have a blend mode, so skip all checks.
         * 
         * @name Phaser.GameObjects.Shader#blendMode
         * @type {integer}
         * @private
         * @since 3.17.0
         */
        this.blendMode = -1;

        /**
         * The underlying shader object being used.
         * Empty by default and set during a call to the `setShader` method.
         * 
         * @name Phaser.GameObjects.Shader#shader
         * @type {Phaser.Display.Shader}
         * @since 3.17.0
         */
        this.shader;

        var renderer = scene.sys.renderer;

        /**
         * A reference to the current renderer.
         * Shaders only work with the WebGL Renderer.
         * 
         * @name Phaser.GameObjects.Shader#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.17.0
         */
        this.renderer = renderer;

        /**
         * The WebGL context belonging to the renderer.
         *
         * @name Phaser.GameObjects.Shader#gl
         * @type {WebGLRenderingContext}
         * @since 3.17.0
         */
        this.gl = renderer.gl;

        /**
         * Raw byte buffer of vertices this Shader uses.
         *
         * @name Phaser.GameObjects.Shader#vertexData
         * @type {ArrayBuffer}
         * @since 3.17.0
         */
        this.vertexData = new ArrayBuffer(6 * (Float32Array.BYTES_PER_ELEMENT * 2));

        /**
         * The WebGL vertex buffer object this shader uses.
         *
         * @name Phaser.GameObjects.Shader#vertexBuffer
         * @type {WebGLBuffer}
         * @since 3.17.0
         */
        this.vertexBuffer = renderer.createVertexBuffer(this.vertexData.byteLength, this.gl.STREAM_DRAW);

        /**
         * The WebGL shader program this shader uses.
         *
         * @name Phaser.GameObjects.Shader#program
         * @type {WebGLProgram}
         * @since 3.17.0
         */
        this.program = null;

        /**
         * Uint8 view to the vertex raw buffer. Used for uploading vertex buffer resources to the GPU.
         *
         * @name Phaser.GameObjects.Shader#bytes
         * @type {Uint8Array}
         * @since 3.17.0
         */
        this.bytes = new Uint8Array(this.vertexData);

        /**
         * Float32 view of the array buffer containing the shaders vertices.
         *
         * @name Phaser.GameObjects.Shader#vertexViewF32
         * @type {Float32Array}
         * @since 3.17.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.GameObjects.Shader#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.GameObjects.Shader#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.GameObjects.Shader#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix3 = new TransformMatrix();

        /**
         * The view matrix the shader uses during rendering.
         * 
         * @name Phaser.GameObjects.Shader#viewMatrix
         * @type {Float32Array}
         * @readonly
         * @since 3.17.0
         */
        this.viewMatrix = new Float32Array([ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]);

        /**
         * The projection matrix the shader uses during rendering.
         * 
         * @name Phaser.GameObjects.Shader#projectionMatrix
         * @type {Float32Array}
         * @readonly
         * @since 3.17.0
         */
        this.projectionMatrix = new Float32Array([ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]);

        /**
         * The default uniform mappings. These can be added to (or replaced) by specifying your own uniforms when
         * creating this shader game object. The uniforms are updated automatically during the render step.
         * 
         * The defaults are:
         * 
         * `resolution` (2f) - Set to the size of this shader.
         * `time` (1f) - The elapsed game time, in seconds.
         * `mouse` (2f) - If a pointer has been bound (with `setPointer`), this uniform contains its position each frame.
         * `date` (4fv) - A vec4 containing the year, month, day and time in seconds.
         * `sampleRate` (1f) - Sound sample rate. 44100 by default.
         * `iChannel0...3` (sampler2D) - Input channels 0 to 3. `null` by default.
         * 
         * @name Phaser.GameObjects.Shader#uniforms
         * @type {any}
         * @since 3.17.0
         */
        this.uniforms = {};

        /**
         * The pointer bound to this shader, if any.
         * Set via the chainable `setPointer` method, or by modifying this property directly.
         * 
         * @name Phaser.GameObjects.Shader#pointer
         * @type {Phaser.Input.Pointer}
         * @since 3.17.0
         */
        this.pointer = null;

        /**
         * The cached width of the renderer.
         * 
         * @name Phaser.GameObjects.Shader#_rendererWidth
         * @type {number}
         * @private
         * @since 3.17.0
         */
        this._rendererWidth = renderer.width;

        /**
         * The cached height of the renderer.
         * 
         * @name Phaser.GameObjects.Shader#_rendererHeight
         * @type {number}
         * @private
         * @since 3.17.0
         */
        this._rendererHeight = renderer.height;

        var gl = this.gl;

        /**
         * Internal gl function mapping for uniform look-up.
         * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
         * 
         * @name Phaser.GameObjects.Shader#_glFuncMap
         * @type {any}
         * @private
         * @since 3.17.0
         */
        this._glFuncMap = {

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

        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0.5, 0.5);
        this.setShader(key);
        this.projOrtho(0, renderer.width, renderer.height, 0);
    },

    /**
     * Sets the fragment and, optionally, the vertex shader source code that this Shader will use.
     * This will immediately delete the active shader program, if set, and then create a new one
     * with the given source. Finally, the shader uniforms are initialized.
     *
     * @method Phaser.GameObjects.Shader#setShader
     * @since 3.17.0
     * 
     * @param {string} key - The key of the shader stored in the shader cache to use.
     * 
     * @return {this} This Shader instance.
     */
    setShader: function (key)
    {
        this.shader = this.scene.sys.cache.shader.get(key);

        var gl = this.gl;
        var renderer = this.renderer;

        if (this.program)
        {
            gl.deleteProgram(this.program);
        }

        var program = renderer.createProgram(this.shader.vertexSrc, this.shader.fragmentSrc);

        renderer.setMatrix4(program, 'uViewMatrix', false, this.viewMatrix);
        renderer.setMatrix4(program, 'uProjectionMatrix', false, this.projectionMatrix);

        this.program = program;

        var d = new Date();

        this.uniforms = Merge(this.shader.uniforms, {
            resolution: { type: '2f', value: { x: this.width, y: this.height }},
            time: { type: '1f', value: 0 },
            mouse: { type: '2f', value: { x: this.width / 2, y: this.height / 2 } },
            date: { type: '4fv', value: [ d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds() ] },
            sampleRate: { type: '1f', value: 44100.0 },
            iChannel0: { type: 'sampler2D', value: null, textureData: { repeat: true } },
            iChannel1: { type: 'sampler2D', value: null, textureData: { repeat: true } },
            iChannel2: { type: 'sampler2D', value: null, textureData: { repeat: true } },
            iChannel3: { type: 'sampler2D', value: null, textureData: { repeat: true } }
        });

        this.initUniforms();

        return this;
    },

    /**
     * Binds a Phaser Pointer object to this Shader.
     * 
     * The screen position of the pointer will be set in to the shaders `mouse` uniform
     * automatically every frame. Call this method with no arguments to unbind the pointer.
     *
     * @method Phaser.GameObjects.Shader#setPointer
     * @since 3.17.0
     * 
     * @param {Phaser.Input.Pointer} [pointer] - The Pointer to bind to this shader.
     * 
     * @return {this} This Shader instance.
     */
    setPointer: function (pointer)
    {
        this.pointer = pointer;

        return this;
    },

    /**
     * Sets this shader to use an orthographic projection matrix.
     * This matrix is stored locally in the `projectionMatrix` property,
     * as well as being bound to the `uProjectionMatrix` uniform.
     * 
     * @method Phaser.GameObjects.Shader#projOrtho
     * @since 3.17.0
     *
     * @param {number} left - The left value.
     * @param {number} right - The right value.
     * @param {number} bottom - The bottom value.
     * @param {number} top - The top value.
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

    // Uniforms are specified in the GLSL_ES Specification: http://www.khronos.org/registry/webgl/specs/latest/1.0/
    // http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf

    /**
     * Initializes all of the uniforms this shader uses.
     * 
     * @method Phaser.GameObjects.Shader#initUniforms
     * @private
     * @since 3.17.0
     */
    initUniforms: function ()
    {
        var gl = this.gl;
        var map = this._glFuncMap;
        var program = this.program;

        for (var key in this.uniforms)
        {
            var uniform = this.uniforms[key];

            var type = uniform.type;
            var data = map[type];

            if (type === 'sampler2D')
            {
                // this.initSampler2D(uniform);
            }
            else
            {
                uniform.glMatrix = data.matrix;
                uniform.glValueLength = data.length;
                uniform.glFunc = data.func;
                uniform.uniformLocation = gl.getUniformLocation(program, key);
            }
        }
    },

    /**
     * Synchronizes all of the uniforms this shader uses.
     * Each uniforms gl function is called in turn.
     * 
     * @method Phaser.GameObjects.Shader#syncUniforms
     * @private
     * @since 3.17.0
     */
    syncUniforms: function ()
    {
        var gl = this.gl;

        var uniforms = this.uniforms;
        var uniform;
        var length;
        var glFunc;
        var location;
        var value;

        // var textureCount = 1;
    
        for (var key in uniforms)
        {
            uniform = uniforms[key];

            glFunc = uniform.glFunc;
            length = uniform.glValueLength;
            location = uniform.uniformLocation;
            value = uniform.value;

            if (length === 1)
            {
                if (uniform.glMatrix)
                {
                    glFunc.call(gl, location, uniform.transpose, value);
                }
                else
                {
                    glFunc.call(gl, location, value);
                }
            }
            else if (length === 2)
            {
                glFunc.call(gl, location, value.x, value.y);
            }
            else if (length === 3)
            {
                glFunc.call(gl, location, value.x, value.y, value.z);
            }
            else if (length === 4)
            {
                glFunc.call(gl, location, value.x, value.y, value.z, value.w);
            }
            else if (uniform.type === 'sampler2D')
            {
                if (uniform._init)
                {
                    // gl.activeTexture(gl['TEXTURE' + this.textureCount]);
    
                    // gl.bindTexture(gl.TEXTURE_2D, value.baseTexture._glTextures[gl.id]);
    
                    // gl.uniform1i(location, textureCount);

                    // textureCount++;
                }
                else
                {
                    // this.initSampler2D(uniform);
                }
            }
        }
    },

    /**
     * Called automatically during render.
     * 
     * This method performs matrix ITRS and then stores the resulting value in the `uViewMatrix` uniform.
     * It then sets up the vertex buffer and shader, updates and syncs the uniforms ready
     * for flush to be called.
     * 
     * @method Phaser.GameObjects.Shader#load
     * @since 3.17.0
     * 
     * @param {Phaser.GameObjects.Components.TransformMatrix} matrix2D - The transform matrix to use during rendering.
     */
    load: function (matrix2D)
    {
        //  ITRS

        var width = this.width;
        var height = this.height;
        var renderer = this.renderer;
        var program = this.program;

        var x = -this._displayOriginX;
        var y = -this._displayOriginY;

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

        //  Update common uniforms

        var uniforms = this.uniforms;
        var res = uniforms.resolution;

        res.value.x = width;
        res.value.y = height;

        uniforms.time.value = renderer.game.loop.getDuration();

        var pointer = this.pointer;

        if (pointer)
        {
            var mouse = uniforms.mouse;

            var px = pointer.x / width;
            var py = 1 - pointer.y / height;
    
            mouse.value.x = px.toFixed(2);
            mouse.value.y = py.toFixed(2);
        }

        this.syncUniforms();
    },

    /**
     * Called automatically during render.
     * 
     * Sets the active shader, loads the vertex buffer and then draws.
     * 
     * @method Phaser.GameObjects.Shader#flush
     * @since 3.17.0
     */
    flush: function ()
    {
        //  Bind

        var width = this.width;
        var height = this.height;
        var program = this.program;

        var gl = this.gl;
        var vertexBuffer = this.vertexBuffer;
        var renderer = this.renderer;
        var vertexSize = Float32Array.BYTES_PER_ELEMENT * 2;

        renderer.setProgram(program);
        renderer.setVertexBuffer(vertexBuffer);

        var location = gl.getAttribLocation(program, 'inPosition');

        if (location !== -1)
        {
            gl.enableVertexAttribArray(location);

            gl.vertexAttribPointer(location, 2, gl.FLOAT, false, vertexSize, 0);
        }

        //  Draw

        var vf = this.vertexViewF32;

        vf[3] = height;
        vf[4] = width;
        vf[5] = height;
        vf[8] = width;
        vf[9] = height;
        vf[10] = width;

        //  Flush

        var vertexCount = 6;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));

        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    },

    /**
     * A NOOP method so you can pass a Shader to a Container.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Shader#setAlpha
     * @private
     * @since 3.17.0
     */
    setAlpha: function ()
    {
    },
    
    /**
     * A NOOP method so you can pass a Shader to a Container.
     * Calling this method will do nothing. It is intentionally empty.
     *
     * @method Phaser.GameObjects.Shader#setBlendMode
     * @private
     * @since 3.17.0
     */
    setBlendMode: function ()
    {
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.RenderTexture#preDestroy
     * @protected
     * @since 3.9.0
     */
    preDestroy: function ()
    {
        var gl = this.gl;

        gl.deleteProgram(this.program);
        gl.deleteBuffer(this.vertexBuffer);
    }

});

module.exports = Shader;
