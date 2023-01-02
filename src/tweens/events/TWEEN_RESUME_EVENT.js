/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Tween Resume Event.
 *
 * This event is dispatched by a Tween when it is resumed from a paused state.
 *
 * Listen to it from a Tween instance using `Tween.on('resume', listener)`, i.e.:
 *
 * ```javascript
 * var tween = this.tweens.add({
 *     targets: image,
 *     ease: 'Power1',
 *     duration: 3000,
 *     x: 600
 * });
 * tween.on('resume', listener);
 * // At some point later ...
 * tween.resume();
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_RESUME
 * @type {string}
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 */
module.exports = 'resume';
