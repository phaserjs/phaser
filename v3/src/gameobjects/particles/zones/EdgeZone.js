var Class = require('../../../utils/Class');
var Wrap = require('../../../math/Wrap');

var EdgeZone = new Class({

    initialize:

    function EdgeZone (source, quantity, stepRate, yoyo)
    {
        if (yoyo === undefined) { yoyo = false; }

        this.source = source;

        this.points = source.getPoints(quantity, stepRate);

        this.yoyo = yoyo;

        this.counter = -1;

        this._length = this.points.length;

        //  0 = forwards, 1 = backwards
        this._direction = 0;
    },

    getPoint: function (particle)
    {
        if (this._direction === 0)
        {
            this.counter++;

            if (this.counter === this._length)
            {
                if (this.yoyo)
                {
                    this._direction = 1;
                    this.counter--;
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

        particle.x = point.x;
        particle.y = point.y;
    }

});

module.exports = EdgeZone;
