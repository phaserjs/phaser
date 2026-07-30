/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Body = require('../lib/body/Body');

/**
 * The Force component provides methods for applying forces and directional thrust to a Matter.js physics body.
 * It is mixed into Game Objects that use Matter.js physics, giving them the ability to simulate impulses
 * and continuous forces. All thrust methods derive direction from the body's current rotation angle,
 * making them well-suited for top-down vehicles, spaceships, or any entity that moves relative to the
 * direction it is facing. Use very small force values to avoid unrealistic acceleration.
 *
 * @namespace Phaser.Physics.Matter.Components.Force
 * @since 3.0.0
 */
var Force = {

    //  force = vec2 / point

    /**
     * Applies a force to a body at its current center of mass position.
     *
     * @method Phaser.Physics.Matter.Components.Force#applyForce
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} force - A Vector that specifies the force to apply.
     *
     * @return {this} This Game Object instance.
     */
    applyForce: function (force)
    {
        this._tempVec2.set(this.body.position.x, this.body.position.y);

        Body.applyForce(this.body, this._tempVec2, force);

        return this;
    },

    /**
     * Applies a force to a body from a given position.
     *
     * @method Phaser.Physics.Matter.Components.Force#applyForceFrom
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} position - The position in which the force comes from.
     * @param {Phaser.Math.Vector2} force - A Vector that specifies the force to apply.
     *
     * @return {this} This Game Object instance.
     */
    applyForceFrom: function (position, force)
    {
        Body.applyForce(this.body, position, force);

        return this;
    },

    /**
     * Apply thrust in the forward direction of the body.
     *
     * Use very small values, such as 0.1, depending on the mass and required speed.
     *
     * @method Phaser.Physics.Matter.Components.Force#thrust
     * @since 3.0.0
     *
     * @param {number} speed - A speed value to be applied to a directional force.
     *
     * @return {this} This Game Object instance.
     */
    thrust: function (speed)
    {
        var angle = this.body.angle;

        this._tempVec2.set(speed * Math.cos(angle), speed * Math.sin(angle));

        Body.applyForce(this.body, { x: this.body.position.x, y: this.body.position.y }, this._tempVec2);

        return this;
    },

    /**
     * Apply thrust in the left direction of the body.
     *
     * Use very small values, such as 0.1, depending on the mass and required speed.
     *
     * @method Phaser.Physics.Matter.Components.Force#thrustLeft
     * @since 3.0.0
     *
     * @param {number} speed - A speed value to be applied to a directional force.
     *
     * @return {this} This Game Object instance.
     */
    thrustLeft: function (speed)
    {
        var angle = this.body.angle - Math.PI / 2;

        this._tempVec2.set(speed * Math.cos(angle), speed * Math.sin(angle));

        Body.applyForce(this.body, { x: this.body.position.x, y: this.body.position.y }, this._tempVec2);

        return this;
    },

    /**
     * Apply thrust in the right direction of the body.
     *
     * Use very small values, such as 0.1, depending on the mass and required speed.
     *
     * @method Phaser.Physics.Matter.Components.Force#thrustRight
     * @since 3.0.0
     *
     * @param {number} speed - A speed value to be applied to a directional force.
     *
     * @return {this} This Game Object instance.
     */
    thrustRight: function (speed)
    {
        var angle = this.body.angle + Math.PI / 2;

        this._tempVec2.set(speed * Math.cos(angle), speed * Math.sin(angle));

        Body.applyForce(this.body, { x: this.body.position.x, y: this.body.position.y }, this._tempVec2);

        return this;
    },

    /**
     * Apply thrust in the reverse direction of the body.
     *
     * Use very small values, such as 0.1, depending on the mass and required speed.
     *
     * @method Phaser.Physics.Matter.Components.Force#thrustBack
     * @since 3.0.0
     *
     * @param {number} speed - A speed value to be applied to a directional force.
     *
     * @return {this} This Game Object instance.
     */
    thrustBack: function (speed)
    {
        var angle = this.body.angle - Math.PI;

        this._tempVec2.set(speed * Math.cos(angle), speed * Math.sin(angle));

        Body.applyForce(this.body, { x: this.body.position.x, y: this.body.position.y }, this._tempVec2);

        return this;
    }

};

module.exports = Force;
