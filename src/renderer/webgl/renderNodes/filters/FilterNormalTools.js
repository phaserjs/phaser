/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterNormalTools-frag.js');

/**
 * @classdesc
 * This RenderNode renders the NormalTools filter effect, which processes
 * normal map textures for use in lighting calculations. It transforms normal
 * vectors using a view matrix so they are correctly oriented relative to the
 * camera, enabling accurate directional lighting on normal-mapped Game Objects.
 *
 * Two optional features can be enabled via the controller: facing power, which
 * raises the dot-product result to a given exponent to sharpen or soften the
 * lighting falloff; and ratio output, which blends the normal contribution
 * against a direction vector and radius to produce a ratio value used by
 * downstream lighting passes.
 *
 * This node is used internally by {@link Phaser.Filters.NormalTools} and
 * should not need to be instantiated directly.
 * See {@link Phaser.Filters.NormalTools}.
 *
 * @class FilterNormalTools
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterNormalTools = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterNormalTools (manager)
    {
        var additions = [
            {
                name: 'view',
                additions: {
                    fragmentHeader: '#define VIEW_MATRIX'
                },
                tags: [ 'header' ]
            }
        ];

        BaseFilterShader.call(this, 'FilterNormalTools', manager, null, ShaderSourceFS, additions);
    },

    /**
     * Updates the shader program configuration based on the current controller
     * settings. Resets the fragment header addition to the base
     * `VIEW_MATRIX` define, then conditionally appends the `FACING_POWER`
     * and `OUTPUT_RATIO` defines — and adjusts the addition name accordingly —
     * so that the correct shader variant is compiled and cached for the active
     * combination of features.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterNormalTools#updateShaderConfig
     * @since 4.0.0
     * @param {Phaser.Filters.NormalTools} controller - The filter controller providing the current configuration.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    updateShaderConfig: function (controller, drawingContext)
    {
        var headerAddition = this.programManager.getAdditionsByTag('header')[0];
        headerAddition.name = 'view';
        headerAddition.additions.fragmentHeader = '#define VIEW_MATRIX';

        if (controller.facingPower !== 1)
        {
            headerAddition.name += '_facingPower';
            headerAddition.additions.fragmentHeader += '\n#define FACING_POWER';
        }

        if (controller.outputRatio)
        {
            headerAddition.name += '_ratio';
            headerAddition.additions.fragmentHeader += '\n#define OUTPUT_RATIO';
        }
    },

    /**
     * Sets the WebGL uniform values for the NormalTools shader based on the
     * current controller settings. Always uploads the view matrix as
     * `uViewMatrix`. If the controller's `facingPower` differs from the default
     * value of `1`, the `uFacingPower` uniform is also uploaded. If
     * `outputRatio` is enabled on the controller, the `uRatioVector` (a 3-component
     * direction vector) and `uRatioRadius` uniforms are uploaded as well.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterNormalTools#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.NormalTools} controller - The filter controller providing the uniform values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uViewMatrix', controller.viewMatrix.val);

        if (controller.facingPower !== 1)
        {
            programManager.setUniform('uFacingPower', controller.facingPower);
        }

        if (controller.outputRatio)
        {
            var rv = controller.ratioVector;
            programManager.setUniform('uRatioVector', [ rv.x, rv.y, rv.z ]);
            programManager.setUniform('uRatioRadius', controller.ratioRadius);
        }
    }
});

module.exports = FilterNormalTools;
