/// <reference path="../_definitions.ts" />
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/
var Phaser;
(function (Phaser) {
    /**
    * A collection of methods useful for manipulating and comparing Rectangle objects.
    *
    * @class RectangleUtils
    */
    var RectangleUtils = (function () {
        function RectangleUtils() { }
        RectangleUtils.getTopLeftAsPoint = /**
        * Get the location of the Rectangles top-left corner as a Point object.
        * @method getTopLeftAsPoint
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        */
        function getTopLeftAsPoint(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x, a.y);
        };
        RectangleUtils.getBottomRightAsPoint = /**
        * Get the location of the Rectangles bottom-right corner as a Point object.
        * @method getTopLeftAsPoint
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        **/
        function getBottomRightAsPoint(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.right, a.bottom);
        };
        RectangleUtils.inflate = /**
        * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
        * @method inflate
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Number} dx The amount to be added to the left side of the Rectangle.
        * @param {Number} dy The amount to be added to the bottom side of the Rectangle.
        * @return {Phaser.Rectangle} This Rectangle object.
        */
        function inflate(a, dx, dy) {
            a.x -= dx;
            a.width += 2 * dx;
            a.y -= dy;
            a.height += 2 * dy;
            return a;
        };
        RectangleUtils.inflatePoint = /**
        * Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
        * @method inflatePoint
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Point} point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
        * @return {Phaser.Rectangle} The Rectangle object.
        */
        function inflatePoint(a, point) {
            return Phaser.RectangleUtils.inflate(a, point.x, point.y);
        };
        RectangleUtils.size = /**
        * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
        * @method size
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
        * @return {Phaser.Point} The size of the Rectangle object
        */
        function size(a, output) {
            if (typeof output === "undefined") { output = new Phaser.Point(); }
            return output.setTo(a.width, a.height);
        };
        RectangleUtils.clone = /**
        * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
        * @method clone
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Phaser.Rectangle}
        */
        function clone(a, output) {
            if (typeof output === "undefined") { output = new Phaser.Rectangle(); }
            return output.setTo(a.x, a.y, a.width, a.height);
        };
        RectangleUtils.contains = /**
        * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
        * @method contains
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Number} x The x coordinate of the point to test.
        * @param {Number} y The y coordinate of the point to test.
        * @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
        */
        function contains(a, x, y) {
            return (x >= a.x && x <= a.right && y >= a.y && y <= a.bottom);
        };
        RectangleUtils.containsPoint = /**
        * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object. This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
        * @method containsPoint
        * @param {Phaser.Rectangle} a The Rectangle object.
        * @param {Phaser.Point} point The point object being checked. Can be Point or any object with .x and .y values.
        * @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
        */
        function containsPoint(a, point) {
            return Phaser.RectangleUtils.contains(a, point.x, point.y);
        };
        RectangleUtils.containsRect = /**
        * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
        * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
        * @method containsRect
        * @param {Phaser.Rectangle} a The first Rectangle object.
        * @param {Phaser.Rectangle} b The second Rectangle object.
        * @return {bool} A value of true if the Rectangle object contains the specified point; otherwise false.
        */
        function containsRect(a, b) {
            //	If the given rect has a larger volume than this one then it can never contain it
            if(a.volume > b.volume) {
                return false;
            }
            return (a.x >= b.x && a.y >= b.y && a.right <= b.right && a.bottom <= b.bottom);
        };
        RectangleUtils.equals = /**
        * Determines whether the two Rectangles are equal.
        * This method compares the x, y, width and height properties of each Rectangle.
        * @method equals
        * @param {Phaser.Rectangle} a The first Rectangle object.
        * @param {Phaser.Rectangle} b The second Rectangle object.
        * @return {bool} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
        */
        function equals(a, b) {
            return (a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height);
        };
        RectangleUtils.intersection = /**
        * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
        * @method intersection
        * @param {Phaser.Rectangle} a The first Rectangle object.
        * @param {Phaser.Rectangle} b The second Rectangle object.
        * @param {Phaser.Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Phaser.Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
        */
        function intersection(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Rectangle(); }
            if(Phaser.RectangleUtils.intersects(a, b)) {
                out.x = Math.max(a.x, b.x);
                out.y = Math.max(a.y, b.y);
                out.width = Math.min(a.right, b.right) - out.x;
                out.height = Math.min(a.bottom, b.bottom) - out.y;
            }
            return out;
        };
        RectangleUtils.intersects = /**
        * Determines whether the two Rectangles intersect with each other.
        * This method checks the x, y, width, and height properties of the Rectangles.
        * @method intersects
        * @param {Phaser.Rectangle} a The first Rectangle object.
        * @param {Phaser.Rectangle} b The second Rectangle object.
        * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
        * @return {bool} A value of true if the specified object intersects with this Rectangle object; otherwise false.
        */
        function intersects(a, b, tolerance) {
            if (typeof tolerance === "undefined") { tolerance = 0; }
            return !(a.left > b.right + tolerance || a.right < b.left - tolerance || a.top > b.bottom + tolerance || a.bottom < b.top - tolerance);
        };
        RectangleUtils.intersectsRaw = /**
        * Determines whether the object specified intersects (overlaps) with the given values.
        * @method intersectsRaw
        * @param {Number} left
        * @param {Number} right
        * @param {Number} top
        * @param {Number} bottomt
        * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
        * @return {bool} A value of true if the specified object intersects with the Rectangle; otherwise false.
        */
        function intersectsRaw(a, left, right, top, bottom, tolerance) {
            if (typeof tolerance === "undefined") { tolerance = 0; }
            return !(left > a.right + tolerance || right < a.left - tolerance || top > a.bottom + tolerance || bottom < a.top - tolerance);
        };
        RectangleUtils.union = /**
        * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
        * @method union
        * @param {Phaser.Rectangle} a The first Rectangle object.
        * @param {Phaser.Rectangle} b The second Rectangle object.
        * @param {Phaser.Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Phaser.Rectangle} A Rectangle object that is the union of the two Rectangles.
        */
        function union(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Rectangle(); }
            return out.setTo(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.right, b.right), Math.max(a.bottom, b.bottom));
        };
        return RectangleUtils;
    })();
    Phaser.RectangleUtils = RectangleUtils;    
})(Phaser || (Phaser = {}));
