var GameObjectFactory = require('../../scene/plugins/GameObjectFactory');
var GetFastValue = require('../../utils/object/GetFastValue');
var Tilemap = require('./Tilemap');
var Parse = require('./Parse');
var Formats = require('./Formats');


//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

GameObjectFactory.register('tilemap', function (config)
{
    // config {
    //     key: null, (string|number)
    //     tileWidth: 32,
    //     tileHeight: 32,
    //     width: 10,
    //     height: 10,
    //     data: null (2D array of tile indices),
    //     insertNull: false
    // }

    var key = GetFastValue(config, 'key', null);
    var tileWidth = GetFastValue(config, 'tileWidth', 32);
    var tileHeight = GetFastValue(config, 'tileHeight', 32);
    var width = GetFastValue(config, 'width', 10);
    var height = GetFastValue(config, 'height', 10);
    var insertNull = GetFastValue(config, 'insertNull', false);
    var data = GetFastValue(config, 'data', null);

    var parsedData = null;
    if (key === null && Array.isArray(data))
    {
        parsedData = Parse(key, Formats.TILEMAP_2D_ARRAY, data, tileWidth, tileHeight, insertNull);
    }
    else if (key !== null)
    {
        var tilemapData = this.scene.cache.tilemap.get(key);

        if (!tilemapData)
        {
            console.warn('No map data found for key ' + key);
        }
        else
        {
            parsedData = Parse(key, tilemapData.format, tilemapData.data, tileWidth, tileHeight, insertNull);
        }
    }

    return new Tilemap(this.scene, parsedData, tileWidth, tileHeight, width, height);
});
