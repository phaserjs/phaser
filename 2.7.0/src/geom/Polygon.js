/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Adrien Brault <adrien.brault@gmail.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new Polygon.
* 
* The points can be set from a variety of formats:
*
* - An array of Point objects: `[new Phaser.Point(x1, y1), ...]`
* - An array of objects with public x/y properties: `[obj1, obj2, ...]`
* - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
* - As separate Point arguments: `setTo(new Phaser.Point(x1, y1), ...)`
* - As separate objects with public x/y properties arguments: `setTo(obj1, obj2, ...)`
* - As separate arguments representing point coordinates: `setTo(x1,y1, x2,y2, ...)`
*
* @class Phaser.Polygon
* @constructor
* @param {Phaser.Point[]|number[]|...Phaser.Point|...number} points - The points to set.
*/
Phaser.Polygon = function () {

    /**
    * @property {number} area - The area of this Polygon.
    */
    this.area = 0;

    /**
    * @property {array} _points - An array of Points that make up this Polygon.
    * @private
    */
    this._points = [];

    if (arguments.length > 0)
    {
        this.setTo.apply(this, arguments);
    }

    /**
    * @property {boolean} closed - Is the Polygon closed or not?
    */
    this.closed = true;

    /**
    * @property {boolean} flattened - Has this Polygon been flattened by a call to `Polygon.flatten` ?
    */
    this.flattened = false;

    /**
     * @property {number} type - The base object type.
     */
    this.type = Phaser.POLYGON;

};

Phaser.Polygon.prototype = {

    /**
     * Export the points as an array of flat numbers, following the sequence [ x,y, x,y, x,y ]
     *
     * @method Phaser.Polygon#toNumberArray
     * @param {array} [output] - The array to append the points to. If not specified a new array will be created.
     * @return {array} The flattened array.
     */
    toNumberArray: function (output) {

        if (output === undefined) { output = []; }

        for (var i = 0; i < this._points.length; i++)
        {
            if (typeof this._points[i] === 'number')
            {
                output.push(this._points[i]);
                output.push(this._points[i + 1]);
                i++;
            }
            else
            {
                output.push(this._points[i].x);
                output.push(this._points[i].y);
            }
        }

        return output;

    },

    /**
     * Flattens this Polygon so the points are a sequence of numbers.
     * Any Point objects found are removed and replaced with two numbers.
     * Also sets the Polygon.flattened property to `true`.
     *
     * @method Phaser.Polygon#flatten
     * @return {Phaser.Polygon} This Polygon object
     */
    flatten: function () {

        this._points = this.toNumberArray();

        this.flattened = true;

        return this;

    },

    /**
     * Creates a copy of the given Polygon.
     * This is a deep clone, the resulting copy contains new Phaser.Point objects
     *
     * @method Phaser.Polygon#clone
     * @param {Phaser.Polygon} [output=(new Polygon)] - The polygon to update. If not specified a new polygon will be created.
     * @return {Phaser.Polygon} The cloned (`output`) polygon object.
     */
    clone: function (output) {

        var points = this._points.slice();

        if (output === undefined || output === null)
        {
            output = new Phaser.Polygon(points);
        }
        else
        {
            output.setTo(points);
        }

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

        //  Adapted from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html by Jonas Raoni Soares Silva

        var inside = false;

        if (this.flattened)
        {
            for (var i = -2, j = this._points.length - 2; (i += 2) < this._points.length; j = i)
            {
                var ix = this._points[i];
                var iy = this._points[i + 1];

                var jx = this._points[j];
                var jy = this._points[j + 1];

                if (((iy <= y && y < jy) || (jy <= y && y < iy)) && (x < (jx - ix) * (y - iy) / (jy - iy) + ix))
                {
                    inside = !inside;
                }
            }

        }
        else
        {
            for (var i = -1, j = this._points.length - 1; ++i < this._points.length; j = i)
            {
                var ix = this._points[i].x;
                var iy = this._points[i].y;

                var jx = this._points[j].x;
                var jy = this._points[j].y;

                if (((iy <= y && y < jy) || (jy <= y && y < iy)) && (x < (jx - ix) * (y - iy) / (jy - iy) + ix))
                {
                    inside = !inside;
                }
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
     * - An array of objects with public x/y properties: `[obj1, obj2, ...]`
     * - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
     * - An array of arrays with two elements representing x/y coordinates: `[[x1, y1], [x2, y2], ...]`
     * - As separate Point arguments: `setTo(new Phaser.Point(x1, y1), ...)`
     * - As separate objects with public x/y properties arguments: `setTo(obj1, obj2, ...)`
     * - As separate arguments representing point coordinates: `setTo(x1,y1, x2,y2, ...)`
     *
     * `setTo` may also be called without any arguments to remove all points.
     *
     * @method Phaser.Polygon#setTo
     * @param {Phaser.Point[]|number[]|...Phaser.Point|...number} points - The points to set.
     * @return {Phaser.Polygon} This Polygon object
     */
    setTo: function (points) {

        this.area = 0;
        this._points = [];

        if (arguments.length > 0)
        {
            //  If points isn't an array, use arguments as the array
            if (!Array.isArray(points))
            {
                points = Array.prototype.slice.call(arguments);
            }

            var y0 = Number.MAX_VALUE;

            //  Allows for mixed-type arguments
            for (var i = 0, len = points.length; i < len; i++)
            {
                if (typeof points[i] === 'number')
                {
                    var p = new PIXI.Point(points[i], points[i + 1]);
                    i++;
                }
                else if (Array.isArray(points[i]))
                {
                    var p = new PIXI.Point(points[i][0], points[i][1]);
                }
                else
                {
                    var p = new PIXI.Point(points[i].x, points[i].y);
                }

                this._points.push(p);

                //  Lowest boundary
                if (p.y < y0)
                {
                    y0 = p.y;
                }
            }

            this.calculateArea(y0);
        }

        return this;

    },

    /**
     * Calcuates the area of the Polygon. This is available in the property Polygon.area
     *
     * @method Phaser.Polygon#calculateArea
     * @private
     * @param {number} y0 - The lowest boundary
     * @return {number} The area of the Polygon.
     */
    calculateArea: function (y0) {

        var p1;
        var p2;
        var avgHeight;
        var width;

        for (var i = 0, len = this._points.length; i < len; i++)
        {
            p1 = this._points[i];

            if (i === len - 1)
            {
                p2 = this._points[0];
            }
            else
            {
                p2 = this._points[i + 1];
            }

            avgHeight = ((p1.y - y0) + (p2.y - y0)) / 2;
            width = p1.x - p2.x;
            this.area += avgHeight * width;
        }

        return this.area;

    }

};

Phaser.Polygon.prototype.constructor = Phaser.Polygon;

/**
* Sets and modifies the points of this polygon.
*
* See {@link Phaser.Polygon#setTo setTo} for the different kinds of arrays formats that can be assigned.
*
* @name Phaser.Polygon#points
* @property {Phaser.Point[]} points - The array of vertex points.
* @deprecated Use `setTo`.
*/
Object.defineProperty(Phaser.Polygon.prototype, 'points', {

    get: function() {
        return this._points;
    },

    set: function(points) {

        if (points != null)
        {
            this.setTo(points);
        }
        else
        {
            //  Clear the points
            this.setTo();
        }

    }

});

//  Because PIXI uses its own type, we'll replace it with ours to avoid duplicating code or confusion.
PIXI.Polygon = Phaser.Polygon;
