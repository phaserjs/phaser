var GameObjectCreator = require('../../scene/plugins/GameObjectCreator');
var ParseToTilemap = require('./ParseToTilemap');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('tilemap', function (config)
{
    // config {
    //     key: undefined, (string|number),
    //     tileWidth: 32,
    //     tileHeight: 32,
    //     width: 10,
    //     height: 10,
    //     data: null (2D array of tile indexes),
    //     insertNull: false
    // }

    var c = config !== undefined ? config : {};
    return ParseToTilemap(this.scene, c.key, c.tileWidth, c.tileHeight, c.width, c.height, c.data, c.insertNull);
});
