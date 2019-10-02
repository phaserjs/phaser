/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Impact Bounce component.
 * Should be applied as a mixin.
 *
 * @namespace Phaser.Physics.Impact.Components.Bounce
 * @since 3.0.0
 */
var Bounce = {

    /**
     * Sets the impact physics bounce, or restitution, value.
     *
     * @method Phaser.Physics.Impact.Components.Bounce#setBounce
     * @since 3.0.0
     *
     * @param {number} value - A value between 0 (no rebound) and 1 (full rebound)
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setBounce: function (value)
    {
        this.body.bounciness = value;

        return this;
    },

    /**
     * Sets the minimum velocity the body is allowed to be moving to be considered for rebound.
     *
     * @method Phaser.Physics.Impact.Components.Bounce#setMinBounceVelocity
     * @since 3.0.0
     *
     * @param {number} value - The minimum allowed velocity.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setMinBounceVelocity: function (value)
    {
        this.body.minBounceVelocity = value;

        return this;
    },

    /**
     * The bounce, or restitution, value of this body.
     * A value between 0 (no rebound) and 1 (full rebound)
     *
     * @name Phaser.Physics.Impact.Components.Bounce#bounce
     * @type {number}
     * @since 3.0.0
     */
    bounce: {

        get: function ()
        {
            return this.body.bounciness;
        },

        set: function (value)
        {
            this.body.bounciness = value;
        }

    }

};

module.exports = Bounce;
