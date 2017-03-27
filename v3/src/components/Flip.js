var Flip = {

    flipX: false,
    flipY: false,

    setFlipX: function (value)
    {
        this.flipX = value;

        return this;
    },

    setFlipY: function (value)
    {
        this.flipX = value;

        return this;
    },

    setFlip: function (x, y)
    {
        this.flipX = x;
        this.flipY = y;

        return this;
    },

    resetFlip: function ()
    {
        this.flipX = false;
        this.flipY = false;
    }

};

module.exports = Flip;
