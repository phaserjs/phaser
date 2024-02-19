/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2021 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AtlasJSONFile = require('./AtlasJSONFile');
var BinaryFile = require('./BinaryFile');
var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var ImageFile = require('./ImageFile');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var JSONFile = require('./JSONFile');
var KTXParser = require('../../textures/parsers/KTXParser');
var Merge = require('../../utils/object/Merge');
var MultiAtlasFile = require('./MultiAtlasFile');
var MultiFile = require('../MultiFile');
var PVRParser = require('../../textures/parsers/PVRParser');
var verifyCompressedTexture = require('../../textures/parsers/VerifyCompressedTexture');

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
        if (entry.multiAtlasURL)
        {
            var multi = new JSONFile(loader, {
                key: key,
                url: entry.multiAtlasURL,
                xhrSettings: xhrSettings,
                config: entry
            });

            MultiFile.call(this, loader, 'texture', key, [ multi ]);
        }
        else
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
        }

        this.config = entry;
    },

    /**
     * Called by each File when it finishes loading.
     *
     * @method Phaser.Loader.FileTypes.CompressedTextureFile#onFileComplete
     * @since 3.60.0
     *
     * @param {Phaser.Loader.File} file - The File that has completed processing.
     */
    onFileComplete: function (file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.pending--;

            if (!this.config.multiAtlasURL)
            {
                return;
            }

            if (file.type === 'json' && file.data.hasOwnProperty('textures'))
            {
                //  Inspect the data for the files to now load
                var textures = file.data.textures;

                var config = this.config;
                var loader = this.loader;

                var currentBaseURL = loader.baseURL;
                var currentPath = loader.path;
                var currentPrefix = loader.prefix;

                var baseURL = GetFastValue(config, 'multiBaseURL', this.baseURL);
                var path = GetFastValue(config, 'multiPath', this.path);
                var prefix = GetFastValue(config, 'prefix', this.prefix);
                var textureXhrSettings = GetFastValue(config, 'textureXhrSettings');

                if (baseURL)
                {
                    loader.setBaseURL(baseURL);
                }

                if (path)
                {
                    loader.setPath(path);
                }

                if (prefix)
                {
                    loader.setPrefix(prefix);
                }

                for (var i = 0; i < textures.length; i++)
                {
                    //  "image": "texture-packer-multi-atlas-0.png",
                    var textureURL = textures[i].image;

                    var key = 'CMA' + this.multiKeyIndex + '_' + textureURL;

                    var image = new BinaryFile(loader, key, textureURL, textureXhrSettings);

                    this.addToMultiFile(image);

                    loader.addFile(image);

                    //  "normalMap": "texture-packer-multi-atlas-0_n.png",
                    if (textures[i].normalMap)
                    {
                        var normalMap = new BinaryFile(loader, key, textures[i].normalMap, textureXhrSettings);

                        normalMap.type = 'normalMap';

                        image.setLink(normalMap);

                        this.addToMultiFile(normalMap);

                        loader.addFile(normalMap);
                    }
                }

                //  Reset the loader settings
                loader.setBaseURL(currentBaseURL);
                loader.setPath(currentPath);
                loader.setPrefix(currentPrefix);
            }
        }
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.CompressedTextureFile#addToCache
     * @since 3.60.0
     */
    addToCache: function ()
    {
        function compressionWarning (message)
        {
            console.warn('Compressed Texture Invalid: "' + image.key + '". ' + message);
        }

        if (this.isReadyToProcess())
        {
            var entry = this.config;

            if (entry.multiAtlasURL)
            {
                this.addMultiToCache();
            }
            else
            {
                var renderer = this.loader.systems.renderer;
                var textureManager = this.loader.textureManager;
                var textureData;

                var image = this.files[0];
                var json = this.files[1];

                if (entry.type === 'PVR')
                {
                    textureData = PVRParser(image.data);
                }
                else if (entry.type === 'KTX')
                {
                    textureData = KTXParser(image.data);
                    if (!textureData)
                    {
                        compressionWarning('KTX file contains unsupported format.');
                    }
                }

                // Check block size.
                if (textureData && !verifyCompressedTexture(textureData))
                {
                    compressionWarning('Texture dimensions failed verification. Check the texture format specifications for ' + entry.format + ' 0x' + textureData.internalFormat.toString(16) + '.');
                    textureData = null;
                }

                // Check texture compression.
                if (textureData && !renderer.supportsCompressedTexture(entry.format, textureData.internalFormat))
                {
                    compressionWarning('Texture format ' + entry.format + ' with internal format ' + textureData.internalFormat + ' not supported by the GPU. Texture invalid. This is often due to the texture using sRGB instead of linear RGB.');
                    textureData = null;
                }

                if (textureData)
                {
                    textureData.format = renderer.getCompressedTextureName(entry.format, textureData.internalFormat);

                    var atlasData = (json && json.data) ? json.data : null;

                    textureManager.addCompressedTexture(image.key, textureData, atlasData);
                }
            }

            this.complete = true;
        }
    },

    /**
     * Adds all of the multi-file entties to their target caches upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.CompressedTextureFile#addMultiToCache
     * @since 3.60.0
     */
    addMultiToCache: function ()
    {
        var entry = this.config;
        var json = this.files[0];

        var data = [];
        var images = [];
        var normalMaps = [];

        var renderer = this.loader.systems.renderer;
        var textureManager = this.loader.textureManager;
        var textureData;

        for (var i = 1; i < this.files.length; i++)
        {
            var file = this.files[i];

            if (file.type === 'normalMap')
            {
                continue;
            }

            var pos = file.key.indexOf('_');
            var key = file.key.substr(pos + 1);

            var image = file.data;

            //  Now we need to find out which json entry this mapped to
            for (var t = 0; t < json.data.textures.length; t++)
            {
                var item = json.data.textures[t];

                if (item.image === key)
                {
                    if (entry.type === 'PVR')
                    {
                        textureData = PVRParser(image);
                    }
                    else if (entry.type === 'KTX')
                    {
                        textureData = KTXParser(image);
                    }

                    if (textureData && renderer.supportsCompressedTexture(entry.format, textureData.internalFormat))
                    {
                        textureData.format = renderer.getCompressedTextureName(entry.format, textureData.internalFormat);

                        images.push(textureData);

                        data.push(item);

                        if (file.linkFile)
                        {
                            normalMaps.push(file.linkFile.data);
                        }
                    }

                    break;
                }
            }
        }

        if (normalMaps.length === 0)
        {
            normalMaps = undefined;
        }

        textureManager.addAtlasJSONArray(this.key, images, data, normalMaps);

        this.complete = true;
    }

});

