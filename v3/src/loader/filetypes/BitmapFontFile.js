var ImageFile = require('./ImageFile.js');
var XMLFile = require('./XMLFile.js');

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

module.exports = BitmapFontFile;
