/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Parser = require('./parsers');
var Texture = require('./Texture');
var CanvasPool = require('../dom/CanvasPool');
var GetValue = require('../utils/object/GetValue');

/**
* Textures are managed by the global TextureManager. This is a singleton class that is
* responsible for creating and delivering Textures and their corresponding Frames to Game Objects.
*
* Sprites and other Game Objects get the texture data they need from the TextureManager.
*
* Access it via `state.textures`.
*
* @class Phaser.TextureManager
* @constructor
*/
var TextureManager = function (game)
{
    this.game = game;

    this.list = {};

    this.addBase64('__DEFAULT', game.config.defaultImage);
    this.addBase64('__MISSING', game.config.missingImage);
};

TextureManager.prototype.constructor = TextureManager;

TextureManager.prototype = {

    addBase64: function (key, data)
    {
        var _this = this;
        var image = new Image();

        image.onload = function ()
        {
            var texture = _this.create(key, image);
        
            Parser.Image(texture, 0);
        };

        image.src = data;
    },

    addImage: function (key, source)
    {
        var texture = this.create(key, source);
        
        Parser.Image(texture, 0);

        return texture;
    },

    createCanvas: function (key, width, height)
    {
        if (width === undefined) { width = 256; }
        if (height === undefined) { height = 256; }

        var canvas = CanvasPool.create(this, width, height);

        return this.addCanvas(key, canvas);
    },

    addCanvas: function (key, source)
    {
        var texture = this.create(key, source);
        
        Parser.Canvas(texture, 0);

        return texture;
    },

    addAtlas: function (key, source, data)
    {
        //  Is it a Hash or an Array?

        if (Array.isArray(data.frames))
        {
            return this.addAtlasJSONArray(key, source, data);
        }
        else
        {
            return this.addAtlasJSONHash(key, source, data);
        }
    },

    addAtlasJSONArray: function (key, source, data)
    {
        var texture = this.create(key, source);

        if (Array.isArray(data))
        {
            for (var i = 0; i < data.length; i++)
            {
                Parser.JSONArray(texture, i, data[i]);
            }
        }
        else
        {
            Parser.JSONArray(texture, 0, data);
        }

        return texture;
    },

    addAtlasJSONHash: function (key, source, data)
    {
        var texture = this.create(key, source);

        if (Array.isArray(data))
        {
            for (var i = 0; i < data.length; i++)
            {
                Parser.JSONHash(texture, i, data[i]);
            }
        }
        else
        {
            Parser.JSONHash(texture, 0, data);
        }

        return texture;
    },

    /**
     * [addSpriteSheet description]
     * @param {[type]} key    [description]
     * @param {[type]} source [description]
     * @param {[type]} config [description]
     * @param {number} config.frameWidth - The fixed width of each frame.
     * @param {number} [config.frameHeight] - The fixed height of each frame. If not set it will use the frameWidth as the height.
     * @param {number} [config.startFrame=0] - Skip a number of frames. Useful when there are multiple sprite sheets in one Texture.
     * @param {number} [config.endFrame=-1] - The total number of frames to extract from the Sprite Sheet. The default value of -1 means "extract all frames".
     * @param {number} [config.margin=0] - If the frames have been drawn with a margin, specify the amount here.
     * @param {number} [config.spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
     */
    addSpriteSheet: function (key, source, config)
    {
        var texture = this.create(key, source);

        var width = texture.source[0].width;
        var height = texture.source[0].height;

        Parser.SpriteSheet(texture, 0, 0, 0, width, height, config);

        return texture;
    },

    addSpriteSheetFromAtlas: function (key, config)
    {
        var atlasKey = GetValue(config, 'atlas', null);
        var atlasFrame = GetValue(config, 'frame', null);

        if (!atlasKey || !atlasFrame)
        {
            return;
        }

        var atlas = this.get(atlasKey);
        var sheet = atlas.get(atlasFrame);

        if (sheet)
        {
            var texture = this.create(key, sheet.source.image);

            // {
            //     "filename": "explosion",
            //     "frame": {"x":2,"y":2,"w":319,"h":312}, = cutX, Y, W, H
            //     "rotated": false,
            //     "trimmed": true,
            //     "spriteSourceSize": {"x":1,"y":6,"w":319,"h":312},
            //     "sourceSize": {"w":320,"h":320},
            //     "pivot": {"x":0.5,"y":0.5}
            // },

            //  If trimmed we need to help the parser adjust

            console.log(sheet);

            if (sheet.trimmed)
            {
                Parser.SpriteSheetFromAtlas(texture, sheet, config);
            }
            else
            {
                Parser.SpriteSheet(texture, 0, sheet.cutX, sheet.cutY, sheet.cutWidth, sheet.cutHeight, config);
            }

            return texture;
        }
    },

    addAtlasStarlingXML: function (key, source, data)
    {
        var texture = this.create(key, source);

        if (Array.isArray(data))
        {
            for (var i = 0; i < data.length; i++)
            {
                Parser.StarlingXML(texture, i, data[i]);
            }
        }
        else
        {
            Parser.StarlingXML(texture, 0, data);
        }

        return texture;
    },

    addAtlasPyxel: function (key, source, data)
    {
        var texture = this.create(key, source);

        if (Array.isArray(data))
        {
            for (var i = 0; i < data.length; i++)
            {
                Parser.Pyxel(texture, i, data[i]);
            }
        }
        else
        {
            Parser.Pyxel(texture, 0, data);
        }

        return texture;
    },

    create: function (key, source, width, height)
    {
        var texture = new Texture(this, key, source, width, height);

        this.list[key] = texture;

        return texture;
    },

    exists: function (key)
    {
        return (this.list.hasOwnProperty(key));
    },

    get: function (key)
    {
        if (key === undefined) { key = '__DEFAULT'; }

        if (this.list[key])
        {
            return this.list[key];
        }
        else
        {
            return this.list['__MISSING'];
        }
    },

    cloneFrame: function (key, frame)
    {
        if (this.list[key])
        {
            return this.list[key].get(frame).clone();
        }
    },

    getFrame: function (key, frame)
    {
        if (this.list[key])
        {
            return this.list[key].get(frame);
        }
    },

    setTexture: function (gameObject, key, frame)
    {
        if (this.list[key])
        {
            gameObject.texture = this.list[key];
            gameObject.frame = gameObject.texture.get(frame);
        }

        return gameObject;
    },

    /**
    * Passes all Textures to the given callback.
    *
    * @method each
    * @param {function} callback - The function to call.
    * @param {object} [thisArg] - Value to use as `this` when executing callback.
    * @param {...*} [arguments] - Additional arguments that will be passed to the callback, after the child.
    */
    each: function (callback, thisArg)
    {
        var args = [ null ];

        for (var i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (var texture in this.list)
        {
            args[0] = this.list[texture];

            callback.apply(thisArg, args);
        }
    }

};

module.exports = TextureManager;
