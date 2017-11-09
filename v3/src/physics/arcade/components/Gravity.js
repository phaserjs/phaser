var Gravity = {

    setGravity: function (x, y)
    {
        this.body.gravity.set(x, y);

        return this;
    },

    setGravityX: function (x)
    {
        this.body.gravity.x = x;

        return this;
    },

    setGravityY: function (y)
    {
        this.body.gravity.y = y;

        return this;
    }

};

module.exports = Gravity;
