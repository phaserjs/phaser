var StaticTilemap = require('./StaticTilemap');
var GameObjectFactory = require('../../../scene/plugins/GameObjectFactory');

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

GameObjectFactory.register('staticTilemap', function (mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame)
{
    return this.displayList.add(new StaticTilemap(this.scene, mapData, x, y, tileWidth, tileHeight, mapWidth, mapHeight, tileBorder, texture, frame));
});
