/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Utils = require('../../../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Line#renderWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Line} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var LineWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
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
    }
    else
    {
        shapeMatrix.e -= camera.scrollX * src.scrollFactorX;
        shapeMatrix.f -= camera.scrollY * src.scrollFactorY;
    }

    var dx = src._displayOriginX;
    var dy = src._displayOriginY;
    var alpha = camera.alpha * src.alpha;

    if (src.isStroked)
    {
        var strokeTint = pipeline.strokeTint;
        var color = Utils.getTintAppendFloatAlphaAndSwap(src.strokeColor, src.strokeAlpha * alpha);

        strokeTint.TL = color;
        strokeTint.TR = color;
        strokeTint.BL = color;
        strokeTint.BR = color;

        var startWidth = src._startWidth;
        var endWidth = src._endWidth;

        pipeline.setTexture2D();

        pipeline.batchLine(
            src.geom.x1 - dx,
            src.geom.y1 - dy,
            src.geom.x2 - dx,
            src.geom.y2 - dy,
            startWidth,
            endWidth,
            1,
            0,
            false,
            shapeMatrix,
            camMatrix
        );
    }
};

module.exports = LineWebGLRenderer;
