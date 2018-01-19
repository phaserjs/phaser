var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var ParseOBJ = require('../../geom/mesh/ParseOBJ');

//  Phaser.Loader.FileTypes.WavefrontFile

var WavefrontFile = new Class({

    Extends: File,

    initialize:

    function WavefrontFile (key, url, path, xhrSettings)
    {
        var fileKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', '');

        var fileConfig = {
            type: 'obj',
            extension: GetFastValue(key, 'extension', 'obj'),
            responseType: 'text',
            key: fileKey,
            url: GetFastValue(key, 'file', url),
            path: path,
            xhrSettings: GetFastValue(key, 'xhr', xhrSettings)
        };

        File.call(this, fileConfig);
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = ParseOBJ(this.xhrLoader.responseText);

        this.onComplete();

        callback(this);
    }

});

//  When registering a factory function 'this' refers to the Loader context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory

FileTypesManager.register('obj', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new WavefrontFile(key[i], url, this.path, xhrSettings));
        }
    }
    else
    {
        this.addFile(new WavefrontFile(key, url, this.path, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = WavefrontFile;
