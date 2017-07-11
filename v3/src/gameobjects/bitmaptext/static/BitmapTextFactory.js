var BitmapText = require('./BitmapText');

var BitmapTextFactory = function (state, x, y, font, text, size)
{
    return new BitmapText(state, x, y, font, text, size);
};

module.exports = BitmapTextFactory;
