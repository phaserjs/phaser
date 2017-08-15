var TileSpriteWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    src.updateTileTexture();

    renderer.tileBatch.addTileSprite(src, camera);
};

module.exports = TileSpriteWebGLRenderer;
