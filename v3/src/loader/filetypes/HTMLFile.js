var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.HTMLFile

var HTMLFile = new Class({

    Extends: File,

    initialize:

    function HTMLFile (key, url, width, height, path, xhrSettings)
    {
        if (width === undefined) { width = 512; }
        if (height === undefined) { height = 512; }

        var fileConfig = {
            type: 'html',
            extension: 'html',
            responseType: 'text',
            key: key,
            url: url,
            path: path,
            xhrSettings: xhrSettings,
            config: {
                width: width,
                height: height
            }
        };

        File.call(this, fileConfig);
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        var w = this.config.width;
        var h = this.config.height;

        var data = [];

        data.push('<svg width="' + w + 'px" height="' + h + 'px" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">');
        data.push('<foreignObject width="100%" height="100%">');
        data.push('<body xmlns="http://www.w3.org/1999/xhtml">');
        data.push(this.xhrLoader.responseText);
        data.push('</body>');
        data.push('</foreignObject>');
        data.push('</svg>');

        var svg = [ data.join('\n') ];
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

        this.data.onload = function ()
        {
            URL.revokeObjectURL(_this.data.src);

            _this.onComplete();

            callback(_this);
        };

        this.data.onerror = function ()
        {
            URL.revokeObjectURL(_this.data.src);

            _this.state = CONST.FILE_ERRORED;

            callback(_this);
        };

        this.data.src = URL.createObjectURL(blob);
    }

});

module.exports = HTMLFile;
