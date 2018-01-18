var Text = require('./Text');
var GameObjectFactory = require('../../GameObjectFactory');

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

GameObjectFactory.register('text', function (x, y, text, style)
{
    return this.displayList.add(new Text(this.scene, x, y, text, style));
});
