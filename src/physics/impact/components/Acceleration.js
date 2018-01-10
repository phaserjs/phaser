var Acceleration = {

    setAccelerationX: function (x)
    {
        this.accel.x = x;

        return this;
    },

    setAccelerationY: function (y)
    {
        this.accel.y = y;

        return this;
    },

    setAcceleration: function (x, y)
    {
        this.accel.x = x;
        this.accel.y = y;

        return this;
    }

};

module.exports = Acceleration;
