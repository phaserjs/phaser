/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters.
* If you call this function without parameters, a Rectangle with x, y, width, and height properties set to 0 is created.
*
* @class Phaser.Rectangle
* @constructor
* @param {number} x - The x coordinate of the top-left corner of the Rectangle.
* @param {number} y - The y coordinate of the top-left corner of the Rectangle.
* @param {number} width - The width of the Rectangle. Should always be either zero or a positive value.
* @param {number} height - The height of the Rectangle. Should always be either zero or a positive value.
*/
Phaser.Rectangle = function (x, y, width, height) {

    x = x || 0;
    y = y || 0;
    width = width || 0;
    height = height || 0;

    /**
    * @property {number} x - The x coordinate of the top-left corner of the Rectangle.
    */
    this.x = x;

    /**
    * @property {number} y - The y coordinate of the top-left corner of the Rectangle.
    */
    this.y = y;

    /**
    * @property {number} width - The width of the Rectangle. This value should never be set to a negative.
    */
    this.width = width;

    /**
    * @property {number} height - The height of the Rectangle. This value should never be set to a negative.
    */
    this.height = height;

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.RECTANGLE;

};

Phaser.Rectangle.prototype.constructor = Phaser.Rectangle;

Phaser.Rectangle.prototype = {

    /**
    * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
    * @method Phaser.Rectangle#offset
    * @param {number} dx - Moves the x value of the Rectangle object by this amount.
    * @param {number} dy - Moves the y value of the Rectangle object by this amount.
    * @return {Phaser.Rectangle} This Rectangle object.
    */
    offset: function (dx, dy) {

        this.x += dx;
        this.y += dy;

        return this;

    },

    /**
    * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
    * @method Phaser.Rectangle#offsetPoint
    * @param {Phaser.Point} point - A Point object to use to offset this Rectangle object.
    * @return {Phaser.Rectangle} This Rectangle object.
    */
    offsetPoint: function (point) {

        return this.offset(point.x, point.y);

    },

    /**
    * Sets the members of Rectangle to the specified values.
    * @method Phaser.Rectangle#setTo
    * @param {number} x - The x coordinate of the top-left corner of the Rectangle.
    * @param {number} y - The y coordinate of the top-left corner of the Rectangle.
    * @param {number} width - The width of the Rectangle. Should always be either zero or a positive value.
    * @param {number} height - The height of the Rectangle. Should always be either zero or a positive value.
    * @return {Phaser.Rectangle} This Rectangle object
    */
    setTo: function (x, y, width, height) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;

    },

    /**
    * Scales the width and height of this Rectangle by the given amounts.
    * 
    * @method Phaser.Rectangle#scale
    * @param {number} x - The amount to scale the width of the Rectangle by. A value of 0.5 would reduce by half, a value of 2 would double the width, etc.
    * @param {number} [y] - The amount to scale the height of the Rectangle by. A value of 0.5 would reduce by half, a value of 2 would double the height, etc.
    * @return {Phaser.Rectangle} This Rectangle object
    */
    scale: function (x, y) {

        if (y === undefined) { y = x; }

        this.width *= x;
        this.height *= y;

        return this;

    },

    /**
    * Centers this Rectangle so that the center coordinates match the given x and y values.
    *
    * @method Phaser.Rectangle#centerOn
    * @param {number} x - The x coordinate to place the center of the Rectangle at.
    * @param {number} y - The y coordinate to place the center of the Rectangle at.
    * @return {Phaser.Rectangle} This Rectangle object
    */
    centerOn: function (x, y) {

        this.centerX = x;
        this.centerY = y;

        return this;

    },

    /**
    * Runs Math.floor() on both the x and y values of this Rectangle.
    * @method Phaser.Rectangle#floor
    */
    floor: function () {

        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

    },

    /**
    * Runs Math.floor() on the x, y, width and height values of this Rectangle.
    * @method Phaser.Rectangle#floorAll
    */
    floorAll: function () {

        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);

    },

    /**
    * Runs Math.ceil() on both the x and y values of this Rectangle.
    * @method Phaser.Rectangle#ceil
    */
    ceil: function () {

        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);

    },

    /**
    * Runs Math.ceil() on the x, y, width and height values of this Rectangle.
    * @method Phaser.Rectangle#ceilAll
    */
    ceilAll: function () {

        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.width = Math.ceil(this.width);
        this.height = Math.ceil(this.height);

    },

    /**
    * Copies the x, y, width and height properties from any given object to this Rectangle.
    * @method Phaser.Rectangle#copyFrom
    * @param {any} source - The object to copy from.
    * @return {Phaser.Rectangle} This Rectangle object.
    */
    copyFrom: function (source) {

        return this.setTo(source.x, source.y, source.width, source.height);

    },

    /**
    * Copies the x, y, width and height properties from this Rectangle to any given object.
    * @method Phaser.Rectangle#copyTo
    * @param {any} source - The object to copy to.
    * @return {object} This object.
    */
    copyTo: function (dest) {

        dest.x = this.x;
        dest.y = this.y;
        dest.width = this.width;
        dest.height = this.height;

        return dest;

    },

    /**
    * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
    * @method Phaser.Rectangle#inflate
    * @param {number} dx - The amount to be added to the left side of the Rectangle.
    * @param {number} dy - The amount to be added to the bottom side of the Rectangle.
    * @return {Phaser.Rectangle} This Rectangle object.
    */
    inflate: function (dx, dy) {

        return Phaser.Rectangle.inflate(this, dx, dy);

    },

    /**
    * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
    * @method Phaser.Rectangle#size
    * @param {Phaser.Point} [output] - Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
    * @return {Phaser.Point} The size of the Rectangle object.
    */
    size: function (output) {

        return Phaser.Rectangle.size(this, output);

    },

    /**
    * Resize the Rectangle by providing a new width and height.
    * The x and y positions remain unchanged.
    * 
    * @method Phaser.Rectangle#resize
    * @param {number} width - The width of the Rectangle. Should always be either zero or a positive value.
    * @param {number} height - The height of the Rectangle. Should always be either zero or a positive value.
    * @return {Phaser.Rectangle} This Rectangle object
    */
    resize: function (width, height) {

        this.width = width;
        this.height = height;

        return this;

    },

    /**
    * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
    * @method Phaser.Rectangle#clone
    * @param {Phaser.Rectangle} [output] - Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle}
    */
    clone: function (output) {

        return Phaser.Rectangle.clone(this, output);

    },

    /**
    * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
    * @method Phaser.Rectangle#contains
    * @param {number} x - The x coordinate of the point to test.
    * @param {number} y - The y coordinate of the point to test.
    * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
    */
    contains: function (x, y) {

        return Phaser.Rectangle.contains(this, x, y);

    },

    /**
    * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
    * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
    * @method Phaser.Rectangle#containsRect
    * @param {Phaser.Rectangle} b - The second Rectangle object.
    * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
    */
    containsRect: function (b) {

        return Phaser.Rectangle.containsRect(b, this);

    },

    /**
    * Determines whether the two Rectangles are equal.
    * This method compares the x, y, width and height properties of each Rectangle.
    * @method Phaser.Rectangle#equals
    * @param {Phaser.Rectangle} b - The second Rectangle object.
    * @return {boolean} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
    */
    equals: function (b) {

        return Phaser.Rectangle.equals(this, b);

    },

    /**
    * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
    * @method Phaser.Rectangle#intersection
    * @param {Phaser.Rectangle} b - The second Rectangle object.
    * @param {Phaser.Rectangle} out - Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
    */
    intersection: function (b, out) {

        return Phaser.Rectangle.intersection(this, b, out);

    },

    /**
    * Determines whether this Rectangle and another given Rectangle intersect with each other.
    * This method checks the x, y, width, and height properties of the two Rectangles.
    * 
    * @method Phaser.Rectangle#intersects
    * @param {Phaser.Rectangle} b - The second Rectangle object.
    * @return {boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
    */
    intersects: function (b) {

        return Phaser.Rectangle.intersects(this, b);

    },

    /**
    * Determines whether the coordinates given intersects (overlaps) with this Rectangle.
    *
    * @method Phaser.Rectangle#intersectsRaw
    * @param {number} left - The x coordinate of the left of the area.
    * @param {number} right - The right coordinate of the area.
    * @param {number} top - The y coordinate of the area.
    * @param {number} bottom - The bottom coordinate of the area.
    * @param {number} tolerance - A tolerance value to allow for an intersection test with padding, default to 0
    * @return {boolean} A value of true if the specified object intersects with the Rectangle; otherwise false.
    */
    intersectsRaw: function (left, right, top, bottom, tolerance) {

        return Phaser.Rectangle.intersectsRaw(this, left, right, top, bottom, tolerance);

    },

    /**
    * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
    * @method Phaser.Rectangle#union
    * @param {Phaser.Rectangle} b - The second Rectangle object.
    * @param {Phaser.Rectangle} [out] - Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
    * @return {Phaser.Rectangle} A Rectangle object that is the union of the two Rectangles.
    */
    union: function (b, out) {

        return Phaser.Rectangle.union(this, b, out);

    },

    /**
    * Returns a uniformly distributed random point from anywhere within this Rectangle.
    * 
    * @method Phaser.Rectangle#random
    * @param {Phaser.Point|object} [out] - A Phaser.Point, or any object with public x/y properties, that the values will be set in.
    *     If no object is provided a new Phaser.Point object will be created. In high performance areas avoid this by re-using an existing object.
    * @return {Phaser.Point} An object containing the random point in its `x` and `y` properties.
    */
    random: function (out) {

        if (out === undefined) { out = new Phaser.Point(); }

        out.x = this.randomX;
        out.y = this.randomY;

        return out;

    },

    /**
    * Returns a point based on the given position constant, which can be one of:
    * 
    * `Phaser.TOP_LEFT`, `Phaser.TOP_CENTER`, `Phaser.TOP_RIGHT`, `Phaser.LEFT_CENTER`,
    * `Phaser.CENTER`, `Phaser.RIGHT_CENTER`, `Phaser.BOTTOM_LEFT`, `Phaser.BOTTOM_CENTER` 
    * and `Phaser.BOTTOM_RIGHT`.
    *
    * This method returns the same values as calling Rectangle.bottomLeft, etc, but those
    * calls always create a new Point object, where-as this one allows you to use your own.
    * 
    * @method Phaser.Rectangle#getPoint
    * @param {integer} [position] - One of the Phaser position constants, such as `Phaser.TOP_RIGHT`.
    * @param {Phaser.Point} [out] - A Phaser.Point that the values will be set in.
    *     If no object is provided a new Phaser.Point object will be created. In high performance areas avoid this by re-using an existing object.
    * @return {Phaser.Point} An object containing the point in its `x` and `y` properties.
    */
    getPoint: function (position, out) {

        if (out === undefined) { out = new Phaser.Point(); }

        switch (position)
        {
            default:
            case Phaser.TOP_LEFT:
                return out.set(this.x, this.y);

            case Phaser.TOP_CENTER:
                return out.set(this.centerX, this.y);

            case Phaser.TOP_RIGHT:
                return out.set(this.right, this.y);

            case Phaser.LEFT_CENTER:
                return out.set(this.x, this.centerY);

            case Phaser.CENTER:
                return out.set(this.centerX, this.centerY);

            case Phaser.RIGHT_CENTER:
                return out.set(this.right, this.centerY);

            case Phaser.BOTTOM_LEFT:
                return out.set(this.x, this.bottom);

            case Phaser.BOTTOM_CENTER:
                return out.set(this.centerX, this.bottom);

            case Phaser.BOTTOM_RIGHT:
                return out.set(this.right, this.bottom);
        }

    },

    /**
    * Returns a string representation of this object.
    * @method Phaser.Rectangle#toString
    * @return {string} A string representation of the instance.
    */
    toString: function () {

        return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.empty + ")}]";

    }

};

