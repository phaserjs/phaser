/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Impact Acceleration component.
 * Should be applied as a mixin.
 *
 * @namespace Phaser.Physics.Impact.Components.Acceleration
 * @since 3.0.0
 */
var Acceleration = {

    /**
     * Sets the horizontal acceleration of this body.
     *
     * @method Phaser.Physics.Impact.Components.Acceleration#setAccelerationX
     * @since 3.0.0
     *
     * @param {number} x - The amount of acceleration to apply.
     *
     * @return {this} This Game Object.
     */
    setAccelerationX: function (x)
    {
        this.accel.x = x;

        return this;
    },

    /**
     * Sets the vertical acceleration of this body.
     *
     * @method Phaser.Physics.Impact.Components.Acceleration#setAccelerationY
     * @since 3.0.0
     *
     * @param {number} y - The amount of acceleration to apply.
     *
     * @return {this} This Game Object.
     */
    setAccelerationY: function (y)
    {
        this.accel.y = y;

        return this;
    },

    /**
     * Sets the horizontal and vertical acceleration of this body.
     *
     * @method Phaser.Physics.Impact.Components.Acceleration#setAcceleration
     * @since 3.0.0
     *
     * @param {number} x - The amount of horizontal acceleration to apply.
     * @param {number} y - The amount of vertical acceleration to apply.
     *
     * @return {this} This Game Object.
     */
    setAcceleration: function (x, y)
    {
        this.accel.x = x;
        this.accel.y = y;

        return this;
    }

};

module.exports = Acceleration;
