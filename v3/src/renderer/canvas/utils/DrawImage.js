
var DrawImage = function (frame, blendMode, transform, anchorX, anchorY, alpha, tint, bg)
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
        // ctx[this.smoothProperty] = (source.scaleMode === ScaleModes.LINEAR);
    }

    var dx = frame.x - (anchorX * frame.width);
    var dy = frame.y - (anchorY * frame.height);
    var wt = transform.worldMatrix.matrix;

    ctx.setTransform(wt[0], wt[1], wt[2], wt[3], wt[4], wt[5]);

    ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, dx, dy, cd.dWidth, cd.dHeight);

};

module.exports = DrawImage;
