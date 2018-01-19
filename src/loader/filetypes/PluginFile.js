var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var GetFastValue = require('../../utils/object/GetFastValue');
var PluginManager = require('../../plugins/PluginManager');

//  Phaser.Loader.FileTypes.PluginFile

var PluginFile = new Class({

    Extends: File,

    initialize:

    function PluginFile (key, url, path, xhrSettings)
    {
        var fileKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', '');

        var fileConfig = {
            type: 'script',
            extension: GetFastValue(key, 'extension', 'js'),
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

        this.data = document.createElement('script');
        this.data.language = 'javascript';
        this.data.type = 'text/javascript';
        this.data.defer = false;
        this.data.text = this.xhrLoader.responseText;

        document.head.appendChild(this.data);

        //  Need to wait for onload?
        window[this.key].register(PluginManager);

        this.onComplete();

        callback(this);
    }

});

PluginFile.create = function (loader, key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            loader.addFile(new PluginFile(key[i], url, loader.path, xhrSettings));
        }
    }
    else
    {
        loader.addFile(new PluginFile(key, url, loader.path, xhrSettings));
    }

    //  For method chaining
    return loader;
};

module.exports = PluginFile;
