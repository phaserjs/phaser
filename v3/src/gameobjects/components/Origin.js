//  Origin Component
//  Values are normalized, given in the range 0 to 1.
//  Display values contain the calculated pixel values.

var Origin = {

    originX: 0.5,
    originY: 0.5,

    displayOriginX: {

        get: function ()
        {
            return Math.round((this.width * this.originX) * this.scaleX);
        },

        set: function (value)
        {
            this.originX = this.width / value;
        }

    },

    displayOriginY: {

        get: function ()
        {
            return Math.round((this.height * this.originY) * this.scaleY);
        },

        set: function (value)
        {
            this.originY = this.height / value;
        }

    },

    setOrigin: function (x, y)
    {
        if (x === undefined) { x = 0.5; }
        if (y === undefined) { y = x; }

        this.originX = x;
        this.originY = y;

        return this;
    },

    setDisplayOrigin: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.displayOriginX = x;
        this.displayOriginY = y;

        return this;
    }

};

module.exports = Origin;
