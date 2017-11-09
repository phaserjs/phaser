var Friction = {

    setFriction: function (x, y)
    {
        this.body.friction.set(x, y);

        return this;
    },

    setFrictionX: function (x)
    {
        this.body.friction.x = x;

        return this;
    },

    setFrictionY: function (y)
    {
        this.body.friction.y = y;

        return this;
    }

};

module.exports = Friction;
