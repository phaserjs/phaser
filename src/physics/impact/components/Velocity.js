/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Impact Velocity component.
 * Should be applied as a mixin.
 *
 * @name Phaser.Physics.Impact.Components.Velocity
 * @since 3.0.0
 */
var Velocity = {

    /**
     * Sets the horizontal velocity of the physics body.
     *
     * @method Phaser.Physics.Impact.Components.Velocity#setVelocityX
     * @since 3.0.0
     *
     * @param {number} x - The horizontal velocity value.
     *
     * @return {this} This Game Object.
     */
    setVelocityX: function (x)
    {
        this.vel.x = x;

        return this;
    },

    /**
     * Sets the vertical velocity of the physics body.
     *
     * @method Phaser.Physics.Impact.Components.Velocity#setVelocityY
     * @since 3.0.0
     *
     * @param {number} y - The vertical velocity value.
     *
     * @return {this} This Game Object.
     */
    setVelocityY: function (y)
    {
        this.vel.y = y;

        return this;
    },

    /**
     * Sets the horizontal and vertical velocities of the physics body.
     *
     * @method Phaser.Physics.Impact.Components.Velocity#setVelocity
     * @since 3.0.0
     *
     * @param {number} x - The horizontal velocity value.
     * @param {number} [y=x] - The vertical velocity value. If not given, defaults to the horizontal value.
     *
     * @return {this} This Game Object.
     */
    setVelocity: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.vel.x = x;
        this.vel.y = y;

        return this;
    },

    /**
     * Sets the maximum velocity this body can travel at.
     *
     * @method Phaser.Physics.Impact.Components.Velocity#setMaxVelocity
     * @since 3.0.0
     *
     * @param {number} x - The maximum allowed horizontal velocity.
     * @param {number} [y=x] - The maximum allowed vertical velocity. If not given, defaults to the horizontal value.
     *
     * @return {this} This Game Object.
     */
    setMaxVelocity: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.maxVel.x = x;
        this.maxVel.y = y;

        return this;
    }

};

module.exports = Velocity;
