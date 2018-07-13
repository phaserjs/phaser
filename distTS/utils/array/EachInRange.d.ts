/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var SafeRange: any;
/**
 * Passes each element in the array, between the start and end indexes, to the given callback.
 *
 * @function Phaser.Utils.Array.EachInRange
 * @since 3.4.0
 *
 * @param {array} array - The array to search.
 * @param {function} callback - A callback to be invoked for each item in the array.
 * @param {object} context - The context in which the callback is invoked.
 * @param {integer} startIndex - The start index to search from.
 * @param {integer} endIndex - The end index to search to.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
 *
 * @return {array} The input array.
 */
declare var EachInRange: (array: any, callback: any, context: any, startIndex: any, endIndex: any) => any;
