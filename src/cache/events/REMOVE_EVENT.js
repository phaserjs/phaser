/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Cache Remove Event.
 * 
 * This event is dispatched by any Cache that extends the BaseCache each time an object is removed from it.
 *
 * @event Phaser.Cache.Events#REMOVE
 * 
 * @param {Phaser.Cache.BaseCache} cache - The cache from which the object was removed.
 * @param {string} key - The key of the object removed from the cache.
 * @param {*} object - A reference to the object that was removed from the cache.
 */
module.exports = 'remove';
