/**
* Force a value within the boundaries by clamping it to the range `min`, `max`.
*
* @method Phaser.Math#clamp
* @param {float} v - The value to be clamped.
* @param {float} min - The minimum bounds.
* @param {float} max - The maximum bounds.
* @return {number} The clamped value.
*/
var Clamp = function (v, min, max)
{
    return Math.max(min, Math.min(max, value));
};

module.exports = Clamp;
