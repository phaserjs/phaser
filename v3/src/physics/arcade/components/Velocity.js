var Velocity = {

    setVelocity: function (x, y)
    {
        this.body.velocity.set(x, y);

        return this;
    },

    setVelocityX: function (x)
    {
        this.body.velocity.x = x;

        return this;
    },

    setVelocityY: function (y)
    {
        this.body.velocity.y = y;

        return this;
    },

    setMaxVelocity: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.body.maxVelocity.set(x, y);

        return this;
    }

};

module.exports = Velocity;
