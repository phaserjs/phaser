/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = require('../point/Point');

/**
 * Returns a Point object containing the coordinates of a point on the circumference of the Ellipse based on the given angle.
 *
 * @function Phaser.Geom.Ellipse.CircumferencePoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get the circumference point on.
 * @param {number} angle - The angle from the center of the Ellipse to the circumference to return the point from. Given in radians.
 * @param {(Phaser.Geom.Point|object)} [out] - A Point, or point-like object, to store the results in. If not given a Point will be created.
 *
 * @return {(Phaser.Geom.Point|object)} A Point object where the `x` and `y` properties are the point on the circumference.
 */
var CircumferencePoint = function (ellipse, angle, out)
{
    if (out === undefined) { out = new Point(); }

    var halfWidth = ellipse.width / 2;
    var halfHeight = ellipse.height / 2;

    out.x = ellipse.x + halfWidth * Math.cos(angle);
    out.y = ellipse.y + halfHeight * Math.sin(angle);

    return out;
};

module.exports = CircumferencePoint;
