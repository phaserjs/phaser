var FileTypesManager = require('../FileTypesManager');
var JSONFile = require('./JSONFile.js');

//  Phaser.Loader.FileTypes.AnimationJSONFile

var AnimationJSONFile = function (key, url, path, xhrSettings)
{
    var json = new JSONFile(key, url, path, xhrSettings);

    //  Override the File type
    json.type = 'animationJSON';

    return json;
};

//  When registering a factory function 'this' refers to the Loader context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory

FileTypesManager.register('animation', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new AnimationJSONFile(key[i], url, this.path, xhrSettings));
        }
    }
    else
    {
        this.addFile(new AnimationJSONFile(key, url, this.path, xhrSettings));
    }

    //  For method chaining
    return this;
});

module.exports = AnimationJSONFile;
