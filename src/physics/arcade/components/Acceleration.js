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
     * @param {number} x - The horizontal acceleration
     * @param {number} [y=x] - The vertical acceleration
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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
     * @param {number} value - The horizontal acceleration
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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
     * @param {number} value - The vertical acceleration
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setAccelerationY: function (value)
    {
        this.body.acceleration.y = value;

        return this;
    }

};

module.exports = Acceleration;
