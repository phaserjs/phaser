/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Returns a random point within a Rectangle.
 *
 * @function Phaser.Geom.Rectangle.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to return a point from.
 * @param {Phaser.Math.Vector2} out - The object to update with the point's coordinates.
 *
 * @return {Phaser.Math.Vector2} The modified `out` object, or a new Point if none was provided.
 */
var Random = function (rect, out)
{
    if (out === undefined) { out = new Vector2(); }

    out.x = rect.x + (Math.random() * rect.width);
    out.y = rect.y + (Math.random() * rect.height);

    return out;
};

module.exports = Random;