/**
* @name Phaser.Rectangle#halfWidth
* @property {number} halfWidth - Half of the width of the Rectangle.
* @readonly
*/
Object.defineProperty(Phaser.Rectangle.prototype, "halfWidth", {

    get: function () {
        return Math.round(this.width / 2);
    }

});

/**
* @name Phaser.Rectangle#halfHeight
* @property {number} halfHeight - Half of the height of the Rectangle.
* @readonly
*/
Object.defineProperty(Phaser.Rectangle.prototype, "halfHeight", {

    get: function () {
        return Math.round(this.height / 2);
    }

});

/**
* The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
* @name Phaser.Rectangle#bottom
* @property {number} bottom - The sum of the y and height properties.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "bottom", {

    get: function () {
        return this.y + this.height;
    },

    set: function (value) {

        if (value <= this.y)
        {
            this.height = 0;
        }
        else
        {
            this.height = value - this.y;
        }

    }

});

/**
* The location of the Rectangles bottom left corner as a Point object.
* @name Phaser.Rectangle#bottomLeft
* @property {Phaser.Point} bottomLeft - Gets or sets the location of the Rectangles bottom left corner as a Point object.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "bottomLeft", {

    get: function () {
        return new Phaser.Point(this.x, this.bottom);
    },

    set: function (value) {
        this.x = value.x;
        this.bottom = value.y;
    }

});

/**
* The location of the Rectangles bottom right corner as a Point object.
* @name Phaser.Rectangle#bottomRight
* @property {Phaser.Point} bottomRight - Gets or sets the location of the Rectangles bottom right corner as a Point object.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "bottomRight", {

    get: function () {
        return new Phaser.Point(this.right, this.bottom);
    },

    set: function (value) {
        this.right = value.x;
        this.bottom = value.y;
    }

});

/**
* The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
* @name Phaser.Rectangle#left
* @property {number} left - The x coordinate of the left of the Rectangle.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "left", {

    get: function () {
        return this.x;
    },

    set: function (value) {
        if (value >= this.right) {
            this.width = 0;
        } else {
            this.width = this.right - value;
        }
        this.x = value;
    }

});

/**
* The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties, however it does affect the width property.
* @name Phaser.Rectangle#right
* @property {number} right - The sum of the x and width properties.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "right", {

    get: function () {
        return this.x + this.width;
    },

    set: function (value) {
        if (value <= this.x) {
            this.width = 0;
        } else {
            this.width = value - this.x;
        }
    }

});

/**
* The volume of the Rectangle derived from width * height.
* @name Phaser.Rectangle#volume
* @property {number} volume - The volume of the Rectangle derived from width * height.
* @readonly
*/
Object.defineProperty(Phaser.Rectangle.prototype, "volume", {

    get: function () {
        return this.width * this.height;
    }

});

