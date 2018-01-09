var Velocity = {

    setVelocityX: function (x)
    {
        this.vel.x = x;

        return this;
    },

    setVelocityY: function (y)
    {
        this.vel.y = y;

        return this;
    },

    setVelocity: function (x, y)
    {
        this.vel.x = x;
        this.vel.y = y;

        return this;
    },

    setMaxVelocity: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.maxVel.x = x;
        this.maxVel.y = y;

        return this;
    }

};

module.exports = Velocity;
