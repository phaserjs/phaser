/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var MultiFile = require('../MultiFile');
var ParseObj = require('../../geom/mesh/ParseObj');
var ParseObjMaterial = require('../../geom/mesh/ParseObjMaterial');
var TextFile = require('./TextFile');

/**
 * @classdesc
 * A single Wavefront OBJ File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#obj method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#obj.
 *
 * @class OBJFile
 * @extends Phaser.Loader.MultiFile
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.OBJFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [objURL] - The absolute or relative URL to load the obj file from. If undefined or `null` it will be set to `<key>.obj`, i.e. if `key` was "alien" then the URL will be "alien.obj".
 * @param {string} [matURL] - The absolute or relative URL to load the material file from. If undefined or `null` it will be set to `<key>.mat`, i.e. if `key` was "alien" then the URL will be "alien.mat".
 * @param {boolean} [flipUV] - Flip the UV coordinates stored in the model data?
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for these files.
 */
var OBJFile = new Class({

    Extends: MultiFile,

    initialize:

    function OBJFile (loader, key, objURL, matURL, flipUV, xhrSettings)
    {
        var obj;
        var mat;

        var cache = loader.cacheManager.obj;

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');

            obj = new TextFile(loader, {
                key: key,
                type: 'obj',
                cache: cache,
                url: GetFastValue(config, 'url'),
                extension: GetFastValue(config, 'extension', 'obj'),
                xhrSettings: GetFastValue(config, 'xhrSettings'),
                config: {
                    flipUV: GetFastValue(config, 'flipUV', flipUV)
                }
            });

            matURL = GetFastValue(config, 'matURL');

            if (matURL)
            {
                mat = new TextFile(loader, {
                    key: key,
                    type: 'mat',
                    cache: cache,
                    url: matURL,
                    extension: GetFastValue(config, 'matExtension', 'mat'),
                    xhrSettings: GetFastValue(config, 'xhrSettings')
                });
            }
        }
        else
        {
            obj = new TextFile(loader, {
                key: key,
                url: objURL,
                type: 'obj',
                cache: cache,
                extension: 'obj',
                xhrSettings: xhrSettings,
                config: {
                    flipUV: flipUV
                }
            });

            if (matURL)
            {
                mat = new TextFile(loader, {
                    key: key,
                    url: matURL,
                    type: 'mat',
                    cache: cache,
                    extension: 'mat',
                    xhrSettings: xhrSettings
                });
            }
        }

        MultiFile.call(this, loader, 'obj', key, [ obj, mat ]);
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.OBJFile#addToCache
     * @since 3.50.0
     */
    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var obj = this.files[0];
            var mat = this.files[1];

            var objData = ParseObj(obj.data, obj.config.flipUV);

            if (mat)
            {
                objData.materials = ParseObjMaterial(mat.data);
            }

            obj.cache.add(obj.key, objData);

            this.complete = true;
        }
    }

});

/**
 * Adds a Wavefront OBJ file, or array of OBJ files, to the current load queue.
 *
 * Note: You should ensure your 3D package has triangulated the OBJ file prior to export.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.obj('ufo', 'files/spaceship.obj');
 * }
 * ```
 *
 * You can optionally also load a Wavefront Material file as well, by providing the 3rd parameter:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.obj('ufo', 'files/spaceship.obj', 'files/spaceship.mtl');
 * }
 * ```
 *
 * If given, the material will be parsed and stored along with the obj data in the cache.
 *
 * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
 * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 *
 * The key must be a unique String. It is used to add the file to the global OBJ Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the OBJ Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the OBJ Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.obj({
 *     key: 'ufo',
 *     url: 'files/spaceship.obj',
 *     matURL: 'files/spaceship.mtl',
 *     flipUV: true
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.OBJFileConfig` for more details.
 *
 * Once the file has finished loading you can access it from its Cache using its key:
 *
 * ```javascript
 * this.load.obj('ufo', 'files/spaceship.obj');
 * // and later in your game ...
 * var data = this.cache.obj.get('ufo');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `LEVEL1.` and the key was `Story` the final key will be `LEVEL1.Story` and
 * this is what you would use to retrieve the obj from the OBJ Cache.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "story"
 * and no URL is given then the Loader will set the URL to be "story.obj". It will always add `.obj` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the OBJ File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#obj
 * @fires Phaser.Loader.Events#ADD
 * @since 3.50.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.OBJFileConfig|Phaser.Types.Loader.FileTypes.OBJFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [objURL] - The absolute or relative URL to load the obj file from. If undefined or `null` it will be set to `<key>.obj`, i.e. if `key` was "alien" then the URL will be "alien.obj".
 * @param {string} [matURL] - Optional absolute or relative URL to load the obj material file from.
 * @param {boolean} [flipUV] - Flip the UV coordinates stored in the model data?
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('obj', function (key, objURL, matURL, flipUVs, xhrSettings)
{
    var multifile;

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            multifile = new OBJFile(this, key[i]);

            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(multifile.files);
        }
    }
    else
    {
        multifile = new OBJFile(this, key, objURL, matURL, flipUVs, xhrSettings);

        this.addFile(multifile.files);
    }

    return this;
});

module.exports = OBJFile;
