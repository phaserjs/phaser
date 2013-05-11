/// <reference path="../Game.ts" />
/// <reference path="MicroPoint.ts" />

/**
* Phaser - Rectangle
*
* A Rectangle object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
*/

module Phaser {

    export class Rectangle {

        /**
        * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters.
        * If you call this function without parameters, a rectangle with x, y, width, and height properties set to 0 is created.
        * @class Rectangle
        * @constructor
        * @param {Number} x The x coordinate of the top-left corner of the rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the rectangle.
        * @param {Number} width The width of the rectangle.
        * @param {Number} height The height of the rectangle.
        * @return {Rectangle} This rectangle object
        **/
        constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {

            this._width = width;

            if (width > 0)
            {
                this._halfWidth = Math.round(width / 2);
            }

            this._height = height;

            if (height > 0)
            {
                this._halfHeight = Math.round(height / 2);
            }

            this.length = Math.max(this._width, this._height);

            this.topLeft = new MicroPoint(x, y, this);
            this.topCenter = new MicroPoint(x + this._halfWidth, y, this);
            this.topRight = new MicroPoint(x + this._width - 1, y, this);
            this.leftCenter = new MicroPoint(x, y + this._halfHeight, this);
            this.center = new MicroPoint(x + this._halfWidth, y + this._halfHeight, this);
            this.rightCenter = new MicroPoint(x + this._width - 1, y + this._halfHeight, this);
            this.bottomLeft = new MicroPoint(x, y + this._height - 1, this);
            this.bottomCenter = new MicroPoint(x + this._halfWidth, y + this._height - 1, this);
            this.bottomRight = new MicroPoint(x + this._width - 1, y + this._height - 1, this);

        }

        private _tempX: number = null;
        private _tempY: number = null;
        private _tempWidth: number = null;
        private _tempHeight: number = null;

        /**
        * The x coordinate of the top-left corner of the rectangle
        * @property x
        * @type {Number}
        **/
        public get x(): number {

            return this.topLeft.x;

        }

        /**
        * The y coordinate of the top-left corner of the rectangle
        * @property y
        * @type {Number}
        **/
        public get y(): number {

            return this.topLeft.y;

        }

        /**
        * The x coordinate of the top-left corner of the rectangle
        * @property x
        * @type {Number}
        **/
        public set x(value: number) {

            this.topLeft.x = value;

        }

        /**
        * The y coordinate of the top-left corner of the rectangle
        * @property y
        * @type {Number}
        **/
        public set y(value:number) {

            this.topLeft.y = value;

        }

        /**
        * The x and y coordinate of the top-left corner of the rectangle (same as x/y)
        * @property topLeft
        * @type {MicroPoint}
        **/
        public topLeft: MicroPoint;

        /**
        * The x and y coordinate of the top-center of the rectangle
        * @property topCenter
        * @type {MicroPoint}
        **/
        public topCenter: MicroPoint;

        /**
        * The x and y coordinate of the top-right corner of the rectangle
        * @property topRight
        * @type {MicroPoint}
        **/
        public topRight: MicroPoint;

        /**
        * The x and y coordinate of the left-center of the rectangle
        * @property leftCenter
        * @type {MicroPoint}
        **/
        public leftCenter: MicroPoint;

        /**
        * The x and y coordinate of the center of the rectangle
        * @property center
        * @type {MicroPoint}
        **/
        public center: MicroPoint;

        /**
        * The x and y coordinate of the right-center of the rectangle
        * @property rightCenter
        * @type {MicroPoint}
        **/
        public rightCenter: MicroPoint;

        /**
        * The x and y coordinate of the bottom-left corner of the rectangle
        * @property bottomLeft
        * @type {MicroPoint}
        **/
        public bottomLeft: MicroPoint;

        /**
        * The x and y coordinate of the bottom-center of the rectangle
        * @property bottomCenter
        * @type {MicroPoint}
        **/
        public bottomCenter: MicroPoint;

        /**
        * The x and y coordinate of the bottom-right corner of the rectangle
        * @property bottomRight
        * @type {MicroPoint}
        **/
        public bottomRight: MicroPoint;

        /**
        * The width of the rectangle
        * @property width
        * @type {Number}
        **/
        private _width: number = 0;

        /**
        * The height of the rectangle
        * @property height
        * @type {Number}
        **/
        private _height: number = 0;

