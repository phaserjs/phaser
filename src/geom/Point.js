/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new Point. If you pass no parameters a Point is created set to (0,0).
* @class Phaser.Point
* @classdesc The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
* @constructor
* @param {number} x The horizontal position of this Point (default 0)
* @param {number} y The vertical position of this Point (default 0)
*/
Phaser.Point = function (x, y) {

    x = x || 0;
    y = y || 0;

    /**
    * @property {number} x - The x coordinate of the point.
    */
    this.x = x;

    /**
    * @property {number} y - The y coordinate of the point.
    */
    this.y = y;

};

Phaser.Point.prototype = {

    /**
    * Copies the x and y properties from any given object to this Point.
    * @method Phaser.Point#copyFrom
    * @param {any} source - The object to copy from.
    * @return {Point} This Point object.
    */
    copyFrom: function (source) {
        return this.setTo(source.x, source.y);
    },

    /**
    * Inverts the x and y values of this Point
    * @method Phaser.Point#invert
    * @return {Point} This Point object.
    */
    invert: function () {
        return this.setTo(this.y, this.x);
    },

    /**
    * Sets the x and y values of this Point object to the given coordinates.
    * @method Phaser.Point#setTo
    * @param {number} x - The horizontal position of this point.
    * @param {number} y - The vertical position of this point.
    * @return {Point} This Point object. Useful for chaining method calls.
    */
    setTo: function (x, y) {

        this.x = x || 0;
        this.y = y || ( (y !== 0) ? this.x : 0 );

        return this;

    },

    /**
    * Sets the x and y values of this Point object to the given coordinates.
    * @method Phaser.Point#set
    * @param {number} x - The horizontal position of this point.
    * @param {number} y - The vertical position of this point.
    * @return {Point} This Point object. Useful for chaining method calls.
    */
    set: function (x, y) {

        this.x = x || 0;
        this.y = y || ( (y !== 0) ? this.x : 0 );

        return this;

    },

    /**
    * Adds the given x and y values to this Point.
    * @method Phaser.Point#add
    * @param {number} x - The value to add to Point.x.
    * @param {number} y - The value to add to Point.y.
    * @return {Phaser.Point} This Point object. Useful for chaining method calls.
    */
    add: function (x, y) {

        this.x += x;
        this.y += y;
        return this;

    },

    /**
    * Subtracts the given x and y values from this Point.
    * @method Phaser.Point#subtract
    * @param {number} x - The value to subtract from Point.x.
    * @param {number} y - The value to subtract from Point.y.
    * @return {Phaser.Point} This Point object. Useful for chaining method calls.
    */
    subtract: function (x, y) {

        this.x -= x;
        this.y -= y;
        return this;

    },

    /**
    * Multiplies Point.x and Point.y by the given x and y values.
    * @method Phaser.Point#multiply
    * @param {number} x - The value to multiply Point.x by.
    * @param {number} y - The value to multiply Point.x by.
    * @return {Phaser.Point} This Point object. Useful for chaining method calls.
    */
    multiply: function (x, y) {

        this.x *= x;
        this.y *= y;
        return this;

    },

    /**
    * Divides Point.x and Point.y by the given x and y values.
    * @method Phaser.Point#divide
    * @param {number} x - The value to divide Point.x by.
    * @param {number} y - The value to divide Point.x by.
    * @return {Phaser.Point} This Point object. Useful for chaining method calls.
    */
    divide: function (x, y) {

        this.x /= x;
        this.y /= y;
        return this;

    },

    /**
    * Clamps the x value of this Point to be between the given min and max.
    * @method Phaser.Point#clampX
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
    * @method Phaser.Point#clampY
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
    * @method Phaser.Point#clamp
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
    * @method Phaser.Point#clone
    * @param {Phaser.Point} [output] Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
    * @return {Phaser.Point} The new Point object.
    */
    clone: function (output) {

        if (typeof output === "undefined")
        {
            output = new Phaser.Point(this.x, this.y);
        }
        else
        {
            output.setTo(this.x, this.y);
        }

        return output;

    },

    /**
    * Copies the x and y properties from this Point to any given object.
    * @method Phaser.Point#copyTo
    * @param {any} dest - The object to copy to.
    * @return {Object} The dest object.
    */
    copyTo: function(dest) {

        dest.x = this.x;
        dest.y = this.y;

        return dest;

    },

    /**
    * Returns the distance of this Point object to the given object (can be a Circle, Point or anything with x/y properties)
    * @method Phaser.Point#distance
    * @param {object} dest - The target object. Must have visible x and y properties that represent the center of the object.
    * @param {boolean} [round] - Round the distance to the nearest integer (default false).
    * @return {number} The distance between this Point object and the destination Point object.
    */
    distance: function (dest, round) {
        return Phaser.Point.distance(this, dest, round);
    },

    /**
    * Determines whether the given objects x/y values are equal to this Point object.
    * @method Phaser.Point#equals
    * @param {Phaser.Point} a - The first object to compare.
    * @return {boolean} A value of true if the Points are equal, otherwise false.
    */
    equals: function (a) {
        return (a.x == this.x && a.y == this.y);
    },

    /**
    * Rotates this Point around the x/y coordinates given to the desired angle.
    * @method Phaser.Point#rotate
    * @param {number} x - The x coordinate of the anchor point
    * @param {number} y - The y coordinate of the anchor point
    * @param {number} angle - The angle in radians (unless asDegrees is true) to rotate the Point to.
    * @param {boolean} asDegrees - Is the given rotation in radians (false) or degrees (true)?
    * @param {number} [distance] - An optional distance constraint between the Point and the anchor.
    * @return {Phaser.Point} The modified point object.
    */
    rotate: function (x, y, angle, asDegrees, distance) {
        return Phaser.Point.rotate(this, x, y, angle, asDegrees, distance);
    },

    /**
    * Calculates the length of the vector
    * @method Phaser.Point#getMagnitude
    * @return {number} the length of the vector
    */
    getMagnitude: function() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    },

    /**
    * Alters the length of the vector without changing the direction
    * @method Phaser.Point#setMagnitude
    * @param {number} magnitude the desired magnitude of the resulting vector
    * @return {Phaser.Point} the modified original vector
    */
    setMagnitude: function(magnitude) {
        return this.normalize().multiply(magnitude, magnitude);
    },

    /**
    * Alters the vector so that its length is 1, but it retains the same direction
    * @method Phaser.Point#normalize
    * @return {Phaser.Point} the modified original vector
    */
    normalize: function() {

        if(!this.isZero()) {
            var m = this.getMagnitude();
            this.x /= m;
            this.y /= m;
        }

        return this;

    },

    /**
    * Determine if this point is at 0,0
    * @method Phaser.Point#isZero
    * @return {boolean} True if this Point is 0,0, otherwise false
    */
    isZero: function() {
        return (this.x === 0 && this.y === 0);
    },

    /**
    * Returns a string representation of this object.
    * @method Phaser.Point#toString
    * @return {string} A string representation of the instance.
    */
    toString: function () {
        return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
    }

};