/**
* The perimeter size of the Rectangle. This is the sum of all 4 sides.
* @name Phaser.Rectangle#perimeter
* @property {number} perimeter - The perimeter size of the Rectangle. This is the sum of all 4 sides.
* @readonly
*/
Object.defineProperty(Phaser.Rectangle.prototype, "perimeter", {

    get: function () {
        return (this.width * 2) + (this.height * 2);
    }

});

/**
* The x coordinate of the center of the Rectangle.
* @name Phaser.Rectangle#centerX
* @property {number} centerX - The x coordinate of the center of the Rectangle.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "centerX", {

    get: function () {
        return this.x + this.halfWidth;
    },

    set: function (value) {
        this.x = value - this.halfWidth;
    }

});

/**
* The y coordinate of the center of the Rectangle.
* @name Phaser.Rectangle#centerY
* @property {number} centerY - The y coordinate of the center of the Rectangle.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "centerY", {

    get: function () {
        return this.y + this.halfHeight;
    },

    set: function (value) {
        this.y = value - this.halfHeight;
    }

});

/**
* A random value between the left and right values (inclusive) of the Rectangle.
*
* @name Phaser.Rectangle#randomX
* @property {number} randomX - A random value between the left and right values (inclusive) of the Rectangle.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "randomX", {

    get: function () {

        return this.x + (Math.random() * this.width);

    }

});

/**
* A random value between the top and bottom values (inclusive) of the Rectangle.
*
* @name Phaser.Rectangle#randomY
* @property {number} randomY - A random value between the top and bottom values (inclusive) of the Rectangle.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "randomY", {

    get: function () {

        return this.y + (Math.random() * this.height);

    }

});

/**
* The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
* However it does affect the height property, whereas changing the y value does not affect the height property.
* @name Phaser.Rectangle#top
* @property {number} top - The y coordinate of the top of the Rectangle.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "top", {

    get: function () {
        return this.y;
    },

    set: function (value) {
        if (value >= this.bottom) {
            this.height = 0;
            this.y = value;
        } else {
            this.height = (this.bottom - value);
        }
    }

});

/**
* The location of the Rectangles top left corner as a Point object.
* @name Phaser.Rectangle#topLeft
* @property {Phaser.Point} topLeft - The location of the Rectangles top left corner as a Point object.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "topLeft", {

    get: function () {
        return new Phaser.Point(this.x, this.y);
    },

    set: function (value) {
        this.x = value.x;
        this.y = value.y;
    }

});

/**
* The location of the Rectangles top right corner as a Point object.
* @name Phaser.Rectangle#topRight
* @property {Phaser.Point} topRight - The location of the Rectangles top left corner as a Point object.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "topRight", {

    get: function () {
        return new Phaser.Point(this.x + this.width, this.y);
    },

    set: function (value) {
        this.right = value.x;
        this.y = value.y;
    }

});

/**
* Determines whether or not this Rectangle object is empty. A Rectangle object is empty if its width or height is less than or equal to 0.
* If set to true then all of the Rectangle properties are set to 0.
* @name Phaser.Rectangle#empty
* @property {boolean} empty - Gets or sets the Rectangles empty state.
*/
Object.defineProperty(Phaser.Rectangle.prototype, "empty", {

    get: function () {
        return (!this.width || !this.height);
    },

    set: function (value) {

        if (value === true)
        {
            this.setTo(0, 0, 0, 0);
        }

    }

});

