var BitmapText = require('./BitmapText');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../../BuildGameObject');

var BitmapTextCreator = function (state, config)
{
    var font = GetAdvancedValue(config, 'font', '');
    var text = GetAdvancedValue(config, 'text', '');
    var size = GetAdvancedValue(config, 'size', false);
    var align = GetAdvancedValue(config, 'align', 'left');

    var bitmapText = new BitmapText(state, 0, 0, font, text, size, align);

    BuildGameObject(state, bitmapText, config);

    return bitmapText;
};

module.exports = BitmapTextCreator;