        /**
        * Half of the width of the rectangle
        * @property halfWidth
        * @type {Number}
        **/
        private _halfWidth: number = 0;

        /**
        * Half of the height of the rectangle
        * @property halfHeight
        * @type {Number}
        **/
        private _halfHeight: number = 0;

        /**
        * The size of the longest side (width or height)
        * @property length
        * @type {Number}
        **/
        public length: number = 0;

        /**
        * Updates all of the MicroPoints based on the values of width and height.
        * You should not normally call this directly.
        **/
        public updateBounds() {

            if (this._tempWidth !== null)
            {
                this._width = this._tempWidth;
                this._halfWidth = 0;

                if (this._width > 0)
                {
                    this._halfWidth = Math.round(this._width / 2);
                }
            }

            if (this._tempHeight !== null)
            {
                this._height = this._tempHeight;
                this._halfHeight = 0;

                if (this._height > 0)
                {
                    this._halfHeight = Math.round(this._height / 2);
                }
            }

            this.length = Math.max(this._width, this._height);

            if (this._tempX !== null && this._tempY !== null)
            {
                this.topLeft.setTo(this._tempX, this._tempY, false);
            }
            else if (this._tempX !== null && this._tempY == null)
            {
                this.topLeft.setTo(this._tempX, this.topLeft.y, false);
            }
            else if (this._tempX == null && this._tempY !== null)
            {
                this.topLeft.setTo(this.topLeft.x, this._tempY, false);
            }
            else
            {
                this.topLeft.setTo(this.x, this.y, false);
            }

            this.topCenter.setTo(this.x + this._halfWidth, this.y, false);
            this.topRight.setTo(this.x + this._width - 1, this.y, false);

            this.leftCenter.setTo(this.x, this.y + this._halfHeight, false);
            this.center.setTo(this.x + this._halfWidth, this.y + this._halfHeight, false);
            this.rightCenter.setTo(this.x + this._width - 1, this.y + this._halfHeight, false);

            this.bottomLeft.setTo(this.x, this.y + this._height - 1, false);
            this.bottomCenter.setTo(this.x + this._halfWidth, this.y + this._height - 1, false);
            this.bottomRight.setTo(this.x + this._width - 1, this.y + this._height - 1, false);

            this._tempX = null;
            this._tempY = null;
            this._tempWidth = null;
            this._tempHeight = null;

        }

        /**
        * The width of the rectangle
        * @property width
        * @type {Number}
        **/
        public set width(value: number) {

            this._width = value;
            this._halfWidth = Math.round(value / 2);
            this.updateBounds();

        }

        /**
        * The height of the rectangle
        * @property height
        * @type {Number}
        **/
        public set height(value: number) {

            this._height = value;
            this._halfHeight = Math.round(value / 2);
            this.updateBounds();

        }

        /**
        * The width of the rectangle
        * @property width
        * @type {Number}
        **/
        public get width(): number {

            return this._width;

        }

        /**
        * The height of the rectangle
        * @property height
        * @type {Number}
        **/
        public get height(): number {

            return this._height;

        }

        /**
        * Half of the width of the rectangle
        * @property halfWidth
        * @type {Number}
        **/
        public get halfWidth(): number {

            return this._halfWidth;

        }

        /**
        * Half of the height of the rectangle
        * @property halfHeight
        * @type {Number}
        **/
        public get halfHeight(): number {

            return this._halfHeight;

        }

        /**
        * The sum of the y and height properties.
        * Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
        * @method bottom
        * @return {Number}
        **/
        public get bottom(): number {

            return this.bottomCenter.y;

        }

        /**
        * The sum of the y and height properties.
        * Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
        * @method bottom
        * @param {Number} value
        **/
        public set bottom(value: number) {

            if (value < this.y)
            {
                this._tempHeight = 0;
            }
            else
            {
                this._tempHeight = this.y + value;
            }

            this.updateBounds();

        }

        /**
        * The x coordinate of the top-left corner of the rectangle.
        * Changing the left property of a Rectangle object has no effect on the y and height properties.
        * However it does affect the width property, whereas changing the x value does not affect the width property.
        * @method left
        * @ return {Number}
        **/
        public get left(): number {

            return this.x;

        }

