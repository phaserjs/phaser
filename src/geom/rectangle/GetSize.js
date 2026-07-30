/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Returns the size of the Rectangle, expressed as a Vector2 object.
 * With the value of the `width` as the `x` property and the `height` as the `y` property.
 *
 * @function Phaser.Geom.Rectangle.GetSize
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to get the size from.
 * @param {Phaser.Math.Vector2} [out] - The Vector2 object to store the size in. If not given, a new Vector2 instance is created.
 *
 * @return {Phaser.Math.Vector2} A Vector2 object where `x` holds the width and `y` holds the height of the Rectangle.
 */
var GetSize = function (rect, out)
{
    if (out === undefined) { out = new Vector2(); }

    out.x = rect.width;
    out.y = rect.height;

    return out;
};

module.exports = GetSize;
