/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @typedef {object} BaseShaderConfig
 * @property {string} name - The name of the shader program, used as a key.
 * @property {string} vertexShader - The vertex shader source code.
 * @property {string} fragmentShader - The fragment shader source code.
 */

/**
 * @classdesc
 * The ShaderProgramFactory is a utility class used to generate
 * {@link Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} objects.
 * It facilitates generating variants of a shader program based on
 * configuration settings.
 *
 * @class ShaderProgramFactory
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer that owns this ShaderProgramFactory.
 */
var ShaderProgramFactory = new Class({
    initialize: function ShaderProgramFactory (renderer)
    {
        /**
         * The WebGLRenderer that owns this ShaderProgramFactory.
         *
         * @name Phaser.Renderer.WebGL.ShaderProgramFactory#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * A map of shader programs, identified by a unique key.
         *
         * The key of each shader program is made up of the following components:
         *
         * - The key of the base shader program.
         * - The key of each shader addition, in addition order.
         * - The key of each enabled shader feature, sorted alphabetically.
         *
         * @name Phaser.Renderer.WebGL.ShaderProgramFactory#programs
         * @type {object}
         * @since 4.0.0
         */
        this.programs = {};
    },

    /**
     * Checks if a shader program exists based on the given configuration settings.
     *
     * @method Phaser.Renderer.WebGL.ShaderProgramFactory#has
     * @since 4.0.0
     * @param {string} key - The unique key of the shader program.
     */
    has: function (key)
    {
        return this.programs[key] !== undefined;
    },

    /**
     * Returns a shader program based on the given configuration settings.
     *
     * @method Phaser.Renderer.WebGL.ShaderProgramFactory#getShaderProgram
     * @since 4.0.0
     * @param {BaseShaderConfig} base - The base shader configuration.
     * @param {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig[]} [additions] - An array of shader addition configurations.
     * @param {string[]} [features] - An array of enabled shader feature keys.
     */
    getShaderProgram: function (base, additions, features)
    {
        var key = this.getKey(base, additions, features);

        var program = this.programs[key];

        if (!program)
        {
            program = this.createShaderProgram(key, base, additions, features);
        }

        return program;
    },

    /**
     * Returns a unique key for a shader program based on the given configuration settings.
     *
     * The key is made up of the following components:
     *
     * - The key of the base shader program.
     * - The key of each shader addition, in addition order.
     * - The key of each enabled shader feature, sorted alphabetically.
     *
     * @method Phaser.Renderer.WebGL.ShaderProgramFactory#getKey
     * @since 4.0.0
     * @param {BaseShaderConfig} base - The base shader configuration.
     * @param {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig[]} [additions] - An array of shader addition configurations.
     * @param {string[]} [features] - An array of enabled shader feature keys.
     */
    getKey: function (base, additions, features)
    {
        var key = base.name;

        if (additions && additions.length > 0)
        {
            key += '_';
            for (var i = 0; i < additions.length; i++)
            {
                var addition = additions[i];
                if (!addition.disable)
                {
                    key += '_' + addition.name;
                }
            }
        }

        if (features && features.length > 0)
        {
            key += '__';
            key += features.sort().join('_');
        }

        return key;
    },

    /**
     * Creates a shader program based on the given configuration settings.
     *
     * @method Phaser.Renderer.WebGL.ShaderProgramFactory#createShaderProgram
     * @since 4.0.0
     * @param {string} name - The unique key of the shader program.
     * @param {BaseShaderConfig} base - The base shader configuration.
     * @param {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig[]} [additions] - An array of shader addition configurations.
     * @param {string[]} [features] - An array of enabled shader feature keys.
     */
    createShaderProgram: function (name, base, additions, features)
    {
        var vertexSource = base.vertexShader;
        var fragmentSource = base.fragmentShader;

        // Remove carriage return characters from the shader source.
        vertexSource = vertexSource.replace(/\r/g, '');
        fragmentSource = fragmentSource.replace(/\r/g, '');

        if (additions)
        {
            var key, value;
            var templates = {};

            for (var i = 0; i < additions.length; i++)
            {
                var addition = additions[i];

                if (addition.disable)
                {
                    continue;
                }

                for (key in addition.additions)
                {
                    value = addition.additions[key];

                    // Remove carriage return characters from the shader source.
                    value = value.replace(/\r/g, '');

                    if (!templates[key])
                    {
                        templates[key] = '';
                    }

                    templates[key] += value + '\n';
                }
            }

            for (key in templates)
            {
                var template = '#pragma phaserTemplate(' + key + ')\n';
                value = templates[key];

                vertexSource = vertexSource.replace(template, value);
                fragmentSource = fragmentSource.replace(template, value);
            }
        }

        if (features)
        {
            var featureDefines = '';
            var reInvalid = /[^a-zA-Z0-9]/g;

            for (i = 0; i < features.length; i++)
            {
                var feature = features[i].toUpperCase().replace(reInvalid, '_');
                featureDefines += '#define FEATURE_' + feature + '\n';
            }

            vertexSource = vertexSource.replace('#pragma phaserTemplate(features)', featureDefines);
            fragmentSource = fragmentSource.replace('#pragma phaserTemplate(features)', featureDefines);
        }

        // Name the program after the key.
        vertexSource = vertexSource.replace('#pragma phaserTemplate(shaderName)', '#define SHADER_NAME ' + name + '__VERTEX');
        fragmentSource = fragmentSource.replace('#pragma phaserTemplate(shaderName)', '#define SHADER_NAME ' + name + '__FRAGMENT');

        // Remove any remaining template directives.
        var rePragma = /\s*#pragma phaserTemplate\(.*/g;
        vertexSource = vertexSource.replace(rePragma, '');
        fragmentSource = fragmentSource.replace(rePragma, '');

        var program = this.renderer.createProgram(vertexSource, fragmentSource);

        this.programs[name] = program;

        return program;
    }
});

module.exports = ShaderProgramFactory;
