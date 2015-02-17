Phaser.Component.LoadTexture = function () {};

Phaser.Component.LoadTexture.prototype = {

    /**
    * @property {Phaser.Rectangle} _frame - Internal cache var.
    * @private
    */
    _frame: null,

    /**
    * Changes the Texture the Sprite is using entirely. The old texture is removed and the new one is referenced or fetched from the Cache.
    * This causes a WebGL texture update, so use sparingly or in low-intensity portions of your game.
    *
    * @method Phaser.Sprite#loadTexture
    * @memberof Phaser.Sprite
    * @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
    * @param {string|number} [frame] - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
    * @param {boolean} [stopAnimation=true] - If an animation is already playing on this Sprite you can choose to stop it or let it carry on playing.
    */
    loadTexture: function (key, frame, stopAnimation) {

        frame = frame || 0;

        if (stopAnimation || typeof stopAnimation === 'undefined')
        {
            this.animations.stop();
        }

        this.key = key;

        var setFrame = true;
        var smoothed = !this.texture.baseTexture.scaleMode;

        if (key instanceof Phaser.RenderTexture)
        {
            this.key = key.key;
            this.setTexture(key);
        }
        else if (key instanceof Phaser.BitmapData)
        {
            //  This works from a reference, which probably isn't what we need here
            this.setTexture(key.texture);

            if (this.game.cache.getFrameData(key.key, Phaser.Cache.BITMAPDATA))
            {
                setFrame = !this.animations.loadFrameData(this.game.cache.getFrameData(key.key, Phaser.Cache.BITMAPDATA), frame);
            }
        }
        else if (key instanceof PIXI.Texture)
        {
            this.setTexture(key);
        }
        else
        {
            if (key === null || typeof key === 'undefined')
            {
                this.key = '__default';
                this.setTexture(PIXI.TextureCache[this.key]);
            }
            else if (typeof key === 'string' && !this.game.cache.checkImageKey(key))
            {
                console.warn("Texture with key '" + key + "' not found.");
                this.key = '__missing';
                this.setTexture(PIXI.TextureCache[this.key]);
            }
            else
            {
                this.setTexture(new PIXI.Texture(PIXI.BaseTextureCache[key]));

                setFrame = !this.animations.loadFrameData(this.game.cache.getFrameData(key), frame);
            }
        }
        
        if (!key instanceof Phaser.RenderTexture)
        {
            this.texture.baseTexture.dirty();
        }

        if (setFrame)
        {
            this._frame = Phaser.Rectangle.clone(this.texture.frame);
        }

        if (!smoothed)
        {
            this.texture.baseTexture.scaleMode = 1;
        }

    },

    /**
    * Sets the Texture frame the Sprite uses for rendering.
    * This is primarily an internal method used by Sprite.loadTexture, although you may call it directly.
    *
    * @method Phaser.Sprite#setFrame
    * @memberof Phaser.Sprite
    * @param {Phaser.Frame} frame - The Frame to be used by the Sprite texture.
    */
    setFrame: function(frame) {

        this._frame = frame;

        this.texture.frame.x = frame.x;
        this.texture.frame.y = frame.y;
        this.texture.frame.width = frame.width;
        this.texture.frame.height = frame.height;

        this.texture.crop.x = frame.x;
        this.texture.crop.y = frame.y;
        this.texture.crop.width = frame.width;
        this.texture.crop.height = frame.height;

        if (frame.trimmed)
        {
            if (this.texture.trim)
            {
                this.texture.trim.x = frame.spriteSourceSizeX;
                this.texture.trim.y = frame.spriteSourceSizeY;
                this.texture.trim.width = frame.sourceSizeW;
                this.texture.trim.height = frame.sourceSizeH;
            }
            else
            {
                this.texture.trim = { x: frame.spriteSourceSizeX, y: frame.spriteSourceSizeY, width: frame.sourceSizeW, height: frame.sourceSizeH };
            }

            this.texture.width = frame.sourceSizeW;
            this.texture.height = frame.sourceSizeH;
            this.texture.frame.width = frame.sourceSizeW;
            this.texture.frame.height = frame.sourceSizeH;
        }
        else if (!frame.trimmed && this.texture.trim)
        {
            this.texture.trim = null;
        }

        if (this.cropRect)
        {
            this.updateCrop();
        }

        if (this.tint !== 0xFFFFFF)
        {
            this.cachedTint = -1;
        }

        this.texture._updateUvs();

    },

    /**
    * Resets the Texture frame dimensions that the Sprite uses for rendering.
    *
    * @method Phaser.Sprite#resetFrame
    * @memberof Phaser.Sprite
    */
    resetFrame: function() {

        if (this._frame)
        {
            this.setFrame(this._frame);
        }

    },

    /**
    * @name Phaser.Sprite#frame
    * @property {number} frame - Gets or sets the current frame index and updates the Texture Cache for display.
    */
    frame: {

        get: function () {
            return this.animations.frame;
        },

        set: function (value) {
            this.animations.frame = value;
        }

    },

    /**
    * @name Phaser.Sprite#frameName
    * @property {string} frameName - Gets or sets the current frame name and updates the Texture Cache for display.
    */
    frameName: {

        get: function () {
            return this.animations.frameName;
        },

        set: function (value) {
            this.animations.frameName = value;
        }

    }

};
