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
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var IsoTriangleWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    if (!src.isFilled)
    {
        return;
    }

    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var fillTriNode = src.customRenderNodes.FillTri || src.defaultRenderNodes.FillTri;
    var submitterNode = src.customRenderNodes.Submitter || src.defaultRenderNodes.Submitter;

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    var size = src.width;
    var height = src.height;

    var sizeA = size / 2;
    var sizeB = size / src.projection;

    var reversed = src.isReversed;

    var alpha = src.alpha;

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

        x0 = -sizeA;
        y0 = -height;

        x1 = 0;
        y1 = -sizeB - height;

        x2 = sizeA;
        y2 = -height;

        var x3 = 0;
        var y3 = sizeB - height;

        fillTriNode.run(drawingContext, calcMatrix, submitterNode, x0, y0, x1, y1, x2, y2, tint, tint, tint);
        fillTriNode.run(drawingContext, calcMatrix, submitterNode, x2, y2, x3, y3, x0, y0, tint, tint, tint);
    }

    //  Left Face

    if (src.showLeft)
    {
        tint = Utils.getTintAppendFloatAlpha(src.fillLeft, alpha);

        if (reversed)
        {
            x0 = -sizeA;
            y0 = -height;

            x1 = 0;
            y1 = sizeB;

            x2 = 0;
            y2 = sizeB - height;
        }
        else
        {
            x0 = -sizeA;
            y0 = 0;

            x1 = 0;
            y1 = sizeB;

            x2 = 0;
            y2 = sizeB - height;
        }

        fillTriNode.run(drawingContext, calcMatrix, submitterNode, x0, y0, x1, y1, x2, y2, tint, tint, tint);
    }

    //  Right Face

    if (src.showRight)
    {
        tint = Utils.getTintAppendFloatAlpha(src.fillRight, alpha);

        if (reversed)
        {
            x0 = sizeA;
            y0 = -height;

            x1 = 0;
            y1 = sizeB;

            x2 = 0;
            y2 = sizeB - height;
        }
        else
        {
            x0 = sizeA;
            y0 = 0;

            x1 = 0;
            y1 = sizeB;

            x2 = 0;
            y2 = sizeB - height;
        }

        fillTriNode.run(drawingContext, calcMatrix, submitterNode, x0, y0, x1, y1, x2, y2, tint, tint, tint);
    }
};

module.exports = IsoTriangleWebGLRenderer;
