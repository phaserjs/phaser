var BuildGameObject = require('../BuildGameObject');
var BuildGameObjectAnimation = require('../BuildGameObjectAnimation');
var GameObjectCreator = require('../../scene/plugins/GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Sprite = require('./Sprite');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('sprite', function (config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var sprite = new Sprite(this.scene, 0, 0, key, frame);

    BuildGameObject(this.scene, sprite, config);

    //  Sprite specific config options:

    BuildGameObjectAnimation(sprite, config);

    //  Physics, Input, etc to follow ...

    return sprite;
});
