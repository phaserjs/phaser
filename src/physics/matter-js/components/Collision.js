/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Contains methods for changing the collision filter of a Matter Body. Should be used as a mixin and not called directly.
 *
 * @namespace Phaser.Physics.Matter.Components.Collision
 * @since 3.0.0
 */
var Collision = {

    /**
     * Sets the collision category of this Game Object's Matter Body. This number must be a power of two between 2^0 (= 1) and 2^31.
     * Two bodies with different collision groups (see {@link #setCollisionGroup}) will only collide if their collision
     * categories are included in their collision masks (see {@link #setCollidesWith}).
     *
     * @method Phaser.Physics.Matter.Components.Collision#setCollisionCategory
     * @since 3.0.0
     *
     * @param {number} value - Unique category bitfield.
     *
     * @return {this} This Game Object instance.
     */
    setCollisionCategory: function (value)
    {
        this.body.collisionFilter.category = value;

        return this;
    },

    /**
     * Sets the collision group of this Game Object's Matter Body. If this is zero or two Matter Bodies have different values,
     * they will collide according to the usual rules (see {@link #setCollisionCategory} and {@link #setCollisionGroup}).
     * If two Matter Bodies have the same positive value, they will always collide; if they have the same negative value,
     * they will never collide.
     *
     * @method Phaser.Physics.Matter.Components.Collision#setCollisionGroup
     * @since 3.0.0
     *
     * @param {number} value - Unique group index.
     *
     * @return {this} This Game Object instance.
     */
    setCollisionGroup: function (value)
    {
        this.body.collisionFilter.group = value;

        return this;
    },

    /**
     * Sets the collision mask for this Game Object's Matter Body. Two Matter Bodies with different collision groups will only
     * collide if each one includes the other's category in its mask based on a bitwise AND, i.e. `(categoryA & maskB) !== 0`
     * and `(categoryB & maskA) !== 0` are both true.
     *
     * @method Phaser.Physics.Matter.Components.Collision#setCollidesWith
     * @since 3.0.0
     *
     * @param {(number|number[])} categories - A unique category bitfield, or an array of them.
     *
     * @return {this} This Game Object instance.
     */
    setCollidesWith: function (categories)
    {
        var flags = 0;

        if (!Array.isArray(categories))
        {
            flags = categories;
        }
        else
        {
            for (var i = 0; i < categories.length; i++)
            {
                flags |= categories[i];
            }
        }

        this.body.collisionFilter.mask = flags;

        return this;
    },

    /**
     * The callback is sent a `Phaser.Types.Physics.Matter.MatterCollisionData` object.
     *
     * This does not change the bodies collision category, group or filter. Those must be set in addition
     * to the callback.
     *
     * @method Phaser.Physics.Matter.Components.Collision#setOnCollide
     * @since 3.22.0
     *
     * @param {function} callback - The callback to invoke when this body starts colliding with another.
     *
     * @return {this} This Game Object instance.
     */
    setOnCollide: function (callback)
    {
        this.body.onCollideCallback = callback;

        return this;
    },

    /**
     * The callback is sent a `Phaser.Types.Physics.Matter.MatterCollisionData` object.
     *
     * This does not change the bodies collision category, group or filter. Those must be set in addition
     * to the callback.
     *
     * @method Phaser.Physics.Matter.Components.Collision#setOnCollideEnd
     * @since 3.22.0
     *
     * @param {function} callback - The callback to invoke when this body stops colliding with another.
     *
     * @return {this} This Game Object instance.
     */
    setOnCollideEnd: function (callback)
    {
        this.body.onCollideEndCallback = callback;

        return this;
    },

    /**
     * The callback is sent a `Phaser.Types.Physics.Matter.MatterCollisionData` object.
     *
     * This does not change the bodies collision category, group or filter. Those must be set in addition
     * to the callback.
     *
     * @method Phaser.Physics.Matter.Components.Collision#setOnCollideActive
     * @since 3.22.0
     *
     * @param {function} callback - The callback to invoke for the duration of this body colliding with another.
     *
     * @return {this} This Game Object instance.
     */
    setOnCollideActive: function (callback)
    {
        this.body.onCollideActiveCallback = callback;

        return this;
    },

    /**
     * The callback is sent a reference to the other body, along with a `Phaser.Types.Physics.Matter.MatterCollisionData` object.
     *
     * This does not change the bodies collision category, group or filter. Those must be set in addition
     * to the callback.
     *
     * @method Phaser.Physics.Matter.Components.Collision#setOnCollideWith
     * @since 3.22.0
     *
     * @param {(MatterJS.Body|MatterJS.Body[])} body - The body, or an array of bodies, to test for collisions with.
     * @param {function} callback - The callback to invoke when this body collides with the given body or bodies.
     *
     * @return {this} This Game Object instance.
     */
    setOnCollideWith: function (body, callback)
    {
        if (!Array.isArray(body))
        {
            body = [ body ];
        }

        for (var i = 0; i < body.length; i++)
        {
            var src = (body[i].hasOwnProperty('body')) ? body[i].body : body[i];

            this.body.setOnCollideWith(src, callback);
        }

        return this;
    }

};

module.exports = Collision;
