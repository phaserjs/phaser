var BitmapText = require('./BitmapText');

var BitmapTextFactory = function (scene, x, y, font, text, size)
{
    return new BitmapText(scene, x, y, font, text, size);
};

module.exports = BitmapTextFactory;
