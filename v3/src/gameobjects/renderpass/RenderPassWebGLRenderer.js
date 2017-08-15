var RenderPassWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    renderer.spriteBatch.addSpriteTexture(src, camera, src.renderTexture, src.width, src.height);
};

module.exports = RenderPassWebGLRenderer;
