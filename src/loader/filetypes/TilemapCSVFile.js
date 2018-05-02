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
var TILEMAP_FORMATS = require('../../tilemaps/Formats');

/**
 * @classdesc
 * [description]
 *
 * @class TilemapCSVFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {string} path - [description]
 * @param {string} format - [description]
 * @param {XHRSettingsObject} [xhrSettings] - [description]
 */
var TilemapCSVFile = new Class({

    Extends: File,

    initialize:

    function TilemapCSVFile (loader, key, url, xhrSettings)
    {
        var extension = 'csv';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
        }

        var fileConfig = {
            type: 'tilemapCSV',
            cache: loader.cacheManager.tilemap,
            extension: extension,
            responseType: 'text',
            key: key,
            url: url,
            xhrSettings: xhrSettings
        };

        File.call(this, loader, fileConfig);

        this.tilemapFormat = TILEMAP_FORMATS.CSV;
    },

    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = this.xhrLoader.responseText;

        this.onProcessComplete();
    },

    addToCache: function ()
    {
        var tiledata = { format: this.tilemapFormat, data: this.data };

        this.cache.add(this.key, tiledata);

        this.pendingDestroy(tiledata);
    }

});

/**
 * Adds a Tilemap CSV file to the current load queue.
 *
 * Note: This method will only be available if the Tilemap CSV File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#tilemapCSV
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {XHRSettingsObject} [xhrSettings] - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('tilemapCSV', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new TilemapCSVFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new TilemapCSVFile(this, key, url, xhrSettings));
    }

    return this;
});

module.exports = TilemapCSVFile;
