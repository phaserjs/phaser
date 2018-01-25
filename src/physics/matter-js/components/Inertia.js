var Body = require('../lib/body/Body');

var Inertia = {

    setInertia: function (value)
    {
        Body.setInertia(this.body, value);

        return this;
    },

    // Useful to prevent rotation on body, e.g. for player in a platformer
    setMaxInertia: function ()
    {
        Body.setInertia(this.body, Number.POSITIVE_INFINITY);

        return this;
    }
};

module.exports = Inertia;
