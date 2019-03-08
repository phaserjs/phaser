/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Calculates and returns the vertical overlap between two arcade physics bodies.
 *
 * @function Phaser.Physics.Arcade.GetOverlapY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {boolean} overlapOnly - Is this an overlap only check, or part of separation?
 * @param {number} bias - A value added to the delta values during collision checks. Increase it to prevent sprite tunneling (sprites passing through each other instead of colliding).
 *
 * @return {number} The amount of overlap.
 */
var GetOverlapY = function (body1, body2, overlapOnly, bias)
{
    var overlap = 0;
    var maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + bias;

    var body1Down = (body1._dy > body2._dy);

    if (body1._dy === body2._dy)
    {
        //  Neither of them has a faster velocity, but we still need to separate them

        //  Try to figure it out based on overlap size
        var distance1 = body1.bottom - body2.y;
        var distance2 = body2.bottom - body1.y;

        body1Down = (distance1 < distance2);
    }

    if (body1Down)
    {
        //  body1 is moving down and body2 is either moving up, moving slower than body1, or static
        overlap = body1.bottom - body2.y;

        if ((overlap > maxOverlap && !overlapOnly) || body1.checkCollision.down === false || body2.checkCollision.up === false)
        {
            overlap = 0;
        }
    }
    else
    {
        //  body1 is moving up and body2 is either moving down, moving slower than body1, or static
        overlap = body1.y - body2.bottom;

        // console.log('body1 faster up', overlap);

        if ((-overlap > maxOverlap && !overlapOnly) || body1.checkCollision.up === false || body2.checkCollision.down === false)
        {
            overlap = 0;
        }
    }

    //  Resets the overlapY to zero if there is no overlap, or to the actual pixel value if there is
    body1.overlapY = overlap;
    body2.overlapY = overlap;

    return overlap;
};

module.exports = GetOverlapY;
