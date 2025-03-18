/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Map = require('../../../structs/Map');
var Class = require('../../../utils/Class');

function isDifferent (a, b)
{
    if (a === b)
    {
        return false;
    }
    if (Number.isNaN(a) || a === undefined)
    {
        if (Number.isNaN(b) || b === undefined)
        {
            return false;
        }
    }
    return true;
}

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
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer instance that owns this wrapper.
 * @param {string} vertexSource - The vertex shader source code as a string.
 * @param {string} fragmentShader - The fragment shader source code as a string.
 */
var WebGLProgramWrapper = new Class({

    initialize:

    function WebGLProgramWrapper (renderer, vertexSource, fragmentSource)
    {
        /**
         * The WebGLRenderer instance that owns this wrapper.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

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
         * Whether this program is currently being compiled.
         * This will always be false, unless parallel shader compilation
         * is enabled via `config.render.skipUnreadyShaders`.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#compiling
         * @type {boolean}
         * @default false
         * @readonly
         * @since 4.0.0
         */
        this.compiling = false;

        /**
         * The time at which the compilation of this program started.
         * This is used to track the time taken to compile the program.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#_compileStartTime
         * @type {number}
         * @private
         * @since 4.0.0
         */
        this._compileStartTime = 0;

        /**
         * The time taken to compile this program, in milliseconds.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#compileTimeMs
         * @type {number}
         * @readonly
         * @since 4.0.0
         */
        this.compileTimeMs = 0;

        /**
         * The WebGL state necessary to bind this program.
         *
         * This is used internally to accelerate state changes.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#glState
         * @type {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters}
         * @since 4.0.0
         */
        this.glState = { bindings: { program: this } };

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

        /**
         * The vertex shader object.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#_vertexShader
         * @type {WebGLShader}
         * @default null
         * @private
         * @since 4.0.0
         */
        this._vertexShader = null;

        /**
         * The fragment shader object.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#_fragmentShader
         * @type {WebGLShader}
         * @default null
         * @private
         * @since 4.0.0
         */
        this._fragmentShader = null;

        /**
         * The attribute state of this program.
         *
         * These represent the actual state in WebGL, and are only updated when
         * the program is used to draw.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#glAttributes
         * @type {Array<{ location: GLint, name: string, size: number, type: GLenum }>}
         * @since 4.0.0
         */
        this.glAttributes = [];

        /**
         * Map of attribute names to their indexes in `glAttributes`.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#glAttributeNames
         * @type {Map<string, number>}
         * @since 4.0.0
         */
        this.glAttributeNames = new Map();

        /**
         * The buffer which this program is using for its attributes.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#glAttributeBuffer
         * @type {?WebGLBuffer}
         * @default null
         * @since 4.0.0
         */
        this.glAttributeBuffer = null;

        /**
         * The uniform state of this program.
         *
         * These represent the actual state in WebGL, and are only updated when
         * the program is used to draw.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#glUniforms
         * @type {Map<string, Phaser.Types.Renderer.WebGL.WebGLUniform>}
         * @since 4.0.0
         */
        this.glUniforms = new Map();

        /**
         * Requests to update the uniform state.
         * Set a request by name to a new value.
         * These are only processed when the program is used to draw.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#uniformRequests
         * @type {Map<string, any>}
         * @since 4.0.0
         */
        this.uniformRequests = new Map();

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
        var renderer = this.renderer;
        var gl = renderer.gl;

        // Ensure that there is no vertex buffer associated with this program,
        // so that the attributes are reset.
        this.glAttributeBuffer = null;

        if (gl.isContextLost())
        {
            // GL state can't be updated right now.
            // `createResource` will run when the context is restored.
            return;
        }

        this.compiling = true;
        this._compileStartTime = performance.now();

        // Unbind current program before creating a new one.
        // Otherwise, the old program will stay in use,
        // and cause errors.
        if (renderer.glWrapper.state.bindings.program === this)
        {
            renderer.glWrapper.updateBindingsProgram({
                bindings: { program: null }
            });
        }

        var program = gl.createProgram();

        this.webGLProgram = program;

        var vs = gl.createShader(gl.VERTEX_SHADER);
        var fs = gl.createShader(gl.FRAGMENT_SHADER);

        this._vertexShader = vs;
        this._fragmentShader = fs;

        gl.shaderSource(vs, this.vertexSource);
        gl.shaderSource(fs, this.fragmentSource);

        gl.compileShader(vs);
        gl.compileShader(fs);

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        gl.linkProgram(program);

        if (!renderer.game.config.skipUnreadyShaders)
        {
            this._completeProgram();
        }
    },

    /**
     * Poll shader compilation status, and complete the program if it is ready.
     * This is only called if `skipUnreadyShaders` is enabled
     * and the KHR_parallel_shader_compile extension is available.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#checkParallelCompile
     * @since 4.0.0
     */
    checkParallelCompile: function ()
    {
        var renderer = this.renderer;
        var gl = renderer.gl;
        var ext = renderer.parallelShaderCompileExtension;

        if (!ext || !gl.getProgramParameter(this.webGLProgram, ext.COMPLETION_STATUS_KHR))
        {
            return;
        }

        this._completeProgram();
    },

    /**
     * Complete the program after the shaders have compiled.
     * This checks the status of the shaders and the program,
     * and throws an error if they failed to compile.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#_completeProgram
     * @private
     * @since 4.0.0
     */
    _completeProgram: function ()
    {
        var program = this.webGLProgram;
        var renderer = this.renderer;
        var gl = renderer.gl;
        var vs = this._vertexShader;
        var fs = this._fragmentShader;

        var failed = 'Shader failed:\n';

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
            {
                console.log(this.vertexSource);
                throw new Error('Vertex ' + failed + gl.getShaderInfoLog(vs));
            }

            if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
            {
                console.log(this.fragmentSource);
                throw new Error('Fragment ' + failed + gl.getShaderInfoLog(fs));
            }
            console.log(this.vertexSource, this.fragmentSource);
            throw new Error('Link Shader failed:' + gl.getProgramInfoLog(program));
        }

        this._setupAttributesAndUniforms();

        this.compileTimeMs = performance.now() - this._compileStartTime;
        this.compiling = false;
    },

    /**
     * Set up the attributes and uniforms for this program.
     * This is called after the program is created or re-created.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#_setupAttributesAndUniforms
     * @private
     * @since 4.0.0
     */
    _setupAttributesAndUniforms: function ()
    {
        var program = this.webGLProgram;
        var renderer = this.renderer;
        var gl = renderer.gl;
        var _this = this;

        // Extract attributes.
        this.glAttributeNames.clear();
        this.glAttributes.length = 0;
        var attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (var index = 0; index < attributeCount; index++)
        {
            var attribute = gl.getActiveAttrib(program, index);
            var location = gl.getAttribLocation(program, attribute.name);

            this.glAttributeNames.set(attribute.name, index);
            this.glAttributes[index] = {
                location: location,
                name: attribute.name,
                size: attribute.size,
                type: attribute.type
            };
        }

        // Send the old uniforms to the request map,
        // so they are recreated with the new program.
        this.glUniforms.each(function (name, uniform)
        {
            if (!_this.uniformRequests.has(name))
            {
                _this.uniformRequests.set(name, uniform.value);
            }
        });

        this.glUniforms.clear();
        var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (index = 0; index < uniformCount; index++)
        {
            var uniform = gl.getActiveUniform(program, index);
            var setter = renderer.shaderSetters.constants[uniform.type];

            var initialValue = 0;
            var terms = uniform.size * setter.size;
            if (terms > 1)
            {
                initialValue = setter.baseType === gl.FLOAT
                    ? new Float32Array(terms)
                    : new Int32Array(terms);
            }

            this.glUniforms.set(uniform.name, {
                location: gl.getUniformLocation(program, uniform.name),
                size: uniform.size,
                type: uniform.type,
                value: initialValue
            });
        }
    },

    /**
     * Set a uniform value for this WebGLProgram.
     *
     * This method doesn't set the WebGL value directly.
     * Instead, it adds a request to the `uniformRequests` map.
     * These requests are processed when the program is used to draw.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#setUniform
     * @since 4.0.0
     * @param {string} name - The name of the uniform.
     * @param {number|number[]|Int32Array|Float32Array} value - The value to set.
     */
    setUniform: function (name, value)
    {
        this.uniformRequests.set(name, value);
    },

    /**
     * Set this program as the active program in the WebGL context.
     *
     * This will also update the uniform state.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#bind
     * @since 4.0.0
     */
    bind: function ()
    {
        this.renderer.glWrapper.updateBindingsProgram(this.glState);

        this.uniformRequests.each(this._processUniformRequest.bind(this));

        this.uniformRequests.clear();
    },

    /**
     * Process a request to update a uniform value.
     *
     * Requests are stored in the `uniformRequests` map,
     * and only bound with this method when the program is used to draw.
     * This ensures that the WebGL state is only updated when necessary.
     *
     * This method works from the description of uniforms provided by WebGL.
     * It will only update uniforms that exist, in the fields that exist
     * on those uniforms. If requests for invalid uniforms or fields are made,
     * they are ignored.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper#_processUniformRequest
     * @since 4.0.0
     * @private
     * @param {string} name - The name of the uniform.
     * @param {number|number[]|Int32Array|Float32Array} value - The value to set.
     */
    _processUniformRequest: function (name, value)
    {
        var renderer = this.renderer;
        var gl = renderer.gl;
        var uniform = this.glUniforms.get(name);

        if (!uniform) { return; }

        var uniformValue = uniform.value;

        // Update stored values if they are different.
        if (uniformValue.length)
        {
            var different = false;
            for (var i = 0; i < uniformValue.length; i++)
            {
                if (isDifferent(uniformValue[i], value[i]))
                {
                    different = true;
                    uniformValue[i] = value[i];
                }
            }
            if (!different) { return; }
        }
        else
        {
            if (!isDifferent(uniformValue, value)) { return; }
            uniformValue = value;
            uniform.value = value;
        }

        // Get info about the uniform.
        var location = uniform.location;
        var type = uniform.type;
        var size = uniform.size;
        var setter = renderer.shaderSetters.constants[type];

        // Set the value.
        if (setter.isMatrix)
        {
            setter.set.call(gl, location, false, uniformValue);
        }
        else if (size > 1)
        {
            setter.setV.call(gl, location, uniformValue);
        }
        else
        {
            switch (setter.size)
            {
                case 1:
                    setter.set.call(gl, location, value);
                    break;
                case 2:
                    setter.set.call(gl, location, value[0], value[1]);
                    break;
                case 3:
                    setter.set.call(gl, location, value[0], value[1], value[2]);
                    break;
                case 4:
                    setter.set.call(gl, location, value[0], value[1], value[2], value[3]);
                    break;
            }
        }
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

        var gl = this.renderer.gl;
        if (!gl.isContextLost())
        {
            if (this._vertexShader)
            {
                gl.deleteShader(this._vertexShader);
            }
            if (this._fragmentShader)
            {
                gl.deleteShader(this._fragmentShader);
            }
            gl.deleteProgram(this.webGLProgram);

            for (var i = 0; i < this.glAttributes.length; i++)
            {
                gl.disableVertexAttribArray(this.glAttributes[i].location);
            }
            this.glAttributes.length = 0;

            this.glUniforms.clear();
        }

        this.glAttributeBuffer = null;
        this.glAttributeNames.clear();
        this.uniformRequests.clear();
        this._vertexShader = null;
        this._fragmentShader = null;
        this.webGLProgram = null;
        this.renderer = null;
    }
});

module.exports = WebGLProgramWrapper;
