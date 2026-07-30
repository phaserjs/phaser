/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for controlling whether an Arcade Physics Body is immovable during collisions.
 * An immovable body will not be moved or separated when it collides with other bodies, making it
 * ideal for static obstacles, walls, platforms, or any object that should never be displaced by
 * physics interactions. This component is mixed into Game Objects that use Arcade Physics.
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
     * @param {boolean} [value=true] - Whether this body should be immovable (`true`) or movable (`false`) during collisions.
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
