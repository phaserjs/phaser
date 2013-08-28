/**
* Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a Rectangle with x, y, width, and height properties set to 0 is created.
*
* @class Rectangle
* @constructor
* @param {Number} x The x coordinate of the top-left corner of the Rectangle.
* @param {Number} y The y coordinate of the top-left corner of the Rectangle.
* @param {Number} width The width of the Rectangle in pixels.
* @param {Number} height The height of the Rectangle in pixels.
* @return {Rectangle} This Rectangle object
**/
Phaser.Rectangle = function (x, y, width, height) {

    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;
    
    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;
    
    /**
     * @property width
     * @type Number
     * @default 0
     */
    this.width = width || 0;
    
    /**
     * @property height
     * @type Number
     * @default 0
     */
    this.height = height || 0;

};

Phaser.Rectangle.prototype = {

    /**
    * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
    * @method offset
    * @param {Number} dx Moves the x value of the Rectangle object by this amount.
    * @param {Number} dy Moves the y value of the Rectangle object by this amount.
    * @return {Rectangle} This Rectangle object.
    **/
    offset: function (dx, dy) {

        this.x += dx;
        this.y += dy;

        return this;

    },
 
    /**
    * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
    * @method offsetPoint
    * @param {Point} point A Point object to use to offset this Rectangle object.
    * @return {Rectangle} This Rectangle object.
    **/
    offsetPoint: function (point) {
        return this.offset(point.x, point.y);
    },
 
    /**
    * Sets the members of Rectangle to the specified values.
    * @method setTo
    * @param {Number} x The x coordinate of the top-left corner of the Rectangle.
    * @param {Number} y The y coordinate of the top-left corner of the Rectangle.
    * @param {Number} width The width of the Rectangle in pixels.
    * @param {Number} height The height of the Rectangle in pixels.
    * @return {Rectangle} This Rectangle object
    **/
    setTo: function (x, y, width, height) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;

    },
 
    /**
    * Runs Math.floor() on both the x and y values of this Rectangle.
    * @method floor
    **/
    floor: function () {

        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

    },
 
    /**
    * Copies the x, y, width and height properties from any given object to this Rectangle.
    * @method copyFrom
    * @param {any} source - The object to copy from.
    * @return {Rectangle} This Rectangle object.
    **/
    copyFrom: function (source) {
        return this.setTo(source.x, source.y, source.width, source.height);
    },

    /**
    * Copies the x, y, width and height properties from this Rectangle to any given object.
    * @method copyTo
    * @param {any} source - The object to copy to.
    * @return {object} This object.
    **/
    copyTo: function (dest) {

        dest.x = this.x;
        dest.y = this.y;
        dest.width = this.width;
        dest.height = this.height;

        return dest;

    },

    /**
    * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
    * @method inflate
    * @param {Number} dx The amount to be added to the left side of the Rectangle.
    * @param {Number} dy The amount to be added to the bottom side of the Rectangle.
    * @return {Phaser.Rectangle} This Rectangle object.
    */
    inflate: function (dx, dy) {
        return Phaser.Rectangle.inflate(this, dx, dy);
    },

    /**
    * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
    * @method size
    * @param {Phaser.Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
    * @return {Phaser.Point} The size of the Rectangle object
    */
    size: function (output) {
        return Phaser.Rectangle.size(this, output);
    };

    /**
    * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
    * @method clone
    * @param {Phaser.Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle}
    */
    clone: function (output) {
        return Phaser.Rectangle.clone(this, output);
    },

    /**
    * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
    * @method contains
    * @param {Number} x The x coordinate of the point to test.
    * @param {Number} y The y coordinate of the point to test.
    * @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
    */
    contains: function (x, y) {
        return Phaser.Rectangle.contains(this, x, y);
    },

    /**
    * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
    * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
    * @method containsRect
    * @param {Phaser.Rectangle} b The second Rectangle object.
    * @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
    */
    containsRect: function (b) {
        return Phaser.Rectangle.containsRect(this, b);
    },

    /**
    * Determines whether the two Rectangles are equal.
    * This method compares the x, y, width and height properties of each Rectangle.
    * @method equals
    * @param {Phaser.Rectangle} b The second Rectangle object.
    * @return {bool} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
    */
    equals: function (b) {
        return Phaser.Rectangle.equals(this, b);
    },

    /**
    * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
    * @method intersection
    * @param {Phaser.Rectangle} b The second Rectangle object.
    * @param {Phaser.Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
    */
    intersection: function (b, out) {
        return Phaser.Rectangle.intersection(this, b, output);
    },

    /**
    * Determines whether the two Rectangles intersect with each other.
    * This method checks the x, y, width, and height properties of the Rectangles.
    * @method intersects
    * @param {Phaser.Rectangle} b The second Rectangle object.
    * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
    * @return {bool} A value of true if the specified object intersects with this Rectangle object; otherwise false.
    */
    intersects: function (b, tolerance) {
        return Phaser.Rectangle.intersects(this, b, tolerance);
    },

    /**
    * Determines whether the object specified intersects (overlaps) with the given values.
    * @method intersectsRaw
    * @param {Number} left
    * @param {Number} right
    * @param {Number} top
    * @param {Number} bottomt
    * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
    * @return {bool} A value of true if the specified object intersects with the Rectangle; otherwise false.
    */
    intersectsRaw: function (left, right, top, bottom, tolerance) {
        return Phaser.Rectangle.intersectsRaw(this, left, right, top, bottom, tolerance);
    },

    /**
    * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
    * @method union
    * @param {Phaser.Rectangle} b The second Rectangle object.
    * @param {Phaser.Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle} A Rectangle object that is the union of the two Rectangles.
    */
    union: function (b, out) {
        return Phaser.Rectangle.union(this, b, out);
    },

    /**
    * Returns a string representation of this object.
    * @method toString
    * @return {string} a string representation of the instance.
    **/
    toString: function () {
        return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.empty + ")}]";
    }

};

