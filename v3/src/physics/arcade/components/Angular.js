var Angular = {

    setAngularVelocity: function (value)
    {
        this.body.angularVelocity = value;

        return this;
    },

    setAngularAcceleration: function (value)
    {
        this.body.angularAcceleration = value;

        return this;
    },

    setAngularDrag: function (value)
    {
        this.body.angularDrag = value;

        return this;
    }

};

module.exports = Angular;
