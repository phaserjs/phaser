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

    // console.log('');
    // console.log('%c CheckOverlap ' + body1.world._frame + '                                                                                     ', 'background-color: pink');
    // collisionInfo.dump();

    switch (face)
    {
        case CONST.FACING_LEFT:

            body1.setTouchingLeft();
            body2.setTouchingRight();

            body1.setBlockedLeft();
            body2.setBlockedRight();

            if (body1.isWorldBlockedRight())
            {
                body2.setHardBlockedRight();
            }
            
            if (body2.isWorldBlockedLeft())
            {
                body1.setHardBlockedLeft();
            }

            break;

        case CONST.FACING_RIGHT:

            body1.setTouchingRight();
            body2.setTouchingLeft();

            body1.setBlockedRight();
            body2.setBlockedLeft();

            if (body1.isWorldBlockedLeft())
            {
                body2.setHardBlockedLeft();
            }
            
            if (body2.isWorldBlockedRight())
            {
                body1.setHardBlockedRight();
            }

            break;

        case CONST.FACING_UP:

            body1.setTouchingUp();
            body2.setTouchingDown();

            body1.setBlockedUp();
            body2.setBlockedDown();

            if (body1.isWorldBlockedDown())
            {
                body2.setHardBlockedDown();
            }

            if (body2.isWorldBlockedUp())
            {
                body1.setHardBlockedUp();
            }

            break;

        case CONST.FACING_DOWN:

            body1.setTouchingDown();
            body2.setTouchingUp();

            body1.setBlockedDown();
            body2.setBlockedUp();

            if (body1.isWorldBlockedUp())
            {
                body2.setHardBlockedUp();
            }

            if (body2.isWorldBlockedDown())
            {
                body1.setHardBlockedDown();
            }

            break;
    }

    return collisionInfo.touching;
};

module.exports = CheckOverlap;
