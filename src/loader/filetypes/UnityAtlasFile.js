/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile.js');
var TextFile = require('./TextFile.js');

/**
 * An Atlas JSON File.
 *
 * @function Phaser.Loader.Filetypes.UnityAtlasFile
 * @since 3.0.0
 *
 * @param {string} key - The key of the file within the loader.
 * @param {string} textureURL - The url to load the texture file from.
 * @param {string} atlasURL - The url to load the atlas file from.
 * @param {string} path - The path of the file.
 * @param {object} textureXhrSettings - Optional texture file specific XHR settings.
 * @param {object} atlasXhrSettings - Optional atlas file specific XHR settings.
 *
 * @return {object} An object containing two File objects to be added to the loader.
 */
var UnityAtlasFile = function (key, textureURL, atlasURL, path, textureXhrSettings, atlasXhrSettings)
{
    var image = new ImageFile(key, textureURL, path, textureXhrSettings);
    var data = new TextFile(key, atlasURL, path, atlasXhrSettings);

    //  Link them together
    image.linkFile = data;
    data.linkFile = image;

    //  Set the type
    image.linkType = 'unityatlas';
    data.linkType = 'unityatlas';

    return { texture: image, data: data };
};

/**
 * Adds a Unity Texture Atlas file to the current load queue.
 * 
 * Note: This method will only be available if the Unity Atlas File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#unityAtlas
 * @since 3.0.0
 *
 * @param {string} key - The key of the file within the loader.
 * @param {string} textureURL - The url to load the texture file from.
 * @param {string} atlasURL - The url to load the atlas file from.
 * @param {object} textureXhrSettings - Optional texture file specific XHR settings.
 * @param {object} atlasXhrSettings - Optional atlas file specific XHR settings.
 * 
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('unityAtlas', function (key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings)
{
    //  Returns an object with two properties: 'texture' and 'data'
    var files = new UnityAtlasFile(key, textureURL, atlasURL, this.path, textureXhrSettings, atlasXhrSettings);

    this.addFile(files.texture);
    this.addFile(files.data);

    return this;

});

module.exports = UnityAtlasFile;
