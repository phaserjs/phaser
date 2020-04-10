/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Tween Repeat Event.
 * 
 * This event is dispatched by a Tween when one of the properties it is tweening repeats.
 * 
 * This event will only be dispatched if the Tween has a property with a repeat count set.
 * 
 * If a Tween has a `repeatDelay` set, this event will fire after that delay expires.
 * 
 * The difference between `loop` and `repeat` is that `repeat` is a property setting,
 * where-as `loop` applies to the entire Tween.
 * 
 * Listen to it from a Tween instance using `Tween.on('repeat', listener)`, i.e.:
 * 
 * ```javascript
 * var tween = this.tweens.add({
 *     targets: image,
 *     x: 500,
 *     ease: 'Power1',
 *     duration: 3000,
 *     repeat: 4
 * });
 * tween.on('repeat', listener);
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_REPEAT
 * @since 3.19.0
 * 
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 * @param {string} key - The key of the property that just repeated.
 * @param {any} target - The target that the property just repeated on.
 */
module.exports = 'repeat';
