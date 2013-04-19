/// <reference path="../Game.ts" />

/**
* Phaser - Point
*
* The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
*/

module Phaser {

    export class Point {

        /**
        * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
        * @class Point
        * @constructor
        * @param {Number} x The horizontal position of this point (default 0)
        * @param {Number} y The vertical position of this point (default 0)
        **/
        constructor(x: number = 0, y: number = 0) {

            this.setTo(x, y);

        }

        /** 
         * The horizontal position of this point (default 0)
         * @property x
         * @type Number
         **/
        public x: number;

        /** 
         * The vertical position of this point (default 0)
         * @property y
         * @type Number
         **/
        public y: number;

        /**
         * Adds the coordinates of another point to the coordinates of this point to create a new point.
         * @method add
         * @param {Point} point - The point to be added.
         * @return {Point} The new Point object.
         **/
        public add(toAdd: Point, output?: Point = new Point): Point {

            return output.setTo(this.x + toAdd.x, this.y + toAdd.y);

        }

        /**
         * Adds the given values to the coordinates of this point and returns it
         * @method addTo
         * @param {Number} x - The amount to add to the x value of the point
         * @param {Number} y - The amount to add to the x value of the point
         * @return {Point} This Point object.
         **/
        public addTo(x?: number = 0, y?: number = 0): Point {

            return this.setTo(this.x + x, this.y + y);

        }

        /**
         * Adds the given values to the coordinates of this point and returns it
         * @method addTo
         * @param {Number} x - The amount to add to the x value of the point
         * @param {Number} y - The amount to add to the x value of the point
         * @return {Point} This Point object.
         **/
        public subtractFrom(x?: number = 0, y?: number = 0): Point {

            return this.setTo(this.x - x, this.y - y);

        }

        /**
        * Inverts the x and y values of this point
        * @method invert
        * @return {Point} This Point object.
        **/
        public invert(): Point {

            return this.setTo(this.y, this.x);

        }

        /**
         * Clamps this Point object to be between the given min and max
         * @method clamp
         * @param {number} The minimum value to clamp this Point to
         * @param {number} The maximum value to clamp this Point to
         * @return {Point} This Point object.
         **/
        public clamp(min: number, max: number): Point {

            this.clampX(min, max);
            this.clampY(min, max);
            return this;

        }

        /**
         * Clamps the x value of this Point object to be between the given min and max
         * @method clampX
         * @param {number} The minimum value to clamp this Point to
         * @param {number} The maximum value to clamp this Point to
         * @return {Point} This Point object.
         **/
        public clampX(min: number, max: number): Point {

            this.x = Math.max(Math.min(this.x, max), min);

            return this;

        }

        /**
         * Clamps the y value of this Point object to be between the given min and max
         * @method clampY
         * @param {number} The minimum value to clamp this Point to
         * @param {number} The maximum value to clamp this Point to
         * @return {Point} This Point object.
         **/
        public clampY(min: number, max: number): Point {

            this.x = Math.max(Math.min(this.x, max), min);
            this.y = Math.max(Math.min(this.y, max), min);

            return this;

        }

        /**
         * Creates a copy of this Point.
         * @method clone
         * @param {Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
         * @return {Point} The new Point object.
         **/
        public clone(output?: Point = new Point): Point {

            return output.setTo(this.x, this.y);

        }

        /**
         * Copies the point data from the source Point object into this Point object.
         * @method copyFrom
         * @param {Point} source - The point to copy from.
         * @return {Point} This Point object. Useful for chaining method calls.
         **/
        public copyFrom(source: Point): Point {

            return this.setTo(source.x, source.y);

        }

        /**
         * Copies the point data from this Point object to the given target Point object.
         * @method copyTo
         * @param {Point} target - The point to copy to.
         * @return {Point} The target Point object.
         **/
        public copyTo(target: Point): Point {

            return target.setTo(this.x, this.y);

        }

