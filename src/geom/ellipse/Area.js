/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates the area of the given Ellipse using the formula: π × majorRadius × minorRadius.
 * Returns 0 if the Ellipse is empty (i.e. has no width or height).
 *
 * @function Phaser.Geom.Ellipse.Area
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get the area of.
 *
 * @return {number} The area of the Ellipse, or 0 if the Ellipse is empty.
 */
var Area = function (ellipse)
{
    if (ellipse.isEmpty())
    {
        return 0;
    }

    //  units squared
    return (ellipse.getMajorRadius() * ellipse.getMinorRadius() * Math.PI);
};

module.exports = Area;
