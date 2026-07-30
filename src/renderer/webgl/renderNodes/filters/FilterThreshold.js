/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterThreshold-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Threshold filter effect, which converts each
 * pixel of a Game Object to either fully opaque or fully transparent based on
 * its luminance value relative to a configurable threshold range. Pixels whose
 * luminance falls below `edge1` are discarded, those above `edge2` are kept,
 * and those in between are smoothly interpolated. The effect can optionally be
 * inverted so that bright pixels are discarded instead of dark ones.
 * See {@link Phaser.Filters.Threshold}.
 *
 * @class FilterThreshold
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterThreshold = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterThreshold (manager)
    {
        BaseFilterShader.call(this, 'FilterThreshold', manager, null, ShaderSourceFS);
    },

    /**
     * Sets the WebGL shader uniforms required by the Threshold filter.
     *
     * Passes the lower threshold edge (`edge1`), the upper threshold edge
     * (`edge2`), and the invert flag to the fragment shader so it can apply
     * the correct threshold calculation for the current frame.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterThreshold#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Threshold} controller - The filter controller providing the uniform values.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('edge1', controller.edge1);
        programManager.setUniform('edge2', controller.edge2);
        programManager.setUniform('invert', controller.invert);
    }
});

module.exports = FilterThreshold;
