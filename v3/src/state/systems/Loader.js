var CONST = require('../../loader/const');
var BaseLoader = require('../../loader/BaseLoader');
var ImageFile = require('../../loader/filetypes/ImageFile');
var JSONFile = require('../../loader/filetypes/JSONFile');
var AtlasJSONFile = require('../../loader/filetypes/AtlasJSONFile');
var NumberArray = require('../../utils/array/NumberArray');

var Loader = function (state)
{
    BaseLoader.call(this);

    /**
    * @property {Phaser.State} state - The State that owns this Factory
    * @protected
    */
    this.state = state;

    this._multilist = {};
};

Loader.prototype = Object.create(BaseLoader.prototype);
Loader.prototype.constructor = Loader;

Loader.prototype.image = function (key, url)
{
    var file = new ImageFile(key, url, this.path);

    this.addFile(file);

    return this;
};

Loader.prototype.json = function (key, url)
{
    var file = new JSONFile(key, url, this.path);

    this.addFile(file);

    return this;
};

Loader.prototype.atlas = function (key, textureURL, atlasURL)
{
    var file = new AtlasJSONFile(key, textureURL, atlasURL, this.path);

    this.addFile(file);

    return this;
};

Loader.prototype.multiatlas = function (key, textureURLs, atlasURLs)
{
    if (typeof textureURLs === 'number')
    {
        var total = textureURLs;

        textureURLs = NumberArray(0, total, key + '-', '.png');
        atlasURLs = NumberArray(0, total, key + '-', '.json');
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

    this._multilist[key] = [];

    for (i = 0; i < textureURLs.length; i++)
    {
        multiKey = '_MA_IMG_' + key + '_' + i.toString();

        this.addFile(new ImageFile(multiKey, textureURLs[i], this.path));

        this._multilist[key].push(multiKey);
    }

    for (i = 0; i < atlasURLs.length; i++)
    {
        multiKey = '_MA_JSON_' + key + '_' + i.toString();

        this.addFile(new JSONFile(multiKey, atlasURLs[i], this.path));

        this._multilist[key].push(multiKey);
    }
};

//  The Loader has finished
Loader.prototype.processCallback = function ()
{
    if (this.storage.size === 0)
    {
        return;
    }

    //  The global Texture Manager
    var textures = this.state.sys.textures;

    //  Process multiatlas groups first

    var file;

    for (var key in this._multilist)
    {
        var data = [];
        var images = [];
        var keys = this._multilist[key];

        for (var i = 0; i < keys.length; i++)
        {
            file = this.storage.get('key', keys[i]);

            if (file)
            {
                if (file.type === 'image')
                {
                    images.push(file.data);
                }
                else if (file.type === 'json')
                {
                    data.push(file.data);
                }

                this.storage.delete(file);
            }
        }

        //  Do we have everything needed?
        if (images.length + data.length === keys.length)
        {
            //  Yup, add them to the Texture Manager

            //  Is the data JSON Hash or JSON Array?
            if (Array.isArray(data[0].frames))
            {
                textures.addAtlasJSONArray(key, images, data);
            }
            else
            {
                textures.addAtlasJSONHash(key, images, data);
            }
        }
    }

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
        else if (file.type === 'json')
        {
            // console.dir(file.data);
        }
    });

    this.storage.clear();
};

module.exports = Loader;