//  Getters / Setters

Object.defineProperty(Phaser.Rectangle.prototype, "halfWidth", {

    /**
    * Half of the width of the Rectangle
    * @property halfWidth
    * @type Number
    **/
    get: function () {
        return Math.round(this.width / 2);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Rectangle.prototype, "halfHeight", {

    /**
    * Half of the height of the Rectangle
    * @property halfHeight
    * @type Number
    **/
    get: function () {
        return Math.round(this.height / 2);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Rectangle.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @return {Number}
    **/
    get: function () {
        return this.y + this.height;
    },

    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @param {Number} value
    **/    
    set: function (value) {
        if(value <= this.y) {
            this.height = 0;
        } else {
            this.height = (this.y - value);
        }
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Rectangle.prototype, "bottomRight", {
    
    /**
    * Get the location of the Rectangles bottom right corner as a Point object.
    * @return {Phaser.Point} The new Point object.
    */
    get: function () {
        return new Phaser.Point(this.right, this.bottom);
    },

    /**
    * Sets the bottom-right corner of the Rectangle, determined by the values of the given Point object.
    * @method bottomRight
    * @param {Point} value
    **/
    set: function (value) {
        this.right = value.x;
        this.bottom = value.y;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Rectangle.prototype, "left", {

    /**
    * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
    * @method left
    * @ return {number}
    **/    
    get: function () {
        return this.x;
    },

    /**
    * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties.
    * However it does affect the width, whereas changing the x value does not affect the width property.
    * @method left
    * @param {Number} value
    **/
    set: function (value) {
        if (value >= this.right) {
            this.width = 0;
        } else {
            this.width = this.right - value;
        }
        this.x = value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Rectangle.prototype, "right", {
    
    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @return {Number}
    **/    
    get: function () {
        return this.x + this.width;
    },

    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @param {Number} value
    **/
    set: function (value) {
        if(value <= this.x) {
            this.width = 0;
        } else {
            this.width = this.x + value;
        }
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Rectangle.prototype, "volume", {

    /**
    * The volume of the Rectangle derived from width * height
    * @method volume
    * @return {Number}
    **/    
    get: function () {
        return this.width * this.height;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Rectangle.prototype, "perimeter", {
    
    /**
    * The perimeter size of the Rectangle. This is the sum of all 4 sides.
    * @method perimeter
    * @return {Number}
    **/
    get: function () {
        return (this.width * 2) + (this.height * 2);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Rectangle.prototype, "top", {
    
    /**
    * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
    * However it does affect the height property, whereas changing the y value does not affect the height property.
    * @method top
    * @return {Number}
    **/
    get: function () {
        return this.y;
    },

    /**
    * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
    * However it does affect the height property, whereas changing the y value does not affect the height property.
    * @method top
    * @param {Number} value
    **/
    set: function (value) {
        if(value >= this.bottom) {
            this.height = 0;
            this.y = value;
        } else {
            this.height = (this.bottom - value);
        }
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Rectangle.prototype, "topLeft", {

    /**
    * Get the location of the Rectangles top left corner as a Point object.
    * @return {Phaser.Point} The new Point object.
    */
    get: function () {
        return new Phaser.Point(this.x, this.y);
    },

    /**
    * The location of the Rectangles top-left corner, determined by the x and y coordinates of the Point.
    * @method topLeft
    * @param {Point} value
    **/    
    set: function (value) {
        this.x = value.x;
        this.y = value.y;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Rectangle.prototype, "empty", {
    
    /**
    * Determines whether or not this Rectangle object is empty.
    * @method isEmpty
    * @return {bool} A value of true if the Rectangle objects width or height is less than or equal to 0; otherwise false.
    **/
    get: function () {
        return (!this.width || !this.height);
    },

    /**
    * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
    * @method setEmpty
    * @return {Rectangle} This Rectangle object
    **/
    set: function (value) {
        this.setTo(0, 0, 0, 0);
    },
    enumerable: true,
    configurable: true
});

//  Statics

/**
* Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
* @method inflate
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Number} dx The amount to be added to the left side of the Rectangle.
* @param {Number} dy The amount to be added to the bottom side of the Rectangle.
* @return {Phaser.Rectangle} This Rectangle object.
*/
Phaser.Rectangle.inflate = function inflate(a, dx, dy) {
    a.x -= dx;
    a.width += 2 * dx;
    a.y -= dy;
    a.height += 2 * dy;
    return a;
};

/**
* Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
* @method inflatePoint
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Phaser.Point} point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
* @return {Phaser.Rectangle} The Rectangle object.
*/
Phaser.Rectangle.inflatePoint = function inflatePoint(a, point) {
    return Phaser.Phaser.Rectangle.inflate(a, point.x, point.y);
};

/**
* The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
* @method size
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Phaser.Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
* @return {Phaser.Point} The size of the Rectangle object
*/
Phaser.Rectangle.size = function size(a, output) {
    if (typeof output === "undefined") { output = new Phaser.Point(); }
    return output.setTo(a.width, a.height);
};

/**
* Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
* @method clone
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Phaser.Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
* @return {Phaser.Rectangle}
*/
Phaser.Rectangle.clone = function clone(a, output) {
    if (typeof output === "undefined") { output = new Phaser.Rectangle(); }
    return output.setTo(a.x, a.y, a.width, a.height);
};

/**
* Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
* @method contains
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Number} x The x coordinate of the point to test.
* @param {Number} y The y coordinate of the point to test.
* @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.contains = function contains(a, x, y) {
    return (x >= a.x && x <= a.right && y >= a.y && y <= a.bottom);
};

/**
* Determines whether the specified point is contained within the rectangular region defined by this Rectangle object. This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
* @method containsPoint
* @param {Phaser.Rectangle} a The Rectangle object.
* @param {Phaser.Point} point The point object being checked. Can be Point or any object with .x and .y values.
* @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.containsPoint = function containsPoint(a, point) {
    return Phaser.Phaser.Rectangle.contains(a, point.x, point.y);
};

/**
* Determines whether the first Rectangle object is fully contained within the second Rectangle object.
* A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
* @method containsRect
* @param {Phaser.Rectangle} a The first Rectangle object.
* @param {Phaser.Rectangle} b The second Rectangle object.
* @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.containsRect = function containsRect(a, b) {
    //  If the given rect has a larger volume than this one then it can never contain it
    if(a.volume > b.volume) {
        return false;
    }
    return (a.x >= b.x && a.y >= b.y && a.right <= b.right && a.bottom <= b.bottom);
};

/**
* Determines whether the two Rectangles are equal.
* This method compares the x, y, width and height properties of each Rectangle.
* @method equals
* @param {Phaser.Rectangle} a The first Rectangle object.
* @param {Phaser.Rectangle} b The second Rectangle object.
* @return {bool} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
*/
Phaser.Rectangle.equals = function equals(a, b) {
    return (a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height);
};

/**
* If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
* @method intersection
* @param {Phaser.Rectangle} a The first Rectangle object.
* @param {Phaser.Rectangle} b The second Rectangle object.
* @param {Phaser.Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
* @return {Phaser.Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
*/
Phaser.Rectangle.intersection = function intersection(a, b, out) {
    if (typeof out === "undefined") { out = new Phaser.Rectangle(); }
    if(Phaser.Phaser.Rectangle.intersects(a, b)) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        out.width = Math.min(a.right, b.right) - out.x;
        out.height = Math.min(a.bottom, b.bottom) - out.y;
    }
    return out;
};

/**
* Determines whether the two Rectangles intersect with each other.
* This method checks the x, y, width, and height properties of the Rectangles.
* @method intersects
* @param {Phaser.Rectangle} a The first Rectangle object.
* @param {Phaser.Rectangle} b The second Rectangle object.
* @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
* @return {bool} A value of true if the specified object intersects with this Rectangle object; otherwise false.
*/
Phaser.Rectangle.intersects = function intersects(a, b, tolerance) {
    if (typeof tolerance === "undefined") { tolerance = 0; }
    return !(a.left > b.right + tolerance || a.right < b.left - tolerance || a.top > b.bottom + tolerance || a.bottom < b.top - tolerance);
};

/**
* Determines whether the object specified intersects (overlaps) with the given values.
* @method intersectsRaw
* @param {Number} left
* @param {Number} right
* @param {Number} top
* @param {Number} bottomt
* @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
* @return {bool} A value of true if the specified object intersects with the Rectangle; otherwise false.
*/
Phaser.Rectangle.intersectsRaw = function intersectsRaw(a, left, right, top, bottom, tolerance) {
    if (typeof tolerance === "undefined") { tolerance = 0; }
    return !(left > a.right + tolerance || right < a.left - tolerance || top > a.bottom + tolerance || bottom < a.top - tolerance);
};

/**
* Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
* @method union
* @param {Phaser.Rectangle} a The first Rectangle object.
* @param {Phaser.Rectangle} b The second Rectangle object.
* @param {Phaser.Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
* @return {Phaser.Rectangle} A Rectangle object that is the union of the two Rectangles.
*/
Phaser.Rectangle.union = function union(a, b, out) {
    if (typeof out === "undefined") { out = new Phaser.Rectangle(); }
    return out.setTo(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.right, b.right), Math.max(a.bottom, b.bottom));
};
