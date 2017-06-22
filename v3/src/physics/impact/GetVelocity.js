var Clamp = require('../../math/Clamp');

var GetVelocity = function (delta, vel, accel, friction, max)
{
    if (accel)
    {
        return Clamp(vel + accel * delta, -max, max);
    }
    else if (friction)
    {
        var frictionDelta = friction * delta;
        
        if (vel - frictionDelta > 0)
        {
            return vel - frictionDelta;
        }
        else if (vel + frictionDelta < 0)
        {
            return vel + frictionDelta;
        }
        else
        {
            return 0;
        }
    }

    return Clamp(vel, -max, max);
};

module.exports = GetVelocity;
