var SpriteWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }
    renderer.spriteBatch.addSprite(src, camera);
};

module.exports = SpriteWebGLRenderer;
