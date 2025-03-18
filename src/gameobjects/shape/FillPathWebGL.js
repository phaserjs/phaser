/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Utils = require('../../renderer/webgl/Utils');

/**
 * Renders a filled path for the given Shape.
 *
 * @method Phaser.GameObjects.Shape#FillPathWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat} submitter - The Submitter node to use.
 * @param {Phaser.GameObjects.Components.TransformMatrix} calcMatrix - The transform matrix used to get the position values.
 * @param {Phaser.GameObjects.Shape} src - The Game Object shape being rendered in this call.
 * @param {number} alpha - The base alpha value.
 * @param {number} dx - The source displayOriginX.
 * @param {number} dy - The source displayOriginY.
 */
var FillPathWebGL = function (drawingContext, submitter, calcMatrix, src, alpha, dx, dy)
{
    // This is very similar to the FillPath RenderNode, but it already
    // has access to the Earcut indexes, so it doesn't need to calculate them.

    var fillTintColor = Utils.getTintAppendFloatAlpha(src.fillColor, src.fillAlpha * alpha);

    var path = src.pathData;
    var pathIndexes = src.pathIndexes;

    var length = path.length;
    var pathIndex, pointX, pointY, x, y;

    var vertices = Array(length * 2);
    var colors = Array(length);

    var verticesIndex = 0;
    var colorsIndex = 0;

    for (pathIndex = 0; pathIndex < length; pathIndex += 2)
    {
        pointX = path[pathIndex] - dx;
        pointY = path[pathIndex + 1] - dy;

        // Transform the point.
        x = calcMatrix.getX(pointX, pointY);
        y = calcMatrix.getY(pointX, pointY);

        vertices[verticesIndex++] = x;
        vertices[verticesIndex++] = y;
        colors[colorsIndex++] = fillTintColor;
    }

    submitter.batch(
        drawingContext,
        pathIndexes,
        vertices,
        colors
    );
};

module.exports = FillPathWebGL;
