var GameObject = require('../GameObject');

var TileSpriteWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    src.updateTileTexture();

    renderer.tileBatch.addTileSprite(src, camera);
};

module.exports = TileSpriteWebGLRenderer;
