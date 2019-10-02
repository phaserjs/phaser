/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = require('../../math/Clamp');

//  bitmask flag for GameObject.renderMask
var _FLAG = 2; // 0010

/**
 * Provides methods used for setting the alpha properties of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Alpha
 * @since 3.0.0
 */

var Alpha = {

    /**
     * Private internal value. Holds the global alpha value.
     *
     * @name Phaser.GameObjects.Components.Alpha#_alpha
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alpha: 1,

    /**
     * Private internal value. Holds the top-left alpha value.
     *
     * @name Phaser.GameObjects.Components.Alpha#_alphaTL
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alphaTL: 1,

    /**
     * Private internal value. Holds the top-right alpha value.
     *
     * @name Phaser.GameObjects.Components.Alpha#_alphaTR
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alphaTR: 1,

    /**
     * Private internal value. Holds the bottom-left alpha value.
     *
     * @name Phaser.GameObjects.Components.Alpha#_alphaBL
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alphaBL: 1,

    /**
     * Private internal value. Holds the bottom-right alpha value.
     *
     * @name Phaser.GameObjects.Components.Alpha#_alphaBR
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alphaBR: 1,

    /**
     * Clears all alpha values associated with this Game Object.
     *
     * Immediately sets the alpha levels back to 1 (fully opaque).
     *
     * @method Phaser.GameObjects.Components.Alpha#clearAlpha
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    clearAlpha: function ()
    {
        return this.setAlpha(1);
    },

    /**
     * Set the Alpha level of this Game Object. The alpha controls the opacity of the Game Object as it renders.
     * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
     *
     * If your game is running under WebGL you can optionally specify four different alpha values, each of which
     * correspond to the four corners of the Game Object. Under Canvas only the `topLeft` value given is used.
     *
     * @method Phaser.GameObjects.Components.Alpha#setAlpha
     * @since 3.0.0
     *
     * @param {number} [topLeft=1] - The alpha value used for the top-left of the Game Object. If this is the only value given it's applied across the whole Game Object.
     * @param {number} [topRight] - The alpha value used for the top-right of the Game Object. WebGL only.
     * @param {number} [bottomLeft] - The alpha value used for the bottom-left of the Game Object. WebGL only.
     * @param {number} [bottomRight] - The alpha value used for the bottom-right of the Game Object. WebGL only.
     *
     * @return {this} This Game Object instance.
     */
    setAlpha: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        if (topLeft === undefined) { topLeft = 1; }

        //  Treat as if there is only one alpha value for the whole Game Object
        if (topRight === undefined)
        {
            this.alpha = topLeft;
        }
        else
        {
            this._alphaTL = Clamp(topLeft, 0, 1);
            this._alphaTR = Clamp(topRight, 0, 1);
            this._alphaBL = Clamp(bottomLeft, 0, 1);
            this._alphaBR = Clamp(bottomRight, 0, 1);
        }

        return this;
    },

    /**
     * The alpha value of the Game Object.
     *
     * This is a global value, impacting the entire Game Object, not just a region of it.
     *
     * @name Phaser.GameObjects.Components.Alpha#alpha
     * @type {number}
     * @since 3.0.0
     */
    alpha: {

        get: function ()
        {
            return this._alpha;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alpha = v;
            this._alphaTL = v;
            this._alphaTR = v;
            this._alphaBL = v;
            this._alphaBR = v;

            if (v === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The alpha value starting from the top-left of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Alpha#alphaTopLeft
     * @type {number}
     * @webglOnly
     * @since 3.0.0
     */
    alphaTopLeft: {

        get: function ()
        {
            return this._alphaTL;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaTL = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The alpha value starting from the top-right of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Alpha#alphaTopRight
     * @type {number}
     * @webglOnly
     * @since 3.0.0
     */
    alphaTopRight: {

        get: function ()
        {
            return this._alphaTR;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaTR = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The alpha value starting from the bottom-left of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Alpha#alphaBottomLeft
     * @type {number}
     * @webglOnly
     * @since 3.0.0
     */
    alphaBottomLeft: {

        get: function ()
        {
            return this._alphaBL;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaBL = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The alpha value starting from the bottom-right of the Game Object.
     * This value is interpolated from the corner to the center of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Alpha#alphaBottomRight
     * @type {number}
     * @webglOnly
     * @since 3.0.0
     */
    alphaBottomRight: {

        get: function ()
        {
            return this._alphaBR;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaBR = v;

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    }

};

module.exports = Alpha;
