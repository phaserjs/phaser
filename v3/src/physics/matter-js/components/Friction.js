var Friction = {

    setFriction: function (value, air, fstatic)
    {
        this.body.friction = value;

        if (air !== undefined)
        {
            this.body.frictionAir = air;
        }

        if (fstatic !== undefined)
        {
            this.body.frictionStatic = fstatic;
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
