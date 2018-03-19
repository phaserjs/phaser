/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Bounce
 * @since 3.0.0
 */
var Bounce = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Bounce#setBounce
     * @since 3.0.0
     *
     * @param {float} value - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setBounce: function (value)
    {
        this.body.restitution = value;

        return this;
    }

};

module.exports = Bounce;
