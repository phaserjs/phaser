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
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
 * @param {string} [fragSource] - The source code of the fragment shader.
 * @param {string} [vertSource] - The source code of the vertex shader.
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

    function Shader (scene, x, y, width, height, fragSource, vertSource, uniforms)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }

        if (fragSource === undefined)
        {
            fragSource = [
                'precision mediump float;',

                'uniform vec2 resolution;',

                'varying vec2 fragCoord;',

                'void main () {',
                '    vec2 uv = fragCoord / resolution.xy;',
                '    gl_FragColor = vec4(uv.xyx, 1.0);',
                '}'
            ].join('\n');
        }

        if (vertSource === undefined)
        {
            vertSource = [
                'precision mediump float;',

                'uniform mat4 uProjectionMatrix;',
                'uniform mat4 uViewMatrix;',

                'attribute vec2 inPosition;',

                'varying vec2 fragCoord;',

                'void main () {',
                'gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);',
                'fragCoord = inPosition;',
                '}'
            ].join('\n');
        }

        GameObject.call(this, scene, 'Shader');

        //  This Game Object cannot have a blend mode, so skip all checks
        this.blendMode = -1;

        this.vertSource = vertSource;
        this.fragSource = fragSource;

        var renderer = scene.sys.renderer;

        this.renderer = renderer;

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
        this.vertexData = new ArrayBuffer(6 * (Float32Array.BYTES_PER_ELEMENT * 2));

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

        /*
        * The supported types are: 1f, 1fv, 1i, 2f, 2fv, 2i, 2iv, 3f, 3fv, 3i, 3iv, 4f, 4fv, 4i, 4iv, mat2, mat3, mat4 and sampler2D.
        */
        var d = new Date();

        /**
         * @property {object} uniforms - Default uniform mappings. Compatible with ShaderToy and GLSLSandbox.
         */
        this.uniforms = {
            resolution: { type: '2f', value: { x: x, y: y }},
            time: { type: '1f', value: 0 },
            mouse: { type: '2f', value: { x: 0.0, y: 0.0 } },
            date: { type: '4fv', value: [ d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds() ] },
            sampleRate: { type: '1f', value: 44100.0 },
            iChannel0: { type: 'sampler2D', value: null, textureData: { repeat: true } },
            iChannel1: { type: 'sampler2D', value: null, textureData: { repeat: true } },
            iChannel2: { type: 'sampler2D', value: null, textureData: { repeat: true } },
            iChannel3: { type: 'sampler2D', value: null, textureData: { repeat: true } }
        };

        //  Copy over / replace any passed in the constructor
        if (uniforms)
        {
            for (var key in uniforms)
            {
                this.uniforms[key] = uniforms[key];
            }
        }

        this.pointer = null;

        this._rendererWidth = renderer.width;
        this._rendererHeight = renderer.height;

        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0.5, 0.5);

        var gl = this.gl;

        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform

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

        this.setShader(fragSource, vertSource);

        this.projOrtho(0, renderer.width, renderer.height, 0);
    },

    setShader: function (fragSource, vertSource)
    {
        if (vertSource === undefined) { vertSource = this.vertSource; }

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
        this.fragSource = fragSource;
        this.vertSource = vertSource;

        this.initUniforms();

        return this;
    },

    setPointer: function (pointer)
    {
        this.pointer = pointer;

        return this;
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

    // Uniforms are specified in the GLSL_ES Specification: http://www.khronos.org/registry/webgl/specs/latest/1.0/
    // http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf

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

    syncUniforms: function ()
    {
        var gl = this.gl;

        var uniform;
        var length;
        var glFunc;
        var location;
        var value;

        // var textureCount = 1;
    
        for (var key in this.uniforms)
        {
            uniform = this.uniforms[key];

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

    load: function (matrix2D)
    {
        //  ITRS

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

        //  Bind

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
   
        this.uniforms.resolution.value.x = this.width;
        this.uniforms.resolution.value.y = this.height;

        this.uniforms.time.value = this.renderer.game.loop.getDuration();

        if (this.pointer)
        {
            var px = this.pointer.x / this.width;
            var py = 1 - this.pointer.y / this.height;
    
            this.uniforms.mouse.value.x = px.toFixed(2);
            this.uniforms.mouse.value.y = py.toFixed(2);
        }

        this.syncUniforms();

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
     * A NOOP method so you can pass a Shader to a Container in Canvas.
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
