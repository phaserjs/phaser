/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Timeline Update Event.
 * 
 * This event is dispatched by a Tween Timeline every time it updates, which can happen a lot of times per second,
 * so be careful about listening to this event unless you absolutely require it.
 * 
 * Listen to it from a Timeline instance using `Timeline.on('update', listener)`, i.e.:
 * 
 * ```javascript
 * var timeline = this.tweens.timeline({
 *     targets: image,
 *     ease: 'Power1',
 *     duration: 3000,
 *     tweens: [ { x: 600 }, { y: 500 }, { x: 100 }, { y: 100 } ]
 * });
 * timeline.on('update', listener);
 * timeline.play();
 * ```
 *
 * @event Phaser.Tweens.Events#TIMELINE_UPDATE
 * @since 3.0.0
 * 
 * @param {Phaser.Tweens.Timeline} timeline - A reference to the Timeline instance that emitted the event.
 */
module.exports = 'update';
