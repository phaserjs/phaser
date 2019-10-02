/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * [description]
 *
 * @namespace Phaser.Physics.Matter.Components.Sensor
 * @since 3.0.0
 */
var Sensor = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Sensor#setSensor
     * @since 3.0.0
     *
     * @param {boolean} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setSensor: function (value)
    {
        this.body.isSensor = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Sensor#isSensor
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    isSensor: function ()
    {
        return this.body.isSensor;
    }

};

module.exports = Sensor;
