var BitmapText = require('./DynamicBitmapText');

var DynamicBitmapTextFactory = function (state, x, y, font, text, size, align)
{
    return new BitmapText(state, x, y, font, text, size, align);
};

module.exports = DynamicBitmapTextFactory;
