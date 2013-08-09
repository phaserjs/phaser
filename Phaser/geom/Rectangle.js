/// <reference path="../_definitions.ts" />
/**
*	Rectangle
*
*	@desc 		A Rectangle object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
*
*	@version 	1.6 - 24th May 2013
*	@author 	Richard Davey
*/
var Phaser;
(function (Phaser) {
    var Rectangle = (function () {
        /**
        * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a Rectangle with x, y, width, and height properties set to 0 is created.
        * @class Rectangle
        * @constructor
        * @param {Number} x The x coordinate of the top-left corner of the Rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the Rectangle.
        * @param {Number} width The width of the Rectangle in pixels.
        * @param {Number} height The height of the Rectangle in pixels.
        * @return {Rectangle} This Rectangle object
        **/
        function Rectangle(x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Object.defineProperty(Rectangle.prototype, "halfWidth", {
            get: /**
            * Half of the width of the Rectangle
            * @property halfWidth
            * @type Number
            **/
            function () {
                return Math.round(this.width / 2);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Rectangle.prototype, "halfHeight", {
            get: /**
            * Half of the height of the Rectangle
            * @property halfHeight
            * @type Number
            **/
            function () {
                return Math.round(this.height / 2);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Rectangle.prototype, "bottom", {
            get: /**
            * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
            * @method bottom
            * @return {Number}
            **/
            function () {
                return this.y + this.height;
            },
            set: /**
            * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
            * @method bottom
            * @param {Number} value
            **/
            function (value) {
                if (value <= this.y) {
                    this.height = 0;
                } else {
                    this.height = (this.y - value);
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Rectangle.prototype, "bottomRight", {
            set: /**
            * Sets the bottom-right corner of the Rectangle, determined by the values of the given Point object.
            * @method bottomRight
            * @param {Point} value
            **/
            function (value) {
                this.right = value.x;
                this.bottom = value.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Rectangle.prototype, "left", {
            get: /**
            * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
            * @method left
            * @ return {number}
            **/
            function () {
                return this.x;
            },
            set: /**
            * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties.
            * However it does affect the width, whereas changing the x value does not affect the width property.
            * @method left
            * @param {Number} value
            **/
            function (value) {
                if (value >= this.right) {
                    this.width = 0;
                } else {
                    this.width = this.right - value;
                }

                this.x = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Rectangle.prototype, "right", {
            get: /**
            * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
            * However it does affect the width property.
            * @method right
            * @return {Number}
            **/
            function () {
                return this.x + this.width;
            },
            set: /**
            * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
            * However it does affect the width property.
            * @method right
            * @param {Number} value
            **/
            function (value) {
                if (value <= this.x) {
                    this.width = 0;
                } else {
                    this.width = this.x + value;
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Rectangle.prototype, "volume", {
            get: /**
            * The volume of the Rectangle derived from width * height
            * @method volume
            * @return {Number}
            **/
            function () {
                return this.width * this.height;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Rectangle.prototype, "perimeter", {
            get: /**
            * The perimeter size of the Rectangle. This is the sum of all 4 sides.
            * @method perimeter
            * @return {Number}
            **/
            function () {
                return (this.width * 2) + (this.height * 2);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Rectangle.prototype, "top", {
            get: /**
            * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
            * However it does affect the height property, whereas changing the y value does not affect the height property.
            * @method top
            * @return {Number}
            **/
            function () {
                return this.y;
            },
            set: /**
            * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
            * However it does affect the height property, whereas changing the y value does not affect the height property.
            * @method top
            * @param {Number} value
            **/
            function (value) {
                if (value >= this.bottom) {
                    this.height = 0;
                    this.y = value;
                } else {
                    this.height = (this.bottom - value);
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Rectangle.prototype, "topLeft", {
            set: /**
            * The location of the Rectangles top-left corner, determined by the x and y coordinates of the Point.
            * @method topLeft
            * @param {Point} value
            **/
            function (value) {
                this.x = value.x;
                this.y = value.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Rectangle.prototype, "empty", {
            get: /**
            * Determines whether or not this Rectangle object is empty.
            * @method isEmpty
            * @return {Boolean} A value of true if the Rectangle objects width or height is less than or equal to 0; otherwise false.
            **/
            function () {
                return (!this.width || !this.height);
            },
            set: /**
            * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
            * @method setEmpty
            * @return {Rectangle} This Rectangle object
            **/
            function (value) {
                this.setTo(0, 0, 0, 0);
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
        * @method offset
        * @param {Number} dx Moves the x value of the Rectangle object by this amount.
        * @param {Number} dy Moves the y value of the Rectangle object by this amount.
        * @return {Rectangle} This Rectangle object.
        **/
        Rectangle.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;

            return this;
        };

        /**
        * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
        * @method offsetPoint
        * @param {Point} point A Point object to use to offset this Rectangle object.
        * @return {Rectangle} This Rectangle object.
        **/
        Rectangle.prototype.offsetPoint = function (point) {
            return this.offset(point.x, point.y);
        };

        /**
        * Sets the members of Rectangle to the specified values.
        * @method setTo
        * @param {Number} x The x coordinate of the top-left corner of the Rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the Rectangle.
        * @param {Number} width The width of the Rectangle in pixels.
        * @param {Number} height The height of the Rectangle in pixels.
        * @return {Rectangle} This Rectangle object
        **/
        Rectangle.prototype.setTo = function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;

            return this;
        };

        /**
        * Runs Math.floor() on both the x and y values of this Rectangle.
        * @method floor
        **/
        Rectangle.prototype.floor = function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
        };

        /**
        * Copies the x, y, width and height properties from any given object to this Rectangle.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {Rectangle} This Rectangle object.
        **/
        Rectangle.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y, source.width, source.height);
        };

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        Rectangle.prototype.toString = function () {
            return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.empty + ")}]";
        };
        return Rectangle;
    })();
    Phaser.Rectangle = Rectangle;
})(Phaser || (Phaser = {}));
