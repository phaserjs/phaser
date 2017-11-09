var Debug = {

    setDebug: function (showBody, showVelocity, bodyColor)
    {
        this.debugShowBody = showBody;
        this.debugShowVelocity = showVelocity;
        this.debugBodyColor = bodyColor;

        return this;
    },

    setDebugBodyColor: function (value)
    {
        this.body.debugBodyColor = value;

        return this;
    },

    debugShowBody: {

        get: function ()
        {
            return this.body.debugShowBody;
        },

        set: function (value)
        {
            this.body.debugShowBody = value;
        }

    },

    debugShowVelocity: {

        get: function ()
        {
            return this.body.debugShowVelocity;
        },

        set: function (value)
        {
            this.body.debugShowVelocity = value;
        }

    },

    debugBodyColor: {

        get: function ()
        {
            return this.body.debugBodyColor;
        },

        set: function (value)
        {
            this.body.debugBodyColor = value;
        }

    }

};

module.exports = Debug;
