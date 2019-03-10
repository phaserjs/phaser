/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Circumference = require('./Circumference');
var CircumferencePoint = require('./CircumferencePoint');
var FromPercent = require('../../math/FromPercent');
var MATH_CONST = require('../../math/const');

/**
 * Returns an array of Point objects containing the coordinates of the points around the circumference of the Circle,
 * based on the given quantity or stepRate values.
 *
 * @function Phaser.Geom.Circle.GetPoints
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to get the points from.
 * @param {integer} quantity - The amount of points to return. If a falsey value the quantity will be derived from the `stepRate` instead.
 * @param {number} [stepRate] - Sets the quantity by getting the circumference of the circle and dividing it by the stepRate.
 * @param {array} [output] - An array to insert the points in to. If not provided a new array will be created.
 *
 * @return {Phaser.Geom.Point[]} An array of Point objects pertaining to the points around the circumference of the circle.
 */
var GetPoints = function (circle, quantity, stepRate, out)
{
    if (out === undefined) { out = []; }

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity)
    {
        quantity = Circumference(circle) / stepRate;
    }

    for (var i = 0; i < quantity; i++)
    {
        var angle = FromPercent(i / quantity, 0, MATH_CONST.PI2);

        out.push(CircumferencePoint(circle, angle));
    }

    return out;
};

module.exports = GetPoints;
