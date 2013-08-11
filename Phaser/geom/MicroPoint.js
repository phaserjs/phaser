/// <reference path="../Game.ts" />
/**
* Phaser - MicroPoint
*
* The MicroPoint object represents a location in a two-dimensional coordinate system,
* where x represents the horizontal axis and y represents the vertical axis.
* It is different to the Point class in that it doesn't contain any of the help methods like add/substract/distanceTo, etc.
* Use a MicroPoint when all you literally need is a solid container for x and y (such as in the Rectangle class).
*/
var Phaser;
(function (Phaser) {
    var MicroPoint = (function () {
        /**
        * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
        * @class MicroPoint
        * @constructor
        * @param {Number} x The horizontal position of this point (default 0)
        * @param {Number} y The vertical position of this point (default 0)
        **/
        function MicroPoint(x, y, parent) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof parent === "undefined") { parent = null; }
            this._x = x;
            this._y = y;
            this.parent = parent;
        }
        Object.defineProperty(MicroPoint.prototype, "x", {
            get: /**
            * The x coordinate of the top-left corner of the rectangle
            * @property x
            * @type Number
            **/
            function () {
                return this._x;
            },
            set: /**
            * The x coordinate of the top-left corner of the rectangle
            * @property x
            * @type Number
            **/
            function (value) {
                this._x = value;
                if(this.parent) {
                    this.parent.updateBounds();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MicroPoint.prototype, "y", {
            get: /**
            * The y coordinate of the top-left corner of the rectangle
            * @property y
            * @type Number
            **/
            function () {
                return this._y;
            },
            set: /**
            * The y coordinate of the top-left corner of the rectangle
            * @property y
            * @type Number
            **/
            function (value) {
                this._y = value;
                if(this.parent) {
                    this.parent.updateBounds();
                }
            },
            enumerable: true,
            configurable: true
        });
        MicroPoint.prototype.copyFrom = /**
        * Copies the x and y values from any given object to this MicroPoint.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {MicroPoint} This MicroPoint object. Useful for chaining method calls.
        **/
        function (source) {
            return this.setTo(source.x, source.y);
        };
        MicroPoint.prototype.copyTo = /**
        * Copies the x and y values from this MicroPoint to any given object.
        * @method copyTo
        * @param {any} target - The object to copy to.
        * @return {any} The target object.
        **/
        function (target) {
            target.x = this._x;
            target.y = this._y;
            return target;
        };
        MicroPoint.prototype.setTo = /**
        * Sets the x and y values of this MicroPoint object to the given coordinates.
        * @method setTo
        * @param {Number} x - The horizontal position of this point.
        * @param {Number} y - The vertical position of this point.
        * @return {MicroPoint} This MicroPoint object. Useful for chaining method calls.
        **/
        function (x, y, callParent) {
            if (typeof callParent === "undefined") { callParent = true; }
            this._x = x;
            this._y = y;
            if(this.parent != null && callParent == true) {
                this.parent.updateBounds();
            }
            return this;
        };
        MicroPoint.prototype.equals = /**
        * Determines whether this MicroPoint object and the given object are equal. They are equal if they have the same x and y values.
        * @method equals
        * @param {any} point - The object to compare against. Must have x and y properties.
        * @return {Boolean} A value of true if the object is equal to this MicroPoin object; false if it is not equal.
        **/
        function (toCompare) {
            if(this._x === toCompare.x && this._y === toCompare.y) {
                return true;
            } else {
                return false;
            }
        };
        MicroPoint.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        function () {
            return '[{MicroPoint (x=' + this._x + ' y=' + this._y + ')}]';
        };
        return MicroPoint;
    })();
    Phaser.MicroPoint = MicroPoint;    
})(Phaser || (Phaser = {}));