        /**
         * Returns the distance from this Point object to the given Point object.
         * @method distanceFrom
         * @param {Point} target - The destination Point object.
         * @param {Boolean} round - Round the distance to the nearest integer (default false)
         * @return {Number} The distance between this Point object and the destination Point object.
         **/
        public distanceTo(target: Point, round?: bool = false): number {

            var dx = this.x - target.x;
            var dy = this.y - target.y;

            if (round === true)
            {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            }
            else
            {
                return Math.sqrt(dx * dx + dy * dy);
            }

        }

        /**
         * Returns the distance between the two Point objects.
         * @method distanceBetween
         * @param {Point} pointA - The first Point object.
         * @param {Point} pointB - The second Point object.
         * @param {Boolean} round - Round the distance to the nearest integer (default false)
         * @return {Number} The distance between the two Point objects.
         **/
        public static distanceBetween(pointA: Point, pointB: Point, round?: bool = false): number {

            var dx: number = pointA.x - pointB.x;
            var dy: number = pointA.y - pointB.y;

            if (round === true)
            {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            }
            else
            {
                return Math.sqrt(dx * dx + dy * dy);
            }

        }

        /**
         * Returns true if the distance between this point and a target point is greater than or equal a specified distance.
         * This avoids using a costly square root operation
         * @method distanceCompare
         * @param {Point} target - The Point object to use for comparison.
         * @param {Number} distance - The distance to use for comparison.
         * @return {Boolena} True if distance is >= specified distance.
         **/
        public distanceCompare(target: Point, distance: number): bool {

            if (this.distanceTo(target) >= distance)
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        /**
         * Determines whether this Point object and the given point object are equal. They are equal if they have the same x and y values.
         * @method equals
         * @param {Point} point - The point to compare against.
         * @return {Boolean} A value of true if the object is equal to this Point object; false if it is not equal.
         **/
        public equals(toCompare: Point): bool {

            if (this.x === toCompare.x && this.y === toCompare.y)
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        /**
         * Determines a point between two specified points. The parameter f determines where the new interpolated point is located relative to the two end points specified by parameters pt1 and pt2.
         * The closer the value of the parameter f is to 1.0, the closer the interpolated point is to the first point (parameter pt1). The closer the value of the parameter f is to 0, the closer the interpolated point is to the second point (parameter pt2).
         * @method interpolate
         * @param {Point} pointA - The first Point object.
         * @param {Point} pointB - The second Point object.
         * @param {Number} f - The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
         * @return {Point} The new interpolated Point object.
         **/
        public interpolate(pointA, pointB, f) {

        }

        /**
         * Offsets the Point object by the specified amount. The value of dx is added to the original value of x to create the new x value.
         * The value of dy is added to the original value of y to create the new y value.
         * @method offset
         * @param {Number} dx - The amount by which to offset the horizontal coordinate, x.
         * @param {Number} dy - The amount by which to offset the vertical coordinate, y.
         * @return {Point} This Point object. Useful for chaining method calls.
         **/
        public offset(dx: number, dy: number): Point {

            this.x += dx;
            this.y += dy;

            return this;

        }

        /**
         * Converts a pair of polar coordinates to a Cartesian point coordinate.
         * @method polar
         * @param {Number} length - The length coordinate of the polar pair.
         * @param {Number} angle - The angle, in radians, of the polar pair.
         * @return {Point} The new Cartesian Point object.
         **/
        public polar(length, angle) {

        }

        /**
         * Sets the x and y values of this Point object to the given coordinates.
         * @method setTo
         * @param {Number} x - The horizontal position of this point.
         * @param {Number} y - The vertical position of this point.
         * @return {Point} This Point object. Useful for chaining method calls.
         **/
        public setTo(x: number, y: number): Point {

            this.x = x;
            this.y = y;

            return this;

        }

        /**
         * Subtracts the coordinates of another point from the coordinates of this point to create a new point.
         * @method subtract
         * @param {Point} point - The point to be subtracted.
         * @param {Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
         * @return {Point} The new Point object.
         **/
        public subtract(point: Point, output?: Point = new Point): Point {

            return output.setTo(this.x - point.x, this.y - point.y);

        }

        /**
         * Returns a string representation of this object.
         * @method toString
         * @return {string} a string representation of the instance.
         **/
        public toString(): string {

            return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';

        }

    }

}