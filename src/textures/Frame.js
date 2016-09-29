/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Frame is a section of a Texture.
* 
* Called TextureFrame during integration, will rename to Frame later.
*
* @class Phaser.TextureFrame
* @constructor
* @param {Phaser.Texture} texture - The Texture this Frame belongs to.
* @param {string} name - The unique (within the Texture) name of this Frame.
* @param {number} x - X position of the frame within the Texture.
* @param {number} y - Y position of the frame within the Texture.
* @param {number} width - Width of the frame within the Texture.
* @param {number} height - Height of the frame within the Texture.
*/
Phaser.TextureFrame = function (texture, name, x, y, width, height)
{

    /**
    * @property {Phaser.Texture} texture - The Texture this frame belongs to.
    */
    this.texture = texture;

    this.source = texture.source;

    /**
    * @property {string} name - The name of this frame within the Texture.
    */
    this.name = name;

    /**
    * @property {number} cutX - X position within the source image to cut from.
    */
    this.cutX = x;

    /**
    * @property {number} cutY - Y position within the source image to cut from.
    */
    this.cutY = y;

    /**
    * @property {number} cutWidth - The width of the area in the source image to cut.
    */
    this.cutWidth = width;

    /**
    * @property {number} cutHeight - The height of the area in the source image to cut.
    */
    this.cutHeight = height;

    /**
    * @property {number} x - The X rendering offset of this Frame, taking trim into account.
    */
    this.x = 0;

    /**
    * @property {number} y - The Y rendering offset of this Frame, taking trim into account.
    */
    this.y = 0;

    /**
    * @property {number} width - The rendering width of this Frame, taking trim into account.
    */
    this.width = width;

    /**
    * @property {number} height - The rendering height of this Frame, taking trim into account.
    */
    this.height = height;

    /**
    * Is this frame is rotated or not in the Texture?
    * Rotation allows you to use rotated frames in texture atlas packing.
    * It has nothing to do with Sprite rotation.
    * @property {boolean} rotated
    * @default
    */
    this.rotated = false;

    /**
    * Is this a tiling texture? As used by the likes of a TilingSprite.
    *
    * @property {boolean} isTiling
    * @default
    */
    this.isTiling = false;

    /**
    * This will let a renderer know that a tinted parent has updated its texture.
    *
    * @property {boolean} requiresReTint
    * @default
    */
    this.requiresReTint = false;

    /**
    * The un-modified source frame, trim and UV data.
    *
    * @private
    * @property {object} data
    */
    this.data = {
        cut: {
            x: x,
            y: y,
            w: width,
            h: height,
            r: x + width,
            b: y + height
        },
        sourceSize: {
            w: width,
            h: height
        },
        spriteSourceSize: {
            x: 0,
            y: 0,
            w: width,
            h: height
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
        }
    };

};

Phaser.TextureFrame.prototype.constructor = Phaser.TextureFrame;

Phaser.TextureFrame.prototype = {

    crop: function (width, height, x, y)
    {
        if (width === undefined) { width = this.data.cut.w; }
        if (height === undefined) { height = this.data.cut.h; }
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (width === undefined)
        {
            //  No arguments means reset the crop
            this.cutX = this.data.cut.x;
            this.cutY = this.data.cut.y;
            this.cutWidth = this.data.cut.w;
            this.cutHeight = this.data.cut.h;
        }
        else if (width !== this.cutWidth || height !== this.cutHeight || x !== this.cutX || y !== this.cutY)
        {
            this.cutX = Phaser.Math.clamp(x, this.data.cut.x, this.data.cut.r);
            this.cutY = Phaser.Math.clamp(y, this.data.cut.y, this.data.cut.b);
            this.cutWidth = Phaser.Math.clamp(width, 0, this.data.cut.w - this.cutX);
            this.cutHeight = Phaser.Math.clamp(height, 0, this.data.cut.h - this.cutY);
        }

        return this;
    },

    /**
    * If the frame was trimmed when added to the Texture Atlas, this records the trim and source data.
    *
    * @method Phaser.TextureFrame#setTrim
    * @param {number} actualWidth - The width of the frame before being trimmed.
    * @param {number} actualHeight - The height of the frame before being trimmed.
    * @param {number} destX - The destination X position of the trimmed frame for display.
    * @param {number} destY - The destination Y position of the trimmed frame for display.
    * @param {number} destWidth - The destination width of the trimmed frame for display.
    * @param {number} destHeight - The destination height of the trimmed frame for display.
    */
    setTrim: function (actualWidth, actualHeight, destX, destY, destWidth, destHeight)
    {
        //  Store actual values

        this.data.sourceSize.w = actualWidth;
        this.data.sourceSize.h = actualHeight;

        this.data.spriteSourceSize.x = destX;
        this.data.spriteSourceSize.y = destY;
        this.data.spriteSourceSize.w = destWidth;
        this.data.spriteSourceSize.h = destHeight;

        //  Adjust properties
        this.x = destX;
        this.y = destY;
        this.width = destWidth;
        this.height = destHeight;

        return this;
    },

    /**
    * Updates the internal WebGL UV cache.
    *
    * @method updateUVs
    * @private
    */
    updateUVs: function ()
    {
        var tw = this.texture.width;
        var th = this.texture.height;
        var uvs = this.data.uvs;
        
        uvs.x0 = this.x / tw;
        uvs.y0 = this.y / th;

        uvs.x1 = (this.x + this.width) / tw;
        uvs.y1 = this.y / th;

        uvs.x2 = (this.x + this.width) / tw;
        uvs.y2 = (this.y + this.height) / th;

        uvs.x3 = this.x / tw;
        uvs.y3 = (this.y + this.height) / th;

        return this;
    },

    /**
    * Updates the internal WebGL UV cache.
    *
    * @method updateUVsInverted
    * @private
    */
    updateUVsInverted: function ()
    {
        var tw = this.texture.width;
        var th = this.texture.height;
        var uvs = this.data.uvs;
        
        uvs.x0 = this.x / tw;
        uvs.y0 = this.y / th;

        uvs.x1 = (this.x + this.height) / tw;
        uvs.y1 = this.y / th;

        uvs.x2 = (this.x + this.height) / tw;
        uvs.y2 = (this.y + this.width) / th;

        uvs.x3 = this.x / tw;
        uvs.y3 = (this.y + this.width) / th;

        return this;
    },

    /**
    * Adjusts of all the Frame properties based on the given width and height values.
    *
    * @method Phaser.TextureFrame#resize
    * @param {integer} width - The new width of the Frame.
    * @param {integer} height - The new height of the Frame.
    */
    resize: function (width, height)
    {
    },

    clone: function ()
    {

    },

    right: function ()
    {

    },

    bottom: function ()
    {

    },

    destroy: function ()
    {
    }

};

Object.defineProperties(Phaser.TextureFrame.prototype, {

    /**
    * The width of the Frame in its un-trimmed, un-padded state, as prepared in the art package,
    * before being packed.
    *
    * @name Phaser.TextureFrame#realWidth
    * @property {any} realWidth
    */
    realWidth: {

        enumerable: true,

        get: function ()
        {
            return this.data.sourceSize.w;
        }

    },

    /**
    * The height of the Frame in its un-trimmed, un-padded state, as prepared in the art package,
    * before being packed.
    *
    * @name Phaser.TextureFrame#realHeight
    * @property {any} realHeight
    */
    realHeight: {

        enumerable: true,

        get: function ()
        {
            return this.data.sourceSize.h;
        }

    }

});
