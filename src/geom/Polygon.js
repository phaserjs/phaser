/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Adrien Brault <adrien.brault@gmail.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new Polygon.
*
* See {@link Phaser.Polygon#setTo setTo} for different ways to specify the points.
*
* @class Phaser.Polygon
* @constructor
* @param {Phaser.Point[]|number[]|...Phaser.Point[]|...number} points - The points that make up this polygon.
*/
Phaser.Polygon = function (points) {

    /**
    * @property {number} type - The base object type.
    */
    this.type = Phaser.POLYGON;

    /**
    * An array of [x1, y1, x2, y2..] pairs that make up this polygon.
    * This must always have an even length.
    * @property {number[]} _pairs
    * @private
    */
    this._pairs = null;

    if (arguments.length > 0)
    {
        //  If points isn't an array then this was invoked variadically.
        if (!(points instanceof Array))
        {
            points = [];
            //  Prevents de-opts
            for (var i = 0; i < arguments.length; i++) {
                points.push(arguments[i]);
            }
            this.setToInternal(points, true);
        }
        else
        {
            this.setToInternal(points);
        }
    }
    else
    {
        this._pairs = [];
    }

    /**
    * @property {boolean} closed - Is the Polygon closed or not?
    */
    this.closed = true;

};

Phaser.Polygon.prototype = {

    /**
     * Creates a copy of the given Polygon.
     * This is a deep clone, the resulting copy contains new Phaser.Point objects
     *
     * @method Phaser.Polygon#clone
     * @param {Phaser.Polygon} [output=(new Polygon)] The polygon to update. If not specified a new polygon will be created.
     * @return {Phaser.Polygon} The cloned (`output`) polygon object.
     */
    clone: function (output) {

        if (!output)
        {
            output = new Phaser.Polygon();
        }

        output._pairs = this._pairs.slice();

        return output;

    },

    /**
    * Checks whether the x and y coordinates are contained within this polygon.
    *
    * @method Phaser.Polygon#contains
    * @param {number} x - The X value of the coordinate to test.
    * @param {number} y - The Y value of the coordinate to test.
    * @return {boolean} True if the coordinates are within this polygon, otherwise false.
    */
    contains: function (x, y) {

        // use some raycasting to test hits see
        // - https://github.com/substack/point-in-polygon/blob/master/index.js
        // - http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        var pairs = this._pairs;
        var length = pairs.length / 2;

        var inside = false;
        for (var i = 0, j = length - 1; i < length; j = i, i++)
        {
            var xi = pairs[i * 2];
            var yi = pairs[i * 2 + 1];
            var xj = pairs[j * 2];
            var yj = pairs[j * 2 + 1];

            var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect)
            {
                inside = !inside;
            }
        }

        return inside;

    },

    /**
    * Sets this Polygon to the given points.
    *
    * The points can be set from a variety of formats:
    *
    * - An array of Point objects: `[new Phaser.Point(x1, y1), ...]`
    * - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
    * - As separate Point arguments: `setTo(new Phaser.Point(x1, y1), ...)`
    * - As separate arguments representing point coordinates: `setTo(x1,y1, x2,y2, ...)`
    *
    * `setTo` may also be called without any arguments to remove all points.
    *
    * @method Phaser.Polygon#setTo
    * @param {Phaser.Point[]|number[]|...Phaser.Point|...number} points - The points to set.
    * @return {boolean} True if the coordinates are within this polygon, otherwise false.
    */
    setTo: function (points) {

        if (arguments.length > 0)
        {
            //  If points isn't an array then this was invoked variadically.
            if (!(points instanceof Array))
            {
                points = [];
                //  Prevents de-opts
                for (var i = 0; i < arguments.length; i++) {
                    points.push(arguments[i]);
                }
                this.setToInternal(points, true);
            }
            else
            {
                this.setToInternal(points);
            }
        }
        else
        {
            while (this._pairs.length) {
                this._pairs.pop();
            }
        }

        return this;

    },

    /**
    * Sets this Polygon to the given points.
    *
    * This internal version only accepts an array, not variadic arguments.    
    *
    * @method Phaser.Polygon#setTo
    * @private
    * @param {Phaser.Point[]|number[]} points - The array of Points, either `[p1, p2..]` or `[x1, y1, x2, y2..]`.
    * @param {boolean} skipCopy - If true, the caller indiciates that the array may be reused directly.
    */
    setToInternal: function (pointsOrPairs, skipCopy) {

        if (pointsOrPairs[0] && pointsOrPairs[0].x != null) // Object with x not null/undefined
        {
            //  pointsOrPairs should be an array of Point-like objects with `x` and `y` coordinates.
            var pairs = this._pairs || [];
            //  This might de-opt a Chrome FloatArray
            for (var i = 0, t = 0, len = pointsOrPairs.length; i < len; i++)
            {
                var point = pointsOrPairs[i];
                pairs[t++] = point.x;
                pairs[t++] = point.y;
            }

            //  Trim excess of existing array if needed
            var limit = pointsOrPairs.length * 2;
            while (pairs.length > limit) {
                pairs.pop();
            }

            this._pairs = pairs;
        }
        else
        {
            // pointsOrPairs should be an array of subsequent x/y pairs
            if (skipCopy)
            {
                this._pairs = pointsOrPairs;
            }
            else
            {
                this._pairs = pointsOrPairs.slice();
            }
        }

    },

    /**
    * Returns an array of Phaser.Point objects that represent this Polygon.
    *
    * The points should not be modified directly as they or may not be "new".
    *
    * @method Phaser.Polygon#getPoints
    * @public
    * @return {Phaer.Point[]} An array of points.
    */
    getPoints: function () {

        var pairs = this._pairs;
        var points = [];

        for (var i = 0; i < pairs.length; /* */) {
            points.push(new Phaser.Point(pairs[i++], pairs[i++]));
        }

        return points;

    }

};

