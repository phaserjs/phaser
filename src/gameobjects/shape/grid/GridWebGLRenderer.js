/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

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
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var GridWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
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

    var fillTint;
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
        fillTint = pipeline.fillTint;
        fillTintColor = Utils.getTintAppendFloatAlphaAndSwap(src.fillColor, src.fillAlpha * alpha);
    
        fillTint.TL = fillTintColor;
        fillTint.TR = fillTintColor;
        fillTint.BL = fillTintColor;
        fillTint.BR = fillTintColor;

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

                pipeline.setTexture2D();

                pipeline.batchFillRect(
                    x * cellWidth,
                    y * cellHeight,
                    cw,
                    ch
                );
            }
        }
    }

    if (showAltCells && src.altFillAlpha > 0)
    {
        fillTint = pipeline.fillTint;
        fillTintColor = Utils.getTintAppendFloatAlphaAndSwap(src.altFillColor, src.altFillAlpha * alpha);
    
        fillTint.TL = fillTintColor;
        fillTint.TR = fillTintColor;
        fillTint.BL = fillTintColor;
        fillTint.BR = fillTintColor;

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

                pipeline.setTexture2D();

                pipeline.batchFillRect(
                    x * cellWidth,
                    y * cellHeight,
                    cw,
                    ch
                );
            }
        }
    }

    if (showOutline && src.outlineFillAlpha > 0)
    {
        var strokeTint = pipeline.strokeTint;
        var color = Utils.getTintAppendFloatAlphaAndSwap(src.outlineFillColor, src.outlineFillAlpha * alpha);

        strokeTint.TL = color;
        strokeTint.TR = color;
        strokeTint.BL = color;
        strokeTint.BR = color;

        for (x = 1; x < gridWidth; x++)
        {
            var x1 = x * cellWidth;

            pipeline.setTexture2D();

            pipeline.batchLine(x1, 0, x1, height, 1, 1, 1, 0, false);
        }

        for (y = 1; y < gridHeight; y++)
        {
            var y1 = y * cellHeight;

            pipeline.setTexture2D();

            pipeline.batchLine(0, y1, width, y1, 1, 1, 1, 0, false);
        }
    }
};

module.exports = GridWebGLRenderer;
