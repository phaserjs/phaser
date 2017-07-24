var BitmapText = require('./DynamicBitmapText');

var DynamicBitmapTextFactory = function (scene, x, y, font, text, size)
{
    return new BitmapText(scene, x, y, font, text, size);
};

module.exports = DynamicBitmapTextFactory;
