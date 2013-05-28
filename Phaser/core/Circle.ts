/// <reference path="../Game.ts" />

/**
* Phaser - Circle
*
* A Circle object is an area defined by its position, as indicated by its center point (x,y) and diameter.
*/

module Phaser {

    export class Circle {

        /**
        * Creates a new Circle object with the center coordinate specified by the x and y parameters and the diameter specified by the diameter parameter. If you call this function without parameters, a circle with x, y, diameter and radius properties set to 0 is created.
        * @class Circle
        * @constructor
        * @param {Number} [x] The x coordinate of the center of the circle.
        * @param {Number} [y] The y coordinate of the center of the circle.
        * @param {Number} [diameter] The diameter of the circle.
        * @return {Circle} This circle object
        **/
        constructor(x: number = 0, y: number = 0, diameter: number = 0) {

            this.setTo(x, y, diameter);

        }

        private _diameter: number = 0;
        private _radius: number = 0;
        //private _pos: Vec2;

        /**
	     * The x coordinate of the center of the circle
	     * @property x
	     * @type Number
	     **/
        public x: number = 0;

        /**
	     * The y coordinate of the center of the circle
	     * @property y
	     * @type Number
	     **/
        public y: number = 0;

        /**
	     * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
	     * @method diameter
	     * @return {Number}
	     **/
        get diameter(): number {
            return this._diameter;
        }

        /**
	     * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
	     * @method diameter
	     * @param {Number} The diameter of the circle.
	     **/
        set diameter(value: number) {

            if (value > 0)
            {
                this._diameter = value;
                this._radius = value * 0.5;
            }

        }

        /**
	     * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
	     * @method radius
	     * @return {Number}
	     **/
        get radius(): number {
            return this._radius;
        }

        /**
	     * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
	     * @method radius
	     * @param {Number} The radius of the circle.
	     **/
        set radius(value: number) {

            if (value > 0)
            {
                this._radius = value;
                this._diameter = value * 2;
            }

        }

        /**
	     * The circumference of the circle.
	     * @method circumference
	     * @return {Number}
	     **/
        circumference(): number {
            return 2 * (Math.PI * this._radius);
        }

        /**
	     * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
	     * @method bottom
	     * @return {Number}
	     **/
        get bottom(): number {
            return this.y + this._radius;
        }

        /**
	     * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
	     * @method bottom
	     * @param {Number} The value to adjust the height of the circle by.
	     **/
        set bottom(value: number) {

            if (value < this.y)
            {
                this._radius = 0;
                this._diameter = 0;
            }
            else
            {
                this.radius = value - this.y;
            }

        }

        /**
	     * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
	     * @method left
	     * @return {Number} The x coordinate of the leftmost point of the circle.
	     **/
        get left(): number {
            return this.x - this._radius;
        }

        /**
	     * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
	     * @method left
	     * @param {Number} The value to adjust the position of the leftmost point of the circle by.
	     **/
        set left(value: number) {

            if (value > this.x)
            {
                this._radius = 0;
                this._diameter = 0;
            }
            else
            {
                this.radius = this.x - value;
            }

        }

        /**
	     * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
	     * @method right
	     * @return {Number}
	     **/
        get right(): number {
            return this.x + this._radius;
        }

        /**
	     * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
	     * @method right
	     * @param {Number} The amount to adjust the diameter of the circle by.
	     **/
        set right(value: number) {

            if (value < this.x)
            {
                this._radius = 0;
                this._diameter = 0;
            }
            else
            {
                this.radius = value - this.x;
            }

        }

        /**
	     * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
	     * @method bottom
	     * @return {Number}
	     **/
        get top(): number {
            return this.y - this._radius;
        }

        /**
	     * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
	     * @method bottom
	     * @param {Number} The amount to adjust the height of the circle by.
	     **/
        set top(value: number) {

            if (value > this.y)
            {
                this._radius = 0;
                this._diameter = 0;
            }
            else
            {
                this.radius = this.y - value;
            }

        }

        /**
	     * Gets the area of this Circle.
	     * @method area
	     * @return {Number} This area of this circle.
	     **/
        get area(): number {

            if (this._radius > 0)
            {
                return Math.PI * this._radius * this._radius;
            }
            else
            {
                return 0;
            }

        }

        /**
	     * Sets the members of Circle to the specified values.
	     * @method setTo
	     * @param {Number} x The x coordinate of the center of the circle.
	     * @param {Number} y The y coordinate of the center of the circle.
	     * @param {Number} diameter The diameter of the circle in pixels.
	     * @return {Circle} This circle object
	     **/
        public setTo(x: number, y: number, diameter: number): Circle {

            this.x = x;
            this.y = y;
            this._diameter = diameter;
            this._radius = diameter * 0.5;

            return this;

        }

        /**
         * Copies the x, y and diameter properties from any given object to this Circle.
         * @method copyFrom
         * @param {any} source - The object to copy from.
         * @return {Circle} This Circle object.
         **/
        public copyFrom(source: any): Circle {
            return this.setTo(source.x, source.y, source.diameter);
        }

        /**
        * Determines whether or not this Circle object is empty.
        * @method empty
	     * @return {Boolean} A value of true if the Circle objects diameter is less than or equal to 0; otherwise false.
        **/
        get empty(): bool {
            return (this._diameter == 0);
        }

        /**
        * Sets all of the Circle objects properties to 0. A Circle object is empty if its diameter is less than or equal to 0.
        * @method setEmpty
        * @return {Circle} This Circle object
        **/
        set empty(value: bool) {
            return this.setTo(0, 0, 0);
        }

        /**
	     * Adjusts the location of the Circle object, as determined by its center coordinate, by the specified amounts.
	     * @method offset
	     * @param {Number} dx Moves the x value of the Circle object by this amount.
	     * @param {Number} dy Moves the y value of the Circle object by this amount.
	     * @return {Circle} This Circle object.
	     **/
        public offset(dx: number, dy: number): Circle {

            this.x += dx;
            this.y += dy;

            return this;

        }

        /**
	     * Adjusts the location of the Circle object using a Point object as a parameter. This method is similar to the Circle.offset() method, except that it takes a Point object as a parameter.
	     * @method offsetPoint
	     * @param {Point} point A Point object to use to offset this Circle object.
	     * @return {Circle} This Circle object.
	     **/
        public offsetPoint(point: Point): Circle {
            return this.offset(point.x, point.y);
        }

        /**
	     * Returns a string representation of this object.
	     * @method toString
	     * @return {string} a string representation of the instance.
	     **/
        public toString(): string {
            return "[{Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]";
        }

    }

}