/**
* Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
* @method Phaser.Rectangle.inflate
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {number} dx - The amount to be added to the left side of the Rectangle.
* @param {number} dy - The amount to be added to the bottom side of the Rectangle.
* @return {Phaser.Rectangle} This Rectangle object.
*/
Phaser.Rectangle.inflate = function (a, dx, dy) {

    a.x -= dx;
    a.width += 2 * dx;
    a.y -= dy;
    a.height += 2 * dy;

    return a;

};

/**
* Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
* @method Phaser.Rectangle.inflatePoint
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {Phaser.Point} point - The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
* @return {Phaser.Rectangle} The Rectangle object.
*/
Phaser.Rectangle.inflatePoint = function (a, point) {

    return Phaser.Rectangle.inflate(a, point.x, point.y);

};

/**
* The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
* @method Phaser.Rectangle.size
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {Phaser.Point} [output] - Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
* @return {Phaser.Point} The size of the Rectangle object
*/
Phaser.Rectangle.size = function (a, output) {

    if (output === undefined || output === null)
    {
        output = new Phaser.Point(a.width, a.height);
    }
    else
    {
        output.setTo(a.width, a.height);
    }

    return output;

};

/**
* Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
* @method Phaser.Rectangle.clone
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {Phaser.Rectangle} [output] - Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
* @return {Phaser.Rectangle}
*/
Phaser.Rectangle.clone = function (a, output) {

    if (output === undefined || output === null)
    {
        output = new Phaser.Rectangle(a.x, a.y, a.width, a.height);
    }
    else
    {
        output.setTo(a.x, a.y, a.width, a.height);
    }

    return output;

};

