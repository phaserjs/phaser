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
 * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The WebGLPipeline to which this Shader belongs.
 * @param {string} name - The name of this Shader.
 * @param {string} vertexShader - The vertex shader source code as a single string.
 * @param {string} fragmentShader - The fragment shader source code as a single string.
 * @param {string[]} [uniforms] - An array of shader uniform names that will be looked-up to get the locations for.
 */
var WebGLShader = new Class({

    initialize:

    function WebGLShader (pipeline, name, vertexShader, fragmentShader, uniforms)
    {
        /**
         * A reference to the WebGLPipeline that owns this Shader.
         *
         * A Shader class can only belong to a single pipeline.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#pipeline
         * @type {Phaser.Renderer.WebGL.WebGLPipeline}
         * @since 3.50.0
         */
        this.pipeline = pipeline;

        /**
         * The name of this shader.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#name
         * @type {string}
         * @since 3.50.0
         */
        this.name = name;

        /**
         * A reference to the WebGLRenderer instance.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 3.50.0
         */
        this.renderer = pipeline.renderer;

        /**
         * A reference to the WebGL Rendering Context the WebGL Renderer is using.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#gl
         * @type {WebGLRenderingContext}
         * @since 3.50.0
         */
        this.gl = this.renderer.gl;

        /**
         * The WebGLProgram created from the vertex and fragment shaders.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#program
         * @type {WebGLProgram}
         * @since 3.50.0
         */
        this.program = this.renderer.createProgram(vertexShader, fragmentShader);

        /**
         * The uniforms that this shader requires, as set via the configuration object.
         *
         * This is an object that maps the uniform names to their WebGL location.
         *
         * It is populated with their locations via the `setUniformLocations` method.
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
     * Sets the program this shader uses as being the active shader in the WebGL Renderer.
     *
     * Then, if the parent pipeline model-view-projection is dirty, sets the uniform matrix4
     * values for each.
     *
     * This method is called every time the parent pipeline is made the current active pipeline.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#bind
     * @since 3.50.0
     *
     * @return {this} This WebGLShader instance.
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

        return this;
    },

    /**
     * Sets up the `WebGLShader.uniforms` object, populating it with the names
     * and locations of the shader uniforms this shader requires.
     *
     * This method is called automatically when this class is created.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#setUniformLocations
     * @since 3.50.0
     *
     * @param {string[]} uniformNames - An array of the uniform names to get the locations for.
     *
     * @return {this} This WebGLShader instance.
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
     * Sets a 1f uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set1f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new value of the `float` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    set1f: function (name, x)
    {
        this.gl.uniform1f(this.uniforms[name], x);

        return this;
    },

    /**
     * Sets a 2f uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set2f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new X component of the `vec2` uniform.
     * @param {number} y - The new Y component of the `vec2` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    set2f: function (name, x, y)
    {
        this.gl.uniform2f(this.uniforms[name], x, y);

        return this;
    },

    /**
     * Sets a 3f uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set3f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new X component of the `vec3` uniform.
     * @param {number} y - The new Y component of the `vec3` uniform.
     * @param {number} z - The new Z component of the `vec3` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    set3f: function (name, x, y, z)
    {
        this.gl.uniform3f(this.uniforms[name], x, y, z);

        return this;
    },

    /**
     * Sets a 4f uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set4f
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - X component of the uniform
     * @param {number} y - Y component of the uniform
     * @param {number} z - Z component of the uniform
     * @param {number} w - W component of the uniform
     *
     * @return {this} This WebGLShader instance.
     */
    set4f: function (name, x, y, z, w)
    {
        this.gl.uniform4f(this.uniforms[name], x, y, z, w);

        return this;
    },

    /**
     * Sets a 1fv uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set1fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLShader instance.
     */
    set1fv: function (name, arr)
    {
        this.gl.uniform1fv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 2fv uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set2fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLShader instance.
     */
    set2fv: function (name, arr)
    {
        this.gl.uniform2fv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 3fv uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set3fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLShader instance.
     */
    set3fv: function (name, arr)
    {
        this.gl.uniform3fv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 4fv uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set4fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLShader instance.
     */
    set4fv: function (name, arr)
    {
        this.gl.uniform4fv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 1iv uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set1iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLShader instance.
     */
    set1iv: function (name, arr)
    {
        this.gl.uniform1iv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 2iv uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set2iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLShader instance.
     */
    set2iv: function (name, arr)
    {
        this.gl.uniform2iv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 3iv uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set3iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLShader instance.
     */
    set3iv: function (name, arr)
    {
        this.gl.uniform3iv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 4iv uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set4iv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number[]|Float32Array} arr - The new value to be used for the uniform variable.
     *
     * @return {this} This WebGLShader instance.
     */
    set4iv: function (name, arr)
    {
        this.gl.uniform4iv(this.uniforms[name], arr);

        return this;
    },

    /**
     * Sets a 1i uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set1i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {integer} x - The new value of the `int` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    set1i: function (name, x)
    {
        this.gl.uniform1i(this.uniforms[name], x);

        return this;
    },

    /**
     * Sets a 2i uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set2i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {integer} x - The new X component of the `ivec2` uniform.
     * @param {integer} y - The new Y component of the `ivec2` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    set2i: function (name, x, y)
    {
        this.gl.uniform2i(this.uniforms[name], x, y);

        return this;
    },

    /**
     * Sets a 3i uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set3i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {integer} x - The new X component of the `ivec3` uniform.
     * @param {integer} y - The new Y component of the `ivec3` uniform.
     * @param {integer} z - The new Z component of the `ivec3` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    set3i: function (name, x, y, z)
    {
        this.gl.uniform3i(this.uniforms[name], x, y, z);

        return this;
    },

    /**
     * Sets a 4i uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set4i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {integer} x - X component of the uniform
     * @param {integer} y - Y component of the uniform
     * @param {integer} z - Z component of the uniform
     * @param {integer} w - W component of the uniform
     *
     * @return {this} This WebGLShader instance.
     */
    set4i: function (name, x, y, z, w)
    {
        this.gl.uniform4i(this.uniforms[name], x, y, z, w);

        return this;
    },

    /**
     * Sets a matrix 2fv uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#setMatrix2fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {boolean} transpose - Whether to transpose the matrix. Should be `false`.
     * @param {number[]|Float32Array} matrix - The new values for the `mat2` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    setMatrix2fv: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix2fv(this.uniforms[name], transpose, matrix);

        return this;
    },

    /**
     * Sets a matrix 3fv uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#setMatrix3fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {boolean} transpose - Whether to transpose the matrix. Should be `false`.
     * @param {Float32Array} matrix - The new values for the `mat3` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    setMatrix3fv: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix3fv(this.uniforms[name], transpose, matrix);

        return this;
    },

    /**
     * Sets a matrix 4fv uniform value based on the given name on this shader.
     *
     * This shader program must be currently active. You can safely call this method from
     * pipeline methods such as `bind`, `onBind` and batch related calls.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#setMatrix4fv
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {boolean} transpose - Should the matrix be transpose
     * @param {Float32Array} matrix - Matrix data
     *
     * @return {this} This WebGLShader instance.
     */
    setMatrix4fv: function (name, transpose, matrix)
    {
        this.gl.uniformMatrix4fv(this.uniforms[name], transpose, matrix);

        return this;
    },

    /**
     * Removes all external references from this class and deletes the WebGL program from the WebGL context.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        this.gl.deleteProgram(this.program);

        this.gl = null;
        this.program = null;
        this.pipeline = null;
        this.renderer = null;
    }

});

module.exports = WebGLShader;
