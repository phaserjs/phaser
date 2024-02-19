/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Frame = require('../../textures/Frame');

//  bitmask flag for GameObject.renderMask
var _FLAG = 8; // 1000

/**
 * Provides methods used for getting and setting the texture of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.Texture
 * @since 3.0.0
 */

var Texture = {

    /**
     * The Texture this Game Object is using to render with.
     *
     * @name Phaser.GameObjects.Components.Texture#texture
     * @type {Phaser.Textures.Texture|Phaser.Textures.CanvasTexture}
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
     * Internal flag. Not to be set by this Game Object.
     *
     * @name Phaser.GameObjects.Components.Texture#isCropped
     * @type {boolean}
     * @private
     * @since 3.11.0
     */
    isCropped: false,

    /**
     * Sets the texture and frame this Game Object will use to render with.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * Calling this method will modify the `width` and `height` properties of your Game Object.
     *
     * It will also change the `origin` if the Frame has a custom pivot point, as exported from packages like Texture Packer.
     *
     * @method Phaser.GameObjects.Components.Texture#setTexture
     * @since 3.0.0
     *
     * @param {(string|Phaser.Textures.Texture)} key - The key of the texture to be used, as stored in the Texture Manager, or a Texture instance.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture.
     * @param {boolean} [updateSize=true] - Should this call adjust the size of the Game Object?
     * @param {boolean} [updateOrigin=true] - Should this call change the origin of the Game Object?
     *
     * @return {this} This Game Object instance.
     */
    setTexture: function (key, frame, updateSize, updateOrigin)
    {
        this.texture = this.scene.sys.textures.get(key);

        return this.setFrame(frame, updateSize, updateOrigin);
    },

    /**
     * Sets the frame this Game Object will use to render with.
     *
     * If you pass a string or index then the Frame has to belong to the current Texture being used
     * by this Game Object.
     *
     * If you pass a Frame instance, then the Texture being used by this Game Object will also be updated.
     *
     * Calling `setFrame` will modify the `width` and `height` properties of your Game Object.
     *
     * It will also change the `origin` if the Frame has a custom pivot point, as exported from packages like Texture Packer.
     *
     * @method Phaser.GameObjects.Components.Texture#setFrame
     * @since 3.0.0
     *
     * @param {(string|number|Phaser.Textures.Frame)} frame - The name or index of the frame within the Texture, or a Frame instance.
     * @param {boolean} [updateSize=true] - Should this call adjust the size of the Game Object?
     * @param {boolean} [updateOrigin=true] - Should this call adjust the origin of the Game Object?
     *
     * @return {this} This Game Object instance.
     */
    setFrame: function (frame, updateSize, updateOrigin)
    {
        if (updateSize === undefined) { updateSize = true; }
        if (updateOrigin === undefined) { updateOrigin = true; }

        if (frame instanceof Frame)
        {
            this.texture = this.scene.sys.textures.get(frame.texture.key);

            this.frame = frame;
        }
        else
        {
            this.frame = this.texture.get(frame);
        }

        if (!this.frame.cutWidth || !this.frame.cutHeight)
        {
            this.renderFlags &= ~_FLAG;
        }
        else
        {
            this.renderFlags |= _FLAG;
        }

        if (this._sizeComponent && updateSize)
        {
            this.setSizeToFrame();
        }

        if (this._originComponent && updateOrigin)
        {
            if (this.frame.customPivot)
            {
                this.setOrigin(this.frame.pivotX, this.frame.pivotY);
            }
            else
            {
                this.updateDisplayOrigin();
            }
        }

        return this;
    }

};

module.exports = Texture;
