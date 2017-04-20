var RenderPassWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }
    renderer.spriteBatch.addSpriteTexture(src, camera, src.renderTexture, src.width, src.height);
};

module.exports = RenderPassWebGLRenderer;
 