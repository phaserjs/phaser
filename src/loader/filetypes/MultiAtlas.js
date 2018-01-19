var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile.js');
var JSONFile = require('./JSONFile.js');
var NumberArray = require('../utils/array/NumberArray');

//  Phaser.Loader.FileTypes.MultiAtlas

FileTypesManager.register('multiatlas', function (key, textureURLs, atlasURLs, textureXhrSettings, atlasXhrSettings)
{
    if (typeof textureURLs === 'number')
    {
        var total = textureURLs;
        var suffix = (atlasURLs === undefined) ? '' : atlasURLs;

        textureURLs = NumberArray(0, total, key + suffix, '.png');
        atlasURLs = NumberArray(0, total, key + suffix, '.json');
    }
    else
    {
        if (!Array.isArray(textureURLs))
        {
            textureURLs = [ textureURLs ];
        }

        if (!Array.isArray(atlasURLs))
        {
            atlasURLs = [ atlasURLs ];
        }
    }

    var file;
    var i = 0;
    var multiKey;

    this._multilist[key] = [];

    for (i = 0; i < textureURLs.length; i++)
    {
        multiKey = '_MA_IMG_' + key + '_' + i.toString();

        file = new ImageFile(multiKey, textureURLs[i], this.path, textureXhrSettings);

        this.addFile(file);

        this._multilist[key].push(multiKey);
    }

    for (i = 0; i < atlasURLs.length; i++)
    {
        multiKey = '_MA_JSON_' + key + '_' + i.toString();

        file = new JSONFile(multiKey, atlasURLs[i], this.path, atlasXhrSettings);

        this.addFile(file);

        this._multilist[key].push(multiKey);
    }

    return this;
});
