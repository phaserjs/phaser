/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Start Event.
 *
 * This event is dispatched by a Sprite when an animation starts playing on it.
 * This happens when the animation is played, factoring in any delay that may have been specified.
 * This event happens after the delay has expired and prior to the first update event.
 *
 * Listen for it on the Sprite using `sprite.on('animationstart', listener)`
 *
 * The animation event flow is as follows:
 *
 * 1. `ANIMATION_START`
 * 2. `ANIMATION_UPDATE` (repeated for however many frames the animation has)
 * 3. `ANIMATION_REPEAT` (only if the animation is set to repeat, it then emits more update events after this)
 * 4. `ANIMATION_COMPLETE` (only if there is a finite, or zero, repeat count)
 * 5. `ANIMATION_COMPLETE_KEY` (only if there is a finite, or zero, repeat count)
 *
 * If the animation is stopped directly, the `ANIMATION_STOP` event is dispatched instead of `ANIMATION_COMPLETE`.
 *
 * If the animation is restarted while it is already playing, `ANIMATION_RESTART` is emitted.
 *
 * @event Phaser.Animations.Events#ANIMATION_START
 * @since 3.50.0
 *
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that has started.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation started.
 * @param {string} frameKey - The unique key of the Animation Frame within the Animation.
 */
module.exports = 'animationstart';
