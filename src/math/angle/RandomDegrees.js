/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       @samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var FloatBetween = require('../FloatBetween');

/**
 * Returns a random angle in the range [-180, 180].
 *
 * @function Phaser.Math.Angle.RandomDegrees
 * @since 3.23.0
 *
 * @return {number} The angle, in degrees.
 */
var RandomDegrees = function ()
{
    return FloatBetween(-180, 180);
};

module.exports = RandomDegrees;
