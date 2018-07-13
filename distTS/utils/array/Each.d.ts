/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Passes each element in the array to the given callback.
 *
 * @function Phaser.Utils.Array.Each
 * @since 3.4.0
 *
 * @param {array} array - The array to search.
 * @param {function} callback - A callback to be invoked for each item in the array.
 * @param {object} context - The context in which the callback is invoked.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the current array item.
 *
 * @return {array} The input array.
 */
declare var Each: (array: any, callback: any, context: any) => any;
