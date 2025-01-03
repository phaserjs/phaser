/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Cache Remove Event.
 *
 * This event is dispatched by any Cache that extends the BaseCache each time an object is removed from it.
 *
 * @event Phaser.Cache.Events#REMOVE
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Cache.BaseCache} cache - The cache from which the object was removed.
 * @param {string} key - The key of the object removed from the cache.
 * @param {*} object - A reference to the object that was removed from the cache.
 */
module.exports = 'remove';
