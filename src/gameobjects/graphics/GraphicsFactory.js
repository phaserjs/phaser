var Graphics = require('./Graphics');
var GameObjectFactory = require('../GameObjectFactory');

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

GameObjectFactory.register('graphics', function (config)
{
    return this.displayList.add(new Graphics(this.scene, config));
});
