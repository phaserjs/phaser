var BitmapText = require('./DynamicBitmapText');
var BuildGameObject = require('../../BuildGameObject');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('dynamicBitmapText', function (config)
{
    var font = GetAdvancedValue(config, 'font', '');
    var text = GetAdvancedValue(config, 'text', '');
    var size = GetAdvancedValue(config, 'size', false);
    var align = GetAdvancedValue(config, 'align', 'left');

    var bitmapText = new BitmapText(this.scene, 0, 0, font, text, size, align);

    BuildGameObject(this.scene, bitmapText, config);

    return bitmapText;
});
