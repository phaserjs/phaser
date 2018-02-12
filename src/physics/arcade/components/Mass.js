/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Mass
 * @since 3.0.0
 */
var Mass = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Mass#setMass
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setMass: function (value)
    {
        this.body.mass = value;

        return this;
    }

};

module.exports = Mass;
