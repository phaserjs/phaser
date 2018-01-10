var Sensor = {

    setSensor: function (value)
    {
        this.body.isSensor = value;

        return this;
    },

    isSensor: function ()
    {
        return this.body.isSensor;
    }

};

module.exports = Sensor;
