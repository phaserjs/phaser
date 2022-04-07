/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var FillStyleCanvas = require('../FillStyleCanvas');
var SetTransform = require('../../../renderer/canvas/utils/SetTransform');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.IsoTriangle#renderCanvas
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.IsoTriangle} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var IsoTriangleCanvasRenderer = function (renderer, src, camera, parentMatrix)
{
    camera.addToRenderList(src);

    var ctx = renderer.currentContext;

    if (SetTransform(renderer, ctx, src, camera, parentMatrix) && src.isFilled)
    {
        var size = src.width;
        var height = src.height;

        var sizeA = size / 2;
        var sizeB = size / src.projection;

        var reversed = src.isReversed;

        //  Top Face

        if (src.showTop && reversed)
        {
            FillStyleCanvas(ctx, src, src.fillTop);

            ctx.beginPath();

            ctx.moveTo(-sizeA, -height);
            ctx.lineTo(0, -sizeB - height);
            ctx.lineTo(sizeA, -height);
            ctx.lineTo(0, sizeB - height);

            ctx.fill();
        }

        //  Left Face

        if (src.showLeft)
        {
            FillStyleCanvas(ctx, src, src.fillLeft);

            ctx.beginPath();

            if (reversed)
            {
                ctx.moveTo(-sizeA, -height);
                ctx.lineTo(0, sizeB);
                ctx.lineTo(0, sizeB - height);
            }
            else
            {
                ctx.moveTo(-sizeA, 0);
                ctx.lineTo(0, sizeB);
                ctx.lineTo(0, sizeB - height);
            }

            ctx.fill();
        }

        //  Right Face

        if (src.showRight)
        {
            FillStyleCanvas(ctx, src, src.fillRight);

            ctx.beginPath();

            if (reversed)
            {
                ctx.moveTo(sizeA, -height);
                ctx.lineTo(0, sizeB);
                ctx.lineTo(0, sizeB - height);
            }
            else
            {
                ctx.moveTo(sizeA, 0);
                ctx.lineTo(0, sizeB);
                ctx.lineTo(0, sizeB - height);
            }

            ctx.fill();
        }

        //  Restore the context saved in SetTransform
        ctx.restore();
    }
};

module.exports = IsoTriangleCanvasRenderer;
