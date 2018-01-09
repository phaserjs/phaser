var Body = require('../lib/body/Body');

var Static = {

    setStatic: function (value)
    {
        Body.setStatic(this.body, value);

        return this;
    },

    isStatic: function ()
    {
        return this.body.isStatic;
    }

};

module.exports = Static;
