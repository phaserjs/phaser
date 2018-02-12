/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Impact.Components.Velocity
 * @since 3.0.0
 */
var Velocity = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Velocity#setVelocityX
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     *
     * @return {[type]} [description]
     */
    setVelocityX: function (x)
    {
        this.vel.x = x;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Velocity#setVelocityY
     * @since 3.0.0
     *
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
     */
    setVelocityY: function (y)
    {
        this.vel.y = y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Velocity#setVelocity
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
     */
    setVelocity: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.vel.x = x;
        this.vel.y = y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Velocity#setMaxVelocity
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

        this.maxVel.x = x;
        this.maxVel.y = y;

        return this;
    }

};

module.exports = Velocity;
