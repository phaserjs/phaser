/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for visually flipping a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Flip
 * @since 3.0.0
 */

var Flip = {

    /**
     * The horizontally flipped state of the Game Object.
     *
     * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
     *
     * @name Phaser.GameObjects.Components.Flip#flipX
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    flipX: false,

    /**
     * The vertically flipped state of the Game Object.
     *
     * A Game Object that is flipped vertically will render inversed on the vertical axis (i.e. upside down)
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
     *
     * @name Phaser.GameObjects.Components.Flip#flipY
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    flipY: false,

    /**
     * Toggles the horizontal flipped state of this Game Object.
     *
     * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
     *
     * @method Phaser.GameObjects.Components.Flip#toggleFlipX
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    toggleFlipX: function ()
    {
        this.flipX = !this.flipX;

        return this;
    },

    /**
     * Toggles the vertical flipped state of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Flip#toggleFlipY
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    toggleFlipY: function ()
    {
        this.flipY = !this.flipY;

        return this;
    },

    /**
     * Sets the horizontal flipped state of this Game Object.
     *
     * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
     *
     * @method Phaser.GameObjects.Components.Flip#setFlipX
     * @since 3.0.0
     *
     * @param {boolean} value - The flipped state. `false` for no flip, or `true` to be flipped.
     *
     * @return {this} This Game Object instance.
     */
    setFlipX: function (value)
    {
        this.flipX = value;

        return this;
    },

    /**
     * Sets the vertical flipped state of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Flip#setFlipY
     * @since 3.0.0
     *
     * @param {boolean} value - The flipped state. `false` for no flip, or `true` to be flipped.
     *
     * @return {this} This Game Object instance.
     */
    setFlipY: function (value)
    {
        this.flipY = value;

        return this;
    },

    /**
     * Sets the horizontal and vertical flipped state of this Game Object.
     *
     * A Game Object that is flipped will render inversed on the flipped axis.
     * Flipping always takes place from the middle of the texture and does not impact the scale value.
     * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
     *
     * @method Phaser.GameObjects.Components.Flip#setFlip
     * @since 3.0.0
     *
     * @param {boolean} x - The horizontal flipped state. `false` for no flip, or `true` to be flipped.
     * @param {boolean} y - The horizontal flipped state. `false` for no flip, or `true` to be flipped.
     *
     * @return {this} This Game Object instance.
     */
    setFlip: function (x, y)
    {
        this.flipX = x;
        this.flipY = y;

        return this;
    },

    /**
     * Resets the horizontal and vertical flipped state of this Game Object back to their default un-flipped state.
     *
     * @method Phaser.GameObjects.Components.Flip#resetFlip
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    resetFlip: function ()
    {
        this.flipX = false;
        this.flipY = false;

        return this;
    }

};

module.exports = Flip;
