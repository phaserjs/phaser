var Between = require('./Between');
var FloatBetween = require('./FloatBetween');
var Class = require('../utils/Class');
var Percent = require('./Percent');
var Wrap = require('./Wrap');
var Vector2 = require('./Vector2');

//  A Helper Class that allows you to specify a range between min and max, and then
//  keep the value within those bounds, or get random ints or floats from the range.

var MinMax4 = new Class({

    initialize:

    function MinMax4 (xMin, xMax, yMin, yMax)
    {
        this.xMin = 0;
        this.xMax = 0;

        this.yMin = 0;
        this.yMax = 0;

        this._currentX = 0;
        this._currentY = 0;

        if (xMin !== undefined)
        {
            this.set(xMin, xMax, yMin, yMax);
        }
    },

    setX: function (min, max)
    {
        if (min === undefined) { min = 0; }
        if (max === undefined) { max = min; }

        this.xMin = min;
        this.xMax = max;
        this._currentX = min;

        return this;
    },

    setY: function (min, max)
    {
        if (min === undefined) { min = 0; }
        if (max === undefined) { max = min; }

        this.yMin = min;
        this.yMax = max;
        this._currentY = min;

        return this;
    },

    set: function (xMin, xMax, yMin, yMax)
    {
        if (xMin === undefined) { xMin = 0; }
        if (xMax === undefined) { xMax = xMin; }
        if (yMin === undefined) { yMin = xMin; }
        if (yMax === undefined) { yMax = xMax; }

        this.setX(xMin, xMax);
        this.setY(yMin, yMax);

        return this;
    },

    clone: function ()
    {
        return new MinMax4(this.xMin, this.xMax, this.yMin, this.yMax);
    },

    copyX: function (dest)
    {
        dest.x = this.xMin;
        dest.y = this.xMax;

        return this;
    },

    copyY: function (dest)
    {
        dest.x = this.yMin;
        dest.y = this.yMax;

        return this;
    },

    copy: function (dest)
    {
        dest.xMin = this.xMin;
        dest.xMax = this.xMax;

        dest.yMin = this.yMin;
        dest.yMax = this.yMax;

        return dest;
    },

    copyXToMinMax: function (dest)
    {
        dest.min = this.xMin;
        dest.max = this.xMax;

        return this;
    },

    copyYToMinMax: function (dest)
    {
        dest.min = this.yMin;
        dest.max = this.yMax;

        return this;
    },

    /*
    //  Given U (a value between 0 and 1) return the value in the range
    getU: function (u)
    {
        //  TODO
    },

    //  Returns a value between 0 and 1 based on value
    getPercent: function (value)
    {
        return Percent(value, this.min, this.max);
    },
    */

    getRandom: function (vec2)
    {
        if (vec2 === undefined) { vec2 = new Vector2(); }

        vec2.x = this.getRandomX();
        vec2.y = this.getRandomY();

        return vec2;
    },

    getRandomFloat: function (vec2)
    {
        if (vec2 === undefined) { vec2 = new Vector2(); }

        vec2.x = this.getRandomXFloat();
        vec2.y = this.getRandomYFloat();

        return vec2;
    },

    getRandomX: function ()
    {
        return Between(this.xMin, this.xMax);
    },

    getRandomY: function ()
    {
        return Between(this.yMin, this.yMax);
    },

    getRandomXFloat: function ()
    {
        return FloatBetween(this.xMin, this.xMax);
    },

    getRandomYFloat: function ()
    {
        return FloatBetween(this.yMin, this.yMax);
    },

    x: {

        get: function ()
        {
            return this._currentX
        },

        set: function (value)
        {
            this._currentX = Wrap(this._currentX, this.xMin, this.xMax);
        }

    },

    y: {

        get: function ()
        {
            return this._currentY;
        },

        set: function (value)
        {
            this._currentY = Wrap(this._currentY, this.yMin, this.yMax);
        }

    }

});

module.exports = MinMax4;
