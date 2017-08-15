var SpriteWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    renderer.spriteBatch.addSprite(src, camera);
};

module.exports = SpriteWebGLRenderer;
