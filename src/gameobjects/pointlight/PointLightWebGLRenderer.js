/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../GetCalcMatrix');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.PointLight#renderWebGL
 * @since 3.50.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.PointLight} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var PointLightWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    var width = src.width;
    var height = src.height;

    var x = -src._radius;
    var y = -src._radius;

    var xw = x + width;
    var yh = y + height;

    var lightX = calcMatrix.getX(0, 0);
    var lightY = calcMatrix.getY(0, 0);

    var txTL = calcMatrix.getX(x, y);
    var tyTL = calcMatrix.getY(x, y);

    var txBL = calcMatrix.getX(x, yh);
    var tyBL = calcMatrix.getY(x, yh);

    var txBR = calcMatrix.getX(xw, yh);
    var tyBR = calcMatrix.getY(xw, yh);

    var txTR = calcMatrix.getX(xw, y);
    var tyTR = calcMatrix.getY(xw, y);

    (src.customRenderNodes.BatchHandler || src.defaultRenderNodes.BatchHandler).batch(
        drawingContext,
        src,
        txTL, tyTL,
        txBL, tyBL,
        txTR, tyTR,
        txBR, tyBR,
        lightX, lightY
    );
};

module.exports = PointLightWebGLRenderer;
