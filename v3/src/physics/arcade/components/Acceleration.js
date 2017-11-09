var Acceleration = {

    setAcceleration: function (x, y)
    {
        this.body.acceleration.set(x, y);

        return this;
    },

    setAccelerationX: function (value)
    {
        this.body.acceleration.x = value;

        return this;
    },

    setAccelerationY: function (value)
    {
        this.body.acceleration.y = value;

        return this;
    }

};

module.exports = Acceleration;
