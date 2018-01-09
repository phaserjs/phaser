var Bounce = {

    setBounce: function (x, y)
    {
        this.body.bounce.set(x, y);

        return this;
    },

    setBounceX: function (value)
    {
        this.body.bounce.x = value;

        return this;
    },

    setBounceY: function (value)
    {
        this.body.bounce.y = value;

        return this;
    },

    setCollideWorldBounds: function (value)
    {
        this.body.collideWorldBounds = value;

        return this;
    }

};

module.exports = Bounce;
