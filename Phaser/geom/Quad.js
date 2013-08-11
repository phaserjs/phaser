/// <reference path="../Game.ts" />
/**
* Phaser - Quad
*
* A Quad object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
* Very much like a Rectangle only without all of the additional methods and properties of that class.
*/
var Phaser;
(function (Phaser) {
    var Quad = (function () {
        /**
        * Creates a new Quad object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a rectangle with x, y, width, and height properties set to 0 is created.
        * @class Quad
        * @constructor
        * @param {Number} x The x coordinate of the top-left corner of the quad.
        * @param {Number} y The y coordinate of the top-left corner of the quad.
        * @param {Number} width The width of the quad.
        * @param {Number} height The height of the quad.
        * @return {Quad } This object
        **/
        function Quad(x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            this.setTo(x, y, width, height);
        }
        Quad.prototype.setTo = /**
        * Sets the Quad to the specified size.
        * @method setTo
        * @param {Number} x The x coordinate of the top-left corner of the quad.
        * @param {Number} y The y coordinate of the top-left corner of the quad.
        * @param {Number} width The width of the quad.
        * @param {Number} height The height of the quad.
        * @return {Quad} This object
        **/
        function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        };
        Object.defineProperty(Quad.prototype, "left", {
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quad.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quad.prototype, "top", {
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quad.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quad.prototype, "halfWidth", {
            get: function () {
                return this.width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quad.prototype, "halfHeight", {
            get: function () {
                return this.height / 2;
            },
            enumerable: true,
            configurable: true
        });
        Quad.prototype.intersects = /**
        * Determines whether the object specified intersects (overlaps) with this Quad object.
        * This method checks the x, y, width, and height properties of the specified Quad object to see if it intersects with this Quad object.
        * @method intersects
        * @param {Object} q The object to check for intersection with this Quad. Must have left/right/top/bottom properties (Rectangle, Quad).
        * @param {Number} t A tolerance value to allow for an intersection test with padding, default to 0
        * @return {Boolean} A value of true if the specified object intersects with this Quad; otherwise false.
        **/
        function (q, t) {
            if (typeof t === "undefined") { t = 0; }
            return !(q.left > this.right + t || q.right < this.left - t || q.top > this.bottom + t || q.bottom < this.top - t);
        };
        Quad.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        function () {
            return "[{Quad (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")}]";
        };
        return Quad;
    })();
    Phaser.Quad = Quad;    
})(Phaser || (Phaser = {}));
