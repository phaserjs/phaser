/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * A component to manipulate gravity for Matter.js bodies.
 *
 * @name Phaser.Physics.Matter.Components.Gravity
 * @since 3.0.0
 */
var Gravity = {

    /**
     * Ignore gravity.
     *
     * @method Phaser.Physics.Matter.Components.Gravity#setIgnoreGravity
     * @since 3.0.0
     *
     * @param {boolean} value - Flag to ignore gravity.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setIgnoreGravity: function (value)
    {
        this.body.ignoreGravity = value;

        return this;
    }

};

module.exports = Gravity;
