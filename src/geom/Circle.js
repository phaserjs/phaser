/**
* Phaser - Circle
*
* Creates a new Circle object with the center coordinate specified by the x and y parameters and the diameter specified by the diameter parameter. If you call this function without parameters, a circle with x, y, diameter and radius properties set to 0 is created.
* @class Circle
* @constructor
* @param {Number} [x] The x coordinate of the center of the circle.
* @param {Number} [y] The y coordinate of the center of the circle.
* @param {Number} [diameter] The diameter of the circle.
* @return {Circle} This circle object
**/
Phaser.Circle = function (x, y, diameter) {

    if (typeof x === "undefined") { x = 0; }
    if (typeof y === "undefined") { y = 0; }
    if (typeof diameter === "undefined") { diameter = 0; }

    this._diameter = 0;
    this._radius = 0;

    /**
    * The x coordinate of the center of the circle
    * @property x
    * @type Number
    **/
    this.x = 0;

    /**
    * The y coordinate of the center of the circle
    * @property y
    * @type Number
    **/
    this.y = 0;

    this.setTo(x, y, diameter);

};

Phaser.Circle.prototype = {

    /**
    * The circumference of the circle.
    * @method circumference
    * @return {Number}
    **/
    circumference: function () {
        return 2 * (Math.PI * this._radius);
    },

    /**
    * Sets the members of Circle to the specified values.
    * @method setTo
    * @param {Number} x The x coordinate of the center of the circle.
    * @param {Number} y The y coordinate of the center of the circle.
    * @param {Number} diameter The diameter of the circle in pixels.
    * @return {Circle} This circle object
    **/
    setTo: function (x, y, diameter) {
        this.x = x;
        this.y = y;
        this._diameter = diameter;
        this._radius = diameter * 0.5;
        return this;
    },

    /**
    * Copies the x, y and diameter properties from any given object to this Circle.
    * @method copyFrom
    * @param {any} source - The object to copy from.
    * @return {Circle} This Circle object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y, source.diameter);
    },

    /**
    * Copies the x, y and diameter properties from this Circle to any given object.
    * @method copyTo
    * @param {any} dest - The object to copy to.
    * @return {Object} This dest object.
    **/
    copyTo: function(dest) {
        dest[x] = this.x;
        dest[y] = this.y;
        dest[diameter] = this._diameter;
        return dest;
    },

    /**
    * Returns the distance from the center of the Circle object to the given object
    * (can be Circle, Point or anything with x/y properties)
    * @method distance
    * @param {object} dest The target object. Must have visible x and y properties that represent the center of the object.
    * @param {bool} [optional] round Round the distance to the nearest integer (default false)
    * @return {Number} The distance between this Point object and the destination Point object.
    */
    distance: function (dest, round) {

        if (typeof round === "undefined") { round = false }

        if (round)
        {
            return Phaser.Math.distanceRound(this.x, this.y, dest.x, dest.y);
        }
        else
        {
            return Phaser.Math.distance(this.x, this.y, dest.x, dest.y);
        }

    },

    /**
    * Returns a new Circle object with the same values for the x, y, width, and height properties as this Circle object.
    * @method clone
    * @param {Phaser.Circle} out Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
    * @return {Phaser.Circle} The cloned Circle object.
    */
    clone: function(out) {

        if (typeof out === "undefined") { out = new Phaser.Circle(); }

        return out.setTo(a.x, a.y, a.diameter);

    },

    /**
    * Return true if the given x/y coordinates are within this Circle object.
    * @method contains
    * @param {Number} x The X value of the coordinate to test.
    * @param {Number} y The Y value of the coordinate to test.
    * @return {bool} True if the coordinates are within this circle, otherwise false.
    */
    contains: function (x, y) {
        return Phaser.Circle.contains(this, x, y);
    },

    /**
    * Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
    * @method circumferencePoint
    * @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
    * @param {bool} asDegrees Is the given angle in radians (false) or degrees (true)?
    * @param {Phaser.Point} [optional] output An optional Point object to put the result in to. If none specified a new Point object will be created.
    * @return {Phaser.Point} The Point object holding the result.
    */
    circumferencePoint: function (angle, asDegrees, out) {
        return Phaser.Circle.circumferencePoint(this, angle, asDegrees, out);
    },

    /**
    * Adjusts the location of the Circle object, as determined by its center coordinate, by the specified amounts.
    * @method offset
    * @param {Number} dx Moves the x value of the Circle object by this amount.
    * @param {Number} dy Moves the y value of the Circle object by this amount.
    * @return {Circle} This Circle object.
    **/
    offset: function (dx, dy) {
        this.x += dx;
        this.y += dy;
        return this;
    },

    /**
    * Adjusts the location of the Circle object using a Point object as a parameter. This method is similar to the Circle.offset() method, except that it takes a Point object as a parameter.
    * @method offsetPoint
    * @param {Point} point A Point object to use to offset this Circle object (or any valid object with exposed x and y properties).
    * @return {Circle} This Circle object.
    **/
    offsetPoint: function (point) {
        return this.offset(point.x, point.y);
    },

    /**
    * Returns a string representation of this object.
    * @method toString
    * @return {string} a string representation of the instance.
    **/
    toString: function () {
        return "[{Phaser.Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]";
    }

};

