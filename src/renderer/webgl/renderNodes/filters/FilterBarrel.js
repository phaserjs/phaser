/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBarrel-frag.js');

/**
 * @classdesc
 * A RenderNode that applies a barrel (or pincushion) distortion effect to a
 * WebGL render target. Barrel distortion warps the image as though it were
 * projected onto a curved surface: positive amounts bow the edges outward
 * (barrel), while negative amounts pinch them inward (pincushion). It is
 * commonly used to simulate fisheye lenses, VR screen curvature, or retro CRT
 * monitor effects.
 *
 * This node is used internally by the {@link Phaser.Filters.Barrel} filter
 * controller, which exposes the `amount` property for controlling the strength
 * and direction of the distortion.
 *
 * See {@link Phaser.Filters.Barrel}.
 *
 * @class FilterBarrel
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterBarrel = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterBarrel (manager)
    {
        BaseFilterShader.call(this, 'FilterBarrel', manager, null, ShaderSourceFS);
    },

    /**
     * Sets the shader uniforms required by the barrel distortion fragment
     * shader. Reads the `amount` value from the filter controller and passes it
     * to the GPU program, where it controls the strength and direction of the
     * distortion applied to the render target.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterBarrel#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Barrel} controller - The filter controller providing the `amount` uniform value.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('amount', controller.amount);
    }
});

module.exports = FilterBarrel;
