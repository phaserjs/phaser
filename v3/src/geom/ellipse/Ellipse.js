var Class = require('../../utils/Class');
var Random = require('./Random');

var Ellipse = new Class({

    initialize:

    function Ellipse (x, y, width, height)
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

    //  AKA Semi Minor Axis
    getMinorRadius: function ()
    {
        return Math.min(this.width, this.height) / 2;
    },

    //  AKA Semi Major Axis
    getMajorRadius: function ()
    {
        return Math.max(this.width, this.height) / 2;
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

    }

});

module.exports = Ellipse;
