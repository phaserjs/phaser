/// <reference path="../_definitions.ts" />

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/
module Phaser {

    /**
    * A collection of methods useful for manipulating and comparing Point objects.
    *
    * @class PointUtils
    */
    export class PointUtils {

        /**
        * Adds the coordinates of two points together to create a new point.
        * @method add
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        */
        public static add(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point = new Phaser.Point): Phaser.Point {
            return out.setTo(a.x + b.x, a.y + b.y);
        }

        /**
        * Subtracts the coordinates of two points to create a new point.
        * @method subtract
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        */
        public static subtract(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point = new Phaser.Point): Phaser.Point {
            return out.setTo(a.x - b.x, a.y - b.y);
        }

        /**
        * Multiplies the coordinates of two points to create a new point.
        * @method subtract
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        */
        public static multiply(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point = new Phaser.Point): Phaser.Point {
            return out.setTo(a.x * b.x, a.y * b.y);
        }

        /**
        * Divides the coordinates of two points to create a new point.
        * @method subtract
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        */
        public static divide(a: Phaser.Point, b: Phaser.Point, out: Phaser.Point = new Phaser.Point): Phaser.Point {
            return out.setTo(a.x / b.x, a.y / b.y);
        }

        /**
        * Clamps the Point object values to be between the given min and max
        * @method clamp
        * @param {Phaser.Point} a The point.
        * @param {Number} min The minimum value to clamp this Point to
        * @param {Number} max The maximum value to clamp this Point to
        * @return {Phaser.Point} This Point object.
        */
        public static clamp(a: Phaser.Point, min: number, max: number): Phaser.Point {

            Phaser.PointUtils.clampX(a, min, max);
            Phaser.PointUtils.clampY(a, min, max);
            return a;

        }

        /**
        * Clamps the x value of the given Point object to be between the min and max values.
        * @method clampX
        * @param {Phaser.Point} a The point.
        * @param {Number} min The minimum value to clamp this Point to
        * @param {Number} max The maximum value to clamp this Point to
        * @return {Phaser.Point} This Point object.
        */
        public static clampX(a: Phaser.Point, min: number, max: number): Phaser.Point {

            a.x = Math.max(Math.min(a.x, max), min);
            return a;

        }

        /**
        * Clamps the y value of the given Point object to be between the min and max values.
        * @method clampY
        * @param {Phaser.Point} a The point.
        * @param {Number} min The minimum value to clamp this Point to
        * @param {Number} max The maximum value to clamp this Point to
        * @return {Phaser.Point} This Point object.
        */
        public static clampY(a: Phaser.Point, min: number, max: number): Phaser.Point {

            a.y = Math.max(Math.min(a.y, max), min);
            return a;

        }

        /**
        * Creates a copy of the given Point.
        * @method clone
        * @param {Phaser.Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
        * @return {Phaser.Point} The new Point object.
        */
        public static clone(a: Phaser.Point, output: Phaser.Point = new Phaser.Point): Phaser.Point {
            return output.setTo(a.x, a.y);
        }

        /**
        * Returns the distance between the two given Point objects.
        * @method distanceBetween
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @param {bool} round Round the distance to the nearest integer (default false)
        * @return {Number} The distance between the two Point objects.
        */
        public static distanceBetween(a: Phaser.Point, b: Phaser.Point, round: bool = false): number {

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
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @return {bool} A value of true if the Points are equal, otherwise false.
        */
        public static equals(a: Phaser.Point, b: Phaser.Point): bool {
            return (a.x == b.x && a.y == b.y);
        }

        /**
        * Determines a point between two specified points. The parameter f determines where the new interpolated point is located relative to the two end points specified by parameters pt1 and pt2.
        * The closer the value of the parameter f is to 1.0, the closer the interpolated point is to the first point (parameter pt1). The closer the value of the parameter f is to 0, the closer the interpolated point is to the second point (parameter pt2).
        * @method interpolate
        * @param {Phaser.Point} pointA The first Point object.
        * @param {Phaser.Point} pointB The second Point object.
        * @param {Number} f The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
        * @return {Phaser.Point} The new interpolated Point object.
        */
        //public static interpolate(pointA, pointB, f) {
        // TODO!
        //}

        /**
        * Converts a pair of polar coordinates to a Cartesian point coordinate.
        * @method polar
        * @param {Number} length The length coordinate of the polar pair.
        * @param {Number} angle The angle, in radians, of the polar pair.
        * @return {Phaser.Point} The new Cartesian Point object.
        */
        //public static polar(length, angle) {
        // TODO!
        //}

        /**
        * Rotates a Point around the x/y coordinates given to the desired angle.
        * @method rotate
        * @param {Phaser.Point} a The Point object to rotate.
	    * @param {Number} x The x coordinate of the anchor point
	    * @param {Number} y The y coordinate of the anchor point
        * @param {Number} angle The angle in radians (unless asDegrees is true) to rotate the Point to.
	    * @param {bool} asDegrees Is the given rotation in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the Point and the anchor.
        * @return {Phaser.Point} The modified point object
        */
        public static rotate(a: Phaser.Point, x: number, y: number, angle: number, asDegrees: bool = false, distance: number = null): Phaser.Point {

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
        * @method rotateAroundPoint
        * @param {Phaser.Point} a The Point object to rotate.
        * @param {Phaser.Point} b The Point object to serve as point of rotation.
	    * @param {Number} angle The angle in radians (unless asDegrees is true) to rotate the Point to.
	    * @param {bool} asDegrees Is the given rotation in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the Point and the anchor.
        * @return {Phaser.Point} The modified point object
        */
        public static rotateAroundPoint(a: Phaser.Point, b: Phaser.Point, angle: number, asDegrees: bool = false, distance: number = null): Phaser.Point {
            return Phaser.PointUtils.rotate(a, b.x, b.y, angle, asDegrees, distance);
        }

    }

}