/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Physics.Arcade.GetOverlapY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - [description]
 * @param {Phaser.Physics.Arcade.Body} body2 - [description]
 * @param {boolean} overlapOnly - [description]
 * @param {number} bias - [description]
 *
 * @return {number} [description]
 */
var GetOverlapY = function (body1, body2, overlapOnly, bias)
{
    var overlap = 0;
    var maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + bias;

    if (body1.deltaY() === 0 && body2.deltaY() === 0)
    {
        //  They overlap but neither of them are moving
        body1.embedded = true;
        body2.embedded = true;
    }
    else if (body1.deltaY() > body2.deltaY())
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
        }
    }
    else if (body1.deltaY() < body2.deltaY())
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
        }
    }

    //  Resets the overlapY to zero if there is no overlap, or to the actual pixel value if there is
    body1.overlapY = overlap;
    body2.overlapY = overlap;

    return overlap;
};

module.exports = GetOverlapY;
