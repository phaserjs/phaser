/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for setting the mass of an Arcade Physics Body. This component
 * is mixed into Game Objects that use Arcade Physics. Mass influences how bodies
 * respond to collisions: a heavier body will exert more force on a lighter one,
 * affecting the resulting velocity changes during impact resolution.
 *
 * @namespace Phaser.Physics.Arcade.Components.Mass
 * @since 3.0.0
 */
var Mass = {

    /**
     * Sets the mass of the physics body. Mass affects collision response -- heavier
     * bodies push lighter ones more during collisions.
     *
     * @method Phaser.Physics.Arcade.Components.Mass#setMass
     * @since 3.0.0
     *
     * @param {number} value - The new mass of the body. Must be a positive number.
     *
     * @return {this} This Game Object.
     */
    setMass: function (value)
    {
        this.body.mass = value;

        return this;
    }

};

module.exports = Mass;
