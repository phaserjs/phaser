/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Bounce
 * @since 3.0.0
 */
var Bounce = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Bounce#setBounce
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} [y=x] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setBounce: function (x, y)
    {
        this.body.bounce.set(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Bounce#setBounceX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setBounceX: function (value)
    {
        this.body.bounce.x = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Bounce#setBounceY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setBounceY: function (value)
    {
        this.body.bounce.y = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Bounce#setCollideWorldBounds
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCollideWorldBounds: function (value)
    {
        this.body.collideWorldBounds = value;

        return this;
    }

};

module.exports = Bounce;
