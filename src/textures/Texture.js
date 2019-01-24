/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var Frame = require('./Frame');
var TextureSource = require('./TextureSource');

var TEXTURE_MISSING_ERROR = 'Texture.frame missing: ';

/**
 * @classdesc
 * A Texture consists of a source, usually an Image from the Cache, and a collection of Frames.
 * The Frames represent the different areas of the Texture. For example a texture atlas
 * may have many Frames, one for each element within the atlas. Where-as a single image would have
 * just one frame, that encompasses the whole image.
 *
 * Textures are managed by the global TextureManager. This is a singleton class that is
 * responsible for creating and delivering Textures and their corresponding Frames to Game Objects.
 *
 * Sprites and other Game Objects get the texture data they need from the TextureManager.
 *
 * @class Texture
 * @memberof Phaser.Textures
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Textures.TextureManager} manager - A reference to the Texture Manager this Texture belongs to.
 * @param {string} key - The unique string-based key of this Texture.
 * @param {(HTMLImageElement|HTMLCanvasElement|HTMLImageElement[]|HTMLCanvasElement[])} source - An array of sources that are used to create the texture. Usually Images, but can also be a Canvas.
 * @param {number} [width] - The width of the Texture. This is optional and automatically derived from the source images.
 * @param {number} [height] - The height of the Texture. This is optional and automatically derived from the source images.
 */
