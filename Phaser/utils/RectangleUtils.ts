/// <reference path="../_definitions.ts" />

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/
module Phaser {

    /**
    * A collection of methods useful for manipulating and comparing Rectangle objects.
    *
    * @class RectangleUtils
    */
    export class RectangleUtils {

        /**
        * Get the location of the Rectangles top-left corner as a Point object.
        * @method getTopLeftAsPoint
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        */
        public static getTopLeftAsPoint(a: Phaser.Rectangle, out: Phaser.Point = new Phaser.Point): Phaser.Point {
            return out.setTo(a.x, a.y);
        }

        /**
        * Get the location of the Rectangles bottom-right corner as a Point object.
        * @method getTopLeftAsPoint
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        **/
        public static getBottomRightAsPoint(a: Phaser.Rectangle, out: Phaser.Point = new Phaser.Point): Phaser.Point {
            return out.setTo(a.right, a.bottom);
        }

        /**
        * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
        * @method inflate
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Number} dx The amount to be added to the left side of the Rectangle.
        * @param {Number} dy The amount to be added to the bottom side of the Rectangle.
        * @return {Phaser.Rectangle} This Rectangle object.
        */
        public static inflate(a: Phaser.Rectangle, dx: number, dy: number): Phaser.Rectangle {

            a.x -= dx;
            a.width += 2 * dx;

            a.y -= dy;
            a.height += 2 * dy;

            return a;

        }

        /**
        * Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
        * @method inflatePoint
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Point} point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
        * @return {Phaser.Rectangle} The Rectangle object.
        */
        public static inflatePoint(a: Phaser.Rectangle, point: Phaser.Point): Phaser.Rectangle {
            return Phaser.RectangleUtils.inflate(a, point.x, point.y);
        }

        /**
        * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
        * @method size
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
        * @return {Phaser.Point} The size of the Rectangle object
        */
        public static size(a: Phaser.Rectangle, output: Phaser.Point = new Phaser.Point): Phaser.Point {
            return output.setTo(a.width, a.height);
        }

        /**
        * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
        * @method clone
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Phaser.Rectangle}
        */
        public static clone(a: Phaser.Rectangle, output: Phaser.Rectangle = new Phaser.Rectangle): Phaser.Rectangle {
            return output.setTo(a.x, a.y, a.width, a.height);
        }

        /**
        * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
        * @method contains
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Number} x The x coordinate of the point to test.
        * @param {Number} y The y coordinate of the point to test.
        * @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
        */
        public static contains(a: Phaser.Rectangle, x: number, y: number): bool {
            return (x >= a.x && x <= a.right && y >= a.y && y <= a.bottom);
        }

        /**
        * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object. This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
        * @method containsPoint
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Point} point The point object being checked. Can be Point or any object with .x and .y values.
        * @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
        */
        public static containsPoint(a: Phaser.Rectangle, point: Phaser.Point): bool {
            return Phaser.RectangleUtils.contains(a, point.x, point.y);
        }

        /**
        * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
        * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
        * @method containsRect
        * @param {Phaser.Rectangle} a The first Rectangle object.
        * @param {Phaser.Rectangle} b The second Rectangle object.
        * @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
        */
        public static containsRect(a: Phaser.Rectangle, b: Phaser.Rectangle): bool {

            //	If the given rect has a larger volume than this one then it can never contain it
            if (a.volume > b.volume)
            {
                return false;
            }

            return (a.x >= b.x && a.y >= b.y && a.right <= b.right && a.bottom <= b.bottom);

        }

        /**
        * Determines whether the two Rectangles are equal.
        * This method compares the x, y, width and height properties of each Rectangle.
        * @method equals
        * @param {Phaser.Rectangle} a The first Rectangle object.
        * @param {Phaser.Rectangle} b The second Rectangle object.
        * @return {bool} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
        */
        public static equals(a: Phaser.Rectangle, b: Phaser.Rectangle): bool {
            return (a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height);
        }

        /**
        * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
        * @method intersection
        * @param {Phaser.Rectangle} a The first Rectangle object.
        * @param {Phaser.Rectangle} b The second Rectangle object.
        * @param {Phaser.Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Phaser.Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
        */
        public static intersection(a: Phaser.Rectangle, b: Phaser.Rectangle, out: Phaser.Rectangle = new Phaser.Rectangle): Phaser.Rectangle {

            if (Phaser.RectangleUtils.intersects(a, b))
            {
                out.x = Math.max(a.x, b.x);
                out.y = Math.max(a.y, b.y);
                out.width = Math.min(a.right, b.right) - out.x;
                out.height = Math.min(a.bottom, b.bottom) - out.y;
            }

            return out;

        }

        /**
        * Determines whether the two Rectangles intersect with each other.
        * This method checks the x, y, width, and height properties of the Rectangles.
        * @method intersects
        * @param {Phaser.Rectangle} a The first Rectangle object.
        * @param {Phaser.Rectangle} b The second Rectangle object.
        * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
        * @return {bool} A value of true if the specified object intersects with this Rectangle object; otherwise false.
        */
        public static intersects(a: Phaser.Rectangle, b: Phaser.Rectangle, tolerance: number = 0): bool {
            return !(a.left > b.right + tolerance || a.right < b.left - tolerance || a.top > b.bottom + tolerance || a.bottom < b.top - tolerance);
        }

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
        public static intersectsRaw(a: Phaser.Rectangle, left: number, right: number, top: number, bottom: number, tolerance: number = 0): bool {
            return !(left > a.right + tolerance || right < a.left - tolerance || top > a.bottom + tolerance || bottom < a.top - tolerance);
        }

        /**
        * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
        * @method union
        * @param {Phaser.Rectangle} a The first Rectangle object.
        * @param {Phaser.Rectangle} b The second Rectangle object.
        * @param {Phaser.Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Phaser.Rectangle} A Rectangle object that is the union of the two Rectangles.
        */
        public static union(a: Phaser.Rectangle, b: Phaser.Rectangle, out: Phaser.Rectangle = new Phaser.Rectangle): Phaser.Rectangle {
            return out.setTo(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.right, b.right), Math.max(a.bottom, b.bottom));
        }

    }

}