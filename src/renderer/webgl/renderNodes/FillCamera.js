/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
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
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 */
var FillCamera = new Class({
    Extends: RenderNode,

    initialize: function FillCamera (manager, renderer)
    {
        RenderNode.call(this, 'FillCamera', manager, renderer);
    },

    /**
     * Fills the camera with a color.
     * This uses `FillRect`, so it is batched with other quads.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FillCamera#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to fill.
     * @param {number} color - The color to fill the camera with.
     */
    run: function (drawingContext, camera, color)
    {
        var cx = camera.x;
        var cy = camera.y;
        var cw = camera.width;
        var ch = camera.height;

        this.manager.nodes.FillRect.run(drawingContext, camera, null, cx, cy, cw, ch, color, color, color, color, 2);
    }
});

module.exports = FillCamera;
