/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The File Load Event.
 * 
 * This event is dispatched by the Loader Plugin when a file finishes loading,
 * but _before_ it is processed and added to the internal Phaser caches.
 * 
 * Listen to it from a Scene using: `this.load.on('load', listener)`.
 *
 * @event Phaser.Loader.Events#FILE_LOAD
 * 
 * @param {Phaser.Loader.File} file - A reference to the File which just finished loading.
 */
module.exports = 'load';
