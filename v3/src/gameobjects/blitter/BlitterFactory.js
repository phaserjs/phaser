var Blitter = require('./Blitter');

var BlitterFactory = function (scene, x, y, key, frame)
{
    return new Blitter(scene, x, y, key, frame);
};

module.exports = BlitterFactory;