//  Getters / Setters

Object.defineProperty(Phaser.Circle.prototype, "diameter", {

    /**
    * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
    * @method diameter
    * @return {Number}
    **/
    get: function () {
        return this._diameter;
    },

    /**
    * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
    * @method diameter
    * @param {Number} The diameter of the circle.
    **/
    set: function (value) {
        if(value > 0) {
            this._diameter = value;
            this._radius = value * 0.5;
        }
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Circle.prototype, "radius", {
    
    /**
    * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
    * @method radius
    * @return {Number}
    **/
    get: function () {
        return this._radius;
    },

    /**
    * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
    * @method radius
    * @param {Number} The radius of the circle.
    **/
    set: function (value) {
        if(value > 0) {
            this._radius = value;
            this._diameter = value * 2;
        }
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Circle.prototype, "left", {
    
    /**
    * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
    * @method left
    * @return {Number} The x coordinate of the leftmost point of the circle.
    **/
    get: function () {
        return this.x - this._radius;
    },

    /**
    * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
    * @method left
    * @param {Number} The value to adjust the position of the leftmost point of the circle by.
    **/
    set: function (value) {
        if(value > this.x) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = this.x - value;
        }
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Circle.prototype, "right", {

    /**
    * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
    * @method right
    * @return {Number}
    **/
    get: function () {
        return this.x + this._radius;
    },

    /**
    * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
    * @method right
    * @param {Number} The amount to adjust the diameter of the circle by.
    **/
    set: function (value) {
        if(value < this.x) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = value - this.x;
        }
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Circle.prototype, "top", {

    /**
    * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
    * @method bottom
    * @return {Number}
    **/
    get: function () {
        return this.y - this._radius;
    },
    
    /**
    * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
    * @method bottom
    * @param {Number} The amount to adjust the height of the circle by.
    **/
    set: function (value) {
        if(value > this.y) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = this.y - value;
        }
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Circle.prototype, "bottom", {

    /**
    * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
    * @method bottom
    * @return {Number}
    **/
    get: function () {
        return this.y + this._radius;
    },

    /**
    * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
    * @method bottom
    * @param {Number} The value to adjust the height of the circle by.
    **/
    set: function (value) {

        if (value < this.y) {
            this._radius = 0;
            this._diameter = 0;
        } else {
            this.radius = value - this.y;
        }
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Circle.prototype, "area", {

    /**
    * Gets the area of this Circle.
    * @method area
    * @return {Number} This area of this circle.
    **/
    get: function () {
        if(this._radius > 0) {
            return Math.PI * this._radius * this._radius;
        } else {
            return 0;
        }
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Circle.prototype, "empty", {

    /**
    * Determines whether or not this Circle object is empty.
    * @method empty
    * @return {bool} A value of true if the Circle objects diameter is less than or equal to 0; otherwise false.
    **/
    get: function () {
        return (this._diameter == 0);
    },

    /**
    * Sets all of the Circle objects properties to 0. A Circle object is empty if its diameter is less than or equal to 0.
    * @method setEmpty
    * @return {Circle} This Circle object
    **/
    set: function (value) {
        this.setTo(0, 0, 0);
    },
    enumerable: true,
    configurable: true
});

//  Statics

/**
* Return true if the given x/y coordinates are within the Circle object.
* @method contains
* @param {Phaser.Circle} a The Circle to be checked.
* @param {Number} x The X value of the coordinate to test.
* @param {Number} y The Y value of the coordinate to test.
* @return {bool} True if the coordinates are within this circle, otherwise false.
*/
Phaser.Circle.contains = function (a, x, y) {

    //  Check if x/y are within the bounds first
    if (x >= a.left && x <= a.right && y >= a.top && y <= a.bottom) {

        var dx = (a.x - x) * (a.x - x);
        var dy = (a.y - y) * (a.y - y);

        return (dx + dy) <= (a.radius * a.radius);

    }

    return false;

};

/**
* Determines whether the two Circle objects match. This method compares the x, y and diameter properties.
* @method equals
* @param {Phaser.Circle} a The first Circle object.
* @param {Phaser.Circle} b The second Circle object.
* @return {bool} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
*/
Phaser.Circle.equals = function (a, b) {
    return (a.x == b.x && a.y == b.y && a.diameter == b.diameter);
};

/**
* Determines whether the two Circle objects intersect.
* This method checks the radius distances between the two Circle objects to see if they intersect.
* @method intersects
* @param {Phaser.Circle} a The first Circle object.
* @param {Phaser.Circle} b The second Circle object.
* @return {bool} A value of true if the specified object intersects with this Circle object; otherwise false.
*/
Phaser.Circle.intersects = function (a, b) {
    return (Phaser.Math.distance(a.x, a.y, b.x, b.y) <= (a.radius + b.radius));
};

/**
* Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
* @method circumferencePoint
* @param {Phaser.Circle} a The first Circle object.
* @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
* @param {bool} asDegrees Is the given angle in radians (false) or degrees (true)?
* @param {Phaser.Point} [optional] output An optional Point object to put the result in to. If none specified a new Point object will be created.
* @return {Phaser.Point} The Point object holding the result.
*/
Phaser.Circle.circumferencePoint = function (a, angle, asDegrees, out) {

    if (typeof asDegrees === "undefined") { asDegrees = false; }
    if (typeof out === "undefined") { out = new Phaser.Point(); }

    if (asDegrees === true) {
        angle = Phaser.Math.radToDeg(angle);
    }

    out.x = a.x + a.radius * Math.cos(angle);
    out.y = a.y + a.radius * Math.sin(angle);

    return out;

};

/**
* Checks if the given Circle and Rectangle objects intersect.
* @method intersectsRectangle
* @param {Phaser.Circle} c The Circle object to test.
* @param {Phaser.Rectangle} r The Rectangle object to test.
* @return {bool} True if the two objects intersect, otherwise false.
*/
Phaser.Circle.intersectsRectangle = function (c, r) {

    var cx = Math.abs(c.x - r.x - r.halfWidth);
    var xDist = r.halfWidth + c.radius;

    if (cx > xDist) {
        return false;
    }

    var cy = Math.abs(c.y - r.y - r.halfHeight);
    var yDist = r.halfHeight + c.radius;

    if (cy > yDist) {
        return false;
    }

    if (cx <= r.halfWidth || cy <= r.halfHeight) {
        return true;
    }

    var xCornerDist = cx - r.halfWidth;
    var yCornerDist = cy - r.halfHeight;
    var xCornerDistSq = xCornerDist * xCornerDist;
    var yCornerDistSq = yCornerDist * yCornerDist;
    var maxCornerDistSq = c.radius * c.radius;

    return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;

};
