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
    * A collection of methods useful for manipulating and comparing Circle objects.
    *
    * @class CircleUtils
    */
    var CircleUtils = (function () {
        function CircleUtils() { }
        CircleUtils.clone = /**
        * Returns a new Circle object with the same values for the x, y, width, and height properties as the given Circle object.
        * @method clone
        * @param {Phaser.Circle} a The Circle object to be cloned.
        * @param {Phaser.Circle} out Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
        * @return {Phaser.Circle} The cloned Circle object.
        */
        function clone(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Circle(); }
            return out.setTo(a.x, a.y, a.diameter);
        };
        CircleUtils.contains = /**
        * Return true if the given x/y coordinates are within the Circle object.
        * @method contains
        * @param {Phaser.Circle} a The Circle to be checked.
        * @param {Number} x The X value of the coordinate to test.
        * @param {Number} y The Y value of the coordinate to test.
        * @return {bool} True if the coordinates are within this circle, otherwise false.
        */
        function contains(a, x, y) {
            //  Check if x/y are within the bounds first
            if(x >= a.left && x <= a.right && y >= a.top && y <= a.bottom) {
                var dx = (a.x - x) * (a.x - x);
                var dy = (a.y - y) * (a.y - y);
                return (dx + dy) <= (a.radius * a.radius);
            }
            return false;
        };
        CircleUtils.containsPoint = /**
        * Return true if the coordinates of the given Point object are within this Circle object.
        * @method containsPoint
        * @param {Phaser.Circle} a The Circle object.
        * @param {Phaser.Point} point The Point object to test.
        * @return {bool} True if the coordinates are within this circle, otherwise false.
        */
        function containsPoint(a, point) {
            return CircleUtils.contains(a, point.x, point.y);
        };
        CircleUtils.containsCircle = /**
        * Return true if the given Circle is contained entirely within this Circle object.
        * @method containsCircle
        * @param {Phaser.Circle} a The Circle object to test.
        * @param {Phaser.Circle} b The Circle object to test.
        * @return {bool} True if Circle B is contained entirely inside of Circle A, otherwise false.
        */
        function containsCircle(a, b) {
            //return ((a.radius + b.radius) * (a.radius + b.radius)) >= Collision.distanceSquared(a.x, a.y, b.x, b.y);
            return true;
        };
        CircleUtils.distanceBetween = /**
        * Returns the distance from the center of the Circle object to the given object
        * (can be Circle, Point or anything with x/y properties)
        * @method distanceBetween
        * @param {Phaser.Circle} a The Circle object.
        * @param {Phaser.Circle} b The target object. Must have visible x and y properties that represent the center of the object.
        * @param {bool} [optional] round Round the distance to the nearest integer (default false)
        * @return {Number} The distance between this Point object and the destination Point object.
        */
        function distanceBetween(a, target, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = a.x - target.x;
            var dy = a.y - target.y;
            if(round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        CircleUtils.equals = /**
        * Determines whether the two Circle objects match. This method compares the x, y and diameter properties.
        * @method equals
        * @param {Phaser.Circle} a The first Circle object.
        * @param {Phaser.Circle} b The second Circle object.
        * @return {bool} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
        */
        function equals(a, b) {
            return (a.x == b.x && a.y == b.y && a.diameter == b.diameter);
        };
        CircleUtils.intersects = /**
        * Determines whether the two Circle objects intersect.
        * This method checks the radius distances between the two Circle objects to see if they intersect.
        * @method intersects
        * @param {Phaser.Circle} a The first Circle object.
        * @param {Phaser.Circle} b The second Circle object.
        * @return {bool} A value of true if the specified object intersects with this Circle object; otherwise false.
        */
        function intersects(a, b) {
            return (Phaser.CircleUtils.distanceBetween(a, b) <= (a.radius + b.radius));
        };
        CircleUtils.circumferencePoint = /**
        * Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
        * @method circumferencePoint
        * @param {Phaser.Circle} a The first Circle object.
        * @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
        * @param {bool} asDegrees Is the given angle in radians (false) or degrees (true)?
        * @param {Phaser.Point} [optional] output An optional Point object to put the result in to. If none specified a new Point object will be created.
        * @return {Phaser.Point} The Point object holding the result.
        */
        function circumferencePoint(a, angle, asDegrees, out) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            if(asDegrees === true) {
                angle = angle * Phaser.GameMath.DEG_TO_RAD;
            }
            return out.setTo(a.x + a.radius * Math.cos(angle), a.y + a.radius * Math.sin(angle));
        };
        CircleUtils.intersectsRectangle = /**
        * Checks if the given Circle and Rectangle objects intersect.
        * @method intersectsRectangle
        * @param {Phaser.Circle} c The Circle object to test.
        * @param {Phaser.Rectangle} r The Rectangle object to test.
        * @return {bool} True if the two objects intersect, otherwise false.
        */
        function intersectsRectangle(c, r) {
            var cx = Math.abs(c.x - r.x - r.halfWidth);
            var xDist = r.halfWidth + c.radius;
            if(cx > xDist) {
                return false;
            }
            var cy = Math.abs(c.y - r.y - r.halfHeight);
            var yDist = r.halfHeight + c.radius;
            if(cy > yDist) {
                return false;
            }
            if(cx <= r.halfWidth || cy <= r.halfHeight) {
                return true;
            }
            var xCornerDist = cx - r.halfWidth;
            var yCornerDist = cy - r.halfHeight;
            var xCornerDistSq = xCornerDist * xCornerDist;
            var yCornerDistSq = yCornerDist * yCornerDist;
            var maxCornerDistSq = c.radius * c.radius;
            return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;
        };
        return CircleUtils;
    })();
    Phaser.CircleUtils = CircleUtils;    
})(Phaser || (Phaser = {}));
