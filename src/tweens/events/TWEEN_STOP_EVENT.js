/**
 * @author       samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Tween Stop Event.
 *
 * This event is dispatched by a Tween when it is stopped.
 *
 * Listen to it from a Tween instance using `Tween.on('stop', listener)`, i.e.:
 *
 * ```javascript
 * var tween = this.tweens.add({
 *     targets: image,
 *     x: 500,
 *     ease: 'Power1',
 *     duration: 3000
 * });
 * tween.on('stop', listener);
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_STOP
 * @since 3.24.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 * @param {any[]} targets - An array of references to the target/s the Tween is operating on.
 */
module.exports = 'stop';
