/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for setting the gravity properties of an Arcade Physics Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.Physics.Arcade.Components.Gravity
 * @since 3.0.0
 */
var Gravity = {

    /**
     * Set the X and Y values of the gravitational pull to act upon this Arcade Physics Game Object. Values can be positive or negative. Larger values result in a stronger effect.
     * 
     * If only one value is provided, this value will be used for both the X and Y axis.
     *
     * @method Phaser.Physics.Arcade.Components.Gravity#setGravity
     * @since 3.0.0
     *
     * @param {number} x - The gravitational force to be applied to the X-axis.
     * @param {number} [y=x] - The gravitational force to be applied to the Y-axis. If this is not specified, the X value will be used.
     *
     * @return {this} This Game Object.
     */
    setGravity: function (x, y)
    {
        this.body.gravity.set(x, y);

        return this;
    },

    /**
     * Set the gravitational force to be applied to the X axis. Value can be positive or negative. Larger values result in a stronger effect.
     *
     * @method Phaser.Physics.Arcade.Components.Gravity#setGravityX
     * @since 3.0.0
     *
     * @param {number} x - The gravitational force to be applied to the X-axis.
     *
     * @return {this} This Game Object.
     */
    setGravityX: function (x)
    {
        this.body.gravity.x = x;

        return this;
    },

    /**
     * Set the gravitational force to be applied to the Y axis. Value can be positive or negative. Larger values result in a stronger effect.
     *
     * @method Phaser.Physics.Arcade.Components.Gravity#setGravityY
     * @since 3.0.0
     *
     * @param {number} y - The gravitational force to be applied to the Y-axis.
     *
     * @return {this} This Game Object.
     */
    setGravityY: function (y)
    {
        this.body.gravity.y = y;

        return this;
    }

};

module.exports = Gravity;
