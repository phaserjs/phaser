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
 * @function Phaser.Physics.Arcade.GetOverlapX
 * @since 3.17.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {boolean} [overlapOnly] - Is this an overlap only check, or part of separation?
 * @param {number} [bias] - A value added to the delta values during collision checks. Increase it to prevent sprite tunneling (sprites passing through each other instead of colliding).
 *
 * @return {CollisionInfo} A Collision Info object.
 */
var GetOverlapX = function (body1, body2, overlapOnly, bias)
{
    if (overlapOnly === undefined) { overlapOnly = false; }
    if (bias === undefined) { bias = 0; }

    var collisionInfo = CollisionInfo.get(body1, body2, overlapOnly, bias);

    if (!overlapOnly)
    {
        if (collisionInfo.face === CONST.FACING_LEFT)
        {
            // console.log('GetOverlapX leftFace');

            if (collisionInfo.body1 === body1)
            {
                body1.setTouchingLeft();
                body2.setTouchingRight();
    
                body1.setBlockedLeft(collisionInfo);
                body2.setBlockedRight(collisionInfo);

                if (body2.isWorldBlockedLeft())
                {
                    body1.setHardBlockedLeft();
                }
            }
        }
        else if (collisionInfo.face === CONST.FACING_RIGHT)
        {
            // console.log('GetOverlapX rightFace');

            if (collisionInfo.body1 === body1)
            {
                body1.setTouchingRight();
                body2.setTouchingLeft();

                body1.setBlockedRight(collisionInfo);
                body2.setBlockedLeft(collisionInfo);

                if (body2.isWorldBlockedRight())
                {
                    body1.setHardBlockedRight();
                }
            }
        }
    }

    return collisionInfo;
};

module.exports = GetOverlapX;
