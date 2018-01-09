var Friction = {

    setFrictionX: function (x)
    {
        this.friction.x = x;

        return this;
    },

    setFrictionY: function (y)
    {
        this.friction.y = y;

        return this;
    },

    setFriction: function (x, y)
    {
        this.friction.x = x;
        this.friction.y = y;

        return this;
    }

};

module.exports = Friction;
