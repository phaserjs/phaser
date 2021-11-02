/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var WEBGL_CONST = require('./const');

/**
 * @classdesc
 * Instances of the WebGLShader class belong to the WebGL Pipeline classes. When the pipeline is
 * created it will create an instance of this class for each one of its shaders, as defined in
 * the pipeline configuration.
 *
 * This class encapsulates everything needed to manage a shader in a pipeline, including the
 * shader attributes and uniforms, as well as lots of handy methods such as `set2f`, for setting
 * uniform values on this shader.
 *
 * Typically, you do not create an instance of this class directly, as it works in unison with
 * the pipeline to which it belongs. You can gain access to this class via a pipeline's `shaders`
 * array, post-creation.
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
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineAttributeConfig[]} attributes - An array of attributes.
 */
var WebGLShader = new Class({

    initialize:

    function WebGLShader (pipeline, name, vertexShader, fragmentShader, attributes)
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
         * The fragment shader source code.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#fragSrc
         * @type {string}
         * @since 3.60.0
         */
        this.fragSrc = fragmentShader;

        /**
         * The vertex shader source code.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#vertSrc
         * @type {string}
         * @since 3.60.0
         */
        this.vertSrc = vertexShader;

        /**
         * The WebGLProgram created from the vertex and fragment shaders.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#program
         * @type {WebGLProgram}
         * @since 3.50.0
         */
        this.program = this.renderer.createProgram(vertexShader, fragmentShader);

        /**
         * Array of objects that describe the vertex attributes.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#attributes
         * @type {Phaser.Types.Renderer.WebGL.WebGLPipelineAttribute[]}
         * @since 3.50.0
         */
        this.attributes;

        /**
         * The amount of vertex attribute components of 32 bit length.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#vertexComponentCount
         * @type {number}
         * @since 3.50.0
         */
        this.vertexComponentCount = 0;

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
         * The total, in this case, is 8 + 8 + 4 + 4 + 4 = 28.
         *
         * This is calculated automatically during the `createAttributes` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#vertexSize
         * @type {number}
         * @readonly
         * @since 3.50.0
         */
        this.vertexSize = 0;

        /**
         * The active uniforms that this shader has.
         *
         * This is an object that maps the uniform names to their WebGL location and cached values.
         *
         * It is populated automatically via the `createUniforms` method.
         *
         * @name Phaser.Renderer.WebGL.WebGLShader#uniforms
         * @type {Phaser.Types.Renderer.WebGL.WebGLPipelineUniformsConfig}
         * @since 3.50.0
         */
        this.uniforms = {};

        this.createAttributes(attributes);
        this.createUniforms();
    },

    /**
     * Takes the vertex attributes config and parses it, creating the resulting array that is stored
     * in this shaders `attributes` property, calculating the offset, normalization and location
     * in the process.
     *
     * Calling this method resets `WebGLShader.attributes`, `WebGLShader.vertexSize` and
     * `WebGLShader.vertexComponentCount`.
     *
     * It is called automatically when this class is created, but can be called manually if required.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#createAttributes
     * @since 3.50.0
     *
     * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineAttributeConfig[]} attributes - An array of attributes configs.
     */
    createAttributes: function (attributes)
    {
        var count = 0;
        var offset = 0;
        var result = [];

        this.vertexComponentCount = 0;

        for (var i = 0; i < attributes.length; i++)
        {
            var element = attributes[i];

            var name = element.name;
            var size = GetFastValue(element, 'size', 1); // i.e. 1 for a float, 2 for a vec2, 4 for a vec4, etc
            var glType = GetFastValue(element, 'type', WEBGL_CONST.FLOAT);
            var type = glType.enum; // The GLenum
            var typeSize = glType.size; // The size in bytes of the type

            var normalized = (element.normalized) ? true : false;

            result.push({
                name: name,
                size: size,
                type: type,
                normalized: normalized,
                offset: offset,
                enabled: false,
                location: -1
            });

            if (typeSize === 4)
            {
                count += size;
            }
            else
            {
                count++;
            }

            offset += size * typeSize;
        }

        this.vertexSize = offset;
        this.vertexComponentCount = count;
        this.attributes = result;
    },

    /**
     * Sets the program this shader uses as being the active shader in the WebGL Renderer.
     *
     * This method is called every time the parent pipeline is made the current active pipeline.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#bind
     * @since 3.50.0
     *
     * @param {boolean} [setAttributes=false] - Should the vertex attribute pointers be set?
     * @param {boolean} [flush=false] - Flush the pipeline before binding this shader?
     *
     * @return {this} This WebGLShader instance.
     */
    bind: function (setAttributes, flush)
    {
        if (setAttributes === undefined) { setAttributes = false; }
        if (flush === undefined) { flush = false; }

        if (flush)
        {
            this.pipeline.flush();
        }

        this.renderer.setProgram(this.program);

        if (setAttributes)
        {
            this.setAttribPointers();
        }

        return this;
    },

    /**
     * Sets the program this shader uses as being the active shader in the WebGL Renderer.
     *
     * Then resets all of the attribute pointers.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#rebind
     * @since 3.50.0
     *
     * @return {this} This WebGLShader instance.
     */
    rebind: function ()
    {
        this.renderer.setProgram(this.program);

        this.setAttribPointers(true);

        return this;
    },

    /**
     * Sets the vertex attribute pointers.
     *
     * This should only be called after the vertex buffer has been bound.
     *
     * It is called automatically during the `bind` method.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#setAttribPointers
     * @since 3.50.0
     *
     * @param {boolean} [reset=false] - Reset the vertex attribute locations?
     *
     * @return {this} This WebGLShader instance.
     */
    setAttribPointers: function (reset)
    {
        if (reset === undefined) { reset = false; }

        var gl = this.gl;
        var vertexSize = this.vertexSize;
        var attributes = this.attributes;
        var program = this.program;

        for (var i = 0; i < attributes.length; i++)
        {
            var element = attributes[i];

            var size = element.size;
            var type = element.type;
            var offset = element.offset;
            var enabled = element.enabled;
            var location = element.location;
            var normalized = (element.normalized) ? true : false;

            if (reset)
            {
                var attribLocation = gl.getAttribLocation(program, element.name);

                if (attribLocation >= 0)
                {
                    gl.enableVertexAttribArray(attribLocation);

                    gl.vertexAttribPointer(attribLocation, size, type, normalized, vertexSize, offset);

                    element.enabled = true;
                    element.location = attribLocation;
                }
                else if (attribLocation !== -1)
                {
                    gl.disableVertexAttribArray(attribLocation);
                }
            }
            else if (enabled)
            {
                gl.vertexAttribPointer(location, size, type, normalized, vertexSize, offset);
            }
            else if (!enabled && location > -1)
            {
                gl.disableVertexAttribArray(location);

                element.location = -1;
            }
        }

        return this;
    },

    /**
     * Sets up the `WebGLShader.uniforms` object, populating it with the names
     * and locations of the shader uniforms this shader requires.
     *
     * It works by first calling `gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)` to
     * find out how many active uniforms this shader has. It then iterates through them,
     * calling `gl.getActiveUniform` to get the WebGL Active Info from each one. Finally,
     * the name and location are stored in the local array.
     *
     * This method is called automatically when this class is created.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#createUniforms
     * @since 3.50.0
     *
     * @return {this} This WebGLShader instance.
     */
    createUniforms: function ()
    {
        var gl = this.gl;
        var program = this.program;
        var uniforms = this.uniforms;

        var i;
        var name;
        var location;

        //  Look-up all active uniforms

        var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (i = 0; i < totalUniforms; i++)
        {
            var info = gl.getActiveUniform(program, i);

            if (info)
            {
                name = info.name;

                location = gl.getUniformLocation(program, name);

                if (location !== null)
                {
                    uniforms[name] =
                    {
                        name: name,
                        location: location,
                        value1: null,
                        value2: null,
                        value3: null,
                        value4: null
                    };
                }

                //  If the uniform name contains [] for an array struct,
                //  we'll add an entry for the non-struct name as well.
                //  Such as uMainSampler[12] = uMainSampler

                var struct = name.indexOf('[');

                if (struct > 0)
                {
                    name = name.substr(0, struct);

                    if (!uniforms.hasOwnProperty(name))
                    {
                        location = gl.getUniformLocation(program, name);

                        if (location !== null)
                        {
                            uniforms[name] =
                            {
                                name: name,
                                location: location,
                                value1: null,
                                value2: null,
                                value3: null,
                                value4: null
                            };
                        }
                    }
                }
            }
        }

        return this;
    },

    /**
     * Checks to see if the given uniform name exists and is active in this shader.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#hasUniform
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to check for.
     *
     * @return {boolean} `true` if the uniform exists, otherwise `false`.
     */
    hasUniform: function (name)
    {
        return this.uniforms.hasOwnProperty(name);
    },

    /**
     * Resets the cached values of the given uniform.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#resetUniform
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to reset.
     *
     * @return {this} This WebGLShader instance.
     */
    resetUniform: function (name)
    {
        var uniform = this.uniforms[name];

        if (uniform)
        {
            uniform.value1 = null;
            uniform.value2 = null;
            uniform.value3 = null;
            uniform.value4 = null;
        }

        return this;
    },

    /**
     * Sets the given uniform value/s based on the name and GL function.
     *
     * This method is called internally by other methods such as `set1f` and `set3iv`.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#setUniform1
     * @since 3.50.0
     *
     * @param {function} setter - The GL function to call.
     * @param {string} name - The name of the uniform to set.
     * @param {(boolean|number|number[]|Float32Array)} value1 - The new value of the uniform.
     * @param {boolean} [skipCheck=false] - Skip the value comparison?
     *
     * @return {this} This WebGLShader instance.
     */
    setUniform1: function (setter, name, value1, skipCheck)
    {
        var uniform = this.uniforms[name];

        if (!uniform)
        {
            return this;
        }

        if (skipCheck || uniform.value1 !== value1)
        {
            uniform.value1 = value1;

            this.renderer.setProgram(this.program);

            setter.call(this.gl, uniform.location, value1);

            this.pipeline.currentShader = this;
        }

        return this;
    },

    /**
     * Sets the given uniform value/s based on the name and GL function.
     *
     * This method is called internally by other methods such as `set1f` and `set3iv`.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#setUniform2
     * @since 3.50.0
     *
     * @param {function} setter - The GL function to call.
     * @param {string} name - The name of the uniform to set.
     * @param {(boolean|number|number[]|Float32Array)} value1 - The new value of the uniform.
     * @param {(boolean|number|number[]|Float32Array)} value2 - The new value of the uniform.
     * @param {boolean} [skipCheck=false] - Skip the value comparison?
     *
     * @return {this} This WebGLShader instance.
     */
    setUniform2: function (setter, name, value1, value2, skipCheck)
    {
        var uniform = this.uniforms[name];

        if (!uniform)
        {
            return this;
        }

        if (skipCheck || uniform.value1 !== value1 || uniform.value2 !== value2)
        {
            uniform.value1 = value1;
            uniform.value2 = value2;

            this.renderer.setProgram(this.program);

            setter.call(this.gl, uniform.location, value1, value2);

            this.pipeline.currentShader = this;
        }

        return this;
    },

    /**
     * Sets the given uniform value/s based on the name and GL function.
     *
     * This method is called internally by other methods such as `set1f` and `set3iv`.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#setUniform3
     * @since 3.50.0
     *
     * @param {function} setter - The GL function to call.
     * @param {string} name - The name of the uniform to set.
     * @param {(boolean|number|number[]|Float32Array)} value1 - The new value of the uniform.
     * @param {(boolean|number|number[]|Float32Array)} value2 - The new value of the uniform.
     * @param {(boolean|number|number[]|Float32Array)} value3 - The new value of the uniform.
     * @param {boolean} [skipCheck=false] - Skip the value comparison?
     *
     * @return {this} This WebGLShader instance.
     */
    setUniform3: function (setter, name, value1, value2, value3, skipCheck)
    {
        var uniform = this.uniforms[name];

        if (!uniform)
        {
            return this;
        }

        if (skipCheck || uniform.value1 !== value1 || uniform.value2 !== value2 || uniform.value3 !== value3)
        {
            uniform.value1 = value1;
            uniform.value2 = value2;
            uniform.value3 = value3;

            this.renderer.setProgram(this.program);

            setter.call(this.gl, uniform.location, value1, value2, value3);

            this.pipeline.currentShader = this;
        }

        return this;
    },

    /**
     * Sets the given uniform value/s based on the name and GL function.
     *
     * This method is called internally by other methods such as `set1f` and `set3iv`.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#setUniform4
     * @since 3.50.0
     *
     * @param {function} setter - The GL function to call.
     * @param {string} name - The name of the uniform to set.
     * @param {(boolean|number|number[]|Float32Array)} value1 - The new value of the uniform.
     * @param {(boolean|number|number[]|Float32Array)} value2 - The new value of the uniform.
     * @param {(boolean|number|number[]|Float32Array)} value3 - The new value of the uniform.
     * @param {(boolean|number|number[]|Float32Array)} value4 - The new value of the uniform.
     * @param {boolean} [skipCheck=false] - Skip the value comparison?
     *
     * @return {this} This WebGLShader instance.
     */
    setUniform4: function (setter, name, value1, value2, value3, value4, skipCheck)
    {
        var uniform = this.uniforms[name];

        if (!uniform)
        {
            return this;
        }

        if (skipCheck || uniform.value1 !== value1 || uniform.value2 !== value2 || uniform.value3 !== value3 || uniform.value4 !== value4)
        {
            uniform.value1 = value1;
            uniform.value2 = value2;
            uniform.value3 = value3;
            uniform.value4 = value4;

            this.renderer.setProgram(this.program);

            setter.call(this.gl, uniform.location, value1, value2, value3, value4);

            this.pipeline.currentShader = this;
        }

        return this;
    },

    /**
     * Sets a boolean uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#setBoolean
     * @since 3.60.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {boolean} value - The new value of the `boolean` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    setBoolean: function (name, value)
    {
        return this.setUniform1(this.gl.uniform1i, name, Number(value));
    },

    /**
     * Sets a 1f uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform1(this.gl.uniform1f, name, x);
    },

    /**
     * Sets a 2f uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform2(this.gl.uniform2f, name, x, y);
    },

    /**
     * Sets a 3f uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform3(this.gl.uniform3f, name, x, y, z);
    },

    /**
     * Sets a 4f uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform4(this.gl.uniform4f, name, x, y, z, w);
    },

    /**
     * Sets a 1fv uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform1(this.gl.uniform1fv, name, arr, true);
    },

    /**
     * Sets a 2fv uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform1(this.gl.uniform2fv, name, arr, true);
    },

    /**
     * Sets a 3fv uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform1(this.gl.uniform3fv, name, arr, true);
    },

    /**
     * Sets a 4fv uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform1(this.gl.uniform4fv, name, arr, true);
    },

    /**
     * Sets a 1iv uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform1(this.gl.uniform1iv, name, arr, true);
    },

    /**
     * Sets a 2iv uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform1(this.gl.uniform2iv, name, arr, true);
    },

    /**
     * Sets a 3iv uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform1(this.gl.uniform3iv, name, arr, true);
    },

    /**
     * Sets a 4iv uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform1(this.gl.uniform4iv, name, arr, true);
    },

    /**
     * Sets a 1i uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set1i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new value of the `int` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    set1i: function (name, x)
    {
        return this.setUniform1(this.gl.uniform1i, name, x);
    },

    /**
     * Sets a 2i uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set2i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new X component of the `ivec2` uniform.
     * @param {number} y - The new Y component of the `ivec2` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    set2i: function (name, x, y)
    {
        return this.setUniform2(this.gl.uniform2i, name, x, y);
    },

    /**
     * Sets a 3i uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set3i
     * @since 3.50.0
     *
     * @param {string} name - The name of the uniform to set.
     * @param {number} x - The new X component of the `ivec3` uniform.
     * @param {number} y - The new Y component of the `ivec3` uniform.
     * @param {number} z - The new Z component of the `ivec3` uniform.
     *
     * @return {this} This WebGLShader instance.
     */
    set3i: function (name, x, y, z)
    {
        return this.setUniform3(this.gl.uniform3i, name, x, y, z);
    },

    /**
     * Sets a 4i uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#set4i
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
    set4i: function (name, x, y, z, w)
    {
        return this.setUniform4(this.gl.uniform4i, name, x, y, z, w);
    },

    /**
     * Sets a matrix 2fv uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform2(this.gl.uniformMatrix2fv, name, transpose, matrix, true);
    },

    /**
     * Sets a matrix 3fv uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform2(this.gl.uniformMatrix3fv, name, transpose, matrix, true);
    },

    /**
     * Sets a matrix 4fv uniform value based on the given name on this shader.
     *
     * The uniform is only set if the value/s given are different to those previously set.
     *
     * This method works by first setting this shader as being the current shader within the
     * WebGL Renderer, if it isn't already. It also sets this shader as being the current
     * one within the pipeline it belongs to.
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
        return this.setUniform2(this.gl.uniformMatrix4fv, name, transpose, matrix, true);
    },

    /**
     * This method will create the Shader Program on the current GL context.
     *
     * If a program already exists, it will be destroyed and the new one will take its place.
     *
     * After the program is created the uniforms will be reset and
     * this shader will be rebound.
     *
     * This is a very expensive process and if your shader is referenced elsewhere in
     * your game those references may then be lost, so be sure to use this carefully.
     *
     * However, if you need to update say the fragment shader source, then you can pass
     * the new source into this method and it'll rebuild the program using it. If you
     * don't want to change the vertex shader src, pass `undefined` as the parameter.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#createProgram
     * @since 3.60.0
     *
     * @param {string} [vertSrc] - The source code of the vertex shader. If not given, uses the source already defined in this Shader.
     * @param {string} [fragSrc] - The source code of the fragment shader. If not given, uses the source already defined in this Shader.
     *
     * @return {this} This WebGLShader instance.
     */
    createProgram: function (vertSrc, fragSrc)
    {
        if (vertSrc === undefined) { vertSrc = this.vertSrc; }
        if (fragSrc === undefined) { fragSrc = this.fragSrc; }

        var gl = this.gl;

        if (this.program)
        {
            gl.deleteProgram(this.program);
        }

        this.vertSrc = vertSrc;
        this.fragSrc = fragSrc;

        this.program = this.renderer.createProgram(vertSrc, fragSrc);

        this.createUniforms();

        return this.rebind();
    },

    /**
     * Removes all external references from this class and deletes the WebGL program from the WebGL context.
     *
     * Does not remove this shader from the parent pipeline.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        this.gl.deleteProgram(this.program);

        this.pipeline = null;
        this.renderer = null;
        this.gl = null;
        this.program = null;
        this.attributes = null;
        this.uniforms = null;
    }

});

module.exports = WebGLShader;
