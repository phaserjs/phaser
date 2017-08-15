var Gravity = {

    setGravity: function (value)
    {
        this.body.gravityFactor = value;

        return this;
    },

    gravity: {

        get: function ()
        {
            return this.body.gravityFactor;
        },

        set: function (value)
        {
            this.body.gravityFactor = value;
        }

    }

};

module.exports = Gravity;
