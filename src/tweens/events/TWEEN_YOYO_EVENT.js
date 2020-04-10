/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Tween Yoyo Event.
 * 
 * This event is dispatched by a Tween whenever a property it is tweening yoyos.
 * 
 * This event will only be dispatched if the Tween has a property with `yoyo` set.
 * 
 * If the Tween has a `hold` value, this event is dispatched when the hold expires.
 * 
 * This event is dispatched for every property, and for every target, that yoyos.
 * For example, if a Tween was updating 2 properties and had 10 targets, this event
 * would be dispatched 20 times (twice per target). So be careful how you use it!
 * 
 * Listen to it from a Tween instance using `Tween.on('yoyo', listener)`, i.e.:
 * 
 * ```javascript
 * var tween = this.tweens.add({
 *     targets: image,
 *     x: 500,
 *     ease: 'Power1',
 *     duration: 3000,
 *     yoyo: true
 * });
 * tween.on('yoyo', listener);
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_YOYO
 * @since 3.19.0
 * 
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 * @param {string} key - The property that yoyo'd, i.e. `x` or `scale`.
 * @param {any} target - The target object that was yoyo'd. Usually a Game Object, but can be of any type.
 */
module.exports = 'yoyo';
