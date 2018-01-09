var DistanceBetween = require('../../../math/distance/DistanceBetween');
var GetOverlapX = require('./GetOverlapX');
var GetOverlapY = require('./GetOverlapY');
var PhysicsEvent = require('../events');

var SeparateCircle = function (body1, body2, overlapOnly, bias)
{
    //  Set the bounding box overlap values into the bodies themselves (hence we don't use the return values here)
    GetOverlapX(body1, body2, false, bias);
    GetOverlapY(body1, body2, false, bias);

    var dx = body2.center.x - body1.center.x;
    var dy = body2.center.y - body1.center.y;

    var angleCollision = Math.atan2(dy, dx);

    var overlap = 0;

    if (body1.isCircle !== body2.isCircle)
    {
        var rect = {
            x: (body2.isCircle) ? body1.position.x : body2.position.x,
            y: (body2.isCircle) ? body1.position.y : body2.position.y,
            right: (body2.isCircle) ? body1.right : body2.right,
            bottom: (body2.isCircle) ? body1.bottom : body2.bottom
        };

        var circle = {
            x: (body1.isCircle) ? body1.center.x : body2.center.x,
            y: (body1.isCircle) ? body1.center.y : body2.center.y,
            radius: (body1.isCircle) ? body1.halfWidth : body2.halfWidth
        };

        if (circle.y < rect.y)
        {
            if (circle.x < rect.x)
            {
                overlap = DistanceBetween(circle.x, circle.y, rect.x, rect.y) - circle.radius;
            }
            else if (circle.x > rect.right)
            {
                overlap = DistanceBetween(circle.x, circle.y, rect.right, rect.y) - circle.radius;
            }
        }
        else if (circle.y > rect.bottom)
        {
            if (circle.x < rect.x)
            {
                overlap = DistanceBetween(circle.x, circle.y, rect.x, rect.bottom) - circle.radius;
            }
            else if (circle.x > rect.right)
            {
                overlap = DistanceBetween(circle.x, circle.y, rect.right, rect.bottom) - circle.radius;
            }
        }

        overlap *= -1;
    }
    else
    {
        overlap = (body1.halfWidth + body2.halfWidth) - DistanceBetween(body1.center.x, body1.center.y, body2.center.x, body2.center.y);
    }

    //  Can't separate two immovable bodies, or a body with its own custom separation logic
    if (overlapOnly || overlap === 0 || (body1.immovable && body2.immovable) || body1.customSeparateX || body2.customSeparateX)
    {
        if (overlap !== 0 && (body1.onOverlap || body2.onOverlap))
        {
            this.events.dispatch(new PhysicsEvent.OVERLAP(body1.gameObject, body2.gameObject));
        }

        //  return true if there was some overlap, otherwise false
        return (overlap !== 0);
    }

    // Transform the velocity vector to the coordinate system oriented along the direction of impact.
    // This is done to eliminate the vertical component of the velocity

    var b1vx = body1.velocity.x;
    var b1vy = body1.velocity.y;
    var b1mass = body1.mass;

    var b2vx = body2.velocity.x;
    var b2vy = body2.velocity.y;
    var b2mass = body2.mass;

    var v1 = {
        x: b1vx * Math.cos(angleCollision) + b1vy * Math.sin(angleCollision),
        y: b1vx * Math.sin(angleCollision) - b1vy * Math.cos(angleCollision)
    };

    var v2 = {
        x: b2vx * Math.cos(angleCollision) + b2vy * Math.sin(angleCollision),
        y: b2vx * Math.sin(angleCollision) - b2vy * Math.cos(angleCollision)
    };

    // We expect the new velocity after impact
    var tempVel1 = ((b1mass - b2mass) * v1.x + 2 * b2mass * v2.x) / (b1mass + b2mass);
    var tempVel2 = (2 * b1mass * v1.x + (b2mass - b1mass) * v2.x) / (b1mass + b2mass);

    // We convert the vector to the original coordinate system and multiplied by factor of rebound
    if (!body1.immovable)
    {
        body1.velocity.x = (tempVel1 * Math.cos(angleCollision) - v1.y * Math.sin(angleCollision)) * body1.bounce.x;
        body1.velocity.y = (v1.y * Math.cos(angleCollision) + tempVel1 * Math.sin(angleCollision)) * body1.bounce.y;

        //  Reset local var
        b1vx = body1.velocity.x;
        b1vy = body1.velocity.y;
    }

    if (!body2.immovable)
    {
        body2.velocity.x = (tempVel2 * Math.cos(angleCollision) - v2.y * Math.sin(angleCollision)) * body2.bounce.x;
        body2.velocity.y = (v2.y * Math.cos(angleCollision) + tempVel2 * Math.sin(angleCollision)) * body2.bounce.y;

        //  Reset local var
        b2vx = body2.velocity.x;
        b2vy = body2.velocity.y;
    }

    // When the collision angle is almost perpendicular to the total initial velocity vector
    // (collision on a tangent) vector direction can be determined incorrectly.
    // This code fixes the problem

    if (Math.abs(angleCollision) < Math.PI / 2)
    {
        if ((b1vx > 0) && !body1.immovable && (b2vx > b1vx))
        {
            body1.velocity.x *= -1;
        }
        else if ((b2vx < 0) && !body2.immovable && (b1vx < b2vx))
        {
            body2.velocity.x *= -1;
        }
        else if ((b1vy > 0) && !body1.immovable && (b2vy > b1vy))
        {
            body1.velocity.y *= -1;
        }
        else if ((b2vy < 0) && !body2.immovable && (b1vy < b2vy))
        {
            body2.velocity.y *= -1;
        }
    }
    else if (Math.abs(angleCollision) > Math.PI / 2)
    {
        if ((b1vx < 0) && !body1.immovable && (b2vx < b1vx))
        {
            body1.velocity.x *= -1;
        }
        else if ((b2vx > 0) && !body2.immovable && (b1vx > b2vx))
        {
            body2.velocity.x *= -1;
        }
        else if ((b1vy < 0) && !body1.immovable && (b2vy < b1vy))
        {
            body1.velocity.y *= -1;
        }
        else if ((b2vy > 0) && !body2.immovable && (b1vx > b2vy))
        {
            body2.velocity.y *= -1;
        }
    }

    if (!body1.immovable)
    {
        body1.x += (body1.velocity.x * this.delta) - overlap * Math.cos(angleCollision);
        body1.y += (body1.velocity.y * this.delta) - overlap * Math.sin(angleCollision);
    }

    if (!body2.immovable)
    {
        body2.x += (body2.velocity.x * this.delta) + overlap * Math.cos(angleCollision);
        body2.y += (body2.velocity.y * this.delta) + overlap * Math.sin(angleCollision);
    }

    if (body1.onCollide || body2.onCollide)
    {
        this.events.dispatch(new PhysicsEvent.COLLIDE(body1.gameObject, body2.gameObject));
    }

    return true;
};

module.exports = SeparateCircle;
