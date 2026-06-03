/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TintModes = require('../../renderer/TintModes');

/**
 * Provides methods used for setting the tint of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Tint
 * @webglOnly
 * @since 3.0.0
 */

var Tint = {

    /**
     * The tint value being applied to the top-left vertex of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintTopLeft
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintTopLeft: 0xffffff,

    /**
     * The tint value being applied to the top-right vertex of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintTopRight
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintTopRight: 0xffffff,

    /**
     * The tint value being applied to the bottom-left vertex of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintBottomLeft
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintBottomLeft: 0xffffff,

    /**
     * The tint value being applied to the bottom-right vertex of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tintBottomRight
     * @type {number}
     * @default 0xffffff
     * @since 3.0.0
     */
    tintBottomRight: 0xffffff,

    /**
     * The secondary tint value being applied to the top-left vertex of the Game Object.
     * Used in two-color tint modes.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tint2TopLeft
     * @type {number}
     * @default 0x000000
     * @since 4.NEXT
     */
    tint2TopLeft: 0x000000,

    /**
     * The secondary tint value being applied to the top-right vertex of the Game Object.
     * Used in two-color tint modes.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tint2TopRight
     * @type {number}
     * @default 0x000000
     * @since 4.NEXT
     */
    tint2TopRight: 0x000000,

    /**
     * The secondary tint value being applied to the bottom-left vertex of the Game Object.
     * Used in two-color tint modes.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tint2BottomLeft
     * @type {number}
     * @default 0x000000
     * @since 4.NEXT
     */
    tint2BottomLeft: 0x000000,

    /**
     * The secondary tint value being applied to the bottom-right vertex of the Game Object.
     * Used in two-color tint modes.
     * This value is interpolated from the corner to the center of the Game Object.
     * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
     *
     * @name Phaser.GameObjects.Components.Tint#tint2BottomRight
     * @type {number}
     * @default 0x000000
     * @since 4.NEXT
    */
    tint2BottomRight: 0x000000,

    /**
     * The tint mode to use when applying the tint to the texture.
     *
     * Available modes are:
     * - Phaser.TintModes.MULTIPLY (default)
     * - Phaser.TintModes.FILL
     * - Phaser.TintModes.ADD
     * - Phaser.TintModes.SCREEN
     * - Phaser.TintModes.OVERLAY
     * - Phaser.TintModes.HARD_LIGHT
     * - Phaser.TintModes.MULTIPLY_TWO
     *
     * Note that in Phaser 3, tint mode and color were set at the same time.
     * In Phaser 4 they are separate settings.
     *
     * @name Phaser.GameObjects.Components.Tint#tintMode
     * @type {Phaser.TintModes}
     * @default Phaser.TintModes.MULTIPLY
     * @since 4.0.0
     */
    tintMode: TintModes.MULTIPLY,

    /**
     * Clears all tint values associated with this Game Object.
     *
     * Immediately sets the color values back to 0xffffff and the tint mode to `MULTIPLY`,
     * which results in no visible change to the texture.
     *
     * @method Phaser.GameObjects.Components.Tint#clearTint
     * @webglOnly
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    clearTint: function ()
    {
        this.setTint(0xffffff);
        this.setTint2(0x000000);
        this.setTintMode(TintModes.MULTIPLY);

        return this;
    },

    /**
     * Sets the tint color on this Game Object.
     *
     * The tint works by taking the pixel color values from the Game Objects texture, and then
     * combining it with the color value of the tint. You can provide either one color value,
     * in which case the whole Game Object will be tinted in that color. Or you can provide a color
     * per corner. The colors are blended together across the extent of the Game Object.
     *
     * To modify the tint color once set, either call this method again with new values or use the
     * `tint` property to set all colors at once. Or, use the properties `tintTopLeft`, `tintTopRight`,
     * `tintBottomLeft` and `tintBottomRight` to set the corner color values independently.
     *
     * To remove a tint call `clearTint`.
     *
     * The tint color is combined according to the tint mode.
     * By default, this is `MULTIPLY`.
     *
     * Note that, in Phaser 3, this would also swap the tint mode if it was set
     * to fill. In Phaser 4, the tint mode is separate: use `setTintMode`.
     *
     * @method Phaser.GameObjects.Components.Tint#setTint
     * @webglOnly
     * @since 3.0.0
     *
     * @param {number} [topLeft=0xffffff] - The tint being applied to the top-left of the Game Object. If no other values are given this value is applied evenly, tinting the whole Game Object.
     * @param {number} [topRight] - The tint being applied to the top-right of the Game Object.
     * @param {number} [bottomLeft] - The tint being applied to the bottom-left of the Game Object.
     * @param {number} [bottomRight] - The tint being applied to the bottom-right of the Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setTint: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        if (topLeft === undefined) { topLeft = 0xffffff; }

        if (topRight === undefined)
        {
            topRight = topLeft;
            bottomLeft = topLeft;
            bottomRight = topLeft;
        }

        this.tintTopLeft = topLeft;
        this.tintTopRight = topRight;
        this.tintBottomLeft = bottomLeft;
        this.tintBottomRight = bottomRight;

        return this;
    },

    /**
     * Sets the secondary tint color on this Game Object.
     * This is used in two-color tint modes.
     * See {@link Phaser.GameObjects.Components.Tint#setTint} for more information.
     *
     * @method Phaser.GameObjects.Components.Tint#setTint2
     * @webglOnly
     * @since 4.NEXT
     *
     * @param {number} [topLeft=0xffffff] - The secondary tint being applied to the top-left of the Game Object. If no other values are given this value is applied evenly, tinting the whole Game Object.
     * @param {number} [topRight] - The secondary tint being applied to the top-right of the Game Object.
     * @param {number} [bottomLeft] - The secondary tint being applied to the bottom-left of the Game Object.
     * @param {number} [bottomRight] - The secondary tint being applied to the bottom-right of the Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setTint2: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        if (topLeft === undefined) { topLeft = 0x000000; }
        if (topRight === undefined)
        {
            topRight = topLeft;
            bottomLeft = topLeft;
            bottomRight = topLeft;
        }

        this.tint2TopLeft = topLeft;
        this.tint2TopRight = topRight;
        this.tint2BottomLeft = bottomLeft;
        this.tint2BottomRight = bottomRight;

        return this;
    },

    /**
     * Sets the tint mode to use when applying the tint to the texture.
     *
     * Note that, in Phaser 3, tint mode and color were set at the same time.
     * In Phaser 4 they are separate settings.
     *
     * @method Phaser.GameObjects.Components.Tint#setTintMode
     * @webglOnly
     * @since 4.0.0
     *
     * @param {number | Phaser.TintModes} mode - The tint mode to use.
     * @return {this} This Game Object instance.
     */
    setTintMode: function (mode)
    {
        this.tintMode = mode;
        return this;
    },

    /**
     * Deprecated method which does nothing.
     * In Phaser 3, this would set the tint color, and set the tint mode to fill.
     * In Phaser 4, use `gameObject.setTint(color).setTintMode(Phaser.TintModes.FILL)` instead.
     *
     * @method Phaser.GameObjects.Components.Tint#setTintFill
     * @webglOnly
     * @since 3.11.0
     * @deprecated
     */
    setTintFill: function ()
    {
        // eslint-disable-next-line no-console
        console.error('`setTintFill(color)` is removed as of Phaser 4. Use setTint(color).setTintMode(Phaser.TintModes.FILL)` instead.');
    },

    /**
     * The tint value being applied to the whole of the Game Object.
     * Returns the value of `tintTopLeft` when read. When written, the same
     * color value is applied to all four corner tint properties (`tintTopLeft`,
     * `tintTopRight`, `tintBottomLeft`, and `tintBottomRight`) simultaneously.
     *
     * @name Phaser.GameObjects.Components.Tint#tint
     * @type {number}
     * @webglOnly
     * @since 3.0.0
     */
    tint: {

        get: function ()
        {
            return this.tintTopLeft;
        },

        set: function (value)
        {
            this.setTint(value, value, value, value);
        }
    },

    /**
     * Does this Game Object have a tint applied?
     *
     * Returns `true` if any of the four corner tint values differ from 0xffffff,
     * or if the `tintMode` property is set to anything other than `MULTIPLY`,
     * or if any of the four secondary corner tint values differ from 0x000000.
     * Returns `false` in the default untinted state.
     *
     * @name Phaser.GameObjects.Components.Tint#isTinted
     * @type {boolean}
     * @webglOnly
     * @readonly
     * @since 3.11.0
     */
    isTinted: {

        get: function ()
        {
            var white = 0xffffff;
            var black = 0x000000;

            return (
                this.tintMode !== TintModes.MULTIPLY ||
                this.tintTopLeft !== white ||
                this.tintTopRight !== white ||
                this.tintBottomLeft !== white ||
                this.tintBottomRight !== white ||
                this.tint2TopLeft !== black ||
                this.tint2TopRight !== black ||
                this.tint2BottomLeft !== black ||
                this.tint2BottomRight !== black
            );
        }

    }

};

module.exports = Tint;
