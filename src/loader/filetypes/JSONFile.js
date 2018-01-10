var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var GetFastValue = require('../../utils/object/GetFastValue');

//  Phaser.Loader.FileTypes.JSONFile

var JSONFile = new Class({

    Extends: File,

    initialize:

    function JSONFile (key, url, path, xhrSettings)
    {
        var fileKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', '');

        var fileConfig = {
            type: 'json',
            extension: GetFastValue(key, 'extension', 'json'),
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

        this.data = JSON.parse(this.xhrLoader.responseText);

        this.onComplete();

        callback(this);
    }

});

JSONFile.create = function (loader, key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            loader.addFile(new JSONFile(key[i], url, loader.path, xhrSettings));
        }
    }
    else
    {
        loader.addFile(new JSONFile(key, url, loader.path, xhrSettings));
    }

    //  For method chaining
    return loader;
};

module.exports = JSONFile;
