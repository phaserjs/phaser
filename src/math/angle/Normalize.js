/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Normalize an angle to the [0, 2pi] range.
 *
 * @function Phaser.Math.Angle.Normalize
 * @since 3.0.0
 *
 * @param {number} angle - The angle to normalize, in radians.
 *
 * @return {number} The normalized angle, in radians.
 */
var Normalize = function (angle)
{
    angle = angle % (2 * Math.PI);

    if (angle >= 0)
    {
        return angle;
    }
    else
    {
        return angle + 2 * Math.PI;
    }
};

module.exports = Normalize;
