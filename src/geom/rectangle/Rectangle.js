var Class = require('../../utils/Class');
var Contains = require('./Contains');
var GetPoint = require('./GetPoint');
var GetPoints = require('./GetPoints');
var Random = require('./Random');

//  Encapsulates a 2D rectangle defined by its corner point in the top-left
//  and its extends in x (width) and y (height)

var Rectangle = new Class({

    initialize:

    function Rectangle (x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = 0; }

        this.x = x;

        this.y = y;

        this.width = width;

        this.height = height;
    },

    contains: function (x, y)
    {
        return Contains(this, x, y);
    },

    getPoint: function (position, output)
    {
        return GetPoint(this, position, output);
    },

    getPoints: function (quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    },

    getRandomPoint: function (point)
    {
        return Random(this, point);
    },

    setTo: function (x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;
    },

    setEmpty: function ()
    {
        return this.setTo(0, 0, 0, 0);
    },

    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    setSize: function (width, height)
    {
        if (height === undefined) { height = width; }

        this.width = width;
        this.height = height;

        return this;
    },

    isEmpty: function ()
    {
        return (this.width <= 0 || this.height <= 0);
    },

    //  TOP
    getLineA: function ()
    {
        return { x1: this.x, y1: this.y, x2: this.right, y2: this.y };
    },

    //  RIGHT
    getLineB: function ()
    {
        return { x1: this.right, y1: this.y, x2: this.right, y2: this.bottom };
    },

    //  BOTTOM
    getLineC: function ()
    {
        return { x1: this.right, y1: this.bottom, x2: this.x, y2: this.bottom };
    },

    //  LEFT
    getLineD: function ()
    {
        return { x1: this.x, y1: this.bottom, x2: this.x, y2: this.y };
    },

    left: {

        get: function ()
        {
            return this.x;
        },

        set: function (value)
        {
            if (value >= this.right)
            {
                this.width = 0;
            }
            else
            {
                this.width = this.right - value;
            }

            this.x = value;
        }

    },

    right: {

        get: function ()
        {
            return this.x + this.width;
        },

        set: function (value)
        {
            if (value <= this.x)
            {
                this.width = 0;
            }
            else
            {
                this.width = value - this.x;
            }
        }

    },

    top: {

        get: function ()
        {
            return this.y;
        },

        set: function (value)
        {
            if (value >= this.bottom)
            {
                this.height = 0;
                this.y = value;
            }
            else
            {
                this.height = (this.bottom - value);
            }
        }

    },

    bottom: {

        get: function ()
        {
            return this.y + this.height;
        },

        set: function (value)
        {
            if (value <= this.y)
            {
                this.height = 0;
            }
            else
            {
                this.height = value - this.y;
            }
        }

    },

    centerX: {

        get: function ()
        {
            return this.x + (this.width / 2);
        },

        set: function (value)
        {
            this.x = value - (this.width / 2);
        }

    },

    centerY: {

        get: function ()
        {
            return this.y + (this.height / 2);
        },

        set: function (value)
        {
            this.y = value - (this.height / 2);
        }

    }

});

module.exports = Rectangle;
