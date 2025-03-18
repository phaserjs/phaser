/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetOverlapX = require('./GetOverlapX');
var ProcessX = require('./ProcessX');

/**
 * Separates two overlapping bodies on the X-axis (horizontally).
 *
 * Separation involves moving two overlapping bodies so they don't overlap anymore and adjusting their velocities based on their mass. This is a core part of collision detection.
 *
 * The bodies won't be separated if there is no horizontal overlap between them, if they are static, or if either one uses custom logic for its separation.
 *
 * @function Phaser.Physics.Arcade.SeparateX
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {boolean} overlapOnly - If `true`, the bodies will only have their overlap data set and no separation will take place.
 * @param {number} bias - A value to add to the delta value during overlap checking. Used to prevent sprite tunneling.
 * @param {number} [overlap] - If given then this value will be used as the overlap and no check will be run.
 *
 * @return {boolean} `true` if the two bodies overlap vertically, otherwise `false`.
 */
var SeparateX = function (body1, body2, overlapOnly, bias, overlap)
{
    if (overlap === undefined) { overlap = GetOverlapX(body1, body2, overlapOnly, bias); }

    var body1Immovable = body1.immovable;
    var body2Immovable = body2.immovable;

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (overlapOnly || overlap === 0 || (body1Immovable && body2Immovable) || body1.customSeparateX || body2.customSeparateX)
    {
        //  return true if there was some overlap, otherwise false
        return (overlap !== 0) || (body1.embedded && body2.embedded);
    }

    var blockedState = ProcessX.Set(body1, body2, overlap);

    if (!body1Immovable && !body2Immovable)
    {
        if (blockedState > 0)
        {
            return true;
        }

        return ProcessX.Check();
    }
    else if (body1Immovable)
    {
        ProcessX.RunImmovableBody1(blockedState);
    }
    else if (body2Immovable)
    {
        ProcessX.RunImmovableBody2(blockedState);
    }

    //  If we got this far then there WAS overlap, and separation is complete, so return true
    return true;
};

module.exports = SeparateX;
