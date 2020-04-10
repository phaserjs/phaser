/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Loader Plugin Progress Event.
 * 
 * This event is dispatched when the Loader updates its load progress, typically as a result of a file having completed loading.
 * 
 * Listen to it from a Scene using: `this.load.on('progress', listener)`.
 *
 * @event Phaser.Loader.Events#PROGRESS
 * @since 3.0.0
 * 
 * @param {number} progress - The current progress of the load. A value between 0 and 1.
 */
module.exports = 'progress';
