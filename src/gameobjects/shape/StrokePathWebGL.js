/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Utils = require('../../renderer/webgl/Utils');

/**
 * Renders a stroke outline around the given Shape.
 *
 * @method Phaser.GameObjects.Shape#StrokePathWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat} submitter - The Submitter node to use.
 * @param {Phaser.GameObjects.Components.TransformMatrix} matrix - The current transform matrix.
 * @param {Phaser.GameObjects.Shape} src - The Game Object shape being rendered in this call.
 * @param {number} alpha - The base alpha value.
 * @param {number} dx - The source displayOriginX.
 * @param {number} dy - The source displayOriginY.
 */
var StrokePathWebGL = function (drawingContext, submitter, matrix, src, alpha, dx, dy)
{
    var strokeTintColor = Utils.getTintAppendFloatAlpha(src.strokeColor, src.strokeAlpha * alpha);

    var path = src.pathData;
    var pathLength = path.length - 1;
    var lineWidth = src.lineWidth;
    var openPath = !src.closePath;

    var strokePath = src.customRenderNodes.StrokePath || src.defaultRenderNodes.StrokePath;

    var pointPath = [];

    // Don't add the last point to open paths.
    if (openPath)
    {
        pathLength -= 2;
    }

    for (var i = 0; i < pathLength; i += 2)
    {
        var x = path[i] - dx;
        var y = path[i + 1] - dy;
        if (i > 0)
        {
            if (x === path[i - 2] && y === path[i - 1])
            {
                // Duplicate point, skip it
                continue;
            }
        }
        pointPath.push({
            x: x,
            y: y,
            width: lineWidth
        });
    }

    strokePath.run(
        drawingContext,
        submitter,
        pointPath,
        lineWidth,
        openPath,
        matrix,
        strokeTintColor, strokeTintColor, strokeTintColor, strokeTintColor
    );
};

module.exports = StrokePathWebGL;
