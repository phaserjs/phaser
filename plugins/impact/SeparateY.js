/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Physics.Impact.SeparateY
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Impact.World} world - [description]
 * @param {Phaser.Physics.Impact.Body} top - [description]
 * @param {Phaser.Physics.Impact.Body} bottom - [description]
 * @param {Phaser.Physics.Impact.Body} [weak] - [description]
 */
var SeparateY = function (world, top, bottom, weak)
{
    var nudge = (top.pos.y + top.size.y - bottom.pos.y);
    var nudgeX;
    var resTop;
    
    if (weak)
    {
        var strong = (top === weak) ? bottom : top;

        weak.vel.y = -weak.vel.y * weak.bounciness + strong.vel.y;
        
        // Riding on a platform?
        nudgeX = 0;

        if (weak === top && Math.abs(weak.vel.y - strong.vel.y) < weak.minBounceVelocity)
        {
            weak.standing = true;
            nudgeX = strong.vel.x * world.delta;
        }
        
        var resWeak = world.collisionMap.trace(weak.pos.x, weak.pos.y, nudgeX, weak === top ? -nudge : nudge, weak.size.x, weak.size.y);

        weak.pos.y = resWeak.pos.y;
        weak.pos.x = resWeak.pos.x;
    }
    else if (world.gravity && (bottom.standing || top.vel.y > 0))
    {
        resTop = world.collisionMap.trace(top.pos.x, top.pos.y, 0, -(top.pos.y + top.size.y - bottom.pos.y), top.size.x, top.size.y);

        top.pos.y = resTop.pos.y;
        
        if (top.bounciness > 0 && top.vel.y > top.minBounceVelocity)
        {
            top.vel.y *= -top.bounciness;
        }
        else
        {
            top.standing = true;
            top.vel.y = 0;
        }
    }
    else
    {
        var v2 = (top.vel.y - bottom.vel.y) / 2;

        top.vel.y = -v2;
        bottom.vel.y = v2;
        
        nudgeX = bottom.vel.x * world.delta;

        resTop = world.collisionMap.trace(top.pos.x, top.pos.y, nudgeX, -nudge / 2, top.size.x, top.size.y);

        top.pos.y = resTop.pos.y;
        
        var resBottom = world.collisionMap.trace(bottom.pos.x, bottom.pos.y, 0, nudge / 2, bottom.size.x, bottom.size.y);

        bottom.pos.y = resBottom.pos.y;
    }
};

module.exports = SeparateY;
