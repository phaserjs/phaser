/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Vector2 = require('./Vector2');

/**
 * Takes the `x` and `y` coordinates and transforms them into the same space as
 * defined by the position, rotation and scale values.
 *
 * @function Phaser.Math.TransformXY
 * @since 3.0.0
 *
 * @param {number} x - The x coordinate to be transformed.
 * @param {number} y - The y coordinate to be transformed.
 * @param {number} positionX - Horizontal position of the transform point.
 * @param {number} positionY - Vertical position of the transform point.
 * @param {number} rotation - Rotation of the transform point, in radians.
 * @param {number} scaleX - Horizontal scale of the transform point.
 * @param {number} scaleY - Vertical scale of the transform point.
 * @param {Vector2|Point|object} [output] - [description]
 *
 * @return {Vector2|Point|object} The translated point.
 */
var TransformXY = function (x, y, positionX, positionY, rotation, scaleX, scaleY, output)
{
    if (output === undefined) { output = new Vector2(); }

    //  ITRS

    var sr = Math.sin(-rotation);
    var cr = Math.cos(-rotation);

    var a = cr * scaleX;
    var b = -sr * scaleX;
    var c = sr * scaleY;
    var d = cr * scaleY;

    //  Invert

    var n = a * d - b * c;

    var m0 = d / n;
    var m1 = -b / n;
    var m2 = -c / n;
    var m3 = a / n;
    var m4 = (c * positionY - d * positionX) / n;
    var m5 = -(a * positionY - b * positionX) / n;

    //  Transform

    output.x = x * m0 + y * m2 + m4;
    output.y = x * m1 + y * m3 + m5;

    return output;
};

module.exports = TransformXY;
