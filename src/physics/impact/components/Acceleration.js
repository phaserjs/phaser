/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Impact.Components.Acceleration
 * @since 3.0.0
 */
var Acceleration = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Acceleration#setAccelerationX
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     *
     * @return {[type]} [description]
     */
    setAccelerationX: function (x)
    {
        this.accel.x = x;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Acceleration#setAccelerationY
     * @since 3.0.0
     *
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
     */
    setAccelerationY: function (y)
    {
        this.accel.y = y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Acceleration#setAcceleration
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
     */
    setAcceleration: function (x, y)
    {
        this.accel.x = x;
        this.accel.y = y;

        return this;
    }

};

module.exports = Acceleration;
