/**
* Convert a distance along this curve into a `time` value which will be between 0 and 1.
*
* For example if this curve has a length of 100 pixels then `findT(50)` would return `0.5`.
*
* @method Phaser.Hermite#findT
* @param {integer} distance - The distance into the curve in pixels. Should be a positive integer.
* @return {number} The time (`t`) value, a float between 0 and 1.
*/
export default function (curve: any, distance: any): number;
