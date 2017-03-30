var TextWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }
    
    if (src.dirty)
    {
        var w = src.canvas.width;
        var h = src.canvas.height;
        var resize = !(src.prevWidth < w || src.prevHeight < h);

        src.canvasTexture = renderer.uploadCanvasToGPU(src.canvas, src.canvasTexture, resize);
        src.prevWidth = w;
        src.prevHeight = h;
        src.dirty = false;
    }

    renderer.spriteBatch.addSpriteTexture(src, camera, src.canvasTexture, src.prevWidth, src.prevHeight);
};

module.exports = TextWebGLRenderer;
