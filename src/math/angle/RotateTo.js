/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH_CONST = require('../const');

/**
 * Rotates `currentAngle` towards `targetAngle`, taking the shortest rotation distance. The `lerp` argument is the amount to rotate by in this call.
 *
 * @function Phaser.Math.Angle.RotateTo
 * @since 3.0.0
 *
 * @param {number} currentAngle - The current angle, in radians.
 * @param {number} targetAngle - The target angle to rotate to, in radians.
 * @param {number} [lerp=0.05] - The lerp value to add to the current angle.
 *
 * @return {number} The adjusted angle.
 */
var RotateTo = function (currentAngle, targetAngle, lerp)
{
    if (lerp === undefined) { lerp = 0.05; }

    if (currentAngle === targetAngle)
    {
        return currentAngle;
    }

    if (Math.abs(targetAngle - currentAngle) <= lerp || Math.abs(targetAngle - currentAngle) >= (MATH_CONST.PI2 - lerp))
    {
        currentAngle = targetAngle;
    }
    else
    {
        if (Math.abs(targetAngle - currentAngle) > Math.PI)
        {
            if (targetAngle < currentAngle)
            {
                targetAngle += MATH_CONST.PI2;
            }
            else
            {
                targetAngle -= MATH_CONST.PI2;
            }
        }

        if (targetAngle > currentAngle)
        {
            currentAngle += lerp;
        }
        else if (targetAngle < currentAngle)
        {
            currentAngle -= lerp;
        }
    }

    return currentAngle;
};

module.exports = RotateTo;