Phaser.Polygon.prototype.constructor = Phaser.Polygon;

/*
* Sets and modifies the points of this polygon.
*
* See {@link Phaser.Polygon#setTo setTo} for the different kinds of arrays formats that can be assigned.
*
* @name Phaser.Polygon#points
* @property {Phaser.Point[]} points - The array of vertex points.
* @deprecated Use `setTo` and `getPoints`.
*/
Object.defineProperty(Phaser.Polygon.prototype, 'points', {

    get: function() {

        return this.getPoints();

    },

    set: function(points) {

        // Points must be an array (no variadic here)
        if (points != null) // null or undefined
        {
            this.setToInternal(points);
        }
        else
        {
            this.setToInternal(); // Clear
        }

    }

});

/**
* Returns the area of the polygon.
*
* @name Phaser.Polygon#area
* @readonly
*/
Object.defineProperty(Phaser.Polygon.prototype, 'area', {

    get: function() {

        var p1;
        var p2;
        var avgHeight;
        var width;
        var i;
        var y0 = Number.MAX_VALUE;
        var area = 0;
        var points = this.getPoints();

        // Find lowest boundary
        for (i = 0; i < points.length; i++)
        {
            if (points[i].y < y0)
            {
                y0 = points[i].y;
            }
        }

        for (i = 0; i< this.points.length; i++)
        {
            p1 = points[i];

            if (i === points.length - 1)
            {
                p2 = points[0];
            }
            else
            {
                p2 = points[i + 1];
            }

            avgHeight = ((p1.y - y0) + (p2.y - y0)) / 2;
            width = p1.x - p2.x;
            area += avgHeight * width;
        }

        return area;

    }

});

//   Because PIXI uses its own Polygon, we'll replace it with ours to avoid duplicating code or confusion.
// PIXI.Polygon = Phaser.Polygon;
