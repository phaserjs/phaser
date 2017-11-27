var Friction = {

    setFriction: function (value, air, static)
    {
        this.body.friction = value;

        if (air !== undefined)
        {
            this.body.frictionAir = air;
        }

        if (static !== undefined)
        {
            this.body.frictionStatic = static;
        }

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
