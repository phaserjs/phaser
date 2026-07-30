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
 * @method Phaser.GameObjects.Shader#renderWebGL
 * @since 3.17.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Shader} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ShaderWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    var camera = drawingContext.camera;

    camera.addToRenderList(src);

    if (src.renderToTexture)
    {
        drawingContext = src.drawingContext;

        if (drawingContext.width !== src.width || drawingContext.height !== src.height)
        {
            var width = src.width;
            var height = src.height;
            drawingContext.resize(width, height);
            drawingContext.camera.setSize(width, height);
        }

        drawingContext.use();
    }

    src.renderNode.run(drawingContext, src, parentMatrix);

    if (src.renderToTexture)
    {
        drawingContext.release();
    }
};

module.exports = ShaderWebGLRenderer;
