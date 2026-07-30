/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var OutInverseRotation = require('../OutInverseRotation-glsl');

/**
 * Returns a ShaderAdditionConfig for creating an `outInverseRotationMatrix`
 * varying in the vertex shader. This matrix is used during lighting calculations
 * to correctly transform normal vectors into world space, ensuring that
 * light direction is applied relative to the game object's orientation.
 *
 * The `rotation` variable must be available in the vertex renderer.
 *
 * @function Phaser.Renderer.WebGL.ShaderAdditionMakers.MakeOutInverseRotation
 * @since 4.0.0
 *
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @return {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeOutInverseRotation = function (disable)
{
    return {
        name: 'OutInverseRotation',
        additions: {
            vertexHeader: 'uniform vec4 uCamera;',
            vertexProcess: OutInverseRotation,
            outVariables: 'varying mat3 outInverseRotationMatrix;'
        },
        tags: [ 'LIGHTING' ],
        disable: !!disable
    };
};

module.exports = MakeOutInverseRotation;
