/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * A component to manipulate world gravity for Matter.js bodies.
 *
 * @namespace Phaser.Physics.Matter.Components.Gravity
 * @since 3.0.0
 */
var Gravity = {

    /**
     * A togglable function for ignoring world gravity in real-time on the current body.
     *
     * @method Phaser.Physics.Matter.Components.Gravity#setIgnoreGravity
     * @since 3.0.0
     *
     * @param {boolean} value - Set to true to ignore the effect of world gravity, or false to not ignore it.
     *
     * @return {this} This Game Object instance.
     */
    setIgnoreGravity: function (value)
    {
        this.body.ignoreGravity = value;

        return this;
    }

};

module.exports = Gravity;
