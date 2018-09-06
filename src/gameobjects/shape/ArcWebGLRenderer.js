/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Utils = require('../../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Arc#renderWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Arc} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ArcWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
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

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(shapeMatrix, calcMatrix);
    }
    else
    {
        shapeMatrix.e -= camera.scrollX * src.scrollFactorX;
        shapeMatrix.f -= camera.scrollY * src.scrollFactorY;

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(shapeMatrix, calcMatrix);
    }

    var fillTintColor = Utils.getTintAppendFloatAlphaAndSwap(src.fillColor, src.fillAlpha * (camera.alpha * src.alpha));

    var pathData = src.pathData;
    var pathIndexes = src.pathIndexes;

    for (var i = 0; i < pathIndexes.length; i += 3)
    {
        var p0 = pathIndexes[i] * 2;
        var p1 = pathIndexes[i + 1] * 2;
        var p2 = pathIndexes[i + 2] * 2;

        var x0 = pathData[p0 + 0];
        var y0 = pathData[p0 + 1];
        var x1 = pathData[p1 + 0];
        var y1 = pathData[p1 + 1];
        var x2 = pathData[p2 + 0];
        var y2 = pathData[p2 + 1];

        var tx0 = calcMatrix.getX(x0, y0);
        var ty0 = calcMatrix.getY(x0, y0);

        var tx1 = calcMatrix.getX(x1, y1);
        var ty1 = calcMatrix.getY(x1, y1);

        var tx2 = calcMatrix.getX(x2, y2);
        var ty2 = calcMatrix.getY(x2, y2);
    
        pipeline.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, 0, 0, 1, 1, fillTintColor, fillTintColor, fillTintColor, pipeline.tintEffect);
    }
};

module.exports = ArcWebGLRenderer;
