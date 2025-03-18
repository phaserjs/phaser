/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       @samme
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var FloatBetween = require('../FloatBetween');

/**
 * Returns a random angle in the range [-pi, pi].
 *
 * @function Phaser.Math.Angle.Random
 * @since 3.23.0
 *
 * @return {number} The angle, in radians.
 */
var Random = function ()
{
    return FloatBetween(-Math.PI, Math.PI);
};

module.exports = Random;
