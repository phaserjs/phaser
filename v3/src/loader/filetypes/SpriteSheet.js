var ImageFile = require('./ImageFile.js');

//  config can include: frameWidth, frameHeight, startFrame, endFrame, margin, spacing

var SpriteSheet = function (key, url, config, path, xhrSettings)
{
    var image = new ImageFile(key, url, path, xhrSettings, config);

    //  Override the File type
    image.type = 'spritesheet';

    return image;
};

module.exports = SpriteSheet;
