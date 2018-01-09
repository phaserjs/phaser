var Bounce = {

    setBounce: function (value)
    {
        this.body.bounciness = value;

        return this;
    },

    setMinBounceVelocity: function (value)
    {
        this.body.minBounceVelocity = value;

        return this;
    },

    bounce: {

        get: function ()
        {
            return this.body.bounciness;
        },

        set: function (value)
        {
            this.body.bounciness = value;
        }

    }

};

module.exports = Bounce;
