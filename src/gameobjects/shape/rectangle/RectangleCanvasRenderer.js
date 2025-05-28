/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var FillStyleCanvas = require('../FillStyleCanvas');
var LineStyleCanvas = require('../LineStyleCanvas');
var SetTransform = require('../../../renderer/canvas/utils/SetTransform');

var DrawRoundedRect = function (ctx, x, y, width, height, tlRadius, trRadius, blRadius, brRadius)
{
    // Limit radius to half of the smaller dimension
    var maxRadius = Math.min(width / 2, height / 2);
    var tl = Math.min(tlRadius, maxRadius);
    var tr = Math.min(trRadius, maxRadius);
    var bl = Math.min(blRadius, maxRadius);
    var br = Math.min(brRadius, maxRadius);
    
    if (tl === 0 && tr === 0 && bl === 0 && br === 0)
    {
        // Fall back to normal rectangle if radius is 0
        ctx.rect(x, y, width, height);
        return;
    }

    if (tl === 0)
    {
        // Start at top-left
        ctx.moveTo(x, y);
    }
    else
    {
        // Start at top-left, after the corner
        ctx.moveTo(x + tl, y);
    }

    if (tr === 0)
    {
        // Top edge
        ctx.lineTo(x + width, y);
    }
    else
    {
        // Top edge and top-right corner
        ctx.lineTo(x + width - tr, y);
        ctx.arcTo(x + width, y, x + width, y + tr, tr);
    }

    if (br === 0)
    {
        // Right edge
        ctx.lineTo(x + width, y + height);
    }
    else
    {
        // Right edge and bottom-right corner
        ctx.lineTo(x + width, y + height - br);
        ctx.arcTo(x + width, y + height, x + width - br, y + height, br);
    }

    if (bl === 0)
    {
        // Bottom edge
        ctx.lineTo(x, y + height);
    }
    else
    {
        // Bottom edge and bottom-left corner
        ctx.lineTo(x + bl, y + height);
        ctx.arcTo(x, y + height, x, y + height - bl, bl);
    }

    if (tl === 0)
    {
        // Left edge
        ctx.lineTo(x, y);
    }
    else
    {
        // Left edge and top-left corner
        ctx.lineTo(x, y + tl);
        ctx.arcTo(x, y, x + tl, y, tl);
    }

    ctx.closePath();
};

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Rectangle#renderCanvas
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Rectangle} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var RectangleCanvasRenderer = function (renderer, src, camera, parentMatrix)
{
    camera.addToRenderList(src);

    var ctx = renderer.currentContext;

    if (SetTransform(renderer, ctx, src, camera, parentMatrix))
    {
        var dx = src._displayOriginX;
        var dy = src._displayOriginY;

        if (src.isFilled)
        {
            FillStyleCanvas(ctx, src);
            
            if (src.isRounded)
            {
                ctx.beginPath();
                DrawRoundedRect(
                    ctx,
                    -dx,
                    -dy,
                    src.width,
                    src.height,
                    src.radiusTopLeft,
                    src.radiusTopRight,
                    src.radiusBottomLeft,
                    src.radiusBottomRight
                );
                ctx.fill();
            }
            else
            {
                ctx.fillRect(
                    -dx,
                    -dy,
                    src.width,
                    src.height
                );
            }
        }
        
        if (src.isStroked)
        {
            LineStyleCanvas(ctx, src);
            
            ctx.beginPath();

            if (src.isRounded)
            {
                DrawRoundedRect(
                    ctx,
                    -dx,
                    -dy,
                    src.width,
                    src.height,
                    src.radiusTopLeft,
                    src.radiusTopRight,
                    src.radiusBottomLeft,
                    src.radiusBottomRight
                );
            }
            else
            {
                ctx.rect(
                    -dx,
                    -dy,
                    src.width,
                    src.height
                );
            }

            ctx.stroke();
        }

        //  Restore the context saved in SetTransform
        ctx.restore();
    }
};



module.exports = RectangleCanvasRenderer;
