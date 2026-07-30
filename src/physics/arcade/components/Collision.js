/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetCollidesWith = require('../GetCollidesWith');

/**
 * Provides methods used for setting the collision category and mask of an Arcade Physics Body.
 *
 * Collision categories and masks allow you to control which bodies interact with each other.
 * Each body has a collision category (its "identity") and a collision mask (the set of categories
 * it will collide with). Two bodies will only collide if each body's category is present in the
 * other body's mask. By default, all bodies belong to category 1 and collide with all categories.
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
     * @param {number} category - The collision category to assign to this body. Typically a power of 2, such as 1, 2, 4, 8, and so on.
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
     * @param {number} category - The collision category to add to this body's collision mask.
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
     * @param {number} category - The collision category to remove from this body's collision mask.
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
     * the `addCollidesWith` method.
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
     * which means the body will belong to category 1 and will collide with all other categories.
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
