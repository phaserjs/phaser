/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The File Load Progress Event.
 *
 * This event is dispatched by the Loader Plugin during the load of a file, if the browser receives a DOM ProgressEvent and
 * the `lengthComputable` event property is true. Depending on the size of the file and browser in use, this may, or may not happen.
 *
 * Listen to it from a Scene using: `this.load.on('fileprogress', listener)`.
 *
 * @event Phaser.Loader.Events#FILE_PROGRESS
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Loader.File} file - A reference to the File which errored during load.
 * @param {number} percentComplete - A value between 0 and 1 indicating how 'complete' this file is.
 */
module.exports = 'fileprogress';
