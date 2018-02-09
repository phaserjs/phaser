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
