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
 * @class HTMLFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {number} width - [description]
 * @param {number} height - [description]
 * @param {string} path - [description]
 * @param {XHRSettingsObject} xhrSettings - [description]
 */
var HTMLFile = new Class({

    Extends: File,

    initialize:

    function HTMLFile (key, url, width, height, path, xhrSettings)
    {
        if (width === undefined) { width = 512; }
        if (height === undefined) { height = 512; }

        var fileKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', '');

        var fileConfig = {
            type: 'html',
            extension: GetFastValue(key, 'extension', 'html'),
            responseType: 'text',
            key: fileKey,
            url: GetFastValue(key, 'file', url),
            path: path,
            xhrSettings: GetFastValue(key, 'xhr', xhrSettings),
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

        File.createObjectURL(this.data, blob, 'image/svg+xml');
    }

});

/**
 * Adds an HTML file to the current load queue.
 *
 * Note: This method will only be available if the HTML File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#html
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {number} width - [description]
 * @param {number} height - [description]
 * @param {XHRSettingsObject} xhrSettings - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('html', function (key, url, width, height, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new HTMLFile(key[i], url, width, height, this.path, xhrSettings));
        }
    }
    else
    {
        this.addFile(new HTMLFile(key, url, width, height, this.path, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = HTMLFile;
