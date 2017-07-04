var BitmapText = require('./BitmapText');

var BitmapTextFactory = function (state, x, y, font, text, size, align)
{
    return new BitmapText(state, x, y, font, text, size, align);
};

module.exports = BitmapTextFactory;
