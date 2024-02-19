/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Circumference = require('./Circumference');
var CircumferencePoint = require('./CircumferencePoint');
var FromPercent = require('../../math/FromPercent');
var MATH_CONST = require('../../math/const');

/**
 * Returns an array of Point objects containing the coordinates of the points around the circumference of the Ellipse,
 * based on the given quantity or stepRate values.
 *
 * @function Phaser.Geom.Ellipse.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get the points from.
 * @param {number} quantity - The amount of points to return. If a falsey value the quantity will be derived from the `stepRate` instead.
 * @param {number} [stepRate] - Sets the quantity by getting the circumference of the ellipse and dividing it by the stepRate.
 * @param {(array|Phaser.Geom.Point[])} [out] - An array to insert the points in to. If not provided a new array will be created.
 *
 * @return {(array|Phaser.Geom.Point[])} An array of Point objects pertaining to the points around the circumference of the ellipse.
 */
var GetPoints = function (ellipse, quantity, stepRate, out)
{
    if (out === undefined) { out = []; }

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity && stepRate > 0)
    {
        quantity = Circumference(ellipse) / stepRate;
    }

    for (var i = 0; i < quantity; i++)
    {
        var angle = FromPercent(i / quantity, 0, MATH_CONST.PI2);

        out.push(CircumferencePoint(ellipse, angle));
    }

    return out;
};

module.exports = GetPoints;
