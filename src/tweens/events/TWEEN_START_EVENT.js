/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Tween Start Event.
 *
 * This event is dispatched by a Tween when it starts tweening its first property.
 *
 * A Tween will only emit this event once, as it can only start once.
 *
 * If a Tween has a `delay` set, this event will fire after that delay expires.
 *
 * Listen to it from a Tween instance using `Tween.on('start', listener)`, i.e.:
 *
 * ```javascript
 * var tween = this.tweens.add({
 *     targets: image,
 *     x: 500,
 *     ease: 'Power1',
 *     duration: 3000
 * });
 * tween.on('start', listener);
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_START
 * @type {string}
 * @since 3.19.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 * @param {(any|any[])} targets - The targets of the Tween. If this Tween has multiple targets this will be an array of the targets.
 */
module.exports = 'start';
