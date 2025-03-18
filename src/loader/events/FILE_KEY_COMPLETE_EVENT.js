/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The File Load Complete Event.
 *
 * This event is dispatched by the Loader Plugin when any file in the queue finishes loading.
 *
 * It uses a special dynamic event name constructed from the key and type of the file.
 *
 * For example, if you have loaded an `image` with a key of `monster`, you can listen for it
 * using the following:
 *
 * ```javascript
 * this.load.on('filecomplete-image-monster', function (key, type, data) {
 *     // Your handler code
 * });
 * ```
 *
 * Or, if you have loaded a texture `atlas` with a key of `Level1`:
 *
 * ```javascript
 * this.load.on('filecomplete-atlasjson-Level1', function (key, type, data) {
 *     // Your handler code
 * });
 * ```
 *
 * Or, if you have loaded a sprite sheet with a key of `Explosion` and a prefix of `GAMEOVER`:
 *
 * ```javascript
 * this.load.on('filecomplete-spritesheet-GAMEOVERExplosion', function (key, type, data) {
 *     // Your handler code
 * });
 * ```
 *
 * Make sure you remove your listeners when you have finished, or they will continue to fire if the Scene reloads.
 *
 * You can also listen for the generic completion of files. See the [FILE_COMPLETE]{@linkcode Phaser.Loader.Events#event:FILE_COMPLETE} event.
 *
 * @event Phaser.Loader.Events#FILE_KEY_COMPLETE
 * @type {string}
 * @since 3.0.0
 *
 * @param {string} key - The key of the file that just loaded and finished processing.
 * @param {string} type - The [file type]{@link Phaser.Loader.File#type} of the file that just loaded, i.e. `image`.
 * @param {any} [data] - The raw data the file contained. If the file was a multi-file, like an atlas or bitmap font, this parameter will be undefined.
 */
module.exports = 'filecomplete-';
