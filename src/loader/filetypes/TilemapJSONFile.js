/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var FileTypesManager = require('../FileTypesManager');
var JSONFile = require('./JSONFile.js');
var TILEMAP_FORMATS = require('../../tilemaps/Formats');

/**
 * A Tilemap File.
 *
 * @function Phaser.Loader.FileTypes.TilemapJSONFile
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {string} path - [description]
 * @param {string} format - [description]
 * @param {XHRSettingsObject} xhrSettings - [description]
 *
 * @return {object} An object containing two File objects to be added to the loader.
 */
var TilemapJSONFile = function (key, url, path, format, xhrSettings)
{
    var json = new JSONFile(key, url, path, xhrSettings);

    //  Override the File type
    json.type = 'tilemapJSON';

    json.tilemapFormat = format;

    return json;
};

/**
 * Adds a Tilemap (Tiled JSON Format) file to the current load queue.
 *
 * Note: This method will only be available if the Tilemap File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#tilemapTiledJSON
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {XHRSettingsObject} xhrSettings - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('tilemapTiledJSON', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(TilemapJSONFile(key[i], url, this.path, TILEMAP_FORMATS.TILED_JSON, xhrSettings));
        }
    }
    else
    {
        this.addFile(TilemapJSONFile(key, url, this.path, TILEMAP_FORMATS.TILED_JSON, xhrSettings));
    }

    //  For method chaining
    return this;
});

/**
 * Adds a Tilemap (Weltmeister Format) file to the current load queue.
 *
 * Note: This method will only be available if the Tilemap File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#tilemapWeltmeister
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {XHRSettingsObject} xhrSettings - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('tilemapWeltmeister', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(TilemapJSONFile(key[i], url, this.path, TILEMAP_FORMATS.WELTMEISTER, xhrSettings));
        }
    }
    else
    {
        this.addFile(TilemapJSONFile(key, url, this.path, TILEMAP_FORMATS.WELTMEISTER, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = TilemapJSONFile;
