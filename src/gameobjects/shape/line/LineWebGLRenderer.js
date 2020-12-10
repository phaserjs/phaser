/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCalcMatrix = require('../../GetCalcMatrix');
var Utils = require('../../../renderer/webgl/Utils');

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
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var LineWebGLRenderer = function (renderer, src, camera, parentMatrix)
{
    var pipeline = renderer.pipelines.set(src.pipeline);

    var result = GetCalcMatrix(src, camera, parentMatrix);

    pipeline.calcMatrix.copyFrom(result.calc);

    var dx = src._displayOriginX;
    var dy = src._displayOriginY;
    var alpha = camera.alpha * src.alpha;

    renderer.pipelines.preBatch(src);

    if (src.isStroked)
    {
        var strokeTint = pipeline.strokeTint;
        var color = Utils.getTintAppendFloatAlpha(src.strokeColor, src.strokeAlpha * alpha);

        strokeTint.TL = color;
        strokeTint.TR = color;
        strokeTint.BL = color;
        strokeTint.BR = color;

        var startWidth = src._startWidth;
        var endWidth = src._endWidth;

        pipeline.batchLine(
            src.geom.x1 - dx,
            src.geom.y1 - dy,
            src.geom.x2 - dx,
            src.geom.y2 - dy,
            startWidth,
            endWidth,
            1,
            0,
            false,
            result.sprite,
            result.camera
        );
    }

    renderer.pipelines.postBatch(src);
};

module.exports = LineWebGLRenderer;
