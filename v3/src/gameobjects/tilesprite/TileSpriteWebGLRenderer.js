var TileSpriteWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }
    renderer.tileBatch.addTileSprite(src, camera);
};

module.exports = TileSpriteWebGLRenderer;
