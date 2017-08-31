
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

    var dx = frame.x - src.displayOriginX;
    var dy = frame.y - src.displayOriginY;

    ctx.save();
    ctx.translate(src.x - camera.scrollX * src.scrollFactorX, src.y - camera.scrollY * src.scrollFactorY);
    ctx.rotate(src.rotation);
    ctx.scale(src.scaleX, src.scaleY);
    ctx.scale(src.flipX ? -1 : 1, src.flipY ? -1 : 1);

    //  There is no such property as src.dWidth or src.dHeight, so this call has no effect:
    // ctx.translate(src.dWidth * (src.flipX ? 1 : 0), src.dHeight * (src.flipY ? 1 : 0));

    // dx -= (src.flipX && src.originX !== 0.5) ? cd.dWidth - (src.originX * cd.dWidth) : 0;
    // dy -= (src.flipY && src.originY !== 0.5) ? cd.dHeight - (src.originY * cd.dHeight) : 0;

    ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, dx, dy, cd.dWidth, cd.dHeight);
    ctx.restore();
};

module.exports = DrawImage;
