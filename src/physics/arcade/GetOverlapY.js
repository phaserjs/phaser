/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');

/**
 * Calculates and returns the vertical overlap between two arcade physics bodies.
 * 
 * We know the bodies are intersecting based on a previous check, so the point of this function
 * is to determine which face the overlap is occurring on and at what depth.
 *
 * @function Phaser.Physics.Arcade.GetOverlapY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {boolean} overlapOnly - Is this an overlap only check, or part of separation?
 * @param {number} bias - A value added to the delta values during collision checks. Increase it to prevent sprite tunneling (sprites passing through each other instead of colliding).
 *
 * @return {number[]} An array containing the amount of overlap in element 0 and the face of body1 in element 1 (true = bottom, false = top).
 */
var GetOverlapY = function (body1, body2, overlapOnly, bias)
{
    var overlap = 0;
    var maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + bias;

    var body1Immovable = (body1.physicsType === CONST.STATIC_BODY || body1.immovable);
    var body2Immovable = (body2.physicsType === CONST.STATIC_BODY || body2.immovable);

    var distance1 = body1.bottom - body2.y;
    var distance2 = body2.bottom - body1.y;

    var blocked1 = body1.blocked;
    var blocked2 = body2.blocked;

    var topFace = false;

    if (distance1 < distance2)
    {
        //  Less intersection between the bottom of body1 and the top of body2
        overlap = distance1;

        if ((overlap > maxOverlap && !overlapOnly) || !body1.checkCollision.down || !body2.checkCollision.up)
        {
            overlap = 0;
        }
        else
        {
            body1.setTouchingDown();
            body2.setTouchingUp();

            if (blocked2.down || body2Immovable)
            {
                body1.setBlockedDown(body2);
            }

            if (blocked1.up || body1Immovable)
            {
                body2.setBlockedUp(body1);
            }
        }
    }
    else
    {
        //  Less intersection between the top of body1 and the bottom of body2
        overlap = distance2;
        topFace = true;

        if ((overlap > maxOverlap && !overlapOnly) || !body1.checkCollision.up || !body2.checkCollision.down)
        {
            overlap = 0;
        }
        else
        {
            body1.setTouchingUp();
            body2.setTouchingDown();
            
            if (blocked2.up || body2Immovable)
            {
                body1.setBlockedUp(body2);
            }

            if (blocked1.down || body1Immovable)
            {
                body2.setBlockedDown(body1);
            }
        }
    }

    if (overlap > maxOverlap && !overlapOnly)
    {
        body1.embedded = true;
        body2.embedded = true;
    }

    //  Resets the overlapY to zero if there is no overlap, or to the actual pixel value if there is
    body1.overlapY = overlap;
    body2.overlapY = overlap;

    return [ overlap, topFace ];
};

module.exports = GetOverlapY;
