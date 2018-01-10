var Class = require('../utils/Class');
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
*/
var Texture = new Class({

    initialize:

    function Texture (manager, key, source, width, height)
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
        */
        this.source = [];

        this.frames = {};

        this.firstFrame = '__BASE';

        this.frameTotal = 0;

        //  Load the Sources
        for (var i = 0; i < source.length; i++)
        {
            this.source.push(new TextureSource(this, source[i], width, height));
        }
    },

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

    getTextureSourceIndex: function (source)
    {
        for (var i = 0; i < this.source.length; i++)
        {
            if (this.source[i] === source)
            {
                return i;
            }
        }

        return -1;
    },

    //  source = TextureSource object
    getFramesFromTextureSource: function (sourceIndex)
    {
        var out = [];

        for (var frameName in this.frames)
        {
            if (frameName === '__BASE')
            {
                continue;
            }

            var frame = this.frames[frameName];

            if (frame.sourceIndex === sourceIndex)
            {
                out.push(frame.name);
            }
        }

        return out;
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

    setFilter: function (filterMode)
    {
        for (var i = 0; i < this.source.length; i++)
        {
            this.source[i].setFilter(filterMode);
        }
    },

    destroy: function ()
    {
    }

});

module.exports = Texture;
