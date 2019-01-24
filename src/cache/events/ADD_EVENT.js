/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Cache Add Event.
 * 
 * This event is dispatched by any Cache that extends the BaseCache each time a new object is added to it.
 *
 * @event Phaser.Cache.Events#ADD
 * 
 * @param {Phaser.Cache.BaseCache} cache - The cache to which the object was added.
 * @param {string} key - The key of the object added to the cache.
 * @param {*} object - A reference to the object that was added to the cache.
 */
module.exports = 'add';
