var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.SVGFile

var SVGFile = new Class({

    Extends: File,

    initialize:

    function SVGFile (key, url, path, xhrSettings)
    {
        var fileConfig = {
            type: 'svg',
            extension: 'svg',
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

module.exports = SVGFile;