/**
* Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
* @method Phaser.Rectangle.contains
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {number} x - The x coordinate of the point to test.
* @param {number} y - The y coordinate of the point to test.
* @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.contains = function (a, x, y) {

    if (a.width <= 0 || a.height <= 0)
    {
        return false;
    }

    return (x >= a.x && x < a.right && y >= a.y && y < a.bottom);

};

/**
* Determines whether the specified coordinates are contained within the region defined by the given raw values.
* @method Phaser.Rectangle.containsRaw
* @param {number} rx - The x coordinate of the top left of the area.
* @param {number} ry - The y coordinate of the top left of the area.
* @param {number} rw - The width of the area.
* @param {number} rh - The height of the area.
* @param {number} x - The x coordinate of the point to test.
* @param {number} y - The y coordinate of the point to test.
* @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.containsRaw = function (rx, ry, rw, rh, x, y) {

    return (x >= rx && x < (rx + rw) && y >= ry && y < (ry + rh));

};

/**
* Determines whether the specified point is contained within the rectangular region defined by this Rectangle object. This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
* @method Phaser.Rectangle.containsPoint
* @param {Phaser.Rectangle} a - The Rectangle object.
* @param {Phaser.Point} point - The point object being checked. Can be Point or any object with .x and .y values.
* @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.containsPoint = function (a, point) {

    return Phaser.Rectangle.contains(a, point.x, point.y);

};

/**
* Determines whether the first Rectangle object is fully contained within the second Rectangle object.
* A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
* @method Phaser.Rectangle.containsRect
* @param {Phaser.Rectangle} a - The first Rectangle object.
* @param {Phaser.Rectangle} b - The second Rectangle object.
* @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
*/
Phaser.Rectangle.containsRect = function (a, b) {

    //  If the given rect has a larger volume than this one then it can never contain it
    if (a.volume > b.volume)
    {
        return false;
    }

    return (a.x >= b.x && a.y >= b.y && a.right < b.right && a.bottom < b.bottom);

};

/**
* Determines whether the two Rectangles are equal.
* This method compares the x, y, width and height properties of each Rectangle.
* @method Phaser.Rectangle.equals
* @param {Phaser.Rectangle} a - The first Rectangle object.
* @param {Phaser.Rectangle} b - The second Rectangle object.
* @return {boolean} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
*/
Phaser.Rectangle.equals = function (a, b) {

    return (a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height);

};

