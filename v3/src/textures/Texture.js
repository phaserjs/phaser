/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Frame = require('./Frame');
var TextureSource = require('./TextureSource');

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
var Texture = function (manager, key, source, width, height)
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

    this.firstFrame = '__BASE';

    this.frameTotal = 0;

    //  Load the Sources
    for (var i = 0; i < source.length; i++)
    {
        this.source.push(new TextureSource(this, source[i], width, height));
    }
};

Texture.prototype.constructor = Texture;

Texture.prototype = {

    add: function (name, sourceIndex, x, y, width, height)
    {
        var frame = new Frame(this, name, sourceIndex, x, y, width, height);

        this.frames[name] = frame;

        //  Set the first frame of the Texture (other than __BASE)
        //  This is used to ensure we don't spam the display with entire
        //  atlases of sprite sheets, but instead just the first frame of them
        //  should the dev incorrectly specify the frame index
        if (this.frameTotal === 1)
        {
            this.firstFrame = name;
        }

        this.frameTotal++;

        return frame;
    },

    has: function (name)
    {
        return (this.frames[name]);
    },

    get: function (name)
    {
        if (name === undefined || name === null)
        {
            name = (this.frameTotal === 1) ? '__BASE' : this.firstFrame;
        }

        var frame = this.frames[name];

        if (!frame)
        {
            console.warn('No Texture.frame found with name ' + name);

            return this.frames['__BASE'];
        }
        else
        {
            return frame;
        }
    },

    getFrameNames: function (includeBase)
    {
        if (includeBase === undefined) { includeBase = false; }

        var out = Object.keys(this.frames);

        if (!includeBase)
        {
            var idx = out.indexOf('__BASE');

            if (idx !== -1)
            {
                out.splice(idx, 1);
            }
        }

        return out;
    },

    getSourceImage: function (name)
    {
        if (name === undefined || name === null || this.frameTotal === 1)
        {
            name = '__BASE';
        }

        var frame = this.frames[name];

        if (!frame)
        {
            console.warn('No Texture.frame found with name ' + name);

            return this.frames['__BASE'].source.image;
        }
        else
        {
            return frame.source.image;
        }
    },

    setTextureIndex: function (index)
    {
        for (var i = 0; i < this.source.length; i++)
        {
            this.source[i].glTextureIndex = index;

            // console.log(this.source[i].image.currentSrc, 'index = ', index);

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
        //  TODO
    },

    setFilter: function (filterMode)
    {
        for (var i = 0; i < this.source.length; i++)
        {
            this.source[i].setFilter(filterMode);
        }
    }

};

module.exports = Texture;
