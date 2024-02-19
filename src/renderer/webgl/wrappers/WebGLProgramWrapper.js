/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * @classdesc
 * Wrapper for a WebGL program, containing all the information that was used to create it.
 *
 * A WebGLProgram should never be exposed outside the WebGLRenderer, so the WebGLRenderer
 * can handle context loss and other events without other systems having to be aware of it.
 * Always use WebGLProgramWrapper instead.
 *
 * @class WebGLProgramWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 3.80.0
 *
 * @param {WebGLRenderingContext} gl - The WebGLRenderingContext to create the WebGLProgram for.
 * @param {string} vertexSource - The vertex shader source code as a string.
 * @param {string} fragmentShader - The fragment shader source code as a string.
 */
var WebGLProgramWrapper = new Class({

    initialize:

    function WebGLProgramWrapper (gl, vertexSource, fragmentSource)
    {
        /**
         * The WebGLProgram being wrapped by this class.
         *
         * This property could change at any time.
         * Therefore, you should never store a reference to this value.
         * It should only be passed directly to the WebGL API for drawing.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#webGLProgram
         * @type {?WebGLProgram}
         * @default null
         * @since 3.80.0
         */
        this.webGLProgram = null;

        /**
         * The WebGLRenderingContext that owns this WebGLProgram.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#gl
         * @type {WebGLRenderingContext}
         * @since 3.80.0
         */
        this.gl = gl;

        /**
         * The vertex shader source code as a string.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#vertexSource
         * @type {string}
         * @since 3.80.0
         */
        this.vertexSource = vertexSource;

        /**
         * The fragment shader source code as a string.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#fragmentSource
         * @type {string}
         * @since 3.80.0
         */
        this.fragmentSource = fragmentSource;

        this.createResource();
    },

    /**
     * Creates a WebGLProgram from the given vertex and fragment shaders.
     *
     * This is called automatically by the constructor. It may also be
     * called again if the WebGLProgram needs re-creating.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#createResource
     * @throws {Error} If the shaders failed to compile or link.
     * @since 3.80.0
     */
    createResource: function ()
    {
        var gl = this.gl;

        if (gl.isContextLost())
        {
            // GL state can't be updated right now.
            // `createResource` will run when the context is restored.
            return;
        }

        var program = gl.createProgram();

        var vs = gl.createShader(gl.VERTEX_SHADER);
        var fs = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vs, this.vertexSource);
        gl.shaderSource(fs, this.fragmentSource);

        gl.compileShader(vs);
        gl.compileShader(fs);

        var failed = 'Shader failed:\n';

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
        {
            throw new Error('Vertex ' + failed + gl.getShaderInfoLog(vs));
        }

        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            throw new Error('Fragment ' + failed + gl.getShaderInfoLog(fs));
        }

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            throw new Error('Link ' + failed + gl.getProgramInfoLog(program));
        }

        gl.useProgram(program);

        this.webGLProgram = program;
    },

    /**
     * Remove this WebGLProgram from the GL context.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#destroy
     * @since 3.80.0
     */
    destroy: function ()
    {
        if (!this.webGLProgram)
        {
            return;
        }

        if (!this.gl.isContextLost())
        {
            this.gl.deleteProgram(this.webGLProgram);
        }

        this.webGLProgram = null;
        this.gl = null;
    }
});

module.exports = WebGLProgramWrapper;
