var ImageFile = require('./ImageFile.js');
var JSONFile = require('./JSONFile.js');

var AtlasJSONFile = function (key, textureURL, atlasURL, path)
{
    var image = new ImageFile(key, textureURL, path);
    var data = new JSONFile(key, atlasURL, path);

    //  Link them together
    image.linkFile = data;
    data.linkFile = image;

    return image;
};

module.exports = AtlasJSONFile;
