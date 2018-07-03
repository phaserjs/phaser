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
 * @method Phaser.GameObjects.RenderTexture#renderCanvas
 * @since 3.2.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.RenderTexture} renderTexture - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var RenderTextureCanvasRenderer = function (renderer, renderTexture, interpolationPercentage, camera, parentMatrix)
{
    if (GameObject.RENDER_MASK !== renderTexture.renderFlags || (renderTexture.cameraFilter > 0 && (renderTexture.cameraFilter & camera._id)))
    {
        return;
    }

    var ctx = renderer.currentContext;

    //  Alpha

    var alpha = camera.alpha * renderTexture.alpha;

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

    if (renderer.currentBlendMode !== renderTexture.blendMode)
    {
        renderer.currentBlendMode = renderTexture.blendMode;
        ctx.globalCompositeOperation = renderer.blendModes[renderTexture.blendMode];
    }

    //  Scale Mode

    if (renderer.currentScaleMode !== renderTexture.scaleMode)
    {
        renderer.currentScaleMode = renderTexture.scaleMode;
    }

    var dx = 0;
    var dy = 0;

    var fx = 1;
    var fy = 1;

    if (renderTexture.flipX)
    {
        fx = -1;
        dx -= renderTexture.canvas.width - renderTexture.displayOriginX;
    }
    else
    {
        dx -= renderTexture.displayOriginX;
    }

    if (renderTexture.flipY)
    {
        fy = -1;
        dy -= renderTexture.canvas.height - renderTexture.displayOriginY;
    }
    else
    {
        dy -= renderTexture.displayOriginY;
    }

    ctx.save();

    if (parentMatrix !== undefined)
    {
        var matrix = parentMatrix.matrix;

        ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    }

    ctx.translate(renderTexture.x - camera.scrollX * renderTexture.scrollFactorX, renderTexture.y - camera.scrollY * renderTexture.scrollFactorY);
    ctx.rotate(renderTexture.rotation);
    ctx.scale(renderTexture.scaleX, renderTexture.scaleY);
    ctx.scale(fx, fy);
    ctx.drawImage(renderTexture.canvas, dx, dy);
    ctx.restore();
};

module.exports = RenderTextureCanvasRenderer;
