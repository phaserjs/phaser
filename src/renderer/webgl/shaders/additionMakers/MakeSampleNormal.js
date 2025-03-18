/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Return a ShaderAdditionConfig for sampling a normal map
 * in the context of a TilemapGPULayer shader.
 * This shader uses a `Samples` object to collate texture samples.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeSampleNormal
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
