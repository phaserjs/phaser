/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CollisionInfo = require('./CollisionInfo');
var CONST = require('./const');

/**
 * 
 *
 * @function Phaser.Physics.Arcade.GetOverlapY
 * @since 3.17.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {boolean} [overlapOnly] - Is this an overlap only check, or part of separation?
 * @param {number} [bias] - A value added to the delta values during collision checks. Increase it to prevent sprite tunneling (sprites passing through each other instead of colliding).
 *
 * @return {CollisionInfo} A Collision Info object.
 */
var GetOverlapY = function (body1, body2, overlapOnly, bias)
{
    if (overlapOnly === undefined) { overlapOnly = false; }
    if (bias === undefined) { bias = 0; }

    var collisionInfo = CollisionInfo.get(body1, body2, overlapOnly, bias);

    if (!overlapOnly)
    {
        if (collisionInfo.face === CONST.FACING_UP)
        {
            console.log('GetOverlapY topFace');

            if (collisionInfo.body1 === body1)
            {
                body1.setTouchingUp();
                body2.setTouchingDown();
    
                body1.setBlockedUp(collisionInfo);
                body2.setBlockedDown(collisionInfo);

                if (body2.isWorldBlockedUp())
                {
                    body1.setHardBlockedUp();
                }
            }
        }
        else if (collisionInfo.face === CONST.FACING_DOWN)
        {
            console.log('GetOverlapY bottomFace');

            if (collisionInfo.body1 === body1)
            {
                body1.setTouchingDown();
                body2.setTouchingUp();

                body1.setBlockedDown(collisionInfo);
                body2.setBlockedUp(collisionInfo);

                if (body2.isWorldBlockedDown())
                {
                    body1.setHardBlockedDown();
                }
            }
        }
    }

    return collisionInfo;
};

module.exports = GetOverlapY;
