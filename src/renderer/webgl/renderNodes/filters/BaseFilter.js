/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * This is a base class for all filters.
 * It should not be used directly, but should be extended by all other filters.
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
     * Run the filter. It returns a drawing context containing the output texture.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BaseFilter#run
     * @since 4.0.0
     * @param {Phaser.Filters.Controller} controller - The filter controller.
     * @param {Phaser.Renderer.WebGL.DrawingContext} inputDrawingContext - The drawing context containing the input texture. This is either the initial render, or the output of the previous filter. This will be released during the run process, and can no longer be used.
     * @param {Phaser.Renderer.WebGL.DrawingContext} [outputDrawingContext] - The drawing context where the output texture will be drawn. If not specified, a new drawing context will be generated. Generally, this parameter is used for the last filter in a chain, so the output texture is drawn to the main framebuffer.
     * @param {Phaser.Geom.Rectangle} [padding] - The padding to add to the input texture to create the output texture. If not specified, the controller is used to get the padding. This should be undefined for internal filters, so the controller will expand textures as needed; and defined as the negative padding of the previous filter for external filters, so the texture will shrink to the correct size.
     * @returns {Phaser.Renderer.WebGL.DrawingContext} The drawing context containing the output texture.
     */
    run: function (controller, inputDrawingContext, outputDrawingContext, padding)
    {
        //  This is the base run method that all filters should override
    }
});

module.exports = BaseFilter;
