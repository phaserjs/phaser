/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for toggling the sensor state of a Matter.js physics body on a Game Object.
 * A sensor body participates in collision detection and fires collision events, but does not
 * physically react to or push other bodies. This makes sensors ideal for trigger zones, pickup
 * areas, or any situation where you need to detect overlap without causing a physical response.
 * This component is intended to be used as a mixin and not instantiated directly.
 *
 * @namespace Phaser.Physics.Matter.Components.Sensor
 * @since 3.0.0
 */
var Sensor = {

    /**
     * Set the body belonging to this Game Object to be a sensor.
     * Sensors trigger collision events, but don't physically react to or push colliding bodies.
     *
     * @method Phaser.Physics.Matter.Components.Sensor#setSensor
     * @since 3.0.0
     *
     * @param {boolean} value - `true` to set the body as a sensor, or `false` to disable it.
     *
     * @return {this} This Game Object instance.
     */
    setSensor: function (value)
    {
        this.body.isSensor = value;

        return this;
    },

    /**
     * Is the body belonging to this Game Object a sensor or not?
     *
     * @method Phaser.Physics.Matter.Components.Sensor#isSensor
     * @since 3.0.0
     *
     * @return {boolean} `true` if the body is a sensor, otherwise `false`.
     */
    isSensor: function ()
    {
        return this.body.isSensor;
    }

};

module.exports = Sensor;
