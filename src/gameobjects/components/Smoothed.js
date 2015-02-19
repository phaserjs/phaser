Phaser.Component.Smoothed = function () {};

Phaser.Component.Smoothed.prototype = {

    /**
    * Enable or disable texture smoothing for this Sprite. Only works for bitmap/image textures. Smoothing is enabled by default.
    *
    * @name Phaser.Sprite#smoothed
    * @property {boolean} smoothed - Set to true to smooth the texture of this Sprite, or false to disable smoothing (great for pixel art)
    */
    smoothed: {

        get: function () {

            return !this.texture.baseTexture.scaleMode;

        },

        set: function (value) {

            if (value)
            {
                if (this.texture)
                {
                    this.texture.baseTexture.scaleMode = 0;
                }
            }
            else
            {
                if (this.texture)
                {
                    this.texture.baseTexture.scaleMode = 1;
                }
            }
        }

    }

};
