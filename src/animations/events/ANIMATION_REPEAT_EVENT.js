/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Repeat Event.
 *
 * This event is dispatched by a Sprite when an animation repeats playing on it.
 * This happens if the animation was created, or played, with a `repeat` value specified.
 *
 * An animation will repeat when it reaches the end of its sequence.
 *
 * Listen for it on the Sprite using `sprite.on('animationrepeat', listener)`
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
 * @event Phaser.Animations.Events#ANIMATION_REPEAT
 * @type {string}
 * @since 3.50.0
 *
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that has repeated.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation repeated.
 * @param {string} frameKey - The unique key of the Animation Frame within the Animation.
 */
module.exports = 'animationrepeat';
