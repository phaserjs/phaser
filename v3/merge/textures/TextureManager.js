/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

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
* @param {Phaser.Game} game
*/
Phaser.TextureManager = function (game)
{
    this.game = game;

    this.list = {};

    this.parsers = {
        Image: Phaser.TextureManager.Parsers.Image,
        Canvas: Phaser.TextureManager.Parsers.Canvas,
        JSONArray: Phaser.TextureManager.Parsers.JSONArray,
        JSONHash: Phaser.TextureManager.Parsers.JSONHash,
        StarlingXML: Phaser.TextureManager.Parsers.StarlingXML,
        Pyxel: Phaser.TextureManager.Parsers.Pyxel,
        SpriteSheet: Phaser.TextureManager.Parsers.SpriteSheet
    };
};

Phaser.TextureManager.prototype.constructor = Phaser.TextureManager;

//  Where the different parsers hook themselves
Phaser.TextureManager.Parsers = {};

Phaser.TextureManager.prototype = {

    addImage: function (key, source)
    {
        var texture = this.create(key, source);
        
        this.parsers.Image(texture, 0);

        return texture;

    },

    addCanvas: function (key, source)
    {
        var texture = this.create(key, source);
        
        this.parsers.Canvas(texture, 0);

        return texture;

    },

    addAtlasJSONArray: function (key, source, data)
    {
        var texture = this.create(key, source);

        if (Array.isArray(data))
        {
            for (var i = 0; i < data.length; i++)
            {
                this.parsers.JSONArray(texture, i, data[i]);
            }
        }
        else
        {
            this.parsers.JSONArray(texture, 0, data);
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
                this.parsers.JSONHash(texture, i, data[i]);
            }
        }
        else
        {
            this.parsers.JSONHash(texture, 0, data);
        }

        return texture;
    },

    addSpriteSheet: function (key, source, frameWidth, frameHeight, startFrame, endFrame, margin, spacing)
    {
        var texture = this.create(key, source);

        var width = texture.source[0].width;
        var height = texture.source[0].height;

        this.parsers.SpriteSheet(texture, 0, 0, 0, width, height, frameWidth, frameHeight, startFrame, endFrame, margin, spacing);

        return texture;
    },

    addSpriteSheetFromAtlas: function (key, atlasKey, atlasFrame, frameWidth, frameHeight, startFrame, endFrame, margin, spacing)
    {
        var atlas = this.get(atlasKey);
        var sheet = atlas.get(atlasFrame);

        if (sheet)
        {
            var texture = this.create(key, sheet.source.image);

            this.parsers.SpriteSheet(texture, 0, sheet.cutX, sheet.cutY, sheet.cutWidth, sheet.cutHeight, frameWidth, frameHeight, startFrame, endFrame, margin, spacing);

            return texture;
        }
    },

    /*
    addAtlasStarlingXML: function (key, source, data)
    {
        var texture = this.create(key, source);

        return Phaser.TextureManager.Parsers.StarlingXML(texture, data);
    },

    addAtlasPyxel: function (key, source, data)
    {
        var texture = this.create(key, source);

        return Phaser.TextureManager.Parsers.Pyxel(texture, data);
    },
    */

    create: function (key, source)
    {
        var texture = new Phaser.Texture(this, key, source);

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
