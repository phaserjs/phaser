/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Decomposes a Triangle into an array of its points.
 *
 * @function Phaser.Geom.Triangle.Decompose
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to decompose.
 * @param {array} [out] - An array to store the points into.
 *
 * @return {array} The provided `out` array, or a new array if none was provided, with three objects with `x` and `y` properties representing each point of the Triangle appended to it.
 */
var Decompose = function (triangle, out)
{
    if (out === undefined) { out = []; }

    out.push({ x: triangle.x1, y: triangle.y1 });
    out.push({ x: triangle.x2, y: triangle.y2 });
    out.push({ x: triangle.x3, y: triangle.y3 });

    return out;
};

module.exports = Decompose;
