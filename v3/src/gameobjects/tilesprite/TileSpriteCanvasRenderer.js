
var TileSpriteCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

    var ctx = renderer.currentContext;
    var frame = src.frame;

    //  Blend Mode

    if (renderer.currentBlendMode !== src.blendMode)
    {
        renderer.currentBlendMode = src.blendMode;
        ctx.globalCompositeOperation = renderer.blendModes[src.blendMode];
    }

    //  Alpha

    if (renderer.currentAlpha !== src.alpha)
    {
        renderer.currentAlpha = src.alpha;
        ctx.globalAlpha = src.alpha;
    }

    //  Smoothing

    if (renderer.currentScaleMode !== src.scaleMode)
    {
        renderer.currentScaleMode = src.scaleMode;
    }

    var dx = frame.x - (src.originX * src.width);
    var dy = frame.y - (src.originY * src.height);

    ctx.save();
    ctx.translate(dx, dy);
    ctx.translate(src.x - camera.scrollX, src.y - camera.scrollY);
    ctx.fillStyle = src.canvasPattern;
    ctx.translate(-this.tilePositionX, -this.tilePositionY);
    ctx.fillRect(this.tilePositionX, this.tilePositionY, src.width, src.height);
    ctx.restore();
};

module.exports = TileSpriteCanvasRenderer;
