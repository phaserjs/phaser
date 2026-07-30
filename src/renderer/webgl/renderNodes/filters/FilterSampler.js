/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BaseFilter = require('./BaseFilter');

/**
 * @classdesc
 * A RenderNode that implements the Sampler filter, which reads pixel data
 * from a WebGL framebuffer and delivers it to a callback without applying
 * any visual modifications.
 *
 * Unlike other filter nodes, FilterSampler does not transform or composite
 * its input. Instead it acts as a snapshot mechanism: it calls
 * `renderer.snapshotFramebuffer` on the input drawing context's framebuffer
 * and forwards the result to the controller's callback function. The area
 * sampled is determined by the controller's `region` property. If `region`
 * is a `Phaser.Geom.Rectangle`, that rectangular area is captured. If
 * `region` is a point (an object with `x` and `y` but no `width`), a single
 * pixel is read. If no `region` is set, the entire framebuffer is sampled.
 *
 * This node is used internally by the Phaser filter pipeline when a game
 * object or camera requests a framebuffer snapshot via the Sampler filter.
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

    /**
     * Samples the input framebuffer and delivers the result to the
     * controller's callback, then returns the input drawing context unchanged.
     *
     * The method reads pixel data from `inputDrawingContext.framebuffer` via
     * `renderer.snapshotFramebuffer`. The sampled region is controlled by
     * `controller.region`:
     *
     * - If `controller.region` is a `Phaser.Geom.Rectangle`, the rectangular
     *   area defined by its `x`, `y`, `width`, and `height` is captured.
     * - If `controller.region` is a point (has `x` and `y` but no `width`),
     *   a single pixel at that coordinate is read.
     * - If `controller.region` is not set, the entire framebuffer is sampled.
     *
     * The captured data is passed to `controller.callback`. The input drawing
     * context is returned unmodified; this node does not write to
     * `outputDrawingContext`.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterSampler#run
     * @since 4.0.0
     * @param {Phaser.Filters.Sampler} controller - The Sampler filter controller, providing the `region` to sample and the `callback` to receive the result.
     * @param {Phaser.Renderer.WebGL.DrawingContext} inputDrawingContext - The drawing context whose framebuffer will be sampled.
     * @param {Phaser.Renderer.WebGL.DrawingContext} [outputDrawingContext] - The output drawing context. Not used by this node.
     * @param {Phaser.Geom.Rectangle} [padding] - Additional padding around the render area. Not used by this node.
     * @return {Phaser.Renderer.WebGL.DrawingContext} The `inputDrawingContext`, returned unchanged.
     */
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
