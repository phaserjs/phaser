/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Work out what percentage `value` is of the range between `min` and `max`.
 * If `max` isn't given then it will return the percentage of `value` to `min`.
 *
 * You can optionally specify an `upperMax` value, which is a mid-way point in the range that represents 100%, after which the % starts to go down to zero again.
 *
 * @function Phaser.Math.Percent
 * @since 3.0.0
 *
 * @param {number} value - The value to determine the percentage of.
 * @param {number} min - The minimum value.
 * @param {number} [max] - The maximum value.
 * @param {number} [upperMax] - The mid-way point in the range that represents 100%.
 *
 * @return {number} A value between 0 and 1 representing the percentage.
 */
declare var Percent: (value: any, min: any, max: any, upperMax: any) => number;
