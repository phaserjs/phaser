/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  bitmask flag for GameObject.renderMask
var _FLAG = 1; // 0001

/**
 * Provides methods used for setting the visibility of a Game Object.
 * The Visible component is mixed into Game Objects to give them a `visible` boolean property
 * and a `setVisible` method. Visibility is tracked via a bitmask flag on `renderFlags`, so
 * toggling it is a fast bitwise operation. An invisible Game Object is excluded from the
 * render pass entirely, but its `update` logic continues to run normally each frame.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Visible
 * @since 3.0.0
 */

var Visible = {

    /**
     * Private internal value. Holds the visible value.
     *
     * @name Phaser.GameObjects.Components.Visible#_visible
     * @type {boolean}
     * @private
     * @default true
     * @since 3.0.0
     */
    _visible: true,

    /**
     * The visible state of the Game Object.
     *
     * An invisible Game Object will skip rendering, but will still process update logic.
     *
     * @name Phaser.GameObjects.Components.Visible#visible
     * @type {boolean}
     * @since 3.0.0
     */
    visible: {

        get: function ()
        {
            return this._visible;
        },

        set: function (value)
        {
            if (value)
            {
                this._visible = true;
                this.renderFlags |= _FLAG;
            }
            else
            {
                this._visible = false;
                this.renderFlags &= ~_FLAG;
            }
        }

    },

    /**
     * Sets the visibility of this Game Object.
     *
     * An invisible Game Object will skip rendering, but will still process update logic.
     *
     * @method Phaser.GameObjects.Components.Visible#setVisible
     * @since 3.0.0
     *
     * @param {boolean} value - The visible state of the Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setVisible: function (value)
    {
        this.visible = value;

        return this;
    }
};

module.exports = Visible;
