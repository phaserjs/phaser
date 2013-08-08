/// <reference path="Point.ts" />

/**
 *	Rectangle
 *
 *	@desc 		A Rectangle object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
 *
 *	@version 	1.6 - 24th May 2013
 *	@author 	Richard Davey
 */

module Phaser {

    export class Rectangle {

        /**
        * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a Rectangle with x, y, width, and height properties set to 0 is created.
        * @class Rectangle
        * @constructor
        * @param {Number} x The x coordinate of the top-left corner of the Rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the Rectangle.
        * @param {Number} width The width of the Rectangle in pixels.
        * @param {Number} height The height of the Rectangle in pixels.
        * @return {Rectangle} This Rectangle object
        **/
        constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {

            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;

        }

        /** 
        * The x coordinate of the top-left corner of the Rectangle
        * @property x
        * @type Number
        **/
        x: number;

        /** 
        * The y coordinate of the top-left corner of the Rectangle
        * @property y
        * @type Number
        **/
        y: number;

        /** 
        * The width of the Rectangle in pixels
        * @property width
        * @type Number
        **/
        width: number;

        /** 
        * The height of the Rectangle in pixels
        * @property height
        * @type Number
        **/
        height: number;

        /** 
        * Half of the width of the Rectangle
        * @property halfWidth
        * @type Number
        **/
        get halfWidth(): number {
            return Math.round(this.width / 2);
        }

        /** 
        * Half of the height of the Rectangle
        * @property halfHeight
        * @type Number
        **/
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

            if (value <= this.y)
            {
                this.height = 0;
            }
            else
            {
                this.height = (this.y - value);
            }

        }

        /**
        * Sets the bottom-right corner of the Rectangle, determined by the values of the given Point object.
        * @method bottomRight
        * @param {Point} value 
        **/
        set bottomRight(value: Point) {

            this.right = value.x;
            this.bottom = value.y;

        }

        /**
        * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
        * @method left
        * @ return {number} 
        **/
        get left(): number {
            return this.x;
        }

        /**
        * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties.
        * However it does affect the width, whereas changing the x value does not affect the width property.
        * @method left
        * @param {Number} value 
        **/
        set left(value: number) {

            if (value >= this.right)
            {
                this.width = 0;
            }
            else
            {
                this.width = this.right - value;
            }

            this.x = value;

        }

        /**
        * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
        * However it does affect the width property.
        * @method right
        * @return {Number} 
        **/
        get right(): number {
            return this.x + this.width;
        }

        /**
        * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
        * However it does affect the width property.
        * @method right
        * @param {Number} value 
        **/
        set right(value: number) {
            
            if (value <= this.x)
            {
                this.width = 0;
            }
            else
            {
                this.width = this.x + value;
            }

        }

        /**
        * The volume of the Rectangle derived from width * height
        * @method volume
        * @return {Number} 
        **/
        get volume(): number {
            return this.width * this.height;
        }

        /**
        * The perimeter size of the Rectangle. This is the sum of all 4 sides.
        * @method perimeter
        * @return {Number} 
        **/
        get perimeter(): number {
            return (this.width * 2) + (this.height * 2);
        }

        /**
        * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
        * However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @return {Number} 
        **/
        get top(): number {
            return this.y;
        }

        /**
        * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
        * However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @param {Number} value
        **/
        set top(value: number) {

            if (value >= this.bottom)
            {
                this.height = 0;
                this.y = value;
            }
            else
            {
                this.height = (this.bottom - value);
            }

        }

        /**
        * The location of the Rectangles top-left corner, determined by the x and y coordinates of the Point.
        * @method topLeft
        * @param {Point} value
        **/
        set topLeft(value: Point) {

            this.x = value.x;
            this.y = value.y;

        }

        /**
        * Determines whether or not this Rectangle object is empty.
        * @method isEmpty
        * @return {Boolean} A value of true if the Rectangle objects width or height is less than or equal to 0; otherwise false.
        **/
        get empty(): bool {
            return (!this.width || !this.height);
        }

        /**
        * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
        * @method setEmpty
        * @return {Rectangle} This Rectangle object
        **/
        set empty(value: bool) {
            return this.setTo(0, 0, 0, 0);
        }

        /**
        * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
        * @method offset
        * @param {Number} dx Moves the x value of the Rectangle object by this amount.
        * @param {Number} dy Moves the y value of the Rectangle object by this amount.
        * @return {Rectangle} This Rectangle object.
        **/
        offset(dx: number, dy: number): Rectangle {

            this.x += dx;
            this.y += dy;

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
        * Sets the members of Rectangle to the specified values.
        * @method setTo
        * @param {Number} x The x coordinate of the top-left corner of the Rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the Rectangle.
        * @param {Number} width The width of the Rectangle in pixels.
        * @param {Number} height The height of the Rectangle in pixels.
        * @return {Rectangle} This Rectangle object
        **/
        setTo(x: number, y: number, width: number, height: number): Rectangle {

            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;

            return this;

        }

        /**
         * Runs Math.floor() on both the x and y values of this Rectangle.
         * @method floor
         **/
        public floor() {

            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);

        }

        /**
         * Copies the x, y, width and height properties from any given object to this Rectangle.
         * @method copyFrom
         * @param {any} source - The object to copy from.
         * @return {Rectangle} This Rectangle object.
         **/
        public copyFrom(source: any): Rectangle {
            return this.setTo(source.x, source.y, source.width, source.height);
        }

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        toString(): string {
            return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.empty + ")}]";
        }

    }

}