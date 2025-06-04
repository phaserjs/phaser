/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Timeline Complete Event.
 *
 * This event is dispatched by a timeline when all of its events have been run.
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
