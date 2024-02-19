/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Body = require('../lib/body/Body');
var Vector2 = require('../../../math/Vector2');

/**
 * Allows accessing the mass, density, and center of mass of a Matter-enabled Game Object. Should be used as a mixin and not directly.
 *
 * @namespace Phaser.Physics.Matter.Components.Mass
 * @since 3.0.0
 */
var Mass = {

    /**
     * Sets the mass of the Game Object's Matter Body.
     *
     * @method Phaser.Physics.Matter.Components.Mass#setMass
     * @since 3.0.0
     *
     * @param {number} value - The new mass of the body.
     *
     * @return {this} This Game Object instance.
     */
    setMass: function (value)
    {
        Body.setMass(this.body, value);

        return this;
    },

    /**
     * Sets density of the body.
     *
     * @method Phaser.Physics.Matter.Components.Mass#setDensity
     * @since 3.0.0
     *
     * @param {number} value - The new density of the body.
     *
     * @return {this} This Game Object instance.
     */
    setDensity: function (value)
    {
        Body.setDensity(this.body, value);

        return this;
    },

    /**
     * The body's center of mass.
     *
     * Calling this creates a new `Vector2 each time to avoid mutation.
     *
     * If you only need to read the value and won't change it, you can get it from `GameObject.body.centerOfMass`.
     *
     * @name Phaser.Physics.Matter.Components.Mass#centerOfMass
     * @type {Phaser.Math.Vector2}
     * @readonly
     * @since 3.10.0
     *
     * @return {Phaser.Math.Vector2} The center of mass.
     */
    centerOfMass: {

        get: function ()
        {
            return new Vector2(this.body.centerOfMass.x, this.body.centerOfMass.y);
        }
    }

};

module.exports = Mass;
