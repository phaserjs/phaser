var Class = require('../../utils/Class');
var Contains = require('./Contains');
var GetPoint = require('./GetPoint');
var GetPoints = require('./GetPoints');
var Random = require('./Random');

var Ellipse = new Class({

    initialize:

    //  x/y = center of the ellipse
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

    contains: function (x, y)
    {
        return Contains(this, x, y);
    },

    getPoint: function (position, point)
    {
        return GetPoint(this, position, point);
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
            return this.x - (this.width / 2);
        },

        set: function (value)
        {
            this.x = value + (this.width / 2);
        }

    },

    right: {

        get: function ()
        {
            return this.x + (this.width / 2);
        },

        set: function (value)
        {
            this.x = value - (this.width / 2);
        }

    },

    top: {

        get: function ()
        {
            return this.y - (this.height / 2);
        },

        set: function (value)
        {
            this.y = value + (this.height / 2);
        }

    },

    bottom: {

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

module.exports = Ellipse;
