/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
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
    },

    /**
     * Gets the current linear velocity of the physics body.
     *
     * @method Phaser.Physics.Matter.Components.Velocity#getVelocity
     * @since 3.60.0
     *
     * @return {Phaser.Types.Math.Vector2Like} The current linear velocity of the body.
     */
    getVelocity: function ()
    {
        return Body.getVelocity(this.body);
    },

    /**
     * Sets the angular velocity of the body instantly.
     * Position, angle, force etc. are unchanged.
     *
     * @method Phaser.Physics.Matter.Components.Velocity#setAngularVelocity
     * @since 3.0.0
     *
     * @param {number} velocity - The angular velocity.
     *
     * @return {this} This Game Object instance.
     */
    setAngularVelocity: function (velocity)
    {
        Body.setAngularVelocity(this.body, velocity);

        return this;
    },

    /**
     * Gets the current rotational velocity of the body.
     *
     * @method Phaser.Physics.Matter.Components.Velocity#getAngularVelocity
     * @since 3.60.0
     *
     * @return {number} The current angular velocity of the body.
     */
    getAngularVelocity: function ()
    {
        return Body.getAngularVelocity(this.body);
    },

    /**
     * Sets the current rotational speed of the body.
     * Direction is maintained. Affects body angular velocity.
     *
     * @method Phaser.Physics.Matter.Components.Velocity#setAngularSpeed
     * @since 3.60.0
     *
     * @param {number} speed - The angular speed.
     *
     * @return {this} This Game Object instance.
     */
    setAngularSpeed: function (speed)
    {
        Body.setAngularSpeed(this.body, speed);

        return this;
    },

    /**
     * Gets the current rotational speed of the body.
     * Equivalent to the magnitude of its angular velocity.
     *
     * @method Phaser.Physics.Matter.Components.Velocity#getAngularSpeed
     * @since 3.60.0
     *
     * @return {number} The current angular velocity of the body.
     */
    getAngularSpeed: function ()
    {
        return Body.getAngularSpeed(this.body);
    }

};

module.exports = Velocity;
