/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Returns the center of a Rectangle as a Point.
 *
 * @function Phaser.Geom.Rectangle.GetCenter
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to get the center of.
 * @param {(Phaser.Math.Vector2|object)} [out] - Optional point-like object to update with the center coordinates.
 *
 * @return {(Phaser.Math.Vector2|object)} The modified `out` object, or a new Point if none was provided.
 */
var GetCenter = function (rect, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = rect.centerX;
    out.y = rect.centerY;

    return out;
};

module.exports = GetCenter;
