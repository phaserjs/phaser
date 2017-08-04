var ImageFile = require('./ImageFile.js');

//  config can include: frameWidth, frameHeight, startFrame, endFrame, margin, spacing

var SpriteSheet = function (key, url, config, path, xhrSettings)
{
    var image = new ImageFile(key, url, path, xhrSettings, config);

    //  Override the File type
    image.type = 'spritesheet';

    return image;
};

SpriteSheet.create = function (loader, key, url, config, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            loader.addFile(new SpriteSheet(key[i], url, null, loader.path, xhrSettings));
        }
    }
    else
    {
        loader.addFile(new SpriteSheet(key, url, config, loader.path, xhrSettings));
    }

    //  For method chaining
    return loader;
};

module.exports = SpriteSheet;
