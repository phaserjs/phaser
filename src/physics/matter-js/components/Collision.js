/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
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
     * Sets the collision category of this Game Object's Matter Body. This number must be a power of two between 2^0 (= 1) and 2^31. Two bodies with different collision groups (see {@link #setCollisionGroup}) will only collide if their collision categories are included in their collision masks (see {@link #setCollidesWith}).
     *
     * @method Phaser.Physics.Matter.Components.Collision#setCollisionCategory
     * @since 3.0.0
     *
     * @param {number} value - Unique category bitfield.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCollisionCategory: function (value)
    {
        this.body.collisionFilter.category = value;

        return this;
    },

    /**
     * Sets the collision group of this Game Object's Matter Body. If this is zero or two Matter Bodies have different values, they will collide according to the usual rules (see {@link #setCollisionCategory} and {@link #setCollisionGroup}). If two Matter Bodies have the same positive value, they will always collide; if they have the same negative value, they will never collide.
     *
     * @method Phaser.Physics.Matter.Components.Collision#setCollisionGroup
     * @since 3.0.0
     *
     * @param {number} value - Unique group index.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCollisionGroup: function (value)
    {
        this.body.collisionFilter.group = value;

        return this;
    },

    /**
     * Sets the collision mask for this Game Object's Matter Body. Two Matter Bodies with different collision groups will only collide if each one includes the other's category in its mask based on a bitwise AND, i.e. `(categoryA & maskB) !== 0` and `(categoryB & maskA) !== 0` are both true.
     *
     * @method Phaser.Physics.Matter.Components.Collision#setCollidesWith
     * @since 3.0.0
     *
     * @param {(number|number[])} categories - A unique category bitfield, or an array of them.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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
    }

};

module.exports = Collision;
