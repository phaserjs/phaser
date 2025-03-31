/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../../GetCalcMatrix');
var Utils = require('../../../renderer/webgl/Utils');

var tempPath = [
    {
        x: 0, y: 0, width: 0
    },
    {
        x: 0, y: 0, width: 0
    }
];

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
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var LineWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    var dx = src._displayOriginX;
    var dy = src._displayOriginY;
    var alpha = src.alpha;

    if (src.isStroked)
    {
        var color = Utils.getTintAppendFloatAlpha(src.strokeColor, src.strokeAlpha * alpha);

        tempPath[0].x = src.geom.x1 - dx;
        tempPath[0].y = src.geom.y1 - dy;
        tempPath[0].width = src._startWidth;

        tempPath[1].x = src.geom.x2 - dx;
        tempPath[1].y = src.geom.y2 - dy;
        tempPath[1].width = src._endWidth;

        (src.customRenderNodes.StrokePath || src.defaultRenderNodes.StrokePath).run(
            drawingContext,
            src.customRenderNodes.Submitter || src.defaultRenderNodes.Submitter,
            tempPath,
            1,
            true,
            calcMatrix,
            color, color, color, color
        );
    }
};

module.exports = LineWebGLRenderer;
