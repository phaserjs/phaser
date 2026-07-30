/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * The base class for all WebGL post-processing filters in Phaser.
 *
 * Filters are render nodes that apply visual effects to a WebGL texture by
 * processing an input drawing context and producing an output drawing context.
 * They are managed by a `Phaser.Filters.Controller`, which chains multiple
 * filters together so that each filter's output becomes the next filter's
 * input. Examples of filters include blur, glow, bloom, and color correction.
 *
 * This class should not be instantiated directly. Instead, extend it to create
 * a custom filter that overrides the {@link Phaser.Renderer.WebGL.RenderNodes.BaseFilter#run run} method.
 *
 * @class BaseFilter
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 *
 * @param {string} name - The name of the filter.
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this filter.
 */
var BaseFilter = new Class({
    Extends: RenderNode,

    initialize: function BaseFilter (name, manager)
    {
        RenderNode.call(this, name, manager);
    },

    /**
     * Runs the filter, processing the input drawing context and returning a drawing context containing the output texture.
     *
     * This base implementation does nothing and is intended to be overridden by subclasses. Each subclass should apply its specific visual effect (for example, blur or glow) by writing to the output drawing context using WebGL shader programs.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BaseFilter#run
     * @since 4.0.0
     * @param {Phaser.Filters.Controller} controller - The filter controller.
     * @param {Phaser.Renderer.WebGL.DrawingContext} inputDrawingContext - The drawing context containing the input texture. This is either the initial render, or the output of the previous filter. This will be released during the run process, and can no longer be used.
     * @param {Phaser.Renderer.WebGL.DrawingContext} [outputDrawingContext] - The drawing context where the output texture will be drawn. If not specified, a new drawing context will be generated. Generally, this parameter is used for the last filter in a chain, so the output texture is drawn to the main framebuffer.
     * @param {Phaser.Geom.Rectangle} [padding] - The padding to add to the input texture to create the output texture. If not specified, the controller is used to get the padding. This should be undefined for internal filters, so the controller will expand textures as needed; and defined as the negative padding of the previous filter for external filters, so the texture will shrink to the correct size.
     * @return {Phaser.Renderer.WebGL.DrawingContext} The drawing context containing the output texture.
     */
    run: function (controller, inputDrawingContext, outputDrawingContext, padding)
    {
        //  This is the base run method that all filters should override
    }
});

module.exports = BaseFilter;
