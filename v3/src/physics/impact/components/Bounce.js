var Bounce = {

    setBounce: function (value)
    {
        this.body.bounciness = value;

        return this;
    },

    bounciness: {

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
