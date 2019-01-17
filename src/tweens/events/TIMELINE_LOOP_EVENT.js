/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Timeline Loop Event.
 * 
 * This event is dispatched by a Tween Timeline every time it loops.
 * 
 * Listen to it from a Timeline instance using `Timeline.on('loop', listener)`, i.e.:
 * 
 * ```javascript
 * var timeline = this.tweens.timeline({
 *     targets: image,
 *     ease: 'Power1',
 *     duration: 3000,
 *     loop: 4,
 *     tweens: [ { x: 600 }, { y: 500 }, { x: 100 }, { y: 100 } ]
 * });
 * timeline.on('loop', listener);
 * timeline.play();
 * ```
 *
 * @event Phaser.Tweens.Events#TIMELINE_LOOP
 * 
 * @param {Phaser.Tweens.Timeline} timeline - A reference to the Timeline instance that emitted the event.
 * @param {integer} loopCount - The number of loops left before this Timeline completes.
 */
module.exports = 'loop';
