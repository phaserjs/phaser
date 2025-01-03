/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../../GetCalcMatrix');
var Utils = require('../../../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.IsoTriangle#renderWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.IsoTriangle} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var IsoTriangleWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    camera.addToRenderList(src);

    var pipeline = renderer.pipelines.set(src.pipeline);

    var result = GetCalcMatrix(src, camera, parentMatrix);

    var calcMatrix = pipeline.calcMatrix.copyFrom(result.calc);

    var size = src.width;
    var height = src.height;

    var sizeA = size / 2;
    var sizeB = size / src.projection;

    var reversed = src.isReversed;

    var alpha = camera.alpha * src.alpha;

    if (!src.isFilled)
    {
        return;
    }

    renderer.pipelines.preBatch(src);

    var tint;

    var x0;
    var y0;

    var x1;
    var y1;

    var x2;
    var y2;

    //  Top Face

    if (src.showTop && reversed)
    {
        tint = Utils.getTintAppendFloatAlpha(src.fillTop, alpha);

        x0 = calcMatrix.getX(-sizeA, -height);
        y0 = calcMatrix.getY(-sizeA, -height);

        x1 = calcMatrix.getX(0, -sizeB - height);
        y1 = calcMatrix.getY(0, -sizeB - height);

        x2 = calcMatrix.getX(sizeA, -height);
        y2 = calcMatrix.getY(sizeA, -height);

        var x3 = calcMatrix.getX(0, sizeB - height);
        var y3 = calcMatrix.getY(0, sizeB - height);

        pipeline.batchQuad(src, x0, y0, x1, y1, x2, y2, x3, y3, 0, 0, 1, 1, tint, tint, tint, tint, 2);
    }

    //  Left Face

    if (src.showLeft)
    {
        tint = Utils.getTintAppendFloatAlpha(src.fillLeft, alpha);

        if (reversed)
        {
            x0 = calcMatrix.getX(-sizeA, -height);
            y0 = calcMatrix.getY(-sizeA, -height);

            x1 = calcMatrix.getX(0, sizeB);
            y1 = calcMatrix.getY(0, sizeB);

            x2 = calcMatrix.getX(0, sizeB - height);
            y2 = calcMatrix.getY(0, sizeB - height);
        }
        else
        {
            x0 = calcMatrix.getX(-sizeA, 0);
            y0 = calcMatrix.getY(-sizeA, 0);

            x1 = calcMatrix.getX(0, sizeB);
            y1 = calcMatrix.getY(0, sizeB);

            x2 = calcMatrix.getX(0, sizeB - height);
            y2 = calcMatrix.getY(0, sizeB - height);
        }

        pipeline.batchTri(src, x0, y0, x1, y1, x2, y2, 0, 0, 1, 1, tint, tint, tint, 2);
    }

    //  Right Face

    if (src.showRight)
    {
        tint = Utils.getTintAppendFloatAlpha(src.fillRight, alpha);

        if (reversed)
        {
            x0 = calcMatrix.getX(sizeA, -height);
            y0 = calcMatrix.getY(sizeA, -height);

            x1 = calcMatrix.getX(0, sizeB);
            y1 = calcMatrix.getY(0, sizeB);

            x2 = calcMatrix.getX(0, sizeB - height);
            y2 = calcMatrix.getY(0, sizeB - height);
        }
        else
        {
            x0 = calcMatrix.getX(sizeA, 0);
            y0 = calcMatrix.getY(sizeA, 0);

            x1 = calcMatrix.getX(0, sizeB);
            y1 = calcMatrix.getY(0, sizeB);

            x2 = calcMatrix.getX(0, sizeB - height);
            y2 = calcMatrix.getY(0, sizeB - height);
        }

        pipeline.batchTri(src, x0, y0, x1, y1, x2, y2, 0, 0, 1, 1, tint, tint, tint, 2);
    }

    renderer.pipelines.postBatch(src);
};

module.exports = IsoTriangleWebGLRenderer;
