Phaser.Component.Crop = function () {};

Phaser.Component.Crop.prototype = {

    /**
    * @property {Phaser.Rectangle} cropRect - The Rectangle used to crop the texture. Set this via Sprite.crop. Any time you modify this property directly you must call Sprite.updateCrop.
    * @default
    */
    cropRect: null,

    /**
    * @property {Phaser.Rectangle} _crop - Internal cache var.
    * @private
    */
    _crop: null,

    /**
    * Crop allows you to crop the texture used to display this Sprite.
    * This modifies the core Sprite texture frame, so the Sprite width/height properties will adjust accordingly.
    *
    * Cropping takes place from the top-left of the Sprite and can be modified in real-time by either providing an updated rectangle object to Sprite.crop,
    * or by modifying Sprite.cropRect (or a reference to it) and then calling Sprite.updateCrop.
    *
    * The rectangle object given to this method can be either a Phaser.Rectangle or any object so long as it has public x, y, width and height properties.
    * A reference to the rectangle is stored in Sprite.cropRect unless the `copy` parameter is `true` in which case the values are duplicated to a local object.
    *
    * @method Phaser.Sprite#crop
    * @memberof Phaser.Sprite
    * @param {Phaser.Rectangle} rect - The Rectangle used during cropping. Pass null or no parameters to clear a previously set crop rectangle.
    * @param {boolean} [copy=false] - If false Sprite.cropRect will be a reference to the given rect. If true it will copy the rect values into a local Sprite.cropRect object.
    */
    crop: function(rect, copy) {

        if (typeof copy === 'undefined') { copy = false; }

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
    * If you have set a crop rectangle on this Sprite via Sprite.crop and since modified the Sprite.cropRect property (or the rectangle it references)
    * then you need to update the crop frame by calling this method.
    *
    * @method Phaser.Sprite#updateCrop
    * @memberof Phaser.Sprite
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
