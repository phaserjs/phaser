/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterColorMatrix-frag.js');

/**
 * @classdesc
 * A RenderNode that applies a Color Matrix filter effect to a Game Object or
 * camera. The color matrix is a 5x4 floating-point matrix that transforms the
 * red, green, blue, and alpha channels of every pixel in the rendered output,
 * enabling visual effects such as grayscale, sepia tone, hue rotation,
 * brightness, contrast, and saturation adjustments.
 *
 * This node is used internally by the Phaser filter pipeline and is driven by
 * a {@link Phaser.Filters.ColorMatrix} controller, which provides the matrix
 * data and alpha values passed as uniforms to the fragment shader.
 *
 * @class FilterColorMatrix
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterColorMatrix = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterColorMatrix (manager)
    {
        BaseFilterShader.call(this, 'FilterColorMatrix', manager, null, ShaderSourceFS);
    },

    /**
     * Sets the WebGL shader uniforms required by the Color Matrix filter.
     *
     * Uploads the 5x4 color matrix data array from the controller's
     * {@link Phaser.Display.ColorMatrix} to the `uColorMatrix` uniform, and
     * the overall alpha multiplier to the `uAlpha` uniform.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterColorMatrix#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.ColorMatrix} controller - The filter controller providing the color matrix and alpha values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uColorMatrix[0]', controller.colorMatrix.getData());
        programManager.setUniform('uAlpha', controller.colorMatrix.alpha);
    }
});

module.exports = FilterColorMatrix;
