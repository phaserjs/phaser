/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBlurHigh-frag.js');

/**
 * @classdesc
 * A RenderNode that renders a high quality Gaussian blur effect using a
 * dedicated fragment shader. Unlike the standard blur variant, this node
 * uses a larger kernel that produces smoother, more visually accurate results
 * at the cost of additional GPU work per pass.
 *
 * This node should not be instantiated or called directly. It is selected
 * and invoked automatically by the `FilterBlur` RenderNode when the blur
 * controller's quality setting is set to high.
 *
 * @class FilterBlurHigh
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterBlurHigh = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterBlurHigh (manager)
    {
        BaseFilterShader.call(this, 'FilterBlurHigh', manager, null, ShaderSourceFS);
    },

    /**
     * Uploads the shader uniforms required for the high quality blur pass.
     *
     * Called automatically by the rendering pipeline before the blur shader
     * is executed. It passes the current render target dimensions as the
     * `resolution` uniform, the blur `strength`, the tint `color`, and the
     * directional `offset` (x/y) that controls which axis the blur is applied
     * along for the current pass.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterBlurHigh#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Blur} controller - The Blur filter controller providing the blur parameters.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context, used to determine the render resolution.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
        programManager.setUniform('strength', controller.strength);
        programManager.setUniform('color', controller.color);
        programManager.setUniform('offset', [ controller.x, controller.y ]);
    }
});

module.exports = FilterBlurHigh;
