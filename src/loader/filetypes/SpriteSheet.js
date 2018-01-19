var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile.js');

//  config can include: frameWidth, frameHeight, startFrame, endFrame, margin, spacing

var SpriteSheet = function (key, url, config, path, xhrSettings)
{
    var image = new ImageFile(key, url, path, xhrSettings, config);

    //  Override the File type
    image.type = 'spritesheet';

    return image;
};

//  When registering a factory function 'this' refers to the Loader context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory

//  config can include: frameWidth, frameHeight, startFrame, endFrame, margin, spacing
FileTypesManager.register('spritesheet', function (key, url, config, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new SpriteSheet(key[i], url, null, this.path, xhrSettings));
        }
    }
    else
    {
        this.addFile(new SpriteSheet(key, url, config, this.path, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = SpriteSheet;
