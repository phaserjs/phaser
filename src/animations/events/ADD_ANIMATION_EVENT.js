/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Add Animation Event.
 *
 * This event is dispatched when a new animation is added to the global Animation Manager.
 *
 * This can happen either as a result of an animation instance being added to the Animation Manager,
 * or the Animation Manager creating a new animation directly.
 *
 * @event Phaser.Animations.Events#ADD_ANIMATION
 * @type {string}
 * @since 3.0.0
 *
 * @param {string} key - The key of the Animation that was added to the global Animation Manager.
 * @param {Phaser.Animations.Animation} animation - An instance of the newly created Animation.
 */
module.exports = 'add';
