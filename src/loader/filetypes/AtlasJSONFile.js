var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile.js');
var JSONFile = require('./JSONFile.js');

/**
 * [description]
 *
 * @function Phaser.Loader.Filetypes.AtlasJSONFile
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} textureURL - [description]
 * @param {string} atlasURL - [description]
 * @param {string} path - [description]
 * @param {object} textureXhrSettings - [description]
 * @param {object} atlasXhrSettings - [description]
 *
 * @return {object} [description]
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

FileTypesManager.register('atlas', function (key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings)
{
    //  Returns an object with two properties: 'texture' and 'data'
    var files = new AtlasJSONFile(key, textureURL, atlasURL, this.path, textureXhrSettings, atlasXhrSettings);

    this.addFile(files.texture);
    this.addFile(files.data);

    return this;
});

module.exports = AtlasJSONFile;
