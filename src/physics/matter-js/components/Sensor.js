/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Enables a Matter-enabled Game Object to be a sensor. Should be used as a mixin and not directly.
 *
 * @namespace Phaser.Physics.Matter.Components.Sensor
 * @since 3.0.0
 */
var Sensor = {

    /**
     * Set the body belonging to this Game Object to be a sensor.
     * Sensors trigger collision events, but don't react with colliding body physically.
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
