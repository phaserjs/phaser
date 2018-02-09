/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Sensor
 * @since 3.0.0
 */
var Sensor = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Sensor#setSensor
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
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
     * @return {[type]} [description]
     */
    isSensor: function ()
    {
        return this.body.isSensor;
    }

};

module.exports = Sensor;
