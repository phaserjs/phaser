var GameObjectCreator = require('../GameObjectCreator');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var ParticleEmitterManager = require('./ParticleEmitterManager');

//  When registering a factory function 'this' refers to the GameObjectCreator context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

GameObjectCreator.register('particles', function (config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var emitters = GetFastValue(config, 'emitters', null);

    //  frame is optional and can contain the emitters array or object if skipped
    var manager = new ParticleEmitterManager(this.scene, key, frame, emitters);

    var add = GetFastValue(config, 'add', false);

    if (add)
    {
        this.displayList.add(manager);
    }

    this.updateList.add(manager);

    return manager;
});
