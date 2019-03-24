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
 * @function Phaser.Physics.Arcade.CheckOverlapX
 * @since 3.17.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 *
 * @return {boolean} 
 */
var CheckOverlapX = function (collisionInfo)
{
    collisionInfo = CollisionInfo.update(collisionInfo);

    var face = collisionInfo.face;
    var body1 = collisionInfo.body1;
    var body2 = collisionInfo.body2;

    if (face === CONST.FACING_LEFT)
    {
        // console.log('CheckOverlapX leftFace from', body.gameObject.name, 'body1 is', body1.gameObject.name, 'touching', collisionInfo.touching, 'inter', collisionInfo.intersects, 'oy', collisionInfo.overlapY);

        body1.setTouchingLeft();
        body2.setTouchingRight();

        body1.setBlockedLeft();
        body2.setBlockedRight();
    }
    else if (face === CONST.FACING_RIGHT)
    {
        // console.log('CheckOverlapX rightFace from', body.gameObject.name, 'body1 is', body1.gameObject.name);

        body1.setTouchingRight();
        body2.setTouchingLeft();

        body1.setBlockedRight();
        body2.setBlockedLeft();
    }

    if (body1.isWorldBlockedRight())
    {
        body2.setHardBlockedRight();
    }
    else if (body2.isWorldBlockedRight())
    {
        body1.setHardBlockedRight();
    }

    if (body1.isWorldBlockedLeft())
    {
        body2.setHardBlockedLeft();
    }
    else if (body2.isWorldBlockedLeft())
    {
        body1.setHardBlockedLeft();
    }

    return collisionInfo.touching;
};

module.exports = CheckOverlapX;
