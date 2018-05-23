/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Normalize the given angle.
 *
 * [description] TODO: Needs elaborating
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
