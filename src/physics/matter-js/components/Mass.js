/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Body = require('../lib/body/Body');

/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Mass
 * @since 3.0.0
 */
var Mass = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Mass#setMass
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setMass: function (value)
    {
        Body.setMass(this.body, value);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Mass#setDensity
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setDensity: function (value)
    {
        Body.setDensity(this.body, value);

        return this;
    }

};

module.exports = Mass;
