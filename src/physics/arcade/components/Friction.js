/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sets the friction (e.g. the amount of velocity reduced over time) of the physics body when moving horizontally in the X axis. The higher than friction, the faster the body will slow down once force stops being applied to it.
 *
 * @namespace Phaser.Physics.Arcade.Components.Friction
 * @since 3.0.0
 */
var Friction = {

    /**
     * Sets the friction (e.g. the amount of velocity reduced over time) of the physics body when moving.
     * The higher than friction, the faster the body will slow down once force stops being applied to it.
     *
     * @method Phaser.Physics.Arcade.Components.Friction#setFriction
     * @since 3.0.0
     *
     * @param {number} x - The amount of horizontal friction to apply.
     * @param {number} [y=x] - The amount of vertical friction to apply.
     *
     * @return {this} This Game Object.
     */
    setFriction: function (x, y)
    {
        this.body.friction.set(x, y);

        return this;
    },

    /**
     * Sets the friction (e.g. the amount of velocity reduced over time) of the physics body when moving horizontally in the X axis.
     * The higher than friction, the faster the body will slow down once force stops being applied to it.
     *
     * @method Phaser.Physics.Arcade.Components.Friction#setFrictionX
     * @since 3.0.0
     *
     * @param {number} x - The amount of friction to apply.
     *
     * @return {this} This Game Object.
     */
    setFrictionX: function (x)
    {
        this.body.friction.x = x;

        return this;
    },

    /**
     * Sets the friction (e.g. the amount of velocity reduced over time) of the physics body when moving vertically in the Y axis.
     * The higher than friction, the faster the body will slow down once force stops being applied to it.
     *
     * @method Phaser.Physics.Arcade.Components.Friction#setFrictionY
     * @since 3.0.0
     *
     * @param {number} x - The amount of friction to apply.
     *
     * @return {this} This Game Object.
     */
    setFrictionY: function (y)
    {
        this.body.friction.y = y;

        return this;
    }

};

module.exports = Friction;