/**
* Determines if the two objects (either Rectangles or Rectangle-like) have the same width and height values under strict equality.
* @method Phaser.Rectangle.sameDimensions
* @param {Rectangle-like} a - The first Rectangle object.
* @param {Rectangle-like} b - The second Rectangle object.
* @return {boolean} True if the object have equivalent values for the width and height properties.
*/
Phaser.Rectangle.sameDimensions = function (a, b) {

    return (a.width === b.width && a.height === b.height);

};

/**
* If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
* @method Phaser.Rectangle.intersection
* @param {Phaser.Rectangle} a - The first Rectangle object.
* @param {Phaser.Rectangle} b - The second Rectangle object.
* @param {Phaser.Rectangle} [output] - Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
* @return {Phaser.Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
*/
Phaser.Rectangle.intersection = function (a, b, output) {

    if (output === undefined)
    {
        output = new Phaser.Rectangle();
    }

    if (Phaser.Rectangle.intersects(a, b))
    {
        output.x = Math.max(a.x, b.x);
        output.y = Math.max(a.y, b.y);
        output.width = Math.min(a.right, b.right) - output.x;
        output.height = Math.min(a.bottom, b.bottom) - output.y;
    }

    return output;

};

/**
* Determines whether the two Rectangles intersect with each other.
* This method checks the x, y, width, and height properties of the Rectangles.
* @method Phaser.Rectangle.intersects
* @param {Phaser.Rectangle} a - The first Rectangle object.
* @param {Phaser.Rectangle} b - The second Rectangle object.
* @return {boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
*/
Phaser.Rectangle.intersects = function (a, b) {

    if (a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0)
    {
        return false;
    }

    return !(a.right < b.x || a.bottom < b.y || a.x > b.right || a.y > b.bottom);

};

/**
* Determines whether the object specified intersects (overlaps) with the given values.
* @method Phaser.Rectangle.intersectsRaw
* @param {number} left - The x coordinate of the left of the area.
* @param {number} right - The right coordinate of the area.
* @param {number} top - The y coordinate of the area.
* @param {number} bottom - The bottom coordinate of the area.
* @param {number} tolerance - A tolerance value to allow for an intersection test with padding, default to 0
* @return {boolean} A value of true if the specified object intersects with the Rectangle; otherwise false.
*/
Phaser.Rectangle.intersectsRaw = function (a, left, right, top, bottom, tolerance) {

    if (tolerance === undefined) { tolerance = 0; }

    return !(left > a.right + tolerance || right < a.left - tolerance || top > a.bottom + tolerance || bottom < a.top - tolerance);

};

/**
* Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
* @method Phaser.Rectangle.union
* @param {Phaser.Rectangle} a - The first Rectangle object.
* @param {Phaser.Rectangle} b - The second Rectangle object.
* @param {Phaser.Rectangle} [output] - Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
* @return {Phaser.Rectangle} A Rectangle object that is the union of the two Rectangles.
*/
Phaser.Rectangle.union = function (a, b, output) {

    if (output === undefined)
    {
        output = new Phaser.Rectangle();
    }

    return output.setTo(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.right, b.right) - Math.min(a.left, b.left), Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top));

};

/**
* Calculates the Axis Aligned Bounding Box (or aabb) from an array of points.
*
* @method Phaser.Rectangle#aabb
* @param {Phaser.Point[]} points - The array of one or more points.
* @param {Phaser.Rectangle} [out] - Optional Rectangle to store the value in, if not supplied a new Rectangle object will be created.
* @return {Phaser.Rectangle} The new Rectangle object.
* @static
*/
Phaser.Rectangle.aabb = function(points, out) {

    if (out === undefined) {
        out = new Phaser.Rectangle();
    }

    var xMax = Number.NEGATIVE_INFINITY,
        xMin = Number.POSITIVE_INFINITY,
        yMax = Number.NEGATIVE_INFINITY,
        yMin = Number.POSITIVE_INFINITY;

    points.forEach(function(point) {
        if (point.x > xMax) {
            xMax = point.x;
        }
        if (point.x < xMin) {
            xMin = point.x;
        }

        if (point.y > yMax) {
            yMax = point.y;
        }
        if (point.y < yMin) {
            yMin = point.y;
        }
    });

    out.setTo(xMin, yMin, xMax - xMin, yMax - yMin);

    return out;
};