var Texture = new Class({

    initialize:

    function Texture (manager, key, source, width, height)
    {
        if (!Array.isArray(source))
        {
            source = [ source ];
        }

        /**
         * A reference to the Texture Manager this Texture belongs to.
         *
         * @name Phaser.Textures.Texture#manager
         * @type {Phaser.Textures.TextureManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * The unique string-based key of this Texture.
         *
         * @name Phaser.Textures.Texture#key
         * @type {string}
         * @since 3.0.0
         */
        this.key = key;

        /**
         * An array of TextureSource instances.
         * These are unique to this Texture and contain the actual Image (or Canvas) data.
         *
         * @name Phaser.Textures.Texture#source
         * @type {Phaser.Textures.TextureSource[]}
         * @since 3.0.0
         */
        this.source = [];

        /**
         * An array of TextureSource data instances.
         * Used to store additional data images, such as normal maps or specular maps.
         *
         * @name Phaser.Textures.Texture#dataSource
         * @type {array}
         * @since 3.0.0
         */
        this.dataSource = [];

        /**
         * A key-value object pair associating the unique Frame keys with the Frames objects.
         *
         * @name Phaser.Textures.Texture#frames
         * @type {object}
         * @since 3.0.0
         */
        this.frames = {};

        /**
         * Any additional data that was set in the source JSON (if any),
         * or any extra data you'd like to store relating to this texture
         *
         * @name Phaser.Textures.Texture#customData
         * @type {object}
         * @since 3.0.0
         */
        this.customData = {};

        /**
         * The name of the first frame of the Texture.
         *
         * @name Phaser.Textures.Texture#firstFrame
         * @type {string}
         * @since 3.0.0
         */
        this.firstFrame = '__BASE';

        /**
         * The total number of Frames in this Texture.
         *
         * @name Phaser.Textures.Texture#frameTotal
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.frameTotal = 0;

        //  Load the Sources
        for (var i = 0; i < source.length; i++)
        {
            this.source.push(new TextureSource(this, source[i], width, height));
        }
    },

    /**
     * Adds a new Frame to this Texture.
     *
     * A Frame is a rectangular region of a TextureSource with a unique index or string-based key.
     *
     * @method Phaser.Textures.Texture#add
     * @since 3.0.0
     *
     * @param {(integer|string)} name - The name of this Frame. The name is unique within the Texture.
     * @param {integer} sourceIndex - The index of the TextureSource that this Frame is a part of.
     * @param {number} x - The x coordinate of the top-left of this Frame.
     * @param {number} y - The y coordinate of the top-left of this Frame.
     * @param {number} width - The width of this Frame.
     * @param {number} height - The height of this Frame.
     *
     * @return {Phaser.Textures.Frame} The Frame that was added to this Texture.
     */
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

    /**
     * Checks to see if a Frame matching the given key exists within this Texture.
     *
     * @method Phaser.Textures.Texture#has
     * @since 3.0.0
     *
     * @param {string} name - The key of the Frame to check for.
     *
     * @return {boolean} True if a Frame with the matching key exists in this Texture.
     */
    has: function (name)
    {
        return (this.frames[name]);
    },

    /**
     * Gets a Frame from this Texture based on either the key or the index of the Frame.
     *
     * In a Texture Atlas Frames are typically referenced by a key.
     * In a Sprite Sheet Frames are referenced by an index.
     * Passing no value for the name returns the base texture.
     *
     * @method Phaser.Textures.Texture#get
     * @since 3.0.0
     *
     * @param {(string|integer)} [name] - The string-based name, or integer based index, of the Frame to get from this Texture.
     *
     * @return {Phaser.Textures.Frame} The Texture Frame.
     */
    get: function (name)
    {
        //  null, undefined, empty string, zero
        if (!name)
        {
            name = this.firstFrame;
        }

        var frame = this.frames[name];

        if (!frame)
        {
            console.warn(TEXTURE_MISSING_ERROR + name);

            frame = this.frames[this.firstFrame];
        }

        return frame;
    },

    /**
     * Takes the given TextureSource and returns the index of it within this Texture.
     * If it's not in this Texture, it returns -1.
     * Unless this Texture has multiple TextureSources, such as with a multi-atlas, this
     * method will always return zero or -1.
     *
     * @method Phaser.Textures.Texture#getTextureSourceIndex
     * @since 3.0.0
     *
     * @param {Phaser.Textures.TextureSource} source - The TextureSource to check.
     *
     * @return {integer} The index of the TextureSource within this Texture, or -1 if not in this Texture.
     */
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

    /**
     * Returns an array of all the Frames in the given TextureSource.
     *
     * @method Phaser.Textures.Texture#getFramesFromTextureSource
     * @since 3.0.0
     *
     * @param {integer} sourceIndex - The index of the TextureSource to get the Frames from.
     * @param {boolean} [includeBase=false] - Include the `__BASE` Frame in the output array?
     *
     * @return {Phaser.Textures.Frame[]} An array of Texture Frames.
     */
    getFramesFromTextureSource: function (sourceIndex, includeBase)
    {
        if (includeBase === undefined) { includeBase = false; }

        var out = [];

        for (var frameName in this.frames)
        {
            if (frameName === '__BASE' && !includeBase)
            {
                continue;
            }

            var frame = this.frames[frameName];

            if (frame.sourceIndex === sourceIndex)
            {
                out.push(frame);
            }
        }

        return out;
    },

    /**
     * Returns an array with all of the names of the Frames in this Texture.
     *
     * Useful if you want to randomly assign a Frame to a Game Object, as you can
     * pick a random element from the returned array.
     *
     * @method Phaser.Textures.Texture#getFrameNames
     * @since 3.0.0
     *
     * @param {boolean} [includeBase=false] - Include the `__BASE` Frame in the output array?
     *
     * @return {string[]} An array of all Frame names in this Texture.
     */
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

    /**
     * Given a Frame name, return the source image it uses to render with.
     *
     * This will return the actual DOM Image or Canvas element.
     *
     * @method Phaser.Textures.Texture#getSourceImage
     * @since 3.0.0
     *
     * @param {(string|integer)} [name] - The string-based name, or integer based index, of the Frame to get from this Texture.
     *
     * @return {(HTMLImageElement|HTMLCanvasElement|Phaser.GameObjects.RenderTexture)} The DOM Image, Canvas Element or Render Texture.
     */
    getSourceImage: function (name)
    {
        if (name === undefined || name === null || this.frameTotal === 1)
        {
            name = '__BASE';
        }

        var frame = this.frames[name];

        if (frame)
        {
            return frame.source.image;
        }
        else
        {
            console.warn(TEXTURE_MISSING_ERROR + name);

            return this.frames['__BASE'].source.image;
        }
    },

    /**
     * Given a Frame name, return the data source image it uses to render with.
     * You can use this to get the normal map for an image for example.
     *
     * This will return the actual DOM Image.
     *
     * @method Phaser.Textures.Texture#getDataSourceImage
     * @since 3.7.0
     *
     * @param {(string|integer)} [name] - The string-based name, or integer based index, of the Frame to get from this Texture.
     *
     * @return {(HTMLImageElement|HTMLCanvasElement)} The DOM Image or Canvas Element.
     */
    getDataSourceImage: function (name)
    {
        if (name === undefined || name === null || this.frameTotal === 1)
        {
            name = '__BASE';
        }

        var frame = this.frames[name];
        var idx;

        if (!frame)
        {
            console.warn(TEXTURE_MISSING_ERROR + name);

            idx = this.frames['__BASE'].sourceIndex;
        }
        else
        {
            idx = frame.sourceIndex;
        }

        return this.dataSource[idx].image;
    },

    /**
     * Adds a data source image to this Texture.
     *
     * An example of a data source image would be a normal map, where all of the Frames for this Texture
     * equally apply to the normal map.
     *
     * @method Phaser.Textures.Texture#setDataSource
     * @since 3.0.0
     *
     * @param {(HTMLImageElement|HTMLCanvasElement|HTMLImageElement[]|HTMLCanvasElement[])} data - The source image.
     */
    setDataSource: function (data)
    {
        if (!Array.isArray(data))
        {
            data = [ data ];
        }
        
        for (var i = 0; i < data.length; i++)
        {
            var source = this.source[i];

            this.dataSource.push(new TextureSource(this, data[i], source.width, source.height));
        }
    },

    /**
     * Sets the Filter Mode for this Texture.
     *
     * The mode can be either Linear, the default, or Nearest.
     *
     * For pixel-art you should use Nearest.
     *
     * The mode applies to the entire Texture, not just a specific Frame of it.
     *
     * @method Phaser.Textures.Texture#setFilter
     * @since 3.0.0
     *
     * @param {Phaser.Textures.FilterMode} filterMode - The Filter Mode.
     */
    setFilter: function (filterMode)
    {
        var i;

        for (i = 0; i < this.source.length; i++)
        {
            this.source[i].setFilter(filterMode);
        }

        for (i = 0; i < this.dataSource.length; i++)
        {
            this.dataSource[i].setFilter(filterMode);
        }
    },

    /**
     * Destroys this Texture and releases references to its sources and frames.
     *
     * @method Phaser.Textures.Texture#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        var i;

        for (i = 0; i < this.source.length; i++)
        {
            this.source[i].destroy();
        }

        for (i = 0; i < this.dataSource.length; i++)
        {
            this.dataSource[i].destroy();
        }

        for (var frameName in this.frames)
        {
            var frame = this.frames[frameName];

            frame.destroy();
        }

        this.source = [];
        this.dataSource = [];
        this.frames = {};
        this.manager = null;
    }

});

module.exports = Texture;
