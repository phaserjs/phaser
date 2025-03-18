/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = require('../../../../geom/rectangle/Rectangle');
var Class = require('../../../../utils/Class');
var BlendModes = require('../../../BlendModes');
var BaseFilter = require('./BaseFilter');

/**
 * @classdesc
 * This RenderNode runs a series of filters in parallel.
 * See {@link Phaser.Filters.ParallelFilters}.
 *
 * This filter redirects to other RenderNodes during operation.
 *
 * @class FilterParallelFilters
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilter
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterParallelFilters = new Class({
    Extends: BaseFilter,

    initialize: function FilterParallelFilters (manager)
    {
        BaseFilter.call(this, 'FilterParallelFilters', manager);
    },

    run: function (controller, inputDrawingContext, outputDrawingContext, padding)
    {
        this.onRunBegin(outputDrawingContext);

        // Prevent the input from being sent back to its pool.
        inputDrawingContext.lock(this);

        var bottomFilters = controller.bottom.getActive();
        var topFilters = controller.top.getActive();
        var initialPadding = padding || controller.getPadding();

        if (bottomFilters.length + topFilters.length > 0)
        {
            var bottomContext = inputDrawingContext;
            var topContext = inputDrawingContext;

            // Process bottom filters.

            if (bottomFilters.length > 0)
            {
                padding = initialPadding;

                for (var i = 0; i < bottomFilters.length; i++)
                {
                    var childController = bottomFilters[i];
                    var filter = this.manager.getNode(childController.renderNode);

                    bottomContext = filter.run(
                        childController,
                        bottomContext,
                        null,
                        padding
                    );

                    // Don't apply more padding after the first filter.
                    if (i === 0 && i < bottomFilters.length - 1)
                    {
                        padding = new Rectangle();
                    }
                }
            }

            // Process top filters.

            if (topFilters.length > 0)
            {
                padding = initialPadding;

                for (i = 0; i < topFilters.length; i++)
                {
                    childController = topFilters[i];
                    filter = this.manager.getNode(childController.renderNode);

                    topContext = filter.run(
                        childController,
                        topContext,
                        null,
                        padding
                    );

                    // Don't apply more padding after the first filter.
                    if (i === 0 && i < topFilters.length - 1)
                    {
                        padding = new Rectangle();
                    }
                }
            }

            // Blend the top and bottom filters.
            inputDrawingContext.unlock(this);
            var blendController = controller.blend;
            blendController.glTexture = topContext.texture;
            filter = this.manager.getNode('FilterBlend');
            outputDrawingContext = this.manager.getNode('FilterBlend').run(
                controller.blend,
                bottomContext,
                outputDrawingContext,
                padding // This will be 0 because at least one filter has already been applied.
            );

            // Whether top context is new or the input, it now needs to be released.
            topContext.release();
        }
        else
        {
            // No filters to run.
            // Copy the input to the output.
            filter = this.manager.getNode('FilterBlend');
            var proxyController = {
                blendMode: BlendModes.COPY,
                glTexture: inputDrawingContext.texture,
                amount: 1,
                color: [ 1, 1, 1, 1 ]
            };
            inputDrawingContext.unlock(this);
            outputDrawingContext = filter.run(
                proxyController,
                inputDrawingContext,
                outputDrawingContext,
                initialPadding
            );
        }

        this.onRunEnd(outputDrawingContext);

        return outputDrawingContext;
    }
});

module.exports = FilterParallelFilters;
