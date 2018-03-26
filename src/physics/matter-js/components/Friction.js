/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Friction
 * @since 3.0.0
 */
var Friction = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Friction#setFriction
     * @since 3.0.0
     *
     * @param {number} value - [description]
     * @param {number} [air] - [description]
     * @param {number} [fstatic] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFriction: function (value, air, fstatic)
    {
        this.body.friction = value;

        if (air !== undefined)
        {
            this.body.frictionAir = air;
        }

        if (fstatic !== undefined)
        {
            this.body.frictionStatic = fstatic;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Friction#setFrictionAir
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFrictionAir: function (value)
    {
        this.body.frictionAir = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Friction#setFrictionStatic
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFrictionStatic: function (value)
    {
        this.body.frictionStatic = value;

        return this;
    }

};

module.exports = Friction;
