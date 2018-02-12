/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  bitmask flag for GameObject.renderMask
var _FLAG = 8; // 1000

/**
 * Provides methods used for getting and setting the texture of a Game Object.
 * 
 * @name Phaser.GameObjects.Components.Texture
 * @since 3.0.0
 */

var Texture = {

    /**
     * The Texture this Game Object is using to render with.
     * 
     * @name Phaser.GameObjects.Components.Texture#texture
     * @type {Phaser.Textures.Texture}
     * @since 3.0.0
     */
    texture: null,

    /**
     * The Texture Frame this Game Object is using to render with.
     * 
     * @name Phaser.GameObjects.Components.Texture#frame
     * @type {Phaser.Textures.Frame}
     * @since 3.0.0
     */
    frame: null,

    /**
     * Sets the texture and frame this Game Object will use to render with.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     * 
     * @method Phaser.GameObjects.Components.Texture#setTexture
     * @since 3.0.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {string|integer} [frame] - The name or index of the frame within the Texture.
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setTexture: function (key, frame)
    {
        this.texture = this.scene.sys.textures.get(key);

        return this.setFrame(frame);
    },

    /**
     * Sets the frame this Game Object will use to render with.
     *
     * The Frame has to belong to the current Texture being used.
     *
     * It can be either a string or an index.
     * 
     * @method Phaser.GameObjects.Components.Texture#setFrame
     * @since 3.0.0
     *
     * @param {string|integer} frame - The name or index of the frame within the Texture.
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setFrame: function (frame)
    {
        this.frame = this.texture.get(frame);

        if (!this.frame.cutWidth || !this.frame.cutHeight)
        {
            this.renderFlags &= ~_FLAG;
        }
        else
        {
            this.renderFlags |= _FLAG;
        }

        if (this.frame.customPivot)
        {
            this.setOrigin(this.frame.pivotX, this.frame.pivotY);
        }

        return this;
    }

};

module.exports = Texture;
