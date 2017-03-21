var TextWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }
    
    if (src.dirty)
    {
        src.canvasTexture = renderer.uploadCanvasToGPU(
            src.canvas,
            src.canvasTexture,
            !(src.prevWidth < src.canvas.width || src.prevHeight < src.canvas.height)
        );
        src.prevWidth = src.canvas.width;
        src.prevHeight = src.canvas.height;
        src.dirty = false;
    }

    renderer.spriteBatch.addSpriteTexture(src, camera, src.canvasTexture, src.prevWidth, src.prevHeight);
};

module.exports = TextWebGLRenderer;
