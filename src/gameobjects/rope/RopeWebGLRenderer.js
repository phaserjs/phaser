/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../GetCalcMatrix');

var renderOptions = {
    multiTexturing: false,
    smoothPixelArt: false
};

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Rope#renderWebGL
 * @since 3.23.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Rope} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var RopeWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    if (src.dirty)
    {
        src.updateVertices();
    }

    // Get smooth pixel art option.
    var smoothPixelArt;
    var srcTexture = src.texture;
    if (srcTexture && srcTexture.smoothPixelArt !== null)
    {
        smoothPixelArt = srcTexture.smoothPixelArt;
    }
    else
    {
        smoothPixelArt = src.scene.sys.game.config.smoothPixelArt;
    }
    renderOptions.smoothPixelArt = smoothPixelArt;

    (src.customRenderNodes.BatchHandler || src.defaultRenderNodes.BatchHandler).batchStrip(
        drawingContext,
        src,
        calcMatrix,
        src.texture.source[0].glTexture,
        src.vertices,
        src.uv,
        src.colors,
        src.alphas,
        src.alpha,
        src.tintFill,
        renderOptions,
        src.debugCallback
    );
};

module.exports = RopeWebGLRenderer;
