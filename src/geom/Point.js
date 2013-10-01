/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Point
*/

/**
* Creates a new Point. If you pass no parameters a Point is created set to (0,0).
* @class Point
* @classdesc The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
* @constructor
* @param {Number} x The horizontal position of this Point (default 0)
* @param {Number} y The vertical position of this Point (default 0)
**/
Phaser.Point = function (x, y) {

    x = x || 0;
    y = y || 0;

    /**
     * @property {number} x - The x coordinate of the point.
     **/
    this.x = x;
    
    /**
     * @property {number} y - The y coordinate of the point.
     **/
    this.y = y;

};

Phaser.Point.prototype = {

    /**
    * Copies the x and y properties from any given object to this Point.
    * @method copyFrom
    * @param {any} source - The object to copy from.
    * @return {Point} This Point object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y);
    },

    /**
    * Inverts the x and y values of this Point
    * @method invert
    * @return {Point} This Point object.
    **/
    invert: function () {
        return this.setTo(this.y, this.x);
    },

    /**
    * Sets the x and y values of this Point object to the given coordinates.
    * @method setTo
    * @param {number} x - The horizontal position of this point.
    * @param {number} y - The vertical position of this point.
    * @return {Point} This Point object. Useful for chaining method calls.
    **/        
    setTo: function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    },

    add: function (x, y) {

        this.x += x;
        this.y += y;
        return this;

    },

    subtract: function (x, y) {

        this.x -= x;
        this.y -= y;
        return this;

    },

    multiply: function (x, y) {

        this.x *= x;
        this.y *= y;
        return this;

    },

    divide: function (x, y) {

        this.x /= x;
        this.y /= y;
        return this;

    },

    /**
    * Clamps the x value of this Point to be between the given min and max.
    * @method clampX
    * @param {number} min - The minimum value to clamp this Point to.
    * @param {number} max - The maximum value to clamp this Point to.
    * @return {Phaser.Point} This Point object.
    */
    clampX: function (min, max) {

        this.x = Phaser.Math.clamp(this.x, min, max);
        return this;
        
    },

    /**
    * Clamps the y value of this Point to be between the given min and max
    * @method clampY
    * @param {number} min - The minimum value to clamp this Point to.
    * @param {number} max - The maximum value to clamp this Point to.
    * @return {Phaser.Point} This Point object.
    */
    clampY: function (min, max) {

        this.y = Phaser.Math.clamp(this.y, min, max);
        return this;
        
    },

    /**
    * Clamps this Point object values to be between the given min and max.
    * @method clamp
    * @param {number} min - The minimum value to clamp this Point to.
    * @param {number} max - The maximum value to clamp this Point to.
    * @return {Phaser.Point} This Point object.
    */
    clamp: function (min, max) {

        this.x = Phaser.Math.clamp(this.x, min, max);
        this.y = Phaser.Math.clamp(this.y, min, max);
        return this;

    },

    /**
    * Creates a copy of the given Point.
    * @method clone
    * @param {Phaser.Point} [output] Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
    * @return {Phaser.Point} The new Point object.
    */
    clone: function (output) {

        if (typeof output === "undefined") { output = new Phaser.Point; }

        return output.setTo(this.x, this.y);

    },

    /**
    * Copies the x and y properties from any given object to this Point.
    * @method copyFrom
    * @param {any} source - The object to copy from.
    * @return {Point} This Point object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y);
    },

    /**
    * Copies the x and y properties from this Point to any given object.
    * @method copyTo
    * @param {any} dest - The object to copy to.
    * @return {Object} The dest object.
    **/
    copyTo: function(dest) {

        dest[x] = this.x;
        dest[y] = this.y;

        return dest;

    },

    /**
    * Returns the distance of this Point object to the given object (can be a Circle, Point or anything with x/y properties)
    * @method distance
    * @param {object} dest - The target object. Must have visible x and y properties that represent the center of the object.
    * @param {bool} [round] - Round the distance to the nearest integer (default false).
    * @return {number} The distance between this Point object and the destination Point object.
    */
    distance: function (dest, round) {

        return Phaser.Point.distance(this, dest, round);
        
    },

    /**
    * Determines whether the given objects x/y values are equal to this Point object.
    * @method equals
    * @param {Phaser.Point} a - The first object to compare.
    * @return {bool} A value of true if the Points are equal, otherwise false.
    */
    equals: function (a) {
        return (a.x == this.x && a.y == this.y);
    },

    /**
    * Rotates this Point around the x/y coordinates given to the desired angle.
    * @method rotate
    * @param {number} x - The x coordinate of the anchor point
    * @param {number} y - The y coordinate of the anchor point
    * @param {number} angle - The angle in radians (unless asDegrees is true) to rotate the Point to.
    * @param {bool} asDegrees - Is the given rotation in radians (false) or degrees (true)?
    * @param {number} [distance] - An optional distance constraint between the Point and the anchor.
    * @return {Phaser.Point} The modified point object.
    */
    rotate: function (x, y, angle, asDegrees, distance) {
        return Phaser.Point.rotate(this, x, y, angle, asDegrees, distance);
    },

    /**
    * Returns a string representation of this object.
    * @method toString
    * @return {string} A string representation of the instance.
    **/
    toString: function () {
        return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
    }

};

