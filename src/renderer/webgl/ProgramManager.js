/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var DeepCopy = require('../../utils/object/DeepCopy');

/**
 * @classdesc
 * The ProgramManager is a utility class used to manage
 * instantiated shader programs and a suite of associated data,
 * such as a VAO. It maintains a shared pool of uniforms,
 * so if a different shader program is used, the uniforms
 * can be applied to the new program.
 *
 * @class ProgramManager
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The current WebGLRenderer instance.
 * @param {Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout[]} attributeBufferLayouts - The attribute buffer layouts to use in the program.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} [indexBuffer] - The index buffer to use in the program, if any.
 */
var ProgramManager = new Class({
    initialize: function ProgramManager (renderer, attributeBufferLayouts, indexBuffer)
    {
        /**
         * The current WebGLRenderer instance.
         *
         * @name Phaser.Renderer.WebGL.ProgramManager#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * The index buffer to use in the program, if any.
         * This is used to create a VAO.
         *
         * @name Phaser.Renderer.WebGL.ProgramManager#indexBuffer
         * @type {?Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 4.0.0
         */
        this.indexBuffer = indexBuffer;

        /**
         * The attribute buffer layouts to use in the program.
         * These are used to create a VAO.
         *
         * @name Phaser.Renderer.WebGL.ProgramManager#attributeBufferLayouts
         * @type {Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout[]}
         * @since 4.0.0
         */
        this.attributeBufferLayouts = attributeBufferLayouts;

        /**
         * The key of the currently active shader program.
         *
         * @name Phaser.Renderer.WebGL.ProgramManager#currentProgramKey
         * @type {?string}
         * @since 4.0.0
         */
        this.currentProgramKey = null;

        /**
         * The configuration object currently being assembled.
         *
         * @name Phaser.Renderer.WebGL.ProgramManager#currentConfig
         * @type {object}
         * @since 4.0.0
         */
        this.currentConfig = {
            base: {
                vertexShader: '',
                fragmentShader: ''
            },
            additions: [],
            features: []
        };

        /**
         * A map of shader programs and associated data suite,
         * identified by a unique key.
         *
         * Each key corresponds to an object of the following shape:
         *
         * - `program` (WebGLProgramWrapper) - The compiled shader program.
         * - `vao` (WebGLVAOWrapper) - The VAO associated with the program.
         * - `config` (object) - The configuration object used to create the program.
         *
         * @name Phaser.Renderer.WebGL.ProgramManager#programs
         * @type {object}
         * @since 4.0.0
         */
        this.programs = {};

        /**
         * A map of uniform values, identified by the shader uniform names.
         * This allows uniforms to be kept between shader programs.
         *
         * @name Phaser.Renderer.WebGL.ProgramManager#uniforms
         * @type {object}
         * @since 4.0.0
         */
        this.uniforms = {};
    },

    /**
     * Returns a program suite based on the current configuration.
     * If the program does not exist, it is created.
     *
     * The suite contains the following properties:
     *
     * - `program` (WebGLProgramWrapper) - The compiled shader program.
     * - `vao` (WebGLVAOWrapper) - The VAO associated with the program.
     * - `config` (object) - The configuration object used to create the program.
     *
     * If parallel shader compilation is enabled,
     * the program may not be available immediately.
     * In this case, `null` is returned.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#getCurrentProgramSuite
     * @since 4.0.0
     * @return {?{ program: Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper, vao: Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper, config: object }} The program suite, or `null` if the program is not available.
     */
    getCurrentProgramSuite: function ()
    {
        var config = this.currentConfig;
        var renderer = this.renderer;
        var factory = renderer.shaderProgramFactory;

        var key = factory.getKey(config.base, config.additions, config.features);

        if (!this.programs[key])
        {
            var program = factory.getShaderProgram(config.base, config.additions, config.features);

            if (program.compiling)
            {
                program.checkParallelCompile();
            }

            if (!program.compiling)
            {
                this.programs[key] = {
                    program: program,
                    vao: renderer.createVAO(
                        program,
                        this.indexBuffer,
                        this.attributeBufferLayouts
                    ),
                    config: DeepCopy(config)
                };
            }
        }

        return this.programs[key] || null;
    },

    /**
     * Resets the current configuration object.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#resetCurrentConfig
     * @since 4.0.0
     */
    resetCurrentConfig: function ()
    {
        this.currentConfig.base.vertexShader = '';
        this.currentConfig.base.fragmentShader = '';
        this.currentConfig.additions.length = 0;
        this.currentConfig.features.length = 0;
    },

    /**
     * Set the value of a uniform,
     * available for all shader programs in this manager.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#setUniform
     * @since 4.0.0
     * @param {string} name - The name of the uniform.
     * @param {any} value - The value of the uniform.
     */
    setUniform: function (name, value)
    {
        this.uniforms[name] = value;
    },

    /**
     * Delete a uniform value. While unused uniforms are not harmful,
     * they do take time to process and can be a source of confusion.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#removeUniform
     * @since 4.0.0
     * @param {string} name - The name of the uniform.
     */
    removeUniform: function (name)
    {
        delete this.uniforms[name];
    },

    /**
     * Remove all uniforms.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#clearUniforms
     * @since 4.0.0
     */
    clearUniforms: function ()
    {
        this.uniforms.length = 0;
    },

    /**
     * Set the stored uniforms on a shader program.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#applyUniforms
     * @since 4.0.0
     */
    applyUniforms: function (program)
    {
        var uniforms = this.uniforms;

        for (var name in uniforms)
        {
            program.setUniform(name, uniforms[name]);
        }
    },

    /**
     * Set the base shader for the current configuration.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#setBaseShader
     * @since 4.0.0
     * @param {string} name - The name of the shader program.
     * @param {string} vertexShader - The vertex shader source code.
     * @param {string} fragmentShader - The fragment shader source code.
     */
    setBaseShader: function (name, vertexShader, fragmentShader)
    {
        var base = this.currentConfig.base;
        base.name = name;
        base.vertexShader = vertexShader;
        base.fragmentShader = fragmentShader;
    },

    /**
     * Add a shader addition to the current configuration.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#addAddition
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} addition - The shader addition to add.
     * @param {number} [index] - The index at which to insert the addition. If not specified, it will be added at the end.
     */
    addAddition: function (addition, index)
    {
        if (index === undefined)
        {
            this.currentConfig.additions.push(addition);
        }
        else
        {
            this.currentConfig.additions.splice(index, 0, addition);
        }
    },

    /**
     * Returns the addition with the given name.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#getAddition
     * @since 4.0.0
     * @param {string} name - The name to find.
     * @returns {?Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The addition, or `null` if it was not found.
     */
    getAddition: function (name)
    {
        var additions = this.currentConfig.additions;
        for (var i = 0; i < additions.length; i++)
        {
            var addition = additions[i];
            if (addition.name === name)
            {
                return addition;
            }
        }
        return null;
    },

    /**
     * Returns a list of shader additions in the current config
     * that have a specific tag.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#getAdditionsByTag
     * @since 4.0.0
     * @param {string} tag - The tag to filter by.
     * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig[]} The shader additions with the tag.
     */
    getAdditionsByTag: function (tag)
    {
        return this.currentConfig.additions.filter(function (addition)
        {
            if (!addition.tags)
            {
                return false;
            }
            return addition.tags.includes(tag);
        });
    },

    /**
     * Returns the index of a shader addition with the given name.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#getAdditionIndex
     * @since 4.0.0
     * @param {string} name - The name to find.
     * @returns {number} The index of the addition, or `-1` if it was not found.
     */
    getAdditionIndex: function (name)
    {
        return this.currentConfig.additions.findIndex(function (addition)
        {
            return addition.name === name;
        });
    },

    /**
     * Remove a shader addition from the current configuration.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#removeAddition
     * @since 4.0.0
     * @param {string} name - The name of the shader addition to remove.
     */
    removeAddition: function (name)
    {
        this.currentConfig.additions = this.currentConfig.additions.filter(function (addition)
        {
            return addition.name !== name;
        });
    },

    /**
     * Replace a shader addition in the current configuration.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#replaceAddition
     * @since 4.0.0
     * @param {string} name - The name of the shader addition to replace.
     * @param {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} addition - The new shader addition.
     */
    replaceAddition: function (name, addition)
    {
        var index = this.currentConfig.additions.findIndex(function (a)
        {
            return a.name === name;
        });

        if (index !== -1)
        {
            this.currentConfig.additions[index] = addition;
        }
    },

    /**
     * Add a feature to the current configuration.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#addFeature
     * @since 4.0.0
     * @param {string} feature - The feature to add.
     */
    addFeature: function (feature)
    {
        if (this.currentConfig.features.indexOf(feature) === -1)
        {
            this.currentConfig.features.push(feature);
        }
    },

    /**
     * Remove a feature from the current configuration.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#removeFeature
     * @since 4.0.0
     * @param {string} feature - The feature to remove.
     */
    removeFeature: function (feature)
    {
        this.currentConfig.features = this.currentConfig.features.filter(function (f)
        {
            return f !== feature;
        });
    },

    /**
     * Clear all features from the current configuration.
     *
     * @method Phaser.Renderer.WebGL.ProgramManager#clearFeatures
     * @since 4.0.0
     */
    clearFeatures: function ()
    {
        this.currentConfig.features.length = 0;
    }
});

module.exports = ProgramManager;
