var JSONFile = require('./JSONFile.js');

var TilemapJSONFile = function (key, url, path, format, xhrSettings)
{
    var json = new JSONFile(key, url, path, xhrSettings);

    //  Override the File type
    json.type = 'tilemapJSON';

    json.tilemapFormat = format;

    return json;
};

TilemapJSONFile.create = function (loader, key, url, format, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            loader.addFile(TilemapJSONFile(key[i], url, loader.path, format, xhrSettings));
        }
    }
    else
    {
        loader.addFile(TilemapJSONFile(key, url, loader.path, format, xhrSettings));
    }

    //  For method chaining
    return loader;
};

module.exports = TilemapJSONFile;
