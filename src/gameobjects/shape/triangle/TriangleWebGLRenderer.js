/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
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
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var TriangleWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    camera.addToRenderList(src);

    var pipeline = renderer.pipelines.set(src.pipeline);

    var result = GetCalcMatrix(src, camera, parentMatrix);

    pipeline.calcMatrix.copyFrom(result.calc);

    var dx = src._displayOriginX;
    var dy = src._displayOriginY;
    var alpha = camera.alpha * src.alpha;

    renderer.pipelines.preBatch(src);

    if (src.isFilled)
    {
        var fillTint = pipeline.fillTint;
        var fillTintColor = Utils.getTintAppendFloatAlpha(src.fillColor, src.fillAlpha * alpha);

        fillTint.TL = fillTintColor;
        fillTint.TR = fillTintColor;
        fillTint.BL = fillTintColor;
        fillTint.BR = fillTintColor;

        var x1 = src.geom.x1 - dx;
        var y1 = src.geom.y1 - dy;
        var x2 = src.geom.x2 - dx;
        var y2 = src.geom.y2 - dy;
        var x3 = src.geom.x3 - dx;
        var y3 = src.geom.y3 - dy;

        pipeline.batchFillTriangle(
            x1,
            y1,
            x2,
            y2,
            x3,
            y3,
            result.sprite,
            result.camera
        );
    }

    if (src.isStroked)
    {
        StrokePathWebGL(pipeline, src, alpha, dx, dy);
    }

    renderer.pipelines.postBatch(src);
};

module.exports = TriangleWebGLRenderer;
