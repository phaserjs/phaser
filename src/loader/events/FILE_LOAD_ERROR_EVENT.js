/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The File Load Error Event.
 *
 * This event is dispatched by the Loader Plugin when a file fails to load.
 *
 * Listen to it from a Scene using: `this.load.on('loaderror', listener)`.
 *
 * @event Phaser.Loader.Events#FILE_LOAD_ERROR
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Loader.File} file - A reference to the File which errored during load.
 */
module.exports = 'loaderror';
