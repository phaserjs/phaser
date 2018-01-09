var BitmapText = require('./BitmapText');
var BuildGameObject = require('../../BuildGameObject');
var GameObjectCreator = require('../../../scene/plugins/GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');
var GetValue = require('../../../utils/object/GetValue');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('bitmapText', function (config)
{
    var font = GetValue(config, 'font', '');
    var text = GetAdvancedValue(config, 'text', '');
    var size = GetAdvancedValue(config, 'size', false);
    // var align = GetValue(config, 'align', 'left');

    var bitmapText = new BitmapText(this.scene, 0, 0, font, text, size);

    BuildGameObject(this.scene, bitmapText, config);

    return bitmapText;
});
