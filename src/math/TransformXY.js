/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @param {(Phaser.Math.Vector2|Phaser.Geom.Point|object)} [output] - The output vector, point or object for the translated coordinates.
 *
 * @return {(Phaser.Math.Vector2|Phaser.Geom.Point|object)} The translated point.
 */
var TransformXY = function (x, y, positionX, positionY, rotation, scaleX, scaleY, output)
{
    if (output === undefined) { output = new Vector2(); }

    var radianSin = Math.sin(rotation);
    var radianCos = Math.cos(rotation);

    // Rotate and Scale
    var a = radianCos * scaleX;
    var b = radianSin * scaleX;
    var c = -radianSin * scaleY;
    var d = radianCos * scaleY;

    //  Invert
    var id = 1 / ((a * d) + (c * -b));

    output.x = (d * id * x) + (-c * id * y) + (((positionY * c) - (positionX * d)) * id);
    output.y = (a * id * y) + (-b * id * x) + (((-positionY * a) + (positionX * b)) * id);

    return output;
};

module.exports = TransformXY;
