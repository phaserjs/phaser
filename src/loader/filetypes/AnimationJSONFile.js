var JSONFile = require('./JSONFile.js');

var AnimationJSONFile = function (key, url, path, xhrSettings)
{
    var json = new JSONFile(key, url, path, xhrSettings);

    //  Override the File type
    json.type = 'animationJSON';

    return json;
};

AnimationJSONFile.create = function (loader, key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            loader.addFile(new AnimationJSONFile(key[i], url, loader.path, xhrSettings));
        }
    }
    else
    {
        loader.addFile(new AnimationJSONFile(key, url, loader.path, xhrSettings));
    }

    //  For method chaining
    return loader;
};

module.exports = AnimationJSONFile;
