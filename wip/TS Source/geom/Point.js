/// <reference path="../_definitions.ts" />
/**
* Phaser - Point
*
* The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
*/
var Phaser;
(function (Phaser) {
    var Point = (function () {
        /**
        * Creates a new Point. If you pass no parameters a Point is created set to (0,0).
        * @class Point
        * @constructor
        * @param {Number} x The horizontal position of this Point (default 0)
        * @param {Number} y The vertical position of this Point (default 0)
        **/
        function Point(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.copyFrom = /**
        * Copies the x and y properties from any given object to this Point.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {Point} This Point object.
        **/
        function (source) {
            return this.setTo(source.x, source.y);
        };
        Point.prototype.invert = /**
        * Inverts the x and y values of this Point
        * @method invert
        * @return {Point} This Point object.
        **/
        function () {
            return this.setTo(this.y, this.x);
        };
        Point.prototype.setTo = /**
        * Sets the x and y values of this MicroPoint object to the given coordinates.
        * @method setTo
        * @param {Number} x - The horizontal position of this point.
        * @param {Number} y - The vertical position of this point.
        * @return {MicroPoint} This MicroPoint object. Useful for chaining method calls.
        **/
        function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Point.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        function () {
            return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
        };
        return Point;
    })();
    Phaser.Point = Point;    
})(Phaser || (Phaser = {}));
