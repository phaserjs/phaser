/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Copies the `x`, `y`, `width` and `height` properties from the `source` Ellipse
 * into the given `dest` Ellipse, then returns the `dest` Ellipse.
 *
 * @function Phaser.Geom.Ellipse.CopyFrom
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Ellipse} O - [dest,$return]
 *
 * @param {Phaser.Geom.Ellipse} source - The source Ellipse to copy the values from.
 * @param {Phaser.Geom.Ellipse} dest - The destination Ellipse to copy the values to.
 *
 * @return {Phaser.Geom.Ellipse} The destination Ellipse.
 */
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x, source.y, source.width, source.height);
};

module.exports = CopyFrom;
