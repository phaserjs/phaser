/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = require('../../../../geom/rectangle/Rectangle');
var Class = require('../../../../utils/Class');
var BaseFilter = require('./BaseFilter');

/**
 * @classdesc
 * This RenderNode renders the Blur filter effect.
 * See {@link Phaser.Filters.Blur}.
 *
 * This RenderNode redirects to other filters
 * based on the quality setting of the controller it is running.
 *
 * @class FilterBlur
 * @extends Phaser.Renderer.WebGL.RenderNodes.BaseFilter
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FilterBlur = new Class({
    Extends: BaseFilter,

    initialize: function FilterBlur (manager)
    {
        BaseFilter.call(this, 'FilterBlur', manager);
    },

    run: function (controller, inputDrawingContext, outputDrawingContext, padding)
    {
        this.onRunBegin(outputDrawingContext);

        var quality = controller.quality;
        var steps = controller.steps;
        var filter = null;

        switch (quality)
        {
            case 2:
            {
                filter = this.manager.getNode('FilterBlurHigh');
                break;
            }
            case 1:
            {
                filter = this.manager.getNode('FilterBlurMed');
                break;
            }
            case 0:
            default:
            {
                filter = this.manager.getNode('FilterBlurLow');
                break;
            }
        }

        var proxyController = {
            strength: controller.strength,
            color: controller.glcolor,
            x: controller.x,
            y: controller.y
        };

        if (!padding)
        {
            padding = controller.getPadding();
        }

        var currentContext = inputDrawingContext;

        for (var i = 0; i < steps; i++)
        {
            /*
            Render alternating horizontal and vertical passes.
            Gaussian blurs are axis-separable,
            so this creates the same effect as a single pass with more samples,
            but is faster.
            We have to break this down into steps at this level
            because GLSL doesn't support a variable number of loop iterations,
            so we can't pass the number of steps as a uniform.
            */

            // Horizontal pass
            proxyController.x = controller.x;
            proxyController.y = 0;
            currentContext = filter.run(proxyController, currentContext, null, padding);

            if (i === 0)
            {
                // Stop adding padding after the first pass.
                padding = new Rectangle();
            }

            // Vertical pass
            var output = (i === steps - 1) ? outputDrawingContext : null;
            proxyController.x = 0;
            proxyController.y = controller.y;
            currentContext = filter.run(proxyController, currentContext, output, padding);
        }

        outputDrawingContext = currentContext;

        this.onRunEnd(outputDrawingContext);

        return outputDrawingContext;
    }
});

module.exports = FilterBlur;
