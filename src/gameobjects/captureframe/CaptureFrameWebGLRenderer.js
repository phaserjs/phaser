/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var _warned = false;

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.CaptureFrame#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.CaptureFrame} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 */
var CaptureFrameWebGLRenderer = function (renderer, src, drawingContext)
{
    if (drawingContext.useCanvas)
    {
        // We can't derive a texture from the canvas.

        if (!_warned)
        {
            _warned = true;
            console.warn('CaptureFrame: Cannot capture from main canvas. Activate `forceComposite` on the camera to use this feature. This warning will now mute.');
        }

        return;
    }

    drawingContext.camera.addToRenderList(src);

    var width = drawingContext.width;
    var height = drawingContext.height;

    var customRenderNodes = src.customRenderNodes;
    var defaultRenderNodes = src.defaultRenderNodes;

    // Ensure capture drawing context is the same size as the current drawing context.
    src.drawingContext.resize(width, height);

    src.drawingContext.use();

    // Draw current FBO to capture frame.
    (customRenderNodes.BatchHandler || defaultRenderNodes.BatchHandler).batch(
        src.drawingContext,

        // Texture.
        drawingContext.texture,

        // Transformed quad in order TL, BL, TR, BR.
        0, height,
        0, 0,
        width, height,
        width, 0,

        // Texture coordinates in X, Y, Width, Height.
        0, 0,
        1, 1,

        // Tint color:
        false,

        // Tint colors in order TL, BL, TR, BR.
        0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff,

        // Render options:
        {}
    );

    src.drawingContext.release();
};

module.exports = CaptureFrameWebGLRenderer;
