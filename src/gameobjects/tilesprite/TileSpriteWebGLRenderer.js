var GameObject = require('../GameObject');
var Utils = require('../../renderer/webgl/Utils');

var TileSpriteWebGLRenderer = function (renderer, tileSprite, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== tileSprite.renderFlags || (tileSprite.cameraFilter > 0 && (tileSprite.cameraFilter & camera._id)))
    {
        return;
    }

    tileSprite.updateTileTexture();
    this.pipeline.batchTileSprite(this, camera);
};

module.exports = TileSpriteWebGLRenderer;
