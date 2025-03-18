/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BoundedSampler = require('../BoundedSampler-glsl');

/**
 * Return a ShaderAdditionConfig for bounded texture sampling.
 * A bounded sampler will return a transparent pixel
 * if the texture coordinates are outside the texture bounds.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeBoundedSampler
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeBoundedSampler = function (disable)
{
    return {
        name: 'BoundedSampler',
        additions: {
            fragmentHeader: BoundedSampler
        },
        disable: !!disable
    };
};

module.exports = MakeBoundedSampler;
