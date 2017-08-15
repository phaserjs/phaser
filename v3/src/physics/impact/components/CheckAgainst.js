var TYPE = require('../TYPE');

var CheckAgainst = {

    setCheckAgainstNone: function ()
    {
        this.body.checkAgainst = TYPE.NONE;

        return this;
    },

    setCheckAgainstA: function ()
    {
        this.body.checkAgainst = TYPE.A;

        return this;
    },

    setCheckAgainstB: function ()
    {
        this.body.checkAgainst = TYPE.B;

        return this;
    },

    checkAgainst: {

        get: function ()
        {
            return this.body.checkAgainst;
        },

        set: function (value)
        {
            this.body.checkAgainst = value;
        }

    }

};

module.exports = CheckAgainst;
