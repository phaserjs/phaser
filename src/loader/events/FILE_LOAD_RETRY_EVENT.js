/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The File Load Retry Event.
 *
 * This event is dispatched by the Loader Plugin when a file fails to load but will retry loading.
 *
 * Listen to it from a Scene using: `this.load.on('loadretry', listener)`.
 *
 * @event Phaser.Loader.Events#FILE_LOAD_RETRY
 * @type {string}
 * @since 3.88.0
 *
 * @param {Phaser.Loader.File} file - A reference to the File which errored during load, and is retrying.
 * @param {ProgressEvent} event - The DOM ProgressEvent that resulted from this error.
 * @param {number} retries - The number of times loading has failed and was retried.
 */
module.exports = 'loadretry';
