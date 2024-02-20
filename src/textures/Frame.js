/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Clamp = require('../math/Clamp');
var Extend = require('../utils/object/Extend');

/**
 * @classdesc
 * A Frame is a section of a Texture.
 *
 * @class Frame
 * @memberof Phaser.Textures
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture this Frame is a part of.
 * @param {(number|string)} name - The name of this Frame. The name is unique within the Texture.
 * @param {number} sourceIndex - The index of the TextureSource that this Frame is a part of.
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
         * @type {number}
         * @since 3.0.0
         */
        this.sourceIndex = sourceIndex;

        /**
         * X position within the source image to cut from.
         *
         * @name Phaser.Textures.Frame#cutX
         * @type {number}
         * @since 3.0.0
         */
        this.cutX;

        /**
         * Y position within the source image to cut from.
         *
         * @name Phaser.Textures.Frame#cutY
         * @type {number}
         * @since 3.0.0
         */
        this.cutY;

        /**
         * The width of the area in the source image to cut.
         *
         * @name Phaser.Textures.Frame#cutWidth
         * @type {number}
         * @since 3.0.0
         */
        this.cutWidth;

        /**
         * The height of the area in the source image to cut.
         *
         * @name Phaser.Textures.Frame#cutHeight
         * @type {number}
         * @since 3.0.0
         */
        this.cutHeight;

        /**
         * The X rendering offset of this Frame, taking trim into account.
         *
         * @name Phaser.Textures.Frame#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x = 0;

        /**
         * The Y rendering offset of this Frame, taking trim into account.
         *
         * @name Phaser.Textures.Frame#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y = 0;

        /**
         * The rendering width of this Frame, taking trim into account.
         *
         * @name Phaser.Textures.Frame#width
         * @type {number}
         * @since 3.0.0
         */
        this.width;

        /**
         * The rendering height of this Frame, taking trim into account.
         *
         * @name Phaser.Textures.Frame#height
         * @type {number}
         * @since 3.0.0
         */
        this.height;

        /**
         * Half the width, floored.
         * Precalculated for the renderer.
         *
         * @name Phaser.Textures.Frame#halfWidth
         * @type {number}
         * @since 3.0.0
         */
        this.halfWidth;

        /**
         * Half the height, floored.
         * Precalculated for the renderer.
         *
         * @name Phaser.Textures.Frame#halfHeight
         * @type {number}
         * @since 3.0.0
         */
        this.halfHeight;

        /**
         * The x center of this frame, floored.
         *
         * @name Phaser.Textures.Frame#centerX
         * @type {number}
         * @since 3.0.0
         */
        this.centerX;

        /**
         * The y center of this frame, floored.
         *
         * @name Phaser.Textures.Frame#centerY
         * @type {number}
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
         * @type {number}
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
         * WebGL UV u0 value.
         *
         * @name Phaser.Textures.Frame#u0
         * @type {number}
         * @default 0
         * @since 3.11.0
         */
        this.u0 = 0;

        /**
         * WebGL UV v0 value.
         *
         * @name Phaser.Textures.Frame#v0
         * @type {number}
         * @default 0
         * @since 3.11.0
         */
        this.v0 = 0;

        /**
         * WebGL UV u1 value.
         *
         * @name Phaser.Textures.Frame#u1
         * @type {number}
         * @default 0
         * @since 3.11.0
         */
        this.u1 = 0;

        /**
         * WebGL UV v1 value.
         *
         * @name Phaser.Textures.Frame#v1
         * @type {number}
         * @default 0
         * @since 3.11.0
         */
        this.v1 = 0;

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
                h: 0,
                r: 0,
                b: 0
            },
            radius: 0,
            drawImage: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            is3Slice: false,
            scale9: false,
            scale9Borders: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
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
     * @param {number} width - The width of the frame before being trimmed.
     * @param {number} height - The height of the frame before being trimmed.
     * @param {number} [x=0] - The x coordinate of the top-left of this Frame.
     * @param {number} [y=0] - The y coordinate of the top-left of this Frame.
     *
     * @return {this} This Frame object.
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

        drawImage.x = x;
        drawImage.y = y;
        drawImage.width = width;
        drawImage.height = height;

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
     * @return {this} This Frame object.
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
        ss.r = destX + destWidth;
        ss.b = destY + destHeight;

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
     * Sets the scale9 center rectangle values.
     *
     * Scale9 is a feature of Texture Packer, allowing you to define a nine-slice scaling grid.
     *
     * This is set automatically by the JSONArray and JSONHash parsers.
     *
     * @method Phaser.Textures.Frame#setScale9
     * @since 3.70.0
     *
     * @param {number} x - The left coordinate of the center scale9 rectangle.
     * @param {number} y - The top coordinate of the center scale9 rectangle.
     * @param {number} width - The width of the center scale9 rectangle.
     * @param {number} height - The height coordinate of the center scale9 rectangle.
     *
     * @return {this} This Frame object.
     */
    setScale9: function (x, y, width, height)
    {
        var data = this.data;

        data.scale9 = true;
        data.is3Slice = (y === 0 && height === this.height);

        data.scale9Borders.x = x;
        data.scale9Borders.y = y;
        data.scale9Borders.w = width;
        data.scale9Borders.h = height;

        return this;
    },

    /**
     * Takes a crop data object and, based on the rectangular region given, calculates the
     * required UV coordinates in order to crop this Frame for WebGL and Canvas rendering.
     *
     * The crop size as well as coordinates can not exceed the the size of the frame.
     * 
     * This is called directly by the Game Object Texture Components `setCrop` method.
     * Please use that method to crop a Game Object.
     *
     * @method Phaser.Textures.Frame#setCropUVs
     * @since 3.11.0
     *
     * @param {object} crop - The crop data object. This is the `GameObject._crop` property.
     * @param {number} x - The x coordinate to start the crop from. Cannot be negative or exceed the Frame width.
     * @param {number} y - The y coordinate to start the crop from. Cannot be negative or exceed the Frame height.
     * @param {number} width - The width of the crop rectangle. Cannot exceed the Frame width.
     * @param {number} height - The height of the crop rectangle. Cannot exceed the Frame height.
     * @param {boolean} flipX - Does the parent Game Object have flipX set?
     * @param {boolean} flipY - Does the parent Game Object have flipY set?
     *
     * @return {object} The updated crop data object.
     */
    setCropUVs: function (crop, x, y, width, height, flipX, flipY)
    {
        //  Clamp the input values

        var cx = this.cutX;
        var cy = this.cutY;
        var cw = this.cutWidth;
        var ch = this.cutHeight;
        var rw = this.realWidth;
        var rh = this.realHeight;

        x = Clamp(x, 0, rw);
        y = Clamp(y, 0, rh);

        width = Clamp(width, 0, rw - x);
        height = Clamp(height, 0, rh - y);

        var ox = cx + x;
        var oy = cy + y;
        var ow = width;
        var oh = height;

        var data = this.data;

        if (data.trim)
        {
            var ss = data.spriteSourceSize;

            //  Need to check for intersection between the cut area and the crop area
            //  If there is none, we set UV to be empty, otherwise set it to be the intersection area

            width = Clamp(width, 0, cw - x);
            height = Clamp(height, 0, ch - y);

            var cropRight = x + width;
            var cropBottom = y + height;

            var intersects = !(ss.r < x || ss.b < y || ss.x > cropRight || ss.y > cropBottom);

            if (intersects)
            {
                var ix = Math.max(ss.x, x);
                var iy = Math.max(ss.y, y);
                var iw = Math.min(ss.r, cropRight) - ix;
                var ih = Math.min(ss.b, cropBottom) - iy;

                ow = iw;
                oh = ih;

                if (flipX)
                {
                    ox = cx + (cw - (ix - ss.x) - iw);
                }
                else
                {
                    ox = cx + (ix - ss.x);
                }

                if (flipY)
                {
                    oy = cy + (ch - (iy - ss.y) - ih);
                }
                else
                {
                    oy = cy + (iy - ss.y);
                }

                x = ix;
                y = iy;

                width = iw;
                height = ih;
            }
            else
            {
                ox = 0;
                oy = 0;
                ow = 0;
                oh = 0;
            }
        }
        else
        {
            if (flipX)
            {
                ox = cx + (cw - x - width);
            }

            if (flipY)
            {
                oy = cy + (ch - y - height);
            }
        }

        var tw = this.source.width;
        var th = this.source.height;

        //  Map the given coordinates into UV space, clamping to the 0-1 range.

        crop.u0 = Math.max(0, ox / tw);
        crop.v0 = Math.max(0, oy / th);
        crop.u1 = Math.min(1, (ox + ow) / tw);
        crop.v1 = Math.min(1, (oy + oh) / th);

        crop.x = x;
        crop.y = y;

        crop.cx = ox;
        crop.cy = oy;
        crop.cw = ow;
        crop.ch = oh;

        crop.width = width;
        crop.height = height;

        crop.flipX = flipX;
        crop.flipY = flipY;

        return crop;
    },

    /**
     * Takes a crop data object and recalculates the UVs based on the dimensions inside the crop object.
     * Called automatically by `setFrame`.
     *
     * @method Phaser.Textures.Frame#updateCropUVs
     * @since 3.11.0
     *
     * @param {object} crop - The crop data object. This is the `GameObject._crop` property.
     * @param {boolean} flipX - Does the parent Game Object have flipX set?
     * @param {boolean} flipY - Does the parent Game Object have flipY set?
     *
     * @return {object} The updated crop data object.
     */
    updateCropUVs: function (crop, flipX, flipY)
    {
        return this.setCropUVs(crop, crop.x, crop.y, crop.width, crop.height, flipX, flipY);
    },

    /**
     * Directly sets the canvas and WebGL UV data for this frame.
     *
     * Use this if you need to override the values that are generated automatically
     * when the Frame is created.
     *
     * @method Phaser.Textures.Frame#setUVs
     * @since 3.50.0
     *
     * @param {number} width - Width of this frame for the Canvas data.
     * @param {number} height - Height of this frame for the Canvas data.
     * @param {number} u0 - UV u0 value.
     * @param {number} v0 - UV v0 value.
     * @param {number} u1 - UV u1 value.
     * @param {number} v1 - UV v1 value.
     *
     * @return {this} This Frame object.
     */
    setUVs: function (width, height, u0, v0, u1, v1)
    {
        //  Canvas data

        var cd = this.data.drawImage;

        cd.width = width;
        cd.height = height;

        //  WebGL data

        this.u0 = u0;
        this.v0 = v0;

        this.u1 = u1;
        this.v1 = v1;

        return this;
    },

    /**
     * Updates the internal WebGL UV cache and the drawImage cache.
     *
     * @method Phaser.Textures.Frame#updateUVs
     * @since 3.0.0
     *
     * @return {this} This Frame object.
     */
    updateUVs: function ()
    {
        var cx = this.cutX;
        var cy = this.cutY;
        var cw = this.cutWidth;
        var ch = this.cutHeight;

        //  Canvas data

        var cd = this.data.drawImage;

        cd.width = cw;
        cd.height = ch;

        //  WebGL data

        var tw = this.source.width;
        var th = this.source.height;

        this.u0 = cx / tw;
        this.v0 = cy / th;

        this.u1 = (cx + cw) / tw;
        this.v1 = (cy + ch) / th;

        return this;
    },

    /**
     * Updates the internal WebGL UV cache.
     *
     * @method Phaser.Textures.Frame#updateUVsInverted
     * @since 3.0.0
     *
     * @return {this} This Frame object.
     */
    updateUVsInverted: function ()
    {
        var tw = this.source.width;
        var th = this.source.height;

        this.u0 = (this.cutX + this.cutHeight) / tw;
        this.v0 = this.cutY / th;

        this.u1 = this.cutX / tw;
        this.v1 = (this.cutY + this.cutWidth) / th;

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
     * Destroys this Frame by nulling its reference to the parent Texture and and data objects.
     *
     * @method Phaser.Textures.Frame#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.texture = null;
        this.source = null;
        this.customData = null;
        this.data = null;
    },

    /**
     * A reference to the Texture Source WebGL Texture that this Frame is using.
     * 
     * @name Phaser.Textures.Frame#glTexture
     * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
     * @readonly
     * @since 3.11.0
     */
    glTexture: {

        get: function ()
        {
            return this.source.glTexture;
        }
    },

    /**
     * The width of the Frame in its un-trimmed, un-padded state, as prepared in the art package,
     * before being packed.
     *
     * @name Phaser.Textures.Frame#realWidth
     * @type {number}
     * @readonly
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
     * @readonly
     * @since 3.0.0
     */
    realHeight: {

        get: function ()
        {
            return this.data.sourceSize.h;
        }

    },

    /**
     * The radius of the Frame (derived from sqrt(w * w + h * h) / 2)
     *
     * @name Phaser.Textures.Frame#radius
     * @type {number}
     * @readonly
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
     * @readonly
     * @since 3.0.0
     */
    trimmed: {

        get: function ()
        {
            return this.data.trim;
        }

    },

    /**
     * Does the Frame have scale9 border data?
     *
     * @name Phaser.Textures.Frame#scale9
     * @type {boolean}
     * @readonly
     * @since 3.70.0
     */
    scale9: {

        get: function ()
        {
            return this.data.scale9;
        }

    },

    /**
     * If the Frame has scale9 border data, is it 3-slice or 9-slice data?
     *
     * @name Phaser.Textures.Frame#is3Slice
     * @type {boolean}
     * @readonly
     * @since 3.70.0
     */
    is3Slice: {

        get: function ()
        {
            return this.data.is3Slice;
        }

    },

    /**
     * The Canvas drawImage data object.
     *
     * @name Phaser.Textures.Frame#canvasData
     * @type {object}
     * @readonly
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
