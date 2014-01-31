/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new Line object with a start and an end point.
* @class Line
* @classdesc Phaser - Line
* @constructor
* @param {number} [x1=0] - The x coordinate of the start of the line.
* @param {number} [y1=0] - The y coordinate of the start of the line.
* @param {number} [x2=0] - The x coordinate of the end of the line.
* @param {number} [y2=0] - The y coordinate of the end of the line.
* @return {Phaser.Line} This line object
*/
Phaser.Line = function (x1, y1, x2, y2) {

    x1 = x1 || 0;
    y1 = y1 || 0;
    x2 = x2 || 0;
    y2 = y2 || 0;

    /**
    * @property {Phaser.Point} start - The start point of the line.
    */
    this.start = new Phaser.Point(x1, y1);

    /**
    * @property {Phaser.Point} end - The end point of the line.
    */
    this.end = new Phaser.Point(x2, y2);

};

Phaser.Line.prototype = {

    /**
    * Sets the components of the Line to the specified values.
    * @method Phaser.Line#setTo
    * @param {number} [x1=0] - The x coordinate of the start of the line.
    * @param {number} [y1=0] - The y coordinate of the start of the line.
    * @param {number} [x2=0] - The x coordinate of the end of the line.
    * @param {number} [y2=0] - The y coordinate of the end of the line.
    * @return {Phaser.Line} This line object
    */
    setTo: function (x1, y1, x2, y2) {

        this.start.setTo(x1, y1);
        this.end.setTo(x2, y2);

        return this;

    },

    /**
    * Sets the line to match the x/y coordinates of the two given sprites.
    * Can optionally be calculated from their center coordinates.
    * @method Phaser.Line#fromSprite
    * @param {Phaser.Sprite} startSprite - The coordinates of this Sprite will be set to the Line.start point.
    * @param {Phaser.Sprite} endSprite - The coordinates of this Sprite will be set to the Line.start point.
    * @param {boolean} [useCenter=true] - If true it will use startSprite.center.x, if false startSprite.x.
    */
    fromSprite: function (startSprite, endSprite, useCenter) {

        if (typeof useCenter === 'undefined') { useCenter = true; }

        if (useCenter)
        {
            this.setTo(startSprite.center.x, startSprite.center.y, endSprite.center.x, endSprite.center.y);
        }
        else
        {
            this.setTo(startSprite.x, startSprite.y, endSprite.x, endSprite.y);
        }

    },

    /**
    * Checks for intersection between this line and another Line.
    * If asSegment is true it will check for segment intersection. If asSegment is false it will check for line intersection.
    * Returns the intersection segment of AB and EF as a Point, or null if there is no intersection.
    *
    * @method Phaser.Line#intersects
    * @param {Phaser.Line} line - The line to check against this one.
    * @param {boolean} [asSegment=true] - If true it will check for segment intersection, otherwise full line intersection.
    * @param {Phaser.Point} [result] - A Point object to store the result in, if not given a new one will be created.
    * @return {Phaser.Point} The intersection segment of the two lines as a Point, or null if there is no intersection.
    */
    intersects: function (line, asSegment, result) {

        return Phaser.Line.intersectsPoints(this.start, this.end, line.start, line.end, asSegment, result);

    },

    /**
    * Tests if the given coordinates fall on this line. See pointOnSegment to test against just the line segment.
    * @method Phaser.Line#pointOnLine
    * @param {number} x - The line to check against this one.
    * @param {number} y - The line to check against this one.
    * @return {boolean} True if the point is on the line, false if not.
    */
    pointOnLine: function (x, y) {

        return ((x - this.start.x) * (this.end.y - this.end.y) === (this.end.x - this.start.x) * (y - this.end.y));

    },

    /**
    * Tests if the given coordinates fall on this line and within the segment. See pointOnLine to test against just the line.
    * @method Phaser.Line#pointOnSegment
    * @param {number} x - The line to check against this one.
    * @param {number} y - The line to check against this one.
    * @return {boolean} True if the point is on the line and segment, false if not.
    */
    pointOnSegment: function (x, y) {

        var xMin = Math.min(this.start.x, this.end.x);
        var xMax = Math.max(this.start.x, this.end.x);
        var yMin = Math.min(this.start.y, this.end.y);
        var yMax = Math.max(this.start.y, this.end.y);

        return (this.pointOnLine(x, y) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax));

    }

};

