var Friction = {

    setFriction: function (value, air, _static)
    {
        this.body.friction = value;

        if (air !== undefined)
        {
            this.body.frictionAir = air;
        }

        if (_static !== undefined)
        {
            this.body.frictionStatic = _static;
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
