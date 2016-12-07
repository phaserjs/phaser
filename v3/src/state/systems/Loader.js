var CONST = require('../../loader/const');
var BaseLoader = require('../../loader/BaseLoader');
var ImageLoader = require('../../loader/filetypes/ImageFile');
var AtlasJSONFile = require('../../loader/filetypes/AtlasJSONFile');

var Loader = function (state)
{
    BaseLoader.call(this);

    /**
    * @property {Phaser.State} state - The State that owns this Factory
    * @protected
    */
    this.state = state;
};

Loader.prototype = Object.create(BaseLoader.prototype);
Loader.prototype.constructor = Loader;

Loader.prototype.image = function (key, url)
{
    var file = new ImageLoader(key, url, this.path);

    this.addFile(file);

    return this;
};

Loader.prototype.atlas = function (key, textureURL, atlasURL)
{
    var file = new AtlasJSONFile(key, textureURL, atlasURL, this.path);

    this.addFile(file);

    return this;
};

/**
 * @method Phaser.Loader#multiatlas
 * @param {string} key - Unique asset key of the texture atlas file.
 * @param {array|integer} textureURLs - An array of PNG files, or an integer.
 * @param {array} [atlasURLs] -  An array of JSON files.
 * @param {number} [format] - The format of the data. Can be Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY (the default), Phaser.Loader.TEXTURE_ATLAS_JSON_HASH or Phaser.Loader.TEXTURE_ATLAS_XML_STARLING.
 * @return {Phaser.Loader} This Loader instance.
 */
Loader.prototype.multiatlas = function (key, textureURLs, atlasURLs, format)
{
    if (format === undefined) { format = CONST.TEXTURE_ATLAS_JSON_ARRAY; }

    if (typeof textureURLs === 'number')
    {
        var total = textureURLs;

        textureURLs = Phaser.ArrayUtils.numberArray(0, total, key + '-', '.png');
        atlasURLs = Phaser.ArrayUtils.numberArray(0, total, key + '-', '.json');
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

    var i = 0;
    var multiKey;
    var imgs = [];
    var data = [];

    for (i = 0; i < textureURLs.length; i++)
    {
        //  TODO - Add support for compressed textures
        multiKey = '_MA_' + key + '_' + i.toString();

        imgs.push(multiKey);

        this.addToFileList('image', multiKey, textureURLs[i], { multiatlas: true });
    }

    for (i = 0; i < atlasURLs.length; i++)
    {
        multiKey = '_MA_' + key + '_' + i.toString();

        data.push(multiKey);

        //   Check if this can support XML as well?
        this.addToFileList('json', multiKey, atlasURLs[i], { multiatlas: true });
    }

    this._multilist.push({ key: key, images: imgs, data: data, format: format });


};

Loader.prototype.processCallback = function ()
{
    //  All of the files have loaded. Now to put them into the Cache.
    if (this.storage.size === 0)
    {
        return;
    }

    //  The global Texture Manager
    var textures = this.state.sys.textures;

    this.storage.each(function (file)
    {
        if (file.type === 'image')
        {
            textures.addImage(file.key, file.data);
        }
        else if (file.type === 'atlasjson')
        {
            var fileA = file.fileA;
            var fileB = file.fileB;

            if (fileA.type === 'image')
            {
                textures.addAtlas(fileA.key, fileA.data, fileB.data);
            }
            else
            {
                textures.addAtlas(fileB.key, fileB.data, fileA.data);
            }
        }
    });

    this.storage.clear();
};

module.exports = Loader;
