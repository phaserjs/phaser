/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Friction
 * @since 3.0.0
 */
var Friction = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Friction#setFriction
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} [y=x] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFriction: function (x, y)
    {
        this.body.friction.set(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Friction#setFrictionX
     * @since 3.0.0
     *
     * @param {number} x - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFrictionX: function (x)
    {
        this.body.friction.x = x;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Friction#setFrictionY
     * @since 3.0.0
     *
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFrictionY: function (y)
    {
        this.body.friction.y = y;

        return this;
    }

};

module.exports = Friction;
