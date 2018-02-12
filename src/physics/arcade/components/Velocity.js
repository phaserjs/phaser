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
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} x - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
     */
    setMaxVelocity: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.body.maxVelocity.set(x, y);

        return this;
    }

};

module.exports = Velocity;
