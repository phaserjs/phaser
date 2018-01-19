var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');

//  Phaser.Loader.FileTypes.SVGFile

var SVGFile = new Class({

    Extends: File,

    initialize:

    function SVGFile (key, url, path, xhrSettings)
    {
        var fileKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', '');

        var fileConfig = {
            type: 'svg',
            extension: GetFastValue(key, 'extension', 'svg'),
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

        var svg = [ this.xhrLoader.responseText ];
        var _this = this;

        try
        {
            var blob = new window.Blob(svg, { type: 'image/svg+xml;charset=utf-8' });
        }
        catch (e)
        {
            _this.state = CONST.FILE_ERRORED;

            callback(_this);

            return;
        }

        this.data = new Image();

        this.data.crossOrigin = this.crossOrigin;

        var retry = false;

        this.data.onload = function ()
        {
            if(!retry)
            {
                File.revokeObjectURL(_this.data);
            }

            _this.onComplete();

            callback(_this);
        };

        this.data.onerror = function ()
        {
            //  Safari 8 re-try
            if (!retry)
            {
                retry = true;

                File.revokeObjectURL(_this.data);

                _this.data.src = 'data:image/svg+xml,' + encodeURIComponent(svg.join(''));
            }
            else
            {
                _this.state = CONST.FILE_ERRORED;

                callback(_this);
            }
        };

        File.createObjectURL(this.data, blob, 'image/svg+xml');
    }

});

//  When registering a factory function 'this' refers to the Loader context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory

FileTypesManager.register('svg', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new SVGFile(key[i], url, this.path, xhrSettings));
        }
    }
    else
    {
        this.addFile(new SVGFile(key, url, this.path, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = SVGFile;
