/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Tween Loop Event.
 *
 * This event is dispatched by a Tween when it loops.
 *
 * This event will only be dispatched if the Tween has a loop count set.
 *
 * If a Tween has a `loopDelay` set, this event will fire after that delay expires.
 *
 * The difference between `loop` and `repeat` is that `repeat` is a property setting,
 * where-as `loop` applies to the entire Tween.
 *
 * Listen to it from a Tween instance using `Tween.on('loop', listener)`, i.e.:
 *
 * ```javascript
 * var tween = this.tweens.add({
 *     targets: image,
 *     x: 500,
 *     ease: 'Power1',
 *     duration: 3000,
 *     loop: 6
 * });
 * tween.on('loop', listener);
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_LOOP
 * @type {string}
 * @since 3.19.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 * @param {(any|any[])} targets - The targets of the Tween. If this Tween has multiple targets this will be an array of the targets.
 */
module.exports = 'loop';
