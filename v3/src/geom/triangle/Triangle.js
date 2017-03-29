// A triangle is a plane created by connecting three points.
// The first two arguments specify the first point, the middle two arguments
// specify the second point, and the last two arguments specify the third point.

var Triangle = function (x1, y1, x2, y2, x3, y3)
{
    this.x1 = 0;
    this.y1 = 0;

    this.x2 = 0;
    this.y2 = 0;

    this.x3 = 0;
    this.y3 = 0;

    this.setTo(x1, y1, x2, y2, x3, y3);
};

Triangle.prototype.constructor = Triangle;

Triangle.prototype = {

    setTo: function (x1, y1, x2, y2, x3, y3)
    {
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 0; }
        if (y2 === undefined) { y2 = 0; }
        if (x3 === undefined) { x3 = 0; }
        if (y3 === undefined) { y3 = 0; }

        this.x1 = x1;
        this.y1 = y1;

        this.x2 = x2;
        this.y2 = y2;

        this.x3 = x3;
        this.y3 = y3;

        return this;
    }

};

Object.defineProperties(Triangle.prototype, {

    left: {

        enumerable: true,

        get: function ()
        {
            return Math.min(this.x1, this.x2, this.x3);
        },

        set: function (value)
        {
            if (this.x1 <= this.x2)
            {
                this.x1 = value;
            }
            else
            {
                this.x2 = value;
            }
        }

    },

    right: {

        enumerable: true,

        get: function ()
        {
            return Math.max(this.x1, this.x2, this.x3);
        },

        set: function (value)
        {
            if (this.x1 > this.x2)
            {
                this.x1 = value;
            }
            else
            {
                this.x2 = value;
            }
        }

    },

    top: {

        enumerable: true,

        get: function ()
        {
            return Math.min(this.y1, this.y2, this.y3);
        },

        set: function (value)
        {
            if (this.y1 <= this.y2)
            {
                this.y1 = value;
            }
            else
            {
                this.y2 = value;
            }
        }

    },

    bottom: {

        enumerable: true,

        get: function ()
        {
            return Math.max(this.y1, this.y2, this.y3);
        },

        set: function (value)
        {
            if (this.y1 > this.y2)
            {
                this.y1 = value;
            }
            else
            {
                this.y2 = value;
            }
        }

    }

});

module.exports = Triangle;
