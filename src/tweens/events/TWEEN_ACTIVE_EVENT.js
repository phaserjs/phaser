/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Tween Active Event.
 *
 * This event is dispatched by a Tween when it becomes active within the Tween Manager.
 *
 * An 'active' Tween is one that is now progressing, although it may not yet be updating
 * any target properties, due to settings such as `delay`. If you need an event for when
 * the Tween starts actually updating its first property, see `TWEEN_START`.
 *
 * Listen to it from a Tween instance using `Tween.on('active', listener)`, i.e.:
 *
 * ```javascript
 * var tween = this.tweens.create({
 *     targets: image,
 *     x: 500,
 *     ease: 'Power1',
 *     duration: 3000
 * });
 * tween.on('active', listener);
 * this.tweens.existing(tween);
 * ```
 *
 * Note that this event is usually dispatched already by the time you call `this.tweens.add()`, and is
 * meant for use with `tweens.create()` and/or `tweens.existing()`.
 *
 * @event Phaser.Tweens.Events#TWEEN_ACTIVE
 * @type {string}
 * @since 3.19.0
 *
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 * @param {(any|any[])} targets - The targets of the Tween. If this Tween has multiple targets this will be an array of the targets.
 */
module.exports = 'active';
