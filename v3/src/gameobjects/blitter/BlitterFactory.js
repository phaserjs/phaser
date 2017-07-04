var Blitter = require('./Blitter');

var BlitterFactory = function (state, x, y, key, frame)
{
    return new Blitter(state, x, y, key, frame);
};

module.exports = BlitterFactory;
