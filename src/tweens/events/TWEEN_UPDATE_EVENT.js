/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Tween Update Event.
 *
 * This event is dispatched by a Tween every time it updates _any_ of the properties it is tweening.
 *
 * A Tween that is changing 3 properties of a target will emit this event 3 times per change, once per property.
 *
 * **Note:** This is a very high frequency event and may be dispatched multiple times, every single frame.
 *
 * Listen to it from a Tween instance using `Tween.on('update', listener)`, i.e.:
 *
 * ```javascript
 * var tween = this.tweens.add({
 *     targets: image,
 *     x: 500,
 *     ease: 'Power1',
 *     duration: 3000,
 * });
 * tween.on('update', listener);
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_UPDATE
 * @type {string}
 * @since 3.19.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 * @param {string} key - The property on the target that has just updated, i.e. `x` or `scaleY`, or whatever property you are tweening.
 * @param {any} target - The target object that was updated. Usually a Game Object, but can be of any type.
 * @param {number} current - The current value of the property that was tweened.
 * @param {number} previous - The previous value of the property that was tweened, prior to this update.
 */
module.exports = 'update';
