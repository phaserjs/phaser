/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilterShader = require('./BaseFilterShader');

var ShaderSourceFS = require('../../shaders/FilterPixelate-frag.js');

/**
 * @classdesc
 * A RenderNode that renders the Pixelate filter effect. It applies a blocky,
 * low-resolution pixelation to the Game Object by dividing the rendered surface
 * into uniformly-sized pixel blocks whose size is controlled by the `amount`
 * property on the filter controller. Larger values produce more pronounced
 * pixelation. This node binds the shader uniforms required by the
 * `FilterPixelate` fragment shader and delegates actual rendering to its
 * {@link Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader} base class.
 * See {@link Phaser.Filters.Pixelate}.
 *
 * @class FilterPixelate
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterPixelate = new Class({
    Extends: BaseFilterShader,

    initialize: function FilterPixelate (manager)
    {
        BaseFilterShader.call(this, 'FilterPixelate', manager, null, ShaderSourceFS);
    },

    /**
     * Sets the shader uniforms required by the Pixelate filter.
     *
     * Passes the pixelation `amount` from the filter controller and the current
     * render target dimensions as a two-element `resolution` uniform. The
     * fragment shader uses these values to snap texture coordinates to a grid,
     * producing the blocky pixelation effect.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterPixelate#setupUniforms
     * @since 4.0.0
     * @param {Phaser.Filters.Pixelate} controller - The filter controller that owns this effect, providing the `amount` property.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context, used to obtain the render target width and height in pixels.
     */
    setupUniforms: function (controller, drawingContext)
    {
        var programManager = this.programManager;

        programManager.setUniform('amount', controller.amount);
        programManager.setUniform('resolution', [ drawingContext.width, drawingContext.height ]);
    }
});

module.exports = FilterPixelate;
