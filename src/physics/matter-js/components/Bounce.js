/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Bounce component is a mixin for Matter.js physics-enabled Game Objects that provides
 * control over the restitution (elasticity) of a physics body. Restitution determines how
 * much kinetic energy a body retains after a collision — a higher value results in a bouncier
 * object, while a value of zero produces collisions with no bounce at all.
 *
 * This component is automatically mixed into Game Objects that use Matter.js physics when
 * the physics body is created.
 *
 * @namespace Phaser.Physics.Matter.Components.Bounce
 * @since 3.0.0
 */
var Bounce = {

    /**
     * Sets the restitution (bounciness) of this Game Object's Matter.js physics body.
     * This controls how much of the body's kinetic energy is preserved after a collision.
     *
     * @method Phaser.Physics.Matter.Components.Bounce#setBounce
     * @since 3.0.0
     *
     * @param {number} value - A Number that defines the restitution (elasticity) of the body. The value is always positive and is in the range (0, 1). A value of 0 means collisions may be perfectly inelastic and no bouncing may occur. A value of 0.8 means the body may bounce back with approximately 80% of its kinetic energy. Note that collision response is based on pairs of bodies, and that restitution values are combined with the following formula: `Math.max(bodyA.restitution, bodyB.restitution)`
     *
     * @return {this} This Game Object instance.
     */
    setBounce: function (value)
    {
        this.body.restitution = value;

        return this;
    }

};

module.exports = Bounce;
