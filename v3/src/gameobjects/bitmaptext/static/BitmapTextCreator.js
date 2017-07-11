var BitmapText = require('./BitmapText');
var BuildGameObject = require('../../BuildGameObject');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');
var GetValue = require('../../../utils/object/GetValue');

var BitmapTextCreator = function (state, config)
{
    var font = GetValue(config, 'font', '');
    var text = GetAdvancedValue(config, 'text', '');
    var size = GetAdvancedValue(config, 'size', false);
    var align = GetValue(config, 'align', 'left');

    var bitmapText = new BitmapText(state, 0, 0, font, text, size);

    BuildGameObject(state, bitmapText, config);

    return bitmapText;
};

module.exports = BitmapTextCreator;