        /**
        * The x coordinate of the top-left corner of the rectangle.
        * Changing the left property of a Rectangle object has no effect on the y and height properties.
        * However it does affect the width property, whereas changing the x value does not affect the width property.
        * @method left
        * @param {Number} value
        **/
        public set left(value: number) {

            var diff = this.x - value;

            if (this._width + diff < 0)
            {
                this._tempWidth = 0;
                this._tempX = value;
            }
            else
            {
                this._tempWidth = this._width + diff;
                this._tempX = value;
            }

            this.updateBounds();

        }

        /**
        * The sum of the x and width properties.
        * Changing the right property of a Rectangle object has no effect on the x, y and height properties.
        * However it does affect the width property.
        * @method right
        * @return {Number}
        **/
        public get right(): number {

            return this.rightCenter.x;

        }

        /**
        * The sum of the x and width properties.
        * Changing the right property of a Rectangle object has no effect on the x, y and height properties.
        * However it does affect the width property.
        * @method right
        * @param {Number} value
        **/
        public set right(value: number) {

            if (value < this.topLeft.x)
            {
                this._tempWidth = 0;
            }
            else
            {
                this._tempWidth = (value - this.topLeft.x);
            }

            this.updateBounds();

        }

        /**
        * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
        * @method size
        * @param {Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The size of the Rectangle object
        **/
        public size(output?: Point = new Point): Point {

            return output.setTo(this._width, this._height);

        }

        /**
        * The volume of the Rectangle object in pixels, derived from width * height
        * @method volume
        * @return {Number}
        **/
        public get volume(): number {

            return this._width * this._height;

        }

        /**
        * The perimeter size of the Rectangle object in pixels. This is the sum of all 4 sides.
        * @method perimeter
        * @return {Number}
        **/
        public get perimeter(): number {

            return (this._width * 2) + (this._height * 2);

        }

        /**
        * The y coordinate of the top-left corner of the rectangle.
        * Changing the top property of a Rectangle object has no effect on the x and width properties.
        * However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @return {Number}
        **/
        public get top(): number {

            return this.topCenter.y;

        }

        /**
        * The y coordinate of the top-left corner of the rectangle.
        * Changing the top property of a Rectangle object has no effect on the x and width properties.
        * However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @param {Number} value
        **/
        public set top(value: number) {

            var diff = this.topCenter.y - value;

            if (this._height + diff < 0)
            {
                this._tempHeight = 0;
                this._tempY = value;
            }
            else
            {
                this._tempHeight = this._height + diff;
                this._tempY = value;
            }

            this.updateBounds();

        }

        /**
        * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
        * @method clone
        * @param {Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle}
        **/
        public clone(output?: Rectangle = new Rectangle): Rectangle {

            return output.setTo(this.x, this.y, this.width, this.height);

        }

        /**
        * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
        * @method contains
        * @param {Number} x The x coordinate of the point to test.
        * @param {Number} y The y coordinate of the point to test.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        public contains(x: number, y: number): bool {

            if (x >= this.topLeft.x && x <= this.topRight.x && y >= this.topLeft.y && y <= this.bottomRight.y)
            {
                return true;
            }

            return false;

        }

        /**
        * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
        * This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
        * @method containsPoint
        * @param {Point} point The point object being checked. Can be Point or any object with .x and .y values.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        public containsPoint(point: any): bool {

            return this.contains(point.x, point.y);

        }

        /**
        * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object.
        * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
        * @method containsRect
        * @param {Rectangle} rect The rectangle object being checked.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        public containsRect(rect: Rectangle): bool {

            //	If the given rect has a larger volume than this one then it can never contain it
            if (rect.volume > this.volume)
            {
                return false;
            }

            if (rect.x >= this.topLeft.x && rect.y >= this.topLeft.y && rect.rightCenter.x <= this.rightCenter.x && rect.bottomCenter.y <= this.bottomCenter.y)
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
        public copyFrom(source: Rectangle): Rectangle {

            return this.setTo(source.x, source.y, source.width, source.height);

        }


        /**
        * Copies all the rectangle data from this Rectangle object into the destination Rectangle object.
        * @method copyTo
        * @param {Rectangle} rect The destination rectangle object to copy in to
        * @return {Rectangle} The destination rectangle object
        **/
        public copyTo(target: Rectangle): Rectangle {

            return target.copyFrom(this);

        }

