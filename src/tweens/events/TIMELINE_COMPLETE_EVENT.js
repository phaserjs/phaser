/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Timeline Complete Event.
 * 
 * This event is dispatched by a Tween Timeline when it completes playback.
 * 
 * Listen to it from a Timeline instance using `Timeline.on('complete', listener)`, i.e.:
 * 
 * ```javascript
 * var timeline = this.tweens.timeline({
 *     targets: image,
 *     ease: 'Power1',
 *     duration: 3000,
 *     tweens: [ { x: 600 }, { y: 500 }, { x: 100 }, { y: 100 } ]
 * });
 * timeline.on('complete', listener);
 * timeline.play();
 * ```
 *
 * @event Phaser.Tweens.Events#TIMELINE_COMPLETE
 * @since 3.0.0
 * 
 * @param {Phaser.Tweens.Timeline} timeline - A reference to the Timeline instance that emitted the event.
 */
module.exports = 'complete';
