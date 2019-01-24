/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Loader Plugin Start Event.
 * 
 * This event is dispatched when the Loader starts running. At this point load progress is zero.
 * 
 * This event is dispatched even if there aren't any files in the load queue.
 * 
 * Listen to it from a Scene using: `this.load.on('start', listener)`.
 *
 * @event Phaser.Loader.Events#START
 * 
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader Plugin that dispatched this event.
 */
module.exports = 'start';
