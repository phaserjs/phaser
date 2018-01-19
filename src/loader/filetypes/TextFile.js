var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');

//  Phaser.Loader.FileTypes.TextFile

var TextFile = new Class({

    Extends: File,

    initialize:

    function TextFile (key, url, path, xhrSettings)
    {
        var fileConfig = {
            type: 'text',
            extension: 'txt',
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

//  When registering a factory function 'this' refers to the Loader context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory

FileTypesManager.register('text', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new TextFile(key[i], url, this.path, xhrSettings));
        }
    }
    else
    {
        this.addFile(new TextFile(key, url, this.path, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = TextFile;