/**
 * Adds a Compressed Texture file to the current load queue. This feature is WebGL only.
 *
 * This method takes a key and a configuration object, which lists the different formats
 * and files associated with them.
 *
 * The texture format object should be ordered in GPU priority order, with IMG as the last entry.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * preload ()
 * {
 *     this.load.texture('yourPic', {
 *         ASTC: { type: 'PVR', textureURL: 'pic-astc-4x4.pvr' },
 *         PVRTC: { type: 'PVR', textureURL: 'pic-pvrtc-4bpp-rgba.pvr' },
 *         S3TC: { type: 'PVR', textureURL: 'pic-dxt5.pvr' },
 *         IMG: { textureURL: 'pic.png' }
 *     });
 * ```
 *
 * If you wish to load a texture atlas, provide the `atlasURL` property:
 *
 * ```javascript
 * preload ()
 * {
 *     const path = 'assets/compressed';
 *
 *     this.load.texture('yourAtlas', {
 *         'ASTC': { type: 'PVR', textureURL: `${path}/textures-astc-4x4.pvr`, atlasURL: `${path}/textures.json` },
 *         'PVRTC': { type: 'PVR', textureURL: `${path}/textures-pvrtc-4bpp-rgba.pvr`, atlasURL: `${path}/textures-pvrtc-4bpp-rgba.json` },
 *         'S3TC': { type: 'PVR', textureURL: `${path}/textures-dxt5.pvr`, atlasURL: `${path}/textures-dxt5.json` },
 *         'IMG': { textureURL: `${path}/textures.png`, atlasURL: `${path}/textures.json` }
 *     });
 * }
 * ```
 *
 * If you wish to load a Multi Atlas, as exported from Texture Packer Pro, use the `multiAtlasURL` property instead:
 *
 * ```javascript
 * preload ()
 * {
 *     const path = 'assets/compressed';
 *
 *     this.load.texture('yourAtlas', {
 *         'ASTC': { type: 'PVR', atlasURL: `${path}/textures.json` },
 *         'PVRTC': { type: 'PVR', atlasURL: `${path}/textures-pvrtc-4bpp-rgba.json` },
 *         'S3TC': { type: 'PVR', atlasURL: `${path}/textures-dxt5.json` },
 *         'IMG': { atlasURL: `${path}/textures.json` }
 *     });
 * }
 * ```
 *
 * When loading a Multi Atlas you do not need to specify the `textureURL` property as it will be read from the JSON file.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.texture({
 *     key: 'yourPic',
 *     url: {
 *         ASTC: { type: 'PVR', textureURL: 'pic-astc-4x4.pvr' },
 *         PVRTC: { type: 'PVR', textureURL: 'pic-pvrtc-4bpp-rgba.pvr' },
 *         S3TC: { type: 'PVR', textureURL: 'pic-dxt5.pvr' },
 *         IMG: { textureURL: 'pic.png' }
 *    }
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.CompressedTextureFileConfig` for more details.
 *
 * The number of formats you provide to this function is up to you, but you should ensure you
 * cover the primary platforms where appropriate.
 *
 * The 'IMG' entry is a fallback to a JPG or PNG, should the browser be unable to load any of the other
 * formats presented to this function. You should really always include this, although it is optional.
 *
 * Phaser supports loading both the PVR and KTX container formats. Within those, it can parse
 * the following texture compression formats:
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
 * For more information about the benefits of compressed textures please see the
 * following articles:
 *
 * Texture Compression in 2020 (https://aras-p.info/blog/2020/12/08/Texture-Compression-in-2020/)
 * Compressed GPU Texture Formats (https://themaister.net/blog/2020/08/12/compressed-gpu-texture-formats-a-review-and-compute-shader-decoders-part-1/)
 *
 * To create compressed texture files use a 3rd party application such as:
 *
 * Texture Packer (https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-for-phaser3?utm_source=ad&utm_medium=banner&utm_campaign=phaser-2018-10-16)
 * PVRTexTool (https://developer.imaginationtech.com/pvrtextool/) - available for Windows, macOS and Linux.
 * Mali Texture Compression Tool (https://developer.arm.com/tools-and-software/graphics-and-gaming/mali-texture-compression-tool)
 * ASTC Encoder (https://github.com/ARM-software/astc-encoder)
 *
 * ASTCs must have a Channel Type of Unsigned Normalized Bytes (UNorm).
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
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `LEVEL1.` and the key was `Data` the final key will be `LEVEL1.Data` and
 * this is what you would use to retrieve the text from the Texture Manager.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * Unlike other file loaders in Phaser, the URLs must include the file extension.
 *
 * Note: The ability to load this type of file will only be available if the Compressed Texture File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#texture
 * @fires Phaser.Loader.Events#ADD
 * @since 3.60.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.CompressedTextureFileConfig|Phaser.Types.Loader.FileTypes.CompressedTextureFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {Phaser.Types.Loader.FileTypes.CompressedTextureFileConfig} [url] - The compressed texture configuration object. Not required if passing a config object as the `key` parameter.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('texture', function (key, url, xhrSettings)
{
    var renderer = this.systems.renderer;

    var AddEntry = function (loader, key, urls, xhrSettings)
    {
        var entry = {
            format: null,
            type: null,
            textureURL: undefined,
            atlasURL: undefined,
            multiAtlasURL: undefined,
            multiPath: undefined,
            multiBaseURL: undefined
        };

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            urls = GetFastValue(config, 'url'),
            xhrSettings = GetFastValue(config, 'xhrSettings');
        }

        var matched = false;

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

                matched = true;

                break;
            }
        }

        if (!matched)
        {
            console.warn('No supported compressed texture format or IMG fallback', key);
        }
        else if (entry.format === 'IMG')
        {
            var file;
            var multifile;

            if (entry.multiAtlasURL)
            {
                multifile = new MultiAtlasFile(loader, key, entry.multiAtlasURL, entry.multiPath, entry.multiBaseURL, xhrSettings);

                file = multifile.files;
            }
            else if (entry.atlasURL)
            {
                multifile = new AtlasJSONFile(loader, key, entry.textureURL, entry.atlasURL, xhrSettings);

                file = multifile.files;
            }
            else
            {
                file = new ImageFile(loader, key, entry.textureURL, xhrSettings);
            }

            loader.addFile(file);
        }
        else
        {
            var texture = new CompressedTextureFile(loader, key, entry, xhrSettings);

            loader.addFile(texture.files);
        }
    };

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            AddEntry(this, key[i]);
        }
    }
    else
    {
        AddEntry(this, key, url, xhrSettings);
    }

    return this;
});

module.exports = CompressedTextureFile;
