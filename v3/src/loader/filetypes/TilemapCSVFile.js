var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.TilemapCSVFile

var TilemapCSVFile = new Class({

    Extends: File,

    initialize:

    function TextFile (key, url, path, xhrSettings)
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
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = this.xhrLoader.responseText;

        this.onComplete();

        callback(this);
    }

});

TilemapCSVFile.create = function (loader, key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            loader.addFile(new TilemapCSVFile(key[i], url, loader.path, xhrSettings));
        }
    }
    else
    {
        loader.addFile(new TilemapCSVFile(key, url, loader.path, xhrSettings));
    }

    //  For method chaining
    return loader;
};

module.exports = TilemapCSVFile;
