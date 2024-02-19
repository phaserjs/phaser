/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Loader Plugin Complete Event.
 *
 * This event is dispatched when the Loader has fully processed everything in the load queue.
 * By this point every loaded file will now be in its associated cache and ready for use.
 *
 * Listen to it from a Scene using: `this.load.on('complete', listener)`.
 *
 * @event Phaser.Loader.Events#COMPLETE
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader Plugin that dispatched this event.
 * @param {number} totalComplete - The total number of files that successfully loaded.
 * @param {number} totalFailed - The total number of files that failed to load.
 */
module.exports = 'complete';
