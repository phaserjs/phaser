/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the collision category and mask of an Arcade Physics Body.
 *
 * @namespace Phaser.Physics.Arcade.Components.Collision
 * @since 3.61.0
 */
var Collision = {

    /**
     * Sets the Collision Category that this Arcade Physics Body
     * will use in order to determine what it can collide with.
     *
     * If you wish to reset the collision category and mask, call
     * the `resetCollisionCategory` method.
     *
     * @method Phaser.Physics.Arcade.Components.Collision#setCollisionCategory
     * @since 3.61.0
     *
     * @param {number} value - Unique category bitfield.
     *
     * @return {this} This Game Object.
     */
    setCollisionCategory: function (value)
    {
        this.body.setCollisionCategory(value);

        return this;
    },

    /**
     * Sets all of the Collision Categories that this Arcade Physics Body
     * will collide with. You can either pass a single category value, or
     * an array of them.
     *
     * If you wish to reset the collision category and mask, call
     * the `resetCollisionCategory` method.
     *
     * @method Phaser.Physics.Arcade.Components.Collision#setCollidesWith
     * @since 3.61.0
     *
     * @param {(number|number[])} categories - A unique category bitfield, or an array of them.
     *
     * @return {this} This Game Object.
     */
    setCollidesWith: function (categories)
    {
        this.body.setCollidesWith(categories);

        return this;
    },

    /**
     * Resets the Collision Category and Mask back to the defaults,
     * which is to collide with everything.
     *
     * @method Phaser.Physics.Arcade.Components.Collision#resetCollisionCategory
     * @since 3.61.0
     *
     * @return {this} This Game Object.
     */
    resetCollisionCategory: function ()
    {
        this.body.resetCollisionCategory();

        return this;
    }

};

module.exports = Collision;
