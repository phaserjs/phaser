var Bounce = {

    setBounce: function (value)
    {
        this.body.restitution = value;

        return this;
    }

};

module.exports = Bounce;
