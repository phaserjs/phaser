var Clamp = require('../../math/Clamp');

var UpdateVelocity = function (body, delta)
{
    var vel = body.vel.x;
    var accel = body.accel.x;
    var friction = body.friction.x;
    var max = body.maxVel.x;
    var frictionDelta;

    //  X
    if (accel)
    {
        body.vel.x = Clamp(vel + accel * delta, -max, max);
    }
    else if (friction)
    {
        frictionDelta = friction * delta;
        
        if (vel - frictionDelta > 0)
        {
            body.vel.x = vel - frictionDelta;
        }
        else if (vel + frictionDelta < 0)
        {
            body.vel.x = vel + frictionDelta;
        }
        else
        {
            body.vel.x = 0;
        }
    }
    else
    {
        body.vel.x = Clamp(vel, -max, max);
    }
    
    vel = body.vel.y;
    accel = body.accel.y;
    friction = body.friction.y;
    max = body.maxVel.y;

    //  Y
    if (accel)
    {
        body.vel.y = Clamp(vel + accel * delta, -max, max);
    }
    else if (friction)
    {
        frictionDelta = friction * delta;
        
        if (vel - frictionDelta > 0)
        {
            body.vel.y = vel - frictionDelta;
        }
        else if (vel + frictionDelta < 0)
        {
            body.vel.y = vel + frictionDelta;
        }
        else
        {
            body.vel.y = 0;
        }
    }
    else
    {
        body.vel.y = Clamp(vel, -max, max);
    }

    return body;
};

module.exports = UpdateVelocity;
