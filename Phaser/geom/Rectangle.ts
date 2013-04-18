/// <reference path="../Game.ts" />

/**
* Phaser - Rectangle
*
* A Rectangle object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
*/

module Phaser {

    export class Rectangle {

        /**
        * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a rectangle with x, y, width, and height properties set to 0 is created.
        * @class Rectangle
        * @constructor
        * @param {Number} x The x coordinate of the top-left corner of the rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the rectangle.
        * @param {Number} width The width of the rectangle in pixels.
        * @param {Number} height The height of the rectangle in pixels.
        * @return {Rectangle} This rectangle object
        **/
        constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {

            this.setTo(x, y, width, height);

        }

        /** 
        * The x coordinate of the top-left corner of the rectangle
        * @property x
        * @type Number
        **/
        x: number = 0;

        /** 
        * The y coordinate of the top-left corner of the rectangle
        * @property y
        * @type Number
        **/
        y: number = 0;

        /** 
        * The width of the rectangle in pixels
        * @property width
        * @type Number
        **/
        width: number = 0;

        /** 
        * The height of the rectangle in pixels
        * @property height
        * @type Number
        **/
        height: number = 0;

        get halfWidth(): number {

            return Math.round(this.width / 2);

        }

        get halfHeight(): number {

            return Math.round(this.height / 2);

        }

        /**
        * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
        * @method bottom
        * @return {Number}
        **/
        get bottom(): number {

            return this.y + this.height;

        }

        /**
        * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
        * @method bottom
        * @param {Number} value 
        **/
        set bottom(value: number) {

            if (value < this.y)
            {
                this.height = 0;
            }
            else
            {
                this.height = this.y + value;
            }

        }

        /**
        * Returns a Point containing the location of the Rectangle's bottom-right corner, determined by the values of the right and bottom properties.
        * @method bottomRight
        * @return {Point} 
        **/
        get bottomRight(): Point {

            return new Point(this.right, this.bottom);

        }

        /**
        * Sets the bottom-right corner of this Rectangle, determined by the values of the given Point object.
        * @method bottomRight
        * @param {Point} value 
        **/
        set bottomRight(value: Point) {

            this.right = value.x;
            this.bottom = value.y;

        }

        /**
        * The x coordinate of the top-left corner of the rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
        * @method left
        * @ return {number} 
        **/
        get left(): number {

            return this.x;

        }

        /**
        * The x coordinate of the top-left corner of the rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
        * @method left
        * @param {Number} value 
        **/
        set left(value: number) {

            var diff = this.x - value;

            if (this.width + diff < 0)
            {
                this.width = 0;

                this.x = value;
            }
            else
            {
                this.width += diff;

                this.x = value;
            }

        }

        /**
        * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties. However it does affect the width property.
        * @method right
        * @return {Number} 
        **/
        get right(): number {

            return this.x + this.width;

        }

        /**
        * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties. However it does affect the width property.
        * @method right
        * @param {Number} value 
        **/
        set right(value: number) {

            if (value < this.x)
            {
                this.width = 0;

                return this.x;
            }
            else
            {
                this.width = (value - this.x);
            }

        }

        /**
        * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
        * @method size
        * @param {Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The size of the Rectangle object
        **/
        size(output?: Point = new Point): Point {

            return output.setTo(this.width, this.height);

        }

        /**
        * The volume of the Rectangle object in pixels, derived from width * height
        * @method volume
        * @return {Number} 
        **/
        get volume(): number {

            return this.width * this.height;

        }

        /**
        * The perimeter size of the Rectangle object in pixels. This is the sum of all 4 sides.
        * @method perimeter
        * @return {Number} 
        **/
        get perimeter(): number {

            return (this.width * 2) + (this.height * 2);

        }

        /**
        * The y coordinate of the top-left corner of the rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties. However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @return {Number} 
        **/
        get top(): number {

            return this.y;

        }

