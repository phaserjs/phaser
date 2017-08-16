var Debug = {

    setDebug: function (value, color)
    {
        this.body.debugShow = value;

        if (value && color !== undefined)
        {
            this.body.debugColor = color;
        }

        return this;
    },

    setDebugColor: function (value)
    {
        this.body.debugColor = value;

        return this;
    },

    debugShow: {

        get: function ()
        {
            return this.body.debugShow;
        },

        set: function (value)
        {
            this.body.debugShow = value;
        }

    },

    debugColor: {

        get: function ()
        {
            return this.body.debugColor;
        },

        set: function (value)
        {
            this.body.debugColor = value;
        }

    }

};

module.exports = Debug;
