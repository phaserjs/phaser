/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./const');

/**
 * Calculates and returns the vertical overlap between two arcade physics bodies and sets their properties
 * accordingly, including: `touching.up`, `touching.down`, `touching.none` and `overlapY'.
 *
 * @function Phaser.Physics.Arcade.GetOverlapY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {boolean} overlapOnly - Is this an overlap only check, or part of separation?
 * @param {number} bias - A value added to the delta values during collision checks. Increase it to prevent sprite tunneling(sprites passing through another instead of colliding).
 *
 * @return {number} The amount of overlap.
 */
var GetOverlapY = function (body1, body2, overlapOnly, bias)
{
    var overlap = 0;
    var maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + bias;

    if (body1._dy === 0 && body2._dy === 0)
    {
        //  They overlap but neither of them are moving
        body1.embedded = true;
        body2.embedded = true;
    }
    else if (body1._dy > body2._dy)
    {
        //  Body1 is moving down and/or Body2 is moving up
        overlap = body1.bottom - body2.y;

        if ((overlap > maxOverlap && !overlapOnly) || body1.checkCollision.down === false || body2.checkCollision.up === false)
        {
            overlap = 0;
        }
        else
        {
            body1.touching.none = false;
            body1.touching.down = true;

            body2.touching.none = false;
            body2.touching.up = true;

            if (body2.physicsType === CONST.STATIC_BODY && !overlapOnly)
            {
                body1.blocked.none = false;
                body1.blocked.down = true;
            }

            if (body1.physicsType === CONST.STATIC_BODY && !overlapOnly)
            {
                body2.blocked.none = false;
                body2.blocked.up = true;
            }
        }
    }
    else if (body1._dy < body2._dy)
    {
        //  Body1 is moving up and/or Body2 is moving down
        overlap = body1.y - body2.bottom;

        if ((-overlap > maxOverlap && !overlapOnly) || body1.checkCollision.up === false || body2.checkCollision.down === false)
        {
            overlap = 0;
        }
        else
        {
            body1.touching.none = false;
            body1.touching.up = true;

            body2.touching.none = false;
            body2.touching.down = true;

            if (body2.physicsType === CONST.STATIC_BODY && !overlapOnly)
            {
                body1.blocked.none = false;
                body1.blocked.up = true;
            }

            if (body1.physicsType === CONST.STATIC_BODY && !overlapOnly)
            {
                body2.blocked.none = false;
                body2.blocked.down = true;
            }
        }
    }

    //  Resets the overlapY to zero if there is no overlap, or to the actual pixel value if there is
    body1.overlapY = overlap;
    body2.overlapY = overlap;

    return overlap;
};

module.exports = GetOverlapY;
