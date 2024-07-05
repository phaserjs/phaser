/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCollidesWith = require('../GetCollidesWith');

/**
 * Provides methods used for setting the collision category and mask of an Arcade Physics Body.
 *
 * @namespace Phaser.Physics.Arcade.Components.Collision
 * @since 3.70.0
 */
var Collision = {

    /**
     * Sets the Collision Category that this Arcade Physics Body
     * will use in order to determine what it can collide with.
     *
     * It can only have one single category assigned to it.
     *
     * If you wish to reset the collision category and mask, call
     * the `resetCollisionCategory` method.
     *
     * @method Phaser.Physics.Arcade.Components.Collision#setCollisionCategory
     * @since 3.70.0
     *
     * @param {number} category - The collision category.
     *
     * @return {this} This Game Object.
     */
    setCollisionCategory: function (category)
    {
        var target = (this.body) ? this.body : this;

        target.collisionCategory = category;

        return this;
    },

    /**
     * Checks to see if the given Collision Category will collide with
     * this Arcade Physics object or not.
     *
     * @method Phaser.Physics.Arcade.Components.Collision#willCollideWith
     * @since 3.70.0
     *
     * @param {number} category - Collision category value to test.
     *
     * @return {boolean} `true` if the given category will collide with this object, otherwise `false`.
     */
    willCollideWith: function (category)
    {
        var target = (this.body) ? this.body : this;

        return (target.collisionMask & category) !== 0;
    },

    /**
     * Adds the given Collision Category to the list of those that this
     * Arcade Physics Body will collide with.
     *
     * @method Phaser.Physics.Arcade.Components.Collision#addCollidesWith
     * @since 3.70.0
     *
     * @param {number} category - The collision category to add.
     *
     * @return {this} This Game Object.
     */
    addCollidesWith: function (category)
    {
        var target = (this.body) ? this.body : this;

        target.collisionMask = target.collisionMask | category;

        return this;
    },

    /**
     * Removes the given Collision Category from the list of those that this
     * Arcade Physics Body will collide with.
     *
     * @method Phaser.Physics.Arcade.Components.Collision#removeCollidesWith
     * @since 3.70.0
     *
     * @param {number} category - The collision category to add.
     *
     * @return {this} This Game Object.
     */
    removeCollidesWith: function (category)
    {
        var target = (this.body) ? this.body : this;

        target.collisionMask = target.collisionMask & ~category;

        return this;
    },

    /**
     * Sets all of the Collision Categories that this Arcade Physics Body
     * will collide with. You can either pass a single category value, or
     * an array of them.
     *
     * Calling this method will reset all of the collision categories,
     * so only those passed to this method are enabled.
     *
     * If you wish to add a new category to the existing mask, call
     * the `addCollisionCategory` method.
     *
     * If you wish to reset the collision category and mask, call
     * the `resetCollisionCategory` method.
     *
     * @method Phaser.Physics.Arcade.Components.Collision#setCollidesWith
     * @since 3.70.0
     *
     * @param {(number|number[])} categories - The collision category to collide with, or an array of them.
     *
     * @return {this} This Game Object.
     */
    setCollidesWith: function (categories)
    {
        var target = (this.body) ? this.body : this;

        target.collisionMask = GetCollidesWith(categories);

        return this;
    },

    /**
     * Resets the Collision Category and Mask back to the defaults,
     * which is to collide with everything.
     *
     * @method Phaser.Physics.Arcade.Components.Collision#resetCollisionCategory
     * @since 3.70.0
     *
     * @return {this} This Game Object.
     */
    resetCollisionCategory: function ()
    {
        var target = (this.body) ? this.body : this;

        target.collisionCategory = 0x0001;
        target.collisionMask = 2147483647;

        return this;
    }

};

module.exports = Collision;