Phaser.Point.prototype.constructor = Phaser.Point;

/**
* Adds the coordinates of two points together to create a new point.
* @method Phaser.Point.add
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
* @method Phaser.Point.subtract
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
* @method Phaser.Point.multiply
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
* @method Phaser.Point.divide
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
* @method Phaser.Point.equals
* @param {Phaser.Point} a - The first Point object.
* @param {Phaser.Point} b - The second Point object.
* @return {boolean} A value of true if the Points are equal, otherwise false.
*/
Phaser.Point.equals = function (a, b) {
    return (a.x == b.x && a.y == b.y);
};

/**
* Returns the distance of this Point object to the given object (can be a Circle, Point or anything with x/y properties).
* @method Phaser.Point.distance
* @param {object} a - The target object. Must have visible x and y properties that represent the center of the object.
* @param {object} b - The target object. Must have visible x and y properties that represent the center of the object.
* @param {boolean} [round] - Round the distance to the nearest integer (default false).
* @return {number} The distance between this Point object and the destination Point object.
*/
Phaser.Point.distance = function (a, b, round) {

    if (typeof round === "undefined") { round = false; }

    if (round)
    {
        return Phaser.Math.distanceRound(a.x, a.y, b.x, b.y);
    }
    else
    {
        return Phaser.Math.distance(a.x, a.y, b.x, b.y);
    }

};

/**
* Rotates a Point around the x/y coordinates given to the desired angle.
* @method Phaser.Point.rotate
* @param {Phaser.Point} a - The Point object to rotate.
* @param {number} x - The x coordinate of the anchor point
* @param {number} y - The y coordinate of the anchor point
* @param {number} angle - The angle in radians (unless asDegrees is true) to rotate the Point to.
* @param {boolean} asDegrees - Is the given rotation in radians (false) or degrees (true)?
* @param {number} distance - An optional distance constraint between the Point and the anchor.
* @return {Phaser.Point} The modified point object.
*/
Phaser.Point.rotate = function (a, x, y, angle, asDegrees, distance) {

    asDegrees = asDegrees || false;
    distance = distance || null;

    if (asDegrees)
    {
        angle = Phaser.Math.degToRad(angle);
    }

    //  Get distance from origin (cx/cy) to this point
    if (distance === null)
    {
        distance = Math.sqrt(((x - a.x) * (x - a.x)) + ((y - a.y) * (y - a.y)));
    }

    return a.setTo(x + distance * Math.cos(angle), y + distance * Math.sin(angle));

};

//   Because PIXI uses its own Point, we'll replace it with ours to avoid duplicating code or confusion.
PIXI.Point = Phaser.Point;
