/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var SafeRange: any;
/**
 * Returns the total number of elements in the array which have a property matching the given value.
 *
 * @function Phaser.Utils.Array.CountAllMatching
 * @since 3.4.0
 *
 * @param {array} array - The array to search.
 * @param {string} property - The property to test on each array element.
 * @param {*} value - The value to test the property against. Must pass a strict (`===`) comparison check.
 * @param {integer} [startIndex] - An optional start index to search from.
 * @param {integer} [endIndex] - An optional end index to search to.
 *
 * @return {integer} The total number of elements with properties matching the given value.
 */
declare var CountAllMatching: (array: any, property: any, value: any, startIndex: any, endIndex: any) => number;
