/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Loader Plugin Post Process Event.
 * 
 * This event is dispatched by the Loader Plugin when the Loader has finished loading everything in the load queue.
 * It is dispatched before the internal lists are cleared and each File is destroyed.
 * 
 * Use this hook to perform any last minute processing of files that can only happen once the
 * Loader has completed, but prior to it emitting the `complete` event.
 * 
 * Listen to it from a Scene using: `this.load.on('postprocess', listener)`.
 *
 * @event Phaser.Loader.Events#POST_PROCESS
 * 
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader Plugin that dispatched this event.
 */
module.exports = 'postprocess';
