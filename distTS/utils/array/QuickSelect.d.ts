/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * [description]
 *
 * @function Phaser.Utils.Array.QuickSelect
 * @since 3.0.0
 *
 * @param {array} arr - [description]
 * @param {number} k - [description]
 * @param {number} left - [description]
 * @param {number} right - [description]
 * @param {function} compare - [description]
 */
declare var QuickSelect: (arr: any, k: any, left: any, right: any, compare: any) => void;
declare function swap(arr: any, i: any, j: any): void;
declare function defaultCompare(a: any, b: any): 0 | 1 | -1;
