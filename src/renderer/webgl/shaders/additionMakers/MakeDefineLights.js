/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DefineLights = require('../DefineLights-glsl');

/**
 * Return a ShaderAdditionConfig for defining the lights and core lighting
 * algorithm in the fragment shader.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeDefineLights
 * @since 4.0.0
 *
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeDefineLights = function (disable)
{
    return {
        name: 'DefineLights',
        additions: {
            fragmentDefine: '#define LIGHT_COUNT 1',
            fragmentHeader: DefineLights
        },
        tags: [ 'LIGHTING' ],
        disable: !!disable
    };
};

module.exports = MakeDefineLights;
