var BitmapText = require('./DynamicBitmapText');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../../BuildGameObject');

var DynamicBitmapTextCreator = function (scene, config)
{
    var font = GetAdvancedValue(config, 'font', '');
    var text = GetAdvancedValue(config, 'text', '');
    var size = GetAdvancedValue(config, 'size', false);
    var align = GetAdvancedValue(config, 'align', 'left');

    var bitmapText = new BitmapText(scene, 0, 0, font, text, size, align);

    BuildGameObject(scene, bitmapText, config);

    return bitmapText;
};

module.exports = DynamicBitmapTextCreator;
