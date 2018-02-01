//  bitmask flag for GameObject.renderMask
var _FLAG = 1; // 0001

/**
 * Provides methods used for setting the visibility of a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @name Phaser.GameObjects.Components.Visible
 * @since 3.0.0
 */

var Visible = {

    _visible: true,

    /**
     * The visible state of the Game Object.
     * 
     * An invisible Game Object will skip rendering, but still process update logic.
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
     * @method Phaser.GameObjects.Components.Visible#setVisible
     * @since 3.0.0
     *
     * @param {boolean} value - The visible state of the Game Object.
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setVisible: function (value)
    {
        this.visible = value;

        return this;
    }
};

module.exports = Visible;
