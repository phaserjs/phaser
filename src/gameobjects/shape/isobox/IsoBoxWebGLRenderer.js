/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Utils = require('../../../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.IsoBox#renderWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.IsoBox} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var IsoBoxWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var pipeline = this.pipeline;

    var camMatrix = pipeline._tempMatrix1;
    var shapeMatrix = pipeline._tempMatrix2;
    var calcMatrix = pipeline._tempMatrix3;

    renderer.setPipeline(pipeline);

    shapeMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    camMatrix.copyFrom(camera.matrix);

    if (parentMatrix)
    {
        //  Multiply the camera by the parent matrix
        camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);

        //  Undo the camera scroll
        shapeMatrix.e = src.x;
        shapeMatrix.f = src.y;
    }
    else
    {
        shapeMatrix.e -= camera.scrollX * src.scrollFactorX;
        shapeMatrix.f -= camera.scrollY * src.scrollFactorY;
    }

    camMatrix.multiply(shapeMatrix, calcMatrix);

    var size = src.width;
    var height = src.height;

    var alpha = camera.alpha * src.alpha;

    if (!src.isFilled)
    {
        return;
    }

    //  Top Face

    var tint = Utils.getTintAppendFloatAlphaAndSwap(src.fillTop, alpha);

    var x0 = calcMatrix.getX(-size / 2, -height);
    var y0 = calcMatrix.getY(-size / 2, -height);

    var x1 = calcMatrix.getX(0, -size / 4 - height);
    var y1 = calcMatrix.getY(0, -size / 4 - height);

    var x2 = calcMatrix.getX(size / 2, -height);
    var y2 = calcMatrix.getY(size / 2, -height);

    var x3 = calcMatrix.getX(0, size / 4 - height);
    var y3 = calcMatrix.getY(0, size / 4 - height);

    pipeline.batchQuad(x0, y0, x1, y1, x2, y2, x3, y3, 0, 0, 1, 1, tint, tint, tint, tint, 2);

    //  Left Face

    tint = Utils.getTintAppendFloatAlphaAndSwap(src.fillLeft, alpha);

    x0 = calcMatrix.getX(-size / 2, 0);
    y0 = calcMatrix.getY(-size / 2, 0);

    x1 = calcMatrix.getX(0, size / 4);
    y1 = calcMatrix.getY(0, size / 4);

    x2 = calcMatrix.getX(0, size / 4 - height);
    y2 = calcMatrix.getY(0, size / 4 - height);

    x3 = calcMatrix.getX(-size / 2, -height);
    y3 = calcMatrix.getY(-size / 2, -height);

    pipeline.batchQuad(x0, y0, x1, y1, x2, y2, x3, y3, 0, 0, 1, 1, tint, tint, tint, tint, 2);

    //  Right Face

    tint = Utils.getTintAppendFloatAlphaAndSwap(src.fillRight, alpha);

    x0 = calcMatrix.getX(size / 2, 0);
    y0 = calcMatrix.getY(size / 2, 0);

    x1 = calcMatrix.getX(0, size / 4);
    y1 = calcMatrix.getY(0, size / 4);

    x2 = calcMatrix.getX(0, size / 4 - height);
    y2 = calcMatrix.getY(0, size / 4 - height);

    x3 = calcMatrix.getX(size / 2, -height);
    y3 = calcMatrix.getY(size / 2, -height);

    pipeline.batchQuad(x0, y0, x1, y1, x2, y2, x3, y3, 0, 0, 1, 1, tint, tint, tint, tint, 2);
};

module.exports = IsoBoxWebGLRenderer;
