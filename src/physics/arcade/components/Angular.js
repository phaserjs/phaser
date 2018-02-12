/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Angular
 * @since 3.0.0
 */
var Angular = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Angular#setAngularVelocity
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setAngularVelocity: function (value)
    {
        this.body.angularVelocity = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Angular#setAngularAcceleration
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setAngularAcceleration: function (value)
    {
        this.body.angularAcceleration = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Angular#setAngularDrag
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setAngularDrag: function (value)
    {
        this.body.angularDrag = value;

        return this;
    }

};

module.exports = Angular;
