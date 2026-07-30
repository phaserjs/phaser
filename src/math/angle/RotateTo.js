/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
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
 * @param {number} [lerp=0.05] - The step size, in radians, to rotate by in this call. The angle will be rotated by this amount towards the target, either added or subtracted depending on the shortest rotation direction.
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

    if (Math.abs(targetAngle - currentAngle) <= lerp || Math.abs(targetAngle - currentAngle) >= (MATH_CONST.TAU - lerp))
    {
        currentAngle = targetAngle;
    }
    else
    {
        if (Math.abs(targetAngle - currentAngle) > Math.PI)
        {
            if (targetAngle < currentAngle)
            {
                targetAngle += MATH_CONST.TAU;
            }
            else
            {
                targetAngle -= MATH_CONST.TAU;
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
