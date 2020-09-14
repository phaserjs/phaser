/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var LineStyleCanvas = require('../LineStyleCanvas');
var SetTransform = require('../../../renderer/canvas/utils/SetTransform');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Line#renderCanvas
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Line} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var LineCanvasRenderer = function (renderer, src, camera, parentMatrix)
{
    var ctx = renderer.currentContext;

    if (SetTransform(renderer, ctx, src, camera, parentMatrix))
    {
        var dx = src._displayOriginX;
        var dy = src._displayOriginY;

        if (src.isStroked)
        {
            LineStyleCanvas(ctx, src);

            ctx.beginPath();

            ctx.moveTo(src.geom.x1 - dx, src.geom.y1 - dy);
            ctx.lineTo(src.geom.x2 - dx, src.geom.y2 - dy);

            ctx.stroke();
        }

        //  Restore the context saved in SetTransform
        ctx.restore();
    }
};

module.exports = LineCanvasRenderer;
