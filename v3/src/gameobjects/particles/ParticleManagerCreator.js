var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../../scene/plugins/GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var ParticleEmitterManager = require('./ParticleEmitterManager');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('particles', function (config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var emitters = GetAdvancedValue(config, 'emitters', null);

    var manager = new ParticleEmitterManager(this.scene, key, frame, emitters);

    BuildGameObject(this.scene, manager, config);

    return manager;
});
