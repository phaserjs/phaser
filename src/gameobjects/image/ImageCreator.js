var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../../scene/plugins/GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Image = require('./Image');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('image', function (config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var image = new Image(this.scene, 0, 0, key, frame);

    BuildGameObject(this.scene, image, config);

    return image;
});
