/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2021 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AtlasJSONFile = require('./AtlasJSONFile');
var BinaryFile = require('./BinaryFile');
var Class = require('../../utils/Class');
var Merge = require('../../utils/object/Merge');
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
 * @param {Phaser.Types.Loader.FileTypes.CompressedTextureFileEntry} entry - The compressed texture file entry to load.
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
            var textureManager = this.loader.textureManager;

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

                var atlasData = (json && json.data) ? json.data : null;

                textureManager.addCompressedTexture(image.key, textureData, atlasData);
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
 * Adds a Compressed Texture file to the current load queue. This feature is WebGL only.
 *
 * This method takes a key and a configuration object, which lists the different formats and files that map to them.
 *
 * The texture format object should be ordered in GPU priority order, with IMG last.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.texture('pic', {
 *         ASTC: { type: 'PVR', textureURL: 'pic-astc-4x4.pvr' },
 *         PVRTC: { type: 'PVR', textureURL: 'pic-pvrtc-4bpp-rgba.pvr' },
 *         S3TC: { type: 'PVR', textureURL: 'pic-dxt5.pvr' },
 *         IMG: { textureURL: 'pic.png }
 *     });
 * ```
 *
 * The 'IMG' entry is a fallback to a JPG or PNG, should the browser be unable to load any of the other
 * formats presented to this function.
 *
 * Phaser supports loading both the PVR and KTX container formats.
 *
 * Within those, it can parse the following texture compression formats:
 *
 * ETC
 * ETC1
 * ATC
 * ASTC
 * BPTC
 * RGTC
 * PVRTC
 * S3TC
 * S3TCSRGB
 *
 * To create compressed texture files use a 3rd party application such as:
 *
 * Texture Packer (https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-for-phaser3?utm_source=ad&utm_medium=banner&utm_campaign=phaser-2018-10-16)
 * PVRTexTool (https://developer.imaginationtech.com/pvrtextool/) - available for Windows, macOS and Linux.
 * Mail Texture Compression Tool (https://developer.arm.com/tools-and-software/graphics-and-gaming/mali-texture-compression-tool)
 * ASTC Encoder (https://github.com/ARM-software/astc-encoder)
 *
 * ASTCs must be: Channel Type: Unsigned Normalized Bytes (UNorm) and Color Space: Linear RGB
 *
 * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
 * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 *
 * The key must be a unique String. It is used to add the file to the global Texture Manager upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Texture Manager.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Texture Manager first, before loading a new one.
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
 * See the documentation for `Phaser.Types.Loader.FileTypes.CompressedTextureFileConfig` for more details.
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `LEVEL1.` and the key was `Data` the final key will be `LEVEL1.Data` and
 * this is what you would use to retrieve the text from the Texture Manager.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * Unlike other file loads in Phaser, you must provide a URL and extension.
 *
 * Note: The ability to load this type of file will only be available if the Compressed Texture File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#texture
 * @fires Phaser.Loader.LoaderPlugin#ADD
 * @since 3.60.0
 *
 * @param {string} key - The key to use for this file.
 * @param {Phaser.Types.Loader.FileTypes.CompressedTextureFileConfig} urls - The compressed texture configuration object.
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
                entry = Merge(urlEntry, entry);
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
