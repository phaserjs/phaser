/**
* Create an array of numbers (positive and/or negative) progressing from `start`
* up to but not including `end` by advancing by `step`.
*
* If `start` is less than `end` a zero-length range is created unless a negative `step` is specified.
*
* Certain values for `start` and `end` (eg. NaN/undefined/null) are currently coerced to 0;
* for forward compatibility make sure to pass in actual numbers.
*
* @method Phaser.ArrayUtils#numberArrayStep
* @param {number} start - The start of the range.
* @param {number} [end] - The end of the range.
* @param {number} [step=1] - The value to increment or decrement by.
* @returns {Array} Returns the new array of numbers.
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
*/
export default function (start: any, end: any, step: any): any[];
