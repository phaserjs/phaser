var ImageFile = require('./ImageFile.js');
var TextFile = require('./TextFile.js');

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

module.exports = UnityAtlasFile;
