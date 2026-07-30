/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns a `ShaderAdditionConfig` that adds normal map sampling to a
 * TilemapGPULayer shader. The addition samples the normal map texture via
 * `uNormSampler`, decodes the stored RGB values from the [0, 1] range back
 * into a normalized direction vector in the [-1, 1] range, and exposes the
 * result through a `Samples` object so that other shader additions (such as
 * lighting calculations) can consume it. The addition is tagged `LIGHTING`,
 * meaning it will only be active when a lighting pass is in use.
 *
 * @function Phaser.Renderer.WebGL.ShaderAdditionMakers.MakeSampleNormal
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 */
var MakeSampleNormal = function (disable)
{
    return {
        name: 'SampleNormal',
        additions: {
            defineSamples: 'vec4 normal;',
            getSamples: 'samples.normal = texture2D(uNormSampler, texCoord);',
            mixSamples: 'samples.normal = mix(samples1.normal, samples2.normal, alpha);',
            declareSamples: 'vec3 normal = normalize(samples.normal.rgb * 2.0 - 1.0);'
        },
        tags: ['LIGHTING'],
        disable: !!disable
    };
}

module.exports = MakeSampleNormal;
