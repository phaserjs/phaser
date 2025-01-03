/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * A component to set restitution on objects.
 *
 * @namespace Phaser.Physics.Matter.Components.Bounce
 * @since 3.0.0
 */
var Bounce = {

    /**
     * Sets the restitution on the physics object.
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
