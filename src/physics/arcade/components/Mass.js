/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the mass properties of an Arcade Physics Body.
 *
 * @namespace Phaser.Physics.Arcade.Components.Mass
 * @since 3.0.0
 */
var Mass = {

    /**
     * Sets the mass of the physics body
     *
     * @method Phaser.Physics.Arcade.Components.Mass#setMass
     * @since 3.0.0
     *
     * @param {number} value - New value for the mass of the body.
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
