/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Frame is a section of a Texture.
*
* TODO:
* 
* See if we can't consolidate all the crop, trim and frame values.
* Ideally TextureFrame.x/y/w/h should be the adjusted (cropped, trimmed, etc) values that the
* renderer and Sprites can use. Then all the original values can be stored internally.
*
* @class Phaser.TextureFrame
* @constructor
* @param {number} index - The index of this Frame within the FrameData set it is being added to.
* @param {number} x - X position of the frame within the texture image.
* @param {number} y - Y position of the frame within the texture image.
* @param {number} width - Width of the frame within the texture image.
* @param {number} height - Height of the frame within the texture image.
* @param {string} name - The name of the frame. In Texture Atlas data this is usually set to the filename.
*/
Phaser.TextureFrame = function (texture, name, x, y, width, height) {

    /**
    * @property {Phaser.Texture} texture - The Texture this frame belongs to.
    */
    this.texture = texture;

    /**
    * @property {string} name - The name of this frame within the Texture.
    */
    this.name = name;

    //  x, y, width, height = PIXI.Texture.frame

    /**
    * @property {number} x - X position within the image to cut from.
    */
    this.x = x;

    /**
    * @property {number} y - Y position within the image to cut from.
    */
    this.y = y;

    /**
    * @property {number} width - Width of the frame.
    */
    this.width = width;

    /**
    * @property {number} height - Height of the frame.
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
    * @property {boolean} trimmed - Was it trimmed when packed?
    * @default
    */
    this.trimmed = false;

    /**
    * @property {Object} trim - The trim area.
    */
    this.trim = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    /**
    * @property {object} sourceSize - The width and height of the original sprite before it was trimmed.
    */
    this.sourceSize = {
        w: width,
        h: height
    };

    /**
    * @property {object} spriteSourceSize - The position of the trimmed frame data.
    */
    this.spriteSourceSize = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };

    /**
    * @property {number} spriteSourceSize.x - X position of the trimmed frame inside original texture.
    */
    /**
    * @property {number} spriteSourceSize.y - Y position of the trimmed frame inside original texture.
    */
    /**
    * @property {number} spriteSourceSize.w - Width of the trimmed frame.
    */
    /**
    * @property {number} spriteSourceSize.h - Height of the trimmed frame.
    */

    /**
    * @property {number} right - The right of the Frame (x + width).
    */
    this.right = this.x + this.width;

    /**
    * @property {number} bottom - The bottom of the frame (y + height).
    */
    this.bottom = this.y + this.height;

    /**
    * Is this a tiling texture? As used by the likes of a TilingSprite.
    *
    * @property isTiling
    * @type Boolean
    */
    this.isTiling = false;

    /**
    * This will let a renderer know that a tinted parent has updated its texture.
    *
    * @property requiresReTint
    * @type Boolean
    */
    this.requiresReTint = false;

    /**
    * This is the area of the Texture image to actually copy to the Canvas / WebGL when rendering,
    * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
    *
    * @property crop
    * @type Rectangle
    */
    this.crop = {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height
    };

    /**
    * The WebGL UV data cache.
    *
    * @property _uvs
    * @type Object
    * @private
    */
    this._uvs = {
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        x3: 0,
        y3: 0
    };

};

Phaser.TextureFrame.prototype = {

    /**
    * Adjusts of all the Frame properties based on the given width and height values.
    *
    * @method Phaser.TextureFrame#resize
    * @param {integer} width - The new width of the Frame.
    * @param {integer} height - The new height of the Frame.
    */
    resize: function (width, height) {

        this.width = width;
        this.height = height;
        this.sourceSize.w = width;
        this.sourceSize.h = height;
        this.right = this.x + width;
        this.bottom = this.y + height;

    },

    /**
    * If the frame was trimmed when added to the Texture Atlas this records the trim and source data.
    *
    * @method Phaser.TextureFrame#setTrim
    * @param {boolean} trimmed - If this frame was trimmed or not.
    * @param {number} actualWidth - The width of the frame before being trimmed.
    * @param {number} actualHeight - The height of the frame before being trimmed.
    * @param {number} destX - The destination X position of the trimmed frame for display.
    * @param {number} destY - The destination Y position of the trimmed frame for display.
    * @param {number} destWidth - The destination width of the trimmed frame for display.
    * @param {number} destHeight - The destination height of the trimmed frame for display.
    */
    setTrim: function (trimmed, actualWidth, actualHeight, destX, destY, destWidth, destHeight) {

        this.trimmed = trimmed;

        if (trimmed)
        {
            this.sourceSize.w = actualWidth;
            this.sourceSize.h = actualHeight;
            this.spriteSourceSize.x = destX;
            this.spriteSourceSize.y = destY;
            this.spriteSourceSize.w = destWidth;
            this.spriteSourceSize.h = destHeight;

            this.trim.x = destX;
            this.trim.y = destY;
            this.trim.width = destWidth;
            this.trim.height = destHeight;
        }

    },

    /**
     * Clones this Frame into a new Phaser.TextureFrame object and returns it.
     * Note that all properties are cloned, including the name and index.
     *
     * @method Phaser.TextureFrame#clone
     * @return {Phaser.TextureFrame} An exact copy of this Frame object.
     */
    clone: function () {

        var output = new Phaser.TextureFrame(this.texture, this.name, this.x, this.y, this.width, this.height);

        for (var prop in this)
        {
            if (this.hasOwnProperty(prop))
            {
                output[prop] = this[prop];
            }
        }

        return output;

    },

    /**
    * Returns a Rectangle set to the dimensions of this Frame.
    *
    * @method Phaser.TextureFrame#getRect
    * @param {Phaser.Rectangle} [out] - A rectangle to copy the frame dimensions to.
    * @return {Phaser.Rectangle} A rectangle.
    */
    getRect: function (out) {

        if (out === undefined)
        {
            out = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
        }
        else
        {
            out.setTo(this.x, this.y, this.width, this.height);
        }

        return out;

    },

    updateUVs: function () {

        var frame = this.crop;
        var tw = this.texture.width;
        var th = this.texture.height;
        
        this._uvs.x0 = frame.x / tw;
        this._uvs.y0 = frame.y / th;

        this._uvs.x1 = (frame.x + frame.width) / tw;
        this._uvs.y1 = frame.y / th;

        this._uvs.x2 = (frame.x + frame.width) / tw;
        this._uvs.y2 = (frame.y + frame.height) / th;

        this._uvs.x3 = frame.x / tw;
        this._uvs.y3 = (frame.y + frame.height) / th;

    },

    /**
    * Updates the internal WebGL UV cache.
    *
    * @method _updateUvsInverted
    * @private
    */
    updateUVsInverted: function () {

        var frame = this.crop;
        var tw = this.texture.width;
        var th = this.texture.height;
        
        this._uvs.x0 = frame.x / tw;
        this._uvs.y0 = frame.y / th;

        this._uvs.x1 = (frame.x + frame.height) / tw;
        this._uvs.y1 = frame.y / th;

        this._uvs.x2 = (frame.x + frame.height) / tw;
        this._uvs.y2 = (frame.y + frame.width) / th;

        this._uvs.x3 = frame.x / tw;
        this._uvs.y3 = (frame.y + frame.width) / th;

    },

    destroy: function () {

        //  TODO?

    }

};

Phaser.TextureFrame.prototype.constructor = Phaser.TextureFrame;
