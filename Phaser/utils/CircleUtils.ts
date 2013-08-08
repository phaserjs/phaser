/// <reference path="../Game.ts" />
/// <reference path="../geom/Point.ts" />
/// <reference path="../geom/Rectangle.ts" />
/// <reference path="../geom/Circle.ts" />

/**
* Phaser - CircleUtils
*
* A collection of methods useful for manipulating and comparing Circle objects.
*
* TODO: 
*/

module Phaser {

    export class CircleUtils {

        /**
	     * Returns a new Circle object with the same values for the x, y, width, and height properties as the original Circle object.
	     * @method clone
         * @param {Circle} a - The Circle object.
	     * @param {Circle} [optional] out Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
	     * @return {Phaser.Circle}
	     **/
        static clone(a: Circle, out: Circle = new Circle): Circle {
            return out.setTo(a.x, a.y, a.diameter);
        }

        /**
	     * Return true if the given x/y coordinates are within the Circle object.
         * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
	     * @method contains
         * @param {Circle} a - The Circle object.
	     * @param {Number} The X value of the coordinate to test.
	     * @param {Number} The Y value of the coordinate to test.
	     * @return {Boolean} True if the coordinates are within this circle, otherwise false.
	     **/
        static contains(a: Circle, x: number, y: number): boolean {

            //  Check if x/y are within the bounds first
            if (x >= a.left && x <= a.right && y >= a.top && y <= a.bottom)
            {
                var dx: number = (a.x - x) * (a.x - x);
                var dy: number = (a.y - y) * (a.y - y);
                return (dx + dy) <= (a.radius * a.radius);
            }
            
            return false;

        }

        /**
	     * Return true if the coordinates of the given Point object are within this Circle object.
         * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
	     * @method containsPoint
         * @param {Circle} a - The Circle object.
	     * @param {Point} The Point object to test.
	     * @return {Boolean} True if the coordinates are within this circle, otherwise false.
	     **/
        static containsPoint(a: Circle, point:Point): boolean {
            return CircleUtils.contains(a, point.x, point.y);
        }

        /**
	     * Return true if the given Circle is contained entirely within this Circle object.
         * If you need details about the intersection then use Phaser.Intersect.circleToCircle instead.
	     * @method containsCircle
	     * @param {Circle} The Circle object to test.
	     * @return {Boolean} True if the coordinates are within this circle, otherwise false.
	     **/
        static containsCircle(a:Circle, b:Circle): boolean {
            //return ((a.radius + b.radius) * (a.radius + b.radius)) >= Collision.distanceSquared(a.x, a.y, b.x, b.y);
            return true;
        }

        /**
	     * Returns the distance from the center of the Circle object to the given object (can be Circle, Point or anything with x/y properties)
	     * @method distanceBetween
	     * @param {Circle} a - The Circle object.
	     * @param {Circle} b - The target object. Must have visible x and y properties that represent the center of the object.
	     * @param {Boolean} [optional] round - Round the distance to the nearest integer (default false)
	     * @return {Number} The distance between this Point object and the destination Point object.
	     **/
        static distanceBetween(a:Circle, target: any, round: boolean = false): number {

            var dx = a.x - target.x;
            var dy = a.y - target.y;

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
	     * Determines whether the two Circle objects match. This method compares the x, y and diameter properties.
	     * @method equals
         * @param {Circle} a - The first Circle object.
         * @param {Circle} b - The second Circle object.
	     * @return {Boolean} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
	     **/
        static equals(a:Circle, b: Circle): boolean {
            return (a.x == b.x && a.y == b.y && a.diameter == b.diameter);
        }

        /**
	     * Determines whether the two Circle objects intersect.
         * This method checks the radius distances between the two Circle objects to see if they intersect.
	     * @method intersects
         * @param {Circle} a - The first Circle object.
         * @param {Circle} b - The second Circle object.
	     * @return {Boolean} A value of true if the specified object intersects with this Circle object; otherwise false.
	     **/
        static intersects(a:Circle, b: Circle): boolean {
            return (CircleUtils.distanceBetween(a, b) <= (a.radius + b.radius));
        }

        /**
	     * Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
	     * @method circumferencePoint
         * @param {Circle} a - The first Circle object.
	     * @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
	     * @param {Boolean} asDegrees Is the given angle in radians (false) or degrees (true)?
	     * @param {Phaser.Point} [optional] output An optional Point object to put the result in to. If none specified a new Point object will be created.
	     * @return {Phaser.Point} The Point object holding the result.
	     **/
        static circumferencePoint(a:Circle, angle: number, asDegrees: boolean = false, out: Point = new Point): Point {

            if (asDegrees === true)
            {
                angle = angle * GameMath.DEG_TO_RAD;
            }

            return out.setTo(a.x + a.radius * Math.cos(angle), a.y + a.radius * Math.sin(angle));

        }


/*
public static boolean intersect(Rectangle r, Circle c)
{
    float cx = Math.abs(c.x - r.x - r.halfWidth);
    float xDist = r.halfWidth + c.radius;
    if (cx > xDist)
        return false;
    float cy = Math.abs(c.y - r.y - r.halfHeight);
    float yDist = r.halfHeight + c.radius;
    if (cy > yDist)
        return false;
    if (cx <= r.halfWidth || cy <= r.halfHeight)
        return true;
    float xCornerDist = cx - r.halfWidth;
    float yCornerDist = cy - r.halfHeight;
    float xCornerDistSq = xCornerDist * xCornerDist;
    float yCornerDistSq = yCornerDist * yCornerDist;
    float maxCornerDistSq = c.radius * c.radius;
    return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;
}
    */

        static intersectsRectangle(c: Circle, r: Rectangle): boolean {

            var cx: number = Math.abs(c.x - r.x - r.halfWidth);
            var xDist: number = r.halfWidth + c.radius;

            if (cx > xDist)
            {
                return false;
            }

            var cy: number = Math.abs(c.y - r.y - r.halfHeight);
            var yDist: number = r.halfHeight + c.radius;

            if (cy > yDist)
            {
                return false;
            }

            if (cx <= r.halfWidth || cy <= r.halfHeight)
            {
                return true;
            }

            var xCornerDist: number = cx - r.halfWidth;
            var yCornerDist: number = cy - r.halfHeight;
            var xCornerDistSq = xCornerDist * xCornerDist;
            var yCornerDistSq = yCornerDist * yCornerDist;
            var maxCornerDistSq = c.radius * c.radius;

            return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;

        }

    }

}