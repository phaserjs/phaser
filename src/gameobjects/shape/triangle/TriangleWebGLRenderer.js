/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../../GetCalcMatrix');
var StrokePathWebGL = require('../StrokePathWebGL');
var Utils = require('../../../renderer/webgl/Utils');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Triangle#renderWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Triangle} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var TriangleWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    var dx = src._displayOriginX;
    var dy = src._displayOriginY;
    var alpha = src.alpha;

    var customRenderNodes = src.customRenderNodes;
    var defaultRenderNodes = src.defaultRenderNodes;
    var submitter = customRenderNodes.Submitter || defaultRenderNodes.Submitter;

    if (src.isFilled)
    {
        var fillTintColor = Utils.getTintAppendFloatAlpha(src.fillColor, src.fillAlpha * alpha);

        var x1 = src.geom.x1 - dx;
        var y1 = src.geom.y1 - dy;
        var x2 = src.geom.x2 - dx;
        var y2 = src.geom.y2 - dy;
        var x3 = src.geom.x3 - dx;
        var y3 = src.geom.y3 - dy;

        (customRenderNodes.FillTri || defaultRenderNodes.FillTri).run(
            drawingContext,
            calcMatrix,
            submitter,
            x1,
            y1,
            x2,
            y2,
            x3,
            y3,
            fillTintColor,
            fillTintColor,
            fillTintColor
        );
    }

    if (src.isStroked)
    {
        StrokePathWebGL(drawingContext, submitter, calcMatrix, src, alpha, dx, dy);
    }
};

module.exports = TriangleWebGLRenderer;
