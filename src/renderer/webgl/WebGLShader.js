/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * TODO
 *
 * @class WebGLShader
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 */
var WebGLShader = new Class({

    initialize:

    function WebGLShader (pipeline, name, vertShader, fragShader, uniforms)
    {
        this.pipeline = pipeline;

        this.name = name;

        this.renderer = pipeline.renderer;

        /**
         * The WebGL context this WebGL Pipeline uses.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#gl
         * @type {WebGLRenderingContext}
         * @since 3.0.0
         */
        this.gl = this.renderer.gl;

        /**
         * A reference to the WebGLProgram (shader) that this pipeline is using.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#program
         * @type {WebGLProgram}
         * @since 3.0.0
         */
        this.program = this.renderer.createProgram(vertShader, fragShader);

        /**
         * Array of objects that describe the shader uniforms.
         * This is populated with their locations when the shader is created.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#uniforms
         * @type {Phaser.Types.Renderer.WebGL.WebGLPipelineUniformsConfig}
         * @since 3.50.0
         */
        this.uniforms = {};

        if (uniforms)
        {
            this.setUniformLocations(uniforms);
        }
    },

    /**
     * Binds the pipeline resources, including the program, vertex buffer and attribute pointers.
     *
     * This method is called every time this pipeline is made the current active pipeline.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#bind
     * @since 3.0.0
     *
     * @param {boolean} [reset=false] - Should the pipeline be fully re-bound after a renderer pipeline clear?
     *
     * @return {this} This WebGLPipeline instance.
     */
    bind: function ()
    {
        this.renderer.setProgram(this.program);

        var pipeline = this.pipeline;

        if (pipeline.mvpDirty)
        {
            this.setMatrix4fv('uModelMatrix', false, pipeline.modelMatrix.val);
            this.setMatrix4fv('uViewMatrix', false, pipeline.viewMatrix.val);
            this.setMatrix4fv('uProjectionMatrix', false, pipeline.projectionMatrix.val);

            pipeline.mvpDirty = false;
        }
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
     * Removes all object references in this WebGL Pipeline and removes its program from the WebGL context.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#destroy
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    destroy: function ()
    {
        this.gl.deleteProgram(this.program);

        this.gl = null;
        this.program = null;
        this.pipeline = null;
        this.renderer = null;
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
        // this.gl.uniform1iv(this.uniforms[name], arr);

        this.gl.uniform1iv(this.gl.getUniformLocation(this.program, name), arr);

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
        // this.gl.uniformMatrix4fv(this.uniforms[name], transpose, matrix);

        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, name), transpose, matrix);

        return this;
    }

});

module.exports = WebGLShader;
