/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 *
 * @class Shader
 * @memberof Phaser.Display
 * @constructor
 * @since 3.17.0
 *
 * @param {string} key - The key of this shader. Must be unique within the shader cache.
 * @param {string} fragmentSrc - 
 * @param {string} vertexSrc - 
 * @param {any} uniforms - 
 */
var Shader = new Class({

    initialize:

    function Shader (key, fragmentSrc, vertexSrc, uniforms)
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

                'attribute vec2 inPosition;',

                'varying vec2 fragCoord;',

                'void main () {',
                'gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);',
                'fragCoord = inPosition;',
                '}'
            ].join('\n');
        }

        if (uniforms === undefined) { uniforms = null; }

        /**
         * The key of this shader, unique within the shader cache of this Phaser game instance.
         *
         * @name Phaser.Display.Shader#key
         * @type {string}
         * @since 3.17.0
         */
        this.key = key;

        /**
         * The source code, as a string, of the fragment shader being used.
         *
         * @name Phaser.Display.Shader#fragmentSrc
         * @type {string}
         * @since 3.17.0
         */
        this.fragmentSrc = fragmentSrc;

        /**
         * The source code, as a string, of the vertex shader being used.
         *
         * @name Phaser.Display.Shader#vertexSrc
         * @type {string}
         * @since 3.17.0
         */
        this.vertexSrc = vertexSrc;

        /**
         * The default uniforms for this shader.
         *
         * @name Phaser.Display.Shader#uniforms
         * @type {?any}
         * @since 3.17.0
         */
        this.uniforms = uniforms;
    }

});

module.exports = Shader;
