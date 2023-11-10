/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Timeline Complete Event.
 *
 * This event is dispatched by timeline when all timeline events complete.
 *
 * Listen to it from a Timeline instance using `Timeline.on('complete', listener)`, i.e.:
 *
 * ```javascript
 * const timeline = this.add.timeline();
 * timeline.on('complete', listener);
 * timeline.play();
 * ```
 *
 * @event Phaser.Time.Events#COMPLETE
 * @type {string}
 * @since 3.70.0
 *
 * @param {Phaser.Time.Timeline} timeline - A reference to the Timeline that emitted the event.
 */
module.exports = 'complete';
