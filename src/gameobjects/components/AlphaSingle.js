/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = require('../../math/Clamp');

//  bitmask flag for GameObject.renderMask
var _FLAG = 2; // 0010

/**
 * Provides methods used for setting the alpha property of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.AlphaSingle
 * @since 3.22.0
 */

var AlphaSingle = {

    /**
     * Private internal value. Holds the global alpha value.
     *
     * @name Phaser.GameObjects.Components.AlphaSingle#_alpha
     * @type {number}
     * @private
     * @default 1
     * @since 3.0.0
     */
    _alpha: 1,

    /**
     * Clears all alpha values associated with this Game Object.
     *
     * Immediately sets the alpha levels back to 1 (fully opaque).
     *
     * @method Phaser.GameObjects.Components.AlphaSingle#clearAlpha
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
     * @method Phaser.GameObjects.Components.AlphaSingle#setAlpha
     * @since 3.0.0
     *
     * @param {number} [value=1] - The alpha value applied across the whole Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setAlpha: function (value)
    {
        if (value === undefined) { value = 1; }

        this.alpha = value;

        return this;
    },

    /**
     * The alpha value of the Game Object.
     *
     * This is a global value, impacting the entire Game Object, not just a region of it.
     *
     * @name Phaser.GameObjects.Components.AlphaSingle#alpha
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

            if (v === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    }

};

module.exports = AlphaSingle;
