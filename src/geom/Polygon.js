/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Adrien Brault <adrien.brault@gmail.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new Polygon. You have to provide a list of points.
* This can be an array of Points that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...],
* or the arguments passed can be all the points of the polygon e.g. `new Phaser.Polygon(new Phaser.Point(), new Phaser.Point(), ...)`, or the
* arguments passed can be flat x,y values e.g. `new Phaser.Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are numbers.
*
* @class Phaser.Polygon
* @classdesc The polygon represents a list of orderded points in space
* @constructor
* @param {Array<Phaser.Point>|Array<number>} points - The array of Points.
*/
Phaser.Polygon = function (points) {

    /**
    * @property {number} type - The base object type.
    */
    this.type = Phaser.POLYGON;

    //if points isn't an array, use arguments as the array
    if (!(points instanceof Array))
    {
        points = Array.prototype.slice.call(arguments);
    }

    //if this is a flat array of numbers, convert it to points
    if (typeof points[0] === 'number')
    {
        var p = [];

        for (var i = 0, len = points.length; i < len; i += 2)
        {
            p.push(new Phaser.Point(points[i], points[i + 1]));
        }

        points = p;
    }

    /**
    * @property {array<Phaser.Point>|array<number>} points - The array of vertex Points.
    * @private
    */
    this._points = points;

};

Phaser.Polygon.prototype = {

    /**
    * Creates a clone of this polygon.
    *
    * @method Phaser.Polygon#clone
    * @return {Phaser.Polygon} A copy of the polygon.
    */
    clone: function () {

        var points = [];

        for (var i=0; i < this.points.length; i++)
        {
            points.push(this.points[i].clone());
        }

        return new Phaser.Polygon(points);

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

        var inside = false;

        // use some raycasting to test hits https://github.com/substack/point-in-polygon/blob/master/index.js
        for (var i = 0, j = this.points.length - 1; i < this.points.length; j = i++)
        {
            var xi = this.points[i].x;
            var yi = this.points[i].y;
            var xj = this.points[j].x;
            var yj = this.points[j].y;

            var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect)
            {
                inside = !inside;
            }
        }

        return inside;

    }

};

Phaser.Polygon.prototype.constructor = Phaser.Polygon;

/*
* Sets and modifies the points of this polygon.
*
* @name Phaser.Polygon#points
* @property {array<Phaser.Point>|array<number>} points - The array of vertex points
*/
Object.defineProperty(Phaser.Polygon.prototype, 'points', {

    get: function() {
        return this._points;
    },

    set: function(points) {

        //if points isn't an array, use arguments as the array
        if (!(points instanceof Array))
        {
            points = Array.prototype.slice.call(arguments);
        }

        //if this is a flat array of numbers, convert it to points
        if (typeof points[0] === 'number')
        {
            var p = [];

            for (var i = 0, len = points.length; i < len; i += 2)
            {
                p.push(new Phaser.Point(points[i], points[i + 1]));
            }

            points = p;
        }

        this._points = points;
    }

});

/**
* Returns the area of the polygon.
*
* @name Phaser.Circle#right
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

        // Find lowest boundary
        for (i = 0; i < this.points.length; i++)
        {
            if (this.points[i].y < y0)
            {
                y0 = this.points[i].y;
            }
        }

        for (i = 0; i< this.points.length; i++)
        {
            p1 = this.points[i];

            if (i === this.points.length - 1)
            {
                p2 = this.points[0];
            }
            else
            {
                p2 = this.points[i+1];
            }

            avgHeight = ((p1.y - y0) + (p2.y - y0)) / 2;
            width = p1.x - p2.x;
            area += avgHeight * width;
        }

        return area;

    }

});

//   Because PIXI uses its own Polygon, we'll replace it with ours to avoid duplicating code or confusion.
PIXI.Polygon = Phaser.Polygon;
