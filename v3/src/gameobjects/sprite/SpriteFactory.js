var Sprite = require('./Sprite');

var SpriteFactory = function (state, x, y, key, frame)
{
    return new Sprite(state, x, y, key, frame);
};

module.exports = SpriteFactory;
