/**
* Copies the x, y and diameter properties from any given object to this Circle.
* @method Phaser.Circle#copyFrom
* @param {any} source - The object to copy from.
* @return {Circle} This Circle object.
*/
var Invert = function (point)
{
    return point.setTo(point.y, point.x);
};

module.exports = Invert;
