/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Timeline Resume Event.
 * 
 * This event is dispatched by a Tween Timeline when it is resumed from a paused state.
 * 
 * Listen to it from a Timeline instance using `Timeline.on('resume', listener)`, i.e.:
 * 
 * ```javascript
 * var timeline = this.tweens.timeline({
 *     targets: image,
 *     ease: 'Power1',
 *     duration: 3000,
 *     tweens: [ { x: 600 }, { y: 500 }, { x: 100 }, { y: 100 } ]
 * });
 * timeline.on('resume', listener);
 * // At some point later ...
 * timeline.resume();
 * ```
 *
 * @event Phaser.Tweens.Events#TIMELINE_RESUME
 * @since 3.0.0
 * 
 * @param {Phaser.Tweens.Timeline} timeline - A reference to the Timeline instance that emitted the event.
 */
module.exports = 'resume';
