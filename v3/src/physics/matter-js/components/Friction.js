var Friction = {

    setFriction: function (value)
    {
        this.body.friction = value;

        return this;
    },

    setFrictionAir: function (value)
    {
        this.body.frictionAir = value;

        return this;
    },

    setFrictionStatic: function (value)
    {
        this.body.frictionStatic = value;

        return this;
    }

};

module.exports = Friction;
