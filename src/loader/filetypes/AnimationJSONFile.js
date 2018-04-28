/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var JSONFile = require('./JSONFile.js');

/**
 * @classdesc
 * [description]
 *
 * @class AnimationJSONFile
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
var AnimationJSONFile = new Class({

    Extends: JSONFile,

    initialize:

    //  url can either be a string, in which case it is treated like a proper url, or an object, in which case it is treated as a ready-made JS Object

    function AnimationJSONFile (loader, key, url, xhrSettings)
    {
        JSONFile.call(this, loader, key, url, xhrSettings);

        this.type = 'animationJSON';
    },

    onProcess: function (callback)
    {
        JSONFile.prototype.onProcess.call(this, callback);

        //  We also need to hook into this event:
        this.loader.once('processcomplete', this.onProcessComplete, this);
    },

    onProcessComplete: function ()
    {
        this.loader.scene.sys.anims.fromJSON(this.data);
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
 * @method Phaser.Loader.LoaderPlugin#animation
 * @since 3.0.0
 *
 * @param {(string|array|object)} key - A unique string to be used as the key to reference this file from the Cache. Must be unique within this file type.
 * @param {string} [url] - URL of the file. If `undefined` or `null` the url will be set to `<key>.json`,
 * i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {XHRSettingsObject} [xhrSettings] - File specific XHR settings to be used during the load. These settings are merged with the global Loader XHR settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('animation', function (key, url, xhrSettings)
{
    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            this.addFile(new AnimationJSONFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new AnimationJSONFile(this, key, url, xhrSettings));
    }

    return this;
});

module.exports = AnimationJSONFile;
