var FileTypesManager = require('../FileTypesManager');
var JSONFile = require('./JSONFile.js');
var TILEMAP_FORMATS = require('../../gameobjects/tilemap/Formats');

//  Phaser.Loader.FileTypes.TilemapJSONFile

var TilemapJSONFile = function (key, url, path, format, xhrSettings)
{
    var json = new JSONFile(key, url, path, xhrSettings);

    //  Override the File type
    json.type = 'tilemapJSON';

    json.tilemapFormat = format;

    return json;
};

//  When registering a factory function 'this' refers to the Loader context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory

FileTypesManager.register('tilemapTiledJSON', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(TilemapJSONFile(key[i], url, this.path, TILEMAP_FORMATS.TILED_JSON, xhrSettings));
        }
    }
    else
    {
        this.addFile(TilemapJSONFile(key, url, this.path, TILEMAP_FORMATS.TILED_JSON, xhrSettings));
    }

    //  For method chaining
    return this;
});

FileTypesManager.register('tilemapWeltmeister', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(TilemapJSONFile(key[i], url, this.path, TILEMAP_FORMATS.WELTMEISTER.TILED_JSON, xhrSettings));
        }
    }
    else
    {
        this.addFile(TilemapJSONFile(key, url, this.path, TILEMAP_FORMATS.WELTMEISTER.TILED_JSON, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = TilemapJSONFile;
