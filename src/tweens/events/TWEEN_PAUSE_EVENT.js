/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Tween Pause Event.
 *
 * This event is dispatched by a Tween when it is paused.
 *
 * Listen to it from a Tween instance using `Tween.on('pause', listener)`, i.e.:
 *
 * ```javascript
 * var timeline = this.tweens.twe({
 *     targets: image,
 *     ease: 'Power1',
 *     duration: 3000,
 *     tweens: [ { x: 600 }, { y: 500 }, { x: 100 }, { y: 100 } ]
 * });
 * timeline.on('pause', listener);
 * // At some point later ...
 * timeline.pause();
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_PAUSE
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 */
module.exports = 'pause';
