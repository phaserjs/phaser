/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var FileTypesManager = require('../FileTypesManager');
var JSONFile = require('./JSONFile.js');

/**
 * An Animation JSON File.
 *
 * @function Phaser.Loader.FileTypes.AnimationJSONFile
 * @since 3.0.0
 *
 * @param {string} key - The key of the file within the loader.
 * @param {string} url - The url to load the file from.
 * @param {string} path - The path of the file.
 * @param {XHRSettingsObject} xhrSettings - Optional file specific XHR settings.
 *
 * @return {Phaser.Loader.FileTypes.AnimationJSONFile} A File instance to be added to the Loader.
 */
var AnimationJSONFile = function (key, url, path, xhrSettings)
{
    var json = new JSONFile(key, url, path, xhrSettings);

    //  Override the File type
    json.type = 'animationJSON';

    return json;
};

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
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new AnimationJSONFile(key[i], url, this.path, xhrSettings));
        }
    }
    else
    {
        this.addFile(new AnimationJSONFile(key, url, this.path, xhrSettings));
    }

    //  For method chaining
    return this;
});

//  When registering a factory function 'this' refers to the Loader context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory

module.exports = AnimationJSONFile;
