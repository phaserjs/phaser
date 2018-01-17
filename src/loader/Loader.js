var BaseLoader = require('./BaseLoader');
var Class = require('../utils/Class');
var CONST = require('./const');
var NumberArray = require('../utils/array/NumberArray');
var PluginManager = require('../plugins/PluginManager');

//  TODO - Injection mapped
var AnimationJSONFile = require('./filetypes/AnimationJSONFile');
var AtlasJSONFile = require('./filetypes/AtlasJSONFile');
var AudioFile = require('./filetypes/AudioFile');
var BinaryFile = require('./filetypes/BinaryFile');
var BitmapFontFile = require('./filetypes/BitmapFontFile');
var GLSLFile = require('./filetypes/GLSLFile');
var HTMLFile = require('./filetypes/HTMLFile');
var ImageFile = require('./filetypes/ImageFile');
var JSONFile = require('./filetypes/JSONFile');
var ScriptFile = require('./filetypes/ScriptFile');
var SpriteSheet = require('./filetypes/SpriteSheet');
var SVGFile = require('./filetypes/SVGFile');
var TextFile = require('./filetypes/TextFile');
var TilemapCSVFile = require('./filetypes/TilemapCSVFile');
var TilemapJSONFile = require('./filetypes/TilemapJSONFile');
var UnityAtlasFile = require('./filetypes/UnityAtlasFile');
var WavefrontFile = require('./filetypes/WavefrontFile');
var XMLFile = require('./filetypes/XMLFile');

var Loader = new Class({

    Extends: BaseLoader,

    initialize:

    function Loader (scene)
    {
        BaseLoader.call(this, scene);

        this.systems = scene.sys;

        this.mapping = 'load';

        this.systems.events.on('boot', this.boot, this);

        this._multilist = {};
    },

    boot: function ()
    {
        this.systems.inject(this);

        this.systems.events.on('shutdown', this.shutdown, this);
        this.systems.events.on('destroy', this.destroy, this);
    },

    //  key can be either a string, an object or an array of objects

    image: function (key, url, xhrSettings)
    {
        return ImageFile.create(this, key, url, xhrSettings);
    },

    animation: function (key, url, xhrSettings)
    {
        return AnimationJSONFile.create(this, key, url, xhrSettings);
    },

    json: function (key, url, xhrSettings)
    {
        return JSONFile.create(this, key, url, xhrSettings);
    },

    script: function (key, url, xhrSettings)
    {
        return ScriptFile.create(this, key, url, xhrSettings);
    },

    xml: function (key, url, xhrSettings)
    {
        return XMLFile.create(this, key, url, xhrSettings);
    },

    binary: function (key, url, xhrSettings)
    {
        return BinaryFile.create(this, key, url, xhrSettings);
    },

    text: function (key, url, xhrSettings)
    {
        return TextFile.create(this, key, url, xhrSettings);
    },

    glsl: function (key, url, xhrSettings)
    {
        return GLSLFile.create(this, key, url, xhrSettings);
    },

    html: function (key, url, width, height, xhrSettings)
    {
        return HTMLFile.create(this, key, url, width, height, xhrSettings);
    },

    svg: function (key, url, xhrSettings)
    {
        return SVGFile.create(this, key, url, xhrSettings);
    },

    obj: function (key, url, xhrSettings)
    {
        return WavefrontFile.create(this, key, url, xhrSettings);
    },

    //  config can include: frameWidth, frameHeight, startFrame, endFrame, margin, spacing
    spritesheet: function (key, url, config, xhrSettings)
    {
        return SpriteSheet.create(this, key, url, config, xhrSettings);
    },

    //  config can include: instances
    audio: function (key, urls, config, xhrSettings)
    {
        var audioFile = AudioFile.create(this, key, urls, config, xhrSettings);

        if(audioFile)
        {
            this.addFile(audioFile);
        }

        return this;
    },

    tilemapCSV: function (key, url, xhrSettings)
    {
        return TilemapCSVFile.create(this, key, url, xhrSettings);
    },

    tilemapJSON: function (key, url, xhrSettings)
    {
        return TilemapJSONFile.create(this, key, url, xhrSettings);
    },

    //  ---------------------------------------------------
    //  Multi-File Loaders
    //  ---------------------------------------------------

    audioSprite: function (key, urls, json, config, audioXhrSettings, jsonXhrSettings)
    {
        var audioFile = AudioFile.create(this, key, urls, config, audioXhrSettings);

        if(audioFile)
        {
            var jsonFile;

            if (typeof json === 'string')
            {
                jsonFile = new JSONFile(key, json, this.path, jsonXhrSettings);

                this.addFile(jsonFile);
            }
            else
            {
                jsonFile = {
                    type: 'json',
                    key: key,
                    data: json,
                    state: CONST.FILE_WAITING_LINKFILE
                };
            }

            //  Link them together
            audioFile.linkFile = jsonFile;
            jsonFile.linkFile = audioFile;

            //  Set the type
            audioFile.linkType = 'audioSprite';
            jsonFile.linkType = 'audioSprite';

            this.addFile(audioFile);
        }

        return this;
    },

    unityAtlas: function (key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings)
    {
        //  Returns an object with two properties: 'texture' and 'data'
        var files = new UnityAtlasFile(key, textureURL, atlasURL, this.path, textureXhrSettings, atlasXhrSettings);

        this.addFile(files.texture);
        this.addFile(files.data);

        return this;
    },

    atlas: function (key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings)
    {
        //  Returns an object with two properties: 'texture' and 'data'
        var files = new AtlasJSONFile(key, textureURL, atlasURL, this.path, textureXhrSettings, atlasXhrSettings);

        this.addFile(files.texture);
        this.addFile(files.data);

        return this;
    },

    bitmapFont: function (key, textureURL, xmlURL, textureXhrSettings, xmlXhrSettings)
    {
        //  Returns an object with two properties: 'texture' and 'data'
        var files = new BitmapFontFile(key, textureURL, xmlURL, this.path, textureXhrSettings, xmlXhrSettings);

        this.addFile(files.texture);
        this.addFile(files.data);

        return this;
    },

    multiatlas: function (key, textureURLs, atlasURLs, textureXhrSettings, atlasXhrSettings)
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
    },

    loadArray: function (files)
    {
        if (Array.isArray(files))
        {
            for (var i = 0; i < files.length; i++)
            {
                this.file(files[i]);
            }
        }

        return (this.list.size > 0);
    },

    file: function (file)
    {
        var entry;

        switch (file.type)
        {
            case 'spritesheet':
                entry = this.spritesheet(file.key, file.url, file.config, file.xhrSettings);
                break;

            case 'atlas':
                entry = this.atlas(file.key, file.textureURL, file.atlasURL, file.textureXhrSettings, file.atlasXhrSettings);
                break;

            case 'bitmapFont':
                entry = this.bitmapFont(file.key, file.textureURL, file.xmlURL, file.textureXhrSettings, file.xmlXhrSettings);
                break;

            case 'multiatlas':
                entry = this.multiatlas(file.key, file.textureURLs, file.atlasURLs, file.textureXhrSettings, file.atlasXhrSettings);
                break;

            case 'audioSprite':
                entry = this.audioSprite(file.key, file.urls, file.json, file.config, file.audioXhrSettings, file.jsonXhrSettings);
                break;

            //  image, json, xml, binary, text, glsl, svg, obj
            default:
                entry = this[file.type](file.key, file.url, file.xhrSettings);
                break;
        }

        return entry;
    },

    shutdown: function ()
    {

    }

});

PluginManager.register('load', Loader);

module.exports = Loader;
