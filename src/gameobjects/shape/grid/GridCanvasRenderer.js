/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var FillStyleCanvas = require('../FillStyleCanvas');
var LineStyleCanvas = require('../LineStyleCanvas');
var SetTransform = require('../../../renderer/canvas/utils/SetTransform');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Grid#renderCanvas
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Grid} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var GridCanvasRenderer = function (renderer, src, camera, parentMatrix)
{
    camera.addToRenderList(src);

    var ctx = renderer.currentContext;

    if (SetTransform(renderer, ctx, src, camera, parentMatrix))
    {
        var dx = -src._displayOriginX;
        var dy = -src._displayOriginY;

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
            FillStyleCanvas(ctx, src);

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
                        ctx.fillRect(
                            dx + x * cellWidth + cellPadding,
                            dy + y * cellHeight + cellPadding,
                            cw,
                            ch
                        );
                    }
                }
            }
        }

        if (showAltCells && src.altFillAlpha > 0)
        {
            FillStyleCanvas(ctx, src, src.altFillColor, src.altFillAlpha * alpha);

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
                        ctx.fillRect(
                            dx + x * cellWidth + cellPadding,
                            dy + y * cellHeight + cellPadding,
                            cw,
                            ch
                        );
                    }
                }
            }
        }

        if (showOutline && src.strokeAlpha > 0)
        {
            LineStyleCanvas(ctx, src, src.strokeColor, src.strokeAlpha * alpha);

            var start = src.strokeOutside ? 0 : 1;

            for (x = start; x < gridWidth; x++)
            {
                var x1 = x * cellWidth;

                ctx.beginPath();

                ctx.moveTo(x1 + dx, dy);
                ctx.lineTo(x1 + dx, height + dy);

                ctx.stroke();
            }

            for (y = start; y < gridHeight; y++)
            {
                var y1 = y * cellHeight;

                ctx.beginPath();

                ctx.moveTo(dx, y1 + dy);
                ctx.lineTo(dx + width, y1 + dy);

                ctx.stroke();
            }

            // Render remaining outer strokes.
            if (src.strokeOutside)
            {
                if (width > halfLineWidth)
                {
                    ctx.beginPath();

                    ctx.moveTo(width + dx, dy);
                    ctx.lineTo(width + dx, height + dy);

                    ctx.stroke();
                }

                if (height > halfLineWidth)
                {
                    ctx.beginPath();

                    ctx.moveTo(dx, height + dy);
                    ctx.lineTo(width + dx, height + dy);

                    ctx.stroke();
                }
            }
        }

        //  Restore the context saved in SetTransform
        ctx.restore();
    }
};

module.exports = GridCanvasRenderer;
