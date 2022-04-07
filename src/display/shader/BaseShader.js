/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * A BaseShader is a small resource class that contains the data required for a WebGL Shader to be created.
 *
 * It contains the raw source code to the fragment and vertex shader, as well as an object that defines
 * the uniforms the shader requires, if any.
 *
 * BaseShaders are stored in the Shader Cache, available in a Scene via `this.cache.shaders` and are referenced
 * by a unique key-based string. Retrieve them via `this.cache.shaders.get(key)`.
 *
 * BaseShaders are created automatically by the GLSL File Loader when loading an external shader resource.
 * They can also be created at runtime, allowing you to use dynamically generated shader source code.
 *
 * Default fragment and vertex source is used if not provided in the constructor, setting-up a basic shader,
 * suitable for debug rendering.
 *
 * @class BaseShader
 * @memberof Phaser.Display
 * @constructor
 * @since 3.17.0
 *
 * @param {string} key - The key of this shader. Must be unique within the shader cache.
 * @param {string} [fragmentSrc] - The fragment source for the shader.
 * @param {string} [vertexSrc] - The vertex source for the shader.
 * @param {any} [uniforms] - Optional object defining the uniforms the shader uses.
 */
var BaseShader = new Class({

    initialize:

    function BaseShader (key, fragmentSrc, vertexSrc, uniforms)
    {
        if (!fragmentSrc || fragmentSrc === '')
        {
            fragmentSrc = [
                'precision mediump float;',

                'uniform vec2 resolution;',

                'varying vec2 fragCoord;',

                'void main () {',
                '    vec2 uv = fragCoord / resolution.xy;',
                '    gl_FragColor = vec4(uv.xyx, 1.0);',
                '}'
            ].join('\n');
        }

        if (!vertexSrc || vertexSrc === '')
        {
            vertexSrc = [
                'precision mediump float;',

                'uniform mat4 uProjectionMatrix;',
                'uniform mat4 uViewMatrix;',
                'uniform vec2 uResolution;',

                'attribute vec2 inPosition;',

                'varying vec2 fragCoord;',
                'varying vec2 outTexCoord;',

                'void main () {',
                '   gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);',
                '   fragCoord = vec2(inPosition.x, uResolution.y - inPosition.y);',
                '   outTexCoord = vec2(inPosition.x / uResolution.x, fragCoord.y / uResolution.y);',
                '}'
            ].join('\n');
        }

        if (uniforms === undefined) { uniforms = null; }

        /**
         * The key of this shader, unique within the shader cache of this Phaser game instance.
         *
         * @name Phaser.Display.BaseShader#key
         * @type {string}
         * @since 3.17.0
         */
        this.key = key;

        /**
         * The source code, as a string, of the fragment shader being used.
         *
         * @name Phaser.Display.BaseShader#fragmentSrc
         * @type {string}
         * @since 3.17.0
         */
        this.fragmentSrc = fragmentSrc;

        /**
         * The source code, as a string, of the vertex shader being used.
         *
         * @name Phaser.Display.BaseShader#vertexSrc
         * @type {string}
         * @since 3.17.0
         */
        this.vertexSrc = vertexSrc;

        /**
         * The default uniforms for this shader.
         *
         * @name Phaser.Display.BaseShader#uniforms
         * @type {?any}
         * @since 3.17.0
         */
        this.uniforms = uniforms;
    }

});

module.exports = BaseShader;
