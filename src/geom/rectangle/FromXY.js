/**
 * @author       samme
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = require('./Rectangle');

/**
 * Create the smallest Rectangle containing two coordinate pairs.
 *
 * @function Phaser.Geom.Rectangle.FromXY
 * @since 3.23.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {number} x1 - The X coordinate of the first point.
 * @param {number} y1 - The Y coordinate of the first point.
 * @param {number} x2 - The X coordinate of the second point.
 * @param {number} y2 - The Y coordinate of the second point.
 * @param {Phaser.Geom.Rectangle} [out] - Optional Rectangle to adjust.
 *
 * @return {Phaser.Geom.Rectangle} The adjusted `out` Rectangle, or a new Rectangle if none was provided.
 */
var FromXY = function (x1, y1, x2, y2, out)
{
    if (out === undefined) { out = new Rectangle(); }

    return out.setTo(
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.abs(x1 - x2),
        Math.abs(y1 - y2)
    );
};

module.exports = FromXY;
