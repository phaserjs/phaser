/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var ImageFile = require('./ImageFile.js');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var JSONFile = require('./JSONFile.js');
var MultiFile = require('../MultiFile.js');

/**
 * @classdesc
 * A single JSON based Texture Atlas File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#atlas method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#atlas.
 *
 * https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-for-phaser3?source=photonstorm
 *
 * @class AsepriteFile
 * @extends Phaser.Loader.MultiFile
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.AsepriteFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string|string[]} [textureURL] - The absolute or relative URL to load the texture image file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {object|string} [atlasURL] - The absolute or relative URL to load the texture atlas json data file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json". Or, a well formed JSON object.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - An XHR Settings configuration object for the atlas image file. Used in replacement of the Loaders default XHR Settings.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - An XHR Settings configuration object for the atlas json file. Used in replacement of the Loaders default XHR Settings.
 */
var AsepriteFile = new Class({

    Extends: MultiFile,

    initialize:

    function AsepriteFile (loader, key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings)
    {
        var image;
        var data;

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');

            image = new ImageFile(loader, {
                key: key,
                url: GetFastValue(config, 'textureURL'),
                extension: GetFastValue(config, 'textureExtension', 'png'),
                normalMap: GetFastValue(config, 'normalMap'),
                xhrSettings: GetFastValue(config, 'textureXhrSettings')
            });

            data = new JSONFile(loader, {
                key: key,
                url: GetFastValue(config, 'atlasURL'),
                extension: GetFastValue(config, 'atlasExtension', 'json'),
                xhrSettings: GetFastValue(config, 'atlasXhrSettings')
            });
        }
        else
        {
            image = new ImageFile(loader, key, textureURL, textureXhrSettings);
            data = new JSONFile(loader, key, atlasURL, atlasXhrSettings);
        }

        if (image.linkFile)
        {
            //  Image has a normal map
            MultiFile.call(this, loader, 'atlasjson', key, [ image, data, image.linkFile ]);
        }
        else
        {
            MultiFile.call(this, loader, 'atlasjson', key, [ image, data ]);
        }
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.AsepriteFile#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var image = this.files[0];
            var json = this.files[1];
            var normalMap = (this.files[2]) ? this.files[2].data : null;

            this.loader.textureManager.addAtlas(image.key, image.data, json.data, normalMap);

            json.addToCache();

            this.complete = true;
        }
    }

});

/**
 * Aseprite is a powerful animated sprite editor and pixel art tool.
 *
 * You can find more details at https://www.aseprite.org/
 *
 * Adds a JSON based Aseprite Animation, or array of animations, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.aseprite('gladiator', 'images/Gladiator.png', 'images/Gladiator.json');
 * }
 * ```
 *
 * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
 * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 *
 * If you call this from outside of `preload` then you are responsible for starting the Loader afterwards and monitoring
 * its events to know when it's safe to use the asset. Please see the Phaser.Loader.LoaderPlugin class for more details.
 *
 * To export a compatible JSON file in Aseprite, please do the following:
 *
 * 1. Go to "File - Export Sprite Sheet"
 *
 * 2. On the **Layout** tab:
 * 2a. Set the "Sheet type" to "Packed"
 * 2b. Set the "Constraints" to "None"
 * 2c. Check the "Merge Duplicates" checkbox
 *
 * 3. On the **Sprite** tab:
 * 3a. Set "Layers" to "Visible layers"
 * 3b. Set "Frames" to "All frames", unless you only wish to export a sub-set of tags
 *
 * 4. On the **Borders** tab:
 * 4a. Check the "Trim Sprite" and "Trim Cells" options
 * 4b. Ensure "Border Padding", "Spacing" and "Inner Padding" are all > 0 (1 is usually enough)
 *
 * 5. On the **Output** tab:
 * 5a. Check "Output File", give your image a name and make sure you choose "png files" as the file type
 * 5b. Check "JSON Data" and give your json file a name
 * 5c. The JSON Data type can be either a Hash or Array, Phaser doesn't mind.
 * 5d. Make sure "Tags" is checked in the Meta options
 * 5e. In the "Item Filename" input box, make sure it says just "{frame}" and nothing more.
 *
 * 6. Click export
 *
 * This was tested with Aseprite 1.2.25.
 *
 * This will export a png and json file which you can load using the Aseprite Loader, i.e.:
 *
 * Phaser can load all common image types: png, jpg, gif and any other format the browser can natively handle.
 *
 * The key must be a unique String. It is used to add the file to the global Texture Manager upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Texture Manager.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Texture Manager first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.aseprite({
 *     key: 'gladiator',
 *     textureURL: 'images/Gladiator.png',
 *     atlasURL: 'images/Gladiator.json'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.AsepriteFileConfig` for more details.
 *
 * Instead of passing a URL for the JSON data you can also pass in a well formed JSON object instead.
 *
 * Once loaded, you can call this method from within a Scene with the 'atlas' key:
 *
 * ```javascript
 * this.anims.createFromAseprite('paladin');
 * ```
 *
 * Any animations defined in the JSON will now be available to use in Phaser and you play them
 * via their Tag name. For example, if you have an animation called 'War Cry' on your Aseprite timeline,
 * you can play it in Phaser using that Tag name:
 *
 * ```javascript
 * this.add.sprite(400, 300).play('War Cry');
 * ```
 *
 * When calling this method you can optionally provide an array of tag names, and only those animations
 * will be created. For example:
 *
 * ```javascript
 * this.anims.createFromAseprite('paladin', [ 'step', 'War Cry', 'Magnum Break' ]);
 * ```
 *
 * This will only create the 3 animations defined. Note that the tag names are case-sensitive.
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `MENU.` and the key was `Background` the final key will be `MENU.Background` and
 * this is what you would use to retrieve the image from the Texture Manager.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
 * and no URL is given then the Loader will set the URL to be "alien.png". It will always add `.png` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the Aseprite File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#aseprite
 * @fires Phaser.Loader.LoaderPlugin#ADD
 * @since 3.50.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.AsepriteFileConfig|Phaser.Types.Loader.FileTypes.AsepriteFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string|string[]} [textureURL] - The absolute or relative URL to load the texture image file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {object|string} [atlasURL] - The absolute or relative URL to load the texture atlas json data file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json". Or, a well formed JSON object.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - An XHR Settings configuration object for the atlas image file. Used in replacement of the Loaders default XHR Settings.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - An XHR Settings configuration object for the atlas json file. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('aseprite', function (key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings)
{
    var multifile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            multifile = new AsepriteFile(this, key[i]);

            this.addFile(multifile.files);
        }
    }
    else
    {
        multifile = new AsepriteFile(this, key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings);

        this.addFile(multifile.files);
    }

    return this;
});

module.exports = AsepriteFile;
