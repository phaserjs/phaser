/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
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
 * var tween = this.tweens.add({
 *     targets: image,
 *     ease: 'Power1',
 *     duration: 3000,
 *     x: 600
 * });
 * tween.on('pause', listener);
 * // At some point later ...
 * tween.pause();
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_PAUSE
 * @type {string}
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 */
module.exports = 'pause';
