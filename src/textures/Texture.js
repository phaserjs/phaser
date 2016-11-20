/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Texture consists of a source, usually an Image from the Cache, or a Canvas, and a collection
* of Frames. The Frames represent the different areas of the Texture. For example a texture atlas
* may have many Frames, one for each element within the atlas. Where-as a single image would have
* just one frame, that encompasses the whole image.
*
* Textures are managed by the global TextureManager. This is a singleton class that is
* responsible for creating and delivering Textures and their corresponding Frames to Game Objects.
*
* Sprites and other Game Objects get the texture data they need from the TextureManager.
*
* @class Phaser.Texture
* @constructor
* @param {object} source
* @param {number} scaleMode
*/
Phaser.Texture = function (manager, key, source)
{
    this.manager = manager;

    if (!Array.isArray(source))
    {
        source = [ source ];
    }

    this.key = key;

    /**
    * The source that is used to create the texture.
    * Usually an Image, but can also be a Canvas.
    *
    * @property source
    * @type array
    */
    this.source = [];

    /**
    * @property {object} frames - Frames
    */
    this.frames = {};

    this.frameTotal = 0;

    //  Load the Sources
    for (var i = 0; i < source.length; i++)
    {
        this.source.push(new Phaser.TextureSource(this, source[i]));
    }
};

Phaser.Texture.prototype.constructor = Phaser.Texture;

Phaser.Texture.prototype = {

    add: function (name, sourceIndex, x, y, width, height)
    {
        var frame = new Phaser.TextureFrame(this, name, sourceIndex, x, y, width, height);

        this.frames[name] = frame;

        this.frameTotal++;

        return frame;
    },

    get: function (name)
    {
        if (name === undefined || name === null || this.frameTotal === 1)
        {
            name = '__BASE';
        }

        var frame = this.frames[name];

        if (!frame)
        {
            console.warn('No Texture.frame found with name ' + name);
        }
        else
        {
            return frame;
        }
    },

    setTextureIndex: function (index)
    {
        for (var i = 0; i < this.source.length; i++)
        {
            this.source[i].glTextureIndex = index;

            console.log(this.source[i].image.currentSrc, 'index = ', index);

            index++;
        }

        return index;
    },

    /**
    * Destroys this base texture
    *
    * @method destroy
    */
    destroy: function ()
    {

        //  Need to iterate though the TextureSources, and unload each one
        //  then clear out the frames

        /*
        if (this.source)
        {
            Phaser.CanvasPool.removeByCanvas(this.source);
        }

        this.source = null;
        */
    }

};

/**
* Helper function that creates a base texture from the given canvas element.
*
* @static
* @method fromCanvas
* @param canvas {Canvas} The canvas element source of the texture
* @param scaleMode {Number} See {{#crossLink "PIXI/scaleModes:property"}}Phaser.scaleModes{{/crossLink}} for possible values
* @return {BaseTexture}
*/
Phaser.Texture.fromCanvas = function (canvas, scaleMode)
{
    if (canvas.width === 0)
    {
        canvas.width = 1;
    }

    if (canvas.height === 0)
    {
        canvas.height = 1;
    }

    return new Phaser.Texture(canvas, scaleMode);
};
