/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The File Load Complete Event.
 * 
 * This event is dispatched by the Loader Plugin when any file in the queue finishes loading.
 * 
 * Listen to it from a Scene using: `this.load.on('filecomplete', listener)`.
 * 
 * You can also listen for the completion of a specific file. See the [FILE_KEY_COMPLETE]{@linkcode Phaser.Loader.Events#event:FILE_KEY_COMPLETE} event.
 *
 * @event Phaser.Loader.Events#FILE_COMPLETE
 * 
 * @param {string} key - The key of the file that just loaded and finished processing.
 * @param {string} type - The [file type]{@link Phaser.Loader.File#type} of the file that just loaded, i.e. `image`.
 * @param {any} data - The raw data the file contained.
 */
module.exports = 'filecomplete';
