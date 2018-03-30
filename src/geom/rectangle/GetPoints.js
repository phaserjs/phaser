/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetPoint = require('./GetPoint');
var Perimeter = require('./Perimeter');

//  Return an array of points from the perimeter of the rectangle
//  each spaced out based on the quantity or step required

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rectangle - [description]
 * @param {number} step - [description]
 * @param {integer} quantity - [description]
 * @param {(array|Phaser.Geom.Point[])} [out] - [description]
 *
 * @return {(array|Phaser.Geom.Point[])} [description]
 */
var GetPoints = function (rectangle, quantity, stepRate, out)
{
    if (out === undefined) { out = []; }

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity)
    {
        quantity = Perimeter(rectangle) / stepRate;
    }

    for (var i = 0; i < quantity; i++)
    {
        var position = i / quantity;

        out.push(GetPoint(rectangle, position));
    }

    return out;
};

module.exports = GetPoints;
