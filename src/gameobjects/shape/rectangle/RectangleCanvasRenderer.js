/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var FillStyleCanvas = require('../FillStyleCanvas');
var LineStyleCanvas = require('../LineStyleCanvas');
var SetTransform = require('../../../renderer/canvas/utils/SetTransform');

var DrawRoundedRect = function (ctx, x, y, width, height, radius)
{
    // Limit radius to half of the smaller dimension
    var maxRadius = Math.min(width / 2, height / 2);
    var r = Math.min(radius, maxRadius);
    
    if (r === 0)
    {
        // Fall back to normal rectangle if radius is 0
        ctx.rect(x, y, width, height);
        return;
    }
    
    // Start at top-left, after the corner
    ctx.moveTo(x + r, y);
    
    // Top edge and top-right corner
    ctx.lineTo(x + width - r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r);
    
    // Right edge and bottom-right corner
    ctx.lineTo(x + width, y + height - r);
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
    
    // Bottom edge and bottom-left corner
    ctx.lineTo(x + r, y + height);
    ctx.arcTo(x, y + height, x, y + height - r, r);
    
    // Left edge and top-left corner
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    
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
                DrawRoundedRect(ctx, -dx, -dy, src.width, src.height, src.radius);
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
                DrawRoundedRect(ctx, -dx, -dy, src.width, src.height, src.radius);
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
