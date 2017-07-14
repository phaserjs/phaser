var BaseLoader = require('../loader/BaseLoader');
var Class = require('../utils/Class');
// var CONST = require('../loader/const');
var NumberArray = require('../utils/array/NumberArray');

var AnimationJSONFile = require('../loader/filetypes/AnimationJSONFile');
var AtlasJSONFile = require('../loader/filetypes/AtlasJSONFile');
var BinaryFile = require('../loader/filetypes/BinaryFile');
var BitmapFontFile = require('../loader/filetypes/BitmapFontFile');
var GLSLFile = require('../loader/filetypes/GLSLFile');
var HTMLFile = require('../loader/filetypes/HTMLFile');
var ImageFile = require('../loader/filetypes/ImageFile');
var JSONFile = require('../loader/filetypes/JSONFile');
var ScriptFile = require('../loader/filetypes/ScriptFile');
var SpriteSheet = require('../loader/filetypes/SpriteSheet');
var SVGFile = require('../loader/filetypes/SVGFile');
var TextFile = require('../loader/filetypes/TextFile');
var XMLFile = require('../loader/filetypes/XMLFile');

var ParseXMLBitmapFont = require('../gameobjects/bitmaptext/ParseXMLBitmapFont');

var Loader = new Class({

    Extends: BaseLoader,

    initialize:

    function Loader (scene)
    {
        BaseLoader.call(this);

        /**
        * @property {Phaser.Scene} scene - The Scene that owns this Factory
        * @protected
        */
        this.scene = scene;

        this._multilist = {};
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
            case 'image':
            case 'json':
            case 'xml':
            case 'binary':
            case 'text':
            case 'glsl':
            case 'svg':
                entry = this[file.type](file.key, file.url, file.xhrSettings);
                break;

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
        }

        return entry;
    },

    image: function (key, url, xhrSettings)
    {
        var file = new ImageFile(key, url, this.path, xhrSettings);

        return this.addFile(file);
    },

    animation: function (key, url, xhrSettings)
    {
        var file = new AnimationJSONFile(key, url, this.path, xhrSettings);

        return this.addFile(file);
    },

    json: function (key, url, xhrSettings)
    {
        var file = new JSONFile(key, url, this.path, xhrSettings);

        return this.addFile(file);
    },

    script: function (key, url, xhrSettings)
    {
        var file = new ScriptFile(key, url, this.path, xhrSettings);

        return this.addFile(file);
    },

    xml: function (key, url, xhrSettings)
    {
        var file = new XMLFile(key, url, this.path, xhrSettings);

        return this.addFile(file);
    },

    binary: function (key, url, xhrSettings)
    {
        var file = new BinaryFile(key, url, this.path, xhrSettings);

        return this.addFile(file);
    },

    text: function (key, url, xhrSettings)
    {
        var file = new TextFile(key, url, this.path, xhrSettings);

        return this.addFile(file);
    },

    glsl: function (key, url, xhrSettings)
    {
        var file = new GLSLFile(key, url, this.path, xhrSettings);

        return this.addFile(file);
    },

    //  config can include: frameWidth, frameHeight, startFrame, endFrame, margin, spacing
    spritesheet: function (key, url, config, xhrSettings)
    {
        var file = new SpriteSheet(key, url, config, this.path, xhrSettings);

        return this.addFile(file);
    },

    html: function (key, url, width, height, xhrSettings)
    {
        var file = new HTMLFile(key, url, width, height, this.path, xhrSettings);

        return this.addFile(file);
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

    svg: function (key, url, xhrSettings)
    {
        var file = new SVGFile(key, url, this.path, xhrSettings);

        return this.addFile(file);
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

    //  The Loader has finished
    processCallback: function ()
    {
        if (this.storage.size === 0)
        {
            return;
        }

        //  The global Texture Manager
        var cache = this.scene.sys.cache;
        var textures = this.scene.sys.textures;
        var anims = this.scene.sys.anims;

        //  Process multiatlas groups first

        var file;
        var fileA;
        var fileB;

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

        //  Process all of the files

        //  Because AnimationJSON may require images to be loaded first, we process them last
        var animJSON = [];

        this.storage.each(function (file)
        {
            switch (file.type)
            {
                case 'animationJSON':
                    animJSON.push(file);
                    break;

                case 'image':
                case 'svg':
                case 'html':
                    textures.addImage(file.key, file.data);
                    break;

                case 'atlasjson':

                    fileA = file.fileA;
                    fileB = file.fileB;

                    if (fileA.type === 'image')
                    {
                        textures.addAtlas(fileA.key, fileA.data, fileB.data);
                    }
                    else
                    {
                        textures.addAtlas(fileB.key, fileB.data, fileA.data);
                    }
                    break;

                case 'bitmapfont':

                    fileA = file.fileA;
                    fileB = file.fileB;

                    if (fileA.type === 'image')
                    {
                        cache.bitmapFont.add(fileB.key, { data: ParseXMLBitmapFont(fileB.data), texture: fileA.key, frame: null });
                        textures.addImage(fileA.key, fileA.data);
                    }
                    else
                    {
                        cache.bitmapFont.add(fileA.key, { data: ParseXMLBitmapFont(fileA.data), texture: fileB.key, frame: null });
                        textures.addImage(fileB.key, fileB.data);
                    }
                    break;

                case 'spritesheet':
                    textures.addSpriteSheet(file.key, file.data, file.config);
                    break;

                case 'json':
                    cache.json.add(file.key, file.data);
                    break;

                case 'xml':
                    cache.xml.add(file.key, file.data);
                    break;

                case 'text':
                    cache.text.add(file.key, file.data);
                    break;

                case 'binary':
                    cache.binary.add(file.key, file.data);
                    break;

                case 'sound':
                    cache.sound.add(file.key, file.data);
                    break;

                case 'glsl':
                    cache.shader.add(file.key, file.data);
                    break;
            }
        });

        animJSON.forEach(function (file)
        {
            anims.fromJSON(file.data);
        });

        this.storage.clear();
    }
    
});

module.exports = Loader;

