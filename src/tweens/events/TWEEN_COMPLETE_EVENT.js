/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Tween Complete Event.
 * 
 * This event is dispatched by a Tween when it completes playback entirely, factoring in repeats and loops.
 * 
 * If the Tween has been set to loop or repeat infinitely, this event will not be dispatched
 * unless the `Tween.stop` method is called.
 * 
 * If a Tween has a `completeDelay` set, this event will fire after that delay expires.
 * 
 * Listen to it from a Tween instance using `Tween.on('complete', listener)`, i.e.:
 * 
 * ```javascript
 * var tween = this.tweens.add({
 *     targets: image,
 *     x: 500,
 *     ease: 'Power1',
 *     duration: 3000
 * });
 * tween.on('complete', listener);
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_COMPLETE
 * @since 3.19.0
 * 
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 * @param {any[]} targets - An array of references to the target/s the Tween is operating on.
 */
module.exports = 'complete';
