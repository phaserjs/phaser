var Between = require('./Between');
var FloatBetween = require('./FloatBetween');
var Class = require('../utils/Class');
var Percent = require('./Percent');
var Wrap = require('./Wrap');

//  A Helper Class that allows you to specify a range between min and max, and then
//  keep the value within those bounds, or get random ints or floats from the range.

var MinMax2 = new Class({

    initialize:

    function MinMax2 (min, max, steps)
    {
        this.min = 0;
        this.max = 0;
        this.steps = 0;

        this._current = 0;

        if (min !== undefined)
        {
            this.set(min, max, steps);
        }
    },

    set: function (min, max, steps)
    {
        if (Array.isArray(min))
        {
            steps = min[2];
            max = min[1];
            min = min[0];
        }
        else if (typeof min === 'object')
        {
            var obj = min;

            min = (obj.hasOwnProperty('x')) ? obj.x : obj.min;
            max = (obj.hasOwnProperty('y')) ? obj.y : obj.max;
            steps = obj.steps;
        }

        if (min === undefined) { min = 0; }
        if (max === undefined) { max = min; }
        if (steps === undefined) { steps = 0; }

        this.min = min;
        this.max = max;
        this.steps = steps;

        this._current = min;

        return this;
    },

    clone: function ()
    {
        return new MinMax2(this.min, this.max, this.steps);
    },

    copy: function (dest)
    {
        dest.min = this.min;
        dest.max = this.max;
        dest.steps = this.steps;

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

    getNext: function ()
    {
        var value;

        if (this.steps > 0)
        {
            value = this._current;

            var i = value + ((this.max - this.min) / this.steps);

            this._current = Wrap(i, this.min, this.max);
        }
        else
        {
            value = this.getRandom();
        }

        return value;
    },

    getNextFloat: function ()
    {
        var value;

        if (this.steps > 0)
        {
            value = this._current;

            var i = value + ((this.max - this.min) / this.steps);

            this._current = Wrap(i, this.min, this.max);
        }
        else
        {
            value = this.getRandomFloat();
        }

        return value;
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