        /**
        * The y coordinate of the top-left corner of the rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties. However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @param {Number} value
        **/
        set top(value: number) {

            var diff = this.y - value;

            if (this.height + diff < 0)
            {
                this.height = 0;

                this.y = value;
            }
            else
            {
                this.height += diff;

                this.y = value;
            }


        }

        /**
        * The location of the Rectangle object's top-left corner, determined by the x and y coordinates of the point.
        * @method topLeft
        * @return {Point}
        **/
        get topLeft(): Point {

            return new Point(this.x, this.y);

        }

        /**
        * The location of the Rectangle object's top-left corner, determined by the x and y coordinates of the point.
        * @method topLeft
        * @param {Point} value
        **/
        set topLeft(value: Point) {

            this.x = value.x;
            this.y = value.y;

        }

        /**
        * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
        * @method clone
        * @param {Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle}
        **/
        clone(output?: Rectangle = new Rectangle): Rectangle {

            return output.setTo(this.x, this.y, this.width, this.height);

        }

        /**
        * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
        * @method contains
        * @param {Number} x The x coordinate of the point to test.
        * @param {Number} y The y coordinate of the point to test.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        contains(x: number, y: number): bool {

            if (x >= this.x && x <= this.right && y >= this.y && y <= this.bottom)
            {
                return true;
            }

            return false;

        }

        /**
        * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object. This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
        * @method containsPoint
        * @param {Point} point The point object being checked. Can be Point or any object with .x and .y values.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        containsPoint(point: Point): bool {

            return this.contains(point.x, point.y);

        }

        /**
        * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object. A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
        * @method containsRect
        * @param {Rectangle} rect The rectangle object being checked.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        containsRect(rect: Rectangle): bool {

            //	If the given rect has a larger volume than this one then it can never contain it
            if (rect.volume > this.volume)
            {
                return false;
            }

            if (rect.x >= this.x && rect.y >= this.y && rect.right <= this.right && rect.bottom <= this.bottom)
            {
                return true;
            }

            return false;

        }

        /**
        * Copies all of rectangle data from the source Rectangle object into the calling Rectangle object.
        * @method copyFrom
        * @param {Rectangle} rect The source rectangle object to copy from
        * @return {Rectangle} This rectangle object
        **/
        copyFrom(source: Rectangle): Rectangle {

            return this.setTo(source.x, source.y, source.width, source.height);

        }

        /**
        * Copies all the rectangle data from this Rectangle object into the destination Rectangle object.
        * @method copyTo
        * @param {Rectangle} rect The destination rectangle object to copy in to
        * @return {Rectangle} The destination rectangle object
        **/
        copyTo(target: Rectangle): Rectangle {

            return target.copyFrom(this);

        }

        /**
        * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object. This method compares the x, y, width, and height properties of an object against the same properties of this Rectangle object.
        * @method equals
        * @param {Rectangle} toCompare The rectangle to compare to this Rectangle object.
        * @return {Boolean} A value of true if the object has exactly the same values for the x, y, width, and height properties as this Rectangle object; otherwise false.
        **/
        equals(toCompare: Rectangle): bool {

            if (this.x === toCompare.x && this.y === toCompare.y && this.width === toCompare.width && this.height === toCompare.height)
            {
                return true;
            }

            return false;

        }

        /**
        * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
        * @method inflate
        * @param {Number} dx The amount to be added to the left side of this Rectangle.
        * @param {Number} dy The amount to be added to the bottom side of this Rectangle.
        * @return {Rectangle} This Rectangle object.
        **/
        inflate(dx: number, dy: number): Rectangle {

            if (!isNaN(dx) && !isNaN(dy))
            {
                this.x -= dx;
                this.width += 2 * dx;

                this.y -= dy;
                this.height += 2 * dy;
            }

            return this;

        }

        /**
        * Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
        * @method inflatePoint
        * @param {Point} point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
        * @return {Rectangle} This Rectangle object.
        **/
        inflatePoint(point: Point): Rectangle {

            return this.inflate(point.x, point.y);

        }

