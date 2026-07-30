/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBlurLow-frag.js');

/**
 * @classdesc
 * A RenderNode that renders the BlurLow filter effect, which applies a
 * single-pass Gaussian blur to the input texture using a small sample kernel.
 *
 * This is the lowest quality tier of the blur filter family. It uses fewer
 * texture samples than the medium and high quality variants, making it faster
 * to execute on the GPU at the cost of a less smooth result. It is well suited
 * to subtle or fast-moving blur effects where visual fidelity is less critical
 * than rendering performance.
 *
 * This node should not be used directly. It is selected and invoked
 * automatically by the FilterBlur RenderNode based on the quality setting of
 * the blur controller that is currently being processed.
 *
 * @class FilterBlurLow
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterBlurLow = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterBlurLow (manager)
    {
        BaseFilterShader.call(this, 'FilterBlurLow', manager, null, ShaderSourceFS);
    },

    /**
     * Sets the WebGL shader uniforms required by the blur fragment shader.
     *
     * Called once per render pass before the blur is drawn. It uploads the
     * current render target dimensions as `resolution`, the blur spread
     * amount as `strength`, the tint as `color`, and the directional
     * blur axis as `offset` (a two-component vector containing the
     * horizontal and vertical offset values from the controller).
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterBlurLow#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Blur} controller - The Blur filter controller providing the uniform values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context, used to read the render target dimensions.
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

module.exports = FilterBlurLow;
