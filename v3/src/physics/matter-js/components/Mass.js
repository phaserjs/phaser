var Body = require('../lib/body/Body');

var Mass = {

    setMass: function (value)
    {
        Body.setMass(this.body, value);

        return this;
    },

    setDensity: function (value)
    {
        Body.setDensity(this.body, value);

        return this;
    }

};

module.exports = Mass;
