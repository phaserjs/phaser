/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');

/**
 * Takes an angle in Phasers default clockwise format and converts it so that
 * 0 is North, 90 is West, 180 is South and 270 is East,
 * therefore running counter-clockwise instead of clockwise.
 * 
 * You can pass in the angle from a Game Object using:
 * 
 * ```javascript
 * var converted = CounterClockwise(gameobject.rotation);
 * ```
 * 
 * All values for this function are in radians.
 *
 * @function Phaser.Math.Angle.CounterClockwise
 * @since 3.16.0
 *
 * @param {number} angle - The angle to convert, in radians.
 *
 * @return {number} The converted angle, in radians.
 */
var CounterClockwise = function (angle)
{
    if (angle > Math.PI)
    {
        angle -= CONST.TAU;
    }

    return Math.abs((((angle + CONST.PI_OVER_2) % CONST.TAU) - CONST.TAU) % CONST.TAU);
};

module.exports = CounterClockwise;
