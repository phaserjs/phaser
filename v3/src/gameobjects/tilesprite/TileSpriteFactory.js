var TileSprite = require('./TileSprite');

var TileSpriteFactory = function (scene, x, y, width, height, key, frame)
{
    return new TileSprite(scene, x, y, width, height, key, frame);
};

module.exports = TileSpriteFactory;
