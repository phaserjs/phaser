/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../../GetCalcMatrix');
var FillPathWebGL = require('../FillPathWebGL');
var StrokePathWebGL = require('../StrokePathWebGL');

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Arc#renderWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Arc} src - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ArcWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    var camera = drawingContext.camera;
    camera.addToRenderList(src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    var dx = src._displayOriginX;
    var dy = src._displayOriginY;

    var alpha = src.alpha;

    var submitter = src.customRenderNodes.Submitter || src.defaultRenderNodes.Submitter;

    if (src.isFilled)
    {
        FillPathWebGL(drawingContext, submitter, calcMatrix, src, alpha, dx, dy);
    }

    if (src.isStroked)
    {
        StrokePathWebGL(drawingContext, submitter, calcMatrix, src, alpha, dx, dy);
    }
};

module.exports = ArcWebGLRenderer;
