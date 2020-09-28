/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetOverlapY = require('./GetOverlapY');
var ProcessY = require('./ProcessY');

/**
 * Separates two overlapping bodies on the Y-axis (vertically).
 *
 * Separation involves moving two overlapping bodies so they don't overlap anymore and adjusting their velocities based on their mass. This is a core part of collision detection.
 *
 * The bodies won't be separated if there is no vertical overlap between them, if they are static, or if either one uses custom logic for its separation.
 *
 * @function Phaser.Physics.Arcade.SeparateY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {boolean} overlapOnly - If `true`, the bodies will only have their overlap data set and no separation will take place.
 * @param {number} bias - A value to add to the delta value during overlap checking. Used to prevent sprite tunneling.
 *
 * @return {boolean} `true` if the two bodies overlap vertically, otherwise `false`.
 */
var SeparateY = function (body1, body2, overlapOnly, bias)
{
    var overlap = GetOverlapY(body1, body2, overlapOnly, bias);

    var body1Immovable = body1.immovable;
    var body2Immovable = body2.immovable;

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (overlapOnly || overlap === 0 || (body1Immovable && body2Immovable) || body1.customSeparateY || body2.customSeparateY)
    {
        //  return true if there was some overlap, otherwise false
        return (overlap !== 0) || (body1.embedded && body2.embedded);
    }

    var blockedState = ProcessY.Set(body1, body2, overlap);

    if (!body1Immovable && !body2Immovable)
    {
        if (blockedState > 0)
        {
            return true;
        }

        return ProcessY.Check();
    }
    else if (body1Immovable)
    {
        ProcessY.RunImmovableBody1(blockedState);
    }
    else if (body2Immovable)
    {
        ProcessY.RunImmovableBody2(blockedState);
    }

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};

module.exports = SeparateY;
