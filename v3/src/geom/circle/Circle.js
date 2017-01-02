var Circle = function (x, y, radius)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (radius === undefined) { radius = 0; }

    this.x = x;

    this.y = y;

    this._radius = radius;
    this._diameter = radius * 2;
};

Circle.prototype.constructor = Circle;

Circle.prototype = {

    setTo: function (x, y, radius)
    {
        this.x = x;
        this.y = y;
        this._radius = radius;
        this._diameter = radius * 2;

        return this;
    },

    setEmpty: function ()
    {
        return this.setTo(0, 0, 0);
    },

    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    isEmpty: function ()
    {
        return (this._radius <= 0);
    }

};

Object.defineProperties(Circle.prototype, {

    radius: {

        enumerable: true,

        get: function ()
        {
            return this._radius;
        },

        set: function (value)
        {
            this._radius = value;
            this._diameter = value * 2;
        }

    },

    diameter: {

        enumerable: true,

        get: function ()
        {
            return this._diameter;
        },

        set: function (value)
        {
            this._diameter = value;
            this._radius = value * 0.5;
        }

    },

    left: {

        enumerable: true,

        get: function ()
        {
            return this.x - this._radius;
        },

        set: function (value)
        {
            this.x = value + this._radius;
        }

    },

    right: {

        enumerable: true,

        get: function ()
        {
            return this.x + this._radius;
        },

        set: function (value)
        {
            this.x = value - this._radius;
        }

    },

    top: {

        enumerable: true,

        get: function ()
        {
            return this.y - this._radius;
        },

        set: function (value)
        {
            this.y = value + this._radius;
        }

    },

    bottom: {

        enumerable: true,

        get: function ()
        {
            return this.y + this._radius;
        },

        set: function (value)
        {
            this.y = value - this._radius;
        }

    }

});

module.exports = Circle;
