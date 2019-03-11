/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

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

    var distance1 = body1.bottom - body2.y;
    var distance2 = body2.bottom - body1.y;
    var topFace = false;

    if (distance1 < distance2)
    {
        //  Less intersection between the bottom of body1 and the top of body2
        overlap = distance1;

        if ((overlap > maxOverlap && !overlapOnly) || !body1.checkCollision.down || !body2.checkCollision.up)
        {
            overlap = 0;
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
    }

    //  Resets the overlapY to zero if there is no overlap, or to the actual pixel value if there is
    body1.overlapY = overlap;
    body2.overlapY = overlap;

    return [ overlap, topFace ];

    /*
    var body1Down = (body1.deltaY() > body2.deltaY());

    if (body1.deltaY() === body2.deltaY())
    {
        //  Neither of them has a faster velocity, but we still need to separate them,
        //  so try to figure it out based on overlap depth
        var distance1 = body1.bottom - body2.y;
        var distance2 = body2.bottom - body1.y;

        body1Down = (distance1 < distance2);
    }

    if (body1Down || body2.blocked.down)
    {
        //  body1 is moving down and body2 is either moving up, moving slower than body1, or static
        overlap = body1.bottom - body2.y;

        if ((overlap > maxOverlap && !overlapOnly) || !body1.checkCollision.down || !body2.checkCollision.up)
        {
            overlap = 0;
        }
    }
    else
    {
        //  body1 is moving up and body2 is either moving down, moving slower than body1, or static
        overlap = body1.y - body2.bottom;

        if ((-overlap > maxOverlap && !overlapOnly) || !body1.checkCollision.up || !body2.checkCollision.down)
        {
            overlap = 0;
        }
    }

    //  Resets the overlapY to zero if there is no overlap, or to the actual pixel value if there is
    body1.overlapY = overlap;
    body2.overlapY = overlap;

    return [ overlap, body1Down ];
    */
};

module.exports = GetOverlapY;
