/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @function GetColor
 * @since 3.0.0
 * @private
 */
var GetColor = function (value)
{
    return (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
};

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
     * Private internal value. Holds the top-left tint value.
     * 
     * @name Phaser.GameObjects.Components.Tint#_tintTL
     * @type {number}
     * @private
     * @default 16777215
     * @since 3.0.0
     */
    _tintTL: 16777215,

    /**
     * Private internal value. Holds the top-right tint value.
     * 
     * @name Phaser.GameObjects.Components.Tint#_tintTR
     * @type {number}
     * @private
     * @default 16777215
     * @since 3.0.0
     */
    _tintTR: 16777215,

    /**
     * Private internal value. Holds the bottom-left tint value.
     * 
     * @name Phaser.GameObjects.Components.Tint#_tintBL
     * @type {number}
     * @private
     * @default 16777215
     * @since 3.0.0
     */
    _tintBL: 16777215,

    /**
     * Private internal value. Holds the bottom-right tint value.
     * 
     * @name Phaser.GameObjects.Components.Tint#_tintBR
     * @type {number}
     * @private
     * @default 16777215
     * @since 3.0.0
     */
    _tintBR: 16777215,

    /**
     * Private internal value. Holds if the Game Object is tinted or not.
     * 
     * @name Phaser.GameObjects.Components.Tint#_isTinted
     * @type {boolean}
     * @private
     * @default false
     * @since 3.11.0
     */
    _isTinted: false,

    /**
     * Fill or additive?
     * 
     * @name Phaser.GameObjects.Components.Tint#tintFill
     * @type {boolean}
     * @default false
     * @since 3.11.0
     */
    tintFill: false,

    /**
     * Clears all tint values associated with this Game Object.
     * 
     * Immediately sets the color values back to 0xffffff and the tint type to 'additive',
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

        this._isTinted = false;

        return this;
    },

    /**
     * Sets an additive tint on this Game Object.
     * 
     * The tint works by taking the pixel color values from the Game Objects texture, and then
     * multiplying it by the color value of the tint. You can provide either one color value,
     * in which case the whole Game Object will be tinted in that color. Or you can provide a color
     * per corner. The colors are blended together across the extent of the Game Object.
     * 
     * To modify the tint color once set, either call this method again with new values or use the
     * `tint` property to set all colors at once. Or, use the properties `tintTopLeft`, `tintTopRight,
     * `tintBottomLeft` and `tintBottomRight` to set the corner color values independently.
     * 
     * To remove a tint call `clearTint`.
     * 
     * To swap this from being an additive tint to a fill based tint set the property `tintFill` to `true`.
     *
     * @method Phaser.GameObjects.Components.Tint#setTint
     * @webglOnly
     * @since 3.0.0
     *
     * @param {integer} [topLeft=0xffffff] - The tint being applied to the top-left of the Game Object. If no other values are given this value is applied evenly, tinting the whole Game Object.
     * @param {integer} [topRight] - The tint being applied to the top-right of the Game Object.
     * @param {integer} [bottomLeft] - The tint being applied to the bottom-left of the Game Object.
     * @param {integer} [bottomRight] - The tint being applied to the bottom-right of the Game Object.
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

        this._tintTL = GetColor(topLeft);
        this._tintTR = GetColor(topRight);
        this._tintBL = GetColor(bottomLeft);
        this._tintBR = GetColor(bottomRight);

        this._isTinted = true;

        this.tintFill = false;

        return this;
    },

    /**
     * Sets a fill-based tint on this Game Object.
     * 
     * Unlike an additive tint, a fill-tint literally replaces the pixel colors from the texture
     * with those in the tint. You can use this for effects such as making a player flash 'white'
     * if hit by something. You can provide either one color value, in which case the whole
     * Game Object will be rendered in that color. Or you can provide a color per corner. The colors
     * are blended together across the extent of the Game Object.
     * 
     * To modify the tint color once set, either call this method again with new values or use the
     * `tint` property to set all colors at once. Or, use the properties `tintTopLeft`, `tintTopRight,
     * `tintBottomLeft` and `tintBottomRight` to set the corner color values independently.
     * 
     * To remove a tint call `clearTint`.
     * 
     * To swap this from being a fill-tint to an additive tint set the property `tintFill` to `false`.
     *
     * @method Phaser.GameObjects.Components.Tint#setTintFill
     * @webglOnly
     * @since 3.11.0
     *
     * @param {integer} [topLeft=0xffffff] - The tint being applied to the top-left of the Game Object. If not other values are given this value is applied evenly, tinting the whole Game Object.
     * @param {integer} [topRight] - The tint being applied to the top-right of the Game Object.
     * @param {integer} [bottomLeft] - The tint being applied to the bottom-left of the Game Object.
     * @param {integer} [bottomRight] - The tint being applied to the bottom-right of the Game Object.
     * 
     * @return {this} This Game Object instance.
     */
    setTintFill: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        this.setTint(topLeft, topRight, bottomLeft, bottomRight);

        this.tintFill = true;

        return this;
    },

    /**
     * The tint value being applied to the top-left of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * 
     * @name Phaser.GameObjects.Components.Tint#tintTopLeft
     * @type {integer}
     * @webglOnly
     * @since 3.0.0
     */
    tintTopLeft: {

        get: function ()
        {
            return this._tintTL;
        },

        set: function (value)
        {
            this._tintTL = GetColor(value);
            this._isTinted = true;
        }

    },

    /**
     * The tint value being applied to the top-right of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * 
     * @name Phaser.GameObjects.Components.Tint#tintTopRight
     * @type {integer}
     * @webglOnly
     * @since 3.0.0
     */
    tintTopRight: {

        get: function ()
        {
            return this._tintTR;
        },

        set: function (value)
        {
            this._tintTR = GetColor(value);
            this._isTinted = true;
        }

    },

    /**
     * The tint value being applied to the bottom-left of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * 
     * @name Phaser.GameObjects.Components.Tint#tintBottomLeft
     * @type {integer}
     * @webglOnly
     * @since 3.0.0
     */
    tintBottomLeft: {

        get: function ()
        {
            return this._tintBL;
        },

        set: function (value)
        {
            this._tintBL = GetColor(value);
            this._isTinted = true;
        }

    },

    /**
     * The tint value being applied to the bottom-right of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     * 
     * @name Phaser.GameObjects.Components.Tint#tintBottomRight
     * @type {integer}
     * @webglOnly
     * @since 3.0.0
     */
    tintBottomRight: {

        get: function ()
        {
            return this._tintBR;
        },

        set: function (value)
        {
            this._tintBR = GetColor(value);
            this._isTinted = true;
        }

    },

    /**
     * The tint value being applied to the whole of the Game Object.
     * This property is a setter-only. Use the properties `tintTopLeft` etc to read the current tint value.
     * 
     * @name Phaser.GameObjects.Components.Tint#tint
     * @type {integer}
     * @webglOnly
     * @since 3.0.0
     */
    tint: {

        set: function (value)
        {
            this.setTint(value, value, value, value);
        }
    },

    /**
     * Does this Game Object have a tint applied to it or not?
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
            return this._isTinted;
        }

    }

};

module.exports = Tint;
