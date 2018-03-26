/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Drag
 * @since 3.0.0
 */
var Drag = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Drag#setDrag
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} [y=x] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setDrag: function (x, y)
    {
        this.body.drag.set(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Drag#setDragX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setDragX: function (value)
    {
        this.body.drag.x = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Drag#setDragY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setDragY: function (value)
    {
        this.body.drag.y = value;

        return this;
    }

};

module.exports = Drag;
