var ImageFile = require('./ImageFile.js');
var JSONFile = require('./JSONFile.js');

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

module.exports = AtlasJSONFile;