        /**
        * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
        * @method intersection
        * @param {Rectangle} toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that equals the area of intersection. If the rectangles do not intersect, this method returns an empty Rectangle object; that is, a rectangle with its x, y, width, and height properties set to 0.
        **/
        intersection(toIntersect: Rectangle, output?: Rectangle = new Rectangle): Rectangle {

            if (this.intersects(toIntersect) === true)
            {
                output.x = Math.max(toIntersect.x, this.x);
                output.y = Math.max(toIntersect.y, this.y);
                output.width = Math.min(toIntersect.right, this.right) - output.x;
                output.height = Math.min(toIntersect.bottom, this.bottom) - output.y;
            }

            return output;

        }

        /**
        * Determines whether the object specified in the toIntersect parameter intersects with this Rectangle object. This method checks the x, y, width, and height properties of the specified Rectangle object to see if it intersects with this Rectangle object.
        * @method intersects
        * @param {Rectangle} toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
        * @return {Boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
        **/
        intersects(toIntersect: Rectangle): bool {

            if (toIntersect.x >= this.right)
            {
                return false;
            }

            if (toIntersect.right <= this.x)
            {
                return false;
            }

            if (toIntersect.bottom <= this.y)
            {
                return false;
            }

            if (toIntersect.y >= this.bottom)
            {
                return false;
            }

            return true;

        }

        /**
        * Checks for overlaps between this Rectangle and the given Rectangle. Returns an object with boolean values for each check.
        * @method overlap
        * @return {Boolean} true if the rectangles overlap, otherwise false
        **/
        overlap(rect: Rectangle): bool {

            return (rect.x + rect.width > this.x) && (rect.x < this.x + this.width) && (rect.y + rect.height > this.y) && (rect.y < this.y + this.height);

        }

        /**
        * Determines whether or not this Rectangle object is empty.
        * @method isEmpty
        * @return {Boolean} A value of true if the Rectangle object's width or height is less than or equal to 0; otherwise false.
        **/
        get isEmpty(): bool {

            if (this.width < 1 || this.height < 1)
            {
                return true;
            }

            return false;

        }

        /**
        * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
        * @method offset
        * @param {Number} dx Moves the x value of the Rectangle object by this amount.
        * @param {Number} dy Moves the y value of the Rectangle object by this amount.
        * @return {Rectangle} This Rectangle object.
        **/
        offset(dx: number, dy: number): Rectangle {

            if (!isNaN(dx) && !isNaN(dy))
            {
                this.x += dx;
                this.y += dy;
            }

            return this;

        }

        /**
        * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
        * @method offsetPoint
        * @param {Point} point A Point object to use to offset this Rectangle object.
        * @return {Rectangle} This Rectangle object.
        **/
        offsetPoint(point: Point): Rectangle {

            return this.offset(point.x, point.y);

        }

        /**
        * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
        * @method setEmpty
        * @return {Rectangle} This rectangle object
        **/
        setEmpty() {

            return this.setTo(0, 0, 0, 0);

        }

        /**
        * Sets the members of Rectangle to the specified values.
        * @method setTo
        * @param {Number} x The x coordinate of the top-left corner of the rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the rectangle.
        * @param {Number} width The width of the rectangle in pixels.
        * @param {Number} height The height of the rectangle in pixels.
        * @return {Rectangle} This rectangle object
        **/
        setTo(x: number, y: number, width: number, height: number): Rectangle {

            if (!isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height))
            {
                this.x = x;
                this.y = y;

                if (width > 0)
                {
                    this.width = width;
                }

                if (height > 0)
                {
                    this.height = height;
                }

            }

            return this;

        }

        /**
        * Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles.
        * @method union
        * @param {Rectangle} toUnion A Rectangle object to add to this Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that is the union of the two rectangles.
        **/
        union(toUnion: Rectangle, output?: Rectangle = new Rectangle): Rectangle {

            return output.setTo(
                    Math.min(toUnion.x, this.x),
                    Math.min(toUnion.y, this.y),
                    Math.max(toUnion.right, this.right),
                    Math.max(toUnion.bottom, this.bottom)
                    );

        }

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        toString(): string {

            return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.isEmpty + ")}]";

        }

    }

}