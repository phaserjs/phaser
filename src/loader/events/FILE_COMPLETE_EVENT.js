/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The File Load Complete Event.
 *
 * This event is dispatched by the Loader Plugin when _any_ file in the queue finishes loading.
 *
 * Listen to it from a Scene using: `this.load.on('filecomplete', listener)`.
 *
 * Make sure you remove this listener when you have finished, or it will continue to fire if the Scene reloads.
 *
 * You can also listen for the completion of a specific file. See the [FILE_KEY_COMPLETE]{@linkcode Phaser.Loader.Events#event:FILE_KEY_COMPLETE} event.
 *
 * @event Phaser.Loader.Events#FILE_COMPLETE
 * @type {string}
 * @since 3.0.0
 *
 * @param {string} key - The key of the file that just loaded and finished processing.
 * @param {string} type - The [file type]{@link Phaser.Loader.File#type} of the file that just loaded, i.e. `image`.
 * @param {any} [data] - The raw data the file contained. If the file was a multi-file, like an atlas or bitmap font, this parameter will be undefined.
 */
module.exports = 'filecomplete';
