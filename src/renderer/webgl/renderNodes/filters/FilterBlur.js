/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = require('../../../../geom/rectangle/Rectangle');
var Class = require('../../../../utils/Class');
var BaseFilter = require('./BaseFilter');

/**
 * @classdesc
 * A RenderNode that applies a multi-pass Gaussian blur effect, driven by a
 * {@link Phaser.Filters.Blur} controller.
 *
 * Rather than running a blur shader directly, this node acts as a dispatcher:
 * it inspects the controller's `quality` setting and delegates to one of three
 * dedicated blur nodes — `FilterBlurLow` (quality 0), `FilterBlurMed`
 * (quality 1), or `FilterBlurHigh` (quality 2).
 *
 * For each step requested by the controller, the node performs two separated
 * passes — one horizontal and one vertical. Because Gaussian blurs are
 * axis-separable, this produces the same visual result as a single full 2D
 * Gaussian pass while being significantly cheaper to execute. Padding is
 * applied only on the first pass so that subsequent passes do not
 * progressively grow the render area.
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

    /**
     * Runs the Blur filter effect.
     *
     * The method selects the appropriate blur shader node based on
     * `controller.quality`, then executes `controller.steps` iterations of
     * axis-separated Gaussian blur. Each iteration consists of a horizontal
     * pass followed by a vertical pass. Padding from the controller is applied
     * on the first pass only; subsequent passes use an empty rectangle so the
     * render area does not grow with each iteration.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FilterBlur#run
     * @since 4.0.0
     * @param {Phaser.Filters.Blur} controller - The Blur filter controller, supplying quality, steps, strength, color, and axis blur amounts.
     * @param {Phaser.Renderer.WebGL.DrawingContext} inputDrawingContext - The drawing context containing the source texture to blur.
     * @param {Phaser.Renderer.WebGL.DrawingContext} outputDrawingContext - The drawing context to receive the final blurred output.
     * @param {Phaser.Geom.Rectangle} [padding] - Padding to apply around the render area on the first pass. If omitted, it is retrieved from the controller.
     * @return {Phaser.Renderer.WebGL.DrawingContext} The drawing context containing the blurred result.
     */
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
            padding = controller.getPaddingCeil();
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
