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
    * A collection of methods useful for manipulating and comparing Point objects.
    *
    * @class PointUtils
    */
    var PointUtils = (function () {
        function PointUtils() { }
        PointUtils.add = /**
        * Adds the coordinates of two points together to create a new point.
        * @method add
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        */
        function add(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x + b.x, a.y + b.y);
        };
        PointUtils.subtract = /**
        * Subtracts the coordinates of two points to create a new point.
        * @method subtract
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        */
        function subtract(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x - b.x, a.y - b.y);
        };
        PointUtils.multiply = /**
        * Multiplies the coordinates of two points to create a new point.
        * @method subtract
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        */
        function multiply(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x * b.x, a.y * b.y);
        };
        PointUtils.divide = /**
        * Divides the coordinates of two points to create a new point.
        * @method subtract
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @param {Phaser.Point} out Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Phaser.Point} The new Point object.
        */
        function divide(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x / b.x, a.y / b.y);
        };
        PointUtils.clamp = /**
        * Clamps the Point object values to be between the given min and max
        * @method clamp
        * @param {Phaser.Point} a The point.
        * @param {Number} min The minimum value to clamp this Point to
        * @param {Number} max The maximum value to clamp this Point to
        * @return {Phaser.Point} This Point object.
        */
        function clamp(a, min, max) {
            Phaser.PointUtils.clampX(a, min, max);
            Phaser.PointUtils.clampY(a, min, max);
            return a;
        };
        PointUtils.clampX = /**
        * Clamps the x value of the given Point object to be between the min and max values.
        * @method clampX
        * @param {Phaser.Point} a The point.
        * @param {Number} min The minimum value to clamp this Point to
        * @param {Number} max The maximum value to clamp this Point to
        * @return {Phaser.Point} This Point object.
        */
        function clampX(a, min, max) {
            a.x = Math.max(Math.min(a.x, max), min);
            return a;
        };
        PointUtils.clampY = /**
        * Clamps the y value of the given Point object to be between the min and max values.
        * @method clampY
        * @param {Phaser.Point} a The point.
        * @param {Number} min The minimum value to clamp this Point to
        * @param {Number} max The maximum value to clamp this Point to
        * @return {Phaser.Point} This Point object.
        */
        function clampY(a, min, max) {
            a.y = Math.max(Math.min(a.y, max), min);
            return a;
        };
        PointUtils.clone = /**
        * Creates a copy of the given Point.
        * @method clone
        * @param {Phaser.Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
        * @return {Phaser.Point} The new Point object.
        */
        function clone(a, output) {
            if (typeof output === "undefined") { output = new Phaser.Point(); }
            return output.setTo(a.x, a.y);
        };
        PointUtils.distanceBetween = /**
        * Returns the distance between the two given Point objects.
        * @method distanceBetween
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @param {bool} round Round the distance to the nearest integer (default false)
        * @return {Number} The distance between the two Point objects.
        */
        function distanceBetween(a, b, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            if(round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        PointUtils.equals = /**
        * Determines whether the two given Point objects are equal. They are considered equal if they have the same x and y values.
        * @method equals
        * @param {Phaser.Point} a The first Point object.
        * @param {Phaser.Point} b The second Point object.
        * @return {bool} A value of true if the Points are equal, otherwise false.
        */
        function equals(a, b) {
            return (a.x == b.x && a.y == b.y);
        };
        PointUtils.rotate = /**
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
        function rotate(a, x, y, angle, asDegrees, distance) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof distance === "undefined") { distance = null; }
            if(asDegrees) {
                angle = angle * Phaser.GameMath.DEG_TO_RAD;
            }
            //  Get distance from origin (cx/cy) to this point
            if(distance === null) {
                distance = Math.sqrt(((x - a.x) * (x - a.x)) + ((y - a.y) * (y - a.y)));
            }
            return a.setTo(x + distance * Math.cos(angle), y + distance * Math.sin(angle));
        };
        PointUtils.rotateAroundPoint = /**
        * Rotates a Point around the given Point to the desired angle.
        * @method rotateAroundPoint
        * @param {Phaser.Point} a The Point object to rotate.
        * @param {Phaser.Point} b The Point object to serve as point of rotation.
        * @param {Number} angle The angle in radians (unless asDegrees is true) to rotate the Point to.
        * @param {bool} asDegrees Is the given rotation in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the Point and the anchor.
        * @return {Phaser.Point} The modified point object
        */
        function rotateAroundPoint(a, b, angle, asDegrees, distance) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof distance === "undefined") { distance = null; }
            return Phaser.PointUtils.rotate(a, b.x, b.y, angle, asDegrees, distance);
        };
        return PointUtils;
    })();
    Phaser.PointUtils = PointUtils;    
})(Phaser || (Phaser = {}));
