/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterVignette-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Vignette filter effect, which darkens the edges
 * of the Game Object toward a configurable color, drawing visual focus toward
 * the center of the image. The effect is controlled by a radius (how far the
 * vignette extends inward), a strength (how intense the darkening is), a
 * position (the center point of the vignette, in normalized 0-1 coordinates),
 * a color, and a blend mode that determines how the vignette is composited
 * over the source image.
 *
 * This node is used internally by the WebGL renderer when a
 * {@link Phaser.Filters.Vignette} controller is active on a Game Object.
 * See {@link Phaser.Filters.Vignette}.
 *
 * @class FilterVignette
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterVignette = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterVignette (manager)
    {
        BaseFilterShader.call(this, 'FilterVignette', manager, null, ShaderSourceFS);
    },

    /**
     * Sets the WebGL shader uniforms required by the Vignette filter.
     *
     * Passes the current vignette properties from the controller to the GPU,
     * including the radius, strength, center position, color, and blend mode.
     * This method is called automatically during rendering.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterVignette#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Vignette} controller - The Vignette filter controller providing the effect properties.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The current drawing context. Not used by this filter.
     */
    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        var c = controller.color;

        programManager.setUniform('uRadius', controller.radius);
        programManager.setUniform('uStrength', controller.strength);
        programManager.setUniform('uPosition', [ controller.x, controller.y ]);
        programManager.setUniform('uColor', [ c.redGL, c.greenGL, c.blueGL, c.alphaGL ]);
        programManager.setUniform('uBlendMode', controller.blendMode);
    }
});

module.exports = FilterVignette;
