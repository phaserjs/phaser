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
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - [description]
 */
var DrawImage = function (src, camera, parentMatrix)
{
    var ctx = this.currentContext;
    var frame = src.frame;
    var cd = frame.canvasData;

    //  Alpha

    var alpha = camera.alpha * src.alpha;

    if (alpha === 0)
    {
        //  Nothing to see, so abort early
        return;
    }

    ctx.globalAlpha = alpha;

    //  Blend Mode

    if (this.currentBlendMode !== src.blendMode)
    {
        this.currentBlendMode = src.blendMode;
        ctx.globalCompositeOperation = this.blendModes[src.blendMode];
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
        dx -= cd.width - src.displayOriginX;
    }
    else
    {
        dx -= src.displayOriginX;
    }

    if (src.flipY)
    {
        fy = -1;
        dy -= cd.height - src.displayOriginY;
    }
    else
    {
        dy -= src.displayOriginY;
    }

    var tx = src.x - camera.scrollX * src.scrollFactorX;
    var ty = src.y - camera.scrollY * src.scrollFactorY;

    if (camera.roundPixels)
    {
        tx |= 0;
        ty |= 0;
        dx |= 0;
        dy |= 0;
    }

    //  Perform Matrix ITRS

    ctx.save();

    if (parentMatrix)
    {
        var matrix = parentMatrix.matrix;

        ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    }

    ctx.translate(tx, ty);

    ctx.rotate(src.rotation);

    ctx.scale(src.scaleX, src.scaleY);
    ctx.scale(fx, fy);

    if (src.isCropped)
    {
        var crop = src._crop;

        ctx.drawImage(frame.source.image, crop.cx, crop.cy, crop.width, crop.height, crop.x + dx, crop.y + dy, crop.width, crop.height);
    }
    else
    {
        ctx.drawImage(frame.source.image, cd.x, cd.y, cd.width, cd.height, dx, dy, cd.width, cd.height);
    }

    ctx.restore();
};

module.exports = DrawImage;
