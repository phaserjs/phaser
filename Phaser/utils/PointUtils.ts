/// <reference path="../_definitions.ts" />

/**
* Phaser - PointUtils
*
* A collection of methods useful for manipulating and comparing Point objects.
*
* TODO: interpolate & polar
*/

module Phaser {

    export class PointUtils {

        /**
         * Adds the coordinates of two points together to create a new point.
         * @method add
         * @param {Point} a - The first Point object.
         * @param {Point} b - The second Point object.
         * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
         * @return {Point} The new Point object.
         **/
        static add(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point = new Phaser.Point): Phaser.Point {
            return out.setTo(a.x + b.x, a.y + b.y);
        }

        /**
         * Subtracts the coordinates of two points to create a new point.
         * @method subtract
         * @param {Point} a - The first Point object.
         * @param {Point} b - The second Point object.
         * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
         * @return {Point} The new Point object.
         **/
        static subtract(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point = new Phaser.Point): Phaser.Point {
            return out.setTo(a.x - b.x, a.y - b.y);
        }

        /**
         * Multiplies the coordinates of two points to create a new point.
         * @method subtract
         * @param {Point} a - The first Point object.
         * @param {Point} b - The second Point object.
         * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
         * @return {Point} The new Point object.
         **/
        static multiply(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point = new Phaser.Point): Phaser.Point {
            return out.setTo(a.x * b.x, a.y * b.y);
        }

        /**
         * Divides the coordinates of two points to create a new point.
         * @method subtract
         * @param {Point} a - The first Point object.
         * @param {Point} b - The second Point object.
         * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
         * @return {Point} The new Point object.
         **/
        static divide(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point = new Phaser.Point): Phaser.Point {
            return out.setTo(a.x / b.x, a.y / b.y);
        }

        /**
         * Clamps the Point object values to be between the given min and max
         * @method clamp
         * @param {Point} a - The point.
         * @param {number} The minimum value to clamp this Point to
         * @param {number} The maximum value to clamp this Point to
         * @return {Point} This Point object.
         **/
        static clamp(a: Phaser.Point, min: number, max: number): Phaser.Point {

            Phaser.PointUtils.clampX(a, min, max);
            Phaser.PointUtils.clampY(a, min, max);
            return a;

        }

        /**
         * Clamps the x value of the given Point object to be between the min and max values.
         * @method clampX
         * @param {Point} a - The point.
         * @param {number} The minimum value to clamp this Point to
         * @param {number} The maximum value to clamp this Point to
         * @return {Point} This Point object.
         **/
        static clampX(a: Phaser.Point, min: number, max: number): Phaser.Point {

            a.x = Math.max(Math.min(a.x, max), min);
            return a;

        }

        /**
         * Clamps the y value of the given Point object to be between the min and max values.
         * @method clampY
         * @param {Point} a - The point.
         * @param {number} The minimum value to clamp this Point to
         * @param {number} The maximum value to clamp this Point to
         * @return {Point} This Point object.
         **/
        static clampY(a: Phaser.Point, min: number, max: number): Phaser.Point {

            a.y = Math.max(Math.min(a.y, max), min);
            return a;

        }

        /**
         * Creates a copy of the given Point.
         * @method clone
         * @param {Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
         * @return {Point} The new Point object.
         **/
        static clone(a: Phaser.Point, output: Phaser.Point = new Phaser.Point): Phaser.Point {
            return output.setTo(a.x, a.y);
        }

        /**
         * Returns the distance between the two given Point objects.
         * @method distanceBetween
         * @param {Point} a - The first Point object.
         * @param {Point} b - The second Point object.
         * @param {Boolean} round - Round the distance to the nearest integer (default false)
         * @return {Number} The distance between the two Point objects.
         **/
        static distanceBetween(a: Phaser.Point, b: Phaser.Point, round: boolean = false): number {

            var dx = a.x - b.x;
            var dy = a.y - b.y;

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
         * Determines whether the two given Point objects are equal. They are considered equal if they have the same x and y values.
         * @method equals
         * @param {Point} a - The first Point object.
         * @param {Point} b - The second Point object.
         * @return {Boolean} A value of true if the Points are equal, otherwise false.
         **/
        static equals(a: Phaser.Point, b: Phaser.Point): boolean {
            return (a.x == b.x && a.y == b.y);
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
        //static interpolate(pointA, pointB, f) {
        //}

        /**
         * Converts a pair of polar coordinates to a Cartesian point coordinate.
         * @method polar
         * @param {Number} length - The length coordinate of the polar pair.
         * @param {Number} angle - The angle, in radians, of the polar pair.
         * @return {Point} The new Cartesian Point object.
         **/
        //static polar(length, angle) {
        //}

        /**
        * Rotates a Point around the x/y coordinates given to the desired angle.
        * @param a {Point} The Point object to rotate.
	    * @param x {number} The x coordinate of the anchor point
	    * @param y {number} The y coordinate of the anchor point
        * @param {Number} angle The angle in radians (unless asDegrees is true) to rotate the Point to.
	    * @param {Boolean} asDegrees Is the given rotation in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the Point and the anchor.
        * @return The modified point object
        */
        static rotate(a: Phaser.Point, x: number, y: number, angle: number, asDegrees: boolean = false, distance: number = null): Phaser.Point {

            if (asDegrees)
            {
                angle = angle * Phaser.GameMath.DEG_TO_RAD;
            }

            //  Get distance from origin (cx/cy) to this point
            if (distance === null)
            {
                distance = Math.sqrt(((x - a.x) * (x - a.x)) + ((y - a.y) * (y - a.y)));
            }

            return a.setTo(x + distance * Math.cos(angle), y + distance * Math.sin(angle));

        }

        /**
        * Rotates a Point around the given Point to the desired angle.
        * @param a {Point} The Point object to rotate.
        * @param b {Point} The Point object to serve as point of rotation.
	    * @param x {number} The x coordinate of the anchor point
	    * @param y {number} The y coordinate of the anchor point
        * @param {Number} angle The angle in radians (unless asDegrees is true) to rotate the Point to.
	    * @param {Boolean} asDegrees Is the given rotation in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the Point and the anchor.
        * @return The modified point object
        */
        static rotateAroundPoint(a: Phaser.Point, b: Phaser.Point, angle: number, asDegrees: boolean = false, distance: number = null): Phaser.Point {
            return Phaser.PointUtils.rotate(a, b.x, b.y, angle, asDegrees, distance);
        }

    }

}