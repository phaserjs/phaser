/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
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
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
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
     * @type {[type]}
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
