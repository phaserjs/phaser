var UpdateMotion = function (body)
{
    if (body.allowRotation)
    {
        var velocityDelta = this.computeVelocity(0, body, body.angularVelocity, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity;

        body.angularVelocity += velocityDelta;
        body.rotation += (body.angularVelocity * this.delta);
    }

    body.velocity.x = this.computeVelocity(1, body, body.velocity.x, body.acceleration.x, body.drag.x, body.maxVelocity.x);
    body.velocity.y = this.computeVelocity(2, body, body.velocity.y, body.acceleration.y, body.drag.y, body.maxVelocity.y);
};

module.exports = UpdateMotion;
