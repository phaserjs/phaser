var BitmapText = require('./DynamicBitmapText');

var DynamicBitmapTextFactory = function (scene, x, y, font, text, size, align)
{
    return new BitmapText(scene, x, y, font, text, size, align);
};

module.exports = DynamicBitmapTextFactory;
