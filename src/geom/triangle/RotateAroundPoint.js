/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RotateAroundXY = require('./RotateAroundXY');

/**
 * Rotates a Triangle at a certain angle about a given Vector2 point.
 *
 * @function Phaser.Geom.Triangle.RotateAroundPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle} O - [triangle,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to rotate.
 * @param {Phaser.Math.Vector2} point - The Vector2 point to rotate the Triangle around.
 * @param {number} angle - The angle by which to rotate the Triangle, in radians.
 *
 * @return {Phaser.Geom.Triangle} The rotated Triangle.
 */
var RotateAroundPoint = function (triangle, point, angle)
{
    return RotateAroundXY(triangle, point.x, point.y, angle);
};

module.exports = RotateAroundPoint;
