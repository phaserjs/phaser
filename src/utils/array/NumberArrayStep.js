/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RoundAwayFromZero = require('../../math/RoundAwayFromZero');

/**
 * Create an array of numbers (positive and/or negative) progressing from `start`
 * up to but not including `end` by advancing by `step`.
 *
 * If `start` is less than `end` a zero-length range is created unless a negative `step` is specified.
 *
 * Certain values for `start` and `end` (eg. NaN/undefined/null) are currently coerced to 0;
 * for forward compatibility make sure to pass in actual numbers.
 * 
 * @example
 * NumberArrayStep(4);
 * // => [0, 1, 2, 3]
 *
 * NumberArrayStep(1, 5);
 * // => [1, 2, 3, 4]
 *
 * NumberArrayStep(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * NumberArrayStep(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * NumberArrayStep(1, 4, 0);
 * // => [1, 1, 1]
 *
 * NumberArrayStep(0);
 * // => []
 *
 * @function Phaser.Utils.Array.NumberArrayStep
 * @since 3.0.0
 *
 * @param {number} [start=0] - The start of the range.
 * @param {number} [end=null] - The end of the range.
 * @param {number} [step=1] - The value to increment or decrement by.
 *
 * @return {number[]} The array of number values.
 */
var NumberArrayStep = function (start, end, step)
{
    if (start === undefined) { start = 0; }
    if (end === undefined) { end = null; }
    if (step === undefined) { step = 1; }

    if (end === null)
    {
        end = start;
        start = 0;
    }

    var result = [];

    var total = Math.max(RoundAwayFromZero((end - start) / (step || 1)), 0);

    for (var i = 0; i < total; i++)
    {
        result.push(start);
        start += step;
    }

    return result;
};

module.exports = NumberArrayStep;
