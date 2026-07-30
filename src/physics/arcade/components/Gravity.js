/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for setting the gravity properties of an Arcade Physics Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * Body gravity is a per-body acceleration applied in addition to the world gravity defined
 * in the Arcade Physics configuration. Use this component to give individual Game Objects
 * a different gravitational pull from the rest of the world, for example to make a Game
 * Object float upward against a downward world gravity, or to apply stronger gravity to
 * a specific Game Object without affecting others. Values are specified in pixels per
 * second squared.
 *
 * @namespace Phaser.Physics.Arcade.Components.Gravity
 * @since 3.0.0
 */
var Gravity = {

    /**
     * Sets the body gravity for both the X and Y axes. This is an acceleration applied to
     * this body in addition to the world gravity, in pixels per second squared. Values can
     * be positive or negative. Larger absolute values result in a stronger effect.
     *
     * If only one value is provided, it will be used for both the X and Y axes.
     *
     * @method Phaser.Physics.Arcade.Components.Gravity#setGravity
     * @since 3.0.0
     *
     * @param {number} x - The gravitational acceleration to be applied to the X-axis, in pixels per second squared.
     * @param {number} [y=x] - The gravitational acceleration to be applied to the Y-axis, in pixels per second squared. If not specified, the X value will be used.
     *
     * @return {this} This Game Object.
     */
    setGravity: function (x, y)
    {
        this.body.gravity.set(x, y);

        return this;
    },

    /**
     * Sets the body gravity applied to the X-axis. This is an acceleration in addition to
     * the world gravity, in pixels per second squared. Use a positive value to pull the body
     * to the right and a negative value to pull it to the left.
     *
     * @method Phaser.Physics.Arcade.Components.Gravity#setGravityX
     * @since 3.0.0
     *
     * @param {number} x - The gravitational acceleration to be applied to the X-axis, in pixels per second squared.
     *
     * @return {this} This Game Object.
     */
    setGravityX: function (x)
    {
        this.body.gravity.x = x;

        return this;
    },

    /**
     * Sets the body gravity applied to the Y-axis. This is an acceleration in addition to
     * the world gravity, in pixels per second squared. Use a positive value to pull the body
     * downward and a negative value to push it upward (against gravity).
     *
     * @method Phaser.Physics.Arcade.Components.Gravity#setGravityY
     * @since 3.0.0
     *
     * @param {number} y - The gravitational acceleration to be applied to the Y-axis, in pixels per second squared.
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
