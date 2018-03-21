/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile.js');
var XMLFile = require('./XMLFile.js');

/**
 * An Bitmap Font File.
 *
 * @function Phaser.Loader.FileTypes.BitmapFontFile
 * @since 3.0.0
 *
 * @param {string} key - The key of the file within the loader.
 * @param {string} textureURL - The url to load the texture file from.
 * @param {string} xmlURL - The url to load the atlas file from.
 * @param {string} path - The path of the file.
 * @param {XHRSettingsObject} textureXhrSettings - Optional texture file specific XHR settings.
 * @param {XHRSettingsObject} xmlXhrSettings - Optional atlas file specific XHR settings.
 *
 * @return {object} An object containing two File objects to be added to the loader.
 */
var BitmapFontFile = function (key, textureURL, xmlURL, path, textureXhrSettings, xmlXhrSettings)
{
    var image = new ImageFile(key, textureURL, path, textureXhrSettings);
    var data = new XMLFile(key, xmlURL, path, xmlXhrSettings);

    //  Link them together
    image.linkFile = data;
    data.linkFile = image;

    //  Set the type
    image.linkType = 'bitmapfont';
    data.linkType = 'bitmapfont';

    return { texture: image, data: data };
};

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
 * @param {XHRSettingsObject} textureXhrSettings - [description]
 * @param {XHRSettingsObject} xmlXhrSettings - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('bitmapFont', function (key, textureURL, xmlURL, textureXhrSettings, xmlXhrSettings)
{
    //  Returns an object with two properties: 'texture' and 'data'
    var files = new BitmapFontFile(key, textureURL, xmlURL, this.path, textureXhrSettings, xmlXhrSettings);

    this.addFile(files.texture);
    this.addFile(files.data);

    return this;
});

module.exports = BitmapFontFile;
