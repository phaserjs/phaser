
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

    var dx = frame.x - (src.anchorX * frame.width) - camera.scrollX;
    var dy = frame.y - (src.anchorY * frame.height) - camera.scrollY;

    ctx.save();
    ctx.translate(src.x, src.y);
    ctx.rotate(src.rotation);
    ctx.scale(src.scaleX, src.scaleY);
    ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, dx, dy, cd.dWidth, cd.dHeight);
    ctx.restore();
};

module.exports = DrawImage;
