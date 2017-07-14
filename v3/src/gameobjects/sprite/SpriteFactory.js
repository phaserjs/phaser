var Sprite = require('./Sprite');

var SpriteFactory = function (scene, x, y, key, frame)
{
    return new Sprite(scene, x, y, key, frame);
};

module.exports = SpriteFactory;
