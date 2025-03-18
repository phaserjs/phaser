/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * A BaseShader is a small resource class that contains GLSL code for a shader.
 *
 * It contains the key of the shader, the source code, and optional metadata.
 * The source code is not of a specific type, such as fragment or vertex,
 * or even an incomplete snippet of GLSL.
 * It's just the raw source code as a string.
 * It may be retrieved and compiled as you wish.
 * These keys can be used by `Phaser.GameObjects.Shader` and
 * `Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader`.
 *
 * BaseShaders are stored in the Shader Cache, available in a Scene via `this.cache.shaders` and are referenced
 * by a unique key-based string. Retrieve them via `this.cache.shaders.get(key)`.
 *
 * BaseShaders are created automatically by the GLSL File Loader when loading an external shader resource.
 * They can also be created at runtime, allowing you to use dynamically generated shader source code.
 *
 * @class BaseShader
 * @memberof Phaser.Display
 * @constructor
 * @since 4.0.0
 *
 * @param {string} key - The key of this shader. Must be unique within the shader cache.
 * @param {string} glsl - The GLSL source code for the shader.
 * @param {object} [metadata] - Additional metadata for this shader code.
 */
var BaseShader = new Class({
    initialize: function BaseShader (key, glsl, metadata)
    {
        if (metadata === undefined) { metadata = {}; }

        /**
         * The key of this shader code,
         * unique within the shader cache of this Phaser game instance.
         *
         * @name Phaser.Display.BaseShader#key
         * @type {string}
         * @since 3.17.0
         */
        this.key = key;

        /**
         * GLSL source code for a shader.
         * The use of this code is not specified by Phaser.
         * You can add metadata to further describe its purpose.
         *
         * @name Phaser.Display.BaseShader#glsl
         * @type {string}
         * @since 4.0.0
         */
        this.glsl = glsl;

        /**
         * Additional metadata for this shader. This is not used by Phaser,
         * but it may be used by your game code or external tools.
         * For example, you could add properties that describe
         * the shader's purpose, author, version, etc.
         *
         * @name Phaser.Display.BaseShader#metadata
         * @type {object}
         * @since 4.0.0
         */
        this.metadata = metadata;
    }
});

module.exports = BaseShader;
