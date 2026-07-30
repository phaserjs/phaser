/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterQuantize-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Quantize filter effect, which reduces the number
 * of distinct color levels in the output image to simulate a low bit-depth or
 * posterized look. The effect can be applied in different color modes and
 * supports optional dithering to reduce visible banding. Gamma correction and
 * an offset value allow fine-tuning of how the quantization steps are
 * distributed across the tonal range.
 * See {@link Phaser.Filters.Quantize}.
 *
 * @class FilterQuantize
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterQuantize = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterQuantize (manager)
    {
        BaseFilterShader.call(this, 'FilterQuantize', manager, null, ShaderSourceFS);
    },

    /**
     * Sets the shader uniforms for the Quantize filter from the given
     * controller. This transfers the current steps, gamma, offset, mode, and
     * dither values to the WebGL program before rendering.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterQuantize#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Quantize} controller - The filter controller providing the uniform values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} _drawingContext - The current drawing context (unused).
     */
    setupUniforms: function (controller, _drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('uSteps', controller.steps);
        programManager.setUniform('uGamma', controller.gamma);
        programManager.setUniform('uOffset', controller.offset);
        programManager.setUniform('uMode', controller.mode);
        programManager.setUniform('uDither', controller.dither);
    }
});

module.exports = FilterQuantize;
