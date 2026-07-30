/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Offsets the Ellipse by the values given in the `x` and `y` properties of the Vector2 object.
 *
 * @function Phaser.Geom.Ellipse.OffsetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Ellipse} O - [ellipse,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to be offset (translated.)
 * @param {Phaser.Math.Vector2} vec - The Vector2 object containing the values to offset the Ellipse by.
 *
 * @return {Phaser.Geom.Ellipse} The Ellipse that was offset.
 */
var OffsetPoint = function (ellipse, vec)
{
    ellipse.x += vec.x;
    ellipse.y += vec.y;

    return ellipse;
};

module.exports = OffsetPoint;
