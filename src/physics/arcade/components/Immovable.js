/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for setting the immovable properties of an Arcade Physics Body.
 *
 * @name Phaser.Physics.Arcade.Components.Immovable
 * @since 3.0.0
 */
var Immovable = {

    /**
     * Sets Whether this Body can be moved by collisions with another Body.
     *
     * @method Phaser.Physics.Arcade.Components.Immovable#setImmovable
     * @since 3.0.0
     *
     * @param {boolean} [value=true] - Sets if this body can be moved by collisions with another Body.
     *
     * @return {this} This Game Object.
     */
    setImmovable: function (value)
    {
        if (value === undefined) { value = true; }

        this.body.immovable = value;

        return this;
    }

};

module.exports = Immovable;
