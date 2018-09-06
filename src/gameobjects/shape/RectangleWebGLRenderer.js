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
 * @method Phaser.GameObjects.Rectangle#renderWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Rectangle} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var RectangleWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var pipeline = this.pipeline;

    var camMatrix = pipeline._tempMatrix1;
    var shapeMatrix = pipeline._tempMatrix2;

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
        // camMatrix.multiply(shapeMatrix);
    }
    else
    {
        shapeMatrix.e -= camera.scrollX * src.scrollFactorX;
        shapeMatrix.f -= camera.scrollY * src.scrollFactorY;

        //  Multiply by the Sprite matrix, store result in calcMatrix
        // camMatrix.multiply(shapeMatrix);
    }

    var alpha = camera.alpha * src.alpha;

    var fillTint = pipeline.fillTint;
    var fillTintColor = Utils.getTintAppendFloatAlphaAndSwap(src.fillColor, src.fillAlpha * alpha);

    fillTint.TL = fillTintColor;
    fillTint.TR = fillTintColor;
    fillTint.BL = fillTintColor;
    fillTint.BR = fillTintColor;

    var x = -src._displayOriginX;
    var y = -src._displayOriginY;

    pipeline.batchFillRect(
        x,
        y,
        src.width,
        src.height,
        shapeMatrix,
        camMatrix
    );
};

module.exports = RectangleWebGLRenderer;
