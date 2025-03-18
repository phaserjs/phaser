/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Complete Dynamic Key Event.
 *
 * This event is dispatched by a Sprite when an animation playing on it completes playback.
 * This happens when the animation gets to the end of its sequence, factoring in any delays
 * or repeats it may have to process.
 *
 * An animation that is set to loop, or repeat forever, will never fire this event, because
 * it never actually completes. If you need to handle this, listen for the `ANIMATION_STOP`
 * event instead, as this is emitted when the animation is stopped directly.
 *
 * The difference between this and the `ANIMATION_COMPLETE` event is that this one has a
 * dynamic event name that contains the name of the animation within it. For example,
 * if you had an animation called `explode` you could listen for the completion of that
 * specific animation by using: `sprite.on('animationcomplete-explode', listener)`. Or, if you
 * wish to use types: `sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'explode', listener)`.
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
 * @event Phaser.Animations.Events#ANIMATION_COMPLETE_KEY
 * @type {string}
 * @since 3.50.0
 *
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that completed.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation updated.
 * @param {string} frameKey - The unique key of the Animation Frame within the Animation.
 */
module.exports = 'animationcomplete-';
