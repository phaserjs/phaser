/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
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
 * var tween = this.tweens.add({
 *     targets: image,
 *     x: 500,
 *     ease: 'Power1',
 *     duration: 3000
 * });
 * tween.on('active', listener);
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_ACTIVE
 * @since 3.19.0
 * 
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 * @param {any[]} targets - An array of references to the target/s the Tween is operating on.
 */
module.exports = 'active';
