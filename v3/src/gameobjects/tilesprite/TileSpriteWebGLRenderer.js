var TileSpriteWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }
    src.updateTileTexture();
    renderer.tileBatch.addTileSprite(src, camera);
};

module.exports = TileSpriteWebGLRenderer;
