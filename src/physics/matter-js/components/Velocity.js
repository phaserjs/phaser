/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Body = require('../lib/body/Body');

/**
 * Contains methods for changing the velocity of a Matter Body. Should be used as a mixin and not called directly.
 *
 * @namespace Phaser.Physics.Matter.Components.Velocity
 * @since 3.0.0
 */
var Velocity = {

    /**
     * Sets the angular velocity of the body instantly.
     * Position, angle, force etc. are unchanged.
     *
     * @method Phaser.Physics.Matter.Components.Velocity#setAngularVelocity
     * @since 3.0.0
     *
     * @param {number} value - The angular velocity.
     *
     * @return {this} This Game Object instance.
     */
    setAngularVelocity: function (value)
    {
        Body.setAngularVelocity(this.body, value);

        return this;
    },

    /**
     * Sets the horizontal velocity of the physics body.
     *
     * @method Phaser.Physics.Matter.Components.Velocity#setVelocityX
     * @since 3.0.0
     *
     * @param {number} x - The horizontal velocity value.
     *
     * @return {this} This Game Object instance.
     */
    setVelocityX: function (x)
    {
        this._tempVec2.set(x, this.body.velocity.y);

        Body.setVelocity(this.body, this._tempVec2);

        return this;
    },

    /**
     * Sets vertical velocity of the physics body.
     *
     * @method Phaser.Physics.Matter.Components.Velocity#setVelocityY
     * @since 3.0.0
     *
     * @param {number} y - The vertical velocity value.
     *
     * @return {this} This Game Object instance.
     */
    setVelocityY: function (y)
    {
        this._tempVec2.set(this.body.velocity.x, y);

        Body.setVelocity(this.body, this._tempVec2);

        return this;
    },

    /**
     * Sets both the horizontal and vertical velocity of the physics body.
     *
     * @method Phaser.Physics.Matter.Components.Velocity#setVelocity
     * @since 3.0.0
     *
     * @param {number} x - The horizontal velocity value.
     * @param {number} [y=x] - The vertical velocity value, it can be either positive or negative. If not given, it will be the same as the `x` value.
     *
     * @return {this} This Game Object instance.
     */
    setVelocity: function (x, y)
    {
        this._tempVec2.set(x, y);

        Body.setVelocity(this.body, this._tempVec2);

        return this;
    }

};

module.exports = Velocity;
