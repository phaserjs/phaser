/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Immovable
 * @since 3.0.0
 */
var Immovable = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Immovable#setImmovable
     * @since 3.0.0
     *
     * @param {boolean} [value=true] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setImmovable: function (value)
    {
        if (value === undefined) { value = true; }

        this.body.immovable = value;

        return this;
    }

};

module.exports = Immovable;
