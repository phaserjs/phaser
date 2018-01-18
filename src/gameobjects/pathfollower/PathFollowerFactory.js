var PathFollower = require('./PathFollower');
var GameObjectFactory = require('../GameObjectFactory');

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

GameObjectFactory.register('follower', function (path, x, y, key, frame)
{
    var sprite = new PathFollower(this.scene, path, x, y, key, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
});
