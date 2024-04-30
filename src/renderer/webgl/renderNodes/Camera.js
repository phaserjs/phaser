/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CameraEvents = require('../../../cameras/2d/events');
var GetColor32 = require('../../../display/color/GetColor32');
var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @class Camera
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 */
var Camera = new Class({
    Extends: RenderNode,

    initialize: function Camera (manager, renderer)
    {
        RenderNode.call(this, 'Camera', manager, renderer);
    },

    /**
     * Renders the children through this camera.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.Camera#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.GameObjects.GameObject[]} children - The list of children to render.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - Current Camera.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - This transform matrix is defined if the game object is nested
     */
    run: function (drawingContext, children, camera, parentTransformMatrix)
    {
        var currentContext = drawingContext;

        var cx = camera.x;
        var cy = camera.y;
        var cw = camera.width;
        var ch = camera.height;

        // Generate a drawing context.
        // TODO: Handle FX stacks and framebuffer changeover.
        currentContext = drawingContext.getClone();

        // Set up camera clone.
        currentContext.setScissorBox(cx, cy, cw, ch);
        currentContext.setCamera(camera);

        // Enter drawing context.
        currentContext.use();

        var FillCamera = this.manager.nodes.FillCamera;

        // Draw camera background.
        if (camera.backgroundColor.alphaGL > 0)
        {
            var bg = camera.backgroundColor;
            var col = GetColor32(bg.red, bg.green, bg.blue, bg.alpha);
            FillCamera.run(currentContext, camera, col);
        }

        // Draw children.
        this.manager.nodes.ListCompositor.run(currentContext, children, parentTransformMatrix);

        // Draw camera post effects.

        var flashEffect = camera.flashEffect;
        if (flashEffect.postRenderWebGL())
        {
            col = GetColor32(flashEffect.red, flashEffect.green, flashEffect.blue, flashEffect.alpha * 255);
            FillCamera.run(currentContext, col);
        }
        
        var fadeEffect = camera.fadeEffect;
        if (fadeEffect.postRenderWebGL())
        {
            col = GetColor32(fadeEffect.red, fadeEffect.green, fadeEffect.blue, fadeEffect.alpha * 255);
            FillCamera.run(currentContext, col);
        }

        // Finish rendering.

        currentContext.release();

        camera.dirty = false;

        camera.emit(CameraEvents.POST_RENDER, camera);
    }
});

module.exports = Camera;
