/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Velocity
 * @since 3.0.0
 */
var Velocity = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Velocity#setVelocity
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} [y=x] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setVelocity: function (x, y)
    {
        this.body.velocity.set(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Velocity#setVelocityX
     * @since 3.0.0
     *
     * @param {number} x - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setVelocityX: function (x)
    {
        this.body.velocity.x = x;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Velocity#setVelocityY
     * @since 3.0.0
     *
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setVelocityY: function (y)
    {
        this.body.velocity.y = y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Velocity#setMaxVelocity
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} [y=x] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setMaxVelocity: function (x, y)
    {
        this.body.maxVelocity.set(x, y);

        return this;
    }

};

module.exports = Velocity;
