/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../../GetCalcMatrix');
var Utils = require('../../../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Grid#renderWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Grid} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var GridWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var fillRectNode = src.customRenderNodes.FillRect || src.defaultRenderNodes.FillRect;
    var submitterNode = src.customRenderNodes.Submitter || src.defaultRenderNodes.Submitter;

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;

    calcMatrix.translate(-src._displayOriginX, -src._displayOriginY);

    var alpha = camera.alpha * src.alpha;

    //  Work out the grid size

    var width = src.width;
    var height = src.height;

    var cellWidth = src.cellWidth;
    var cellHeight = src.cellHeight;

    var gridWidth = Math.ceil(width / cellWidth);
    var gridHeight = Math.ceil(height / cellHeight);

    var cellWidthA = cellWidth;
    var cellHeightA = cellHeight;

    var cellWidthB = cellWidth - ((gridWidth * cellWidth) - width);
    var cellHeightB = cellHeight - ((gridHeight * cellHeight) - height);

    var fillTintColor;

    var showCells = src.showCells;
    var showAltCells = src.showAltCells;
    var showOutline = src.showOutline;

    var x = 0;
    var y = 0;
    var r = 0;
    var cw = 0;
    var ch = 0;

    if (showOutline)
    {
        //  To make room for the grid lines (in case alpha < 1)
        cellWidthA--;
        cellHeightA--;

        if (cellWidthB === cellWidth)
        {
            cellWidthB--;
        }

        if (cellHeightB === cellHeight)
        {
            cellHeightB--;
        }
    }

    if (showCells && src.fillAlpha > 0)
    {
        fillTintColor = Utils.getTintAppendFloatAlpha(src.fillColor, src.fillAlpha * alpha);

        for (y = 0; y < gridHeight; y++)
        {
            if (showAltCells)
            {
                r = y % 2;
            }

            for (x = 0; x < gridWidth; x++)
            {
                if (showAltCells && r)
                {
                    r = 0;
                    continue;
                }

                r++;

                cw = (x < gridWidth - 1) ? cellWidthA : cellWidthB;
                ch = (y < gridHeight - 1) ? cellHeightA : cellHeightB;

                fillRectNode.run(
                    drawingContext,
                    calcMatrix,
                    submitterNode,
                    x * cellWidth, y * cellHeight,
                    cw, ch,
                    fillTintColor, fillTintColor, fillTintColor, fillTintColor
                );
            }
        }
    }

    if (showAltCells && src.altFillAlpha > 0)
    {
        fillTintColor = Utils.getTintAppendFloatAlpha(src.altFillColor, src.altFillAlpha * alpha);

        for (y = 0; y < gridHeight; y++)
        {
            if (showAltCells)
            {
                r = y % 2;
            }

            for (x = 0; x < gridWidth; x++)
            {
                if (showAltCells && !r)
                {
                    r = 1;
                    continue;
                }

                r = 0;

                cw = (x < gridWidth - 1) ? cellWidthA : cellWidthB;
                ch = (y < gridHeight - 1) ? cellHeightA : cellHeightB;

                fillRectNode.run(
                    drawingContext,
                    calcMatrix,
                    submitterNode,
                    x * cellWidth, y * cellHeight,
                    cw, ch,
                    fillTintColor, fillTintColor, fillTintColor, fillTintColor
                );
            }
        }
    }

    if (showOutline && src.outlineFillAlpha > 0)
    {
        var color = Utils.getTintAppendFloatAlpha(src.outlineFillColor, src.outlineFillAlpha * alpha);

        for (x = 1; x < gridWidth; x++)
        {
            var x1 = x * cellWidth - 1;

            fillRectNode.run(
                drawingContext,
                calcMatrix,
                submitterNode,
                x1, 0,
                2, height,
                color, color, color, color
            );
        }

        for (y = 1; y < gridHeight; y++)
        {
            var y1 = y * cellHeight - 1;

            fillRectNode.run(
                drawingContext,
                calcMatrix,
                submitterNode,
                0, y1,
                width, 2,
                color, color, color, color
            );
        }
    }
};

module.exports = GridWebGLRenderer;
