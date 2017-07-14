var BitmapText = require('./BitmapText');
var BuildGameObject = require('../../BuildGameObject');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');
var GetValue = require('../../../utils/object/GetValue');

var BitmapTextCreator = function (scene, config)
{
    var font = GetValue(config, 'font', '');
    var text = GetAdvancedValue(config, 'text', '');
    var size = GetAdvancedValue(config, 'size', false);
    // var align = GetValue(config, 'align', 'left');

    var bitmapText = new BitmapText(scene, 0, 0, font, text, size);

    BuildGameObject(scene, bitmapText, config);

    return bitmapText;
};

module.exports = BitmapTextCreator;
