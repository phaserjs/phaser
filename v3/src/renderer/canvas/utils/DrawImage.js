
var DrawImage = function (frame, blendMode, transform, alpha, tint, bg)
{
    var ctx = this.context;
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
        // ctx[this.smoothProperty] = (source.scaleMode === Phaser.scaleModes.LINEAR);
    }

    ctx.setTransform(transform.a, transform.b, transform.c, transform.d, transform.tx, transform.ty);
    ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, transform.dx, transform.dy, cd.dWidth, cd.dHeight);

};

module.exports = DrawImage;
