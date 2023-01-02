/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = require('../point/Point');

/**
 * Returns the center of a Rectangle as a Point.
 *
 * @function Phaser.Geom.Rectangle.GetCenter
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to get the center of.
 * @param {(Phaser.Geom.Point|object)} [out] - Optional point-like object to update with the center coordinates.
 *
 * @return {(Phaser.Geom.Point|object)} The modified `out` object, or a new Point if none was provided.
 */
var GetCenter = function (rect, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = rect.centerX;
    out.y = rect.centerY;

    return out;
};

module.exports = GetCenter;
