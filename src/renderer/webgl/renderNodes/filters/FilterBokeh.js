/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterBokeh-frag.js');

/**
 * @classdesc
 * This RenderNode renders the Bokeh filter effect, which simulates the
 * lens blur and depth-of-field appearance found in photography and film.
 * It supports both a standard circular bokeh blur and a tilt-shift mode,
 * which blurs only the top and bottom regions of the image to create the
 * illusion of a shallow focal plane. The effect is controlled via the
 * associated filter controller.
 * See {@link Phaser.Filters.Bokeh}.
 *
 * @class FilterBokeh
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterBokeh = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterBokeh (manager)
    {
        BaseFilterShader.call(this, 'FilterBokeh', manager, null, ShaderSourceFS);
    },

    /**
     * Sets the WebGL shader uniforms required by the Bokeh fragment shader,
     * sourcing values from the filter controller and the current drawing
     * context. This method is called automatically each time the filter is
     * rendered.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterBokeh#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Bokeh} controller - The Bokeh filter controller supplying the effect parameters.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context, used to supply the render resolution.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('radius', controller.radius);
        programManager.setUniform('amount', controller.amount);
        programManager.setUniform('contrast', controller.contrast);
        programManager.setUniform('strength', controller.strength);
        programManager.setUniform('blur', [ controller.blurX, controller.blurY ]);
        programManager.setUniform('isTiltShift', controller.isTiltShift);
        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
    }
});

module.exports = FilterBokeh;
