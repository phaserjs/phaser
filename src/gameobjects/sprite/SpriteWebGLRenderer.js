/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Sprite#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Sprite} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var SpriteWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    drawingContext.camera.addToRenderList(src);

    var customRenderNodes = src.customRenderNodes;
    var defaultRenderNodes = src.defaultRenderNodes;

    (customRenderNodes.Submitter || defaultRenderNodes.Submitter).run(
        drawingContext,
        src,
        parentMatrix,
        0,
        customRenderNodes.Texturer || defaultRenderNodes.Texturer,
        customRenderNodes.Transformer || defaultRenderNodes.Transformer
    );
};

module.exports = SpriteWebGLRenderer;
