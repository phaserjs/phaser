var FileTypesManager = require('../FileTypesManager');
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

//  When registering a factory function 'this' refers to the Loader context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory

FileTypesManager.register('bitmapFont', function (key, textureURL, xmlURL, textureXhrSettings, xmlXhrSettings)
{
    //  Returns an object with two properties: 'texture' and 'data'
    var files = new BitmapFontFile(key, textureURL, xmlURL, this.path, textureXhrSettings, xmlXhrSettings);

    this.addFile(files.texture);
    this.addFile(files.data);

    return this;
});

module.exports = BitmapFontFile;
