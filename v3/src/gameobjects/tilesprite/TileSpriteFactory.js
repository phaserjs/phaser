var TileSprite = require('./TileSprite');

var TileSpriteFactory = function (state, x, y, width, height, key, frame)
{
    return new TileSprite(state, x, y, width, height, key, frame);
};

module.exports = TileSpriteFactory;
