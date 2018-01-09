var ComputeVelocity = function (axis, body, velocity, acceleration, drag, max)
{
    if (max === undefined) { max = 10000; }

    if (axis === 1 && body.allowGravity)
    {
        velocity += (this.gravity.x + body.gravity.x) * this.delta;
    }
    else if (axis === 2 && body.allowGravity)
    {
        velocity += (this.gravity.y + body.gravity.y) * this.delta;
    }

    if (acceleration)
    {
        velocity += acceleration * this.delta;
    }
    else if (drag && body.allowDrag)
    {
        drag *= this.delta;

        if (velocity - drag > 0)
        {
            velocity -= drag;
        }
        else if (velocity + drag < 0)
        {
            velocity += drag;
        }
        else
        {
            velocity = 0;
        }
    }

    if (velocity > max)
    {
        velocity = max;
    }
    else if (velocity < -max)
    {
        velocity = -max;
    }

    return velocity;
};

module.exports = ComputeVelocity;
