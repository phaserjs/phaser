/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Tween Complete Event.
 * 
 * This event is dispatched by a Tween when it completes playback.
 * 
 * Listen to it from a Tween instance using `Tween.on('complete', listener)`, i.e.:
 * 
 * ```javascript
 * var tween = this.tweens.add({
 *     targets: image,
 *     ease: 'Power1',
 *     duration: 3000,
 *     tweens: [ { x: 600 }, { y: 500 }, { x: 100 }, { y: 100 } ]
 * });
 * tween.on('complete', listener);
 * ```
 *
 * @event Phaser.Tweens.Events#TWEEN_COMPLETE
 * @since 3.19.0
 * 
 * @param {Phaser.Tweens.Tween} tween - A reference to the Tween instance that emitted the event.
 */
module.exports = 'complete';
