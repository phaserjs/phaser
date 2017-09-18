var Sprite3D = require('./Sprite3D');
var GameObjectFactory = require('../../scene/plugins/GameObjectFactory');

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

GameObjectFactory.register('sprite3D', function (x, y, z, key, frame)
{
    var sprite = new Sprite3D(this.scene, x, y, z, key, frame);

    this.displayList.add(sprite.gameObject);
    this.updateList.add(sprite.gameObject);

    return sprite;
});
