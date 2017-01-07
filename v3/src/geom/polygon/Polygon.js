var Polygon = function (points)
{
    /**
    * @property {number} area - The area of this Polygon.
    */
    this.area = 0;

    /**
    * @property {array} points - An array of number pair objects that make up this polygon. I.e. [ {x,y}, {x,y}, {x,y} ]
    */
    this.points = [];

    if (points)
    {
        this.setTo(points);
    }
};

Polygon.prototype.constructor = Polygon;

Polygon.prototype = {

    /**
     * Sets this Polygon to the given points.
     *
     * The points can be set from a variety of formats:
     *
     * - An array of Point objects: `[new Phaser.Point(x1, y1), ...]`
     * - An array of objects with public x/y properties: `[obj1, obj2, ...]`
     * - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
     * - An array of arrays with two elements representing x/y coordinates: `[[x1, y1], [x2, y2], ...]`
     *
     * `setTo` may also be called without any arguments to remove all points.
     *
     * @method Phaser.Polygon#setTo
     * @param {Phaser.Point[]|number[]|...Phaser.Point|...number} points - The points to set.
     * @return {Phaser.Polygon} This Polygon object
     */
    setTo: function (points)
    {
        this.area = 0;
        this.points = [];

        if (!Array.isArray(points))
        {
            return this;
        }

        var entry;
        var y0 = Number.MAX_VALUE;
        var p;

        //  The points argument is an array, so iterate through it
        for (var i = 0; i < points.length; i++)
        {
            p = { x: 0, y: 0 };

            if (typeof points[i] === 'number')
            {
                p.x = points[i];
                p.y = points[i + 1];
                i++;
            }
            else if (Array.isArray(entry))
            {
                //  An array of arrays?
                p.x = points[i][0];
                p.y = points[i][1];
            }
            else
            {
                p.x = points[i].x;
                p.y = points[i].y;
            }

            this.points.push(p);

            //  Lowest boundary
            if (p.y < y0)
            {
                y0 = p.y;
            }
        }

        this.calculateArea(y0);

        return this;
    },

    /**
     * Calculates the area of the Polygon. This is available in the property Polygon.area
     *
     * @method Phaser.Polygon#calculateArea
     * @private
     * @param {number} y0 - The lowest boundary
     * @return {number} The area of the Polygon.
     */
    calculateArea: function (y0)
    {
        if (this.points.length < 3)
        {
            this.area = 0;

            return this.area;
        }

        var sum = 0;
        var p1;
        var p2;

        for (var i = 0; i < this.points.length - 1; i++)
        {
            p1 = this.points[i];
            p2 = this.points[i + 1];

            sum += (p2.x - p1.x) * (p1.y + p2.y);
        }

        p1 = this.points[0];
        p2 = this.points[this.points.length - 1];

        sum += (p1.x - p2.x) * (p2.y + p1.y);

        this.area = -sum * 0.5;

        // var p1;
        // var p2;
        // var avgHeight;
        // var width;

        // for (var i = 0, len = this.points.length; i < len; i++)
        // {
        //     p1 = this.points[i];

        //     if (i === len - 1)
        //     {
        //         p2 = this.points[0];
        //     }
        //     else
        //     {
        //         p2 = this.points[i + 1];
        //     }

        //     avgHeight = ((p1.y - y0) + (p2.y - y0)) / 2;
        //     width = p1.x - p2.x;
        //     this.area += avgHeight * width;
        // }

        return this.area;
    }

};

module.exports = Polygon;
