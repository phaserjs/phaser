/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AtlasJSONFile = require('./AtlasJSONFile');
var BinaryFile = require('./BinaryFile');
var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile');
var JSONFile = require('./JSONFile');
var KTXParser = require('../../textures/parsers/KTXParser');
var MultiFile = require('../MultiFile');
var PVRParser = require('../../textures/parsers/PVRParser');

/**
 * @classdesc
 * A Compressed Texture File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#texture method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#texture.
 *
 * @class CompressedTextureFile
 * @extends Phaser.Loader.MultiFile
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {string} key - The key to use for this file.
 * @param {object} entry -
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var CompressedTextureFile = new Class({

    Extends: MultiFile,

    initialize:

    function CompressedTextureFile (loader, key, entry, xhrSettings)
    {
        var extension = entry.textureURL.substr(entry.textureURL.length - 3);

        if (!entry.type)
        {
            entry.type = (extension.toLowerCase() === 'ktx') ? 'KTX' : 'PVR';
        }

        var image = new BinaryFile(loader, {
            key: key,
            url: entry.textureURL,
            extension: extension,
            xhrSettings: xhrSettings,
            config: entry
        });

        // console.log('binary file', image);

        if (entry.atlasURL)
        {
            var data = new JSONFile(loader, {
                key: key,
                url: entry.atlasURL,
                xhrSettings: xhrSettings,
                config: entry
            });

            MultiFile.call(this, loader, 'texture', key, [ image, data ]);
        }
        else
        {
            MultiFile.call(this, loader, 'texture', key, [ image ]);
        }

        this.config = entry;
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.CompressedTextureFile#addToCache
     * @since 3.60.0
     */
    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var entry = this.config;
            var renderer = this.loader.systems.renderer;

            var image = this.files[0];
            var json = this.files[1];

            var textureData;

            if (entry.type === 'PVR')
            {
                textureData = PVRParser(image.data);
            }
            else if (entry.type === 'KTX')
            {
                textureData = KTXParser(image.data);
            }

            if (textureData && renderer.supportsCompressedTexture(entry.format, textureData.internalFormat))
            {
                textureData.format = renderer.getCompressedTextureName(entry.format, textureData.internalFormat);

                //  width, height, mipmaps array, compressed, format, internalFormat
                console.log(textureData);

                // const texture = new Texture(null, textureData.width, textureData.height, Object.assign(fileData.glConfig, textureData));

                // this.loader.textureManager.addAtlas(image.key, image.data, json.data, normalMap);

                if (json && json.data)
                {
                    // AtlasParser(texture, json.data);
                }
            }

            if (json)
            {
                json.pendingDestroy();
            }

            this.complete = true;
        }
    }

});

/**
 * Adds a Compressed Texture file to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.texture('doom', 'files/doom.ktx');
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
 * The key must be a unique String. It is used to add the file to the global Binary Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Binary Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Binary Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.texture({
 *     key: 'doom',
 *     url: 'files/Doom.wad',
 *     dataType: Uint8Array
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.BinaryFileConfig` for more details.
 *
 * Once the file has finished loading you can access it from its Cache using its key:
 *
 * ```javascript
 * this.load.texture('doom', 'files/Doom.wad');
 * // and later in your game ...
 * var data = this.cache.binary.get('doom');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `LEVEL1.` and the key was `Data` the final key will be `LEVEL1.Data` and
 * this is what you would use to retrieve the text from the Binary Cache.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "doom"
 * and no URL is given then the Loader will set the URL to be "doom.bin". It will always add `.bin` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the Binary File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#texture
 * @fires Phaser.Loader.LoaderPlugin#ADD
 * @since 3.60.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.BinaryFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [urls] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.bin`, i.e. if `key` was "alien" then the URL will be "alien.bin".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('texture', function (key, urls, xhrSettings)
{
    var entry = {
        format: null,
        type: null,
        textureURL: null,
        atlasURL: null
    };

    var renderer = this.systems.renderer;

    for (var textureBaseFormat in urls)
    {
        if (renderer.supportsCompressedTexture(textureBaseFormat))
        {
            var urlEntry = urls[textureBaseFormat];

            if (typeof urlEntry === 'string')
            {
                entry.textureURL = urlEntry;
            }
            else
            {
                // Object.assign(entry, urlEntry);
            }

            entry.format = textureBaseFormat.toUpperCase();

            break;
        }
    }

    if (!entry)
    {
        console.warn('No supported texture format or IMG fallback', key);
    }
    else if (entry.format === 'IMG')
    {
        if (entry.atlasURL)
        {
            this.addFile(new AtlasJSONFile(this, key, entry.textureURL, entry.atlasURL, xhrSettings));
        }
        else
        {
            this.addFile(new ImageFile(this, key, entry.textureURL, xhrSettings));
        }
    }
    else
    {
        var multifile = new CompressedTextureFile(this, key, entry, xhrSettings);

        this.addFile(multifile.files);
    }

    return this;
});

module.exports = CompressedTextureFile;

/*
    //  key = Compression Format (ETC, ASTC, etc) that the browser must support
    //  type = The Container Format (PVR or KTX) - if not given will try to extract from textureURL extension
    //  textureURL = URL of the texture file (todo: could also be base64 data?)
    //  atlasURL = optional - if given, will treat as an AtlasFile and load as JSON, otherwise an ImageFile

    ASTCs must be:
    Channel Type: Unsigned Normalized Bytes (UNorm)
    Color Space: Linear RGB

    Texture Formats should be ordered in alphabetical / GPU priority order, with IMG last

    TextureFile('pic', {
        ASTC: { type: string, textureURL?: string, atlasURL?: string },
        ETC: { type: string, textureURL?: string, atlasURL?: string },
        S3TC: { type: string, textureURL?: string, atlasURL?: string },
        IMG: { type: string, textureURL?: string, atlasURL?: string }
    });
*/
