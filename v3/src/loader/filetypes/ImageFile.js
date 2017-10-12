var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var GetFastValue = require('../../utils/object/GetFastValue');

//  Phaser.Loader.FileTypes.ImageFile

var ImageFile = new Class({

    Extends: File,

    initialize:

    // this.load.image('pic', 'assets/pics/taikodrummaster.jpg');
    // this.load.image({ key: 'pic', file: 'assets/pics/taikodrummaster.jpg' });
    // this.load.image({
    //     key: 'bunny',
    //     file: 'assets/sprites/bunny.png',
    //     xhr: {
    //         user: 'root',
    //         password: 'th3G1bs0n',
    //         timeout: 30,
    //         header: 'Content-Type',
    //         headerValue: 'text/xml'
    //     }
    // });
    // this.load.image({ key: 'bunny' });
    // this.load.image({ key: 'bunny', extension: 'jpg' });
    function ImageFile (key, url, path, xhrSettings, config)
    {
        var fileKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', '');

        var fileConfig = {
            type: 'image',
            extension: GetFastValue(key, 'extension', 'png'),
            responseType: 'blob',
            key: fileKey,
            url: GetFastValue(key, 'file', url),
            path: path,
            xhrSettings: GetFastValue(key, 'xhr', xhrSettings),
            config: GetFastValue(key, 'config', config)
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
            if(URL)
            {
                URL.revokeObjectURL(_this.data.src);
            }

            _this.onComplete();

            callback(_this);
        };

        this.data.onerror = function ()
        {
            if(URL)
            {
                URL.revokeObjectURL(_this.data.src);
            }

            _this.state = CONST.FILE_ERRORED;

            callback(_this);
        };

       if(URL)
        {
            this.data.src = URL.createObjectURL(this.xhrLoader.response);
        }
        else
        {
            var reader = new FileReader();

            reader.onload = function()
            {
                delete _this.data.crossOrigin;
                _this.data.src = 'data:' + (_this.xhrLoader.response.type || 'image/png') + ';base64,' + reader.result.split(',')[1];
            };

            reader.onerror = function ()
            {
                _this.state = CONST.FILE_ERRORED;

                callback(_this);
            };

            reader.readAsDataURL(this.xhrLoader.response);
        }

    }

});

ImageFile.create = function (loader, key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            loader.addFile(new ImageFile(key[i], url, loader.path, xhrSettings));
        }
    }
    else
    {
        loader.addFile(new ImageFile(key, url, loader.path, xhrSettings));
    }

    //  For method chaining
    return loader;
};

module.exports = ImageFile;
