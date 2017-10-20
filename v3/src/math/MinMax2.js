var Between = require('./Between');
var FloatBetween = require('./FloatBetween');
var Class = require('../utils/Class');
var Percent = require('./Percent');
var Wrap = require('./Wrap');

//  A Helper Class that allows you to specify a range between min and max, and then
//  keep the value within those bounds, or get random ints or floats from the range.

var MinMax2 = new Class({

    initialize:

    function MinMax2 (min, max)
    {
        if (typeof min === 'object')
        {
            var obj = min;

            min = obj.min || obj.x;
            max = obj.max || obj.y;
        }

        if (min === undefined) { min = 0; }
        if (max === undefined) { max = min; }

        this.min = min;
        this.max = max;

        this._current = min;
    },

    set: function (min, max)
    {
        if (typeof min === 'object')
        {
            var obj = min;

            min = obj.min;
            max = obj.max;
        }

        if (min === undefined) { min = 0; }
        if (max === undefined) { max = min; }

        this.min = min;
        this.max = max;

        return this;
    },

    clone: function ()
    {
        return new MinMax2(this.min, this.max);
    },

    copy: function (dest)
    {
        dest.min = this.min;
        dest.max = this.max;

        return this;
    },

    copyXY: function (dest)
    {
        dest.x = this.min;
        dest.y = this.max;

        return this;
    },

    copyToMinMax: function (dest)
    {
        dest.min = this.min;
        dest.max = this.max;

        return this;
    },

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

    getRandom: function ()
    {
        return Between(this.min, this.max);
    },

    getRandomFloat: function ()
    {
        return FloatBetween(this.min, this.max);
    },

    current: {

        get: function ()
        {
            return this._current;
        },

        set: function (value)
        {
            this._current = Wrap(value, this.min, this.max);
        }

    },

    x: {

        get: function ()
        {
            return this.min;
        },

        set: function (value)
        {
            this.min = value;
        }

    },

    y: {

        get: function ()
        {
            return this.max;
        },

        set: function (value)
        {
            this.max = value;
        }

    }

});

module.exports = MinMax2;
