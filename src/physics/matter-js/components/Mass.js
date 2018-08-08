/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Body = require('../lib/body/Body');
var Vector2 = require('../../../math/Vector2');

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
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setDensity: function (value)
    {
        Body.setDensity(this.body, value);

        return this;
    },

    /**
     * The body's center of mass.
     *
     * @name Phaser.Physics.Matter.Components.Mass#centerOfMass
     * @readOnly
     * @since 3.10.0
     *
     * @return {Phaser.Math.Vector2} The center of mass.
     */
    centerOfMass: {

        get: function ()
        {
            return new Vector2(this.body.render.sprite.xOffset * this.width, this.body.render.sprite.yOffset * this.height);
        }
    }

};

module.exports = Mass;
