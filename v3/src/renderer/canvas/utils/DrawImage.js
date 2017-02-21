
var DrawImage = function (frame, blendMode, transform, anchorX, anchorY, alpha, tint, bg, camera)
{
    var ctx = this.currentContext;
    var cd = frame.canvasData;

    //  Blend Mode

    if (this.currentBlendMode !== blendMode)
    {
        this.currentBlendMode = blendMode;
        ctx.globalCompositeOperation = this.blendModes[blendMode];
    }

    //  Alpha

    if (this.currentAlpha !== alpha)
    {
        this.currentAlpha = alpha;
        ctx.globalAlpha = alpha;
    }

    //  Smoothing (should this be a Game Object, or Frame / Texture level property?)

    if (this.currentScaleMode !== frame.source.scaleMode)
    {
        // this.currentScaleMode = source.scaleMode;
        // ctx[this.smoothProperty] = (source.scaleMode === ScaleModes.LINEAR);
    }

    var dx = frame.x - (anchorX * frame.width) - camera.scrollX;
    var dy = frame.y - (anchorY * frame.height) - camera.scrollY;

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.rotate(transform.angle);
    ctx.scale(transform.scaleX, transform.scaleY);
    ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, dx, dy, cd.dWidth, cd.dHeight);
    ctx.restore();
};

module.exports = DrawImage;
