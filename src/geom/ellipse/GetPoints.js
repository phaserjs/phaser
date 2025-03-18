/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Circumference = require('./Circumference');
var CircumferencePoint = require('./CircumferencePoint');
var FromPercent = require('../../math/FromPercent');
var MATH_CONST = require('../../math/const');

/**
 * Returns an array of Vector2 objects containing the coordinates of the points around the circumference of the Ellipse,
 * based on the given quantity or stepRate values.
 *
 * @function Phaser.Geom.Ellipse.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get the points from.
 * @param {number} quantity - The amount of points to return. If a falsey value the quantity will be derived from the `stepRate` instead.
 * @param {number} [stepRate] - Sets the quantity by getting the circumference of the ellipse and dividing it by the stepRate.
 * @param {Phaser.Math.Vector2[]} [out] - An array to insert the Vector2 objects in to. If not provided a new array will be created.
 *
 * @return {Phaser.Math.Vector2[]} An array of Vector2 objects pertaining to the points around the circumference of the ellipse.
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
        var angle = FromPercent(i / quantity, 0, MATH_CONST.TAU);

        out.push(CircumferencePoint(ellipse, angle));
    }

    return out;
};

module.exports = GetPoints;
