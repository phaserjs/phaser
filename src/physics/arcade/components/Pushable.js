/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Pushable component provides methods for controlling whether an Arcade Physics body can be
 * displaced by other bodies during collision resolution. A pushable body will have velocity applied
 * to it as a result of colliding with other bodies. A non-pushable body will instead reflect its
 * received velocity back to the colliding body, effectively acting as an immovable surface for
 * purposes of velocity transfer while still participating in positional separation. This component
 * is mixed into Game Objects that use Arcade Physics.
 *
 * @namespace Phaser.Physics.Arcade.Components.Pushable
 * @since 3.50.0
 */
var Pushable = {

    /**
     * Sets if this Body can be pushed by another Body.
     *
     * A body that cannot be pushed will reflect back all of the velocity it is given to the
     * colliding body. If that body is also not pushable, then the separation will be split
     * between them evenly.
     *
     * If you want your body to never move or separate at all, see the `setImmovable` method.
     *
     * @method Phaser.Physics.Arcade.Components.Pushable#setPushable
     * @since 3.50.0
     *
     * @param {boolean} [value=true] - Whether this body can be pushed by collisions with another Body.
     *
     * @return {this} This Game Object.
     */
    setPushable: function (value)
    {
        if (value === undefined) { value = true; }

        this.body.pushable = value;

        return this;
    }

};

module.exports = Pushable;
