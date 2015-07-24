/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Crop component provides the ability to crop a texture based Game Object to a defined rectangle, 
* which can be updated in real-time.
*
* @class
*/
Phaser.Component.Crop = function () {};

Phaser.Component.Crop.prototype = {

    /**
    * The Rectangle used to crop the texture this Game Object uses.
    * Set this property via `crop`. 
    * If you modify this property directly you must call `updateCrop` in order to have the change take effect.
    * @property {Phaser.Rectangle} cropRect
    * @default
    */
    cropRect: null,

    /**
    * @property {Phaser.Rectangle} _crop - Internal cache var.
    * @private
    */
    _crop: null,

    /**
    * Crop allows you to crop the texture being used to display this Game Object.
    * Setting a crop rectangle modifies the core texture frame. The Game Object width and height properties will be adjusted accordingly.
    *
    * Cropping takes place from the top-left and can be modified in real-time either by providing an updated rectangle object to this method,
    * or by modifying `cropRect` property directly and then calling `updateCrop`.
    *
    * The rectangle object given to this method can be either a `Phaser.Rectangle` or any other object 
    * so long as it has public `x`, `y`, `width`, `height`, `right` and `bottom` properties.
    * 
    * A reference to the rectangle is stored in `cropRect` unless the `copy` parameter is `true`, 
    * in which case the values are duplicated to a local object.
    *
    * @method
    * @param {Phaser.Rectangle} rect - The Rectangle used during cropping. Pass null or no parameters to clear a previously set crop rectangle.
    * @param {boolean} [copy=false] - If false `cropRect` will be stored as a reference to the given rect. If true it will copy the rect values into a local Phaser Rectangle object stored in cropRect.
    */
    crop: function(rect, copy) {

        if (copy === undefined) { copy = false; }

        if (rect)
        {
            if (copy && this.cropRect !== null)
            {
                this.cropRect.setTo(rect.x, rect.y, rect.width, rect.height);
            }
            else if (copy && this.cropRect === null)
            {
                this.cropRect = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height);
            }
            else
            {
                this.cropRect = rect;
            }

            this.updateCrop();
        }
        else
        {
            this._crop = null;
            this.cropRect = null;

            this.resetFrame();
        }

    },

    /**
    * If you have set a crop rectangle on this Game Object via `crop` and since modified the `cropRect` property,
    * or the rectangle it references, then you need to update the crop frame by calling this method.
    *
    * @method
    */
    updateCrop: function() {

        if (!this.cropRect)
        {
            return;
        }

        this._crop = Phaser.Rectangle.clone(this.cropRect, this._crop);
        this._crop.x += this._frame.x;
        this._crop.y += this._frame.y;

        var cx = Math.max(this._frame.x, this._crop.x);
        var cy = Math.max(this._frame.y, this._crop.y);
        var cw = Math.min(this._frame.right, this._crop.right) - cx;
        var ch = Math.min(this._frame.bottom, this._crop.bottom) - cy;

        this.texture.crop.x = cx;
        this.texture.crop.y = cy;
        this.texture.crop.width = cw;
        this.texture.crop.height = ch;

        this.texture.frame.width = Math.min(cw, this.cropRect.width);
        this.texture.frame.height = Math.min(ch, this.cropRect.height);

        this.texture.width = this.texture.frame.width;
        this.texture.height = this.texture.frame.height;

        this.texture._updateUvs();

    }

};
