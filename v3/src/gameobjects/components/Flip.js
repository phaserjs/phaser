var Flip = {

    flipX: false,
    flipY: false,

    toggleFlipX: function ()
    {
        this.flipX = !this.flipX;

        return this;
    },

    toggleFlipY: function (value)
    {
        this.flipY = !this.flipY;

        return this;
    },

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
