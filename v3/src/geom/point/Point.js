var Point = function (x, y)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }

    this.x = x;

    this.y = y;
};

Point.prototype.constructor = Point;

Point.prototype = {

    setTo: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    }

};

Object.defineProperties(Point.prototype, {

    left: {

        enumerable: true,

        get: function ()
        {
            return this.x;
        },

        set: function (value)
        {
            this.x = value;
        }

    },

    right: {

        enumerable: true,

        get: function ()
        {
            return this.x;
        },

        set: function (value)
        {
            this.x = value;
        }

    },

    top: {

        enumerable: true,

        get: function ()
        {
            return this.y;
        },

        set: function (value)
        {
            this.y = value;
        }

    },

    bottom: {

        enumerable: true,

        get: function ()
        {
            return this.y;
        },

        set: function (value)
        {
            this.y = value;
        }

    }

});

module.exports = Point;
