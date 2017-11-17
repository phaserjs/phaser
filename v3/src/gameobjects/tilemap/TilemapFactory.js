var GameObjectFactory = require('../../scene/plugins/GameObjectFactory');
var ParseToTilemap = require('./ParseToTilemap');


//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

GameObjectFactory.register('tilemap', function (key, tileWidth, tileHeight, width, height, data, insertNull)
{
    // Allow users to specify null as default parameter, but convert it to undefined to match what
    // the creator function passed to the parser.
    if (key === null) { key = undefined; }
    if (tileWidth === null) { tileWidth = undefined; }
    if (tileHeight === null) { tileHeight = undefined; }
    if (width === null) { width = undefined; }
    if (height === null) { height = undefined; }
    if (data === null) { data = undefined; }
    if (insertNull === null) { insertNull = undefined; }

    return ParseToTilemap(this.scene, key, tileWidth, tileHeight, width, height, data, insertNull);
});
