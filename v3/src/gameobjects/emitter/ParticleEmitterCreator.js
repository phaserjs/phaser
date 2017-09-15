var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../../scene/plugins/GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var ParticleEmitter = require('./ParticleEmitter');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('emitter', function (config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var emitter = new ParticleEmitter(this.scene, 0, 0, key, frame);

    BuildGameObject(this.scene, emitter, config);

    return emitter;
});
