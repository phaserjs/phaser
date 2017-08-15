var TYPE = require('../TYPE');

var BodyType = {

    getBodyType: function ()
    {
        return this.body.type;
    },

    setTypeNone: function ()
    {
        this.body.type = TYPE.NONE;

        return this;
    },

    setTypeA: function ()
    {
        this.body.type = TYPE.A;

        return this;
    },

    setTypeB: function ()
    {
        this.body.type = TYPE.B;

        return this;
    }

};

module.exports = BodyType;
