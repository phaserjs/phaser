/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
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
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var PointLightWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    camera.addToRenderList(src);

    var pipeline = renderer.pipelines.set(src.pipeline);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    var width = src.width;
    var height = src.height;

    var x = -src._radius;
    var y = -src._radius;

    var xw = x + width;
    var yh = y + height;

    var lightX = calcMatrix.getX(0, 0);
    var lightY = calcMatrix.getY(0, 0);

    var tx0 = calcMatrix.getX(x, y);
    var ty0 = calcMatrix.getY(x, y);

    var tx1 = calcMatrix.getX(x, yh);
    var ty1 = calcMatrix.getY(x, yh);

    var tx2 = calcMatrix.getX(xw, yh);
    var ty2 = calcMatrix.getY(xw, yh);

    var tx3 = calcMatrix.getX(xw, y);
    var ty3 = calcMatrix.getY(xw, y);

    renderer.pipelines.preBatch(src);

    pipeline.batchPointLight(src, camera, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, lightX, lightY);

    renderer.pipelines.postBatch(src);
};

module.exports = PointLightWebGLRenderer;
