/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../GameObject');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Blitter#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Blitter} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var BlitterCanvasRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    var list = src.getRenderList();

    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera.id)) || list.length === 0)
    {
        return;
    }

    var ctx = renderer.gameContext;

    //  Alpha

    var alpha = camera.alpha * src.alpha;

    if (alpha === 0)
    {
        //  Nothing to see, so abort early
        return;
    }
    else if (renderer.currentAlpha !== alpha)
    {
        renderer.currentAlpha = alpha;
        ctx.globalAlpha = alpha;
    }

    //  Blend Mode

    renderer.setBlendMode(src.blendMode);

    var cameraScrollX = src.x - camera.scrollX * src.scrollFactorX;
    var cameraScrollY = src.y - camera.scrollY * src.scrollFactorY;

    ctx.save();

    if (parentMatrix !== undefined)
    {
        var matrix = parentMatrix.matrix;
        ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    }

    //  Render bobs
    for (var i = 0; i < list.length; i++)
    {
        var bob = list[i];
        var flip = (bob.flipX || bob.flipY);
        var frame = bob.frame;
        var cd = frame.canvasData;
        var dx = frame.x;
        var dy = frame.y;
        var fx = 1;
        var fy = 1;

        var bobAlpha = bob.alpha * alpha;

        if (bobAlpha === 0)
        {
            continue;
        }
        else if (renderer.currentAlpha !== bobAlpha)
        {
            renderer.currentAlpha = bobAlpha;
            ctx.globalAlpha = bobAlpha;
        }
    
        if (!flip)
        {
            renderer.blitImage(dx + bob.x + cameraScrollX, dy + bob.y + cameraScrollY, bob.frame);
        }
        else
        {
            if (bob.flipX)
            {
                fx = -1;
                dx -= cd.dWidth;
            }

            if (bob.flipY)
            {
                fy = -1;
                dy -= cd.dHeight;
            }

            ctx.save();
            ctx.translate(bob.x + cameraScrollX, bob.y + cameraScrollY);
            ctx.scale(fx, fy);
            ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, dx, dy, cd.dWidth, cd.dHeight);
            ctx.restore();
        }
    }
    
    ctx.restore();
};

module.exports = BlitterCanvasRenderer;
