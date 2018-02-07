var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var TILEMAP_FORMATS = require('../../tilemaps/Formats');

//  Phaser.Loader.FileTypes.TilemapCSVFile

var TilemapCSVFile = new Class({

    Extends: File,

    initialize:

    function TilemapCSVFile (key, url, path, format, xhrSettings)
    {
        var fileConfig = {
            type: 'tilemapCSV',
            extension: '.csv',
            responseType: 'text',
            key: key,
            url: url,
            path: path,
            xhrSettings: xhrSettings
        };

        File.call(this, fileConfig);

        this.tilemapFormat = format;
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = this.xhrLoader.responseText;

        this.onComplete();

        callback(this);
    }

});

//  When registering a factory function 'this' refers to the Loader context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory

FileTypesManager.register('tilemapCSV', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new TilemapCSVFile(key[i], url, this.path, TILEMAP_FORMATS.CSV, xhrSettings));
        }
    }
    else
    {
        this.addFile(new TilemapCSVFile(key, url, this.path, TILEMAP_FORMATS.CSV, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = TilemapCSVFile;
