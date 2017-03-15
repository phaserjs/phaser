var TextCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }
    
    var ctx = renderer.currentContext;

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

    var dx = src.x - src.displayOriginX - camera.scrollX;
    var dy = src.y - src.displayOriginY - camera.scrollY;

    var canvas = src.canvas;

    ctx.save();
    ctx.translate(src.x, src.y);
    ctx.rotate(src.rotation);
    ctx.scale(src.scaleX, src.scaleY);

    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, dx, dy, canvas.width, canvas.height);

    ctx.restore();
};

module.exports = TextCanvasRenderer;
