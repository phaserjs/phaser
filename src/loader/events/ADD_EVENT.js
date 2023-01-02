/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Loader Plugin Add File Event.
 *
 * This event is dispatched when a new file is successfully added to the Loader and placed into the load queue.
 *
 * Listen to it from a Scene using: `this.load.on('addfile', listener)`.
 *
 * If you add lots of files to a Loader from a `preload` method, it will dispatch this event for each one of them.
 *
 * @event Phaser.Loader.Events#ADD
 * @type {string}
 * @since 3.0.0
 *
 * @param {string} key - The unique key of the file that was added to the Loader.
 * @param {string} type - The [file type]{@link Phaser.Loader.File#type} string of the file that was added to the Loader, i.e. `image`.
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader Plugin that dispatched this event.
 * @param {Phaser.Loader.File} file - A reference to the File which was added to the Loader.
 */
module.exports = 'addfile';
