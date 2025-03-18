/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilter = require('./BaseFilter');

/**
 * @classdesc
 * This RenderNode handles the Sampler filter.
 *
 * The Sampler filter is a special RenderNode that samples the texture
 * being passed in, without any modifications.
 *
 * @class FilterSampler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilter
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterSampler = new Class({
    Extends: BaseFilter,

    initialize: function FilterSampler (manager)
    {
        BaseFilter.call(this, 'FilterSampler', manager);
    },

    run: function (controller, inputDrawingContext, outputDrawingContext, padding)
    {
        this.onRunBegin(inputDrawingContext);

        var renderer = this.manager.renderer;
        var x = 0;
        var y = 0;
        var width = 1;
        var height = 1;
        var bufferWidth = inputDrawingContext.width;
        var bufferHeight = inputDrawingContext.height;
        var getPixel = false;

        if (controller.region)
        {
            x = controller.region.x;
            y = controller.region.y;

            if (controller.region.width !== undefined)
            {
                // Region is a Rectangle.
                width = controller.region.width;
                height = controller.region.height;
            }
            else
            {
                // Region is a point.
                getPixel = true;
            }
        }
        else
        {
            // Sample the whole buffer.
            width = bufferWidth;
            height = bufferHeight;
        }

        renderer.snapshotFramebuffer(
            inputDrawingContext.framebuffer,
            bufferWidth, bufferHeight,
            controller.callback,
            getPixel,
            x, y,
            width, height
        );

        this.onRunEnd(inputDrawingContext);

        return inputDrawingContext;
    }
});

module.exports = FilterSampler;
