/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Collision
 * @since 3.0.0
 */
var Collision = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Collision#setCollisionCategory
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setCollisionCategory: function (value)
    {
        this.body.collisionFilter.category = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Collision#setCollisionGroup
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setCollisionGroup: function (value)
    {
        this.body.collisionFilter.group = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Collision#setCollidesWith
     * @since 3.0.0
     *
     * @param {[type]} categories - [description]
     *
     * @return {[type]} [description]
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
