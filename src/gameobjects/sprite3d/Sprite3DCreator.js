var BuildGameObject = require('../BuildGameObject');
var BuildGameObjectAnimation = require('../BuildGameObjectAnimation');
var GameObjectCreator = require('../../scene/plugins/GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Sprite3D = require('./Sprite3D');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('sprite3D', function (config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var sprite = new Sprite3D(this.scene, 0, 0, key, frame);

    BuildGameObject(this.scene, sprite, config);

    //  Sprite specific config options:

    BuildGameObjectAnimation(sprite, config);

    //  Physics, Input, etc to follow ...

    return sprite;
});
