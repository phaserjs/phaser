var ParticleEmitterManager = require('./ParticleEmitterManager');
var GameObjectFactory = require('../GameObjectFactory');

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

GameObjectFactory.register('particles', function (key, frame, emitters)
{
    var manager = new ParticleEmitterManager(this.scene, key, frame, emitters);
    
    this.displayList.add(manager);
    this.updateList.add(manager);
    
    return manager;
});
