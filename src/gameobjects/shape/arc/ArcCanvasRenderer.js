/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var DegToRad = require('../../../math/DegToRad');
var FillStyleCanvas = require('../FillStyleCanvas');
var LineStyleCanvas = require('../LineStyleCanvas');
var SetTransform = require('../../../renderer/canvas/utils/SetTransform');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Arc#renderCanvas
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Arc} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ArcCanvasRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var ctx = renderer.currentContext;

    if (SetTransform(renderer, ctx, src, camera, parentMatrix))
    {
        var radius = src.radius;

        ctx.beginPath();

        ctx.arc(
            (radius) - src.originX * (radius * 2),
            (radius) - src.originY * (radius * 2),
            radius,
            DegToRad(src._startAngle),
            DegToRad(src._endAngle),
            src.anticlockwise
        );

        if (src.closePath)
        {
            ctx.closePath();
        }

        if (src.isFilled)
        {
            FillStyleCanvas(ctx, src);

            ctx.fill();
        }

        if (src.isStroked)
        {
            LineStyleCanvas(ctx, src);

            ctx.stroke();
        }

        //  Restore the context saved in SetTransform
        ctx.restore();
    }
};

module.exports = ArcCanvasRenderer;
