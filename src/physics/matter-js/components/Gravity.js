/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Gravity component provides the ability to control whether a Matter.js physics body
 * is affected by the world's gravity. This component is mixed into Matter-enabled Game Objects
 * and allows individual bodies to opt out of global gravity on a per-object basis, useful for
 * objects like floating platforms or kinematic bodies that should not fall.
 *
 * @namespace Phaser.Physics.Matter.Components.Gravity
 * @since 3.0.0
 */
var Gravity = {

    /**
     * Sets whether this Game Object's Matter.js body should ignore world gravity. When set to
     * `true`, the body will not be influenced by the global gravity defined in the Matter.js
     * world configuration, allowing it to float freely regardless of the world's gravity settings.
     * This can be changed at any time during gameplay to dynamically enable or disable gravity on the body.
     *
     * @method Phaser.Physics.Matter.Components.Gravity#setIgnoreGravity
     * @since 3.0.0
     *
     * @param {boolean} value - Set to true to ignore the effect of world gravity, or false to not ignore it.
     *
     * @return {this} This Game Object instance.
     */
    setIgnoreGravity: function (value)
    {
        this.body.ignoreGravity = value;

        return this;
    }

};

module.exports = Gravity;
