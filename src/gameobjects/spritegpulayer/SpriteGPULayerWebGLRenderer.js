/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.SpriteGPULayer#renderWebGL
 * @since 4.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Image} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
 */
var SpriteGPULayerWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    drawingContext.camera.addToRenderList(src);

    var customRenderNodes = src.customRenderNodes;
    var defaultRenderNodes = src.defaultRenderNodes;

    (customRenderNodes.Submitter || defaultRenderNodes.Submitter).run(
        drawingContext
    );
};

module.exports = SpriteGPULayerWebGLRenderer;
