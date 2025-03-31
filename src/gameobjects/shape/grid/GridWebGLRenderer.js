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

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    calcMatrix.translate(-src._displayOriginX, -src._displayOriginY);

    var alpha = src.alpha;

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

    var showCells = src.isFilled;
    var showAltCells = src.showAltCells;
    var showOutline = src.isStroked;

    var cellPadding = src.cellPadding;

    var lineWidth = src.lineWidth;
    var halfLineWidth = lineWidth / 2;

    var x = 0;
    var y = 0;
    var r = 0;
    var cw = 0;
    var ch = 0;

    if (cellPadding)
    {
        cellWidthA -= cellPadding * 2;
        cellHeightA -= cellPadding * 2;

        cellWidthB -= cellPadding * 2;
        cellHeightB -= cellPadding * 2;
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

                if (cw > 0 && ch > 0)
                {
                    fillRectNode.run(
                        drawingContext,
                        calcMatrix,
                        submitterNode,
                        x * cellWidth + cellPadding, y * cellHeight + cellPadding,
                        cw, ch,
                        fillTintColor, fillTintColor, fillTintColor, fillTintColor
                    );
                }
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

                if (cw > 0 && ch > 0)
                {
                    fillRectNode.run(
                        drawingContext,
                        calcMatrix,
                        submitterNode,
                        x * cellWidth + cellPadding, y * cellHeight + cellPadding,
                        cw, ch,
                        fillTintColor, fillTintColor, fillTintColor, fillTintColor
                    );
                }
            }
        }
    }

    if (showOutline && src.strokeAlpha > 0)
    {
        var color = Utils.getTintAppendFloatAlpha(src.strokeColor, src.strokeAlpha * alpha);

        var start = src.strokeOutside ? 0 : 1;

        for (x = start; x < gridWidth; x++)
        {
            var x1 = x * cellWidth - halfLineWidth;

            fillRectNode.run(
                drawingContext,
                calcMatrix,
                submitterNode,
                x1, 0,
                lineWidth, height,
                color, color, color, color
            );
        }

        for (y = start; y < gridHeight; y++)
        {
            var y1 = y * cellHeight - halfLineWidth;

            fillRectNode.run(
                drawingContext,
                calcMatrix,
                submitterNode,
                0, y1,
                width, lineWidth,
                color, color, color, color
            );
        }

        // Render remaining outer strokes.
        if (src.strokeOutside && src.strokeOutsideIncomplete)
        {
            if (width > halfLineWidth)
            {
                fillRectNode.run(
                    drawingContext,
                    calcMatrix,
                    submitterNode,
                    width - halfLineWidth, 0,
                    lineWidth, height,
                    color, color, color, color
                );
            }

            if (height > halfLineWidth)
            {
                fillRectNode.run(
                    drawingContext,
                    calcMatrix,
                    submitterNode,
                    0, height - halfLineWidth,
                    width, lineWidth,
                    color, color, color, color
                );
            }
        }
    }
};

module.exports = GridWebGLRenderer;