//  Statics

/**
* Adds the coordinates of two points together to create a new point.
* @method add
* @param {Phaser.Point} a - The first Point object.
* @param {Phaser.Point} b - The second Point object.
* @param {Phaser.Point} [out] - Optional Point to store the value in, if not supplied a new Point object will be created.
* @return {Phaser.Point} The new Point object.
*/
Phaser.Point.add = function (a, b, out) {

    if (typeof out === "undefined") { out = new Phaser.Point(); }

    out.x = a.x + b.x;
    out.y = a.y + b.y;

    return out;

};

/**
* Subtracts the coordinates of two points to create a new point.
* @method subtract
* @param {Phaser.Point} a - The first Point object.
* @param {Phaser.Point} b - The second Point object.
* @param {Phaser.Point} [out] - Optional Point to store the value in, if not supplied a new Point object will be created.
* @return {Phaser.Point} The new Point object.
*/
Phaser.Point.subtract = function (a, b, out) {

    if (typeof out === "undefined") { out = new Phaser.Point(); }

    out.x = a.x - b.x;
    out.y = a.y - b.y;

    return out;

};

/**
* Multiplies the coordinates of two points to create a new point.
* @method subtract
* @param {Phaser.Point} a - The first Point object.
* @param {Phaser.Point} b - The second Point object.
* @param {Phaser.Point} [out] - Optional Point to store the value in, if not supplied a new Point object will be created.
* @return {Phaser.Point} The new Point object.
*/
Phaser.Point.multiply = function (a, b, out) {

    if (typeof out === "undefined") { out = new Phaser.Point(); }

    out.x = a.x * b.x;
    out.y = a.y * b.y;

    return out;

};

/**
* Divides the coordinates of two points to create a new point.
* @method subtract
* @param {Phaser.Point} a - The first Point object.
* @param {Phaser.Point} b - The second Point object.
* @param {Phaser.Point} [out] - Optional Point to store the value in, if not supplied a new Point object will be created.
* @return {Phaser.Point} The new Point object.
*/
Phaser.Point.divide = function (a, b, out) {

    if (typeof out === "undefined") { out = new Phaser.Point(); }

    out.x = a.x / b.x;
    out.y = a.y / b.y;

    return out;

};

/**
* Determines whether the two given Point objects are equal. They are considered equal if they have the same x and y values.
* @method equals
* @param {Phaser.Point} a - The first Point object.
* @param {Phaser.Point} b - The second Point object.
* @return {bool} A value of true if the Points are equal, otherwise false.
*/
Phaser.Point.equals = function (a, b) {
    return (a.x == b.x && a.y == b.y);
};

/**
* Returns the distance of this Point object to the given object (can be a Circle, Point or anything with x/y properties).
* @method distance
* @param {object} a - The target object. Must have visible x and y properties that represent the center of the object.
* @param {object} b - The target object. Must have visible x and y properties that represent the center of the object.
* @param {bool} [round] - Round the distance to the nearest integer (default false).
* @return {Number} The distance between this Point object and the destination Point object.
*/
Phaser.Point.distance = function (a, b, round) {

    if (typeof round === "undefined") { round = false }

    if (round)
    {
        return Phaser.Math.distanceRound(a.x, a.y, b.x, b.y);
    }
    else
    {
        return Phaser.Math.distance(a.x, a.y, b.x, b.y);
    }

},

/**
* Rotates a Point around the x/y coordinates given to the desired angle.
* @method rotate
* @param {Phaser.Point} a - The Point object to rotate.
* @param {number} x - The x coordinate of the anchor point
* @param {number} y - The y coordinate of the anchor point
* @param {number} angle - The angle in radians (unless asDegrees is true) to rotate the Point to.
* @param {bool} asDegrees - Is the given rotation in radians (false) or degrees (true)?
* @param {number} distance - An optional distance constraint between the Point and the anchor.
* @return {Phaser.Point} The modified point object.
*/
Phaser.Point.rotate = function (a, x, y, angle, asDegrees, distance) {

    asDegrees = asDegrees || false;
    distance = distance || null;

    if (asDegrees)
    {
        angle = Phaser.Math.radToDeg(angle);
    }

    //  Get distance from origin (cx/cy) to this point
    if (distance === null)
    {
        distance = Math.sqrt(((x - a.x) * (x - a.x)) + ((y - a.y) * (y - a.y)));
    }

    return a.setTo(x + distance * Math.cos(angle), y + distance * Math.sin(angle));

};


