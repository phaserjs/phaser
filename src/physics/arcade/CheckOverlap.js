/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CollisionInfo = require('./CollisionInfo');
var CONST = require('./const');

/**
 * Takes a CollisionInfo object and tests to see if the two bodies are still intersecting / touching.
 *
 * @function Phaser.Physics.Arcade.CheckOverlap
 * @since 3.17.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 *
 * @return {boolean} 
 */
var CheckOverlap = function (collisionInfo)
{
    collisionInfo = CollisionInfo.update(collisionInfo);

    var face = collisionInfo.face;
    var body1 = collisionInfo.body1;
    var body2 = collisionInfo.body2;

    switch (face)
    {
        case CONST.FACING_LEFT:
            body1.setTouchingLeft();
            body2.setTouchingRight();
            body1.setBlockedLeft();
            body2.setBlockedRight();
            break;

        case CONST.FACING_RIGHT:
            body1.setTouchingRight();
            body2.setTouchingLeft();
            body1.setBlockedRight();
            body2.setBlockedLeft();
            break;

        case CONST.FACING_UP:
            body1.setTouchingUp();
            body2.setTouchingDown();
            body1.setBlockedUp();
            body2.setBlockedDown();
            break;

        case CONST.FACING_DOWN:
            body1.setTouchingDown();
            body2.setTouchingUp();
            body1.setBlockedDown();
            body2.setBlockedUp();
            break;
    }

    if (body1.isWorldBlockedLeft())
    {
        body2.setHardBlockedLeft();
    }
    else if (body2.isWorldBlockedLeft())
    {
        body1.setHardBlockedLeft();
    }

    if (body1.isWorldBlockedRight())
    {
        body2.setHardBlockedRight();
    }
    else if (body2.isWorldBlockedRight())
    {
        body1.setHardBlockedRight();
    }

    if (body1.isWorldBlockedUp())
    {
        body2.setHardBlockedUp();
    }
    else if (body2.isWorldBlockedUp())
    {
        body1.setHardBlockedUp();
    }

    if (body1.isWorldBlockedDown())
    {
        body2.setHardBlockedDown();
    }
    else if (body2.isWorldBlockedDown())
    {
        body1.setHardBlockedDown();
    }

    return collisionInfo.touching;
};

module.exports = CheckOverlap;
