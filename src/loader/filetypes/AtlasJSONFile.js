/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile.js');
var JSONFile = require('./JSONFile.js');

/**
 * An Atlas JSON File.
 *
 * @function Phaser.Loader.Filetypes.AtlasJSONFile
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
var AtlasJSONFile = function (key, textureURL, atlasURL, path, textureXhrSettings, atlasXhrSettings)
{
    var image = new ImageFile(key, textureURL, path, textureXhrSettings);
    var data = new JSONFile(key, atlasURL, path, atlasXhrSettings);

    //  Link them together
    image.linkFile = data;
    data.linkFile = image;

    //  Set the type
    image.linkType = 'atlasjson';
    data.linkType = 'atlasjson';

    return { texture: image, data: data };
};

/**
 * Adds a Texture Atlas file to the current load queue.
 *
 * Note: This method will only be available if the Atlas JSON File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#atlas
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
FileTypesManager.register('atlas', function (key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings)
{

    var files;

    // If param key is an object, use object based loading method
    if ((typeof key === 'object') && (key !== null))
    {
        files = new AtlasJSONFile(key.key, key.texture, key.data, this.path, textureXhrSettings, atlasXhrSettings);
    }

    // Else just use the parameters like normal
    else
    {
        //  Returns an object with two properties: 'texture' and 'data'
        files = new AtlasJSONFile(key, textureURL, atlasURL, this.path, textureXhrSettings, atlasXhrSettings);
    }

    this.addFile(files.texture);
    this.addFile(files.data);

    return this;
});

module.exports = AtlasJSONFile;
