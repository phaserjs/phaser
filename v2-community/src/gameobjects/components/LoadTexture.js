/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The LoadTexture component manages the loading of a texture into the Game Object and the changing of frames.
*
* @class
*/
Phaser.Component.LoadTexture = function () {};

Phaser.Component.LoadTexture.prototype = {

    /**
    * @property {boolean} customRender - Does this texture require a custom render call? (as set by BitmapData, Video, etc)
    * @private
    */
    customRender: false,

    /**
    * @property {Phaser.Rectangle} _frame - Internal cache var.
    * @private
    */
    _frame: null,

    /**
    * Changes the base texture the Game Object is using. The old texture is removed and the new one is referenced or fetched from the Cache.
    * 
    * If your Game Object is using a frame from a texture atlas and you just wish to change to another frame, then see the `frame` or `frameName` properties instead.
    * 
    * You should only use `loadTexture` if you want to replace the base texture entirely.
    * 
    * Calling this method causes a WebGL texture update, so use sparingly or in low-intensity portions of your game, or if you know the new texture is already on the GPU.
    *
    * You can use the new const `Phaser.PENDING_ATLAS` as the texture key for any sprite. 
    * Doing this then sets the key to be the `frame` argument (the frame is set to zero). 
    * 
    * This allows you to create sprites using `load.image` during development, and then change them 
    * to use a Texture Atlas later in development by simply searching your code for 'PENDING_ATLAS' 
    * and swapping it to be the key of the atlas data.
    *
    * Note: You cannot use a RenderTexture as a texture for a TileSprite.
    *
    * @method
    * @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache Image entry, or an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
    * @param {string|number} [frame] - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
    * @param {boolean} [stopAnimation=true] - If an animation is already playing on this Sprite you can choose to stop it or let it carry on playing.
    */
    loadTexture: function (key, frame, stopAnimation) {

        if (key === Phaser.PENDING_ATLAS)
        {
            key = frame;
            frame = 0;
        }
        else
        {
            frame = frame || 0;
        }

        if ((stopAnimation || stopAnimation === undefined) && this.animations)
        {
            this.animations.stop();
        }

        this.key = key;
        this.customRender = false;
        var cache = this.game.cache;

        var setFrame = true;
        var smoothed = !this.texture.baseTexture.scaleMode;

        if (Phaser.RenderTexture && key instanceof Phaser.RenderTexture)
        {
            this.key = key.key;
            this.setTexture(key);
        }
        else if (Phaser.BitmapData && key instanceof Phaser.BitmapData)
        {
            this.customRender = true;

            this.setTexture(key.texture);

            if (cache.hasFrameData(key.key, Phaser.Cache.BITMAPDATA))
            {
                setFrame = !this.animations.loadFrameData(cache.getFrameData(key.key, Phaser.Cache.BITMAPDATA), frame);
            }
            else
            {
                setFrame = !this.animations.loadFrameData(key.frameData, 0);
            }
        }
        else if (Phaser.Video && key instanceof Phaser.Video)
        {
            this.customRender = true;

            //  This works from a reference, which probably isn't what we need here
            var valid = key.texture.valid;
            this.setTexture(key.texture);
            this.setFrame(key.texture.frame.clone());
            key.onChangeSource.add(this.resizeFrame, this);
            this.texture.valid = valid;
        }
        else if (Phaser.Tilemap && key instanceof Phaser.TilemapLayer)
        {
            // this.customRender = true;

            this.setTexture(PIXI.Texture.fromCanvas(key.canvas));
        }
        else if (key instanceof PIXI.Texture)
        {
            this.setTexture(key);
        }
        else
        {
            var img = cache.getImage(key, true);

            this.key = img.key;
            this.setTexture(new PIXI.Texture(img.base));

            if (key === '__default')
            {
                this.texture.baseTexture.skipRender = true;
            }
            else
            {
                this.texture.baseTexture.skipRender = false;
            }

            setFrame = !this.animations.loadFrameData(img.frameData, frame);
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
    * Sets the texture frame the Game Object uses for rendering.
    * 
    * This is primarily an internal method used by `loadTexture`, but is exposed for the use of plugins and custom classes.
    *
    * @method
    * @param {Phaser.Frame} frame - The Frame to be used by the texture.
    */
    setFrame: function (frame) {

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

        if (frame.rotated)
        {
            this.texture.rotated = true;
        }

        if (this.cropRect)
        {
            this.updateCrop();
        }
        
        this.texture.requiresReTint = true;
        
        this.texture._updateUvs();

        if (this.tilingTexture)
        {
            this.refreshTexture = true;
        }

    },

    /**
    * Resizes the Frame dimensions that the Game Object uses for rendering.
    * 
    * You shouldn't normally need to ever call this, but in the case of special texture types such as Video or BitmapData
    * it can be useful to adjust the dimensions directly in this way.
    *
    * @method
    * @param {object} parent - The parent texture object that caused the resize, i.e. a Phaser.Video object.
    * @param {integer} width - The new width of the texture.
    * @param {integer} height - The new height of the texture.
    */
    resizeFrame: function (parent, width, height) {

        this.texture.frame.resize(width, height);
        this.texture.setFrame(this.texture.frame);

    },

    /**
    * Resets the texture frame dimensions that the Game Object uses for rendering.
    *
    * @method
    */
    resetFrame: function () {

        if (this._frame)
        {
            this.setFrame(this._frame);
        }

    },

    /**
    * Gets or sets the current frame index of the texture being used to render this Game Object.
    *
    * To change the frame set `frame` to the index of the new frame in the sprite sheet you wish this Game Object to use,
    * for example: `player.frame = 4`.
    * 
    * If the frame index given doesn't exist it will revert to the first frame found in the texture.
    * 
    * If you are using a texture atlas then you should use the `frameName` property instead.
    * 
    * If you wish to fully replace the texture being used see `loadTexture`.
    * @property {integer} frame
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
    * Gets or sets the current frame name of the texture being used to render this Game Object.
    * 
    * To change the frame set `frameName` to the name of the new frame in the texture atlas you wish this Game Object to use, 
    * for example: `player.frameName = "idle"`.
    *
    * If the frame name given doesn't exist it will revert to the first frame found in the texture and throw a console warning.
    * 
    * If you are using a sprite sheet then you should use the `frame` property instead.
    * 
    * If you wish to fully replace the texture being used see `loadTexture`.
    * @property {string} frameName
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
