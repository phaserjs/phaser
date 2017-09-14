var Tilemap = require('./Tilemap');
var GameObjectFactory = require('../../../scene/plugins/GameObjectFactory');

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

GameObjectFactory.register('tilemap', function (mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
{
    return this.displayList.add(new Tilemap(this.scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame));
});
