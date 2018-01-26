var GameObject = require('../GameObject');
var Utils = require('../../renderer/webgl/Utils');

var TileSpriteWebGLRenderer = function (renderer, tileSprite, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== tileSprite.renderFlags || (tileSprite.cameraFilter > 0 && (tileSprite.cameraFilter & camera._id)))
    {
        return;
    }

    tileSprite.updateTileTexture();

    var getTint = Utils.getTintAppendFloatAlpha;

    renderer.pipelines.TextureTintPipeline.batchTexture(
        tileSprite.tileTexture,
        tileSprite.frame.width,  tileSprite.frame.height,
        tileSprite.x, tileSprite.y,
        tileSprite.width, tileSprite.height,
        tileSprite.scaleX, tileSprite.scaleY,
        tileSprite.rotation,
        tileSprite.flipX, tileSprite.flipY,
        tileSprite.scrollFactorX, tileSprite.scrollFactorY,
        tileSprite.originX * tileSprite.width, tileSprite.originY * tileSprite.height,
        0, 0, tileSprite.width, tileSprite.height,
        getTint(tileSprite._tintTL, tileSprite._alphaTL), 
        getTint(tileSprite._tintTR, tileSprite._alphaTR), 
        getTint(tileSprite._tintBL, tileSprite._alphaBL), 
        getTint(tileSprite._tintBR, tileSprite._alphaBR),
        tileSprite.tilePositionX / tileSprite.frame.width, 
        tileSprite.tilePositionY / tileSprite.frame.height,
        camera
    );
};

module.exports = TileSpriteWebGLRenderer;
