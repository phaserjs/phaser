var Class = require('../../../utils/Class');
var Wrap = require('../../../math/Wrap');

var EdgeZone = new Class({

    initialize:

    function EdgeZone (source, quantity, stepRate, yoyo, seamless)
    {
        if (yoyo === undefined) { yoyo = false; }
        if (seamless === undefined) { seamless = true; }

        this.source = source;

        this.points = [];

        this.quantity = quantity;

        this.stepRate = stepRate;

        this.yoyo = yoyo;

        this.counter = -1;

        this.seamless = seamless;

        this._length = 0;

        //  0 = forwards, 1 = backwards
        this._direction = 0;

        this.updateSource();
    },

    updateSource: function ()
    {
        this.points = this.source.getPoints(this.quantity, this.stepRate);

        //  Remove ends?
        if (this.seamless)
        {
            var a = this.points[0];
            var b = this.points[this.points.length - 1];

            if (a.x === b.x && a.y === b.y)
            {
                this.points.pop();
            }
        }

        var oldLength = this._length;

        this._length = this.points.length;

        //  Adjust counter if we now have less points than before
        if (this._length < oldLength && this.counter > this._length)
        {
            this.counter = this._length - 1;
        }

        return this;
    },

    changeSource: function (source)
    {
        this.source = source;

        return this.updateSource();
    },

    getPoint: function (particle)
    {
        if (this._direction === 0)
        {
            this.counter++;

            if (this.counter >= this._length)
            {
                if (this.yoyo)
                {
                    this._direction = 1;
                    this.counter = this._length - 1;
                }
                else
                {
                    this.counter = 0;
                }
            }
        }
        else
        {
            this.counter--;

            if (this.counter === -1)
            {
                if (this.yoyo)
                {
                    this._direction = 0;
                    this.counter = 0;
                }
                else
                {
                    this.counter = this._length - 1;
                }
            }
        }

        var point = this.points[this.counter];

        if (point)
        {
            particle.x = point.x;
            particle.y = point.y;
        }
    }

});

module.exports = EdgeZone;
