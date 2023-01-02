/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the immovable properties of an Arcade Physics Body.
 *
 * @namespace Phaser.Physics.Arcade.Components.Immovable
 * @since 3.0.0
 */
var Immovable = {

    /**
     * Sets if this Body can be separated during collisions with other bodies.
     *
     * When a body is immovable it means it won't move at all, not even to separate it from collision
     * overlap. If you just wish to prevent a body from being knocked around by other bodies, see
     * the `setPushable` method instead.
     *
     * @method Phaser.Physics.Arcade.Components.Immovable#setImmovable
     * @since 3.0.0
     *
     * @param {boolean} [value=true] - Sets if this body will be separated during collisions with other bodies.
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
