var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');

//  Phaser.Loader.FileTypes.ImageFile

var ImageFile = new Class({

    Extends: File,

    initialize:

    function ImageFile (key, url, path, xhrSettings, config)
    {
        var fileConfig = {
            type: 'image',
            extension: 'png',
            responseType: 'blob',
            key: key,
            url: url,
            path: path,
            xhrSettings: xhrSettings,
            config: config
        };

        File.call(this, fileConfig);
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = new Image();

        this.data.crossOrigin = this.crossOrigin;

        var _this = this;

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

        this.data.src = URL.createObjectURL(this.xhrLoader.response);
    }

});

module.exports = ImageFile;
