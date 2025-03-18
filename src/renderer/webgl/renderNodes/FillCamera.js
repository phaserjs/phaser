/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which fills a camera with a color.
 *
 * @class FillCamera
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FillCamera = new Class({
    Extends: RenderNode,

    initialize: function FillCamera (manager)
    {
        RenderNode.call(this, 'FillCamera', manager);

        /**
         * The RenderNode that draws a filled rectangle.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillCamera#fillRectNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.FillRect}
         * @since 4.0.0
         */
        this.fillRectNode = this.manager.getNode('FillRect');
    },

    /**
     * Fills the camera with a color.
     * This uses `FillRect`, so it is batched with other quads.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FillCamera#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {number} color - The color to fill the camera with.
     * @param {boolean} [isFramebufferCamera] - Is this camera rendering to a framebuffer? If so, the camera position will not be applied, on the assumption that the camera position will be used to position the framebuffer in the external context.
     */
    run: function (drawingContext, color, isFramebufferCamera)
    {
        this.onRunBegin(drawingContext);

        var camera = drawingContext.camera;
        var cx = isFramebufferCamera ? 0 : camera.x;
        var cy = isFramebufferCamera ? 0 : camera.y;
        var cw = camera.width;
        var ch = camera.height;

        this.fillRectNode.run(drawingContext, null, null, cx, cy, cw, ch, color, color, color, color);

        this.onRunEnd(drawingContext);
    }
});

module.exports = FillCamera;
