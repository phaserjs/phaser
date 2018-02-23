/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Renderer.Canvas.DrawImage
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} src - [description]
 * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
 */
var DrawImage = function (src, camera)
{
    var ctx = this.currentContext;
    var frame = src.frame;
    var cd = frame.canvasData;

    //  Blend Mode

    if (this.currentBlendMode !== src.blendMode)
    {
        this.currentBlendMode = src.blendMode;
        ctx.globalCompositeOperation = this.blendModes[src.blendMode];
    }

    //  Alpha

    if (this.currentAlpha !== src.alpha)
    {
        this.currentAlpha = src.alpha;
        ctx.globalAlpha = src.alpha;
    }

    //  Smoothing

    if (this.currentScaleMode !== src.scaleMode)
    {
        this.currentScaleMode = src.scaleMode;

        // ctx[this.smoothProperty] = (source.scaleMode === ScaleModes.LINEAR);
    }

    var dx = frame.x;
    var dy = frame.y;

    var fx = 1;
    var fy = 1;

    if (src.flipX)
    {
        fx = -1;
        dx -= cd.dWidth - src.displayOriginX;
    }
    else
    {
        dx -= src.displayOriginX;
    }

    if (src.flipY)
    {
        fy = -1;
        dy -= cd.dHeight - src.displayOriginY;
    }
    else
    {
        dy -= src.displayOriginY;
    }

    //  Perform Matrix ITRS

    ctx.save();

    ctx.translate(src.x - camera.scrollX * src.scrollFactorX, src.y - camera.scrollY * src.scrollFactorY);

    ctx.rotate(src.rotation);

    ctx.scale(src.scaleX, src.scaleY);
    ctx.scale(fx, fy);

    ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, dx, dy, cd.dWidth, cd.dHeight);

    ctx.restore();
};

module.exports = DrawImage;
