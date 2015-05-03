/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
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
    * @method
    * @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache Image entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
    * @param {string|number} [frame] - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
    * @param {boolean} [stopAnimation=true] - If an animation is already playing on this Sprite you can choose to stop it or let it carry on playing.
    */
    loadTexture: function (key, frame, stopAnimation) {

        frame = frame || 0;

        if ((stopAnimation || typeof stopAnimation === 'undefined') && this.animations)
        {
            this.animations.stop();
        }

        this.key = key;

        var setFrame = true;
        var smoothed = !this.texture.baseTexture.scaleMode;
        var isRenderTexture = false;

        if (Phaser.RenderTexture && key instanceof Phaser.RenderTexture)
        {
            this.key = key.key;
            this.setTexture(key);
            isRenderTexture = true;
        }
        else if (Phaser.BitmapData && key instanceof Phaser.BitmapData)
        {
            //  This works from a reference, which probably isn't what we need here
            this.setTexture(key.texture);

            if (this.game.cache.getFrameData(key.key, Phaser.Cache.BITMAPDATA))
            {
                setFrame = !this.animations.loadFrameData(this.game.cache.getFrameData(key.key, Phaser.Cache.BITMAPDATA), frame);
            }
        }
        else if (Phaser.Video && key instanceof Phaser.Video)
        {
            //  This works from a reference, which probably isn't what we need here
            this.setTexture(key.texture);

            if (this.game.cache.getFrameData(key.key, Phaser.Cache.VIDEO))
            {
                setFrame = !this.animations.loadFrameData(this.game.cache.getFrameData(key.key, Phaser.Cache.VIDEO), frame);
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

        if (this.cropRect)
        {
            this.updateCrop();
        }

        if (this.tint !== 0xFFFFFF)
        {
            this.cachedTint = -1;
        }

        this.texture._updateUvs();

        if (this.tilingTexture)
        {
            this.refreshTexture = true;
        }

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
