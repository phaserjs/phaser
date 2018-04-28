/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var ImageFile = require('./ImageFile.js');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var LinkFile = require('../LinkFile.js');
var ParseXMLBitmapFont = require('../../gameobjects/bitmaptext/ParseXMLBitmapFont.js');
var XMLFile = require('./XMLFile.js');

/**
 * @classdesc
 * An Bitmap Font File.
 *
 * @class BitmapFontFile
 * @extends Phaser.Loader.LinkFile
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {string} key - The key of the file within the loader.
 * @param {string} textureURL - The url to load the texture file from.
 * @param {string} xmlURL - The url to load the atlas file from.
 * @param {string} path - The path of the file.
 * @param {XHRSettingsObject} [textureXhrSettings] - Optional texture file specific XHR settings.
 * @param {XHRSettingsObject} [xmlXhrSettings] - Optional atlas file specific XHR settings.
 */
var BitmapFontFile = new Class({

    Extends: LinkFile,

    initialize:

    function BitmapFontFile (loader, key, textureURL, xmlURL, textureXhrSettings, xmlXhrSettings)
    {
        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            textureURL = GetFastValue(config, 'textureURL');
            xmlURL = GetFastValue(config, 'xmlURL');
            textureXhrSettings = GetFastValue(config, 'textureXhrSettings');
            xmlXhrSettings = GetFastValue(config, 'xmlXhrSettings');
        }

        var image = new ImageFile(loader, key, textureURL, textureXhrSettings);
        var data = new XMLFile(loader, key, xmlURL, xmlXhrSettings);

        LinkFile.call(this, loader, 'bitmapfont', key, [ image, data ]);
    },

    addToCache: function ()
    {
        if (this.failed === 0 && !this.complete)
        {
            var fileA = this.files[0];
            var fileB = this.files[1];

            if (fileA.type === 'image')
            {
                this.loader.cacheManager.bitmapFont.add(fileB.key, { data: ParseXMLBitmapFont(fileB.data), texture: fileA.key, frame: null });

                this.loader.textureManager.addImage(fileA.key, fileA.data);

                //  Add the XML into the XML cache
                fileB.addToCache();
            }
            else
            {
                this.loader.cacheManager.bitmapFont.add(fileA.key, { data: ParseXMLBitmapFont(fileA.data), texture: fileB.key, frame: null });

                this.loader.textureManager.addImage(fileB.key, fileB.data);

                //  Add the XML into the XML cache
                fileA.addToCache();
            }

            this.complete = true;
        }
    }

});

/**
 * Adds a Bitmap Font file to the current load queue.
 *
 * Note: This method will only be available if the Bitmap Font File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#bitmapFont
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} textureURL - [description]
 * @param {string} xmlURL - [description]
 * @param {XHRSettingsObject} [textureXhrSettings] - [description]
 * @param {XHRSettingsObject} [xmlXhrSettings] - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('bitmapFont', function (key, textureURL, xmlURL, textureXhrSettings, xmlXhrSettings)
{
    var linkfile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            linkfile = new BitmapFontFile(this, key[i]);

            this.addFile(linkfile.files);
        }
    }
    else
    {
        linkfile = new BitmapFontFile(this, key, textureURL, xmlURL, textureXhrSettings, xmlXhrSettings);

        this.addFile(linkfile.files);
    }

    return this;
});

module.exports = BitmapFontFile;
