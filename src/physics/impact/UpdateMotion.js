/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Set up the trace-result
 * var res = {
 *     collision: {x: false, y: false, slope: false},
 *     pos: {x: x, y: y},
 *     tile: {x: 0, y: 0}
 * };
 *
 * @function Phaser.Physics.Impact.UpdateMotion
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Impact.Body} body - [description]
 * @param {object} res - [description]
 */
var UpdateMotion = function (body, res)
{
    body.standing = false;

    //  Y
    if (res.collision.y)
    {
        if (body.bounciness > 0 && Math.abs(body.vel.y) > body.minBounceVelocity)
        {
            body.vel.y *= -body.bounciness;
        }
        else
        {
            if (body.vel.y > 0)
            {
                body.standing = true;
            }

            body.vel.y = 0;
        }
    }

    //  X
    if (res.collision.x)
    {
        if (body.bounciness > 0 && Math.abs(body.vel.x) > body.minBounceVelocity)
        {
            body.vel.x *= -body.bounciness;
        }
        else
        {
            body.vel.x = 0;
        }
    }

    //  SLOPE
    if (res.collision.slope)
    {
        var s = res.collision.slope;
       
        if (body.bounciness > 0)
        {
            var proj = body.vel.x * s.nx + body.vel.y * s.ny;

            body.vel.x = (body.vel.x - s.nx * proj * 2) * body.bounciness;
            body.vel.y = (body.vel.y - s.ny * proj * 2) * body.bounciness;
        }
        else
        {
            var lengthSquared = s.x * s.x + s.y * s.y;
            var dot = (body.vel.x * s.x + body.vel.y * s.y) / lengthSquared;
            
            body.vel.x = s.x * dot;
            body.vel.y = s.y * dot;
            
            var angle = Math.atan2(s.x, s.y);

            if (angle > body.slopeStanding.min && angle < body.slopeStanding.max)
            {
                body.standing = true;
            }
        }
    }

    body.pos.x = res.pos.x;
    body.pos.y = res.pos.y;
};

module.exports = UpdateMotion;
