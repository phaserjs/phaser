/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Contains methods for changing the friction of a Game Object's Matter Body. Should be used a mixin, not called directly.
 *
 * @namespace Phaser.Physics.Matter.Components.Friction
 * @since 3.0.0
 */
var Friction = {

    /**
     * Sets new friction values for this Game Object's Matter Body.
     *
     * @method Phaser.Physics.Matter.Components.Friction#setFriction
     * @since 3.0.0
     *
     * @param {number} value - The new friction of the body, between 0 and 1, where 0 allows the Body to slide indefinitely, while 1 allows it to stop almost immediately after a force is applied.
     * @param {number} [air] - If provided, the new air resistance of the Body. The higher the value, the faster the Body will slow as it moves through space. 0 means the body has no air resistance.
     * @param {number} [fstatic] - If provided, the new static friction of the Body. The higher the value (e.g. 10), the more force it will take to initially get the Body moving when it is nearly stationary. 0 means the body will never "stick" when it is nearly stationary.
     *
     * @return {this} This Game Object instance.
     */
    setFriction: function (value, air, fstatic)
    {
        this.body.friction = value;

        if (air !== undefined)
        {
            this.body.frictionAir = air;
        }

        if (fstatic !== undefined)
        {
            this.body.frictionStatic = fstatic;
        }

        return this;
    },

    /**
     * Sets a new air resistance for this Game Object's Matter Body.
     * A value of 0 means the Body will never slow as it moves through space.
     * The higher the value, the faster a Body slows when moving through space.
     *
     * @method Phaser.Physics.Matter.Components.Friction#setFrictionAir
     * @since 3.0.0
     *
     * @param {number} value - The new air resistance for the Body.
     *
     * @return {this} This Game Object instance.
     */
    setFrictionAir: function (value)
    {
        this.body.frictionAir = value;

        return this;
    },

    /**
     * Sets a new static friction for this Game Object's Matter Body.
     * A value of 0 means the Body will never "stick" when it is nearly stationary.
     * The higher the value (e.g. 10), the more force it will take to initially get the Body moving when it is nearly stationary.
     *
     * @method Phaser.Physics.Matter.Components.Friction#setFrictionStatic
     * @since 3.0.0
     *
     * @param {number} value - The new static friction for the Body.
     *
     * @return {this} This Game Object instance.
     */
    setFrictionStatic: function (value)
    {
        this.body.frictionStatic = value;

        return this;
    }

};

module.exports = Friction;
