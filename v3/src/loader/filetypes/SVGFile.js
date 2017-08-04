var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
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
            URL.revokeObjectURL(_this.data.src);

            _this.onComplete();

            callback(_this);
        };

        this.data.onerror = function ()
        {
            URL.revokeObjectURL(_this.data.src);

            //  Safari 8 re-try
            if (!retry)
            {
                retry = true;

                var url = 'data:image/svg+xml,' + encodeURIComponent(svg.join(''));

                _this.data.src = URL.createObjectURL(url);
            }
            else
            {
                _this.state = CONST.FILE_ERRORED;

                callback(_this);
            }
        };

        this.data.src = URL.createObjectURL(blob);
    }

});

SVGFile.create = function (loader, key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            loader.addFile(new SVGFile(key[i], url, loader.path, xhrSettings));
        }
    }
    else
    {
        loader.addFile(new SVGFile(key, url, loader.path, xhrSettings));
    }

    //  For method chaining
    return loader;
};

module.exports = SVGFile;
