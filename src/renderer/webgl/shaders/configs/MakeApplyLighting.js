/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ApplyLighting = require('../ApplyLighting-glsl');

var inverseRotation = [
    '',
    '#ifndef FEATURE_FLAT_LIGHTING',
    'float inverseRotation = -rotation - uCamera.z;',
    'float irSine = sin(inverseRotation);',
    'float irCosine = cos(inverseRotation);',
    'outInverseRotationMatrix = mat3(',
    '    irCosine, irSine, 0.0,',
    '    -irSine, irCosine, 0.0,',
    '    0.0, 0.0, 1.0',
    ');',
    '#endif'
].join('\n    ');

/**
 * Return a ShaderAdditionConfig for applying lighting to a texture.
 *
 * The `rotation` variable must be available in the vertex renderer.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeApplyLighting
 * @since 3.90.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeApplyLighting = function (disable)
{
    return {
        name: 'LIGHTING',
        additions: {
            vertexHeader: 'uniform vec4 uCamera;',
            vertexProcess: inverseRotation,
            outVariables: 'varying mat3 outInverseRotationMatrix;',
            fragmentDefine: '#define LIGHT_COUNT 1',
            fragmentHeader: ApplyLighting,
            fragmentProcess: 'fragColor = applyLighting(fragColor);'
        },
        tags: ['LIGHTING'],
        disable: !!disable
    };
};

module.exports = MakeApplyLighting;