/**
* @name Phaser.Line#length
* @property {number} length - Gets the length of the line segment.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "length", {

    get: function () {
        return Math.sqrt((this.end.x - this.start.x) * (this.end.x - this.start.x) + (this.end.y - this.start.y) * (this.end.y - this.start.y));
    }

});

/**
* @name Phaser.Line#angle
* @property {number} angle - Gets the angle of the line.
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "angle", {

    get: function () {
        return Math.atan2(this.end.x - this.start.x, this.end.y - this.start.y);
    }

});

/**
* @name Phaser.Line#slope
* @property {number} slope - Gets the slope of the line (y/x).
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "slope", {

    get: function () {
        return (this.end.y - this.start.y) / (this.end.x - this.start.x);
    }

});

/**
* @name Phaser.Line#perpSlope
* @property {number} perpSlope - Gets the perpendicular slope of the line (x/y).
* @readonly
*/
Object.defineProperty(Phaser.Line.prototype, "perpSlope", {

    get: function () {
        return -((this.end.x - this.start.x) / (this.end.y - this.start.y));
    }

});

/**
* Checks for intersection between two lines as defined by the given start and end points.
* If asSegment is true it will check for line segment intersection. If asSegment is false it will check for line intersection.
* Returns the intersection segment of AB and EF as a Point, or null if there is no intersection.
* Adapted from code by Keith Hair
*
* @method Phaser.Line.intersects
* @param {Phaser.Point} a - The start of the first Line to be checked.
* @param {Phaser.Point} b - The end of the first line to be checked.
* @param {Phaser.Point} e - The start of the second Line to be checked.
* @param {Phaser.Point} f - The end of the second line to be checked.
* @param {boolean} [asSegment=true] - If true it will check for segment intersection, otherwise full line intersection.
* @param {Phaser.Point} [result] - A Point object to store the result in, if not given a new one will be created.
* @return {Phaser.Point} The intersection segment of the two lines as a Point, or null if there is no intersection.
*/
Phaser.Line.intersectsPoints = function (a, b, e, f, asSegment, result) {

    if (typeof asSegment === 'undefined') { asSegment = true; }
    if (typeof result === 'undefined') { result = new Phaser.Point(); }

    var a1 = b.y - a.y;
    var a2 = f.y - e.y;
    var b1 = a.x - b.x;
    var b2 = e.x - f.x;
    var c1 = (b.x * a.y) - (a.x * b.y);
    var c2 = (f.x * e.y) - (e.x * f.y);
    var denom = (a1 * b2) - (a2 * b1);

    if (denom === 0)
    {
        return null;
    }

    result.x = ((b1 * c2) - (b2 * c1)) / denom;
    result.y = ((a2 * c1) - (a1 * c2)) / denom;
 
    if (asSegment)
    {
        if (Math.pow((result.x - b.x) + (result.y - b.y), 2) > Math.pow((a.x - b.x) + (a.y - b.y), 2))
        {
            return null;
        }

        if (Math.pow((result.x - a.x) + (result.y - a.y), 2) > Math.pow((a.x - b.x) + (a.y - b.y), 2))
        {
            return null;
        }

        if (Math.pow((result.x - f.x) + (result.y - f.y), 2) > Math.pow((e.x - f.x) + (e.y - f.y), 2))
        {
            return null;
        }

        if (Math.pow((result.x - e.x) + (result.y - e.y), 2) > Math.pow((e.x - f.x) + (e.y - f.y), 2))
        {
            return null;
        }
    }

    return result;

};

/**
* Checks for intersection between two lines.
* If asSegment is true it will check for segment intersection.
* If asSegment is false it will check for line intersection.
* Returns the intersection segment of AB and EF as a Point, or null if there is no intersection.
* Adapted from code by Keith Hair
*
* @method Phaser.Line.intersects
* @param {Phaser.Line} a - The first Line to be checked.
* @param {Phaser.Line} b - The second Line to be checked.
* @param {boolean} [asSegment=true] - If true it will check for segment intersection, otherwise full line intersection.
* @param {Phaser.Point} [result] - A Point object to store the result in, if not given a new one will be created.
* @return {Phaser.Point} The intersection segment of the two lines as a Point, or null if there is no intersection.
*/
Phaser.Line.intersects = function (a, b, asSegment, result) {

    return Phaser.Line.intersectsPoints(a.start, a.end, b.start, b.end, asSegment, result);

};
