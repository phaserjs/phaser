/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var FileTypesManager = require('../FileTypesManager');
var JSONFile = require('./JSONFile.js');

/**
 * @classdesc
 * [description]
 *
 * @class PackFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.7.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {XHRSettingsObject} [xhrSettings] - [description]
 */
var PackFile = new Class({

    Extends: JSONFile,

    initialize:

    //  url can either be a string, in which case it is treated like a proper url, or an object, in which case it is treated as a ready-made JS Object

    function PackFile (loader, key, url, xhrSettings, packKey)
    {
        JSONFile.call(this, loader, key, url, xhrSettings, packKey);

        this.type = 'packfile';
    },

    onProcess: function ()
    {
        if (this.state !== CONST.FILE_POPULATED)
        {
            this.state = CONST.FILE_PROCESSING;

            this.data = JSON.parse(this.xhrLoader.responseText);
        }

        //  Let's pass the pack file data over to the Loader ...
        this.loader.addPack(this.data, this.config);

        this.onProcessComplete();
    }

});

/**
 * Adds an Animation JSON file to the current load queue.
 *
 * Note: This method will only be available if the Animation JSON File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#pack
 * @since 3.7.0
 *
 * @param {(string|array|object)} key - A unique string to be used as the key to reference this file from the Cache. Must be unique within this file type.
 * @param {string} [url] - URL of the file. If `undefined` or `null` the url will be set to `<key>.json`,
 * i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {string} [packKey] - If you just want to process part of a pack, provide the key here. Leave empty to process the whole pack.
 * @param {XHRSettingsObject} [xhrSettings] - File specific XHR settings to be used during the load. These settings are merged with the global Loader XHR settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('pack', function (key, url, packKey, xhrSettings)
{
    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            this.addFile(new PackFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new PackFile(this, key, url, xhrSettings, packKey));
    }

    return this;
});

module.exports = PackFile;
