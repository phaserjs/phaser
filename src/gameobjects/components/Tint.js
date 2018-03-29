/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
 * @name Phaser.GameObjects.Components.Tint
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
     * Clears all tint values associated with this Game Object.
     * Immediately sets the alpha levels back to 0xffffff (no tint)
     *
     * @method Phaser.GameObjects.Components.Tint#clearTint
     * @webglOnly
     * @since 3.0.0
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    clearTint: function ()
    {
        this.setTint(0xffffff);

        return this;
    },

    /**
     * Sets the tint values for this Game Object.
     *
     * @method Phaser.GameObjects.Components.Tint#setTint
     * @webglOnly
     * @since 3.0.0
     *
     * @param {integer} [topLeft=0xffffff] - The tint being applied to the top-left of the Game Object. If not other values are given this value is applied evenly, tinting the whole Game Object.
     * @param {integer} [topRight] - The tint being applied to the top-right of the Game Object.
     * @param {integer} [bottomLeft] - The tint being applied to the bottom-left of the Game Object.
     * @param {integer} [bottomRight] - The tint being applied to the bottom-right of the Game Object.
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
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
        }

    },

    /**
     * The tint value being applied to the whole of the Game Object.
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
    }

};

module.exports = Tint;
