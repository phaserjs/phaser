/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * @classdesc
 * [description]
 *
 * @class ImageFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {(string|object)} key - The name of the asset to load or an object representing the asset
 * @param {string} [url] - The asset's filename
 * @param {string} [path] - The path the asset can be found in
 * @param {XHRSettingsObject} [xhrSettings] - Optional image specific XHR settings
 * @param {object} [config] - config can include: frameWidth, frameHeight, startFrame, endFrame, margin, spacing
 */
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
    // this.load.image([
    //     {
    //         key: 'bunny',
    //         file: 'assets/sprites/bunny.png',
    //         xhr: {
    //             user: 'root',
    //             password: 'th3G1bs0n',
    //             timeout: 30,
    //             header: 'Content-Type',
    //             headerValue: 'text/xml'
    //         }
    //     }
    // ]);
    // this.load.image({ key: 'bunny' });
    // this.load.image({ key: 'bunny', extension: 'jpg' });

    function ImageFile (loader, key, url, xhrSettings, config)
    {
        var fileKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', '');
        var fileUrl = (url === undefined) ? GetFastValue(key, 'file') : url;

        var fileConfig = {
            type: 'image',
            cache: loader.textureManager,
            extension: GetFastValue(key, 'extension', 'png'),
            responseType: 'blob',
            key: fileKey,
            url: fileUrl,
            path: loader.path,
            xhrSettings: GetFastValue(key, 'xhr', xhrSettings),
            config: GetFastValue(key, 'config', config)
        };

        File.call(this, loader, fileConfig);
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = new Image();

        this.data.crossOrigin = this.crossOrigin;

        var _this = this;

        this.data.onload = function ()
        {
            File.revokeObjectURL(_this.data);

            _this.onComplete();

            callback(_this);
        };

        this.data.onerror = function ()
        {
            File.revokeObjectURL(_this.data);

            _this.state = CONST.FILE_ERRORED;

            callback(_this);
        };

        File.createObjectURL(this.data, this.xhrLoader.response, 'image/png');
    },

    addToCache: function ()
    {
        this.cache.addImage(this.key, this.data);

        this.loader.emit('filecomplete', this.key, this);
    }

});

/**
 * Adds an Image file to the current load queue.
 *
 * Note: This method will only be available if the Image File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#image
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {XHRSettingsObject} [xhrSettings] - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('image', function (key, url, xhrSettings)
{
    var urls;
    var fileA;
    var fileB;

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            urls = GetFastValue(key[i], 'file', url);

            if (Array.isArray(urls) && urls.length === 2)
            {
                fileA = this.addFile(new ImageFile(this, key[i], urls[0], xhrSettings));
                fileB = this.addFile(new ImageFile(this, key[i], urls[1], xhrSettings));

                fileA.setLinkFile(fileB, 'dataimage');
            }
            else
            {
                this.addFile(new ImageFile(this, key[i], url, xhrSettings));
            }
        }
    }
    else
    {
        urls = GetFastValue(key, 'file', url);

        if (Array.isArray(urls) && urls.length === 2)
        {
            fileA = this.addFile(new ImageFile(this, key, urls[0], xhrSettings));
            fileB = this.addFile(new ImageFile(this, key, urls[1], xhrSettings));

            fileA.setLinkFile(fileB, 'dataimage');
        }
        else
        {
            this.addFile(new ImageFile(this, key, url, xhrSettings));
        }
    }

    //  For method chaining
    return this;
});

module.exports = ImageFile;
