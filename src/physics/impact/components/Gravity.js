/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Impact Gravity component.
 * Should be applied as a mixin.
 *
 * @name Phaser.Physics.Impact.Components.Gravity
 * @since 3.0.0
 */
var Gravity = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Gravity#setGravity
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setGravity: function (value)
    {
        this.body.gravityFactor = value;

        return this;
    },

    /**
     * [description]
     *
     * @name Phaser.Physics.Impact.Components.Gravity#gravity
     * @type {number}
     * @since 3.0.0
     */
    gravity: {

        get: function ()
        {
            return this.body.gravityFactor;
        },

        set: function (value)
        {
            this.body.gravityFactor = value;
        }

    }

};

module.exports = Gravity;
