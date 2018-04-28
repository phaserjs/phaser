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
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @classdesc
 * [description]
 *
 * @class SVGFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {string} path - [description]
 * @param {XHRSettingsObject} [xhrSettings] - [description]
 */
var SVGFile = new Class({

    Extends: File,

    initialize:

    function SVGFile (loader, key, url, xhrSettings)
    {
        var extension = 'svg';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
        }

        var fileConfig = {
            type: 'svg',
            cache: loader.textureManager,
            extension: extension,
            responseType: 'text',
            key: key,
            url: url,
            path: loader.path,
            xhrSettings: xhrSettings
        };

        File.call(this, loader, fileConfig);
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
    },

    addToCache: function ()
    {
        this.cache.addImage(this.key, this.data);

        this.loader.emit('filecomplete', this.key, this);
    }

});

/**
 * Adds an SVG file to the current load queue.
 *
 * Note: This method will only be available if the SVG File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#svg
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {XHRSettingsObject} [xhrSettings] - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('svg', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new SVGFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new SVGFile(this, key, url, xhrSettings));
    }

    return this;
});

module.exports = SVGFile;
