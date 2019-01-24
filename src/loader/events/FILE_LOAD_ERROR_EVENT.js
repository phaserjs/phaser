/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The File Load Error Event.
 * 
 * This event is dispatched by the Loader Plugin when a file fails to load.
 * 
 * Listen to it from a Scene using: `this.load.on('loaderror', listener)`.
 *
 * @event Phaser.Loader.Events#FILE_LOAD_ERROR
 * 
 * @param {Phaser.Loader.File} file - A reference to the File which errored during load.
 */
module.exports = 'loaderror';
