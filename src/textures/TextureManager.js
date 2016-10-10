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
        console.log('TextureManager.addImage', key);

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
        if (this.list[key])
        {
            return this.list[key];
        }

    },

    getFrame: function (key, frame)
    {
        if (this.list[key])
        {
            return this.list[key].get(frame);
        }

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
    },

    /**
     * TODO: This should move to the WebGL Renderer class.
     * 
    * Removes the base texture from the GPU, useful for managing resources on the GPU.
    * A texture is still 100% usable and will simply be re-uploaded if there is a sprite on screen that is using it.
    *
    * @method unloadFromGPU
    */
    unloadFromGPU: function ()
    {
        this.dirty();

        // delete the webGL textures if any.
        for (var i = this._glTextures.length - 1; i >= 0; i--)
        {
            var glTexture = this._glTextures[i];
            var gl = PIXI.glContexts[i];

            if (gl && glTexture)
            {
                gl.deleteTexture(glTexture);
            }
        }

        this._glTextures.length = 0;

        this.dirty();
    },

    /**
     * TODO: This should move to the WebGL Renderer class.
     * 
    * Updates and Creates a WebGL texture for the renderers context.
    *
    * @method updateTexture
    * @param texture {Texture} the texture to update
    * @return {boolean} True if the texture was successfully bound, otherwise false.
    */
    loadToGPU: function (texture)
    {
        if (!texture.hasLoaded)
        {
            return false;
        }

        if (texture.source.compressionAlgorithm)
        {
            return this.updateCompressedTexture(texture);
        }

        var gl = this.gl;

        if (!texture._glTextures[gl.id])
        {
            texture._glTextures[gl.id] = gl.createTexture();
        }

        gl.activeTexture(gl.TEXTURE0 + texture.textureIndex);

        gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultipliedAlpha);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === Phaser.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);

        if (texture.mipmap && Phaser.Math.isPowerOfTwo(texture.width, texture.height))
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === Phaser.scaleModes.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === Phaser.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);
        }

        if (!texture._powerOf2)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }

        texture._dirty[gl.id] = false;

        // return texture._glTextures[gl.id];
        return true;

    }

};
