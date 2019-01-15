/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Impact Friction component.
 * Should be applied as a mixin.
 *
 * @name Phaser.Physics.Impact.Components.Friction
 * @since 3.0.0
 */
var Friction = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Friction#setFrictionX
     * @since 3.0.0
     *
     * @param {number} x - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFrictionX: function (x)
    {
        this.friction.x = x;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Friction#setFrictionY
     * @since 3.0.0
     *
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFrictionY: function (y)
    {
        this.friction.y = y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Friction#setFriction
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFriction: function (x, y)
    {
        this.friction.x = x;
        this.friction.y = y;

        return this;
    }

};

module.exports = Friction;
