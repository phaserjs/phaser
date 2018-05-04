/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var Extend = require('../utils/object/Extend');

/**
 * @classdesc
 * A Frame is a section of a Texture.
 *
 * @class Frame
 * @memberOf Phaser.Textures
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture this Frame is a part of.
 * @param {(integer|string)} name - The name of this Frame. The name is unique within the Texture.
 * @param {integer} sourceIndex - The index of the TextureSource that this Frame is a part of.
 * @param {number} x - The x coordinate of the top-left of this Frame.
 * @param {number} y - The y coordinate of the top-left of this Frame.
 * @param {number} width - The width of this Frame.
 * @param {number} height - The height of this Frame.
 */
var Frame = new Class({

    initialize:

    function Frame (texture, name, sourceIndex, x, y, width, height)
    {
        /**
         * The Texture this Frame is a part of.
         *
         * @name Phaser.Textures.Frame#texture
         * @type {Phaser.Textures.Texture}
         * @since 3.0.0
         */
        this.texture = texture;

        /**
         * The name of this Frame.
         * The name is unique within the Texture.
         *
         * @name Phaser.Textures.Frame#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = name;

        /**
         * The TextureSource this Frame is part of.
         *
         * @name Phaser.Textures.Frame#source
         * @type {Phaser.Textures.TextureSource}
         * @since 3.0.0
         */
        this.source = texture.source[sourceIndex];

        /**
         * The index of the TextureSource in the Texture sources array.
         *
         * @name Phaser.Textures.Frame#sourceIndex
         * @type {integer}
         * @since 3.0.0
         */
        this.sourceIndex = sourceIndex;

        /**
         * X position within the source image to cut from.
         *
         * @name Phaser.Textures.Frame#cutX
         * @type {integer}
         * @since 3.0.0
         */
        this.cutX;

        /**
         * Y position within the source image to cut from.
         *
         * @name Phaser.Textures.Frame#cutY
         * @type {integer}
         * @since 3.0.0
         */
        this.cutY;

        /**
         * The width of the area in the source image to cut.
         *
         * @name Phaser.Textures.Frame#cutWidth
         * @type {integer}
         * @since 3.0.0
         */
        this.cutWidth;

        /**
         * The height of the area in the source image to cut.
         *
         * @name Phaser.Textures.Frame#cutHeight
         * @type {integer}
         * @since 3.0.0
         */
        this.cutHeight;

        /**
         * The X rendering offset of this Frame, taking trim into account.
         *
         * @name Phaser.Textures.Frame#x
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.x = 0;

        /**
         * The Y rendering offset of this Frame, taking trim into account.
         *
         * @name Phaser.Textures.Frame#y
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.y = 0;

        /**
         * The rendering width of this Frame, taking trim into account.
         *
         * @name Phaser.Textures.Frame#width
         * @type {integer}
         * @since 3.0.0
         */
        this.width;

        /**
         * The rendering height of this Frame, taking trim into account.
         *
         * @name Phaser.Textures.Frame#height
         * @type {integer}
         * @since 3.0.0
         */
        this.height;

        /**
         * Half the width, floored.
         * Precalculated for the renderer.
         *
         * @name Phaser.Textures.Frame#halfWidth
         * @type {integer}
         * @since 3.0.0
         */
        this.halfWidth;

        /**
         * Half the height, floored.
         * Precalculated for the renderer.
         *
         * @name Phaser.Textures.Frame#halfHeight
         * @type {integer}
         * @since 3.0.0
         */
        this.halfHeight;

        /**
         * The x center of this frame, floored.
         *
         * @name Phaser.Textures.Frame#centerX
         * @type {integer}
         * @since 3.0.0
         */
        this.centerX;

        /**
         * The y center of this frame, floored.
         *
         * @name Phaser.Textures.Frame#centerY
         * @type {integer}
         * @since 3.0.0
         */
        this.centerY;

        /**
         * The horizontal pivot point of this Frame.
         *
         * @name Phaser.Textures.Frame#pivotX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.pivotX = 0;

        /**
         * The vertical pivot point of this Frame.
         *
         * @name Phaser.Textures.Frame#pivotY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.pivotY = 0;

        /**
         * Does this Frame have a custom pivot point?
         *
         * @name Phaser.Textures.Frame#customPivot
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.customPivot = false;

        /**
         * **CURRENTLY UNSUPPORTED**
         *
         * Is this frame is rotated or not in the Texture?
         * Rotation allows you to use rotated frames in texture atlas packing.
         * It has nothing to do with Sprite rotation.
         *
         * @name Phaser.Textures.Frame#rotated
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.rotated = false;

        /**
         * Over-rides the Renderer setting.
         * -1 = use Renderer Setting
         * 0 = No rounding
         * 1 = Round
         *
         * @name Phaser.Textures.Frame#autoRound
         * @type {integer}
         * @default -1
         * @since 3.0.0
         */
        this.autoRound = -1;

        /**
         * Any Frame specific custom data can be stored here.
         *
         * @name Phaser.Textures.Frame#customData
         * @type {object}
         * @since 3.0.0
         */
        this.customData = {};

        /**
         * The un-modified source frame, trim and UV data.
         *
         * @name Phaser.Textures.Frame#data
         * @type {object}
         * @private
         * @since 3.0.0
         */
        this.data = {
            cut: {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                r: 0,
                b: 0
            },
            trim: false,
            sourceSize: {
                w: 0,
                h: 0
            },
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            },
            uvs: {
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                x3: 0,
                y3: 0
            },
            radius: 0,
            drawImage: {
                sx: 0,
                sy: 0,
                sWidth: 0,
                sHeight: 0,
                dWidth: 0,
                dHeight: 0
            }
        };

        this.setSize(width, height, x, y);
    },

    /**
     * Sets the width, height, x and y of this Frame.
     * 
     * This is called automatically by the constructor
     * and should rarely be changed on-the-fly.
     *
     * @method Phaser.Textures.Frame#setSize
     * @since 3.7.0
     *
     * @param {integer} width - The width of the frame before being trimmed.
     * @param {integer} height - The height of the frame before being trimmed.
     * @param {integer} [x=0] - The x coordinate of the top-left of this Frame.
     * @param {integer} [y=0] - The y coordinate of the top-left of this Frame.
     *
     * @return {Phaser.Textures.Frame} This Frame object.
     */
    setSize: function (width, height, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        this.cutX = x;
        this.cutY = y;
        this.cutWidth = width;
        this.cutHeight = height;

        this.width = width;
        this.height = height;

        this.halfWidth = Math.floor(width * 0.5);
        this.halfHeight = Math.floor(height * 0.5);

        this.centerX = Math.floor(width / 2);
        this.centerY = Math.floor(height / 2);

        var data = this.data;
        var cut = data.cut;

        cut.x = x;
        cut.y = y;
        cut.w = width;
        cut.h = height;
        cut.r = x + width;
        cut.b = y + height;

        data.sourceSize.w = width;
        data.sourceSize.h = height;

        data.spriteSourceSize.w = width;
        data.spriteSourceSize.h = height;

        data.radius = 0.5 * Math.sqrt(width * width + height * height);

        var drawImage = data.drawImage;

        drawImage.sx = x;
        drawImage.sy = y;
        drawImage.sWidth = width;
        drawImage.sHeight = height;
        drawImage.dWidth = width;
        drawImage.dHeight = height;

        return this.updateUVs();
    },

    /**
     * If the frame was trimmed when added to the Texture Atlas, this records the trim and source data.
     *
     * @method Phaser.Textures.Frame#setTrim
     * @since 3.0.0
     *
     * @param {number} actualWidth - The width of the frame before being trimmed.
     * @param {number} actualHeight - The height of the frame before being trimmed.
     * @param {number} destX - The destination X position of the trimmed frame for display.
     * @param {number} destY - The destination Y position of the trimmed frame for display.
     * @param {number} destWidth - The destination width of the trimmed frame for display.
     * @param {number} destHeight - The destination height of the trimmed frame for display.
     *
     * @return {Phaser.Textures.Frame} This Frame object.
     */
    setTrim: function (actualWidth, actualHeight, destX, destY, destWidth, destHeight)
    {
        var data = this.data;
        var ss = data.spriteSourceSize;

        //  Store actual values

        data.trim = true;

        data.sourceSize.w = actualWidth;
        data.sourceSize.h = actualHeight;

        ss.x = destX;
        ss.y = destY;
        ss.w = destWidth;
        ss.h = destHeight;

        //  Adjust properties
        this.x = destX;
        this.y = destY;

        this.width = destWidth;
        this.height = destHeight;

        this.halfWidth = destWidth * 0.5;
        this.halfHeight = destHeight * 0.5;

        this.centerX = Math.floor(destWidth / 2);
        this.centerY = Math.floor(destHeight / 2);

        return this.updateUVs();
    },

    /**
     * Updates the internal WebGL UV cache and the drawImage cache.
     *
     * @method Phaser.Textures.Frame#updateUVs
     * @since 3.0.0
     *
     * @return {Phaser.Textures.Frame} This Frame object.
     */
    updateUVs: function ()
    {
        var cx = this.cutX;
        var cy = this.cutY;
        var cw = this.cutWidth;
        var ch = this.cutHeight;

        //  Canvas data

        var cd = this.data.drawImage;

        cd.sWidth = cw;
        cd.sHeight = ch;
        cd.dWidth = cw;
        cd.dHeight = ch;

        //  WebGL data

        var tw = this.source.width;
        var th = this.source.height;
        var uvs = this.data.uvs;

        uvs.x0 = cx / tw;
        uvs.y0 = cy / th;

        uvs.x1 = cx / tw;
        uvs.y1 = (cy + ch) / th;

        uvs.x2 = (cx + cw) / tw;
        uvs.y2 = (cy + ch) / th;

        uvs.x3 = (cx + cw) / tw;
        uvs.y3 = cy / th;

        return this;
    },

    /**
     * Updates the internal WebGL UV cache.
     *
     * @method Phaser.Textures.Frame#updateUVsInverted
     * @since 3.0.0
     *
     * @return {Phaser.Textures.Frame} This Frame object.
     */
    updateUVsInverted: function ()
    {
        var tw = this.source.width;
        var th = this.source.height;
        var uvs = this.data.uvs;

        uvs.x3 = (this.cutX + this.cutHeight) / tw;
        uvs.y3 = (this.cutY + this.cutWidth) / th;

        uvs.x2 = this.cutX / tw;
        uvs.y2 = (this.cutY + this.cutWidth) / th;

        uvs.x1 = this.cutX / tw;
        uvs.y1 = this.cutY / th;

        uvs.x0 = (this.cutX + this.cutHeight) / tw;
        uvs.y0 = this.cutY / th;

        return this;
    },

    /**
     * Clones this Frame into a new Frame object.
     *
     * @method Phaser.Textures.Frame#clone
     * @since 3.0.0
     *
     * @return {Phaser.Textures.Frame} A clone of this Frame.
     */
    clone: function ()
    {
        var clone = new Frame(this.texture, this.name, this.sourceIndex);

        clone.cutX = this.cutX;
        clone.cutY = this.cutY;
        clone.cutWidth = this.cutWidth;
        clone.cutHeight = this.cutHeight;

        clone.x = this.x;
        clone.y = this.y;

        clone.width = this.width;
        clone.height = this.height;

        clone.halfWidth = this.halfWidth;
        clone.halfHeight = this.halfHeight;

        clone.centerX = this.centerX;
        clone.centerY = this.centerY;

        clone.rotated = this.rotated;

        clone.data = Extend(true, clone.data, this.data);

        clone.updateUVs();

        return clone;
    },

    /**
     * Destroys this Frames references.
     *
     * @method Phaser.Textures.Frame#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.texture = null;

        this.source = null;
    },

    /**
     * The width of the Frame in its un-trimmed, un-padded state, as prepared in the art package,
     * before being packed.
     *
     * @name Phaser.Textures.Frame#realWidth
     * @type {number}
     * @readOnly
     * @since 3.0.0
     */
    realWidth: {

        get: function ()
        {
            return this.data.sourceSize.w;
        }

    },

    /**
     * The height of the Frame in its un-trimmed, un-padded state, as prepared in the art package,
     * before being packed.
     *
     * @name Phaser.Textures.Frame#realHeight
     * @type {number}
     * @readOnly
     * @since 3.0.0
     */
    realHeight: {

        get: function ()
        {
            return this.data.sourceSize.h;
        }

    },

    /**
     * The UV data for this Frame.
     *
     * @name Phaser.Textures.Frame#uvs
     * @type {object}
     * @readOnly
     * @since 3.0.0
     */
    uvs: {

        get: function ()
        {
            return this.data.uvs;
        }

    },

    /**
     * The radius of the Frame (derived from sqrt(w * w + h * h) / 2)
     *
     * @name Phaser.Textures.Frame#radius
     * @type {number}
     * @readOnly
     * @since 3.0.0
     */
    radius: {

        get: function ()
        {
            return this.data.radius;
        }

    },

    /**
     * Is the Frame trimmed or not?
     *
     * @name Phaser.Textures.Frame#trimmed
     * @type {boolean}
     * @readOnly
     * @since 3.0.0
     */
    trimmed: {

        get: function ()
        {
            return this.data.trim;
        }

    },

    /**
     * The Canvas drawImage data object.
     *
     * @name Phaser.Textures.Frame#canvasData
     * @type {object}
     * @readOnly
     * @since 3.0.0
     */
    canvasData: {

        get: function ()
        {
            return this.data.drawImage;
        }

    }

});

module.exports = Frame;
