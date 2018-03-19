/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Size
 * @since 3.0.0
 */
var Size = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Size#setOffset
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} [y=x] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setOffset: function (x, y)
    {
        this.body.setOffset(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Size#setSize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {boolean} [center=true] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setSize: function (width, height, center)
    {
        this.body.setSize(width, height, center);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Size#setCircle
     * @since 3.0.0
     *
     * @param {number} radius - [description]
     * @param {number} [offsetX] - [description]
     * @param {number} [offsetY] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCircle: function (radius, offsetX, offsetY)
    {
        this.body.setCircle(radius, offsetX, offsetY);

        return this;
    }

};

module.exports = Size;
