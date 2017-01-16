/**
* Get a point on the curve using the `t` (time) value, which must be between 0 and 1.
*
* @method Phaser.Hermite#getPoint
* @param {number} [t=0] - The time value along the curve from which to extract a point. This is a value between 0 and 1, where 0 represents the start of the curve and 1 the end.
* @param {Phaser.Point|Object} [point] - An optional Phaser.Point, or Object containing public `x` and `y` properties. If given the resulting values will be stored in the Objects `x` and `y` properties. If omitted a new Phaser.Point object is created.
* @return {Phaser.Point} An Object with the x, y coordinate of the curve at the specified `t` value set in its `x` and `y` properties.
*/
export default function (curve: any, t: any, out: any): any;
