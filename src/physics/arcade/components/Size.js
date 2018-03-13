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
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} width - [description]
     * @param {[type]} height - [description]
     * @param {[type]} center - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} radius - [description]
     * @param {[type]} offsetX - [description]
     * @param {[type]} offsetY - [description]
     *
     * @return {[type]} [description]
     */
    setCircle: function (radius, offsetX, offsetY)
    {
        this.body.setCircle(radius, offsetX, offsetY);

        return this;
    }

};

module.exports = Size;