        /**
        * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object.
        * This method compares the x, y, width, and height properties of an object against the same properties of this Rectangle object.
        * @method equals
        * @param {Rectangle} toCompare The rectangle to compare to this Rectangle object.
        * @return {Boolean} A value of true if the object has exactly the same values for the x, y, width, and height properties as this Rectangle object; otherwise false.
        **/
        public equals(toCompare: Rectangle): bool {

            if (this.topLeft.equals(toCompare.topLeft) && this.bottomRight.equals(toCompare.bottomRight))
            {
                return true;
            }

            return false;

        }

        /**
        * Increases the size of the Rectangle object by the specified amounts.
        * The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value,
        * and to the top and the bottom by the dy value.
        * @method inflate
        * @param {Number} dx The amount to be added to the left side of this Rectangle.
        * @param {Number} dy The amount to be added to the bottom side of this Rectangle.
        * @return {Rectangle} This Rectangle object.
        **/
        public inflate(dx: number, dy: number): Rectangle {

            this._tempX = this.topLeft.x - dx;
            this._tempWidth = this._width + (2 * dx);
            this._tempY = this.topLeft.y - dy;
            this._tempHeight = this._height + (2 * dy);

            this.updateBounds();

            return this;

        }

        /**
        * Increases the size of the Rectangle object.
        * This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
        * @method inflatePoint
        * @param {Point} point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
        * @return {Rectangle} This Rectangle object.
        **/
        public inflatePoint(point: Point): Rectangle {

            return this.inflate(point.x, point.y);

        }

        /**
        * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object,
        * returns the area of intersection as a Rectangle object. If the rectangles do not intersect, this method
        * returns an empty Rectangle object with its properties set to 0.
        * @method intersection
        * @param {Rectangle} toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that equals the area of intersection. If the rectangles do not intersect, this method returns an empty Rectangle object; that is, a rectangle with its x, y, width, and height properties set to 0.
        **/
        public intersection(toIntersect: Rectangle, output?: Rectangle = new Rectangle): Rectangle {

            if (this.intersects(toIntersect) === true)
            {
                output.x = Math.max(toIntersect.topLeft.x, this.topLeft.x);
                output.y = Math.max(toIntersect.topLeft.y, this.topLeft.y);
                output.width = Math.min(toIntersect.rightCenter.x, this.rightCenter.x) - output.x;
                output.height = Math.min(toIntersect.bottomCenter.y, this.bottomCenter.y) - output.y;
            }

            return output;

        }

        /**
        * Determines whether the object specified intersects (overlaps) with this Rectangle object.
        * This method checks the x, y, width, and height properties of the specified Rectangle object to see if it intersects with this Rectangle object.
        * @method intersects
        * @param {Rectangle} r2 The Rectangle object to compare against to see if it intersects with this Rectangle object.
        * @param {Number} t A tolerance value to allow for an intersection test with padding, default to 0
        * @return {Boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
        **/
        public intersects(r2: Rectangle, t?: number = 0): bool {

            return !(r2.left > this.right + t || r2.right < this.left - t || r2.top > this.bottom + t || r2.bottom < this.top - t);

        }

        /**
        * Determines whether or not this Rectangle object is empty.
        * @method isEmpty
        * @return {Boolean} A value of true if the Rectangle object's width or height is less than or equal to 0; otherwise false.
        **/
        public get isEmpty(): bool {

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
        public offset(dx: number, dy: number): Rectangle {

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
        public offsetPoint(point: Point): Rectangle {

            return this.offset(point.x, point.y);

        }

        /**
        * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
        * @method setEmpty
        * @return {Rectangle} This rectangle object
        **/
        public setEmpty() {

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
        public setTo(x: number, y: number, width: number, height: number): Rectangle {

            this._tempX = x;
            this._tempY = y;
            this._tempWidth = width;
            this._tempHeight = height;

            this.updateBounds();

            return this;

        }

        /**
        * Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles.
        * @method union
        * @param {Rectangle} toUnion A Rectangle object to add to this Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that is the union of the two rectangles.
        **/
        public union(toUnion: Rectangle, output?: Rectangle = new Rectangle): Rectangle {

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
        * @return {String} a string representation of the instance.
        **/
        public toString(): string {

            return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.isEmpty + ")}]";

        }

    }

}