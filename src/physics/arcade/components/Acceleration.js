/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Acceleration
 * @since 3.0.0
 */
var Acceleration = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Acceleration#setAcceleration
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
     */
    setAcceleration: function (x, y)
    {
        this.body.acceleration.set(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Acceleration#setAccelerationX
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setAccelerationX: function (value)
    {
        this.body.acceleration.x = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Acceleration#setAccelerationY
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setAccelerationY: function (value)
    {
        this.body.acceleration.y = value;

        return this;
    }

};

module.exports = Acceleration;
