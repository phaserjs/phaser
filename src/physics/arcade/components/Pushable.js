/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the pushable property of an Arcade Physics Body.
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
     * If you want your body to never move or seperate at all, see the `setImmovable` method.
     *
     * @method Phaser.Physics.Arcade.Components.Pushable#setPushable
     * @since 3.50.0
     *
     * @param {boolean} [value=true] - Sets if this body can be pushed by collisions with another Body.
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
