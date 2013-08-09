/// <reference path="_definitions.ts" />
/**
* Types
*
* This file contains all constants used through-out Phaser.
*
* @package    Phaser.Types
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var Types = (function () {
        function Types() {
        }
        Types.RENDERER_AUTO_DETECT = 0;
        Types.RENDERER_HEADLESS = 1;
        Types.RENDERER_CANVAS = 2;
        Types.RENDERER_WEBGL = 3;

        Types.CAMERA_TYPE_ORTHOGRAPHIC = 0;
        Types.CAMERA_TYPE_ISOMETRIC = 1;

        Types.CAMERA_FOLLOW_LOCKON = 0;

        Types.CAMERA_FOLLOW_PLATFORMER = 1;

        Types.CAMERA_FOLLOW_TOPDOWN = 2;

        Types.CAMERA_FOLLOW_TOPDOWN_TIGHT = 3;

        Types.GROUP = 0;
        Types.SPRITE = 1;
        Types.GEOMSPRITE = 2;
        Types.PARTICLE = 3;
        Types.EMITTER = 4;
        Types.TILEMAP = 5;
        Types.SCROLLZONE = 6;
        Types.BUTTON = 7;
        Types.DYNAMICTEXTURE = 8;

        Types.GEOM_POINT = 0;
        Types.GEOM_CIRCLE = 1;
        Types.GEOM_RECTANGLE = 2;
        Types.GEOM_LINE = 3;
        Types.GEOM_POLYGON = 4;

        Types.BODY_DISABLED = 0;
        Types.BODY_STATIC = 1;
        Types.BODY_KINETIC = 2;
        Types.BODY_DYNAMIC = 3;

        Types.OUT_OF_BOUNDS_KILL = 0;
        Types.OUT_OF_BOUNDS_DESTROY = 1;
        Types.OUT_OF_BOUNDS_PERSIST = 2;

        Types.SORT_ASCENDING = -1;

        Types.SORT_DESCENDING = 1;

        Types.LEFT = 0x0001;

        Types.RIGHT = 0x0010;

        Types.UP = 0x0100;

        Types.DOWN = 0x1000;

        Types.NONE = 0;

        Types.CEILING = 0x0100;

        Types.FLOOR = 0x1000;

        Types.WALL = 0x0001 | 0x0010;

        Types.ANY = 0x0001 | 0x0010 | 0x0100 | 0x1000;
        return Types;
    })();
    Phaser.Types = Types;
})(Phaser || (Phaser = {}));
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
        /**
        * Copies the x and y properties from any given object to this Point.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {Point} This Point object.
        **/
        Point.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y);
        };

        /**
        * Inverts the x and y values of this Point
        * @method invert
        * @return {Point} This Point object.
        **/
        Point.prototype.invert = function () {
            return this.setTo(this.y, this.x);
        };

        /**
        * Sets the x and y values of this MicroPoint object to the given coordinates.
        * @method setTo
        * @param {Number} x - The horizontal position of this point.
        * @param {Number} y - The vertical position of this point.
        * @return {MicroPoint} This MicroPoint object. Useful for chaining method calls.
        **/
        Point.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;

            return this;
        };

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        Point.prototype.toString = function () {
            return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
        };
        return Point;
    })();
    Phaser.Point = Point;
})(Phaser || (Phaser = {}));
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
/// <reference path="../_definitions.ts" />
/**
* Phaser - Circle
*
* A Circle object is an area defined by its position, as indicated by its center point (x,y) and diameter.
*/
var Phaser;
(function (Phaser) {
    var Circle = (function () {
        /**
        * Creates a new Circle object with the center coordinate specified by the x and y parameters and the diameter specified by the diameter parameter. If you call this function without parameters, a circle with x, y, diameter and radius properties set to 0 is created.
        * @class Circle
        * @constructor
        * @param {Number} [x] The x coordinate of the center of the circle.
        * @param {Number} [y] The y coordinate of the center of the circle.
        * @param {Number} [diameter] The diameter of the circle.
        * @return {Circle} This circle object
        **/
        function Circle(x, y, diameter) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof diameter === "undefined") { diameter = 0; }
            this._diameter = 0;
            this._radius = 0;
            /**
            * The x coordinate of the center of the circle
            * @property x
            * @type Number
            **/
            this.x = 0;
            /**
            * The y coordinate of the center of the circle
            * @property y
            * @type Number
            **/
            this.y = 0;
            this.setTo(x, y, diameter);
        }
        Object.defineProperty(Circle.prototype, "diameter", {
            get: /**
            * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
            * @method diameter
            * @return {Number}
            **/
            function () {
                return this._diameter;
            },
            set: /**
            * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
            * @method diameter
            * @param {Number} The diameter of the circle.
            **/
            function (value) {
                if (value > 0) {
                    this._diameter = value;
                    this._radius = value * 0.5;
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Circle.prototype, "radius", {
            get: /**
            * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
            * @method radius
            * @return {Number}
            **/
            function () {
                return this._radius;
            },
            set: /**
            * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
            * @method radius
            * @param {Number} The radius of the circle.
            **/
            function (value) {
                if (value > 0) {
                    this._radius = value;
                    this._diameter = value * 2;
                }
            },
            enumerable: true,
            configurable: true
        });


        /**
        * The circumference of the circle.
        * @method circumference
        * @return {Number}
        **/
        Circle.prototype.circumference = function () {
            return 2 * (Math.PI * this._radius);
        };

        Object.defineProperty(Circle.prototype, "bottom", {
            get: /**
            * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
            * @method bottom
            * @return {Number}
            **/
            function () {
                return this.y + this._radius;
            },
            set: /**
            * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
            * @method bottom
            * @param {Number} The value to adjust the height of the circle by.
            **/
            function (value) {
                if (value < this.y) {
                    this._radius = 0;
                    this._diameter = 0;
                } else {
                    this.radius = value - this.y;
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Circle.prototype, "left", {
            get: /**
            * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
            * @method left
            * @return {Number} The x coordinate of the leftmost point of the circle.
            **/
            function () {
                return this.x - this._radius;
            },
            set: /**
            * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
            * @method left
            * @param {Number} The value to adjust the position of the leftmost point of the circle by.
            **/
            function (value) {
                if (value > this.x) {
                    this._radius = 0;
                    this._diameter = 0;
                } else {
                    this.radius = this.x - value;
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Circle.prototype, "right", {
            get: /**
            * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
            * @method right
            * @return {Number}
            **/
            function () {
                return this.x + this._radius;
            },
            set: /**
            * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
            * @method right
            * @param {Number} The amount to adjust the diameter of the circle by.
            **/
            function (value) {
                if (value < this.x) {
                    this._radius = 0;
                    this._diameter = 0;
                } else {
                    this.radius = value - this.x;
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Circle.prototype, "top", {
            get: /**
            * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
            * @method bottom
            * @return {Number}
            **/
            function () {
                return this.y - this._radius;
            },
            set: /**
            * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
            * @method bottom
            * @param {Number} The amount to adjust the height of the circle by.
            **/
            function (value) {
                if (value > this.y) {
                    this._radius = 0;
                    this._diameter = 0;
                } else {
                    this.radius = this.y - value;
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Circle.prototype, "area", {
            get: /**
            * Gets the area of this Circle.
            * @method area
            * @return {Number} This area of this circle.
            **/
            function () {
                if (this._radius > 0) {
                    return Math.PI * this._radius * this._radius;
                } else {
                    return 0;
                }
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Sets the members of Circle to the specified values.
        * @method setTo
        * @param {Number} x The x coordinate of the center of the circle.
        * @param {Number} y The y coordinate of the center of the circle.
        * @param {Number} diameter The diameter of the circle in pixels.
        * @return {Circle} This circle object
        **/
        Circle.prototype.setTo = function (x, y, diameter) {
            this.x = x;
            this.y = y;
            this._diameter = diameter;
            this._radius = diameter * 0.5;

            return this;
        };

        /**
        * Copies the x, y and diameter properties from any given object to this Circle.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {Circle} This Circle object.
        **/
        Circle.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y, source.diameter);
        };

        Object.defineProperty(Circle.prototype, "empty", {
            get: /**
            * Determines whether or not this Circle object is empty.
            * @method empty
            * @return {Boolean} A value of true if the Circle objects diameter is less than or equal to 0; otherwise false.
            **/
            function () {
                return (this._diameter == 0);
            },
            set: /**
            * Sets all of the Circle objects properties to 0. A Circle object is empty if its diameter is less than or equal to 0.
            * @method setEmpty
            * @return {Circle} This Circle object
            **/
            function (value) {
                this.setTo(0, 0, 0);
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Adjusts the location of the Circle object, as determined by its center coordinate, by the specified amounts.
        * @method offset
        * @param {Number} dx Moves the x value of the Circle object by this amount.
        * @param {Number} dy Moves the y value of the Circle object by this amount.
        * @return {Circle} This Circle object.
        **/
        Circle.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;

            return this;
        };

        /**
        * Adjusts the location of the Circle object using a Point object as a parameter. This method is similar to the Circle.offset() method, except that it takes a Point object as a parameter.
        * @method offsetPoint
        * @param {Point} point A Point object to use to offset this Circle object.
        * @return {Circle} This Circle object.
        **/
        Circle.prototype.offsetPoint = function (point) {
            return this.offset(point.x, point.y);
        };

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        Circle.prototype.toString = function () {
            return "[{Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]";
        };
        return Circle;
    })();
    Phaser.Circle = Circle;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Line
*
* A Line object is an infinte line through space. The two sets of x/y coordinates define the Line Segment.
*/
var Phaser;
(function (Phaser) {
    var Line = (function () {
        /**
        *
        * @constructor
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} x2
        * @param {Number} y2
        * @return {Phaser.Line} This Object
        */
        function Line(x1, y1, x2, y2) {
            if (typeof x1 === "undefined") { x1 = 0; }
            if (typeof y1 === "undefined") { y1 = 0; }
            if (typeof x2 === "undefined") { x2 = 0; }
            if (typeof y2 === "undefined") { y2 = 0; }
            /**
            *
            * @property x1
            * @type {Number}
            */
            this.x1 = 0;
            /**
            *
            * @property y1
            * @type {Number}
            */
            this.y1 = 0;
            /**
            *
            * @property x2
            * @type {Number}
            */
            this.x2 = 0;
            /**
            *
            * @property y2
            * @type {Number}
            */
            this.y2 = 0;
            this.setTo(x1, y1, x2, y2);
        }
        /**
        *
        * @method clone
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        Line.prototype.clone = function (output) {
            if (typeof output === "undefined") { output = new Line(); }
            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        };

        /**
        *
        * @method copyFrom
        * @param {Phaser.Line} source
        * @return {Phaser.Line}
        */
        Line.prototype.copyFrom = function (source) {
            return this.setTo(source.x1, source.y1, source.x2, source.y2);
        };

        /**
        *
        * @method copyTo
        * @param {Phaser.Line} target
        * @return {Phaser.Line}
        */
        Line.prototype.copyTo = function (target) {
            return target.copyFrom(this);
        };

        /**
        *
        * @method setTo
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} x2
        * @param {Number} y2
        * @return {Phaser.Line}
        */
        Line.prototype.setTo = function (x1, y1, x2, y2) {
            if (typeof x1 === "undefined") { x1 = 0; }
            if (typeof y1 === "undefined") { y1 = 0; }
            if (typeof x2 === "undefined") { x2 = 0; }
            if (typeof y2 === "undefined") { y2 = 0; }
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;

            return this;
        };

        Object.defineProperty(Line.prototype, "width", {
            get: function () {
                return Math.max(this.x1, this.x2) - Math.min(this.x1, this.x2);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Line.prototype, "height", {
            get: function () {
                return Math.max(this.y1, this.y2) - Math.min(this.y1, this.y2);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Line.prototype, "length", {
            get: /**
            *
            * @method length
            * @return {Number}
            */
            function () {
                return Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) * (this.y2 - this.y1));
            },
            enumerable: true,
            configurable: true
        });

        /**
        *
        * @method getY
        * @param {Number} x
        * @return {Number}
        */
        Line.prototype.getY = function (x) {
            return this.slope * x + this.yIntercept;
        };

        Object.defineProperty(Line.prototype, "angle", {
            get: /**
            *
            * @method angle
            * @return {Number}
            */
            function () {
                return Math.atan2(this.x2 - this.x1, this.y2 - this.y1);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Line.prototype, "slope", {
            get: /**
            *
            * @method slope
            * @return {Number}
            */
            function () {
                return (this.y2 - this.y1) / (this.x2 - this.x1);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Line.prototype, "perpSlope", {
            get: /**
            *
            * @method perpSlope
            * @return {Number}
            */
            function () {
                return -((this.x2 - this.x1) / (this.y2 - this.y1));
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Line.prototype, "yIntercept", {
            get: /**
            *
            * @method yIntercept
            * @return {Number}
            */
            function () {
                return (this.y1 - this.slope * this.x1);
            },
            enumerable: true,
            configurable: true
        });

        /**
        *
        * @method isPointOnLine
        * @param {Number} x
        * @param {Number} y
        * @return {Boolean}
        */
        Line.prototype.isPointOnLine = function (x, y) {
            if ((x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1)) {
                return true;
            } else {
                return false;
            }
        };

        /**
        *
        * @method isPointOnLineSegment
        * @param {Number} x
        * @param {Number} y
        * @return {Boolean}
        */
        Line.prototype.isPointOnLineSegment = function (x, y) {
            var xMin = Math.min(this.x1, this.x2);
            var xMax = Math.max(this.x1, this.x2);
            var yMin = Math.min(this.y1, this.y2);
            var yMax = Math.max(this.y1, this.y2);

            if (this.isPointOnLine(x, y) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax)) {
                return true;
            } else {
                return false;
            }
        };

        /**
        *
        * @method intersectLineLine
        * @param {Any} line
        * @return {Any}
        */
        Line.prototype.intersectLineLine = function (line) {
            //return Phaser.intersectLineLine(this,line);
        };

        /**
        *
        * @method perp
        * @param {Number} x
        * @param {Number} y
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        Line.prototype.perp = function (x, y, output) {
            if (this.y1 === this.y2) {
                if (output) {
                    output.setTo(x, y, x, this.y1);
                } else {
                    return new Line(x, y, x, this.y1);
                }
            }

            var yInt = (y - this.perpSlope * x);

            var pt = this.intersectLineLine({ x1: x, y1: y, x2: 0, y2: yInt });

            if (output) {
                output.setTo(x, y, pt.x, pt.y);
            } else {
                return new Line(x, y, pt.x, pt.y);
            }
        };

        /*
        intersectLineCircle (circle:Circle)
        {
        var perp = this.perp()
        return Phaser.intersectLineCircle(this,circle);
        
        }
        */
        /**
        *
        * @method toString
        * @return {String}
        */
        Line.prototype.toString = function () {
            return "[{Line (x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " y2=" + this.y2 + ")}]";
        };
        return Line;
    })();
    Phaser.Line = Line;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - GameMath
*
* Adds a set of extra Math functions used through-out Phaser.
* Includes methods written by Dylan Engelman and Adam Saltsman.
*/
var Phaser;
(function (Phaser) {
    var GameMath = (function () {
        function GameMath(game) {
            this.cosTable = [];
            this.sinTable = [];
            this.game = game;

            GameMath.sinA = [];
            GameMath.cosA = [];

            for (var i = 0; i < 360; i++) {
                GameMath.sinA.push(Math.sin(this.degreesToRadians(i)));
                GameMath.cosA.push(Math.cos(this.degreesToRadians(i)));
            }
        }
        GameMath.prototype.fuzzyEqual = function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return Math.abs(a - b) < epsilon;
        };

        GameMath.prototype.fuzzyLessThan = function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return a < b + epsilon;
        };

        GameMath.prototype.fuzzyGreaterThan = function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return a > b - epsilon;
        };

        GameMath.prototype.fuzzyCeil = function (val, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return Math.ceil(val - epsilon);
        };

        GameMath.prototype.fuzzyFloor = function (val, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return Math.floor(val + epsilon);
        };

        GameMath.prototype.average = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var avg = 0;

            for (var i = 0; i < args.length; i++) {
                avg += args[i];
            }

            return avg / args.length;
        };

        GameMath.prototype.slam = function (value, target, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return (Math.abs(value - target) < epsilon) ? target : value;
        };

        /**
        * ratio of value to a range
        */
        GameMath.prototype.percentageMinMax = function (val, max, min) {
            if (typeof min === "undefined") { min = 0; }
            val -= min;
            max -= min;

            if (!max)
                return 0;
else
                return val / max;
        };

        /**
        * a value representing the sign of the value.
        * -1 for negative, +1 for positive, 0 if value is 0
        */
        GameMath.prototype.sign = function (n) {
            if (n)
                return n / Math.abs(n);
else
                return 0;
        };

        GameMath.prototype.truncate = function (n) {
            return (n > 0) ? Math.floor(n) : Math.ceil(n);
        };

        GameMath.prototype.shear = function (n) {
            return n % 1;
        };

        /**
        * wrap a value around a range, similar to modulus with a floating minimum
        */
        GameMath.prototype.wrap = function (val, max, min) {
            if (typeof min === "undefined") { min = 0; }
            val -= min;
            max -= min;
            if (max == 0)
                return min;
            val %= max;
            val += min;
            while (val < min)
                val += max;

            return val;
        };

        /**
        * arithmetic version of wrap... need to decide which is more efficient
        */
        GameMath.prototype.arithWrap = function (value, max, min) {
            if (typeof min === "undefined") { min = 0; }
            max -= min;
            if (max == 0)
                return min;
            return value - max * Math.floor((value - min) / max);
        };

        /**
        * force a value within the boundaries of two values
        *
        * if max < min, min is returned
        */
        GameMath.prototype.clamp = function (input, max, min) {
            if (typeof min === "undefined") { min = 0; }
            return Math.max(min, Math.min(max, input));
        };

        /**
        * Snap a value to nearest grid slice, using rounding.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 10. Where as 14 will snap to 15
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param [start] - optional starting offset for gap
        */
        GameMath.prototype.snapTo = function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if (gap == 0)
                return input;

            input -= start;
            input = gap * Math.round(input / gap);
            return start + input;
        };

        /**
        * Snap a value to nearest grid slice, using floor.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 10. As will 14 snap to 10... but 16 will snap to 15
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param [start] - optional starting offset for gap
        */
        GameMath.prototype.snapToFloor = function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if (gap == 0)
                return input;

            input -= start;
            input = gap * Math.floor(input / gap);
            return start + input;
        };

        /**
        * Snap a value to nearest grid slice, using ceil.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 15. As will 14 will snap to 15... but 16 will snap to 20
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param [start] - optional starting offset for gap
        */
        GameMath.prototype.snapToCeil = function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if (gap == 0)
                return input;

            input -= start;
            input = gap * Math.ceil(input / gap);
            return start + input;
        };

        /**
        * Snaps a value to the nearest value in an array.
        */
        GameMath.prototype.snapToInArray = function (input, arr, sort) {
            if (typeof sort === "undefined") { sort = true; }
            if (sort)
                arr.sort();
            if (input < arr[0])
                return arr[0];

            var i = 1;

            while (arr[i] < input)
                i++;

            var low = arr[i - 1];
            var high = (i < arr.length) ? arr[i] : Number.POSITIVE_INFINITY;

            return ((high - input) <= (input - low)) ? high : low;
        };

        /**
        * roundTo some place comparative to a 'base', default is 10 for decimal place
        *
        * 'place' is represented by the power applied to 'base' to get that place
        *
        * @param value - the value to round
        * @param place - the place to round to
        * @param base - the base to round in... default is 10 for decimal
        *
        * e.g.
        *
        * 2000/7 ~= 285.714285714285714285714 ~= (bin)100011101.1011011011011011
        *
        * roundTo(2000/7,3) == 0
        * roundTo(2000/7,2) == 300
        * roundTo(2000/7,1) == 290
        * roundTo(2000/7,0) == 286
        * roundTo(2000/7,-1) == 285.7
        * roundTo(2000/7,-2) == 285.71
        * roundTo(2000/7,-3) == 285.714
        * roundTo(2000/7,-4) == 285.7143
        * roundTo(2000/7,-5) == 285.71429
        *
        * roundTo(2000/7,3,2)  == 288       -- 100100000
        * roundTo(2000/7,2,2)  == 284       -- 100011100
        * roundTo(2000/7,1,2)  == 286       -- 100011110
        * roundTo(2000/7,0,2)  == 286       -- 100011110
        * roundTo(2000/7,-1,2) == 285.5     -- 100011101.1
        * roundTo(2000/7,-2,2) == 285.75    -- 100011101.11
        * roundTo(2000/7,-3,2) == 285.75    -- 100011101.11
        * roundTo(2000/7,-4,2) == 285.6875  -- 100011101.1011
        * roundTo(2000/7,-5,2) == 285.71875 -- 100011101.10111
        *
        * note what occurs when we round to the 3rd space (8ths place), 100100000, this is to be assumed
        * because we are rounding 100011.1011011011011011 which rounds up.
        */
        GameMath.prototype.roundTo = function (value, place, base) {
            if (typeof place === "undefined") { place = 0; }
            if (typeof base === "undefined") { base = 10; }
            var p = Math.pow(base, -place);
            return Math.round(value * p) / p;
        };

        GameMath.prototype.floorTo = function (value, place, base) {
            if (typeof place === "undefined") { place = 0; }
            if (typeof base === "undefined") { base = 10; }
            var p = Math.pow(base, -place);
            return Math.floor(value * p) / p;
        };

        GameMath.prototype.ceilTo = function (value, place, base) {
            if (typeof place === "undefined") { place = 0; }
            if (typeof base === "undefined") { base = 10; }
            var p = Math.pow(base, -place);
            return Math.ceil(value * p) / p;
        };

        /**
        * a one dimensional linear interpolation of a value.
        */
        GameMath.prototype.interpolateFloat = function (a, b, weight) {
            return (b - a) * weight + a;
        };

        /**
        * convert radians to degrees
        */
        GameMath.prototype.radiansToDegrees = function (angle) {
            return angle * GameMath.RAD_TO_DEG;
        };

        /**
        * convert degrees to radians
        */
        GameMath.prototype.degreesToRadians = function (angle) {
            return angle * GameMath.DEG_TO_RAD;
        };

        /**
        * Find the angle of a segment from (x1, y1) -> (x2, y2 )
        */
        GameMath.prototype.angleBetween = function (x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        };

        /**
        * set an angle within the bounds of -PI to PI
        */
        GameMath.prototype.normalizeAngle = function (angle, radians) {
            if (typeof radians === "undefined") { radians = true; }
            var rd = (radians) ? GameMath.PI : 180;
            return this.wrap(angle, rd, -rd);
        };

        /**
        * closest angle between two angles from a1 to a2
        * absolute value the return for exact angle
        */
        GameMath.prototype.nearestAngleBetween = function (a1, a2, radians) {
            if (typeof radians === "undefined") { radians = true; }
            var rd = (radians) ? GameMath.PI : 180;

            a1 = this.normalizeAngle(a1, radians);
            a2 = this.normalizeAngle(a2, radians);

            if (a1 < -rd / 2 && a2 > rd / 2)
                a1 += rd * 2;
            if (a2 < -rd / 2 && a1 > rd / 2)
                a2 += rd * 2;

            return a2 - a1;
        };

        /**
        * normalizes independent and then sets dep to the nearest value respective to independent
        *
        * for instance if dep=-170 and ind=170 then 190 will be returned as an alternative to -170
        */
        GameMath.prototype.normalizeAngleToAnother = function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            return ind + this.nearestAngleBetween(ind, dep, radians);
        };

        /**
        * normalize independent and dependent and then set dependent to an angle relative to 'after/clockwise' independent
        *
        * for instance dep=-170 and ind=170, then 190 will be reutrned as alternative to -170
        */
        GameMath.prototype.normalizeAngleAfterAnother = function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            dep = this.normalizeAngle(dep - ind, radians);
            return ind + dep;
        };

        /**
        * normalizes indendent and dependent and then sets dependent to an angle relative to 'before/counterclockwise' independent
        *
        * for instance dep = 190 and ind = 170, then -170 will be returned as an alternative to 190
        */
        GameMath.prototype.normalizeAngleBeforeAnother = function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            dep = this.normalizeAngle(ind - dep, radians);
            return ind - dep;
        };

        /**
        * interpolate across the shortest arc between two angles
        */
        GameMath.prototype.interpolateAngles = function (a1, a2, weight, radians, ease) {
            if (typeof radians === "undefined") { radians = true; }
            if (typeof ease === "undefined") { ease = null; }
            a1 = this.normalizeAngle(a1, radians);
            a2 = this.normalizeAngleToAnother(a2, a1, radians);

            return (typeof ease === 'function') ? ease(weight, a1, a2 - a1, 1) : this.interpolateFloat(a1, a2, weight);
        };

        /**
        * Compute the logarithm of any value of any base
        *
        * a logarithm is the exponent that some constant (base) would have to be raised to
        * to be equal to value.
        *
        * i.e.
        * 4 ^ x = 16
        * can be rewritten as to solve for x
        * logB4(16) = x
        * which with this function would be
        * LoDMath.logBaseOf(16,4)
        *
        * which would return 2, because 4^2 = 16
        */
        GameMath.prototype.logBaseOf = function (value, base) {
            return Math.log(value) / Math.log(base);
        };

        /**
        * Greatest Common Denominator using Euclid's algorithm
        */
        GameMath.prototype.GCD = function (m, n) {
            var r;

            //make sure positive, GCD is always positive
            m = Math.abs(m);
            n = Math.abs(n);

            if (m < n) {
                r = m;
                m = n;
                n = r;
            }

            while (true) {
                r = m % n;
                if (!r)
                    return n;
                m = n;
                n = r;
            }

            return 1;
        };

        /**
        * Lowest Common Multiple
        */
        GameMath.prototype.LCM = function (m, n) {
            return (m * n) / this.GCD(m, n);
        };

        /**
        * Factorial - N!
        *
        * simple product series
        *
        * by definition:
        * 0! == 1
        */
        GameMath.prototype.factorial = function (value) {
            if (value == 0)
                return 1;

            var res = value;

            while (--value) {
                res *= value;
            }

            return res;
        };

        /**
        * gamma function
        *
        * defined: gamma(N) == (N - 1)!
        */
        GameMath.prototype.gammaFunction = function (value) {
            return this.factorial(value - 1);
        };

        /**
        * falling factorial
        *
        * defined: (N)! / (N - x)!
        *
        * written subscript: (N)x OR (base)exp
        */
        GameMath.prototype.fallingFactorial = function (base, exp) {
            return this.factorial(base) / this.factorial(base - exp);
        };

        /**
        * rising factorial
        *
        * defined: (N + x - 1)! / (N - 1)!
        *
        * written superscript N^(x) OR base^(exp)
        */
        GameMath.prototype.risingFactorial = function (base, exp) {
            //expanded from gammaFunction for speed
            return this.factorial(base + exp - 1) / this.factorial(base - 1);
        };

        /**
        * binomial coefficient
        *
        * defined: N! / (k!(N-k)!)
        * reduced: N! / (N-k)! == (N)k (fallingfactorial)
        * reduced: (N)k / k!
        */
        GameMath.prototype.binCoef = function (n, k) {
            return this.fallingFactorial(n, k) / this.factorial(k);
        };

        /**
        * rising binomial coefficient
        *
        * as one can notice in the analysis of binCoef(...) that
        * binCoef is the (N)k divided by k!. Similarly rising binCoef
        * is merely N^(k) / k!
        */
        GameMath.prototype.risingBinCoef = function (n, k) {
            return this.risingFactorial(n, k) / this.factorial(k);
        };

        /**
        * Generate a random boolean result based on the chance value
        * <p>
        * Returns true or false based on the chance value (default 50%). For example if you wanted a player to have a 30% chance
        * of getting a bonus, call chanceRoll(30) - true means the chance passed, false means it failed.
        * </p>
        * @param chance The chance of receiving the value. A number between 0 and 100 (effectively 0% to 100%)
        * @return true if the roll passed, or false
        */
        GameMath.prototype.chanceRoll = function (chance) {
            if (typeof chance === "undefined") { chance = 50; }
            if (chance <= 0) {
                return false;
            } else if (chance >= 100) {
                return true;
            } else {
                if (Math.random() * 100 >= chance) {
                    return false;
                } else {
                    return true;
                }
            }
        };

        /**
        * Adds the given amount to the value, but never lets the value go over the specified maximum
        *
        * @param value The value to add the amount to
        * @param amount The amount to add to the value
        * @param max The maximum the value is allowed to be
        * @return The new value
        */
        GameMath.prototype.maxAdd = function (value, amount, max) {
            value += amount;

            if (value > max) {
                value = max;
            }

            return value;
        };

        /**
        * Subtracts the given amount from the value, but never lets the value go below the specified minimum
        *
        * @param value The base value
        * @param amount The amount to subtract from the base value
        * @param min The minimum the value is allowed to be
        * @return The new value
        */
        GameMath.prototype.minSub = function (value, amount, min) {
            value -= amount;

            if (value < min) {
                value = min;
            }

            return value;
        };

        /**
        * Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
        * <p>Values must be positive integers, and are passed through Math.abs</p>
        *
        * @param value The value to add the amount to
        * @param amount The amount to add to the value
        * @param max The maximum the value is allowed to be
        * @return The wrapped value
        */
        GameMath.prototype.wrapValue = function (value, amount, max) {
            var diff;

            value = Math.abs(value);
            amount = Math.abs(amount);
            max = Math.abs(max);

            diff = (value + amount) % max;

            return diff;
        };

        /**
        * Randomly returns either a 1 or -1
        *
        * @return	1 or -1
        */
        GameMath.prototype.randomSign = function () {
            return (Math.random() > 0.5) ? 1 : -1;
        };

        /**
        * Returns true if the number given is odd.
        *
        * @param	n	The number to check
        *
        * @return	True if the given number is odd. False if the given number is even.
        */
        GameMath.prototype.isOdd = function (n) {
            if (n & 1) {
                return true;
            } else {
                return false;
            }
        };

        /**
        * Returns true if the number given is even.
        *
        * @param	n	The number to check
        *
        * @return	True if the given number is even. False if the given number is odd.
        */
        GameMath.prototype.isEven = function (n) {
            if (n & 1) {
                return false;
            } else {
                return true;
            }
        };

        /**
        * Keeps an angle value between -180 and +180<br>
        * Should be called whenever the angle is updated on the Sprite to stop it from going insane.
        *
        * @param	angle	The angle value to check
        *
        * @return	The new angle value, returns the same as the input angle if it was within bounds
        */
        GameMath.prototype.wrapAngle = function (angle) {
            var result = angle;

            if (angle >= -180 && angle <= 180) {
                return angle;
            }

            //  Else normalise it to -180, 180
            result = (angle + 180) % 360;

            if (result < 0) {
                result += 360;
            }

            return result - 180;
        };

        /**
        * Keeps an angle value between the given min and max values
        *
        * @param	angle	The angle value to check. Must be between -180 and +180
        * @param	min		The minimum angle that is allowed (must be -180 or greater)
        * @param	max		The maximum angle that is allowed (must be 180 or less)
        *
        * @return	The new angle value, returns the same as the input angle if it was within bounds
        */
        GameMath.prototype.angleLimit = function (angle, min, max) {
            var result = angle;

            if (angle > max) {
                result = max;
            } else if (angle < min) {
                result = min;
            }

            return result;
        };

        /**
        * @method linear
        * @param {Any} v
        * @param {Any} k
        * @public
        */
        GameMath.prototype.linearInterpolation = function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);

            if (k < 0)
                return this.linear(v[0], v[1], f);
            if (k > 1)
                return this.linear(v[m], v[m - 1], m - f);

            return this.linear(v[i], v[i + 1 > m ? m : i + 1], f - i);
        };

        /**
        * @method Bezier
        * @param {Any} v
        * @param {Any} k
        * @public
        */
        GameMath.prototype.bezierInterpolation = function (v, k) {
            var b = 0;
            var n = v.length - 1;

            for (var i = 0; i <= n; i++) {
                b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * this.bernstein(n, i);
            }

            return b;
        };

        /**
        * @method CatmullRom
        * @param {Any} v
        * @param {Any} k
        * @public
        */
        GameMath.prototype.catmullRomInterpolation = function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);

            if (v[0] === v[m]) {
                if (k < 0)
                    i = Math.floor(f = m * (1 + k));

                return this.catmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
            } else {
                if (k < 0)
                    return v[0] - (this.catmullRom(v[0], v[0], v[1], v[1], -f) - v[0]);

                if (k > 1)
                    return v[m] - (this.catmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);

                return this.catmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
            }
        };

        /**
        * @method Linear
        * @param {Any} p0
        * @param {Any} p1
        * @param {Any} t
        * @public
        */
        GameMath.prototype.linear = function (p0, p1, t) {
            return (p1 - p0) * t + p0;
        };

        /**
        * @method Bernstein
        * @param {Any} n
        * @param {Any} i
        * @public
        */
        GameMath.prototype.bernstein = function (n, i) {
            return this.factorial(n) / this.factorial(i) / this.factorial(n - i);
        };

        /**
        * @method CatmullRom
        * @param {Any} p0
        * @param {Any} p1
        * @param {Any} p2
        * @param {Any} p3
        * @param {Any} t
        * @public
        */
        GameMath.prototype.catmullRom = function (p0, p1, p2, p3, t) {
            var v0 = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5, t2 = t * t, t3 = t * t2;
            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        };

        GameMath.prototype.difference = function (a, b) {
            return Math.abs(a - b);
        };

        /**
        * Fetch a random entry from the given array.
        * Will return null if random selection is missing, or array has no entries.
        *
        * @param	objects		An array of objects.
        * @param	startIndex	Optional offset off the front of the array. Default value is 0, or the beginning of the array.
        * @param	length		Optional restriction on the number of values you want to randomly select from.
        *
        * @return	The random object that was selected.
        */
        GameMath.prototype.getRandom = function (objects, startIndex, length) {
            if (typeof startIndex === "undefined") { startIndex = 0; }
            if (typeof length === "undefined") { length = 0; }
            if (objects != null) {
                var l = length;

                if ((l == 0) || (l > objects.length - startIndex)) {
                    l = objects.length - startIndex;
                }

                if (l > 0) {
                    return objects[startIndex + Math.floor(Math.random() * l)];
                }
            }

            return null;
        };

        /**
        * Round down to the next whole number. E.g. floor(1.7) == 1, and floor(-2.7) == -2.
        *
        * @param	Value	Any number.
        *
        * @return	The rounded value of that number.
        */
        GameMath.prototype.floor = function (value) {
            var n = value | 0;
            return (value > 0) ? (n) : ((n != value) ? (n - 1) : (n));
        };

        /**
        * Round up to the next whole number.  E.g. ceil(1.3) == 2, and ceil(-2.3) == -3.
        *
        * @param	Value	Any number.
        *
        * @return	The rounded value of that number.
        */
        GameMath.prototype.ceil = function (value) {
            var n = value | 0;
            return (value > 0) ? ((n != value) ? (n + 1) : (n)) : (n);
        };

        /**
        * Generate a sine and cosine table simultaneously and extremely quickly. Based on research by Franky of scene.at
        * <p>
        * The parameters allow you to specify the length, amplitude and frequency of the wave. Once you have called this function
        * you should get the results via getSinTable() and getCosTable(). This generator is fast enough to be used in real-time.
        * </p>
        * @param length 		The length of the wave
        * @param sinAmplitude 	The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
        * @param cosAmplitude 	The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
        * @param frequency 	The frequency of the sine and cosine table data
        * @return	Returns the sine table
        * @see getSinTable
        * @see getCosTable
        */
        GameMath.prototype.sinCosGenerator = function (length, sinAmplitude, cosAmplitude, frequency) {
            if (typeof sinAmplitude === "undefined") { sinAmplitude = 1.0; }
            if (typeof cosAmplitude === "undefined") { cosAmplitude = 1.0; }
            if (typeof frequency === "undefined") { frequency = 1.0; }
            var sin = sinAmplitude;
            var cos = cosAmplitude;
            var frq = frequency * Math.PI / length;

            this.cosTable = [];
            this.sinTable = [];

            for (var c = 0; c < length; c++) {
                cos -= sin * frq;
                sin += cos * frq;

                this.cosTable[c] = cos;
                this.sinTable[c] = sin;
            }

            return this.sinTable;
        };

        /**
        * Shifts through the sin table data by one value and returns it.
        * This effectively moves the position of the data from the start to the end of the table.
        * @return	The sin value.
        */
        GameMath.prototype.shiftSinTable = function () {
            if (this.sinTable) {
                var s = this.sinTable.shift();
                this.sinTable.push(s);
                return s;
            }
        };

        /**
        * Shifts through the cos table data by one value and returns it.
        * This effectively moves the position of the data from the start to the end of the table.
        * @return	The cos value.
        */
        GameMath.prototype.shiftCosTable = function () {
            if (this.cosTable) {
                var s = this.cosTable.shift();
                this.cosTable.push(s);
                return s;
            }
        };

        /**
        * Shuffles the data in the given array into a new order
        * @param array The array to shuffle
        * @return The array
        */
        GameMath.prototype.shuffleArray = function (array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }

            return array;
        };

        /**
        * Returns the distance from this Point object to the given Point object.
        * @method distanceFrom
        * @param {Point} target - The destination Point object.
        * @param {Boolean} round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between this Point object and the destination Point object.
        **/
        GameMath.prototype.distanceBetween = function (x1, y1, x2, y2) {
            var dx = x1 - x2;
            var dy = y1 - y2;

            return Math.sqrt(dx * dx + dy * dy);
        };

        /**
        * Finds the length of the given vector
        *
        * @param	dx
        * @param	dy
        *
        * @return
        */
        GameMath.prototype.vectorLength = function (dx, dy) {
            return Math.sqrt(dx * dx + dy * dy);
        };
        GameMath.PI = 3.141592653589793;
        GameMath.PI_2 = 1.5707963267948965;
        GameMath.PI_4 = 0.7853981633974483;
        GameMath.PI_8 = 0.39269908169872413;
        GameMath.PI_16 = 0.19634954084936206;
        GameMath.TWO_PI = 6.283185307179586;
        GameMath.THREE_PI_2 = 4.7123889803846895;
        GameMath.E = 2.71828182845905;
        GameMath.LN10 = 2.302585092994046;
        GameMath.LN2 = 0.6931471805599453;
        GameMath.LOG10E = 0.4342944819032518;
        GameMath.LOG2E = 1.442695040888963387;
        GameMath.SQRT1_2 = 0.7071067811865476;
        GameMath.SQRT2 = 1.4142135623730951;
        GameMath.DEG_TO_RAD = 0.017453292519943294444444444444444;
        GameMath.RAD_TO_DEG = 57.295779513082325225835265587527;

        GameMath.B_16 = 65536;
        GameMath.B_31 = 2147483648;
        GameMath.B_32 = 4294967296;
        GameMath.B_48 = 281474976710656;
        GameMath.B_53 = 9007199254740992;
        GameMath.B_64 = 18446744073709551616;

        GameMath.ONE_THIRD = 0.333333333333333333333333333333333;
        GameMath.TWO_THIRDS = 0.666666666666666666666666666666666;
        GameMath.ONE_SIXTH = 0.166666666666666666666666666666666;

        GameMath.COS_PI_3 = 0.86602540378443864676372317075294;
        GameMath.SIN_2PI_3 = 0.03654595;

        GameMath.CIRCLE_ALPHA = 0.5522847498307933984022516322796;

        GameMath.ON = true;
        GameMath.OFF = false;

        GameMath.SHORT_EPSILON = 0.1;
        GameMath.PERC_EPSILON = 0.001;
        GameMath.EPSILON = 0.0001;
        GameMath.LONG_EPSILON = 0.00000001;
        return GameMath;
    })();
    Phaser.GameMath = GameMath;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Vec2
*
* A Vector 2
*/
var Phaser;
(function (Phaser) {
    var Vec2 = (function () {
        /**
        * Creates a new Vec2 object.
        * @class Vec2
        * @constructor
        * @param {Number} x The x position of the vector
        * @param {Number} y The y position of the vector
        * @return {Vec2} This object
        **/
        function Vec2(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.x = x;
            this.y = y;

            return this;
        }
        /**
        * Copies the x and y properties from any given object to this Vec2.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {Vec2} This Vec2 object.
        **/
        Vec2.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y);
        };

        /**
        * Sets the x and y properties of the Vector.
        * @param {Number} x The x position of the vector
        * @param {Number} y The y position of the vector
        * @return {Vec2} This object
        **/
        Vec2.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };

        /**
        * Add another vector to this one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        Vec2.prototype.add = function (a) {
            this.x += a.x;
            this.y += a.y;
            return this;
        };

        /**
        * Subtract another vector from this one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        Vec2.prototype.subtract = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };

        /**
        * Multiply another vector with this one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        Vec2.prototype.multiply = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        };

        /**
        * Divide this vector by another one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        Vec2.prototype.divide = function (v) {
            this.x /= v.x;
            this.y /= v.y;
            return this;
        };

        /**
        * Get the length of this vector.
        *
        * @return {number} The length of this vector.
        */
        Vec2.prototype.length = function () {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        };

        /**
        * Get the length squared of this vector.
        *
        * @return {number} The length^2 of this vector.
        */
        Vec2.prototype.lengthSq = function () {
            return (this.x * this.x) + (this.y * this.y);
        };

        /**
        * Normalize this vector.
        *
        * @return {Vec2} This for chaining.
        */
        Vec2.prototype.normalize = function () {
            var inv = (this.x != 0 || this.y != 0) ? 1 / Math.sqrt(this.x * this.x + this.y * this.y) : 0;
            this.x *= inv;
            this.y *= inv;
            return this;
        };

        /**
        * The dot product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        Vec2.prototype.dot = function (a) {
            return ((this.x * a.x) + (this.y * a.y));
        };

        /**
        * The cross product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        Vec2.prototype.cross = function (a) {
            return ((this.x * a.y) - (this.y * a.x));
        };

        /**
        * The projection magnitude of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        Vec2.prototype.projectionLength = function (a) {
            var den = a.dot(a);

            if (den == 0) {
                return 0;
            } else {
                return Math.abs(this.dot(a) / den);
            }
        };

        /**
        * The angle between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        Vec2.prototype.angle = function (a) {
            return Math.atan2(a.x * this.y - a.y * this.x, a.x * this.x + a.y * this.y);
        };

        /**
        * Scale this vector.
        *
        * @param {number} x The scaling factor in the x direction.
        * @param {?number=} y The scaling factor in the y direction.  If this is not specified, the x scaling factor will be used.
        * @return {Vec2} This for chaining.
        */
        Vec2.prototype.scale = function (x, y) {
            this.x *= x;
            this.y *= y || x;
            return this;
        };

        /**
        * Multiply this vector by the given scalar.
        *
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        Vec2.prototype.multiplyByScalar = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        };

        /**
        * Adds the given vector to this vector then multiplies by the given scalar.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        Vec2.prototype.multiplyAddByScalar = function (a, scalar) {
            this.x += a.x * scalar;
            this.y += a.y * scalar;
            return this;
        };

        /**
        * Divide this vector by the given scalar.
        *
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        Vec2.prototype.divideByScalar = function (scalar) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        };

        /**
        * Reverse this vector.
        *
        * @return {Vec2} This for chaining.
        */
        Vec2.prototype.reverse = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };

        /**
        * Check if both the x and y of this vector equal the given value.
        *
        * @return {Boolean}
        */
        Vec2.prototype.equals = function (value) {
            return (this.x == value && this.y == value);
        };

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        Vec2.prototype.toString = function () {
            return "[{Vec2 (x=" + this.x + " y=" + this.y + ")}]";
        };
        return Vec2;
    })();
    Phaser.Vec2 = Vec2;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Vec2Utils
*
* A collection of methods useful for manipulating and performing operations on 2D vectors.
*
*/
var Phaser;
(function (Phaser) {
    var Vec2Utils = (function () {
        function Vec2Utils() {
        }
        Vec2Utils.add = /**
        * Adds two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x + b.x, a.y + b.y);
        };

        Vec2Utils.subtract = /**
        * Subtracts two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the difference of the two vectors.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x - b.x, a.y - b.y);
        };

        Vec2Utils.multiply = /**
        * Multiplies two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors multiplied.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x * b.x, a.y * b.y);
        };

        Vec2Utils.divide = /**
        * Divides two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors divided.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x / b.x, a.y / b.y);
        };

        Vec2Utils.scale = /**
        * Scales a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {number} s Scaling value.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        function (a, s, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x * s, a.y * s);
        };

        Vec2Utils.multiplyAdd = /**
        * Adds two 2D vectors together and multiplies the result by the given scalar.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {number} s Scaling value.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors added and multiplied.
        */
        function (a, b, s, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x + b.x * s, a.y + b.y * s);
        };

        Vec2Utils.negative = /**
        * Return a negative vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the negative vector.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(-a.x, -a.y);
        };

        Vec2Utils.perp = /**
        * Return a perpendicular vector (90 degrees rotation)
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(-a.y, a.x);
        };

        Vec2Utils.rperp = /**
        * Return a perpendicular vector (-90 degrees rotation)
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.y, -a.x);
        };

        Vec2Utils.equals = /**
        * Checks if two 2D vectors are equal.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Boolean}
        */
        function (a, b) {
            return a.x == b.x && a.y == b.y;
        };

        Vec2Utils.epsilonEquals = /**
        *
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} epsilon
        * @return {Boolean}
        */
        function (a, b, epsilon) {
            return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
        };

        Vec2Utils.distance = /**
        * Get the distance between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return Math.sqrt(Vec2Utils.distanceSq(a, b));
        };

        Vec2Utils.distanceSq = /**
        * Get the distance squared between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y));
        };

        Vec2Utils.project = /**
        * Project two 2D vectors onto another vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var amt = a.dot(b) / b.lengthSq();

            if (amt != 0) {
                out.setTo(amt * b.x, amt * b.y);
            }

            return out;
        };

        Vec2Utils.projectUnit = /**
        * Project this vector onto a vector of unit length.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var amt = a.dot(b);

            if (amt != 0) {
                out.setTo(amt * b.x, amt * b.y);
            }

            return out;
        };

        Vec2Utils.normalRightHand = /**
        * Right-hand normalize (make unit length) a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.y * -1, a.x);
        };

        Vec2Utils.normalize = /**
        * Normalize (make unit length) a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var m = a.length();

            if (m != 0) {
                out.setTo(a.x / m, a.y / m);
            }

            return out;
        };

        Vec2Utils.dot = /**
        * The dot product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return ((a.x * b.x) + (a.y * b.y));
        };

        Vec2Utils.cross = /**
        * The cross product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return ((a.x * b.y) - (a.y * b.x));
        };

        Vec2Utils.angle = /**
        * The angle between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
        };

        Vec2Utils.angleSq = /**
        * The angle squared between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return a.subtract(b).angle(b.subtract(a));
        };

        Vec2Utils.rotateAroundOrigin = /**
        * Rotate a 2D vector around the origin to the given angle (theta).
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Number} theta The angle of rotation in radians.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, b, theta, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var x = a.x - b.x;
            var y = a.y - b.y;
            return out.setTo(x * Math.cos(theta) - y * Math.sin(theta) + b.x, x * Math.sin(theta) + y * Math.cos(theta) + b.y);
        };

        Vec2Utils.rotate = /**
        * Rotate a 2D vector to the given angle (theta).
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Number} theta The angle of rotation in radians.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, theta, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var c = Math.cos(theta);
            var s = Math.sin(theta);

            return out.setTo(a.x * c - a.y * s, a.x * s + a.y * c);
        };

        Vec2Utils.clone = /**
        * Clone a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is a copy of the source Vec2.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x, a.y);
        };
        return Vec2Utils;
    })();
    Phaser.Vec2Utils = Vec2Utils;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Mat3
*
* A 3x3 Matrix
*/
var Phaser;
(function (Phaser) {
    var Mat3 = (function () {
        /**
        * Creates a new Mat3 object.
        * @class Mat3
        * @constructor
        * @return {Mat3} This object
        **/
        function Mat3() {
            this.data = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        }
        Object.defineProperty(Mat3.prototype, "a00", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Mat3.prototype, "a01", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Mat3.prototype, "a02", {
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.data[2] = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Mat3.prototype, "a10", {
            get: function () {
                return this.data[3];
            },
            set: function (value) {
                this.data[3] = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Mat3.prototype, "a11", {
            get: function () {
                return this.data[4];
            },
            set: function (value) {
                this.data[4] = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Mat3.prototype, "a12", {
            get: function () {
                return this.data[5];
            },
            set: function (value) {
                this.data[5] = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Mat3.prototype, "a20", {
            get: function () {
                return this.data[6];
            },
            set: function (value) {
                this.data[6] = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Mat3.prototype, "a21", {
            get: function () {
                return this.data[7];
            },
            set: function (value) {
                this.data[7] = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Mat3.prototype, "a22", {
            get: function () {
                return this.data[8];
            },
            set: function (value) {
                this.data[8] = value;
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Copies the values from one Mat3 into this Mat3.
        * @method copyFromMat3
        * @param {any} source - The object to copy from.
        * @return {Mat3} This Mat3 object.
        **/
        Mat3.prototype.copyFromMat3 = function (source) {
            this.data[0] = source.data[0];
            this.data[1] = source.data[1];
            this.data[2] = source.data[2];
            this.data[3] = source.data[3];
            this.data[4] = source.data[4];
            this.data[5] = source.data[5];
            this.data[6] = source.data[6];
            this.data[7] = source.data[7];
            this.data[8] = source.data[8];

            return this;
        };

        /**
        * Copies the upper-left 3x3 values into this Mat3.
        * @method copyFromMat4
        * @param {any} source - The object to copy from.
        * @return {Mat3} This Mat3 object.
        **/
        Mat3.prototype.copyFromMat4 = function (source) {
            this.data[0] = source[0];
            this.data[1] = source[1];
            this.data[2] = source[2];
            this.data[3] = source[4];
            this.data[4] = source[5];
            this.data[5] = source[6];
            this.data[6] = source[8];
            this.data[7] = source[9];
            this.data[8] = source[10];

            return this;
        };

        /**
        * Clones this Mat3 into a new Mat3
        * @param {Mat3} out The output Mat3, if none is given a new Mat3 object will be created.
        * @return {Mat3} The new Mat3
        **/
        Mat3.prototype.clone = function (out) {
            if (typeof out === "undefined") { out = new Phaser.Mat3(); }
            out[0] = this.data[0];
            out[1] = this.data[1];
            out[2] = this.data[2];
            out[3] = this.data[3];
            out[4] = this.data[4];
            out[5] = this.data[5];
            out[6] = this.data[6];
            out[7] = this.data[7];
            out[8] = this.data[8];

            return out;
        };

        /**
        * Sets this Mat3 to the identity matrix.
        * @method identity
        * @param {any} source - The object to copy from.
        * @return {Mat3} This Mat3 object.
        **/
        Mat3.prototype.identity = function () {
            return this.setTo(1, 0, 0, 0, 1, 0, 0, 0, 1);
        };

        /**
        * Translates this Mat3 by the given vector
        **/
        Mat3.prototype.translate = function (v) {
            this.a20 = v.x * this.a00 + v.y * this.a10 + this.a20;
            this.a21 = v.x * this.a01 + v.y * this.a11 + this.a21;
            this.a22 = v.x * this.a02 + v.y * this.a12 + this.a22;

            return this;
        };

        Mat3.prototype.setTemps = function () {
            this._a00 = this.data[0];
            this._a01 = this.data[1];
            this._a02 = this.data[2];
            this._a10 = this.data[3];
            this._a11 = this.data[4];
            this._a12 = this.data[5];
            this._a20 = this.data[6];
            this._a21 = this.data[7];
            this._a22 = this.data[8];
        };

        /**
        * Rotates this Mat3 by the given angle (given in radians)
        **/
        Mat3.prototype.rotate = function (rad) {
            this.setTemps();

            var s = Phaser.GameMath.sinA[rad];
            var c = Phaser.GameMath.cosA[rad];

            this.data[0] = c * this._a00 + s * this._a10;
            this.data[1] = c * this._a01 + s * this._a10;
            this.data[2] = c * this._a02 + s * this._a12;

            this.data[3] = c * this._a10 - s * this._a00;
            this.data[4] = c * this._a11 - s * this._a01;
            this.data[5] = c * this._a12 - s * this._a02;

            return this;
        };

        /**
        * Scales this Mat3 by the given vector
        **/
        Mat3.prototype.scale = function (v) {
            this.data[0] = v.x * this.data[0];
            this.data[1] = v.x * this.data[1];
            this.data[2] = v.x * this.data[2];

            this.data[3] = v.y * this.data[3];
            this.data[4] = v.y * this.data[4];
            this.data[5] = v.y * this.data[5];

            return this;
        };

        Mat3.prototype.setTo = function (a00, a01, a02, a10, a11, a12, a20, a21, a22) {
            this.data[0] = a00;
            this.data[1] = a01;
            this.data[2] = a02;
            this.data[3] = a10;
            this.data[4] = a11;
            this.data[5] = a12;
            this.data[6] = a20;
            this.data[7] = a21;
            this.data[8] = a22;

            return this;
        };

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        Mat3.prototype.toString = function () {
            return '';
            //return "[{Vec2 (x=" + this.x + " y=" + this.y + ")}]";
        };
        return Mat3;
    })();
    Phaser.Mat3 = Mat3;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Mat3Utils
*
* A collection of methods useful for manipulating and performing operations on Mat3 objects.
*
*/
var Phaser;
(function (Phaser) {
    var Mat3Utils = (function () {
        function Mat3Utils() {
        }
        Mat3Utils.transpose = /**
        * Transpose the values of a Mat3
        **/
        function (source, dest) {
            if (typeof dest === "undefined") { dest = null; }
            if (dest === null) {
                //  Transpose ourselves
                var a01 = source.data[1];
                var a02 = source.data[2];
                var a12 = source.data[5];

                source.data[1] = source.data[3];
                source.data[2] = source.data[6];
                source.data[3] = a01;
                source.data[5] = source.data[7];
                source.data[6] = a02;
                source.data[7] = a12;
            } else {
                source.data[0] = dest.data[0];
                source.data[1] = dest.data[3];
                source.data[2] = dest.data[6];
                source.data[3] = dest.data[1];
                source.data[4] = dest.data[4];
                source.data[5] = dest.data[7];
                source.data[6] = dest.data[2];
                source.data[7] = dest.data[5];
                source.data[8] = dest.data[8];
            }

            return source;
        };

        Mat3Utils.invert = /**
        * Inverts a Mat3
        **/
        function (source) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];

            var b01 = a22 * a11 - a12 * a21;
            var b11 = -a22 * a10 + a12 * a20;
            var b21 = a21 * a10 - a11 * a20;

            //  Determinant
            var det = a00 * b01 + a01 * b11 + a02 * b21;

            if (!det) {
                return null;
            }

            det = 1.0 / det;

            source.data[0] = b01 * det;
            source.data[1] = (-a22 * a01 + a02 * a21) * det;
            source.data[2] = (a12 * a01 - a02 * a11) * det;
            source.data[3] = b11 * det;
            source.data[4] = (a22 * a00 - a02 * a20) * det;
            source.data[5] = (-a12 * a00 + a02 * a10) * det;
            source.data[6] = b21 * det;
            source.data[7] = (-a21 * a00 + a01 * a20) * det;
            source.data[8] = (a11 * a00 - a01 * a10) * det;

            return source;
        };

        Mat3Utils.adjoint = /**
        * Calculates the adjugate of a Mat3
        **/
        function (source) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];

            source.data[0] = (a11 * a22 - a12 * a21);
            source.data[1] = (a02 * a21 - a01 * a22);
            source.data[2] = (a01 * a12 - a02 * a11);
            source.data[3] = (a12 * a20 - a10 * a22);
            source.data[4] = (a00 * a22 - a02 * a20);
            source.data[5] = (a02 * a10 - a00 * a12);
            source.data[6] = (a10 * a21 - a11 * a20);
            source.data[7] = (a01 * a20 - a00 * a21);
            source.data[8] = (a00 * a11 - a01 * a10);

            return source;
        };

        Mat3Utils.determinant = /**
        * Calculates the adjugate of a Mat3
        **/
        function (source) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];

            return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
        };

        Mat3Utils.multiply = /**
        * Multiplies two Mat3s
        **/
        function (source, b) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];

            var b00 = b.data[0];
            var b01 = b.data[1];
            var b02 = b.data[2];
            var b10 = b.data[3];
            var b11 = b.data[4];
            var b12 = b.data[5];
            var b20 = b.data[6];
            var b21 = b.data[7];
            var b22 = b.data[8];

            source.data[0] = b00 * a00 + b01 * a10 + b02 * a20;
            source.data[1] = b00 * a01 + b01 * a11 + b02 * a21;
            source.data[2] = b00 * a02 + b01 * a12 + b02 * a22;

            source.data[3] = b10 * a00 + b11 * a10 + b12 * a20;
            source.data[4] = b10 * a01 + b11 * a11 + b12 * a21;
            source.data[5] = b10 * a02 + b11 * a12 + b12 * a22;

            source.data[6] = b20 * a00 + b21 * a10 + b22 * a20;
            source.data[7] = b20 * a01 + b21 * a11 + b22 * a21;
            source.data[8] = b20 * a02 + b21 * a12 + b22 * a22;

            return source;
        };

        Mat3Utils.fromQuaternion = function () {
        };
        Mat3Utils.normalFromMat4 = function () {
        };
        return Mat3Utils;
    })();
    Phaser.Mat3Utils = Mat3Utils;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Phaser - QuadTree
*
* A fairly generic quad tree structure for rapid overlap checks. QuadTree is also configured for single or dual list operation.
* You can add items either to its A list or its B list. When you do an overlap check, you can compare the A list to itself,
* or the A list against the B list.  Handy for different things!
*/
var Phaser;
(function (Phaser) {
    var QuadTree = (function (_super) {
        __extends(QuadTree, _super);
        /**
        * Instantiate a new Quad Tree node.
        *
        * @param {Number} x			The X-coordinate of the point in space.
        * @param {Number} y			The Y-coordinate of the point in space.
        * @param {Number} width		Desired width of this node.
        * @param {Number} height		Desired height of this node.
        * @param {Number} parent		The parent branch or node.  Pass null to create a root.
        */
        //constructor(manager: Phaser.Physics.Manager, x: number, y: number, width: number, height: number, parent: QuadTree = null) {
        function QuadTree(manager, x, y, width, height, parent) {
            if (typeof parent === "undefined") { parent = null; }
            _super.call(this, x, y, width, height);

            QuadTree.physics = manager;

            this._headA = this._tailA = new Phaser.LinkedList();
            this._headB = this._tailB = new Phaser.LinkedList();

            if (parent != null) {
                if (parent._headA.object != null) {
                    this._iterator = parent._headA;

                    while (this._iterator != null) {
                        if (this._tailA.object != null) {
                            this._ot = this._tailA;
                            this._tailA = new Phaser.LinkedList();
                            this._ot.next = this._tailA;
                        }

                        this._tailA.object = this._iterator.object;
                        this._iterator = this._iterator.next;
                    }
                }

                if (parent._headB.object != null) {
                    this._iterator = parent._headB;

                    while (this._iterator != null) {
                        if (this._tailB.object != null) {
                            this._ot = this._tailB;
                            this._tailB = new Phaser.LinkedList();
                            this._ot.next = this._tailB;
                        }

                        this._tailB.object = this._iterator.object;
                        this._iterator = this._iterator.next;
                    }
                }
            } else {
                QuadTree._min = (this.width + this.height) / (2 * QuadTree.divisions);
            }

            this._canSubdivide = (this.width > QuadTree._min) || (this.height > QuadTree._min);

            //Set up comparison/sort helpers
            this._northWestTree = null;
            this._northEastTree = null;
            this._southEastTree = null;
            this._southWestTree = null;
            this._leftEdge = this.x;
            this._rightEdge = this.x + this.width;
            this._halfWidth = this.width / 2;
            this._midpointX = this._leftEdge + this._halfWidth;
            this._topEdge = this.y;
            this._bottomEdge = this.y + this.height;
            this._halfHeight = this.height / 2;
            this._midpointY = this._topEdge + this._halfHeight;
        }
        /**
        * Clean up memory.
        */
        QuadTree.prototype.destroy = function () {
            this._tailA.destroy();
            this._tailB.destroy();
            this._headA.destroy();
            this._headB.destroy();

            this._tailA = null;
            this._tailB = null;
            this._headA = null;
            this._headB = null;

            if (this._northWestTree != null) {
                this._northWestTree.destroy();
            }

            if (this._northEastTree != null) {
                this._northEastTree.destroy();
            }

            if (this._southEastTree != null) {
                this._southEastTree.destroy();
            }

            if (this._southWestTree != null) {
                this._southWestTree.destroy();
            }

            this._northWestTree = null;
            this._northEastTree = null;
            this._southEastTree = null;
            this._southWestTree = null;

            QuadTree._object = null;
            QuadTree._processingCallback = null;
            QuadTree._notifyCallback = null;
        };

        /**
        * Load objects and/or groups into the quad tree, and register notify and processing callbacks.
        *
        * @param {} objectOrGroup1	Any object that is or extends IGameObject or Group.
        * @param {} objectOrGroup2	Any object that is or extends IGameObject or Group.  If null, the first parameter will be checked against itself.
        * @param {Function} notifyCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject)</code> that is called whenever two objects are found to overlap in world space, and either no processCallback is specified, or the processCallback returns true.
        * @param {Function} processCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject):bool</code> that is called whenever two objects are found to overlap in world space.  The notifyCallback is only called if this function returns true.  See GameObject.separate().
        * @param context The context in which the callbacks will be called
        */
        QuadTree.prototype.load = function (objectOrGroup1, objectOrGroup2, notifyCallback, processCallback, context) {
            if (typeof objectOrGroup2 === "undefined") { objectOrGroup2 = null; }
            if (typeof notifyCallback === "undefined") { notifyCallback = null; }
            if (typeof processCallback === "undefined") { processCallback = null; }
            if (typeof context === "undefined") { context = null; }
            this.add(objectOrGroup1, QuadTree.A_LIST);

            if (objectOrGroup2 != null) {
                this.add(objectOrGroup2, QuadTree.B_LIST);
                QuadTree._useBothLists = true;
            } else {
                QuadTree._useBothLists = false;
            }

            QuadTree._notifyCallback = notifyCallback;
            QuadTree._processingCallback = processCallback;
            QuadTree._callbackContext = context;
        };

        /**
        * Call this function to add an object to the root of the tree.
        * This function will recursively add all group members, but
        * not the groups themselves.
        *
        * @param {} objectOrGroup	GameObjects are just added, Groups are recursed and their applicable members added accordingly.
        * @param {Number} list	A <code>uint</code> flag indicating the list to which you want to add the objects.  Options are <code>QuadTree.A_LIST</code> and <code>QuadTree.B_LIST</code>.
        */
        QuadTree.prototype.add = function (objectOrGroup, list) {
            QuadTree._list = list;

            if (objectOrGroup.type == Phaser.Types.GROUP) {
                this._i = 0;
                this._members = objectOrGroup['members'];
                this._l = objectOrGroup['length'];

                while (this._i < this._l) {
                    this._basic = this._members[this._i++];

                    if (this._basic != null && this._basic.exists) {
                        if (this._basic.type == Phaser.Types.GROUP) {
                            this.add(this._basic, list);
                        } else {
                            QuadTree._object = this._basic;

                            if (QuadTree._object.exists && QuadTree._object.body.allowCollisions) {
                                this.addObject();
                            }
                        }
                    }
                }
            } else {
                QuadTree._object = objectOrGroup;

                if (QuadTree._object.exists && QuadTree._object.body.allowCollisions) {
                    this.addObject();
                }
            }
        };

        /**
        * Internal function for recursively navigating and creating the tree
        * while adding objects to the appropriate nodes.
        */
        QuadTree.prototype.addObject = function () {
            if (!this._canSubdivide || ((this._leftEdge >= QuadTree._object.body.bounds.x) && (this._rightEdge <= QuadTree._object.body.bounds.right) && (this._topEdge >= QuadTree._object.body.bounds.y) && (this._bottomEdge <= QuadTree._object.body.bounds.bottom))) {
                this.addToList();
                return;
            }

            if ((QuadTree._object.body.bounds.x > this._leftEdge) && (QuadTree._object.body.bounds.right < this._midpointX)) {
                if ((QuadTree._object.body.bounds.y > this._topEdge) && (QuadTree._object.body.bounds.bottom < this._midpointY)) {
                    if (this._northWestTree == null) {
                        this._northWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }

                    this._northWestTree.addObject();
                    return;
                }

                if ((QuadTree._object.body.bounds.y > this._midpointY) && (QuadTree._object.body.bounds.bottom < this._bottomEdge)) {
                    if (this._southWestTree == null) {
                        this._southWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }

                    this._southWestTree.addObject();
                    return;
                }
            }

            if ((QuadTree._object.body.bounds.x > this._midpointX) && (QuadTree._object.body.bounds.right < this._rightEdge)) {
                if ((QuadTree._object.body.bounds.y > this._topEdge) && (QuadTree._object.body.bounds.bottom < this._midpointY)) {
                    if (this._northEastTree == null) {
                        this._northEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }

                    this._northEastTree.addObject();
                    return;
                }

                if ((QuadTree._object.body.bounds.y > this._midpointY) && (QuadTree._object.body.bounds.bottom < this._bottomEdge)) {
                    if (this._southEastTree == null) {
                        this._southEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }

                    this._southEastTree.addObject();
                    return;
                }
            }

            if ((QuadTree._object.body.bounds.right > this._leftEdge) && (QuadTree._object.body.bounds.x < this._midpointX) && (QuadTree._object.body.bounds.bottom > this._topEdge) && (QuadTree._object.body.bounds.y < this._midpointY)) {
                if (this._northWestTree == null) {
                    this._northWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                }

                this._northWestTree.addObject();
            }

            if ((QuadTree._object.body.bounds.right > this._midpointX) && (QuadTree._object.body.bounds.x < this._rightEdge) && (QuadTree._object.body.bounds.bottom > this._topEdge) && (QuadTree._object.body.bounds.y < this._midpointY)) {
                if (this._northEastTree == null) {
                    this._northEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                }

                this._northEastTree.addObject();
            }

            if ((QuadTree._object.body.bounds.right > this._midpointX) && (QuadTree._object.body.bounds.x < this._rightEdge) && (QuadTree._object.body.bounds.bottom > this._midpointY) && (QuadTree._object.body.bounds.y < this._bottomEdge)) {
                if (this._southEastTree == null) {
                    this._southEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                }

                this._southEastTree.addObject();
            }

            if ((QuadTree._object.body.bounds.right > this._leftEdge) && (QuadTree._object.body.bounds.x < this._midpointX) && (QuadTree._object.body.bounds.bottom > this._midpointY) && (QuadTree._object.body.bounds.y < this._bottomEdge)) {
                if (this._southWestTree == null) {
                    this._southWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                }

                this._southWestTree.addObject();
            }
        };

        /**
        * Internal function for recursively adding objects to leaf lists.
        */
        QuadTree.prototype.addToList = function () {
            if (QuadTree._list == QuadTree.A_LIST) {
                if (this._tailA.object != null) {
                    this._ot = this._tailA;
                    this._tailA = new Phaser.LinkedList();
                    this._ot.next = this._tailA;
                }

                this._tailA.object = QuadTree._object;
            } else {
                if (this._tailB.object != null) {
                    this._ot = this._tailB;
                    this._tailB = new Phaser.LinkedList();
                    this._ot.next = this._tailB;
                }

                this._tailB.object = QuadTree._object;
            }

            if (!this._canSubdivide) {
                return;
            }

            if (this._northWestTree != null) {
                this._northWestTree.addToList();
            }

            if (this._northEastTree != null) {
                this._northEastTree.addToList();
            }

            if (this._southEastTree != null) {
                this._southEastTree.addToList();
            }

            if (this._southWestTree != null) {
                this._southWestTree.addToList();
            }
        };

        /**
        * <code>QuadTree</code>'s other main function.  Call this after adding objects
        * using <code>QuadTree.load()</code> to compare the objects that you loaded.
        *
        * @return {Boolean} Whether or not any overlaps were found.
        */
        QuadTree.prototype.execute = function () {
            this._overlapProcessed = false;

            if (this._headA.object != null) {
                this._iterator = this._headA;

                while (this._iterator != null) {
                    QuadTree._object = this._iterator.object;

                    if (QuadTree._useBothLists) {
                        QuadTree._iterator = this._headB;
                    } else {
                        QuadTree._iterator = this._iterator.next;
                    }

                    if (QuadTree._object.exists && (QuadTree._object.body.allowCollisions > 0) && (QuadTree._iterator != null) && (QuadTree._iterator.object != null) && QuadTree._iterator.object.exists && this.overlapNode()) {
                        this._overlapProcessed = true;
                    }

                    this._iterator = this._iterator.next;
                }
            }

            if ((this._northWestTree != null) && this._northWestTree.execute()) {
                this._overlapProcessed = true;
            }

            if ((this._northEastTree != null) && this._northEastTree.execute()) {
                this._overlapProcessed = true;
            }

            if ((this._southEastTree != null) && this._southEastTree.execute()) {
                this._overlapProcessed = true;
            }

            if ((this._southWestTree != null) && this._southWestTree.execute()) {
                this._overlapProcessed = true;
            }

            return this._overlapProcessed;
        };

        /**
        * A private for comparing an object against the contents of a node.
        *
        * @return {Boolean} Whether or not any overlaps were found.
        */
        QuadTree.prototype.overlapNode = function () {
            //Walk the list and check for overlaps
            this._overlapProcessed = false;

            while (QuadTree._iterator != null) {
                if (!QuadTree._object.exists || (QuadTree._object.body.allowCollisions <= 0)) {
                    break;
                }

                this._checkObject = QuadTree._iterator.object;

                if ((QuadTree._object === this._checkObject) || !this._checkObject.exists || (this._checkObject.body.allowCollisions <= 0)) {
                    QuadTree._iterator = QuadTree._iterator.next;
                    continue;
                }

                /*
                if (QuadTree.physics.checkHullIntersection(QuadTree._object.body, this._checkObject.body))
                {
                //Execute callback functions if they exist
                if ((QuadTree._processingCallback == null) || QuadTree._processingCallback(QuadTree._object, this._checkObject))
                {
                this._overlapProcessed = true;
                }
                
                if (this._overlapProcessed && (QuadTree._notifyCallback != null))
                {
                if (QuadTree._callbackContext !== null)
                {
                QuadTree._notifyCallback.call(QuadTree._callbackContext, QuadTree._object, this._checkObject);
                }
                else
                {
                QuadTree._notifyCallback(QuadTree._object, this._checkObject);
                }
                }
                }
                */
                QuadTree._iterator = QuadTree._iterator.next;
            }

            return this._overlapProcessed;
        };
        QuadTree.A_LIST = 0;

        QuadTree.B_LIST = 1;
        return QuadTree;
    })(Phaser.Rectangle);
    Phaser.QuadTree = QuadTree;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - LinkedList
*
* A miniature linked list class. Useful for optimizing time-critical or highly repetitive tasks!
*/
var Phaser;
(function (Phaser) {
    var LinkedList = (function () {
        /**
        * Creates a new link, and sets <code>object</code> and <code>next</code> to <code>null</code>.
        */
        function LinkedList() {
            this.object = null;
            this.next = null;
        }
        /**
        * Clean up memory.
        */
        LinkedList.prototype.destroy = function () {
            this.object = null;

            if (this.next != null) {
                this.next.destroy();
            }

            this.next = null;
        };
        return LinkedList;
    })();
    Phaser.LinkedList = LinkedList;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - RandomDataGenerator
*
* An extremely useful repeatable random data generator. Access it via Game.rnd
* Based on Nonsense by Josh Faul https://github.com/jocafa/Nonsense
* Random number generator from http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
*/
var Phaser;
(function (Phaser) {
    var RandomDataGenerator = (function () {
        /**
        * @constructor
        * @param {Array} seeds
        * @return {Phaser.RandomDataGenerator}
        */
        function RandomDataGenerator(seeds) {
            if (typeof seeds === "undefined") { seeds = []; }
            /**
            * @property c
            * @type Number
            * @private
            */
            this.c = 1;
            this.sow(seeds);
        }
        /**
        * @method uint32
        * @private
        */
        RandomDataGenerator.prototype.uint32 = function () {
            return this.rnd.apply(this) * 0x100000000;
        };

        /**
        * @method fract32
        * @private
        */
        RandomDataGenerator.prototype.fract32 = function () {
            return this.rnd.apply(this) + (this.rnd.apply(this) * 0x200000 | 0) * 1.1102230246251565e-16;
        };

        // private random helper
        /**
        * @method rnd
        * @private
        */
        RandomDataGenerator.prototype.rnd = function () {
            var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10;

            this.c = t | 0;
            this.s0 = this.s1;
            this.s1 = this.s2;
            this.s2 = t - this.c;

            return this.s2;
        };

        /**
        * @method hash
        * @param {Any} data
        * @private
        */
        RandomDataGenerator.prototype.hash = function (data) {
            var h, i, n;

            n = 0xefc8249d;

            data = data.toString();

            for (i = 0; i < data.length; i++) {
                n += data.charCodeAt(i);
                h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * 0x100000000;
            }

            return (n >>> 0) * 2.3283064365386963e-10;
        };

        /**
        * Reset the seed of the random data generator
        * @method sow
        * @param {Array} seeds
        */
        RandomDataGenerator.prototype.sow = function (seeds) {
            if (typeof seeds === "undefined") { seeds = []; }
            this.s0 = this.hash(' ');
            this.s1 = this.hash(this.s0);
            this.s2 = this.hash(this.s1);

            var seed;

            for (var i = 0; seed = seeds[i++];) {
                this.s0 -= this.hash(seed);
                this.s0 += ~~(this.s0 < 0);

                this.s1 -= this.hash(seed);
                this.s1 += ~~(this.s1 < 0);

                this.s2 -= this.hash(seed);
                this.s2 += ~~(this.s2 < 0);
            }
        };

        Object.defineProperty(RandomDataGenerator.prototype, "integer", {
            get: /**
            * Returns a random integer between 0 and 2^32
            * @method integer
            * @return {Number}
            */
            function () {
                return this.uint32();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(RandomDataGenerator.prototype, "frac", {
            get: /**
            * Returns a random real number between 0 and 1
            * @method frac
            * @return {Number}
            */
            function () {
                return this.fract32();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(RandomDataGenerator.prototype, "real", {
            get: /**
            * Returns a random real number between 0 and 2^32
            * @method real
            * @return {Number}
            */
            function () {
                return this.uint32() + this.fract32();
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Returns a random integer between min and max
        * @method integerInRange
        * @param {Number} min
        * @param {Number} max
        * @return {Number}
        */
        RandomDataGenerator.prototype.integerInRange = function (min, max) {
            return Math.floor(this.realInRange(min, max));
        };

        /**
        * Returns a random real number between min and max
        * @method realInRange
        * @param {Number} min
        * @param {Number} max
        * @return {Number}
        */
        RandomDataGenerator.prototype.realInRange = function (min, max) {
            min = min || 0;
            max = max || 0;

            return this.frac * (max - min) + min;
        };

        Object.defineProperty(RandomDataGenerator.prototype, "normal", {
            get: /**
            * Returns a random real number between -1 and 1
            * @method normal
            * @return {Number}
            */
            function () {
                return 1 - 2 * this.frac;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(RandomDataGenerator.prototype, "uuid", {
            get: /**
            * Returns a valid v4 UUID hex string (from https://gist.github.com/1308368)
            * @method uuid
            * @return {String}
            */
            function () {
                var a, b;

                for (b = a = ''; a++ < 36; b += ~a % 5 | a * 3 & 4 ? (a ^ 15 ? 8 ^ this.frac * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-')
                    ;

                return b;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Returns a random member of `array`
        * @method pick
        * @param {Any} array
        */
        RandomDataGenerator.prototype.pick = function (array) {
            return array[this.integerInRange(0, array.length)];
        };

        /**
        * Returns a random member of `array`, favoring the earlier entries
        * @method weightedPick
        * @param {Any} array
        */
        RandomDataGenerator.prototype.weightedPick = function (array) {
            return array[~~(Math.pow(this.frac, 2) * array.length)];
        };

        /**
        * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified
        * @method timestamp
        * @param {Number} min
        * @param {Number} max
        */
        RandomDataGenerator.prototype.timestamp = function (min, max) {
            if (typeof min === "undefined") { min = 946684800000; }
            if (typeof max === "undefined") { max = 1577862000000; }
            return this.realInRange(min, max);
        };

        Object.defineProperty(RandomDataGenerator.prototype, "angle", {
            get: /**
            * Returns a random angle between -180 and 180
            * @method angle
            */
            function () {
                return this.integerInRange(-180, 180);
            },
            enumerable: true,
            configurable: true
        });
        return RandomDataGenerator;
    })();
    Phaser.RandomDataGenerator = RandomDataGenerator;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Plugin
*/
var Phaser;
(function (Phaser) {
    var Plugin = (function () {
        function Plugin(game, parent) {
            this.game = game;
            this.parent = parent;

            this.active = false;
            this.visible = false;

            this.hasPreUpdate = false;
            this.hasUpdate = false;
            this.hasPostUpdate = false;

            this.hasPreRender = false;
            this.hasRender = false;
            this.hasPostRender = false;
        }
        /**
        * Pre-update is called at the start of the update cycle, before any other updates have taken place.
        * It is only called if active is set to true.
        */
        Plugin.prototype.preUpdate = function () {
        };

        /**
        * Pre-update is called at the start of the update cycle, before any other updates have taken place.
        * It is only called if active is set to true.
        */
        Plugin.prototype.update = function () {
        };

        /**
        * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
        * It is only called if active is set to true.
        */
        Plugin.prototype.postUpdate = function () {
        };

        /**
        * Pre-render is called right before the Game Renderer starts and before any custom preRender callbacks have been run.
        * It is only called if visible is set to true.
        */
        Plugin.prototype.preRender = function () {
        };

        /**
        * Pre-render is called right before the Game Renderer starts and before any custom preRender callbacks have been run.
        * It is only called if visible is set to true.
        */
        Plugin.prototype.render = function () {
        };

        /**
        * Post-render is called after every camera and game object has been rendered, also after any custom postRender callbacks have been run.
        * It is only called if visible is set to true.
        */
        Plugin.prototype.postRender = function () {
        };

        /**
        * Clear down this Plugin and null out references
        */
        Plugin.prototype.destroy = function () {
            this.game = null;
            this.parent = null;

            this.active = false;
            this.visible = false;
        };
        return Plugin;
    })();
    Phaser.Plugin = Plugin;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - PluginManager
*/
var Phaser;
(function (Phaser) {
    var PluginManager = (function () {
        function PluginManager(game, parent) {
            this.game = game;

            this._parent = parent;

            this.plugins = [];
        }
        /**
        * Add a new Plugin to the PluginManager.
        * The plugins game and parent reference are set to this game and pluginmanager parent.
        * @type {Phaser.Plugin}
        */
        PluginManager.prototype.add = function (plugin) {
            var result = false;

            if (typeof plugin === 'function') {
                plugin = new plugin(this.game, this._parent);
            } else {
                plugin.game = this.game;
                plugin.parent = this._parent;
            }

            if (typeof plugin['preUpdate'] === 'function') {
                plugin.hasPreUpdate = true;
                result = true;
            }

            if (typeof plugin['update'] === 'function') {
                plugin.hasUpdate = true;
                result = true;
            }

            if (typeof plugin['postUpdate'] === 'function') {
                plugin.hasPostUpdate = true;
                result = true;
            }

            if (typeof plugin['preRender'] === 'function') {
                plugin.hasPreRender = true;
                result = true;
            }

            if (typeof plugin['render'] === 'function') {
                plugin.hasRender = true;
                result = true;
            }

            if (typeof plugin['postRender'] === 'function') {
                plugin.hasPostRender = true;
                result = true;
            }

            if (result == true) {
                if (plugin.hasPreUpdate || plugin.hasUpdate || plugin.hasPostUpdate) {
                    plugin.active = true;
                }

                if (plugin.hasPreRender || plugin.hasRender || plugin.hasPostRender) {
                    plugin.visible = true;
                }

                this._pluginsLength = this.plugins.push(plugin);

                return plugin;
            } else {
                return null;
            }
        };

        PluginManager.prototype.remove = function (plugin) {
            //  TODO :)
            this._pluginsLength--;
        };

        PluginManager.prototype.preUpdate = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].active && this.plugins[this._p].hasPreUpdate) {
                    this.plugins[this._p].preUpdate();
                }
            }
        };

        PluginManager.prototype.update = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].active && this.plugins[this._p].hasUpdate) {
                    this.plugins[this._p].update();
                }
            }
        };

        PluginManager.prototype.postUpdate = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].active && this.plugins[this._p].hasPostUpdate) {
                    this.plugins[this._p].postUpdate();
                }
            }
        };

        PluginManager.prototype.preRender = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].visible && this.plugins[this._p].hasPreRender) {
                    this.plugins[this._p].preRender();
                }
            }
        };

        PluginManager.prototype.render = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].visible && this.plugins[this._p].hasRender) {
                    this.plugins[this._p].render();
                }
            }
        };

        PluginManager.prototype.postRender = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].visible && this.plugins[this._p].hasPostRender) {
                    this.plugins[this._p].postRender();
                }
            }
        };

        PluginManager.prototype.destroy = function () {
            this.plugins.length = 0;
            this._pluginsLength = 0;
            this.game = null;
            this._parent = null;
        };
        return PluginManager;
    })();
    Phaser.PluginManager = PluginManager;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Signal
*
* A Signal is used for object communication via a custom broadcaster instead of Events.
* Based on JS Signals by Miller Medeiros. Converted by TypeScript by Richard Davey.
* Released under the MIT license
* http://millermedeiros.github.com/js-signals/
*/
var Phaser;
(function (Phaser) {
    var Signal = (function () {
        function Signal() {
            /**
            *
            * @property _bindings
            * @type Array
            * @private
            */
            this._bindings = [];
            /**
            *
            * @property _prevParams
            * @type Any
            * @private
            */
            this._prevParams = null;
            /**
            * If Signal should keep record of previously dispatched parameters and
            * automatically execute listener during `add()`/`addOnce()` if Signal was
            * already dispatched before.
            * @type boolean
            */
            this.memorize = false;
            /**
            * @type boolean
            * @private
            */
            this._shouldPropagate = true;
            /**
            * If Signal is active and should broadcast events.
            * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
            * @type boolean
            */
            this.active = true;
        }
        /**
        *
        * @method validateListener
        * @param {Any} listener
        * @param {Any} fnName
        */
        Signal.prototype.validateListener = function (listener, fnName) {
            if (typeof listener !== 'function') {
                throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
            }
        };

        /**
        * @param {Function} listener
        * @param {boolean} isOnce
        * @param {Object} [listenerContext]
        * @param {Number} [priority]
        * @return {SignalBinding}
        * @private
        */
        Signal.prototype._registerListener = function (listener, isOnce, listenerContext, priority) {
            var prevIndex = this._indexOfListener(listener, listenerContext);
            var binding;

            if (prevIndex !== -1) {
                binding = this._bindings[prevIndex];

                if (binding.isOnce() !== isOnce) {
                    throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
                }
            } else {
                binding = new Phaser.SignalBinding(this, listener, isOnce, listenerContext, priority);

                this._addBinding(binding);
            }

            if (this.memorize && this._prevParams) {
                binding.execute(this._prevParams);
            }

            return binding;
        };

        /**
        *
        * @method _addBinding
        * @param {SignalBinding} binding
        * @private
        */
        Signal.prototype._addBinding = function (binding) {
            //simplified insertion sort
            var n = this._bindings.length;

            do {
                --n;
            } while(this._bindings[n] && binding.priority <= this._bindings[n].priority);

            this._bindings.splice(n + 1, 0, binding);
        };

        /**
        *
        * @method _indexOfListener
        * @param {Function} listener
        * @return {number}
        * @private
        */
        Signal.prototype._indexOfListener = function (listener, context) {
            var n = this._bindings.length;
            var cur;

            while (n--) {
                cur = this._bindings[n];

                if (cur.getListener() === listener && cur.context === context) {
                    return n;
                }
            }

            return -1;
        };

        /**
        * Check if listener was attached to Signal.
        * @param {Function} listener
        * @param {Object} [context]
        * @return {boolean} if Signal has the specified listener.
        */
        Signal.prototype.has = function (listener, context) {
            if (typeof context === "undefined") { context = null; }
            return this._indexOfListener(listener, context) !== -1;
        };

        /**
        * Add a listener to the signal.
        * @param {Function} listener Signal handler function.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
        * @return {SignalBinding} An Object representing the binding between the Signal and listener.
        */
        Signal.prototype.add = function (listener, listenerContext, priority) {
            if (typeof listenerContext === "undefined") { listenerContext = null; }
            if (typeof priority === "undefined") { priority = 0; }
            this.validateListener(listener, 'add');

            return this._registerListener(listener, false, listenerContext, priority);
        };

        /**
        * Add listener to the signal that should be removed after first execution (will be executed only once).
        * @param {Function} listener Signal handler function.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
        * @return {SignalBinding} An Object representing the binding between the Signal and listener.
        */
        Signal.prototype.addOnce = function (listener, listenerContext, priority) {
            if (typeof listenerContext === "undefined") { listenerContext = null; }
            if (typeof priority === "undefined") { priority = 0; }
            this.validateListener(listener, 'addOnce');

            return this._registerListener(listener, true, listenerContext, priority);
        };

        /**
        * Remove a single listener from the dispatch queue.
        * @param {Function} listener Handler function that should be removed.
        * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
        * @return {Function} Listener handler function.
        */
        Signal.prototype.remove = function (listener, context) {
            if (typeof context === "undefined") { context = null; }
            this.validateListener(listener, 'remove');

            var i = this._indexOfListener(listener, context);

            if (i !== -1) {
                this._bindings[i]._destroy();
                this._bindings.splice(i, 1);
            }

            return listener;
        };

        /**
        * Remove all listeners from the Signal.
        */
        Signal.prototype.removeAll = function () {
            if (this._bindings) {
                var n = this._bindings.length;

                while (n--) {
                    this._bindings[n]._destroy();
                }

                this._bindings.length = 0;
            }
        };

        /**
        * @return {number} Number of listeners attached to the Signal.
        */
        Signal.prototype.getNumListeners = function () {
            return this._bindings.length;
        };

        /**
        * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
        * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
        * @see Signal.prototype.disable
        */
        Signal.prototype.halt = function () {
            this._shouldPropagate = false;
        };

        /**
        * Dispatch/Broadcast Signal to all listeners added to the queue.
        * @param {...*} [params] Parameters that should be passed to each handler.
        */
        Signal.prototype.dispatch = function () {
            var paramsArr = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                paramsArr[_i] = arguments[_i + 0];
            }
            if (!this.active) {
                return;
            }

            var n = this._bindings.length;
            var bindings;

            if (this.memorize) {
                this._prevParams = paramsArr;
            }

            if (!n) {
                //should come after memorize
                return;
            }

            bindings = this._bindings.slice(0);

            this._shouldPropagate = true;

            do {
                n--;
            } while(bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        };

        /**
        * Forget memorized arguments.
        * @see Signal.memorize
        */
        Signal.prototype.forget = function () {
            this._prevParams = null;
        };

        /**
        * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
        * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
        */
        Signal.prototype.dispose = function () {
            this.removeAll();

            delete this._bindings;
            delete this._prevParams;
        };

        /**
        * @return {string} String representation of the object.
        */
        Signal.prototype.toString = function () {
            return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
        };
        Signal.VERSION = '1.0.0';
        return Signal;
    })();
    Phaser.Signal = Signal;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - SignalBinding
*
* An object that represents a binding between a Signal and a listener function.
* Based on JS Signals by Miller Medeiros. Converted by TypeScript by Richard Davey.
* Released under the MIT license
* http://millermedeiros.github.com/js-signals/
*/
var Phaser;
(function (Phaser) {
    var SignalBinding = (function () {
        /**
        * Object that represents a binding between a Signal and a listener function.
        * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
        * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
        * @author Miller Medeiros
        * @constructor
        * @internal
        * @name SignalBinding
        * @param {Signal} signal Reference to Signal object that listener is currently bound to.
        * @param {Function} listener Handler function bound to the signal.
        * @param {boolean} isOnce If binding should be executed just once.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. (default = 0).
        */
        function SignalBinding(signal, listener, isOnce, listenerContext, priority) {
            if (typeof priority === "undefined") { priority = 0; }
            /**
            * If binding is active and should be executed.
            * @type boolean
            */
            this.active = true;
            /**
            * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
            * @type Array|null
            */
            this.params = null;
            this._listener = listener;
            this._isOnce = isOnce;
            this.context = listenerContext;
            this._signal = signal;
            this.priority = priority || 0;
        }
        /**
        * Call listener passing arbitrary parameters.
        * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
        * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
        * @return {*} Value returned by the listener.
        */
        SignalBinding.prototype.execute = function (paramsArr) {
            var handlerReturn;
            var params;

            if (this.active && !!this._listener) {
                params = this.params ? this.params.concat(paramsArr) : paramsArr;

                handlerReturn = this._listener.apply(this.context, params);

                if (this._isOnce) {
                    this.detach();
                }
            }

            return handlerReturn;
        };

        /**
        * Detach binding from signal.
        * - alias to: mySignal.remove(myBinding.getListener());
        * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
        */
        SignalBinding.prototype.detach = function () {
            return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
        };

        /**
        * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
        */
        SignalBinding.prototype.isBound = function () {
            return (!!this._signal && !!this._listener);
        };

        /**
        * @return {boolean} If SignalBinding will only be executed once.
        */
        SignalBinding.prototype.isOnce = function () {
            return this._isOnce;
        };

        /**
        * @return {Function} Handler function bound to the signal.
        */
        SignalBinding.prototype.getListener = function () {
            return this._listener;
        };

        /**
        * @return {Signal} Signal that listener is currently bound to.
        */
        SignalBinding.prototype.getSignal = function () {
            return this._signal;
        };

        /**
        * Delete instance properties
        * @private
        */
        SignalBinding.prototype._destroy = function () {
            delete this._signal;
            delete this._listener;
            delete this.context;
        };

        /**
        * @return {string} String representation of the object.
        */
        SignalBinding.prototype.toString = function () {
            return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
        };
        return SignalBinding;
    })();
    Phaser.SignalBinding = SignalBinding;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Group
*
* This class is used for organising, updating and sorting game objects.
*/
var Phaser;
(function (Phaser) {
    var Group = (function () {
        function Group(game, maxSize) {
            if (typeof maxSize === "undefined") { maxSize = 0; }
            /**
            * Helper for sort.
            */
            this._sortIndex = '';
            /**
            * This keeps track of the z value of any game object added to this Group
            */
            this._zCounter = 0;
            /**
            * The unique Group ID
            */
            this.ID = -1;
            /**
            * The z value of this Group (within its parent Group, if any)
            */
            this.z = -1;
            /**
            * The Group this Group is a child of (if any).
            */
            this.group = null;
            /**
            * A boolean representing if the Group has been modified in any way via a scale, rotate, flip or skew.
            */
            this.modified = false;
            this.game = game;
            this.type = Phaser.Types.GROUP;
            this.exists = true;
            this.visible = true;

            this.members = [];
            this.length = 0;

            this._maxSize = maxSize;
            this._marker = 0;
            this._sortIndex = null;

            this.ID = this.game.world.getNextGroupID();

            this.transform = new Phaser.Components.TransformManager(this);
            this.texture = new Phaser.Display.Texture(this);
            this.texture.opaque = false;
        }
        /**
        * Gets the next z index value for children of this Group
        */
        Group.prototype.getNextZIndex = function () {
            return this._zCounter++;
        };

        /**
        * Override this function to handle any deleting or "shutdown" type operations you might need,
        * such as removing traditional children like Basic objects.
        */
        Group.prototype.destroy = function () {
            if (this.members != null) {
                this._i = 0;

                while (this._i < this.length) {
                    this._member = this.members[this._i++];

                    if (this._member != null) {
                        this._member.destroy();
                    }
                }

                this.members.length = 0;
            }

            this._sortIndex = null;
        };

        /**
        * Calls update on all members of this Group who have a status of active=true and exists=true
        * You can also call Object.update directly, which will bypass the active/exists check.
        */
        Group.prototype.update = function () {
            if (this.modified == false && (!this.transform.scale.equals(1) || !this.transform.skew.equals(0) || this.transform.rotation != 0 || this.transform.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY)) {
                this.modified = true;
            }

            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if (this._member != null && this._member.exists && this._member.active) {
                    this._member.preUpdate();
                    this._member.update();
                }
            }
        };

        /**
        * Calls update on all members of this Group who have a status of active=true and exists=true
        * You can also call Object.postUpdate directly, which will bypass the active/exists check.
        */
        Group.prototype.postUpdate = function () {
            if (this.modified == true && this.transform.scale.equals(1) && this.transform.skew.equals(0) && this.transform.rotation == 0 && this.transform.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false) {
                this.modified = false;
            }

            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if (this._member != null && this._member.exists && this._member.active) {
                    this._member.postUpdate();
                }
            }
        };

        /**
        * Calls render on all members of this Group who have a status of visible=true and exists=true
        * You can also call Object.render directly, which will bypass the visible/exists check.
        */
        Group.prototype.render = function (camera) {
            if (camera.isHidden(this) == true) {
                return;
            }

            this.game.renderer.groupRenderer.preRender(camera, this);

            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if (this._member != null && this._member.exists && this._member.visible && camera.isHidden(this._member) == false) {
                    if (this._member.type == Phaser.Types.GROUP) {
                        this._member.render(camera);
                    } else {
                        this.game.renderer.renderGameObject(camera, this._member);
                    }
                }
            }

            this.game.renderer.groupRenderer.postRender(camera, this);
        };

        /**
        * Calls render on all members of this Group regardless of their visible status and also ignores the camera blacklist.
        * Use this when the Group objects render to hidden canvases for example.
        */
        Group.prototype.directRender = function (camera) {
            this.game.renderer.groupRenderer.preRender(camera, this);

            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if (this._member != null && this._member.exists) {
                    if (this._member.type == Phaser.Types.GROUP) {
                        this._member.directRender(camera);
                    } else {
                        this.game.renderer.renderGameObject(this._member);
                    }
                }
            }

            this.game.renderer.groupRenderer.postRender(camera, this);
        };

        Object.defineProperty(Group.prototype, "maxSize", {
            get: /**
            * The maximum capacity of this group.  Default is 0, meaning no max capacity, and the group can just grow.
            */
            function () {
                return this._maxSize;
            },
            set: /**
            * @private
            */
            function (size) {
                this._maxSize = size;

                if (this._marker >= this._maxSize) {
                    this._marker = 0;
                }

                if (this._maxSize == 0 || this.members == null || (this._maxSize >= this.members.length)) {
                    return;
                }

                //If the max size has shrunk, we need to get rid of some objects
                this._i = this._maxSize;
                this._length = this.members.length;

                while (this._i < this._length) {
                    this._member = this.members[this._i++];

                    if (this._member != null) {
                        this._member.destroy();
                    }
                }

                this.length = this.members.length = this._maxSize;
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Adds a new Game Object to the group.
        * Group will try to replace a null member of the array first.
        * Failing that, Group will add it to the end of the member array,
        * assuming there is room for it, and doubling the size of the array if necessary.
        *
        * <p>WARNING: If the group has a maxSize that has already been met,
        * the object will NOT be added to the group!</p>
        *
        * @param {Basic} Object The object you want to add to the group.
        * @return {Basic} The same object that was passed in.
        */
        Group.prototype.add = function (object) {
            if (object.group && (object.group.ID == this.ID || (object.type == Phaser.Types.GROUP && object.ID == this.ID))) {
                return object;
            }

            //  First, look for a null entry where we can add the object.
            this._i = 0;
            this._length = this.members.length;

            while (this._i < this._length) {
                if (this.members[this._i] == null) {
                    this.members[this._i] = object;

                    this.setObjectIDs(object);

                    if (this._i >= this.length) {
                        this.length = this._i + 1;
                    }

                    return object;
                }

                this._i++;
            }

            if (this._maxSize > 0) {
                if (this.members.length >= this._maxSize) {
                    return object;
                } else if (this.members.length * 2 <= this._maxSize) {
                    this.members.length *= 2;
                } else {
                    this.members.length = this._maxSize;
                }
            } else {
                this.members.length *= 2;
            }

            //  If we made it this far, then we successfully grew the group,
            //  and we can go ahead and add the object at the first open slot.
            this.members[this._i] = object;
            this.length = this._i + 1;

            this.setObjectIDs(object);

            return object;
        };

        /**
        * Create a new Sprite within this Group at the specified position.
        *
        * @param x {number} X position of the new sprite.
        * @param y {number} Y position of the new sprite.
        * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this sprite
        * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
        * @returns {Sprite} The newly created sprite object.
        */
        Group.prototype.addNewSprite = function (x, y, key, frame) {
            if (typeof key === "undefined") { key = ''; }
            if (typeof frame === "undefined") { frame = null; }
            return this.add(new Phaser.Sprite(this.game, x, y, key, frame));
        };

        /**
        * Sets all of the game object properties needed to exist within this Group.
        */
        Group.prototype.setObjectIDs = function (object, zIndex) {
            if (typeof zIndex === "undefined") { zIndex = -1; }
            if (object.group !== null) {
                object.group.remove(object);
            }

            object.group = this;

            if (zIndex == -1) {
                zIndex = this.getNextZIndex();
            }

            object.z = zIndex;

            if (object['events']) {
                object['events'].onAddedToGroup.dispatch(object, this, object.z);
            }
        };

        /**
        * Recycling is designed to help you reuse game objects without always re-allocating or "newing" them.
        *
        * <p>If you specified a maximum size for this group (like in Emitter),
        * then recycle will employ what we're calling "rotating" recycling.
        * Recycle() will first check to see if the group is at capacity yet.
        * If group is not yet at capacity, recycle() returns a new object.
        * If the group IS at capacity, then recycle() just returns the next object in line.</p>
        *
        * <p>If you did NOT specify a maximum size for this group,
        * then recycle() will employ what we're calling "grow-style" recycling.
        * Recycle() will return either the first object with exists == false,
        * or, finding none, add a new object to the array,
        * doubling the size of the array if necessary.</p>
        *
        * <p>WARNING: If this function needs to create a new object,
        * and no object class was provided, it will return null
        * instead of a valid object!</p>
        *
        * @param {class} ObjectClass The class type you want to recycle (e.g. Basic, EvilRobot, etc). Do NOT "new" the class in the parameter!
        *
        * @return {any} A reference to the object that was created.  Don't forget to cast it back to the Class you want (e.g. myObject = myGroup.recycle(myObjectClass) as myObjectClass;).
        */
        Group.prototype.recycle = function (objectClass) {
            if (typeof objectClass === "undefined") { objectClass = null; }
            if (this._maxSize > 0) {
                if (this.length < this._maxSize) {
                    if (objectClass == null) {
                        return null;
                    }

                    return this.add(new objectClass(this.game));
                } else {
                    this._member = this.members[this._marker++];

                    if (this._marker >= this._maxSize) {
                        this._marker = 0;
                    }

                    return this._member;
                }
            } else {
                this._member = this.getFirstAvailable(objectClass);

                if (this._member != null) {
                    return this._member;
                }

                if (objectClass == null) {
                    return null;
                }

                return this.add(new objectClass(this.game));
            }
        };

        /**
        * Removes an object from the group.
        *
        * @param {Basic} object The Game Object you want to remove.
        * @param {boolean} splice Whether the object should be cut from the array entirely or not.
        *
        * @return {Basic} The removed object.
        */
        Group.prototype.remove = function (object, splice) {
            if (typeof splice === "undefined") { splice = false; }
            //console.log('removing from group: ', object.name);
            this._i = this.members.indexOf(object);

            if (this._i < 0 || (this._i >= this.members.length)) {
                return null;
            }

            if (splice) {
                this.members.splice(this._i, 1);
                this.length--;
            } else {
                this.members[this._i] = null;
            }

            if (object['events']) {
                object['events'].onRemovedFromGroup.dispatch(object, this);
            }

            object.group = null;
            object.z = -1;
            return object;
        };

        /**
        * Replaces an existing game object in this Group with a new one.
        *
        * @param {Basic} oldObject	The object you want to replace.
        * @param {Basic} newObject	The new object you want to use instead.
        *
        * @return {Basic} The new object.
        */
        Group.prototype.replace = function (oldObject, newObject) {
            this._i = this.members.indexOf(oldObject);

            if (this._i < 0 || (this._i >= this.members.length)) {
                return null;
            }

            this.setObjectIDs(newObject, this.members[this._i].z);

            //  Null the old object
            this.remove(this.members[this._i]);

            this.members[this._i] = newObject;

            return newObject;
        };

        /**
        * Swaps two existing game object in this Group with each other.
        *
        * @param {Basic} child1 The first object to swap.
        * @param {Basic} child2 The second object to swap.
        *
        * @return {Basic} True if the two objects successfully swapped position.
        */
        Group.prototype.swap = function (child1, child2, sort) {
            if (typeof sort === "undefined") { sort = true; }
            if (child1.group.ID != this.ID || child2.group.ID != this.ID || child1 === child2) {
                return false;
            }

            var tempZ = child1.z;

            child1.z = child2.z;
            child2.z = tempZ;

            if (sort) {
                this.sort();
            }

            return true;
        };

        Group.prototype.bringToTop = function (child) {
            //console.log('bringToTop', child.name,'current z', child.z);
            var oldZ = child.z;

            if (!child || child.group == null || child.group.ID != this.ID) {
                //console.log('If child not in this group, or is already at the top of the group, return false');
                return false;
            }

            //  Find out the largest z index
            var topZ = -1;

            for (var i = 0; i < this.length; i++) {
                if (this.members[i] && this.members[i].z > topZ) {
                    topZ = this.members[i].z;
                }
            }

            if (child.z == topZ) {
                return false;
            }

            child.z = topZ + 1;

            //  Sort them out based on the current z indexes
            this.sort();

            for (var i = 0; i < this.length; i++) {
                if (this.members[i]) {
                    this.members[i].z = i;
                }
            }

            //console.log('bringToTop', child.name, 'old z', oldZ, 'new z', child.z);
            return true;
            //  What's the z index of the top most child?
            /*
            var childIndex: number = this._zCounter;
            
            console.log('childIndex', childIndex);
            
            this._i = 0;
            
            while (this._i < this.length)
            {
            this._member = this.members[this._i++];
            
            if (this._member)
            {
            if (this._i > childIndex)
            {
            this._member.z--;
            }
            else if (this._member.z == child.z)
            {
            childIndex = this._i;
            this._member.z = this._zCounter;
            }
            }
            }
            
            console.log('child inserted at index', child.z);
            
            //  Maybe redundant?
            this.sort();
            
            return true;
            */
        };

        /**
        * Call this function to sort the group according to a particular value and order.
        * For example, to sort game objects for Zelda-style overlaps you might call
        * <code>myGroup.sort("y",Group.ASCENDING)</code> at the bottom of your
        * <code>State.update()</code> override.  To sort all existing objects after
        * a big explosion or bomb attack, you might call <code>myGroup.sort("exists",Group.DESCENDING)</code>.
        *
        * @param {string} index The <code>string</code> name of the member variable you want to sort on.  Default value is "z".
        * @param {number} order A <code>Group</code> constant that defines the sort order.  Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
        */
        Group.prototype.sort = function (index, order) {
            if (typeof index === "undefined") { index = 'z'; }
            if (typeof order === "undefined") { order = Phaser.Types.SORT_ASCENDING; }
            var _this = this;
            this._sortIndex = index;
            this._sortOrder = order;
            this.members.sort(function (a, b) {
                return _this.sortHandler(a, b);
            });
        };

        /**
        * Helper function for the sort process.
        *
        * @param {Basic} Obj1 The first object being sorted.
        * @param {Basic} Obj2 The second object being sorted.
        *
        * @return {number} An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
        */
        Group.prototype.sortHandler = function (obj1, obj2) {
            if (!obj1 || !obj2) {
                //console.log('null objects in sort', obj1, obj2);
                return 0;
            }

            if (obj1[this._sortIndex] < obj2[this._sortIndex]) {
                return this._sortOrder;
            } else if (obj1[this._sortIndex] > obj2[this._sortIndex]) {
                return -this._sortOrder;
            }

            return 0;
        };

        /**
        * Go through and set the specified variable to the specified value on all members of the group.
        *
        * @param {string} VariableName	The string representation of the variable name you want to modify, for example "visible" or "scrollFactor".
        * @param {Object} Value The value you want to assign to that variable.
        * @param {boolean} Recurse	Default value is true, meaning if <code>setAll()</code> encounters a member that is a group, it will call <code>setAll()</code> on that group rather than modifying its variable.
        */
        Group.prototype.setAll = function (variableName, value, recurse) {
            if (typeof recurse === "undefined") { recurse = true; }
            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if (this._member != null) {
                    if (recurse && this._member.type == Phaser.Types.GROUP) {
                        this._member.setAll(variableName, value, recurse);
                    } else {
                        this._member[variableName] = value;
                    }
                }
            }
        };

        /**
        * Go through and call the specified function on all members of the group.
        * Currently only works on functions that have no required parameters.
        *
        * @param {string} FunctionName	The string representation of the function you want to call on each object, for example "kill()" or "init()".
        * @param {boolean} Recurse	Default value is true, meaning if <code>callAll()</code> encounters a member that is a group, it will call <code>callAll()</code> on that group rather than calling the group's function.
        */
        Group.prototype.callAll = function (functionName, recurse) {
            if (typeof recurse === "undefined") { recurse = true; }
            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if (this._member != null) {
                    if (recurse && this._member.type == Phaser.Types.GROUP) {
                        this._member.callAll(functionName, recurse);
                    } else {
                        this._member[functionName]();
                    }
                }
            }
        };

        /**
        * @param {function} callback
        * @param {boolean} recursive
        */
        Group.prototype.forEach = function (callback, recursive) {
            if (typeof recursive === "undefined") { recursive = false; }
            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if (this._member != null) {
                    if (recursive && this._member.type == Phaser.Types.GROUP) {
                        this._member.forEach(callback, true);
                    } else {
                        callback.call(this, this._member);
                    }
                }
            }
        };

        /**
        * @param {any} context
        * @param {function} callback
        * @param {boolean} recursive
        */
        Group.prototype.forEachAlive = function (context, callback, recursive) {
            if (typeof recursive === "undefined") { recursive = false; }
            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if (this._member != null && this._member.alive) {
                    if (recursive && this._member.type == Phaser.Types.GROUP) {
                        this._member.forEachAlive(context, callback, true);
                    } else {
                        callback.call(context, this._member);
                    }
                }
            }
        };

        /**
        * Call this function to retrieve the first object with exists == false in the group.
        * This is handy for recycling in general, e.g. respawning enemies.
        *
        * @param {any} [ObjectClass] An optional parameter that lets you narrow the results to instances of this particular class.
        *
        * @return {any} A <code>Basic</code> currently flagged as not existing.
        */
        Group.prototype.getFirstAvailable = function (objectClass) {
            if (typeof objectClass === "undefined") { objectClass = null; }
            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if ((this._member != null) && !this._member.exists && ((objectClass == null) || (typeof this._member === objectClass))) {
                    return this._member;
                }
            }

            return null;
        };

        /**
        * Call this function to retrieve the first index set to 'null'.
        * Returns -1 if no index stores a null object.
        *
        * @return {number} An <code>int</code> indicating the first null slot in the group.
        */
        Group.prototype.getFirstNull = function () {
            this._i = 0;

            while (this._i < this.length) {
                if (this.members[this._i] == null) {
                    return this._i;
                } else {
                    this._i++;
                }
            }

            return -1;
        };

        /**
        * Call this function to retrieve the first object with exists == true in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return {Basic} A <code>Basic</code> currently flagged as existing.
        */
        Group.prototype.getFirstExtant = function () {
            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if (this._member != null && this._member.exists) {
                    return this._member;
                }
            }

            return null;
        };

        /**
        * Call this function to retrieve the first object with dead == false in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return {Basic} A <code>Basic</code> currently flagged as not dead.
        */
        Group.prototype.getFirstAlive = function () {
            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if ((this._member != null) && this._member.exists && this._member.alive) {
                    return this._member;
                }
            }

            return null;
        };

        /**
        * Call this function to retrieve the first object with dead == true in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return {Basic} A <code>Basic</code> currently flagged as dead.
        */
        Group.prototype.getFirstDead = function () {
            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if ((this._member != null) && !this._member.alive) {
                    return this._member;
                }
            }

            return null;
        };

        /**
        * Call this function to find out how many members of the group are not dead.
        *
        * @return {number} The number of <code>Basic</code>s flagged as not dead.  Returns -1 if group is empty.
        */
        Group.prototype.countLiving = function () {
            this._count = -1;
            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if (this._member != null) {
                    if (this._count < 0) {
                        this._count = 0;
                    }

                    if (this._member.exists && this._member.alive) {
                        this._count++;
                    }
                }
            }

            return this._count;
        };

        /**
        * Call this function to find out how many members of the group are dead.
        *
        * @return {number} The number of <code>Basic</code>s flagged as dead.  Returns -1 if group is empty.
        */
        Group.prototype.countDead = function () {
            this._count = -1;
            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if (this._member != null) {
                    if (this._count < 0) {
                        this._count = 0;
                    }

                    if (!this._member.alive) {
                        this._count++;
                    }
                }
            }

            return this._count;
        };

        /**
        * Returns a member at random from the group.
        *
        * @param {number} StartIndex Optional offset off the front of the array. Default value is 0, or the beginning of the array.
        * @param {number} Length Optional restriction on the number of values you want to randomly select from.
        *
        * @return {Basic} A <code>Basic</code> from the members list.
        */
        Group.prototype.getRandom = function (startIndex, length) {
            if (typeof startIndex === "undefined") { startIndex = 0; }
            if (typeof length === "undefined") { length = 0; }
            if (length == 0) {
                length = this.length;
            }

            return this.game.math.getRandom(this.members, startIndex, length);
        };

        /**
        * Remove all instances of <code>Basic</code> subclass (Basic, Block, etc) from the list.
        * WARNING: does not destroy() or kill() any of these objects!
        */
        Group.prototype.clear = function () {
            this.length = this.members.length = 0;
        };

        /**
        * Calls kill on the group's members and then on the group itself.
        */
        Group.prototype.kill = function () {
            this._i = 0;

            while (this._i < this.length) {
                this._member = this.members[this._i++];

                if ((this._member != null) && this._member.exists) {
                    this._member.kill();
                }
            }
        };
        return Group;
    })();
    Phaser.Group = Group;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Camera
*
* A Camera is your view into the game world. It has a position, size, scale and rotation and renders only those objects
* within its field of view. The game automatically creates a single Stage sized camera on boot, but it can be changed and
* additional cameras created via the CameraManager.
*/
var Phaser;
(function (Phaser) {
    var Camera = (function () {
        /**
        * Instantiates a new camera at the specified location, with the specified size and zoom level.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param id {number} Unique identity.
        * @param x {number} X location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param y {number} Y location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param width {number} The width of the camera display in pixels.
        * @param height {number} The height of the camera display in pixels.
        */
        function Camera(game, id, x, y, width, height) {
            this._target = null;
            /**
            * Camera worldBounds.
            * @type {Rectangle}
            */
            this.worldBounds = null;
            /**
            * A boolean representing if the Camera has been modified in any way via a scale, rotate, flip or skew.
            */
            this.modified = false;
            /**
            * Sprite moving inside this Rectangle will not cause camera moving.
            * @type {Rectangle}
            */
            this.deadzone = null;
            /**
            * Whether this camera is visible or not. (default is true)
            * @type {boolean}
            */
            this.visible = true;
            /**
            * The z value of this Camera. Cameras are rendered in z-index order by the Renderer.
            */
            this.z = -1;
            this.game = game;

            this.ID = id;
            this.z = id;

            width = this.game.math.clamp(width, this.game.stage.width, 1);
            height = this.game.math.clamp(height, this.game.stage.height, 1);

            //  The view into the world we wish to render (by default the full game world size)
            //  The size of this Rect is the same as screenView, but the values are all in world coordinates instead of screen coordinates
            this.worldView = new Phaser.Rectangle(0, 0, width, height);

            //  The rect of the area being rendered in stage/screen coordinates
            this.screenView = new Phaser.Rectangle(x, y, width, height);

            this.plugins = new Phaser.PluginManager(this.game, this);

            this.transform = new Phaser.Components.TransformManager(this);
            this.texture = new Phaser.Display.Texture(this);

            //  We create a hidden canvas for our camera the size of the game (we use the screenView to clip the render to the camera size)
            this.texture.canvas = document.createElement('canvas');
            this.texture.canvas.width = width;
            this.texture.canvas.height = height;
            this.texture.context = this.texture.canvas.getContext('2d');

            //  Handy proxies
            this.scale = this.transform.scale;
            this.alpha = this.texture.alpha;
            this.origin = this.transform.origin;
            this.crop = this.texture.crop;
        }

        Object.defineProperty(Camera.prototype, "alpha", {
            get: /**
            * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
            */
            function () {
                return this.texture.alpha;
            },
            set: /**
            * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
            */
            function (value) {
                this.texture.alpha = value;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Hides an object from this Camera. Hidden objects are not rendered.
        * The object must implement a public cameraBlacklist property.
        *
        * @param object {Sprite/Group} The object this camera should ignore.
        */
        Camera.prototype.hide = function (object) {
            object.texture.hideFromCamera(this);
        };

        /**
        * Returns true if the object is hidden from this Camera.
        *
        * @param object {Sprite/Group} The object to check.
        */
        Camera.prototype.isHidden = function (object) {
            return object.texture.isHidden(this);
        };

        /**
        * Un-hides an object previously hidden to this Camera.
        * The object must implement a public cameraBlacklist property.
        *
        * @param object {Sprite/Group} The object this camera should display.
        */
        Camera.prototype.show = function (object) {
            object.texture.showToCamera(this);
        };

        /**
        * Tells this camera object what sprite to track.
        * @param target {Sprite} The object you want the camera to track. Set to null to not follow anything.
        * @param [style] {number} Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
        */
        Camera.prototype.follow = function (target, style) {
            if (typeof style === "undefined") { style = Phaser.Types.CAMERA_FOLLOW_LOCKON; }
            this._target = target;

            var helper;

            switch (style) {
                case Phaser.Types.CAMERA_FOLLOW_PLATFORMER:
                    var w = this.width / 8;
                    var h = this.height / 3;
                    this.deadzone = new Phaser.Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_TOPDOWN:
                    helper = Math.max(this.width, this.height) / 4;
                    this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_TOPDOWN_TIGHT:
                    helper = Math.max(this.width, this.height) / 8;
                    this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_LOCKON:
                default:
                    this.deadzone = null;
                    break;
            }
        };

        /**
        * Move the camera focus to this location instantly.
        * @param x {number} X position.
        * @param y {number} Y position.
        */
        Camera.prototype.focusOnXY = function (x, y) {
            x += (x > 0) ? 0.0000001 : -0.0000001;
            y += (y > 0) ? 0.0000001 : -0.0000001;

            this.worldView.x = Math.round(x - this.worldView.halfWidth);
            this.worldView.y = Math.round(y - this.worldView.halfHeight);
        };

        /**
        * Move the camera focus to this location instantly.
        * @param point {any} Point you want to focus.
        */
        Camera.prototype.focusOn = function (point) {
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;

            this.worldView.x = Math.round(point.x - this.worldView.halfWidth);
            this.worldView.y = Math.round(point.y - this.worldView.halfHeight);
        };

        /**
        * Specify the boundaries of the world or where the camera is allowed to move.
        *
        * @param x      {number} The smallest X value of your world (usually 0).
        * @param y      {number} The smallest Y value of your world (usually 0).
        * @param width  {number} The largest X value of your world (usually the world width).
        * @param height {number} The largest Y value of your world (usually the world height).
        */
        Camera.prototype.setBounds = function (x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            if (this.worldBounds == null) {
                this.worldBounds = new Phaser.Rectangle();
            }

            this.worldBounds.setTo(x, y, width, height);

            this.worldView.x = x;
            this.worldView.y = y;

            this.update();
        };

        /**
        * Update focusing and scrolling.
        */
        Camera.prototype.update = function () {
            if (this.modified == false && (!this.transform.scale.equals(1) || !this.transform.skew.equals(0) || this.transform.rotation != 0 || this.transform.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY)) {
                this.modified = true;
            }

            this.plugins.preUpdate();

            if (this._target !== null) {
                if (this.deadzone == null) {
                    this.focusOnXY(this._target.x, this._target.y);
                } else {
                    var edge;
                    var targetX = this._target.x + ((this._target.x > 0) ? 0.0000001 : -0.0000001);
                    var targetY = this._target.y + ((this._target.y > 0) ? 0.0000001 : -0.0000001);

                    edge = targetX - this.deadzone.x;

                    if (this.worldView.x > edge) {
                        this.worldView.x = edge;
                    }

                    edge = targetX + this._target.width - this.deadzone.x - this.deadzone.width;

                    if (this.worldView.x < edge) {
                        this.worldView.x = edge;
                    }

                    edge = targetY - this.deadzone.y;

                    if (this.worldView.y > edge) {
                        this.worldView.y = edge;
                    }

                    edge = targetY + this._target.height - this.deadzone.y - this.deadzone.height;

                    if (this.worldView.y < edge) {
                        this.worldView.y = edge;
                    }
                }
            }

            if (this.worldBounds !== null) {
                if (this.worldView.x < this.worldBounds.left) {
                    this.worldView.x = this.worldBounds.left;
                }

                if (this.worldView.x > this.worldBounds.right - this.width) {
                    this.worldView.x = (this.worldBounds.right - this.width) + 1;
                }

                if (this.worldView.y < this.worldBounds.top) {
                    this.worldView.y = this.worldBounds.top;
                }

                if (this.worldView.y > this.worldBounds.bottom - this.height) {
                    this.worldView.y = (this.worldBounds.bottom - this.height) + 1;
                }
            }

            this.worldView.floor();

            this.plugins.update();
        };

        /**
        * Update focusing and scrolling.
        */
        Camera.prototype.postUpdate = function () {
            if (this.modified == true && this.transform.scale.equals(1) && this.transform.skew.equals(0) && this.transform.rotation == 0 && this.transform.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false) {
                this.modified = false;
            }

            if (this.worldBounds !== null) {
                if (this.worldView.x < this.worldBounds.left) {
                    this.worldView.x = this.worldBounds.left;
                }

                if (this.worldView.x > this.worldBounds.right - this.width) {
                    this.worldView.x = this.worldBounds.right - this.width;
                }

                if (this.worldView.y < this.worldBounds.top) {
                    this.worldView.y = this.worldBounds.top;
                }

                if (this.worldView.y > this.worldBounds.bottom - this.height) {
                    this.worldView.y = this.worldBounds.bottom - this.height;
                }
            }

            this.worldView.floor();

            this.plugins.postUpdate();
        };

        /**
        * Destroys this camera, associated FX and removes itself from the CameraManager.
        */
        Camera.prototype.destroy = function () {
            this.game.world.cameras.removeCamera(this.ID);
            this.plugins.destroy();
        };

        Object.defineProperty(Camera.prototype, "x", {
            get: function () {
                return this.worldView.x;
            },
            set: function (value) {
                this.worldView.x = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Camera.prototype, "y", {
            get: function () {
                return this.worldView.y;
            },
            set: function (value) {
                this.worldView.y = value;
            },
            enumerable: true,
            configurable: true
        });



        Object.defineProperty(Camera.prototype, "width", {
            get: function () {
                return this.screenView.width;
            },
            set: function (value) {
                this.screenView.width = value;
                this.worldView.width = value;

                if (value !== this.texture.canvas.width) {
                    this.texture.canvas.width = value;
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Camera.prototype, "height", {
            get: function () {
                return this.screenView.height;
            },
            set: function (value) {
                this.screenView.height = value;
                this.worldView.height = value;

                if (value !== this.texture.canvas.height) {
                    this.texture.canvas.height = value;
                }
            },
            enumerable: true,
            configurable: true
        });



        Camera.prototype.setPosition = function (x, y) {
            this.screenView.x = x;
            this.screenView.y = y;
        };

        Camera.prototype.setSize = function (width, height) {
            this.screenView.width = width * this.transform.scale.x;
            this.screenView.height = height * this.transform.scale.y;
            this.worldView.width = width;
            this.worldView.height = height;

            if (width !== this.texture.canvas.width) {
                this.texture.canvas.width = width;
            }

            if (height !== this.texture.canvas.height) {
                this.texture.canvas.height = height;
            }
        };

        Object.defineProperty(Camera.prototype, "rotation", {
            get: /**
            * The angle of the Camera in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
            */
            function () {
                return this.transform.rotation;
            },
            set: /**
            * Set the angle of the Camera in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
            * The value is automatically wrapped to be between 0 and 360.
            */
            function (value) {
                this.transform.rotation = this.game.math.wrap(value, 360, 0);
            },
            enumerable: true,
            configurable: true
        });

        return Camera;
    })();
    Phaser.Camera = Camera;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - CameraManager
*
* Your game only has one CameraManager instance and it's responsible for looking after, creating and destroying
* all of the cameras in the world.
*/
var Phaser;
(function (Phaser) {
    var CameraManager = (function () {
        /**
        * CameraManager constructor
        * This will create a new <code>Camera</code> with position and size.
        *
        * @param x {number} X Position of the created camera.
        * @param y {number} y Position of the created camera.
        * @param width {number} Width of the created camera.
        * @param height {number} Height of the created camera.
        */
        function CameraManager(game, x, y, width, height) {
            /**
            * Helper for sort.
            */
            this._sortIndex = '';
            this.game = game;

            this._cameras = [];
            this._cameraLength = 0;

            this.defaultCamera = this.addCamera(x, y, width, height);

            this.current = this.defaultCamera;
        }
        /**
        * Get all the cameras.
        *
        * @returns {Camera[]} An array contains all the cameras.
        */
        CameraManager.prototype.getAll = function () {
            return this._cameras;
        };

        /**
        * Update cameras.
        */
        CameraManager.prototype.update = function () {
            for (var i = 0; i < this._cameras.length; i++) {
                this._cameras[i].update();
            }
        };

        /**
        * postUpdate cameras.
        */
        CameraManager.prototype.postUpdate = function () {
            for (var i = 0; i < this._cameras.length; i++) {
                this._cameras[i].postUpdate();
            }
        };

        /**
        * Create a new camera with specific position and size.
        *
        * @param x {number} X position of the new camera.
        * @param y {number} Y position of the new camera.
        * @param width {number} Width of the new camera.
        * @param height {number} Height of the new camera.
        * @returns {Camera} The newly created camera object.
        */
        CameraManager.prototype.addCamera = function (x, y, width, height) {
            var newCam = new Phaser.Camera(this.game, this._cameraLength, x, y, width, height);

            this._cameraLength = this._cameras.push(newCam);

            return newCam;
        };

        /**
        * Remove a new camera with its id.
        *
        * @param id {number} ID of the camera you want to remove.
        * @returns {boolean} True if successfully removed the camera, otherwise return false.
        */
        CameraManager.prototype.removeCamera = function (id) {
            for (var c = 0; c < this._cameras.length; c++) {
                if (this._cameras[c].ID == id) {
                    if (this.current.ID === this._cameras[c].ID) {
                        this.current = null;
                    }

                    this._cameras.splice(c, 1);

                    return true;
                }
            }

            return false;
        };

        CameraManager.prototype.swap = function (camera1, camera2, sort) {
            if (typeof sort === "undefined") { sort = true; }
            if (camera1.ID == camera2.ID) {
                return false;
            }

            var tempZ = camera1.z;

            camera1.z = camera2.z;
            camera2.z = tempZ;

            if (sort) {
                this.sort();
            }

            return true;
        };

        CameraManager.prototype.getCameraUnderPoint = function (x, y) {
            for (var c = this._cameraLength - 1; c >= 0; c--) {
                if (this._cameras[c].visible && Phaser.RectangleUtils.contains(this._cameras[c].screenView, x, y)) {
                    return this._cameras[c];
                }
            }

            return null;
        };

        /**
        * Call this function to sort the Cameras according to a particular value and order (default is their Z value).
        * The order in which they are sorted determines the render order. If sorted on z then Cameras with a lower z-index value render first.
        *
        * @param {string} index The <code>string</code> name of the Camera variable you want to sort on. Default value is "z".
        * @param {number} order A <code>Group</code> constant that defines the sort order. Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
        */
        CameraManager.prototype.sort = function (index, order) {
            if (typeof index === "undefined") { index = 'z'; }
            if (typeof order === "undefined") { order = Phaser.Types.SORT_ASCENDING; }
            var _this = this;
            this._sortIndex = index;
            this._sortOrder = order;
            this._cameras.sort(function (a, b) {
                return _this.sortHandler(a, b);
            });
        };

        /**
        * Helper function for the sort process.
        *
        * @param {Basic} Obj1 The first object being sorted.
        * @param {Basic} Obj2 The second object being sorted.
        *
        * @return {number} An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
        */
        CameraManager.prototype.sortHandler = function (obj1, obj2) {
            if (obj1[this._sortIndex] < obj2[this._sortIndex]) {
                return this._sortOrder;
            } else if (obj1[this._sortIndex] > obj2[this._sortIndex]) {
                return -this._sortOrder;
            }

            return 0;
        };

        /**
        * Clean up memory.
        */
        CameraManager.prototype.destroy = function () {
            this._cameras.length = 0;

            this.current = this.addCamera(0, 0, this.game.stage.width, this.game.stage.height);
        };
        return CameraManager;
    })();
    Phaser.CameraManager = CameraManager;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Display - CSS3Filters
    *
    * Allows for easy addition and modification of CSS3 Filters on DOM objects (typically the Game.Stage.canvas).
    */
    (function (Display) {
        var CSS3Filters = (function () {
            /**
            * Creates a new CSS3 Filter component
            * @param parent The DOM object to apply the filters to.
            */
            function CSS3Filters(parent) {
                this._blur = 0;
                this._grayscale = 0;
                this._sepia = 0;
                this._brightness = 0;
                this._contrast = 0;
                this._hueRotate = 0;
                this._invert = 0;
                this._opacity = 0;
                this._saturate = 0;
                this.parent = parent;
            }
            CSS3Filters.prototype.setFilter = function (local, prefix, value, unit) {
                this[local] = value;

                if (this.parent) {
                    this.parent.style['-webkit-filter'] = prefix + '(' + value + unit + ')';
                }
            };


            Object.defineProperty(CSS3Filters.prototype, "blur", {
                get: function () {
                    return this._blur;
                },
                set: /**
                * Applies a Gaussian blur to the DOM element. The value of 'radius' defines the value of the standard deviation to the Gaussian function,
                * or how many pixels on the screen blend into each other, so a larger value will create more blur.
                * If no parameter is provided, then a value 0 is used. The parameter is specified as a CSS length, but does not accept percentage values.
                */
                function (radius) {
                    this.setFilter('_blur', 'blur', radius, 'px');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(CSS3Filters.prototype, "grayscale", {
                get: function () {
                    return this._grayscale;
                },
                set: /**
                * Converts the input image to grayscale. The value of 'amount' defines the proportion of the conversion.
                * A value of 100% is completely grayscale. A value of 0% leaves the input unchanged.
                * Values between 0% and 100% are linear multipliers on the effect. If the 'amount' parameter is missing, a value of 100% is used.
                */
                function (amount) {
                    this.setFilter('_grayscale', 'grayscale', amount, '%');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(CSS3Filters.prototype, "sepia", {
                get: function () {
                    return this._sepia;
                },
                set: /**
                * Converts the input image to sepia. The value of 'amount' defines the proportion of the conversion.
                * A value of 100% is completely sepia. A value of 0 leaves the input unchanged.
                * Values between 0% and 100% are linear multipliers on the effect. If the 'amount' parameter is missing, a value of 100% is used.
                */
                function (amount) {
                    this.setFilter('_sepia', 'sepia', amount, '%');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(CSS3Filters.prototype, "brightness", {
                get: function () {
                    return this._brightness;
                },
                set: /**
                * Applies a linear multiplier to input image, making it appear more or less bright.
                * A value of 0% will create an image that is completely black. A value of 100% leaves the input unchanged.
                * Other values are linear multipliers on the effect. Values of an amount over 100% are allowed, providing brighter results.
                * If the 'amount' parameter is missing, a value of 100% is used.
                */
                function (amount) {
                    this.setFilter('_brightness', 'brightness', amount, '%');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(CSS3Filters.prototype, "contrast", {
                get: function () {
                    return this._contrast;
                },
                set: /**
                * Adjusts the contrast of the input. A value of 0% will create an image that is completely black.
                * A value of 100% leaves the input unchanged. Values of amount over 100% are allowed, providing results with less contrast.
                * If the 'amount' parameter is missing, a value of 100% is used.
                */
                function (amount) {
                    this.setFilter('_contrast', 'contrast', amount, '%');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(CSS3Filters.prototype, "hueRotate", {
                get: function () {
                    return this._hueRotate;
                },
                set: /**
                * Applies a hue rotation on the input image. The value of 'angle' defines the number of degrees around the color circle
                * the input samples will be adjusted. A value of 0deg leaves the input unchanged. If the 'angle' parameter is missing,
                * a value of 0deg is used. Maximum value is 360deg.
                */
                function (angle) {
                    this.setFilter('_hueRotate', 'hue-rotate', angle, 'deg');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(CSS3Filters.prototype, "invert", {
                get: function () {
                    return this._invert;
                },
                set: /**
                * Inverts the samples in the input image. The value of 'amount' defines the proportion of the conversion.
                * A value of 100% is completely inverted. A value of 0% leaves the input unchanged.
                * Values between 0% and 100% are linear multipliers on the effect. If the 'amount' parameter is missing, a value of 100% is used.
                */
                function (value) {
                    this.setFilter('_invert', 'invert', value, '%');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(CSS3Filters.prototype, "opacity", {
                get: function () {
                    return this._opacity;
                },
                set: /**
                * Applies transparency to the samples in the input image. The value of 'amount' defines the proportion of the conversion.
                * A value of 0% is completely transparent. A value of 100% leaves the input unchanged.
                * Values between 0% and 100% are linear multipliers on the effect. This is equivalent to multiplying the input image samples by amount.
                * If the 'amount' parameter is missing, a value of 100% is used.
                * This function is similar to the more established opacity property; the difference is that with filters, some browsers provide hardware acceleration for better performance.
                */
                function (value) {
                    this.setFilter('_opacity', 'opacity', value, '%');
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(CSS3Filters.prototype, "saturate", {
                get: function () {
                    return this._saturate;
                },
                set: /**
                * Saturates the input image. The value of 'amount' defines the proportion of the conversion.
                * A value of 0% is completely un-saturated. A value of 100% leaves the input unchanged.
                * Other values are linear multipliers on the effect. Values of amount over 100% are allowed, providing super-saturated results.
                * If the 'amount' parameter is missing, a value of 100% is used.
                */
                function (value) {
                    this.setFilter('_saturate', 'saturate', value, '%');
                },
                enumerable: true,
                configurable: true
            });
            return CSS3Filters;
        })();
        Display.CSS3Filters = CSS3Filters;
    })(Phaser.Display || (Phaser.Display = {}));
    var Display = Phaser.Display;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Display - DynamicTexture
    *
    * A DynamicTexture can be thought of as a mini canvas into which you can draw anything.
    * Game Objects can be assigned a DynamicTexture, so when they render in the world they do so
    * based on the contents of the texture at the time. This allows you to create powerful effects
    * once and have them replicated across as many game objects as you like.
    */
    (function (Display) {
        var DynamicTexture = (function () {
            /**
            * DynamicTexture constructor
            * Create a new <code>DynamicTexture</code>.
            *
            * @param game {Phaser.Game} Current game instance.
            * @param width {number} Init width of this texture.
            * @param height {number} Init height of this texture.
            */
            function DynamicTexture(game, width, height) {
                this._sx = 0;
                this._sy = 0;
                this._sw = 0;
                this._sh = 0;
                this._dx = 0;
                this._dy = 0;
                this._dw = 0;
                this._dh = 0;
                /**
                * You can set a globalCompositeOperation that will be applied before the render method is called on this Sprite.
                * This is useful if you wish to apply an effect like 'lighten'.
                * If this value is set it will call a canvas context save and restore before and after the render pass, so use it sparingly.
                * Set to null to disable.
                */
                this.globalCompositeOperation = null;
                this.game = game;
                this.type = Phaser.Types.DYNAMICTEXTURE;

                this.canvas = document.createElement('canvas');
                this.canvas.width = width;
                this.canvas.height = height;
                this.context = this.canvas.getContext('2d');

                this.css3 = new Phaser.Display.CSS3Filters(this.canvas);

                this.bounds = new Phaser.Rectangle(0, 0, width, height);
            }
            /**
            * Get a color of a specific pixel.
            * @param x {number} X position of the pixel in this texture.
            * @param y {number} Y position of the pixel in this texture.
            * @return {number} A native color value integer (format: 0xRRGGBB)
            */
            DynamicTexture.prototype.getPixel = function (x, y) {
                //r = imageData.data[0];
                //g = imageData.data[1];
                //b = imageData.data[2];
                //a = imageData.data[3];
                var imageData = this.context.getImageData(x, y, 1, 1);

                return Phaser.ColorUtils.getColor(imageData.data[0], imageData.data[1], imageData.data[2]);
            };

            /**
            * Get a color of a specific pixel (including alpha value).
            * @param x {number} X position of the pixel in this texture.
            * @param y {number} Y position of the pixel in this texture.
            * @return  A native color value integer (format: 0xAARRGGBB)
            */
            DynamicTexture.prototype.getPixel32 = function (x, y) {
                var imageData = this.context.getImageData(x, y, 1, 1);

                return Phaser.ColorUtils.getColor32(imageData.data[3], imageData.data[0], imageData.data[1], imageData.data[2]);
            };

            /**
            * Get pixels in array in a specific Rectangle.
            * @param rect {Rectangle} The specific Rectangle.
            * @returns {array} CanvasPixelArray.
            */
            DynamicTexture.prototype.getPixels = function (rect) {
                return this.context.getImageData(rect.x, rect.y, rect.width, rect.height);
            };

            /**
            * Set color of a specific pixel.
            * @param x {number} X position of the target pixel.
            * @param y {number} Y position of the target pixel.
            * @param color {number} Native integer with color value. (format: 0xRRGGBB)
            */
            DynamicTexture.prototype.setPixel = function (x, y, color) {
                this.context.fillStyle = color;
                this.context.fillRect(x, y, 1, 1);
            };

            /**
            * Set color (with alpha) of a specific pixel.
            * @param x {number} X position of the target pixel.
            * @param y {number} Y position of the target pixel.
            * @param color {number} Native integer with color value. (format: 0xAARRGGBB)
            */
            DynamicTexture.prototype.setPixel32 = function (x, y, color) {
                this.context.fillStyle = color;
                this.context.fillRect(x, y, 1, 1);
            };

            /**
            * Set image data to a specific Rectangle.
            * @param rect {Rectangle} Target Rectangle.
            * @param input {object} Source image data.
            */
            DynamicTexture.prototype.setPixels = function (rect, input) {
                this.context.putImageData(input, rect.x, rect.y);
            };

            /**
            * Fill a given Rectangle with specific color.
            * @param rect {Rectangle} Target Rectangle you want to fill.
            * @param color {number} A native number with color value. (format: 0xRRGGBB)
            */
            DynamicTexture.prototype.fillRect = function (rect, color) {
                this.context.fillStyle = color;
                this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
            };

            /**
            *
            */
            DynamicTexture.prototype.pasteImage = function (key, frame, destX, destY, destWidth, destHeight) {
                if (typeof frame === "undefined") { frame = -1; }
                if (typeof destX === "undefined") { destX = 0; }
                if (typeof destY === "undefined") { destY = 0; }
                if (typeof destWidth === "undefined") { destWidth = null; }
                if (typeof destHeight === "undefined") { destHeight = null; }
                var texture = null;
                var frameData;

                this._sx = 0;
                this._sy = 0;
                this._dx = destX;
                this._dy = destY;

                if (frame > -1) {
                    //if (this.game.cache.isSpriteSheet(key))
                    //{
                    //    texture = this.game.cache.getImage(key);
                    //this.animations.loadFrameData(this.game.cache.getFrameData(key));
                    //}
                } else {
                    texture = this.game.cache.getImage(key);
                    this._sw = texture.width;
                    this._sh = texture.height;
                    this._dw = texture.width;
                    this._dh = texture.height;
                }

                if (destWidth !== null) {
                    this._dw = destWidth;
                }

                if (destHeight !== null) {
                    this._dh = destHeight;
                }

                if (texture != null) {
                    this.context.drawImage(texture, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);
                }
            };

            //  TODO - Add in support for: alphaBitmapData: BitmapData = null, alphaPoint: Point = null, mergeAlpha: boolean = false
            /**
            * Copy pixel from another DynamicTexture to this texture.
            * @param sourceTexture {DynamicTexture} Source texture object.
            * @param sourceRect {Rectangle} The specific region Rectangle to be copied to this in the source.
            * @param destPoint {Point} Top-left point the target image data will be paste at.
            */
            DynamicTexture.prototype.copyPixels = function (sourceTexture, sourceRect, destPoint) {
                if (Phaser.RectangleUtils.equals(sourceRect, this.bounds) == true) {
                    this.context.drawImage(sourceTexture.canvas, destPoint.x, destPoint.y);
                } else {
                    this.context.putImageData(sourceTexture.getPixels(sourceRect), destPoint.x, destPoint.y);
                }
            };

            DynamicTexture.prototype.add = function (sprite) {
                sprite.texture.canvas = this.canvas;
                sprite.texture.context = this.context;
            };

            /**
            * Given an array of Sprites it will update each of them so that their canvas/contexts reference this DynamicTexture
            * @param objects {Array} An array of GameObjects, or objects that inherit from it such as Sprites
            */
            DynamicTexture.prototype.assignCanvasToGameObjects = function (objects) {
                for (var i = 0; i < objects.length; i++) {
                    if (objects[i].texture) {
                        objects[i].texture.canvas = this.canvas;
                        objects[i].texture.context = this.context;
                    }
                }
            };

            /**
            * Clear the whole canvas.
            */
            DynamicTexture.prototype.clear = function () {
                this.context.clearRect(0, 0, this.bounds.width, this.bounds.height);
            };

            /**
            * Renders this DynamicTexture to the Stage at the given x/y coordinates
            *
            * @param x {number} The X coordinate to render on the stage to (given in screen coordinates, not world)
            * @param y {number} The Y coordinate to render on the stage to (given in screen coordinates, not world)
            */
            DynamicTexture.prototype.render = function (x, y) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (this.globalCompositeOperation) {
                    this.game.stage.context.save();
                    this.game.stage.context.globalCompositeOperation = this.globalCompositeOperation;
                }

                this.game.stage.context.drawImage(this.canvas, x, y);

                if (this.globalCompositeOperation) {
                    this.game.stage.context.restore();
                }
            };

            Object.defineProperty(DynamicTexture.prototype, "width", {
                get: function () {
                    return this.bounds.width;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DynamicTexture.prototype, "height", {
                get: function () {
                    return this.bounds.height;
                },
                enumerable: true,
                configurable: true
            });
            return DynamicTexture;
        })();
        Display.DynamicTexture = DynamicTexture;
    })(Phaser.Display || (Phaser.Display = {}));
    var Display = Phaser.Display;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Display - Texture
    *
    * The Texture being used to render the object (Sprite, Group background, etc). Either Image based on a DynamicTexture.
    */
    (function (Display) {
        var Texture = (function () {
            /**
            * Creates a new Texture component
            * @param parent The object using this Texture to render.
            * @param key An optional Game.Cache key to load an image from
            */
            function Texture(parent) {
                /**
                * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
                */
                this.imageTexture = null;
                /**
                * Reference to the DynamicTexture that is used as the texture for the Sprite.
                * @type {DynamicTexture}
                */
                this.dynamicTexture = null;
                /**
                * The load status of the texture image.
                * @type {boolean}
                */
                this.loaded = false;
                /**
                * Whether the texture background is opaque or not. If set to true the object is filled with
                * the value of Texture.backgroundColor every frame. Normally you wouldn't enable this but
                * for some effects it can be handy.
                * @type {boolean}
                */
                this.opaque = false;
                /**
                * The Background Color of the Sprite if Texture.opaque is set to true.
                * Given in css color string format, i.e. 'rgb(0,0,0)' or '#ff0000'.
                * @type {string}
                */
                this.backgroundColor = 'rgb(255,255,255)';
                /**
                * You can set a globalCompositeOperation that will be applied before the render method is called on this Sprite.
                * This is useful if you wish to apply an effect like 'lighten'.
                * If this value is set it will call a canvas context save and restore before and after the render pass, so use it sparingly.
                * Set to null to disable.
                */
                this.globalCompositeOperation = null;
                /**
                * Controls if the Sprite is rendered rotated or not.
                * If renderRotation is false then the object can still rotate but it will never be rendered rotated.
                * @type {boolean}
                */
                this.renderRotation = true;
                /**
                * Flip the graphic horizontally (defaults to false)
                * @type {boolean}
                */
                this.flippedX = false;
                /**
                * Flip the graphic vertically (defaults to false)
                * @type {boolean}
                */
                this.flippedY = false;
                /**
                * Is the texture a DynamicTexture?
                * @type {boolean}
                */
                this.isDynamic = false;
                this.game = parent.game;
                this.parent = parent;

                this.canvas = parent.game.stage.canvas;
                this.context = parent.game.stage.context;
                this.alpha = 1;
                this.flippedX = false;
                this.flippedY = false;

                this._width = 16;
                this._height = 16;

                this.cameraBlacklist = [];
                this._blacklist = 0;
            }
            /**
            * Hides an object from this Camera. Hidden objects are not rendered.
            *
            * @param object {Camera} The camera this object should ignore.
            */
            Texture.prototype.hideFromCamera = function (camera) {
                if (this.isHidden(camera) == false) {
                    this.cameraBlacklist.push(camera.ID);
                    this._blacklist++;
                }
            };

            /**
            * Returns true if this texture is hidden from rendering to the given camera, otherwise false.
            */
            Texture.prototype.isHidden = function (camera) {
                if (this._blacklist && this.cameraBlacklist.indexOf(camera.ID) !== -1) {
                    return true;
                }

                return false;
            };

            /**
            * Un-hides an object previously hidden to this Camera.
            * The object must implement a public cameraBlacklist property.
            *
            * @param object {Sprite/Group} The object this camera should display.
            */
            Texture.prototype.showToCamera = function (camera) {
                if (this.isHidden(camera)) {
                    this.cameraBlacklist.slice(this.cameraBlacklist.indexOf(camera.ID), 1);
                    this._blacklist--;
                }
            };

            /**
            * Updates the texture being used to render the Sprite.
            * Called automatically by SpriteUtils.loadTexture and SpriteUtils.loadDynamicTexture.
            */
            Texture.prototype.setTo = function (image, dynamic) {
                if (typeof image === "undefined") { image = null; }
                if (typeof dynamic === "undefined") { dynamic = null; }
                if (dynamic) {
                    this.isDynamic = true;
                    this.dynamicTexture = dynamic;
                    this.texture = this.dynamicTexture.canvas;
                } else {
                    this.isDynamic = false;
                    this.imageTexture = image;
                    this.texture = this.imageTexture;
                    this._width = image.width;
                    this._height = image.height;
                }

                this.loaded = true;

                return this.parent;
            };

            /**
            * Sets a new graphic from the game cache to use as the texture for this Sprite.
            * The graphic can be SpriteSheet or Texture Atlas. If you need to use a DynamicTexture see loadDynamicTexture.
            * @param key {string} Key of the graphic you want to load for this sprite.
            * @param clearAnimations {boolean} If this Sprite has a set of animation data already loaded you can choose to keep or clear it with this boolean
            * @param updateBody {boolean} Update the physics body dimensions to match the newly loaded texture/frame?
            */
            Texture.prototype.loadImage = function (key, clearAnimations, updateBody) {
                if (typeof clearAnimations === "undefined") { clearAnimations = true; }
                if (typeof updateBody === "undefined") { updateBody = true; }
                if (clearAnimations && this.parent['animations'] && this.parent['animations'].frameData !== null) {
                    this.parent.animations.destroy();
                }

                if (this.game.cache.getImage(key) !== null) {
                    this.setTo(this.game.cache.getImage(key), null);
                    this.cacheKey = key;

                    if (this.game.cache.isSpriteSheet(key) && this.parent['animations']) {
                        this.parent.animations.loadFrameData(this.parent.game.cache.getFrameData(key));
                    } else {
                        if (updateBody && this.parent['body']) {
                            this.parent.body.bounds.width = this.width;
                            this.parent.body.bounds.height = this.height;
                        }
                    }
                }
            };

            /**
            * Load a DynamicTexture as its texture.
            * @param texture {DynamicTexture} The texture object to be used by this sprite.
            */
            Texture.prototype.loadDynamicTexture = function (texture) {
                if (this.parent.animations.frameData !== null) {
                    this.parent.animations.destroy();
                }

                this.setTo(null, texture);
                this.parent.texture.width = this.width;
                this.parent.texture.height = this.height;
            };



            Object.defineProperty(Texture.prototype, "width", {
                get: /**
                * The width of the texture. If an animation it will be the frame width, not the width of the sprite sheet.
                * If using a DynamicTexture it will be the width of the dynamic texture itself.
                * @type {number}
                */
                function () {
                    if (this.isDynamic) {
                        return this.dynamicTexture.width;
                    } else {
                        return this._width;
                    }
                },
                set: function (value) {
                    this._width = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Texture.prototype, "height", {
                get: /**
                * The height of the texture. If an animation it will be the frame height, not the height of the sprite sheet.
                * If using a DynamicTexture it will be the height of the dynamic texture itself.
                * @type {number}
                */
                function () {
                    if (this.isDynamic) {
                        return this.dynamicTexture.height;
                    } else {
                        return this._height;
                    }
                },
                set: function (value) {
                    this._height = value;
                },
                enumerable: true,
                configurable: true
            });
            return Texture;
        })();
        Display.Texture = Texture;
    })(Phaser.Display || (Phaser.Display = {}));
    var Display = Phaser.Display;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Back
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Back = (function () {
            function Back() {
            }
            Back.In = function (k) {
                var s = 1.70158;
                return k * k * ((s + 1) * k - s);
            };

            Back.Out = function (k) {
                var s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            };

            Back.InOut = function (k) {
                var s = 1.70158 * 1.525;
                if ((k *= 2) < 1)
                    return 0.5 * (k * k * ((s + 1) * k - s));
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            };
            return Back;
        })();
        Easing.Back = Back;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Bounce
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Bounce = (function () {
            function Bounce() {
            }
            Bounce.In = function (k) {
                return 1 - Phaser.Easing.Bounce.Out(1 - k);
            };

            Bounce.Out = function (k) {
                if (k < (1 / 2.75)) {
                    return 7.5625 * k * k;
                } else if (k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                } else if (k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                } else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                }
            };

            Bounce.InOut = function (k) {
                if (k < 0.5)
                    return Phaser.Easing.Bounce.In(k * 2) * 0.5;
                return Phaser.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
            };
            return Bounce;
        })();
        Easing.Bounce = Bounce;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Circular
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Circular = (function () {
            function Circular() {
            }
            Circular.In = function (k) {
                return 1 - Math.sqrt(1 - k * k);
            };

            Circular.Out = function (k) {
                return Math.sqrt(1 - (--k * k));
            };

            Circular.InOut = function (k) {
                if ((k *= 2) < 1)
                    return -0.5 * (Math.sqrt(1 - k * k) - 1);
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            };
            return Circular;
        })();
        Easing.Circular = Circular;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Cubic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Cubic = (function () {
            function Cubic() {
            }
            Cubic.In = function (k) {
                return k * k * k;
            };

            Cubic.Out = function (k) {
                return --k * k * k + 1;
            };

            Cubic.InOut = function (k) {
                if ((k *= 2) < 1)
                    return 0.5 * k * k * k;
                return 0.5 * ((k -= 2) * k * k + 2);
            };
            return Cubic;
        })();
        Easing.Cubic = Cubic;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Elastic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Elastic = (function () {
            function Elastic() {
            }
            Elastic.In = function (k) {
                var s, a = 0.1, p = 0.4;
                if (k === 0)
                    return 0;
                if (k === 1)
                    return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            };

            Elastic.Out = function (k) {
                var s, a = 0.1, p = 0.4;
                if (k === 0)
                    return 0;
                if (k === 1)
                    return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
            };

            Elastic.InOut = function (k) {
                var s, a = 0.1, p = 0.4;
                if (k === 0)
                    return 0;
                if (k === 1)
                    return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                if ((k *= 2) < 1)
                    return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
            };
            return Elastic;
        })();
        Easing.Elastic = Elastic;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Exponential
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Exponential = (function () {
            function Exponential() {
            }
            Exponential.In = function (k) {
                return k === 0 ? 0 : Math.pow(1024, k - 1);
            };

            Exponential.Out = function (k) {
                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            };

            Exponential.InOut = function (k) {
                if (k === 0)
                    return 0;
                if (k === 1)
                    return 1;
                if ((k *= 2) < 1)
                    return 0.5 * Math.pow(1024, k - 1);
                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
            };
            return Exponential;
        })();
        Easing.Exponential = Exponential;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Linear
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Linear = (function () {
            function Linear() {
            }
            Linear.None = function (k) {
                return k;
            };
            return Linear;
        })();
        Easing.Linear = Linear;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Quadratic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Quadratic = (function () {
            function Quadratic() {
            }
            Quadratic.In = function (k) {
                return k * k;
            };

            Quadratic.Out = function (k) {
                return k * (2 - k);
            };

            Quadratic.InOut = function (k) {
                if ((k *= 2) < 1)
                    return 0.5 * k * k;
                return -0.5 * (--k * (k - 2) - 1);
            };
            return Quadratic;
        })();
        Easing.Quadratic = Quadratic;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Quartic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Quartic = (function () {
            function Quartic() {
            }
            Quartic.In = function (k) {
                return k * k * k * k;
            };

            Quartic.Out = function (k) {
                return 1 - (--k * k * k * k);
            };

            Quartic.InOut = function (k) {
                if ((k *= 2) < 1)
                    return 0.5 * k * k * k * k;
                return -0.5 * ((k -= 2) * k * k * k - 2);
            };
            return Quartic;
        })();
        Easing.Quartic = Quartic;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Quintic
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Quintic = (function () {
            function Quintic() {
            }
            Quintic.In = function (k) {
                return k * k * k * k * k;
            };

            Quintic.Out = function (k) {
                return --k * k * k * k * k + 1;
            };

            Quintic.InOut = function (k) {
                if ((k *= 2) < 1)
                    return 0.5 * k * k * k * k * k;
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            };
            return Quintic;
        })();
        Easing.Quintic = Quintic;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - Easing - Sinusoidal
    *
    * For use with Phaser.Tween
    */
    (function (Easing) {
        var Sinusoidal = (function () {
            function Sinusoidal() {
            }
            Sinusoidal.In = function (k) {
                return 1 - Math.cos(k * Math.PI / 2);
            };

            Sinusoidal.Out = function (k) {
                return Math.sin(k * Math.PI / 2);
            };

            Sinusoidal.InOut = function (k) {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            };
            return Sinusoidal;
        })();
        Easing.Sinusoidal = Sinusoidal;
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Tween
*
* Based heavily on tween.js by sole (https://github.com/sole/tween.js) converted to TypeScript and integrated into Phaser
*/
var Phaser;
(function (Phaser) {
    var Tween = (function () {
        /**
        * Tween constructor
        * Create a new <code>Tween</code>.
        *
        * @param object {object} Target object will be affected by this tween.
        * @param game {Phaser.Game} Current game instance.
        */
        function Tween(object, game) {
            /**
            * Reference to the target object.
            * @type {object}
            */
            this._object = null;
            this._pausedTime = 0;
            /**
            * Start values container.
            * @type {object}
            */
            this._valuesStart = {};
            /**
            * End values container.
            * @type {object}
            */
            this._valuesEnd = {};
            /**
            * How long this tween will perform.
            * @type {number}
            */
            this._duration = 1000;
            this._delayTime = 0;
            this._startTime = null;
            /**
            * Will this tween automatically restart when it completes?
            * @type {boolean}
            */
            this._loop = false;
            /**
            * A yoyo tween is one that plays once fully, then reverses back to the original tween values before completing.
            * @type {boolean}
            */
            this._yoyo = false;
            this._yoyoCount = 0;
            /**
            * Contains chained tweens.
            * @type {Tweens[]}
            */
            this._chainedTweens = [];
            this.isRunning = false;
            this._object = object;

            this.game = game;
            this._manager = this.game.tweens;
            this._interpolationFunction = this.game.math.linearInterpolation;
            this._easingFunction = Phaser.Easing.Linear.None;

            this._chainedTweens = [];
            this.onStart = new Phaser.Signal();
            this.onUpdate = new Phaser.Signal();
            this.onComplete = new Phaser.Signal();
        }
        /**
        * Configure the Tween
        * @param properties {object} Propertis you want to tween.
        * @param [duration] {number} duration of this tween.
        * @param [ease] {any} Easing function.
        * @param [autoStart] {boolean} Whether this tween will start automatically or not.
        * @param [delay] {number} delay before this tween will start, defaults to 0 (no delay)
        * @param [loop] {boolean} Should the tween automatically restart once complete? (ignores any chained tweens)
        * @return {Tween} Itself.
        */
        Tween.prototype.to = function (properties, duration, ease, autoStart, delay, loop, yoyo) {
            if (typeof duration === "undefined") { duration = 1000; }
            if (typeof ease === "undefined") { ease = null; }
            if (typeof autoStart === "undefined") { autoStart = false; }
            if (typeof delay === "undefined") { delay = 0; }
            if (typeof loop === "undefined") { loop = false; }
            if (typeof yoyo === "undefined") { yoyo = false; }
            this._duration = duration;

            //  If properties isn't an object this will fail, sanity check it here somehow?
            this._valuesEnd = properties;

            if (ease !== null) {
                this._easingFunction = ease;
            }

            if (delay > 0) {
                this._delayTime = delay;
            }

            this._loop = loop;
            this._yoyo = yoyo;
            this._yoyoCount = 0;

            if (autoStart === true) {
                return this.start();
            } else {
                return this;
            }
        };

        Tween.prototype.loop = function (value) {
            this._loop = value;
            return this;
        };

        Tween.prototype.yoyo = function (value) {
            this._yoyo = value;
            this._yoyoCount = 0;
            return this;
        };

        /**
        * Start to tween.
        */
        Tween.prototype.start = function (looped) {
            if (typeof looped === "undefined") { looped = false; }
            if (this.game === null || this._object === null) {
                return;
            }

            if (looped == false) {
                this._manager.add(this);

                this.onStart.dispatch(this._object);
            }

            this._startTime = this.game.time.now + this._delayTime;
            this.isRunning = true;

            for (var property in this._valuesEnd) {
                if (this._object[property] === null || !(property in this._object)) {
                    throw Error('Phaser.Tween interpolation of null value of non-existing property');
                    continue;
                }

                if (this._valuesEnd[property] instanceof Array) {
                    if (this._valuesEnd[property].length === 0) {
                        continue;
                    }

                    // create a local copy of the Array with the start value at the front
                    this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);
                }

                if (looped == false) {
                    this._valuesStart[property] = this._object[property];
                }
            }

            return this;
        };

        Tween.prototype.reverse = function () {
            var tempObj = {};

            for (var property in this._valuesStart) {
                tempObj[property] = this._valuesStart[property];
                this._valuesStart[property] = this._valuesEnd[property];
                this._valuesEnd[property] = tempObj[property];
            }

            this._yoyoCount++;

            return this.start(true);
        };

        Tween.prototype.reset = function () {
            for (var property in this._valuesStart) {
                this._object[property] = this._valuesStart[property];
            }

            return this.start(true);
        };

        Tween.prototype.clear = function () {
            this._chainedTweens = [];

            this.onStart.removeAll();
            this.onUpdate.removeAll();
            this.onComplete.removeAll();

            return this;
        };

        /**
        * Stop tweening.
        */
        Tween.prototype.stop = function () {
            if (this._manager !== null) {
                this._manager.remove(this);
            }

            this.isRunning = false;

            this.onComplete.dispose();

            return this;
        };

        Object.defineProperty(Tween.prototype, "parent", {
            set: function (value) {
                this.game = value;
                this._manager = this.game.tweens;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Tween.prototype, "delay", {
            get: function () {
                return this._delayTime;
            },
            set: function (amount) {
                this._delayTime = amount;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Tween.prototype, "easing", {
            get: function () {
                return this._easingFunction;
            },
            set: function (easing) {
                this._easingFunction = easing;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Tween.prototype, "interpolation", {
            get: function () {
                return this._interpolationFunction;
            },
            set: function (interpolation) {
                this._interpolationFunction = interpolation;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Add another chained tween, which will start automatically when the one before it completes.
        * @param tween {Phaser.Tween} Tween object you want to chain with this.
        * @return {Phaser.Tween} Itselfe.
        */
        Tween.prototype.chain = function (tween) {
            this._chainedTweens.push(tween);

            return this;
        };

        Tween.prototype.pause = function () {
            this._paused = true;
        };

        Tween.prototype.resume = function () {
            this._paused = false;
            this._startTime += this.game.time.pauseDuration;
        };

        /**
        * Update tweening.
        * @param time {number} Current time from game clock.
        * @return {boolean} Return false if this completed and no need to update, otherwise return true.
        */
        Tween.prototype.update = function (time) {
            if (this._paused || time < this._startTime) {
                return true;
            }

            this._tempElapsed = (time - this._startTime) / this._duration;
            this._tempElapsed = this._tempElapsed > 1 ? 1 : this._tempElapsed;

            this._tempValue = this._easingFunction(this._tempElapsed);

            for (var property in this._valuesStart) {
                if (this._valuesEnd[property] instanceof Array) {
                    this._object[property] = this._interpolationFunction(this._valuesEnd[property], this._tempValue);
                } else {
                    this._object[property] = this._valuesStart[property] + (this._valuesEnd[property] - this._valuesStart[property]) * this._tempValue;
                }
            }

            this.onUpdate.dispatch(this._object, this._tempValue);

            if (this._tempElapsed == 1) {
                if (this._yoyo) {
                    if (this._yoyoCount == 0) {
                        //  Reverse the tween
                        this.reverse();
                        return true;
                    } else {
                        if (this._loop == false) {
                            this.onComplete.dispatch(this._object);

                            for (var i = 0; i < this._chainedTweens.length; i++) {
                                this._chainedTweens[i].start();
                            }

                            return false;
                        } else {
                            //  YoYo and Loop are both on
                            this._yoyoCount = 0;
                            this.reverse();
                            return true;
                        }
                    }
                }

                if (this._loop) {
                    this._yoyoCount = 0;
                    this.reset();
                    return true;
                } else {
                    this.onComplete.dispatch(this._object);

                    for (var i = 0; i < this._chainedTweens.length; i++) {
                        this._chainedTweens[i].start();
                    }

                    if (this._chainedTweens.length == 0) {
                        this.isRunning = false;
                    }

                    return false;
                }
            }

            return true;
        };
        return Tween;
    })();
    Phaser.Tween = Tween;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - TweenManager
*
* The Game has a single instance of the TweenManager through which all Tween objects are created and updated.
* Tweens are hooked into the game clock and pause system, adjusting based on the game state.
* TweenManager is based heavily on tween.js by sole (http://soledadpenades.com).
* I converted it to TypeScript, swapped the callbacks for signals and patched a few issues with regard
* to properties and completion errors. Please see https://github.com/sole/tween.js for a full list of contributors.
*/
var Phaser;
(function (Phaser) {
    var TweenManager = (function () {
        /**
        * TweenManager constructor
        * @param game {Game} A reference to the current Game.
        */
        function TweenManager(game) {
            this.game = game;

            this._tweens = [];

            this.game.onPause.add(this.pauseAll, this);
            this.game.onResume.add(this.resumeAll, this);
        }
        /**
        * Get all the tween objects in an array.
        * @return {Phaser.Tween[]} Array with all tween objects.
        */
        TweenManager.prototype.getAll = function () {
            return this._tweens;
        };

        /**
        * Remove all tween objects.
        */
        TweenManager.prototype.removeAll = function () {
            this._tweens.length = 0;
        };

        /**
        * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
        *
        * @param obj {object} Object the tween will be run on.
        * @param [localReference] {bool} If true the tween will be stored in the object.tween property so long as it exists. If already set it'll be over-written.
        * @return {Phaser.Tween} The newly created tween object.
        */
        TweenManager.prototype.create = function (object, localReference) {
            if (typeof localReference === "undefined") { localReference = false; }
            if (localReference) {
                object['tween'] = new Phaser.Tween(object, this.game);
                return object['tween'];
            } else {
                return new Phaser.Tween(object, this.game);
            }
        };

        /**
        * Add a new tween into the TweenManager.
        *
        * @param tween {Phaser.Tween} The tween object you want to add.
        * @return {Phaser.Tween} The tween object you added to the manager.
        */
        TweenManager.prototype.add = function (tween) {
            tween.parent = this.game;

            this._tweens.push(tween);

            return tween;
        };

        /**
        * Remove a tween from this manager.
        *
        * @param tween {Phaser.Tween} The tween object you want to remove.
        */
        TweenManager.prototype.remove = function (tween) {
            var i = this._tweens.indexOf(tween);

            if (i !== -1) {
                this._tweens.splice(i, 1);
            }
        };

        /**
        * Update all the tween objects you added to this manager.
        *
        * @return {boolean} Return false if there's no tween to update, otherwise return true.
        */
        TweenManager.prototype.update = function () {
            if (this._tweens.length === 0) {
                return false;
            }

            var i = 0;
            var numTweens = this._tweens.length;

            while (i < numTweens) {
                if (this._tweens[i].update(this.game.time.now)) {
                    i++;
                } else {
                    this._tweens.splice(i, 1);
                    numTweens--;
                }
            }

            return true;
        };

        TweenManager.prototype.pauseAll = function () {
            if (this._tweens.length === 0) {
                return false;
            }

            var i = 0;
            var numTweens = this._tweens.length;

            while (i < numTweens) {
                this._tweens[i].pause();
                i++;
            }
        };

        TweenManager.prototype.resumeAll = function () {
            if (this._tweens.length === 0) {
                return false;
            }

            var i = 0;
            var numTweens = this._tweens.length;

            while (i < numTweens) {
                this._tweens[i].resume();
                i++;
            }
        };
        return TweenManager;
    })();
    Phaser.TweenManager = TweenManager;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/
var Phaser;
(function (Phaser) {
    var TimeManager = (function () {
        /**
        * This is the core internal game clock. It manages the elapsed time and calculation of delta values,
        * used for game object motion and tweens.
        *
        * @class TimeManager
        * @constructor
        * @param {Phaser.Game} game A reference to the currently running game.
        */
        function TimeManager(game) {
            /**
            * Number of milliseconds elapsed since the last frame update.
            * @property elapsed
            * @public
            * @type {Number}
            */
            this.elapsed = 0;
            /**
            * Game time counter.
            * @property time
            * @public
            * @type {Number}
            */
            this.time = 0;
            /**
            * Records how long the game has been paused for. Is reset each time the game pauses.
            * @property pausedTime
            * @public
            * @type {Number}
            */
            this.pausedTime = 0;
            /**
            * The time right now.
            * @property now
            * @public
            * @type {Number}
            */
            this.now = 0;
            /**
            * Elapsed time since the last frame.
            * @property delta
            * @public
            * @type {Number}
            */
            this.delta = 0;
            /**
            * Frames per second.
            * @property fps
            * @public
            * @type {Number}
            */
            this.fps = 0;
            /**
            * The lowest rate the fps has dropped to.
            * @property fpsMin
            * @public
            * @type {Number}
            */
            this.fpsMin = 1000;
            /**
            * The highest rate the fps has reached (usually no higher than 60fps).
            * @property fpsMax
            * @public
            * @type {Number}
            */
            this.fpsMax = 0;
            /**
            * The minimum amount of time the game has taken between two frames.
            * @property msMin
            * @public
            * @type {Number}
            */
            this.msMin = 1000;
            /**
            * The maximum amount of time the game has taken between two frames.
            * @property msMax
            * @public
            * @type {Number}
            */
            this.msMax = 0;
            /**
            * The number of frames record in the last second.
            * @property frames
            * @public
            * @type {Number}
            */
            this.frames = 0;
            /**
            * The time (in ms) that the last second counter ticked over.
            * @property _timeLastSecond
            * @private
            * @type {Number}
            */
            this._timeLastSecond = 0;
            /**
            * Records how long the game was paused for in miliseconds.
            * @property pauseDuration
            * @public
            * @type {Number}
            */
            this.pauseDuration = 0;
            /**
            * The time the game started being paused.
            * @property _pauseStarted
            * @private
            * @type {Number}
            */
            this._pauseStarted = 0;
            this.game = game;

            this._started = 0;
            this._timeLastSecond = this._started;
            this.time = this._started;

            this.game.onPause.add(this.gamePaused, this);
            this.game.onResume.add(this.gameResumed, this);
        }
        Object.defineProperty(TimeManager.prototype, "totalElapsedSeconds", {
            get: /**
            * The number of seconds that have elapsed since the game was started.
            * @method totalElapsedSeconds
            * @return {Number}
            */
            function () {
                return (this.now - this._started) * 0.001;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Update clock and calculate the fps.
        * This is called automatically by Game._raf
        * @method update
        * @param {Number} raf The current timestamp, either performance.now or Date.now
        */
        TimeManager.prototype.update = function (raf) {
            this.now = raf;
            this.delta = this.now - this.time;

            this.msMin = Math.min(this.msMin, this.delta);
            this.msMax = Math.max(this.msMax, this.delta);

            this.frames++;

            if (this.now > this._timeLastSecond + 1000) {
                this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
                this.fpsMin = Math.min(this.fpsMin, this.fps);
                this.fpsMax = Math.max(this.fpsMax, this.fps);

                this._timeLastSecond = this.now;
                this.frames = 0;
            }

            this.time = this.now;

            if (this.game.paused) {
                this.pausedTime = this.now - this._pauseStarted;
            }
        };

        /**
        * Called when the game enters a paused state.
        * @method gamePaused
        * @private
        */
        TimeManager.prototype.gamePaused = function () {
            this._pauseStarted = this.now;
        };

        /**
        * Called when the game resumes from a paused state.
        * @method gameResumed
        * @private
        */
        TimeManager.prototype.gameResumed = function () {
            //  Level out the delta timer to avoid spikes
            this.pauseDuration = this.pausedTime;
        };

        /**
        * How long has passed since the given time.
        * @method elapsedSince
        * @param {Number} since The time you want to measure against.
        * @return {Number} The difference between the given time and now.
        */
        TimeManager.prototype.elapsedSince = function (since) {
            return this.now - since;
        };

        /**
        * How long has passed since the given time (in seconds).
        * @method elapsedSecondsSince
        * @param {Number} since The time you want to measure (in seconds).
        * @return {Number} Duration between given time and now (in seconds).
        */
        TimeManager.prototype.elapsedSecondsSince = function (since) {
            return (this.now - since) * 0.001;
        };

        /**
        * Resets the private _started value to now.
        * @method reset
        */
        TimeManager.prototype.reset = function () {
            this._started = this.now;
        };
        return TimeManager;
    })();
    Phaser.TimeManager = TimeManager;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Net
*
*
*/
var Phaser;
(function (Phaser) {
    var Net = (function () {
        /**
        * Net constructor
        */
        function Net(game) {
            this.game = game;
        }
        /**
        * Compares the given domain name against the hostname of the browser containing the game.
        * If the domain name is found it returns true.
        * You can specify a part of a domain, for example 'google' would match 'google.com', 'google.co.uk', etc.
        * Do not include 'http://' at the start.
        */
        Net.prototype.checkDomainName = function (domain) {
            return window.location.hostname.indexOf(domain) !== -1;
        };

        /**
        * Updates a value on the Query String and returns it in full.
        * If the value doesn't already exist it is set.
        * If the value exists it is replaced with the new value given. If you don't provide a new value it is removed from the query string.
        * Optionally you can redirect to the new url, or just return it as a string.
        */
        Net.prototype.updateQueryString = function (key, value, redirect, url) {
            if (typeof redirect === "undefined") { redirect = false; }
            if (typeof url === "undefined") { url = ''; }
            if (url == '') {
                url = window.location.href;
            }

            var output = '';

            var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");

            if (re.test(url)) {
                if (typeof value !== 'undefined' && value !== null) {
                    output = url.replace(re, '$1' + key + "=" + value + '$2$3');
                } else {
                    output = url.replace(re, '$1$3').replace(/(&|\?)$/, '');
                }
            } else {
                if (typeof value !== 'undefined' && value !== null) {
                    var separator = url.indexOf('?') !== -1 ? '&' : '?';
                    var hash = url.split('#');

                    url = hash[0] + separator + key + '=' + value;

                    if (hash[1]) {
                        url += '#' + hash[1];
                    }

                    output = url;
                } else {
                    output = url;
                }
            }

            if (redirect) {
                window.location.href = output;
            } else {
                return output;
            }
        };

        /**
        * Returns the Query String as an object.
        * If you specify a parameter it will return just the value of that parameter, should it exist.
        */
        Net.prototype.getQueryString = function (parameter) {
            if (typeof parameter === "undefined") { parameter = ''; }
            var output = {};
            var keyValues = location.search.substring(1).split('&');

            for (var i in keyValues) {
                var key = keyValues[i].split('=');

                if (key.length > 1) {
                    if (parameter && parameter == this.decodeURI(key[0])) {
                        return this.decodeURI(key[1]);
                    } else {
                        output[this.decodeURI(key[0])] = this.decodeURI(key[1]);
                    }
                }
            }

            return output;
        };

        Net.prototype.decodeURI = function (value) {
            return decodeURIComponent(value.replace(/\+/g, " "));
        };
        return Net;
    })();
    Phaser.Net = Net;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Keyboard
*
* The Keyboard class handles keyboard interactions with the game and the resulting events.
* The avoid stealing all browser input we don't use event.preventDefault. If you would like to trap a specific key however
* then use the addKeyCapture() method.
*/
var Phaser;
(function (Phaser) {
    var Keyboard = (function () {
        function Keyboard(game) {
            this._keys = {};
            this._capture = {};
            /**
            * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
            * @type {Boolean}
            */
            this.disabled = false;
            this.game = game;
        }
        Keyboard.prototype.start = function () {
            var _this = this;
            this._onKeyDown = function (event) {
                return _this.onKeyDown(event);
            };
            this._onKeyUp = function (event) {
                return _this.onKeyUp(event);
            };

            document.body.addEventListener('keydown', this._onKeyDown, false);
            document.body.addEventListener('keyup', this._onKeyUp, false);
        };

        Keyboard.prototype.stop = function () {
            document.body.removeEventListener('keydown', this._onKeyDown);
            document.body.removeEventListener('keyup', this._onKeyUp);
        };

        /**
        * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
        * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
        * You can use addKeyCapture to consume the keyboard event for specific keys so it doesn't bubble up to the the browser.
        * Pass in either a single keycode or an array of keycodes.
        * @param {Any} keycode
        */
        Keyboard.prototype.addKeyCapture = function (keycode) {
            if (typeof keycode === 'object') {
                for (var i = 0; i < keycode.length; i++) {
                    this._capture[keycode[i]] = true;
                }
            } else {
                this._capture[keycode] = true;
            }
        };

        /**
        * @param {Number} keycode
        */
        Keyboard.prototype.removeKeyCapture = function (keycode) {
            delete this._capture[keycode];
        };

        Keyboard.prototype.clearCaptures = function () {
            this._capture = {};
        };

        /**
        * @param {KeyboardEvent} event
        */
        Keyboard.prototype.onKeyDown = function (event) {
            if (this.game.input.disabled || this.disabled) {
                return;
            }

            if (this._capture[event.keyCode]) {
                event.preventDefault();
            }

            if (!this._keys[event.keyCode]) {
                this._keys[event.keyCode] = { isDown: true, timeDown: this.game.time.now, timeUp: 0 };
            } else {
                this._keys[event.keyCode].isDown = true;
                this._keys[event.keyCode].timeDown = this.game.time.now;
            }
        };

        /**
        * @param {KeyboardEvent} event
        */
        Keyboard.prototype.onKeyUp = function (event) {
            if (this.game.input.disabled || this.disabled) {
                return;
            }

            if (this._capture[event.keyCode]) {
                event.preventDefault();
            }

            if (!this._keys[event.keyCode]) {
                this._keys[event.keyCode] = { isDown: false, timeDown: 0, timeUp: this.game.time.now };
            } else {
                this._keys[event.keyCode].isDown = false;
                this._keys[event.keyCode].timeUp = this.game.time.now;
            }
        };

        Keyboard.prototype.reset = function () {
            for (var key in this._keys) {
                this._keys[key].isDown = false;
            }
        };

        /**
        * @param {Number} keycode
        * @param {Number} [duration]
        * @return {Boolean}
        */
        Keyboard.prototype.justPressed = function (keycode, duration) {
            if (typeof duration === "undefined") { duration = 250; }
            if (this._keys[keycode] && this._keys[keycode].isDown === true && (this.game.time.now - this._keys[keycode].timeDown < duration)) {
                return true;
            } else {
                return false;
            }
        };

        /**
        * @param {Number} keycode
        * @param {Number} [duration]
        * @return {Boolean}
        */
        Keyboard.prototype.justReleased = function (keycode, duration) {
            if (typeof duration === "undefined") { duration = 250; }
            if (this._keys[keycode] && this._keys[keycode].isDown === false && (this.game.time.now - this._keys[keycode].timeUp < duration)) {
                return true;
            } else {
                return false;
            }
        };

        /**
        * @param {Number} keycode
        * @return {Boolean}
        */
        Keyboard.prototype.isDown = function (keycode) {
            if (this._keys[keycode]) {
                return this._keys[keycode].isDown;
            } else {
                return false;
            }
        };

        Keyboard.A = "A".charCodeAt(0);
        Keyboard.B = "B".charCodeAt(0);
        Keyboard.C = "C".charCodeAt(0);
        Keyboard.D = "D".charCodeAt(0);
        Keyboard.E = "E".charCodeAt(0);
        Keyboard.F = "F".charCodeAt(0);
        Keyboard.G = "G".charCodeAt(0);
        Keyboard.H = "H".charCodeAt(0);
        Keyboard.I = "I".charCodeAt(0);
        Keyboard.J = "J".charCodeAt(0);
        Keyboard.K = "K".charCodeAt(0);
        Keyboard.L = "L".charCodeAt(0);
        Keyboard.M = "M".charCodeAt(0);
        Keyboard.N = "N".charCodeAt(0);
        Keyboard.O = "O".charCodeAt(0);
        Keyboard.P = "P".charCodeAt(0);
        Keyboard.Q = "Q".charCodeAt(0);
        Keyboard.R = "R".charCodeAt(0);
        Keyboard.S = "S".charCodeAt(0);
        Keyboard.T = "T".charCodeAt(0);
        Keyboard.U = "U".charCodeAt(0);
        Keyboard.V = "V".charCodeAt(0);
        Keyboard.W = "W".charCodeAt(0);
        Keyboard.X = "X".charCodeAt(0);
        Keyboard.Y = "Y".charCodeAt(0);
        Keyboard.Z = "Z".charCodeAt(0);

        Keyboard.ZERO = "0".charCodeAt(0);
        Keyboard.ONE = "1".charCodeAt(0);
        Keyboard.TWO = "2".charCodeAt(0);
        Keyboard.THREE = "3".charCodeAt(0);
        Keyboard.FOUR = "4".charCodeAt(0);
        Keyboard.FIVE = "5".charCodeAt(0);
        Keyboard.SIX = "6".charCodeAt(0);
        Keyboard.SEVEN = "7".charCodeAt(0);
        Keyboard.EIGHT = "8".charCodeAt(0);
        Keyboard.NINE = "9".charCodeAt(0);

        Keyboard.NUMPAD_0 = 96;
        Keyboard.NUMPAD_1 = 97;
        Keyboard.NUMPAD_2 = 98;
        Keyboard.NUMPAD_3 = 99;
        Keyboard.NUMPAD_4 = 100;
        Keyboard.NUMPAD_5 = 101;
        Keyboard.NUMPAD_6 = 102;
        Keyboard.NUMPAD_7 = 103;
        Keyboard.NUMPAD_8 = 104;
        Keyboard.NUMPAD_9 = 105;
        Keyboard.NUMPAD_MULTIPLY = 106;
        Keyboard.NUMPAD_ADD = 107;
        Keyboard.NUMPAD_ENTER = 108;
        Keyboard.NUMPAD_SUBTRACT = 109;
        Keyboard.NUMPAD_DECIMAL = 110;
        Keyboard.NUMPAD_DIVIDE = 111;

        Keyboard.F1 = 112;
        Keyboard.F2 = 113;
        Keyboard.F3 = 114;
        Keyboard.F4 = 115;
        Keyboard.F5 = 116;
        Keyboard.F6 = 117;
        Keyboard.F7 = 118;
        Keyboard.F8 = 119;
        Keyboard.F9 = 120;
        Keyboard.F10 = 121;
        Keyboard.F11 = 122;
        Keyboard.F12 = 123;
        Keyboard.F13 = 124;
        Keyboard.F14 = 125;
        Keyboard.F15 = 126;

        Keyboard.COLON = 186;
        Keyboard.EQUALS = 187;
        Keyboard.UNDERSCORE = 189;
        Keyboard.QUESTION_MARK = 191;
        Keyboard.TILDE = 192;
        Keyboard.OPEN_BRACKET = 219;
        Keyboard.BACKWARD_SLASH = 220;
        Keyboard.CLOSED_BRACKET = 221;
        Keyboard.QUOTES = 222;

        Keyboard.BACKSPACE = 8;
        Keyboard.TAB = 9;
        Keyboard.CLEAR = 12;
        Keyboard.ENTER = 13;
        Keyboard.SHIFT = 16;
        Keyboard.CONTROL = 17;
        Keyboard.ALT = 18;
        Keyboard.CAPS_LOCK = 20;
        Keyboard.ESC = 27;
        Keyboard.SPACEBAR = 32;
        Keyboard.PAGE_UP = 33;
        Keyboard.PAGE_DOWN = 34;
        Keyboard.END = 35;
        Keyboard.HOME = 36;
        Keyboard.LEFT = 37;
        Keyboard.UP = 38;
        Keyboard.RIGHT = 39;
        Keyboard.DOWN = 40;
        Keyboard.INSERT = 45;
        Keyboard.DELETE = 46;
        Keyboard.HELP = 47;
        Keyboard.NUM_LOCK = 144;
        return Keyboard;
    })();
    Phaser.Keyboard = Keyboard;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Mouse
*
* The Mouse class handles mouse interactions with the game and the resulting events.
*/
var Phaser;
(function (Phaser) {
    var Mouse = (function () {
        function Mouse(game) {
            /**
            * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
            * @type {Boolean}
            */
            this.disabled = false;
            this.mouseDownCallback = null;
            this.mouseMoveCallback = null;
            this.mouseUpCallback = null;
            this.game = game;
            this.callbackContext = this.game;
        }
        /**
        * Starts the event listeners running
        * @method start
        */
        Mouse.prototype.start = function () {
            var _this = this;
            if (this.game.device.android && this.game.device.chrome == false) {
                //  Android stock browser fires mouse events even if you preventDefault on the touchStart, so ...
                return;
            }

            this._onMouseDown = function (event) {
                return _this.onMouseDown(event);
            };
            this._onMouseMove = function (event) {
                return _this.onMouseMove(event);
            };
            this._onMouseUp = function (event) {
                return _this.onMouseUp(event);
            };

            this.game.stage.canvas.addEventListener('mousedown', this._onMouseDown, true);
            this.game.stage.canvas.addEventListener('mousemove', this._onMouseMove, true);
            this.game.stage.canvas.addEventListener('mouseup', this._onMouseUp, true);
        };

        /**
        * @param {MouseEvent} event
        */
        Mouse.prototype.onMouseDown = function (event) {
            if (this.mouseDownCallback) {
                this.mouseDownCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled) {
                return;
            }

            event['identifier'] = 0;

            this.game.input.mousePointer.start(event);
        };

        /**
        * @param {MouseEvent} event
        */
        Mouse.prototype.onMouseMove = function (event) {
            if (this.mouseMoveCallback) {
                this.mouseMoveCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled) {
                return;
            }

            event['identifier'] = 0;

            this.game.input.mousePointer.move(event);
        };

        /**
        * @param {MouseEvent} event
        */
        Mouse.prototype.onMouseUp = function (event) {
            if (this.mouseUpCallback) {
                this.mouseUpCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled) {
                return;
            }

            event['identifier'] = 0;

            this.game.input.mousePointer.stop(event);
        };

        /**
        * Stop the event listeners
        * @method stop
        */
        Mouse.prototype.stop = function () {
            this.game.stage.canvas.removeEventListener('mousedown', this._onMouseDown);
            this.game.stage.canvas.removeEventListener('mousemove', this._onMouseMove);
            this.game.stage.canvas.removeEventListener('mouseup', this._onMouseUp);
        };
        Mouse.LEFT_BUTTON = 0;
        Mouse.MIDDLE_BUTTON = 1;
        Mouse.RIGHT_BUTTON = 2;
        return Mouse;
    })();
    Phaser.Mouse = Mouse;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - MSPointer
*
* The MSPointer class handles touch interactions with the game and the resulting Pointer objects.
* It will work only in Internet Explorer 10 and Windows Store or Windows Phone 8 apps using JavaScript.
* http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
*/
var Phaser;
(function (Phaser) {
    var MSPointer = (function () {
        /**
        * Constructor
        * @param {Game} game.
        * @return {MSPointer} This object.
        */
        function MSPointer(game) {
            /**
            * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
            * @type {Boolean}
            */
            this.disabled = false;
            this.game = game;
        }
        /**
        * Starts the event listeners running
        * @method start
        */
        MSPointer.prototype.start = function () {
            var _this = this;
            if (this.game.device.mspointer == true) {
                this._onMSPointerDown = function (event) {
                    return _this.onPointerDown(event);
                };
                this._onMSPointerMove = function (event) {
                    return _this.onPointerMove(event);
                };
                this._onMSPointerUp = function (event) {
                    return _this.onPointerUp(event);
                };

                this.game.stage.canvas.addEventListener('MSPointerDown', this._onMSPointerDown, false);
                this.game.stage.canvas.addEventListener('MSPointerMove', this._onMSPointerMove, false);
                this.game.stage.canvas.addEventListener('MSPointerUp', this._onMSPointerUp, false);
            }
        };

        /**
        *
        * @method onPointerDown
        * @param {Any} event
        **/
        MSPointer.prototype.onPointerDown = function (event) {
            if (this.game.input.disabled || this.disabled) {
                return;
            }

            event.preventDefault();
            event.identifier = event.pointerId;

            this.game.input.startPointer(event);
        };

        /**
        *
        * @method onPointerMove
        * @param {Any} event
        **/
        MSPointer.prototype.onPointerMove = function (event) {
            if (this.game.input.disabled || this.disabled) {
                return;
            }

            event.preventDefault();
            event.identifier = event.pointerId;

            this.game.input.updatePointer(event);
        };

        /**
        *
        * @method onPointerUp
        * @param {Any} event
        **/
        MSPointer.prototype.onPointerUp = function (event) {
            if (this.game.input.disabled || this.disabled) {
                return;
            }

            event.preventDefault();
            event.identifier = event.pointerId;

            this.game.input.stopPointer(event);
        };

        /**
        * Stop the event listeners
        * @method stop
        */
        MSPointer.prototype.stop = function () {
            if (this.game.device.mspointer == true) {
                this.game.stage.canvas.removeEventListener('MSPointerDown', this._onMSPointerDown);
                this.game.stage.canvas.removeEventListener('MSPointerMove', this._onMSPointerMove);
                this.game.stage.canvas.removeEventListener('MSPointerUp', this._onMSPointerUp);
            }
        };
        return MSPointer;
    })();
    Phaser.MSPointer = MSPointer;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Touch
*
* The Touch class handles touch interactions with the game and the resulting Pointer objects.
* http://www.w3.org/TR/touch-events/
* https://developer.mozilla.org/en-US/docs/DOM/TouchList
* http://www.html5rocks.com/en/mobile/touchandmouse/
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
*/
var Phaser;
(function (Phaser) {
    var Touch = (function () {
        /**
        * Constructor
        * @param {Game} game.
        * @return {Touch} This object.
        */
        function Touch(game) {
            /**
            * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
            * @type {Boolean}
            */
            this.disabled = false;
            this.touchStartCallback = null;
            this.touchMoveCallback = null;
            this.touchEndCallback = null;
            this.touchEnterCallback = null;
            this.touchLeaveCallback = null;
            this.touchCancelCallback = null;
            this.game = game;
            this.callbackContext = this.game;
        }
        /**
        * Starts the event listeners running
        * @method start
        */
        Touch.prototype.start = function () {
            var _this = this;
            if (this.game.device.touch) {
                this._onTouchStart = function (event) {
                    return _this.onTouchStart(event);
                };
                this._onTouchMove = function (event) {
                    return _this.onTouchMove(event);
                };
                this._onTouchEnd = function (event) {
                    return _this.onTouchEnd(event);
                };
                this._onTouchEnter = function (event) {
                    return _this.onTouchEnter(event);
                };
                this._onTouchLeave = function (event) {
                    return _this.onTouchLeave(event);
                };
                this._onTouchCancel = function (event) {
                    return _this.onTouchCancel(event);
                };
                this._documentTouchMove = function (event) {
                    return _this.consumeTouchMove(event);
                };

                this.game.stage.canvas.addEventListener('touchstart', this._onTouchStart, false);
                this.game.stage.canvas.addEventListener('touchmove', this._onTouchMove, false);
                this.game.stage.canvas.addEventListener('touchend', this._onTouchEnd, false);
                this.game.stage.canvas.addEventListener('touchenter', this._onTouchEnter, false);
                this.game.stage.canvas.addEventListener('touchleave', this._onTouchLeave, false);
                this.game.stage.canvas.addEventListener('touchcancel', this._onTouchCancel, false);

                document.addEventListener('touchmove', this._documentTouchMove, false);
            }
        };

        /**
        * Prevent iOS bounce-back (doesn't work?)
        * @method consumeTouchMove
        * @param {Any} event
        **/
        Touch.prototype.consumeTouchMove = function (event) {
            event.preventDefault();
        };

        /**
        *
        * @method onTouchStart
        * @param {Any} event
        **/
        Touch.prototype.onTouchStart = function (event) {
            if (this.touchStartCallback) {
                this.touchStartCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled) {
                return;
            }

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++) {
                this.game.input.startPointer(event.changedTouches[i]);
            }
        };

        /**
        * Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
        * Occurs for example on iOS when you put down 4 fingers and the app selector UI appears
        * @method onTouchCancel
        * @param {Any} event
        **/
        Touch.prototype.onTouchCancel = function (event) {
            if (this.touchCancelCallback) {
                this.touchCancelCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled) {
                return;
            }

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++) {
                this.game.input.stopPointer(event.changedTouches[i]);
            }
        };

        /**
        * For touch enter and leave its a list of the touch points that have entered or left the target
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchEnter
        * @param {Any} event
        **/
        Touch.prototype.onTouchEnter = function (event) {
            if (this.touchEnterCallback) {
                this.touchEnterCallback.call(this.callbackContext, event);
            }

            if (this.game.input.disabled || this.disabled) {
                return;
            }

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++) {
                //console.log('touch enter');
            }
        };

        /**
        * For touch enter and leave its a list of the touch points that have entered or left the target
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchLeave
        * @param {Any} event
        **/
        Touch.prototype.onTouchLeave = function (event) {
            if (this.touchLeaveCallback) {
                this.touchLeaveCallback.call(this.callbackContext, event);
            }

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++) {
                //console.log('touch leave');
            }
        };

        /**
        *
        * @method onTouchMove
        * @param {Any} event
        **/
        Touch.prototype.onTouchMove = function (event) {
            if (this.touchMoveCallback) {
                this.touchMoveCallback.call(this.callbackContext, event);
            }

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++) {
                this.game.input.updatePointer(event.changedTouches[i]);
            }
        };

        /**
        *
        * @method onTouchEnd
        * @param {Any} event
        **/
        Touch.prototype.onTouchEnd = function (event) {
            if (this.touchEndCallback) {
                this.touchEndCallback.call(this.callbackContext, event);
            }

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++) {
                this.game.input.stopPointer(event.changedTouches[i]);
            }
        };

        /**
        * Stop the event listeners
        * @method stop
        */
        Touch.prototype.stop = function () {
            if (this.game.device.touch) {
                this.game.stage.canvas.removeEventListener('touchstart', this._onTouchStart);
                this.game.stage.canvas.removeEventListener('touchmove', this._onTouchMove);
                this.game.stage.canvas.removeEventListener('touchend', this._onTouchEnd);
                this.game.stage.canvas.removeEventListener('touchenter', this._onTouchEnter);
                this.game.stage.canvas.removeEventListener('touchleave', this._onTouchLeave);
                this.game.stage.canvas.removeEventListener('touchcancel', this._onTouchCancel);

                document.removeEventListener('touchmove', this._documentTouchMove);
            }
        };
        return Touch;
    })();
    Phaser.Touch = Touch;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Pointer
*
* A Pointer object is used by the Touch and MSPoint managers and represents a single finger on the touch screen.
*/
var Phaser;
(function (Phaser) {
    var Pointer = (function () {
        /**
        * Constructor
        * @param {Phaser.Game} game.
        * @return {Phaser.Pointer} This object.
        */
        function Pointer(game, id) {
            /**
            * Local private variable to store the status of dispatching a hold event
            * @property _holdSent
            * @type {Boolean}
            * @private
            */
            this._holdSent = false;
            /**
            * Local private variable storing the short-term history of pointer movements
            * @property _history
            * @type {Array}
            * @private
            */
            this._history = [];
            /**
            * Local private variable storing the time at which the next history drop should occur
            * @property _lastDrop
            * @type {Number}
            * @private
            */
            this._nextDrop = 0;
            //  Monitor events outside of a state reset loop
            this._stateReset = false;
            /**
            * A Vector object containing the initial position when the Pointer was engaged with the screen.
            * @property positionDown
            * @type {Vec2}
            **/
            this.positionDown = null;
            /**
            * A Vector object containing the current position of the Pointer on the screen.
            * @property position
            * @type {Vec2}
            **/
            this.position = null;
            /**
            * A Circle object centered on the x/y screen coordinates of the Pointer.
            * Default size of 44px (Apple's recommended "finger tip" size)
            * @property circle
            * @type {Circle}
            **/
            this.circle = null;
            /**
            *
            * @property withinGame
            * @type {Boolean}
            */
            this.withinGame = false;
            /**
            * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset
            * @property clientX
            * @type {Number}
            */
            this.clientX = -1;
            /**
            * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset
            * @property clientY
            * @type {Number}
            */
            this.clientY = -1;
            /**
            * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset
            * @property pageX
            * @type {Number}
            */
            this.pageX = -1;
            /**
            * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset
            * @property pageY
            * @type {Number}
            */
            this.pageY = -1;
            /**
            * The horizontal coordinate of point relative to the screen in pixels
            * @property screenX
            * @type {Number}
            */
            this.screenX = -1;
            /**
            * The vertical coordinate of point relative to the screen in pixels
            * @property screenY
            * @type {Number}
            */
            this.screenY = -1;
            /**
            * The horizontal coordinate of point relative to the game element. This value is automatically scaled based on game size.
            * @property x
            * @type {Number}
            */
            this.x = -1;
            /**
            * The vertical coordinate of point relative to the game element. This value is automatically scaled based on game size.
            * @property y
            * @type {Number}
            */
            this.y = -1;
            /**
            * If the Pointer is a mouse this is true, otherwise false
            * @property isMouse
            * @type {Boolean}
            **/
            this.isMouse = false;
            /**
            * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
            * @property isDown
            * @type {Boolean}
            **/
            this.isDown = false;
            /**
            * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
            * @property isUp
            * @type {Boolean}
            **/
            this.isUp = true;
            /**
            * A timestamp representing when the Pointer first touched the touchscreen.
            * @property timeDown
            * @type {Number}
            **/
            this.timeDown = 0;
            /**
            * A timestamp representing when the Pointer left the touchscreen.
            * @property timeUp
            * @type {Number}
            **/
            this.timeUp = 0;
            /**
            * A timestamp representing when the Pointer was last tapped or clicked
            * @property previousTapTime
            * @type {Number}
            **/
            this.previousTapTime = 0;
            /**
            * The total number of times this Pointer has been touched to the touchscreen
            * @property totalTouches
            * @type {Number}
            **/
            this.totalTouches = 0;
            /**
            * The number of miliseconds since the last click
            * @property msSinceLastClick
            * @type {Number}
            **/
            this.msSinceLastClick = Number.MAX_VALUE;
            /**
            * The Game Object this Pointer is currently over / touching / dragging.
            * @property targetObject
            * @type {Any}
            **/
            this.targetObject = null;
            /**
            * The top-most Camera that this Pointer is over (if any, null if none).
            * If the Pointer is over several cameras that are stacked on-top of each other this is only ever set to the top-most rendered camera.
            * @property camera
            * @type {Phaser.Camera}
            **/
            this.camera = null;
            this.game = game;

            this.id = id;
            this.active = false;
            this.position = new Phaser.Vec2();
            this.positionDown = new Phaser.Vec2();
            this.circle = new Phaser.Circle(0, 0, 44);

            if (id == 0) {
                this.isMouse = true;
            }
        }
        Object.defineProperty(Pointer.prototype, "duration", {
            get: /**
            * How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
            * @property duration
            * @type {Number}
            **/
            function () {
                if (this.isUp) {
                    return -1;
                }

                return this.game.time.now - this.timeDown;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Pointer.prototype, "worldX", {
            get: /**
            * Gets the X value of this Pointer in world coordinates based on the given camera.
            * @param {Camera} [camera]
            */
            function () {
                if (this.camera) {
                    return (this.camera.worldView.x - this.camera.screenView.x) + this.x;
                }

                return null;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Pointer.prototype, "worldY", {
            get: /**
            * Gets the Y value of this Pointer in world coordinates based on the given camera.
            * @param {Camera} [camera]
            */
            function () {
                if (this.camera) {
                    return (this.camera.worldView.y - this.camera.screenView.y) + this.y;
                }

                return null;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Called when the Pointer is pressed onto the touchscreen
        * @method start
        * @param {Any} event
        */
        Pointer.prototype.start = function (event) {
            this.identifier = event.identifier;
            this.target = event.target;

            if (event.button) {
                this.button = event.button;
            }

            if (this.game.paused == true && this.game.stage.scale.incorrectOrientation == false) {
                this.game.stage.resumeGame();
                return this;
            }

            this._history.length = 0;

            this.active = true;
            this.withinGame = true;
            this.isDown = true;
            this.isUp = false;

            //  Work out how long it has been since the last click
            this.msSinceLastClick = this.game.time.now - this.timeDown;

            this.timeDown = this.game.time.now;

            this._holdSent = false;

            //  This sets the x/y and other local values
            this.move(event);

            // x and y are the old values here?
            this.positionDown.setTo(this.x, this.y);

            if (this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.InputManager.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0)) {
                //this.game.input.x = this.x * this.game.input.scale.x;
                //this.game.input.y = this.y * this.game.input.scale.y;
                this.game.input.x = this.x;
                this.game.input.y = this.y;
                this.game.input.position.setTo(this.x, this.y);
                this.game.input.onDown.dispatch(this);
                this.game.input.resetSpeed(this.x, this.y);
            }

            this._stateReset = false;
            this.totalTouches++;

            if (this.isMouse == false) {
                this.game.input.currentPointers++;
            }

            if (this.targetObject !== null) {
                this.targetObject.input._touchedHandler(this);
            }

            return this;
        };

        Pointer.prototype.update = function () {
            if (this.active) {
                if (this._holdSent == false && this.duration >= this.game.input.holdRate) {
                    if (this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.InputManager.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0)) {
                        this.game.input.onHold.dispatch(this);
                    }

                    this._holdSent = true;
                }

                if (this.game.input.recordPointerHistory && this.game.time.now >= this._nextDrop) {
                    this._nextDrop = this.game.time.now + this.game.input.recordRate;
                    this._history.push({ x: this.position.x, y: this.position.y });

                    if (this._history.length > this.game.input.recordLimit) {
                        this._history.shift();
                    }
                }

                //  Check which camera they are over
                this.camera = this.game.world.cameras.getCameraUnderPoint(this.x, this.y);
            }
        };

        /**
        * Called when the Pointer is moved on the touchscreen
        * @method move
        * @param {Any} event
        */
        Pointer.prototype.move = function (event) {
            if (this.game.input.pollLocked) {
                return;
            }

            if (event.button) {
                this.button = event.button;
            }

            this.clientX = event.clientX;
            this.clientY = event.clientY;
            this.pageX = event.pageX;
            this.pageY = event.pageY;
            this.screenX = event.screenX;
            this.screenY = event.screenY;

            this.x = (this.pageX - this.game.stage.offset.x) * this.game.input.scale.x;
            this.y = (this.pageY - this.game.stage.offset.y) * this.game.input.scale.y;

            this.position.setTo(this.x, this.y);
            this.circle.x = this.x;
            this.circle.y = this.y;

            if (this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.InputManager.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0)) {
                this.game.input.activePointer = this;
                this.game.input.x = this.x;
                this.game.input.y = this.y;
                this.game.input.position.setTo(this.game.input.x, this.game.input.y);
                this.game.input.circle.x = this.game.input.x;
                this.game.input.circle.y = this.game.input.y;
            }

            if (this.game.paused) {
                return this;
            }

            if (this.targetObject !== null && this.targetObject.input && this.targetObject.input.isDragged == true) {
                if (this.targetObject.input.update(this) == false) {
                    this.targetObject = null;
                }
                return this;
            }

            //  Work out which object is on the top
            this._highestRenderOrderID = -1;
            this._highestRenderObject = -1;
            this._highestInputPriorityID = -1;

            for (var i = 0; i < this.game.input.totalTrackedObjects; i++) {
                if (this.game.input.inputObjects[i] && this.game.input.inputObjects[i].input && this.game.input.inputObjects[i].input.checkPointerOver(this)) {
                    if (this.game.input.inputObjects[i].input.priorityID > this._highestInputPriorityID || (this.game.input.inputObjects[i].input.priorityID == this._highestInputPriorityID && this.game.input.inputObjects[i].renderOrderID > this._highestRenderOrderID)) {
                        this._highestRenderOrderID = this.game.input.inputObjects[i].renderOrderID;
                        this._highestRenderObject = i;
                        this._highestInputPriorityID = this.game.input.inputObjects[i].input.priorityID;
                    }
                }
            }

            if (this._highestRenderObject == -1) {
                if (this.targetObject !== null) {
                    this.targetObject.input._pointerOutHandler(this);
                    this.targetObject = null;
                }
            } else {
                if (this.targetObject == null) {
                    //  And now set the new one
                    this.targetObject = this.game.input.inputObjects[this._highestRenderObject];
                    this.targetObject.input._pointerOverHandler(this);
                } else {
                    if (this.targetObject == this.game.input.inputObjects[this._highestRenderObject]) {
                        if (this.targetObject.input.update(this) == false) {
                            this.targetObject = null;
                        }
                    } else {
                        //  The target has changed, so tell the old one we've left it
                        this.targetObject.input._pointerOutHandler(this);

                        //  And now set the new one
                        this.targetObject = this.game.input.inputObjects[this._highestRenderObject];
                        this.targetObject.input._pointerOverHandler(this);
                    }
                }
            }

            return this;
        };

        /**
        * Called when the Pointer leaves the target area
        * @method leave
        * @param {Any} event
        */
        Pointer.prototype.leave = function (event) {
            this.withinGame = false;
            this.move(event);
        };

        /**
        * Called when the Pointer leaves the touchscreen
        * @method stop
        * @param {Any} event
        */
        Pointer.prototype.stop = function (event) {
            if (this._stateReset) {
                event.preventDefault();
                return;
            }

            this.timeUp = this.game.time.now;

            if (this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.InputManager.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0)) {
                this.game.input.onUp.dispatch(this);

                if (this.duration >= 0 && this.duration <= this.game.input.tapRate) {
                    if (this.timeUp - this.previousTapTime < this.game.input.doubleTapRate) {
                        //  Yes, let's dispatch the signal then with the 2nd parameter set to true
                        this.game.input.onTap.dispatch(this, true);
                    } else {
                        //  Wasn't a double-tap, so dispatch a single tap signal
                        this.game.input.onTap.dispatch(this, false);
                    }

                    this.previousTapTime = this.timeUp;
                }
            }

            if (this.id > 0) {
                this.active = false;
            }

            this.withinGame = false;
            this.isDown = false;
            this.isUp = true;

            if (this.isMouse == false) {
                this.game.input.currentPointers--;
            }

            for (var i = 0; i < this.game.input.totalTrackedObjects; i++) {
                if (this.game.input.inputObjects[i] && this.game.input.inputObjects[i].input && this.game.input.inputObjects[i].input.enabled) {
                    this.game.input.inputObjects[i].input._releasedHandler(this);
                }
            }

            if (this.targetObject) {
                this.targetObject.input._releasedHandler(this);
            }

            this.targetObject = null;

            return this;
        };

        /**
        * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate
        * @method justPressed
        * @param {Number} [duration].
        * @return {Boolean}
        */
        Pointer.prototype.justPressed = function (duration) {
            if (typeof duration === "undefined") { duration = this.game.input.justPressedRate; }
            if (this.isDown === true && (this.timeDown + duration) > this.game.time.now) {
                return true;
            } else {
                return false;
            }
        };

        /**
        * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate
        * @method justReleased
        * @param {Number} [duration].
        * @return {Boolean}
        */
        Pointer.prototype.justReleased = function (duration) {
            if (typeof duration === "undefined") { duration = this.game.input.justReleasedRate; }
            if (this.isUp === true && (this.timeUp + duration) > this.game.time.now) {
                return true;
            } else {
                return false;
            }
        };

        /**
        * Resets the Pointer properties. Called by InputManager.reset when you perform a State change.
        * @method reset
        */
        Pointer.prototype.reset = function () {
            if (this.isMouse == false) {
                this.active = false;
            }

            this.identifier = null;
            this.isDown = false;
            this.isUp = true;
            this.totalTouches = 0;
            this._holdSent = false;
            this._history.length = 0;
            this._stateReset = true;

            if (this.targetObject && this.targetObject.input) {
                this.targetObject.input._releasedHandler(this);
            }

            this.targetObject = null;
        };

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {String} a string representation of the instance.
        **/
        Pointer.prototype.toString = function () {
            return "[{Pointer (id=" + this.id + " identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";
        };
        return Pointer;
    })();
    Phaser.Pointer = Pointer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Components - InputHandler
    *
    * Input detection component
    */
    (function (Components) {
        var InputHandler = (function () {
            /**
            * Sprite Input component constructor
            * @param parent The Sprite using this Input component
            */
            function InputHandler(parent) {
                /**
                * The PriorityID controls which Sprite receives an Input event first if they should overlap.
                */
                this.priorityID = 0;
                /**
                * The index of this Input component entry in the Game.Input manager.
                */
                this.indexID = 0;
                this.isDragged = false;
                this.dragPixelPerfect = false;
                this.allowHorizontalDrag = true;
                this.allowVerticalDrag = true;
                this.bringToTop = false;
                this.snapOnDrag = false;
                this.snapOnRelease = false;
                this.snapX = 0;
                this.snapY = 0;
                /**
                * Is this sprite allowed to be dragged by the mouse? true = yes, false = no
                * @default false
                */
                this.draggable = false;
                /**
                * A region of the game world within which the sprite is restricted during drag
                * @default null
                */
                this.boundsRect = null;
                /**
                * An Sprite the bounds of which this sprite is restricted during drag
                * @default null
                */
                this.boundsSprite = null;
                /**
                * If this object is set to consume the pointer event then it will stop all propogation from this object on.
                * For example if you had a stack of 6 sprites with the same priority IDs and one consumed the event, none of the others would receive it.
                * @type {Boolean}
                */
                this.consumePointerEvent = false;
                this.game = parent.game;
                this._parent = parent;
                this.enabled = false;
            }
            /**
            * The x coordinate of the Input pointer, relative to the top-left of the parent Sprite.
            * This value is only set when the pointer is over this Sprite.
            * @type {number}
            */
            InputHandler.prototype.pointerX = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].x;
            };

            /**
            * The y coordinate of the Input pointer, relative to the top-left of the parent Sprite
            * This value is only set when the pointer is over this Sprite.
            * @type {number}
            */
            InputHandler.prototype.pointerY = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].y;
            };

            /**
            * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
            * @property isDown
            * @type {Boolean}
            **/
            InputHandler.prototype.pointerDown = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isDown;
            };

            /**
            * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
            * @property isUp
            * @type {Boolean}
            **/
            InputHandler.prototype.pointerUp = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isUp;
            };

            /**
            * A timestamp representing when the Pointer first touched the touchscreen.
            * @property timeDown
            * @type {Number}
            **/
            InputHandler.prototype.pointerTimeDown = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeDown;
            };

            /**
            * A timestamp representing when the Pointer left the touchscreen.
            * @property timeUp
            * @type {Number}
            **/
            InputHandler.prototype.pointerTimeUp = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeUp;
            };

            /**
            * Is the Pointer over this Sprite
            * @property isOver
            * @type {Boolean}
            **/
            InputHandler.prototype.pointerOver = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isOver;
            };

            /**
            * Is the Pointer outside of this Sprite
            * @property isOut
            * @type {Boolean}
            **/
            InputHandler.prototype.pointerOut = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isOut;
            };

            /**
            * A timestamp representing when the Pointer first touched the touchscreen.
            * @property timeDown
            * @type {Number}
            **/
            InputHandler.prototype.pointerTimeOver = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeOver;
            };

            /**
            * A timestamp representing when the Pointer left the touchscreen.
            * @property timeUp
            * @type {Number}
            **/
            InputHandler.prototype.pointerTimeOut = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeOut;
            };

            /**
            * Is this sprite being dragged by the mouse or not?
            * @default false
            */
            InputHandler.prototype.pointerDragged = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isDragged;
            };

            InputHandler.prototype.start = function (priority, checkBody, useHandCursor) {
                if (typeof priority === "undefined") { priority = 0; }
                if (typeof checkBody === "undefined") { checkBody = false; }
                if (typeof useHandCursor === "undefined") { useHandCursor = false; }
                if (this.enabled == false) {
                    //  Register, etc
                    this.checkBody = checkBody;
                    this.useHandCursor = useHandCursor;
                    this.priorityID = priority;

                    this._pointerData = [];

                    for (var i = 0; i < 10; i++) {
                        this._pointerData.push({ id: i, x: 0, y: 0, isDown: false, isUp: false, isOver: false, isOut: false, timeOver: 0, timeOut: 0, timeDown: 0, timeUp: 0, downDuration: 0, isDragged: false });
                    }

                    this.snapOffset = new Phaser.Point();
                    this.enabled = true;

                    this.game.input.addGameObject(this._parent);

                    if (this._parent.events.onInputOver == null) {
                        this._parent.events.onInputOver = new Phaser.Signal();
                        this._parent.events.onInputOut = new Phaser.Signal();
                        this._parent.events.onInputDown = new Phaser.Signal();
                        this._parent.events.onInputUp = new Phaser.Signal();
                        this._parent.events.onDragStart = new Phaser.Signal();
                        this._parent.events.onDragStop = new Phaser.Signal();
                    }
                }

                return this._parent;
            };

            InputHandler.prototype.reset = function () {
                this.enabled = false;

                for (var i = 0; i < 10; i++) {
                    this._pointerData[i] = { id: i, x: 0, y: 0, isDown: false, isUp: false, isOver: false, isOut: false, timeOver: 0, timeOut: 0, timeDown: 0, timeUp: 0, downDuration: 0, isDragged: false };
                }
            };

            InputHandler.prototype.stop = function () {
                if (this.enabled == false) {
                    return;
                } else {
                    //  De-register, etc
                    this.enabled = false;
                    this.game.input.removeGameObject(this.indexID);
                }
            };

            /**
            * Clean up memory.
            */
            InputHandler.prototype.destroy = function () {
                if (this.enabled) {
                    this.enabled = false;
                    this.game.input.removeGameObject(this.indexID);
                }
            };

            /**
            * Checks if the given pointer is over this Sprite. All checks are done in world coordinates.
            */
            InputHandler.prototype.checkPointerOver = function (pointer) {
                if (this.enabled == false || this._parent.visible == false) {
                    return false;
                } else {
                    return Phaser.SpriteUtils.overlapsXY(this._parent, pointer.worldX, pointer.worldY);
                }
            };

            /**
            * Update
            */
            InputHandler.prototype.update = function (pointer) {
                if (this.enabled == false || this._parent.visible == false) {
                    this._pointerOutHandler(pointer);
                    return false;
                }

                if (this.draggable && this._draggedPointerID == pointer.id) {
                    return this.updateDrag(pointer);
                } else if (this._pointerData[pointer.id].isOver == true) {
                    if (Phaser.SpriteUtils.overlapsXY(this._parent, pointer.worldX, pointer.worldY)) {
                        this._pointerData[pointer.id].x = pointer.x - this._parent.x;
                        this._pointerData[pointer.id].y = pointer.y - this._parent.y;
                        return true;
                    } else {
                        this._pointerOutHandler(pointer);
                        return false;
                    }
                }
            };

            InputHandler.prototype._pointerOverHandler = function (pointer) {
                if (this._pointerData[pointer.id].isOver == false) {
                    this._pointerData[pointer.id].isOver = true;
                    this._pointerData[pointer.id].isOut = false;
                    this._pointerData[pointer.id].timeOver = this.game.time.now;
                    this._pointerData[pointer.id].x = pointer.x - this._parent.x;
                    this._pointerData[pointer.id].y = pointer.y - this._parent.y;

                    if (this.useHandCursor && this._pointerData[pointer.id].isDragged == false) {
                        this.game.stage.canvas.style.cursor = "pointer";
                    }

                    this._parent.events.onInputOver.dispatch(this._parent, pointer);
                }
            };

            InputHandler.prototype._pointerOutHandler = function (pointer) {
                this._pointerData[pointer.id].isOver = false;
                this._pointerData[pointer.id].isOut = true;
                this._pointerData[pointer.id].timeOut = this.game.time.now;

                if (this.useHandCursor && this._pointerData[pointer.id].isDragged == false) {
                    this.game.stage.canvas.style.cursor = "default";
                }

                this._parent.events.onInputOut.dispatch(this._parent, pointer);
            };

            InputHandler.prototype._touchedHandler = function (pointer) {
                if (this._pointerData[pointer.id].isDown == false && this._pointerData[pointer.id].isOver == true) {
                    this._pointerData[pointer.id].isDown = true;
                    this._pointerData[pointer.id].isUp = false;
                    this._pointerData[pointer.id].timeDown = this.game.time.now;

                    //console.log('touchedHandler: ' + Date.now());
                    this._parent.events.onInputDown.dispatch(this._parent, pointer);

                    if (this.draggable && this.isDragged == false) {
                        this.startDrag(pointer);
                    }

                    if (this.bringToTop) {
                        this._parent.bringToTop();
                        //this._parent.game.world.group.bringToTop(this._parent);
                    }
                }

                //  Consume the event?
                return this.consumePointerEvent;
            };

            InputHandler.prototype._releasedHandler = function (pointer) {
                if (this._pointerData[pointer.id].isDown && pointer.isUp) {
                    this._pointerData[pointer.id].isDown = false;
                    this._pointerData[pointer.id].isUp = true;
                    this._pointerData[pointer.id].timeUp = this.game.time.now;
                    this._pointerData[pointer.id].downDuration = this._pointerData[pointer.id].timeUp - this._pointerData[pointer.id].timeDown;

                    if (Phaser.SpriteUtils.overlapsXY(this._parent, pointer.worldX, pointer.worldY)) {
                        //console.log('releasedHandler: ' + Date.now());
                        this._parent.events.onInputUp.dispatch(this._parent, pointer);
                    } else {
                        if (this.useHandCursor) {
                            this.game.stage.canvas.style.cursor = "default";
                        }
                    }

                    if (this.draggable && this.isDragged && this._draggedPointerID == pointer.id) {
                        this.stopDrag(pointer);
                    }
                }
            };

            /**
            * Updates the Pointer drag on this Sprite.
            */
            InputHandler.prototype.updateDrag = function (pointer) {
                if (pointer.isUp) {
                    this.stopDrag(pointer);
                    return false;
                }

                if (this.allowHorizontalDrag) {
                    this._parent.x = pointer.x + this._dragPoint.x + this.dragOffset.x;
                }

                if (this.allowVerticalDrag) {
                    this._parent.y = pointer.y + this._dragPoint.y + this.dragOffset.y;
                }

                if (this.boundsRect) {
                    this.checkBoundsRect();
                }

                if (this.boundsSprite) {
                    this.checkBoundsSprite();
                }

                if (this.snapOnDrag) {
                    this._parent.x = Math.floor(this._parent.x / this.snapX) * this.snapX;
                    this._parent.y = Math.floor(this._parent.y / this.snapY) * this.snapY;
                }

                return true;
            };

            /**
            * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
            * @param delay The time below which the pointer is considered as just over.
            * @returns {boolean}
            */
            InputHandler.prototype.justOver = function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isOver && this.overDuration(pointer) < delay);
            };

            /**
            * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
            * @param delay The time below which the pointer is considered as just out.
            * @returns {boolean}
            */
            InputHandler.prototype.justOut = function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isOut && (this.game.time.now - this._pointerData[pointer].timeOut < delay));
            };

            /**
            * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
            * @param delay The time below which the pointer is considered as just over.
            * @returns {boolean}
            */
            InputHandler.prototype.justPressed = function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isDown && this.downDuration(pointer) < delay);
            };

            /**
            * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
            * @param delay The time below which the pointer is considered as just out.
            * @returns {boolean}
            */
            InputHandler.prototype.justReleased = function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isUp && (this.game.time.now - this._pointerData[pointer].timeUp < delay));
            };

            /**
            * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
            * @returns {number} The number of milliseconds the pointer has been over the Sprite, or -1 if not over.
            */
            InputHandler.prototype.overDuration = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (this._pointerData[pointer].isOver) {
                    return this.game.time.now - this._pointerData[pointer].timeOver;
                }

                return -1;
            };

            /**
            * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
            * @returns {number} The number of milliseconds the pointer has been pressed down on the Sprite, or -1 if not over.
            */
            InputHandler.prototype.downDuration = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (this._pointerData[pointer].isDown) {
                    return this.game.time.now - this._pointerData[pointer].timeDown;
                }

                return -1;
            };

            /**
            * Make this Sprite draggable by the mouse. You can also optionally set mouseStartDragCallback and mouseStopDragCallback
            *
            * @param	lockCenter			If false the Sprite will drag from where you click it minus the dragOffset. If true it will center itself to the tip of the mouse pointer.
            * @param	bringToTop			If true the Sprite will be bought to the top of the rendering list in its current Group.
            * @param	pixelPerfect		If true it will use a pixel perfect test to see if you clicked the Sprite. False uses the bounding box.
            * @param	alphaThreshold		If using pixel perfect collision this specifies the alpha level from 0 to 255 above which a collision is processed (default 255)
            * @param	boundsRect			If you want to restrict the drag of this sprite to a specific FlxRect, pass the FlxRect here, otherwise it's free to drag anywhere
            * @param	boundsSprite		If you want to restrict the drag of this sprite to within the bounding box of another sprite, pass it here
            */
            InputHandler.prototype.enableDrag = function (lockCenter, bringToTop, pixelPerfect, alphaThreshold, boundsRect, boundsSprite) {
                if (typeof lockCenter === "undefined") { lockCenter = false; }
                if (typeof bringToTop === "undefined") { bringToTop = false; }
                if (typeof pixelPerfect === "undefined") { pixelPerfect = false; }
                if (typeof alphaThreshold === "undefined") { alphaThreshold = 255; }
                if (typeof boundsRect === "undefined") { boundsRect = null; }
                if (typeof boundsSprite === "undefined") { boundsSprite = null; }
                this._dragPoint = new Phaser.Point();

                this.draggable = true;
                this.bringToTop = bringToTop;

                this.dragOffset = new Phaser.Point();
                this.dragFromCenter = lockCenter;
                this.dragPixelPerfect = pixelPerfect;
                this.dragPixelPerfectAlpha = alphaThreshold;

                if (boundsRect) {
                    this.boundsRect = boundsRect;
                }

                if (boundsSprite) {
                    this.boundsSprite = boundsSprite;
                }
            };

            /**
            * Stops this sprite from being able to be dragged. If it is currently the target of an active drag it will be stopped immediately. Also disables any set callbacks.
            */
            InputHandler.prototype.disableDrag = function () {
                if (this._pointerData) {
                    for (var i = 0; i < 10; i++) {
                        this._pointerData[i].isDragged = false;
                    }
                }

                this.draggable = false;
                this.isDragged = false;
                this._draggedPointerID = -1;
            };

            /**
            * Called by Pointer when drag starts on this Sprite. Should not usually be called directly.
            */
            InputHandler.prototype.startDrag = function (pointer) {
                this.isDragged = true;
                this._draggedPointerID = pointer.id;
                this._pointerData[pointer.id].isDragged = true;

                if (this.dragFromCenter) {
                    this._parent.transform.centerOn(pointer.worldX, pointer.worldY);
                    this._dragPoint.setTo(this._parent.x - pointer.x, this._parent.y - pointer.y);
                } else {
                    this._dragPoint.setTo(this._parent.x - pointer.x, this._parent.y - pointer.y);
                }

                this.updateDrag(pointer);

                if (this.bringToTop) {
                    this._parent.bringToTop();
                }

                this._parent.events.onDragStart.dispatch(this._parent, pointer);
            };

            /**
            * Called by Pointer when drag is stopped on this Sprite. Should not usually be called directly.
            */
            InputHandler.prototype.stopDrag = function (pointer) {
                this.isDragged = false;
                this._draggedPointerID = -1;
                this._pointerData[pointer.id].isDragged = false;

                if (this.snapOnRelease) {
                    this._parent.x = Math.floor(this._parent.x / this.snapX) * this.snapX;
                    this._parent.y = Math.floor(this._parent.y / this.snapY) * this.snapY;
                }

                this._parent.events.onDragStop.dispatch(this._parent, pointer);
                this._parent.events.onInputUp.dispatch(this._parent, pointer);
            };

            /**
            * Restricts this sprite to drag movement only on the given axis. Note: If both are set to false the sprite will never move!
            *
            * @param	allowHorizontal		To enable the sprite to be dragged horizontally set to true, otherwise false
            * @param	allowVertical		To enable the sprite to be dragged vertically set to true, otherwise false
            */
            InputHandler.prototype.setDragLock = function (allowHorizontal, allowVertical) {
                if (typeof allowHorizontal === "undefined") { allowHorizontal = true; }
                if (typeof allowVertical === "undefined") { allowVertical = true; }
                this.allowHorizontalDrag = allowHorizontal;
                this.allowVerticalDrag = allowVertical;
            };

            /**
            * Make this Sprite snap to the given grid either during drag or when it's released.
            * For example 16x16 as the snapX and snapY would make the sprite snap to every 16 pixels.
            *
            * @param	snapX		The width of the grid cell in pixels
            * @param	snapY		The height of the grid cell in pixels
            * @param	onDrag		If true the sprite will snap to the grid while being dragged
            * @param	onRelease	If true the sprite will snap to the grid when released
            */
            InputHandler.prototype.enableSnap = function (snapX, snapY, onDrag, onRelease) {
                if (typeof onDrag === "undefined") { onDrag = true; }
                if (typeof onRelease === "undefined") { onRelease = false; }
                this.snapOnDrag = onDrag;
                this.snapOnRelease = onRelease;
                this.snapX = snapX;
                this.snapY = snapY;
            };

            /**
            * Stops the sprite from snapping to a grid during drag or release.
            */
            InputHandler.prototype.disableSnap = function () {
                this.snapOnDrag = false;
                this.snapOnRelease = false;
            };

            /**
            * Bounds Rect check for the sprite drag
            */
            InputHandler.prototype.checkBoundsRect = function () {
                if (this._parent.x < this.boundsRect.left) {
                    this._parent.x = this.boundsRect.x;
                } else if ((this._parent.x + this._parent.width) > this.boundsRect.right) {
                    this._parent.x = this.boundsRect.right - this._parent.width;
                }

                if (this._parent.y < this.boundsRect.top) {
                    this._parent.y = this.boundsRect.top;
                } else if ((this._parent.y + this._parent.height) > this.boundsRect.bottom) {
                    this._parent.y = this.boundsRect.bottom - this._parent.height;
                }
            };

            /**
            * Parent Sprite Bounds check for the sprite drag
            */
            InputHandler.prototype.checkBoundsSprite = function () {
                if (this._parent.x < this.boundsSprite.x) {
                    this._parent.x = this.boundsSprite.x;
                } else if ((this._parent.x + this._parent.width) > (this.boundsSprite.x + this.boundsSprite.width)) {
                    this._parent.x = (this.boundsSprite.x + this.boundsSprite.width) - this._parent.width;
                }

                if (this._parent.y < this.boundsSprite.y) {
                    this._parent.y = this.boundsSprite.y;
                } else if ((this._parent.y + this._parent.height) > (this.boundsSprite.y + this.boundsSprite.height)) {
                    this._parent.y = (this.boundsSprite.y + this.boundsSprite.height) - this._parent.height;
                }
            };
            return InputHandler;
        })();
        Components.InputHandler = InputHandler;
    })(Phaser.Components || (Phaser.Components = {}));
    var Components = Phaser.Components;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - InputManager
*
* A game specific Input manager that looks after the mouse, keyboard and touch objects.
* This is updated by the core game loop.
*/
var Phaser;
(function (Phaser) {
    var InputManager = (function () {
        function InputManager(game) {
            /**
            * How often should the input pointers be checked for updates?
            * A value of 0 means every single frame (60fps), a value of 1 means every other frame (30fps) and so on.
            * @type {number}
            */
            this.pollRate = 0;
            this._pollCounter = 0;
            /**
            * A vector object representing the previous position of the Pointer.
            * @property vector
            * @type {Vec2}
            **/
            this._oldPosition = null;
            /**
            * X coordinate of the most recent Pointer event
            * @type {Number}
            * @private
            */
            this._x = 0;
            /**
            * X coordinate of the most recent Pointer event
            * @type {Number}
            * @private
            */
            this._y = 0;
            /**
            * You can disable all Input by setting Input.disabled = true. While set all new input related events will be ignored.
            * If you need to disable just one type of input, for example mouse, use Input.mouse.disabled = true instead
            * @type {Boolean}
            */
            this.disabled = false;
            /**
            * Controls the expected behaviour when using a mouse and touch together on a multi-input device
            */
            this.multiInputOverride = InputManager.MOUSE_TOUCH_COMBINE;
            /**
            * Phaser.Gestures handler
            * @type {Gestures}
            */
            //public gestures: Gestures;
            /**
            * A vector object representing the current position of the Pointer.
            * @property vector
            * @type {Vec2}
            **/
            this.position = null;
            /**
            * A vector object representing the speed of the Pointer. Only really useful in single Pointer games,
            * otherwise see the Pointer objects directly.
            * @property vector
            * @type {Vec2}
            **/
            this.speed = null;
            /**
            * A Circle object centered on the x/y screen coordinates of the Input.
            * Default size of 44px (Apples recommended "finger tip" size) but can be changed to anything
            * @property circle
            * @type {Circle}
            **/
            this.circle = null;
            /**
            * The scale by which all input coordinates are multiplied, calculated by the StageScaleMode.
            * In an un-scaled game the values will be x: 1 and y: 1.
            * @type {Vec2}
            */
            this.scale = null;
            /**
            * The maximum number of Pointers allowed to be active at any one time.
            * For lots of games it's useful to set this to 1
            * @type {Number}
            */
            this.maxPointers = 10;
            /**
            * The current number of active Pointers.
            * @type {Number}
            */
            this.currentPointers = 0;
            /**
            * The number of milliseconds that the Pointer has to be pressed down and then released to be considered a tap or click
            * @property tapRate
            * @type {Number}
            **/
            this.tapRate = 200;
            /**
            * The number of milliseconds between taps of the same Pointer for it to be considered a double tap / click
            * @property doubleTapRate
            * @type {Number}
            **/
            this.doubleTapRate = 300;
            /**
            * The number of milliseconds that the Pointer has to be pressed down for it to fire a onHold event
            * @property holdRate
            * @type {Number}
            **/
            this.holdRate = 2000;
            /**
            * The number of milliseconds below which the Pointer is considered justPressed
            * @property justPressedRate
            * @type {Number}
            **/
            this.justPressedRate = 200;
            /**
            * The number of milliseconds below which the Pointer is considered justReleased
            * @property justReleasedRate
            * @type {Number}
            **/
            this.justReleasedRate = 200;
            /**
            * Sets if the Pointer objects should record a history of x/y coordinates they have passed through.
            * The history is cleared each time the Pointer is pressed down.
            * The history is updated at the rate specified in Input.pollRate
            * @property recordPointerHistory
            * @type {Boolean}
            **/
            this.recordPointerHistory = false;
            /**
            * The rate in milliseconds at which the Pointer objects should update their tracking history
            * @property recordRate
            * @type {Number}
            */
            this.recordRate = 100;
            /**
            * The total number of entries that can be recorded into the Pointer objects tracking history.
            * If the Pointer is tracking one event every 100ms, then a trackLimit of 100 would store the last 10 seconds worth of history.
            * @property recordLimit
            * @type {Number}
            */
            this.recordLimit = 100;
            /**
            * A Pointer object
            * @property pointer3
            * @type {Pointer}
            **/
            this.pointer3 = null;
            /**
            * A Pointer object
            * @property pointer4
            * @type {Pointer}
            **/
            this.pointer4 = null;
            /**
            * A Pointer object
            * @property pointer5
            * @type {Pointer}
            **/
            this.pointer5 = null;
            /**
            * A Pointer object
            * @property pointer6
            * @type {Pointer}
            **/
            this.pointer6 = null;
            /**
            * A Pointer object
            * @property pointer7
            * @type {Pointer}
            **/
            this.pointer7 = null;
            /**
            * A Pointer object
            * @property pointer8
            * @type {Pointer}
            **/
            this.pointer8 = null;
            /**
            * A Pointer object
            * @property pointer9
            * @type {Pointer}
            **/
            this.pointer9 = null;
            /**
            * A Pointer object
            * @property pointer10
            * @type {Pointer}
            **/
            this.pointer10 = null;
            /**
            * The most recently active Pointer object.
            * When you've limited max pointers to 1 this will accurately be either the first finger touched or mouse.
            * @property activePointer
            * @type {Pointer}
            **/
            this.activePointer = null;
            this.inputObjects = [];
            this.totalTrackedObjects = 0;
            this.game = game;

            this.mousePointer = new Phaser.Pointer(this.game, 0);
            this.pointer1 = new Phaser.Pointer(this.game, 1);
            this.pointer2 = new Phaser.Pointer(this.game, 2);

            this.mouse = new Phaser.Mouse(this.game);
            this.keyboard = new Phaser.Keyboard(this.game);
            this.touch = new Phaser.Touch(this.game);
            this.mspointer = new Phaser.MSPointer(this.game);

            //this.gestures = new Gestures(this.game);
            this.onDown = new Phaser.Signal();
            this.onUp = new Phaser.Signal();
            this.onTap = new Phaser.Signal();
            this.onHold = new Phaser.Signal();

            this.scale = new Phaser.Vec2(1, 1);
            this.speed = new Phaser.Vec2();
            this.position = new Phaser.Vec2();
            this._oldPosition = new Phaser.Vec2();
            this.circle = new Phaser.Circle(0, 0, 44);

            this.activePointer = this.mousePointer;
            this.currentPointers = 0;

            this.hitCanvas = document.createElement('canvas');
            this.hitCanvas.width = 1;
            this.hitCanvas.height = 1;
            this.hitContext = this.hitCanvas.getContext('2d');
        }
        Object.defineProperty(InputManager.prototype, "camera", {
            get: /**
            * The camera being used for mouse and touch based pointers to calculate their world coordinates.
            * This is only ever the camera set by the most recently active Pointer.
            * If you need to know exactly which camera a specific Pointer is over then see Pointer.camera instead.
            * @property camera
            * @type {Camera}
            **/
            function () {
                return this.activePointer.camera;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(InputManager.prototype, "x", {
            get: /**
            * The X coordinate of the most recently active pointer.
            * This value takes game scaling into account automatically. See Pointer.screenX/clientX for source values.
            * @property x
            * @type {Number}
            **/
            function () {
                return this._x;
            },
            set: function (value) {
                this._x = Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(InputManager.prototype, "y", {
            get: /**
            * The Y coordinate of the most recently active pointer.
            * This value takes game scaling into account automatically. See Pointer.screenY/clientY for source values.
            * @property y
            * @type {Number}
            **/
            function () {
                return this._y;
            },
            set: function (value) {
                this._y = Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Add a new Pointer object to the Input Manager. By default Input creates 2 pointer objects for you. If you need more
        * use this to create a new one, up to a maximum of 10.
        * @method addPointer
        * @return {Pointer} A reference to the new Pointer object
        **/
        InputManager.prototype.addPointer = function () {
            var next = 0;

            for (var i = 10; i > 0; i--) {
                if (this['pointer' + i] === null) {
                    next = i;
                }
            }

            if (next == 0) {
                throw new Error("You can only have 10 Pointer objects");
                return null;
            } else {
                this['pointer' + next] = new Phaser.Pointer(this.game, next);
                return this['pointer' + next];
            }
        };

        /**
        * Starts the Input Manager running
        * @method start
        **/
        InputManager.prototype.boot = function () {
            this.mouse.start();
            this.keyboard.start();
            this.touch.start();
            this.mspointer.start();

            //this.gestures.start();
            this.mousePointer.active = true;
        };

        /**
        * Adds a new game object to be tracked by the Input Manager. Called by the Sprite.Input component, should not usually be called directly.
        * @method addGameObject
        **/
        InputManager.prototype.addGameObject = function (object) {
            for (var i = 0; i < this.inputObjects.length; i++) {
                if (this.inputObjects[i] == null) {
                    this.inputObjects[i] = object;
                    object.input.indexID = i;
                    this.totalTrackedObjects++;
                    return;
                }
            }

            //  If we got this far we need to push a new entry into the array
            object.input.indexID = this.inputObjects.length;

            this.inputObjects.push(object);

            this.totalTrackedObjects++;
        };

        /**
        * Removes a game object from the Input Manager. Called by the Sprite.Input component, should not usually be called directly.
        * @method removeGameObject
        **/
        InputManager.prototype.removeGameObject = function (index) {
            if (this.inputObjects[index]) {
                this.inputObjects[index] = null;
            }
        };

        Object.defineProperty(InputManager.prototype, "pollLocked", {
            get: function () {
                return (this.pollRate > 0 && this._pollCounter < this.pollRate);
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Updates the Input Manager. Called by the core Game loop.
        * @method update
        **/
        InputManager.prototype.update = function () {
            if (this.pollRate > 0 && this._pollCounter < this.pollRate) {
                this._pollCounter++;
                return;
            }

            this.speed.x = this.position.x - this._oldPosition.x;
            this.speed.y = this.position.y - this._oldPosition.y;

            this._oldPosition.copyFrom(this.position);

            this.mousePointer.update();
            this.pointer1.update();
            this.pointer2.update();

            if (this.pointer3) {
                this.pointer3.update();
            }
            if (this.pointer4) {
                this.pointer4.update();
            }
            if (this.pointer5) {
                this.pointer5.update();
            }
            if (this.pointer6) {
                this.pointer6.update();
            }
            if (this.pointer7) {
                this.pointer7.update();
            }
            if (this.pointer8) {
                this.pointer8.update();
            }
            if (this.pointer9) {
                this.pointer9.update();
            }
            if (this.pointer10) {
                this.pointer10.update();
            }

            this._pollCounter = 0;
        };

        /**
        * Reset all of the Pointers and Input states
        * @method reset
        * @param hard {Boolean} A soft reset (hard = false) won't reset any signals that might be bound. A hard reset will.
        **/
        InputManager.prototype.reset = function (hard) {
            if (typeof hard === "undefined") { hard = false; }
            this.keyboard.reset();

            this.mousePointer.reset();

            for (var i = 1; i <= 10; i++) {
                if (this['pointer' + i]) {
                    this['pointer' + i].reset();
                }
            }

            this.currentPointers = 0;

            this.game.stage.canvas.style.cursor = "default";

            if (hard == true) {
                this.onDown.dispose();
                this.onUp.dispose();
                this.onTap.dispose();
                this.onHold.dispose();

                this.onDown = new Phaser.Signal();
                this.onUp = new Phaser.Signal();
                this.onTap = new Phaser.Signal();
                this.onHold = new Phaser.Signal();

                for (var i = 0; i < this.totalTrackedObjects; i++) {
                    if (this.inputObjects[i] && this.inputObjects[i].input) {
                        this.inputObjects[i].input.reset();
                    }
                }

                this.inputObjects.length = 0;
                this.totalTrackedObjects = 0;
            }

            this._pollCounter = 0;
        };

        InputManager.prototype.resetSpeed = function (x, y) {
            this._oldPosition.setTo(x, y);
            this.speed.setTo(0, 0);
        };

        Object.defineProperty(InputManager.prototype, "totalInactivePointers", {
            get: /**
            * Get the total number of inactive Pointers
            * @method totalInactivePointers
            * @return {Number} The number of Pointers currently inactive
            **/
            function () {
                return 10 - this.currentPointers;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(InputManager.prototype, "totalActivePointers", {
            get: /**
            * Recalculates the total number of active Pointers
            * @method totalActivePointers
            * @return {Number} The number of Pointers currently active
            **/
            function () {
                this.currentPointers = 0;

                for (var i = 1; i <= 10; i++) {
                    if (this['pointer' + i] && this['pointer' + i].active) {
                        this.currentPointers++;
                    }
                }

                return this.currentPointers;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Find the first free Pointer object and start it, passing in the event data.
        * @method startPointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was started or null if no Pointer object is available
        **/
        InputManager.prototype.startPointer = function (event) {
            if (this.maxPointers < 10 && this.totalActivePointers == this.maxPointers) {
                return null;
            }

            if (this.pointer1.active == false) {
                return this.pointer1.start(event);
            } else if (this.pointer2.active == false) {
                return this.pointer2.start(event);
            } else {
                for (var i = 3; i <= 10; i++) {
                    if (this['pointer' + i] && this['pointer' + i].active == false) {
                        return this['pointer' + i].start(event);
                    }
                }
            }

            return null;
        };

        /**
        * Updates the matching Pointer object, passing in the event data.
        * @method updatePointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was updated or null if no Pointer object is available
        **/
        InputManager.prototype.updatePointer = function (event) {
            if (this.pointer1.active && this.pointer1.identifier == event.identifier) {
                return this.pointer1.move(event);
            } else if (this.pointer2.active && this.pointer2.identifier == event.identifier) {
                return this.pointer2.move(event);
            } else {
                for (var i = 3; i <= 10; i++) {
                    if (this['pointer' + i] && this['pointer' + i].active && this['pointer' + i].identifier == event.identifier) {
                        return this['pointer' + i].move(event);
                    }
                }
            }

            return null;
        };

        /**
        * Stops the matching Pointer object, passing in the event data.
        * @method stopPointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was stopped or null if no Pointer object is available
        **/
        InputManager.prototype.stopPointer = function (event) {
            if (this.pointer1.active && this.pointer1.identifier == event.identifier) {
                return this.pointer1.stop(event);
            } else if (this.pointer2.active && this.pointer2.identifier == event.identifier) {
                return this.pointer2.stop(event);
            } else {
                for (var i = 3; i <= 10; i++) {
                    if (this['pointer' + i] && this['pointer' + i].active && this['pointer' + i].identifier == event.identifier) {
                        return this['pointer' + i].stop(event);
                    }
                }
            }

            return null;
        };

        /**
        * Get the next Pointer object whos active property matches the given state
        * @method getPointer
        * @param {Boolean} state The state the Pointer should be in (false for inactive, true for active)
        * @return {Pointer} A Pointer object or null if no Pointer object matches the requested state.
        **/
        InputManager.prototype.getPointer = function (state) {
            if (typeof state === "undefined") { state = false; }
            if (this.pointer1.active == state) {
                return this.pointer1;
            } else if (this.pointer2.active == state) {
                return this.pointer2;
            } else {
                for (var i = 3; i <= 10; i++) {
                    if (this['pointer' + i] && this['pointer' + i].active == state) {
                        return this['pointer' + i];
                    }
                }
            }

            return null;
        };

        /**
        * Get the Pointer object whos identified property matches the given identifier value
        * @method getPointerFromIdentifier
        * @param {Number} identifier The Pointer.identifier value to search for
        * @return {Pointer} A Pointer object or null if no Pointer object matches the requested identifier.
        **/
        InputManager.prototype.getPointerFromIdentifier = function (identifier) {
            if (this.pointer1.identifier == identifier) {
                return this.pointer1;
            } else if (this.pointer2.identifier == identifier) {
                return this.pointer2;
            } else {
                for (var i = 3; i <= 10; i++) {
                    if (this['pointer' + i] && this['pointer' + i].identifier == identifier) {
                        return this['pointer' + i];
                    }
                }
            }

            return null;
        };

        Object.defineProperty(InputManager.prototype, "worldX", {
            get: function () {
                if (this.camera) {
                    return (this.camera.worldView.x - this.camera.screenView.x) + this.x;
                }

                return null;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(InputManager.prototype, "worldY", {
            get: function () {
                if (this.camera) {
                    return (this.camera.worldView.y - this.camera.screenView.y) + this.y;
                }

                return null;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Get the distance between two Pointer objects
        * @method getDistance
        * @param {Pointer} pointer1
        * @param {Pointer} pointer2
        **/
        InputManager.prototype.getDistance = function (pointer1, pointer2) {
            return Phaser.Vec2Utils.distance(pointer1.position, pointer2.position);
        };

        /**
        * Get the angle between two Pointer objects
        * @method getAngle
        * @param {Pointer} pointer1
        * @param {Pointer} pointer2
        **/
        InputManager.prototype.getAngle = function (pointer1, pointer2) {
            return Phaser.Vec2Utils.angle(pointer1.position, pointer2.position);
        };

        InputManager.prototype.pixelPerfectCheck = function (sprite, pointer, alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            this.hitContext.clearRect(0, 0, 1, 1);

            return true;
        };
        InputManager.MOUSE_OVERRIDES_TOUCH = 0;

        InputManager.TOUCH_OVERRIDES_MOUSE = 1;

        InputManager.MOUSE_TOUCH_COMBINE = 2;
        return InputManager;
    })();
    Phaser.InputManager = InputManager;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Device
*
* Detects device support capabilities. Using some elements from System.js by MrDoob and Modernizr
* https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
*/
var Phaser;
(function (Phaser) {
    var Device = (function () {
        /**
        * Device constructor
        */
        function Device() {
            /**
            * An optional 'fix' for the horrendous Android stock browser bug
            * https://code.google.com/p/android/issues/detail?id=39247
            * @type {boolean}
            */
            this.patchAndroidClearRectBug = false;
            //  Operating System
            /**
            * Is running desktop?
            * @type {boolean}
            */
            this.desktop = false;
            /**
            * Is running on iOS?
            * @type {boolean}
            */
            this.iOS = false;
            /**
            * Is running on android?
            * @type {boolean}
            */
            this.android = false;
            /**
            * Is running on chromeOS?
            * @type {boolean}
            */
            this.chromeOS = false;
            /**
            * Is running on linux?
            * @type {boolean}
            */
            this.linux = false;
            /**
            * Is running on maxOS?
            * @type {boolean}
            */
            this.macOS = false;
            /**
            * Is running on windows?
            * @type {boolean}
            */
            this.windows = false;
            //  Features
            /**
            * Is canvas available?
            * @type {boolean}
            */
            this.canvas = false;
            /**
            * Is file available?
            * @type {boolean}
            */
            this.file = false;
            /**
            * Is fileSystem available?
            * @type {boolean}
            */
            this.fileSystem = false;
            /**
            * Is localStorage available?
            * @type {boolean}
            */
            this.localStorage = false;
            /**
            * Is webGL available?
            * @type {boolean}
            */
            this.webGL = false;
            /**
            * Is worker available?
            * @type {boolean}
            */
            this.worker = false;
            /**
            * Is touch available?
            * @type {boolean}
            */
            this.touch = false;
            /**
            * Is mspointer available?
            * @type {boolean}
            */
            this.mspointer = false;
            /**
            * Is css3D available?
            * @type {boolean}
            */
            this.css3D = false;
            //  Browser
            /**
            * Is running in arora?
            * @type {boolean}
            */
            this.arora = false;
            /**
            * Is running in chrome?
            * @type {boolean}
            */
            this.chrome = false;
            /**
            * Is running in epiphany?
            * @type {boolean}
            */
            this.epiphany = false;
            /**
            * Is running in firefox?
            * @type {boolean}
            */
            this.firefox = false;
            /**
            * Is running in ie?
            * @type {boolean}
            */
            this.ie = false;
            /**
            * Version of ie?
            * @type Number
            */
            this.ieVersion = 0;
            /**
            * Is running in mobileSafari?
            * @type {boolean}
            */
            this.mobileSafari = false;
            /**
            * Is running in midori?
            * @type {boolean}
            */
            this.midori = false;
            /**
            * Is running in opera?
            * @type {boolean}
            */
            this.opera = false;
            /**
            * Is running in safari?
            * @type {boolean}
            */
            this.safari = false;
            this.webApp = false;
            //  Audio
            /**
            * Are Audio tags available?
            * @type {boolean}
            */
            this.audioData = false;
            /**
            * Is the WebAudio API available?
            * @type {boolean}
            */
            this.webAudio = false;
            /**
            * Can this device play ogg files?
            * @type {boolean}
            */
            this.ogg = false;
            /**
            * Can this device play opus files?
            * @type {boolean}
            */
            this.opus = false;
            /**
            * Can this device play mp3 files?
            * @type {boolean}
            */
            this.mp3 = false;
            /**
            * Can this device play wav files?
            * @type {boolean}
            */
            this.wav = false;
            /**
            * Can this device play m4a files?
            * @type {boolean}
            */
            this.m4a = false;
            /**
            * Can this device play webm files?
            * @type {boolean}
            */
            this.webm = false;
            //  Device
            /**
            * Is running on iPhone?
            * @type {boolean}
            */
            this.iPhone = false;
            /**
            * Is running on iPhone4?
            * @type {boolean}
            */
            this.iPhone4 = false;
            /**
            * Is running on iPad?
            * @type {boolean}
            */
            this.iPad = false;
            /**
            * PixelRatio of the host device?
            * @type Number
            */
            this.pixelRatio = 0;
            this._checkAudio();
            this._checkBrowser();
            this._checkCSS3D();
            this._checkDevice();
            this._checkFeatures();
            this._checkOS();
        }
        /**
        * Check which OS is game running on.
        * @private
        */
        Device.prototype._checkOS = function () {
            var ua = navigator.userAgent;

            if (/Android/.test(ua)) {
                this.android = true;
            } else if (/CrOS/.test(ua)) {
                this.chromeOS = true;
            } else if (/iP[ao]d|iPhone/i.test(ua)) {
                this.iOS = true;
            } else if (/Linux/.test(ua)) {
                this.linux = true;
            } else if (/Mac OS/.test(ua)) {
                this.macOS = true;
            } else if (/Windows/.test(ua)) {
                this.windows = true;
            }

            if (this.windows || this.macOS || this.linux) {
                this.desktop = true;
            }
        };

        /**
        * Check HTML5 features of the host environment.
        * @private
        */
        Device.prototype._checkFeatures = function () {
            this.canvas = !!window['CanvasRenderingContext2D'];

            try  {
                this.localStorage = !!localStorage.getItem;
            } catch (error) {
                this.localStorage = false;
            }

            this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
            this.fileSystem = !!window['requestFileSystem'];
            this.webGL = !!window['WebGLRenderingContext'];
            this.worker = !!window['Worker'];

            if ('ontouchstart' in document.documentElement || window.navigator.msPointerEnabled) {
                this.touch = true;
            }

            if (window.navigator.msPointerEnabled) {
                this.mspointer = true;
            }
        };

        /**
        * Check what browser is game running in.
        * @private
        */
        Device.prototype._checkBrowser = function () {
            var ua = navigator.userAgent;

            if (/Arora/.test(ua)) {
                this.arora = true;
            } else if (/Chrome/.test(ua)) {
                this.chrome = true;
            } else if (/Epiphany/.test(ua)) {
                this.epiphany = true;
            } else if (/Firefox/.test(ua)) {
                this.firefox = true;
            } else if (/Mobile Safari/.test(ua)) {
                this.mobileSafari = true;
            } else if (/MSIE (\d+\.\d+);/.test(ua)) {
                this.ie = true;
                this.ieVersion = parseInt(RegExp.$1);
            } else if (/Midori/.test(ua)) {
                this.midori = true;
            } else if (/Opera/.test(ua)) {
                this.opera = true;
            } else if (/Safari/.test(ua)) {
                this.safari = true;
            }

            if (navigator['standalone']) {
                this.webApp = true;
            }
        };

        Device.prototype.canPlayAudio = function (type) {
            if (type == 'mp3' && this.mp3) {
                return true;
            } else if (type == 'ogg' && (this.ogg || this.opus)) {
                return true;
            } else if (type == 'm4a' && this.m4a) {
                return true;
            } else if (type == 'wav' && this.wav) {
                return true;
            } else if (type == 'webm' && this.webm) {
                return true;
            }

            return false;
        };

        /**
        * Check audio support.
        * @private
        */
        Device.prototype._checkAudio = function () {
            this.audioData = !!(window['Audio']);
            this.webAudio = !!(window['webkitAudioContext'] || window['AudioContext']);

            var audioElement = document.createElement('audio');
            var result = false;

            try  {
                if (result = !!audioElement.canPlayType) {
                    if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
                        this.ogg = true;
                    }

                    if (audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '')) {
                        this.opus = true;
                    }

                    if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
                        this.mp3 = true;
                    }

                    if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
                        this.wav = true;
                    }

                    if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, '')) {
                        this.m4a = true;
                    }

                    if (audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')) {
                        this.webm = true;
                    }
                }
            } catch (e) {
            }
        };

        /**
        * Check PixelRatio of devices.
        * @private
        */
        Device.prototype._checkDevice = function () {
            this.pixelRatio = window['devicePixelRatio'] || 1;
            this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
            this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
            this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;
        };

        /**
        * Check whether the host environment support 3D CSS.
        * @private
        */
        Device.prototype._checkCSS3D = function () {
            var el = document.createElement('p');
            var has3d;
            var transforms = {
                'webkitTransform': '-webkit-transform',
                'OTransform': '-o-transform',
                'msTransform': '-ms-transform',
                'MozTransform': '-moz-transform',
                'transform': 'transform'
            };

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            this.css3D = (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        };

        Device.prototype.isConsoleOpen = function () {
            if (window.console && window.console['firebug']) {
                return true;
            }

            if (window.console) {
                console.profile();
                console.profileEnd();

                if (console.clear)
                    console.clear();

                return console['profiles'].length > 0;
            }

            return false;
        };
        return Device;
    })();
    Phaser.Device = Device;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - RequestAnimationFrame
*
* Abstracts away the use of RAF or setTimeOut for the core game update loop. The callback can be re-mapped on the fly.
*/
var Phaser;
(function (Phaser) {
    var RequestAnimationFrame = (function () {
        /**
        * Constructor
        * @param {Any} callback
        * @return {RequestAnimationFrame} This object.
        */
        function RequestAnimationFrame(game, callback) {
            /**
            *
            * @property _isSetTimeOut
            * @type Boolean
            * @private
            **/
            this._isSetTimeOut = false;
            /**
            *
            * @property isRunning
            * @type Boolean
            **/
            this.isRunning = false;
            this.game = game;
            this.callback = callback;

            var vendors = ['ms', 'moz', 'webkit', 'o'];

            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
            }

            this.start();
        }
        /**
        *
        * @method usingSetTimeOut
        * @return Boolean
        **/
        RequestAnimationFrame.prototype.isUsingSetTimeOut = function () {
            return this._isSetTimeOut;
        };

        /**
        *
        * @method usingRAF
        * @return Boolean
        **/
        RequestAnimationFrame.prototype.isUsingRAF = function () {
            return this._isSetTimeOut === true;
        };

        /**
        * Starts the requestAnimatioFrame running or setTimeout if unavailable in browser
        * @method start
        * @param {Any} [callback]
        **/
        RequestAnimationFrame.prototype.start = function (callback) {
            if (typeof callback === "undefined") { callback = null; }
            var _this = this;
            if (callback) {
                this.callback = callback;
            }

            if (!window.requestAnimationFrame) {
                this._isSetTimeOut = true;
                this._onLoop = function () {
                    return _this.SetTimeoutUpdate();
                };
                this._timeOutID = window.setTimeout(this._onLoop, 0);
            } else {
                this._isSetTimeOut = false;
                this._onLoop = function () {
                    return _this.RAFUpdate(0);
                };
                window.requestAnimationFrame(this._onLoop);
            }

            this.isRunning = true;
        };

        /**
        * Stops the requestAnimationFrame from running
        * @method stop
        **/
        RequestAnimationFrame.prototype.stop = function () {
            if (this._isSetTimeOut) {
                clearTimeout(this._timeOutID);
            } else {
                window.cancelAnimationFrame;
            }

            this.isRunning = false;
        };

        /**
        * The update method for the requestAnimationFrame
        * @method RAFUpdate
        **/
        RequestAnimationFrame.prototype.RAFUpdate = function (time) {
            var _this = this;
            this.game.time.update(time);

            if (this.callback) {
                this.callback.call(this.game);
            }

            this._onLoop = function (time) {
                return _this.RAFUpdate(time);
            };

            window.requestAnimationFrame(this._onLoop);
        };

        /**
        * The update method for the setTimeout
        * @method SetTimeoutUpdate
        **/
        RequestAnimationFrame.prototype.SetTimeoutUpdate = function () {
            var _this = this;
            this.game.time.update(Date.now());

            this._onLoop = function () {
                return _this.SetTimeoutUpdate();
            };

            this._timeOutID = window.setTimeout(this._onLoop, 16);

            if (this.callback) {
                this.callback.call(this.game);
            }
        };
        return RequestAnimationFrame;
    })();
    Phaser.RequestAnimationFrame = RequestAnimationFrame;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - StageScaleMode
*
* This class controls the scaling of your game. On mobile devices it will also remove the URL bar and allow
* you to maintain proportion and aspect ratio.
* The resizing method is based on a technique taken from Viewporter v2.0 by Zynga Inc. http://github.com/zynga/viewporter
*/
var Phaser;
(function (Phaser) {
    var StageScaleMode = (function () {
        /**
        * StageScaleMode constructor
        */
        function StageScaleMode(game, width, height) {
            var _this = this;
            /**
            * Stage height when start the game.
            * @type {number}
            */
            this._startHeight = 0;
            /**
            * If the game should be forced to use Landscape mode, this is set to true by Game.Stage
            * @type {Boolean}
            */
            this.forceLandscape = false;
            /**
            * If the game should be forced to use Portrait mode, this is set to true by Game.Stage
            * @type {Boolean}
            */
            this.forcePortrait = false;
            /**
            * If the game should be forced to use a specific orientation and the device currently isn't in that orientation this is set to true.
            * @type {Boolean}
            */
            this.incorrectOrientation = false;
            /**
            * If you wish to align your game in the middle of the page then you can set this value to true.
            * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
            * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
            * @type {Boolean}
            */
            this.pageAlignHorizontally = false;
            /**
            * If you wish to align your game in the middle of the page then you can set this value to true.
            * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
            * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
            * @type {Boolean}
            */
            this.pageAlignVeritcally = false;
            /**
            * Minimum width the canvas should be scaled to (in pixels)
            * @type {number}
            */
            this.minWidth = null;
            /**
            * Maximum width the canvas should be scaled to (in pixels).
            * If null it will scale to whatever width the browser can handle.
            * @type {number}
            */
            this.maxWidth = null;
            /**
            * Minimum height the canvas should be scaled to (in pixels)
            * @type {number}
            */
            this.minHeight = null;
            /**
            * Maximum height the canvas should be scaled to (in pixels).
            * If null it will scale to whatever height the browser can handle.
            * @type {number}
            */
            this.maxHeight = null;
            /**
            * Width of the stage after calculation.
            * @type {number}
            */
            this.width = 0;
            /**
            * Height of the stage after calculation.
            * @type {number}
            */
            this.height = 0;
            /**
            * The maximum number of times it will try to resize the canvas to fill the browser (default is 10)
            * @type {number}
            */
            this.maxIterations = 10;
            this.game = game;

            this.enterLandscape = new Phaser.Signal();
            this.enterPortrait = new Phaser.Signal();

            if (window['orientation']) {
                this.orientation = window['orientation'];
            } else {
                if (window.outerWidth > window.outerHeight) {
                    this.orientation = 90;
                } else {
                    this.orientation = 0;
                }
            }

            this.scaleFactor = new Phaser.Vec2(1, 1);
            this.aspectRatio = 0;
            this.minWidth = width;
            this.minHeight = height;
            this.maxWidth = width;
            this.maxHeight = height;

            window.addEventListener('orientationchange', function (event) {
                return _this.checkOrientation(event);
            }, false);
            window.addEventListener('resize', function (event) {
                return _this.checkResize(event);
            }, false);
        }
        Object.defineProperty(StageScaleMode.prototype, "isFullScreen", {
            get: //  Full Screen API calls
            function () {
                if (document['fullscreenElement'] === null || document['mozFullScreenElement'] === null || document['webkitFullscreenElement'] === null) {
                    return false;
                }

                return true;
            },
            enumerable: true,
            configurable: true
        });

        StageScaleMode.prototype.startFullScreen = function () {
            if (this.isFullScreen) {
                return;
            }

            var element = this.game.stage.canvas;

            if (element['requestFullScreen']) {
                element['requestFullScreen']();
            } else if (element['mozRequestFullScreen']) {
                element['mozRequestFullScreen']();
            } else if (element['webkitRequestFullScreen']) {
                element['webkitRequestFullScreen']();
            }
        };

        StageScaleMode.prototype.stopFullScreen = function () {
            if (document['cancelFullScreen']) {
                document['cancelFullScreen']();
            } else if (document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } else if (document['webkitCancelFullScreen']) {
                document['webkitCancelFullScreen']();
            }
        };

        /**
        * The core update loop, called by Phaser.Stage
        */
        StageScaleMode.prototype.update = function () {
            if (this.game.stage.scaleMode !== Phaser.StageScaleMode.NO_SCALE && (window.innerWidth !== this.width || window.innerHeight !== this.height)) {
                this.refresh();
            }

            if (this.forceLandscape || this.forcePortrait) {
                this.checkOrientationState();
            }
        };

        StageScaleMode.prototype.checkOrientationState = function () {
            if (this.incorrectOrientation) {
                if ((this.forceLandscape && window.innerWidth > window.innerHeight) || (this.forcePortrait && window.innerHeight > window.innerWidth)) {
                    //  Back to normal
                    this.game.paused = false;
                    this.incorrectOrientation = false;
                    this.refresh();
                }
            } else {
                if ((this.forceLandscape && window.innerWidth < window.innerHeight) || (this.forcePortrait && window.innerHeight < window.innerWidth)) {
                    //  Show orientation screen
                    this.game.paused = true;
                    this.incorrectOrientation = true;
                    this.refresh();
                }
            }
        };

        Object.defineProperty(StageScaleMode.prototype, "isPortrait", {
            get: function () {
                return this.orientation == 0 || this.orientation == 180;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(StageScaleMode.prototype, "isLandscape", {
            get: function () {
                return this.orientation === 90 || this.orientation === -90;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Handle window.orientationchange events
        */
        StageScaleMode.prototype.checkOrientation = function (event) {
            this.orientation = window['orientation'];

            if (this.isLandscape) {
                this.enterLandscape.dispatch(this.orientation, true, false);
            } else {
                this.enterPortrait.dispatch(this.orientation, false, true);
            }

            if (this.game.stage.scaleMode !== StageScaleMode.NO_SCALE) {
                this.refresh();
            }
        };

        /**
        * Handle window.resize events
        */
        StageScaleMode.prototype.checkResize = function (event) {
            if (window.outerWidth > window.outerHeight) {
                this.orientation = 90;
            } else {
                this.orientation = 0;
            }

            if (this.isLandscape) {
                this.enterLandscape.dispatch(this.orientation, true, false);
            } else {
                this.enterPortrait.dispatch(this.orientation, false, true);
            }

            if (this.game.stage.scaleMode !== StageScaleMode.NO_SCALE) {
                this.refresh();
            }
        };

        /**
        * Re-calculate scale mode and update screen size.
        */
        StageScaleMode.prototype.refresh = function () {
            var _this = this;
            if (this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false) {
                document.documentElement['style'].minHeight = '2000px';

                this._startHeight = window.innerHeight;

                if (this.game.device.android && this.game.device.chrome == false) {
                    window.scrollTo(0, 1);
                } else {
                    window.scrollTo(0, 0);
                }
            }

            if (this._check == null && this.maxIterations > 0) {
                this._iterations = this.maxIterations;
                this._check = window.setInterval(function () {
                    return _this.setScreenSize();
                }, 10);
                this.setScreenSize();
            }
        };

        /**
        * Set screen size automatically based on the scaleMode.
        */
        StageScaleMode.prototype.setScreenSize = function (force) {
            if (typeof force === "undefined") { force = false; }
            if (this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false) {
                if (this.game.device.android && this.game.device.chrome == false) {
                    window.scrollTo(0, 1);
                } else {
                    window.scrollTo(0, 0);
                }
            }

            this._iterations--;

            if (force || window.innerHeight > this._startHeight || this._iterations < 0) {
                // Set minimum height of content to new window height
                document.documentElement['style'].minHeight = window.innerHeight + 'px';

                if (this.incorrectOrientation == true) {
                    this.setMaximum();
                } else if (this.game.stage.scaleMode == StageScaleMode.EXACT_FIT) {
                    this.setExactFit();
                } else if (this.game.stage.scaleMode == StageScaleMode.SHOW_ALL) {
                    this.setShowAll();
                }

                this.setSize();

                clearInterval(this._check);

                this._check = null;
            }
        };

        StageScaleMode.prototype.setSize = function () {
            if (this.incorrectOrientation == false) {
                if (this.maxWidth && this.width > this.maxWidth) {
                    this.width = this.maxWidth;
                }

                if (this.maxHeight && this.height > this.maxHeight) {
                    this.height = this.maxHeight;
                }

                if (this.minWidth && this.width < this.minWidth) {
                    this.width = this.minWidth;
                }

                if (this.minHeight && this.height < this.minHeight) {
                    this.height = this.minHeight;
                }
            }

            this.game.stage.canvas.style.width = this.width + 'px';
            this.game.stage.canvas.style.height = this.height + 'px';

            this.game.input.scale.setTo(this.game.stage.width / this.width, this.game.stage.height / this.height);

            if (this.pageAlignHorizontally) {
                if (this.width < window.innerWidth && this.incorrectOrientation == false) {
                    this.game.stage.canvas.style.marginLeft = Math.round((window.innerWidth - this.width) / 2) + 'px';
                } else {
                    this.game.stage.canvas.style.marginLeft = '0px';
                }
            }

            if (this.pageAlignVeritcally) {
                if (this.height < window.innerHeight && this.incorrectOrientation == false) {
                    this.game.stage.canvas.style.marginTop = Math.round((window.innerHeight - this.height) / 2) + 'px';
                } else {
                    this.game.stage.canvas.style.marginTop = '0px';
                }
            }

            this.game.stage.getOffset(this.game.stage.canvas);

            this.aspectRatio = this.width / this.height;
            this.scaleFactor.x = this.game.stage.width / this.width;
            this.scaleFactor.y = this.game.stage.height / this.height;
        };

        StageScaleMode.prototype.setMaximum = function () {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        };

        StageScaleMode.prototype.setShowAll = function () {
            var multiplier = Math.min((window.innerHeight / this.game.stage.height), (window.innerWidth / this.game.stage.width));

            this.width = Math.round(this.game.stage.width * multiplier);
            this.height = Math.round(this.game.stage.height * multiplier);
        };

        StageScaleMode.prototype.setExactFit = function () {
            if (this.maxWidth && window.innerWidth > this.maxWidth) {
                this.width = this.maxWidth;
            } else {
                this.width = window.innerWidth;
            }

            if (this.maxHeight && window.innerHeight > this.maxHeight) {
                this.height = this.maxHeight;
            } else {
                this.height = window.innerHeight;
            }
        };
        StageScaleMode.EXACT_FIT = 0;

        StageScaleMode.NO_SCALE = 1;

        StageScaleMode.SHOW_ALL = 2;
        return StageScaleMode;
    })();
    Phaser.StageScaleMode = StageScaleMode;
})(Phaser || (Phaser = {}));
/// <reference path="../../_definitions.ts" />
/**
* Phaser - BootScreen
*
* The BootScreen is displayed when Phaser is started without any default functions or State
*/
var Phaser;
(function (Phaser) {
    var BootScreen = (function () {
        /**
        * BootScreen constructor
        * Create a new <code>BootScreen</code> with specific width and height.
        *
        * @param width {number} Screen canvas width.
        * @param height {number} Screen canvas height.
        */
        function BootScreen(game) {
            /**
            * Engine logo image data.
            */
            this._logoData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAAAZCAYAAADdYmvFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAstJREFUeNrsWlFuwjAMbavdZGcAcRm4AXzvCPuGG8BlEJxhZ+l4TJ48z3actGGthqUI1MaO/V6cmIT2/fW10eTt46NvKshtvDZlG31yfOL9a/ldU6x4IZ0GQs0gS217enMkJYr5ixXkYrFoVqtV1kDn8/n+KfXw/Hq9Nin7h8MhScB2u3Xtav2ivsNWrh7XLcWMYqA4eUZ1kj0MAifHJEeKFojWzyIH+rL/0Cwif2AX9nN1oQOgrTg8XcTFx+ScdEOJ4WBxXQ1EjRyrn0cOzzQLzFyQSQcgw/5Qkkr0JVEQpNIdhL4vm4DL5fLulNTHcy6Uxl4/6iMLiePx2KzX6/v30+n0aynUlrnSeNq2/VN9bgM4dFPdNPmsJnIg/PuQbJmLdFN3UNu0SzbyJ0GOWJVWZE/QMkY+owrqXxGEdZA37BVyX6lJTipT6J1lf7fbqc+xh8nYeIvikatP+PGW0nEJ4jOydHYOIcfKnmgWoZDQSIIeio4Sf1IthYWskCO4vqQ6lFYjl8tl9L1H67PZbMz3VO3t93uVXHofmUjReLyMwHi5eCb3ICwJj5ZU9nCg+SzUgPYyif+2epTk4pkkyDp+eXTlZu2BkUybEkklePZfK9lPuTnc07vbmt1bYulHBeNQgx18SsH4ni/cV2rSLtqNDNUH2JQ2SsXS57Y9PHlfumkwCdICt5rnkNdPjpMiIEWgRlAJSdF4SvCQMWj+VyfI0h8D/EgWSYKiJKXi8VrOhJUxaFiFCOKKUJAtR78k9eX4USLHXqLGXOIiWUT4Vj9JiP4W0io3VDz8AJXblNWQrOimLjIGy/9uLICH6mrVmFbxEFHauzmc0fGJJmPg/v+6D0oB7N2bj0FsNHtSWTQniWTR931QlHXvasDTHXLjqY0/1/8hSDxACD+lAGH8dKQbQk5N3TFtzDmLWutvV0+pL5FVoHvCNG35FGAAayS4KUoKC9QAAAAASUVORK5CYII=";
            /**
            * Background gradient effect color 1.
            */
            this._color1 = { r: 20, g: 20, b: 20 };
            /**
            * Background gradient effect color 2.
            */
            this._color2 = { r: 200, g: 200, b: 200 };
            /**
            * Fade effect tween.
            * @type {Phaser.Tween}
            */
            this._fade = null;
            this.game = game;

            this._logo = new Image();
            this._logo.src = this._logoData;
        }
        /**
        * Update color and fade.
        */
        BootScreen.prototype.update = function () {
            if (this._fade == null) {
                this.colorCycle();
            }

            this._color1.r = Math.round(this._color1.r);
            this._color1.g = Math.round(this._color1.g);
            this._color1.b = Math.round(this._color1.b);
            this._color2.r = Math.round(this._color2.r);
            this._color2.g = Math.round(this._color2.g);
            this._color2.b = Math.round(this._color2.b);
        };

        /**
        * Render BootScreen.
        */
        BootScreen.prototype.render = function () {
            var grd = this.game.stage.context.createLinearGradient(0, 0, 0, this.game.stage.height);
            grd.addColorStop(0, 'rgb(' + this._color1.r + ', ' + this._color1.g + ', ' + this._color1.b + ')');
            grd.addColorStop(0.5, 'rgb(' + this._color2.r + ', ' + this._color2.g + ', ' + this._color2.b + ')');
            grd.addColorStop(1, 'rgb(' + this._color1.r + ', ' + this._color1.g + ', ' + this._color1.b + ')');
            this.game.stage.context.fillStyle = grd;
            this.game.stage.context.fillRect(0, 0, this.game.stage.width, this.game.stage.height);

            this.game.stage.context.shadowOffsetX = 0;
            this.game.stage.context.shadowOffsetY = 0;

            if (this._logo) {
                this.game.stage.context.drawImage(this._logo, 32, 32);
            }

            this.game.stage.context.shadowColor = 'rgb(0,0,0)';
            this.game.stage.context.shadowOffsetX = 1;
            this.game.stage.context.shadowOffsetY = 1;
            this.game.stage.context.shadowBlur = 0;
            this.game.stage.context.fillStyle = 'rgb(255,255,255)';
            this.game.stage.context.font = 'bold 18px Arial';
            this.game.stage.context.textBaseline = 'top';
            this.game.stage.context.fillText(Phaser.VERSION, 32, 64 + 32);
            this.game.stage.context.fillText('Game Size: ' + this.game.stage.width + ' x ' + this.game.stage.height, 32, 64 + 64);
            this.game.stage.context.fillText('www.photonstorm.com', 32, 64 + 96);
            this.game.stage.context.font = '16px Arial';
            this.game.stage.context.fillText('You are seeing this screen because you didn\'t specify any default', 32, 64 + 160);
            this.game.stage.context.fillText('functions in the Game constructor or use Game.switchState()', 32, 64 + 184);
        };

        /**
        * Start color fading cycle.
        */
        BootScreen.prototype.colorCycle = function () {
            this._fade = this.game.add.tween(this._color2);

            this._fade.to({ r: Math.random() * 250, g: Math.random() * 250, b: Math.random() * 250 }, 3000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.colorCycle, this);
            this._fade.start();
        };
        return BootScreen;
    })();
    Phaser.BootScreen = BootScreen;
})(Phaser || (Phaser = {}));
/// <reference path="../../_definitions.ts" />
/**
* Phaser - OrientationScreen
*
* The Orientation Screen is displayed whenever the device is turned to an unsupported orientation.
*/
var Phaser;
(function (Phaser) {
    var OrientationScreen = (function () {
        /**
        * OrientationScreen constructor
        * Create a new <code>OrientationScreen</code> with specific width and height.
        *
        * @param width {number} Screen canvas width.
        * @param height {number} Screen canvas height.
        */
        function OrientationScreen(game) {
            this._showOnLandscape = false;
            this._showOnPortrait = false;
            this.game = game;
        }
        OrientationScreen.prototype.enable = function (onLandscape, onPortrait, imageKey) {
            this._showOnLandscape = onLandscape;
            this._showOnPortrait = onPortrait;
            this.landscapeImage = this.game.cache.getImage(imageKey);
            this.portraitImage = this.game.cache.getImage(imageKey);
        };

        /**
        * Update
        */
        OrientationScreen.prototype.update = function () {
        };

        /**
        * Render
        */
        OrientationScreen.prototype.render = function () {
            if (this._showOnLandscape) {
                this.game.stage.context.drawImage(this.landscapeImage, 0, 0, this.landscapeImage.width, this.landscapeImage.height, 0, 0, this.game.stage.width, this.game.stage.height);
            } else if (this._showOnPortrait) {
                this.game.stage.context.drawImage(this.portraitImage, 0, 0, this.portraitImage.width, this.portraitImage.height, 0, 0, this.game.stage.width, this.game.stage.height);
            }
        };
        return OrientationScreen;
    })();
    Phaser.OrientationScreen = OrientationScreen;
})(Phaser || (Phaser = {}));
/// <reference path="../../_definitions.ts" />
/**
* Phaser - PauseScreen
*
* The PauseScreen is displayed whenever the game loses focus or the player switches to another browser tab.
*/
var Phaser;
(function (Phaser) {
    var PauseScreen = (function () {
        /**
        * PauseScreen constructor
        * Create a new <code>PauseScreen</code> with specific width and height.
        *
        * @param width {number} Screen canvas width.
        * @param height {number} Screen canvas height.
        */
        function PauseScreen(game, width, height) {
            this.game = game;
            this._canvas = document.createElement('canvas');
            this._canvas.width = width;
            this._canvas.height = height;
            this._context = this._canvas.getContext('2d');
        }
        /**
        * Called when the game enters pause mode.
        */
        PauseScreen.prototype.onPaused = function () {
            //  Take a grab of the current canvas to our temporary one
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._context.drawImage(this.game.stage.canvas, 0, 0);
            this._color = { r: 255, g: 255, b: 255 };
            this.fadeOut();
        };

        /**
        * Called when the game resume from pause mode.
        */
        PauseScreen.prototype.onResume = function () {
            this._fade.stop();
            this.game.tweens.remove(this._fade);
        };

        /**
        * Update background color.
        */
        PauseScreen.prototype.update = function () {
            this._color.r = Math.round(this._color.r);
            this._color.g = Math.round(this._color.g);
            this._color.b = Math.round(this._color.b);
        };

        /**
        * Render PauseScreen.
        */
        PauseScreen.prototype.render = function () {
            this.game.stage.context.drawImage(this._canvas, 0, 0);

            this.game.stage.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.game.stage.context.fillRect(0, 0, this.game.stage.width, this.game.stage.height);

            //  Draw a 'play' arrow
            var arrowWidth = Math.round(this.game.stage.width / 2);
            var arrowHeight = Math.round(this.game.stage.height / 2);

            var sx = this.game.stage.centerX - arrowWidth / 2;
            var sy = this.game.stage.centerY - arrowHeight / 2;

            this.game.stage.context.beginPath();
            this.game.stage.context.moveTo(sx, sy);
            this.game.stage.context.lineTo(sx, sy + arrowHeight);
            this.game.stage.context.lineTo(sx + arrowWidth, this.game.stage.centerY);
            this.game.stage.context.fillStyle = 'rgba(' + this._color.r + ', ' + this._color.g + ', ' + this._color.b + ', 0.8)';
            this.game.stage.context.fill();
            this.game.stage.context.closePath();
        };

        /**
        * Start fadeOut effect.
        */
        PauseScreen.prototype.fadeOut = function () {
            this._fade = this.game.add.tween(this._color);

            this._fade.to({ r: 50, g: 50, b: 50 }, 1000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.fadeIn, this);
            this._fade.start();
        };

        /**
        * Start fadeIn effect.
        */
        PauseScreen.prototype.fadeIn = function () {
            this._fade = this.game.add.tween(this._color);

            this._fade.to({ r: 255, g: 255, b: 255 }, 1000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.fadeOut, this);
            this._fade.start();
        };
        return PauseScreen;
    })();
    Phaser.PauseScreen = PauseScreen;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - SoundManager
*
*/
var Phaser;
(function (Phaser) {
    var SoundManager = (function () {
        /**
        * SoundManager constructor
        * Create a new <code>SoundManager</code>.
        */
        function SoundManager(game) {
            this.usingWebAudio = false;
            this.usingAudioTag = false;
            this.noAudio = false;
            /**
            * Reference to AudioContext instance.
            */
            this.context = null;
            this._muted = false;
            this.touchLocked = false;
            this._unlockSource = null;
            this.onSoundDecode = new Phaser.Signal();
            this.game = game;

            this._volume = 1;
            this._muted = false;
            this._sounds = [];

            if (this.game.device.iOS && this.game.device.webAudio == false) {
                this.channels = 1;
            }

            if (this.game.device.iOS || (window['PhaserGlobal'] && window['PhaserGlobal'].fakeiOSTouchLock)) {
                this.game.input.touch.callbackContext = this;
                this.game.input.touch.touchStartCallback = this.unlock;
                this.game.input.mouse.callbackContext = this;
                this.game.input.mouse.mouseDownCallback = this.unlock;
                this.touchLocked = true;
            } else {
                //  What about iOS5?
                this.touchLocked = false;
            }

            if (window['PhaserGlobal']) {
                if (window['PhaserGlobal'].disableAudio == true) {
                    this.usingWebAudio = false;
                    this.noAudio = true;
                    return;
                }

                if (window['PhaserGlobal'].disableWebAudio == true) {
                    this.usingWebAudio = false;
                    this.usingAudioTag = true;
                    this.noAudio = false;
                    return;
                }
            }

            this.usingWebAudio = true;
            this.noAudio = false;

            if (!!window['AudioContext']) {
                this.context = new window['AudioContext']();
            } else if (!!window['webkitAudioContext']) {
                this.context = new window['webkitAudioContext']();
            } else if (!!window['Audio']) {
                this.usingWebAudio = false;
                this.usingAudioTag = true;
            } else {
                this.usingWebAudio = false;
                this.noAudio = true;
            }

            if (this.context !== null) {
                if (typeof this.context.createGain === 'undefined') {
                    this.masterGain = this.context.createGainNode();
                } else {
                    this.masterGain = this.context.createGain();
                }

                this.masterGain.gain.value = 1;
                this.masterGain.connect(this.context.destination);
            }
        }
        SoundManager.prototype.unlock = function () {
            if (this.touchLocked == false) {
                return;
            }

            if (this.game.device.webAudio && (window['PhaserGlobal'] && window['PhaserGlobal'].disableWebAudio == false)) {
                // Create empty buffer and play it
                var buffer = this.context.createBuffer(1, 1, 22050);
                this._unlockSource = this.context.createBufferSource();
                this._unlockSource.buffer = buffer;
                this._unlockSource.connect(this.context.destination);
                this._unlockSource.noteOn(0);
            } else {
                //  Create an Audio tag?
                this.touchLocked = false;
                this._unlockSource = null;
                this.game.input.touch.callbackContext = null;
                this.game.input.touch.touchStartCallback = null;
                this.game.input.mouse.callbackContext = null;
                this.game.input.mouse.mouseDownCallback = null;
            }
        };

        Object.defineProperty(SoundManager.prototype, "mute", {
            get: /**
            * A global audio mute toggle.
            */
            function () {
                return this._muted;
            },
            set: function (value) {
                if (value) {
                    if (this._muted) {
                        return;
                    }

                    this._muted = true;

                    if (this.usingWebAudio) {
                        this._muteVolume = this.masterGain.gain.value;
                        this.masterGain.gain.value = 0;
                    }

                    for (var i = 0; i < this._sounds.length; i++) {
                        if (this._sounds[i].usingAudioTag) {
                            this._sounds[i].mute = true;
                        }
                    }
                } else {
                    if (this._muted == false) {
                        return;
                    }

                    this._muted = false;

                    if (this.usingWebAudio) {
                        this.masterGain.gain.value = this._muteVolume;
                    }

                    for (var i = 0; i < this._sounds.length; i++) {
                        if (this._sounds[i].usingAudioTag) {
                            this._sounds[i].mute = false;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });



        Object.defineProperty(SoundManager.prototype, "volume", {
            get: function () {
                if (this.usingWebAudio) {
                    return this.masterGain.gain.value;
                } else {
                    return this._volume;
                }
            },
            set: /**
            * The global audio volume. A value between 0 (silence) and 1 (full volume)
            */
            function (value) {
                value = this.game.math.clamp(value, 1, 0);

                this._volume = value;

                if (this.usingWebAudio) {
                    this.masterGain.gain.value = value;
                }

                for (var i = 0; i < this._sounds.length; i++) {
                    if (this._sounds[i].usingAudioTag) {
                        this._sounds[i].volume = this._sounds[i].volume * value;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });

        SoundManager.prototype.stopAll = function () {
            for (var i = 0; i < this._sounds.length; i++) {
                if (this._sounds[i]) {
                    this._sounds[i].stop();
                }
            }
        };

        SoundManager.prototype.pauseAll = function () {
            for (var i = 0; i < this._sounds.length; i++) {
                if (this._sounds[i]) {
                    this._sounds[i].pause();
                }
            }
        };

        SoundManager.prototype.resumeAll = function () {
            for (var i = 0; i < this._sounds.length; i++) {
                if (this._sounds[i]) {
                    this._sounds[i].resume();
                }
            }
        };

        /**
        * Decode a sound with its assets key.
        * @param key {string} Assets key of the sound to be decoded.
        * @param [sound] {Sound} its bufer will be set to decoded data.
        */
        SoundManager.prototype.decode = function (key, sound) {
            if (typeof sound === "undefined") { sound = null; }
            var soundData = this.game.cache.getSoundData(key);

            if (soundData) {
                if (this.game.cache.isSoundDecoded(key) === false) {
                    this.game.cache.updateSound(key, 'isDecoding', true);

                    var that = this;

                    this.context.decodeAudioData(soundData, function (buffer) {
                        that.game.cache.decodedSound(key, buffer);

                        if (sound) {
                            that.onSoundDecode.dispatch(sound);
                        }
                    });
                }
            }
        };

        SoundManager.prototype.update = function () {
            if (this.touchLocked) {
                if (this.game.device.webAudio && this._unlockSource !== null) {
                    if ((this._unlockSource.playbackState === this._unlockSource.PLAYING_STATE || this._unlockSource.playbackState === this._unlockSource.FINISHED_STATE)) {
                        this.touchLocked = false;
                        this._unlockSource = null;
                        this.game.input.touch.callbackContext = null;
                        this.game.input.touch.touchStartCallback = null;
                    }
                }
            }

            for (var i = 0; i < this._sounds.length; i++) {
                this._sounds[i].update();
            }
        };

        SoundManager.prototype.add = function (key, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            var sound = new Phaser.Sound(this.game, key, volume, loop);

            this._sounds.push(sound);

            return sound;
        };
        return SoundManager;
    })();
    Phaser.SoundManager = SoundManager;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Sound
*
* A Sound file, used by the Game.SoundManager for playback.
*/
var Phaser;
(function (Phaser) {
    var Sound = (function () {
        /**
        * Sound constructor
        * @param [volume] {number} volume of this sound when playing.
        * @param [loop] {boolean} loop this sound when playing? (Default to false)
        */
        function Sound(game, key, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            /**
            * Reference to AudioContext instance.
            */
            this.context = null;
            /**
            * Decoded data buffer / Audio tag.
            */
            this._buffer = null;
            this._muted = false;
            this.usingWebAudio = false;
            this.usingAudioTag = false;
            this.name = '';
            this.autoplay = false;
            this.totalDuration = 0;
            this.startTime = 0;
            this.currentTime = 0;
            this.duration = 0;
            this.stopTime = 0;
            this.paused = false;
            this.loop = false;
            this.isPlaying = false;
            this.currentMarker = '';
            this.pendingPlayback = false;
            this.override = false;
            this.game = game;

            this.usingWebAudio = this.game.sound.usingWebAudio;
            this.usingAudioTag = this.game.sound.usingAudioTag;
            this.key = key;

            if (this.usingWebAudio) {
                this.context = this.game.sound.context;
                this.masterGainNode = this.game.sound.masterGain;

                if (typeof this.context.createGain === 'undefined') {
                    this.gainNode = this.context.createGainNode();
                } else {
                    this.gainNode = this.context.createGain();
                }

                this.gainNode.gain.value = volume * this.game.sound.volume;
                this.gainNode.connect(this.masterGainNode);
            } else {
                if (this.game.cache.getSound(key) && this.game.cache.getSound(key).locked == false) {
                    this._sound = this.game.cache.getSoundData(key);
                    this.totalDuration = this._sound.duration;
                } else {
                    this.game.cache.onSoundUnlock.add(this.soundHasUnlocked, this);
                }
            }

            this._volume = volume;
            this.loop = loop;
            this.markers = {};

            this.onDecoded = new Phaser.Signal();
            this.onPlay = new Phaser.Signal();
            this.onPause = new Phaser.Signal();
            this.onResume = new Phaser.Signal();
            this.onLoop = new Phaser.Signal();
            this.onStop = new Phaser.Signal();
            this.onMute = new Phaser.Signal();
            this.onMarkerComplete = new Phaser.Signal();
        }
        Sound.prototype.soundHasUnlocked = function (key) {
            if (key == this.key) {
                this._sound = this.game.cache.getSoundData(this.key);
                this.totalDuration = this._sound.duration;
                //console.log('sound has unlocked', this._sound);
            }
        };

        Object.defineProperty(Sound.prototype, "isDecoding", {
            get: function () {
                return this.game.cache.getSound(this.key).isDecoding;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Sound.prototype, "isDecoded", {
            get: function () {
                return this.game.cache.isSoundDecoded(this.key);
            },
            enumerable: true,
            configurable: true
        });

        Sound.prototype.addMarker = function (name, start, stop, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            this.markers[name] = { name: name, start: start, stop: stop, volume: volume, duration: stop - start, loop: loop };
        };

        Sound.prototype.removeMarker = function (name) {
            delete this.markers[name];
        };

        Sound.prototype.update = function () {
            if (this.pendingPlayback && this.game.cache.isSoundReady(this.key)) {
                this.pendingPlayback = false;
                this.play(this._tempMarker, this._tempPosition, this._tempVolume, this._tempLoop);
            }

            if (this.isPlaying) {
                this.currentTime = this.game.time.now - this.startTime;

                if (this.currentTime >= this.duration) {
                    if (this.usingWebAudio) {
                        if (this.loop) {
                            //console.log('loop1');
                            //  won't work with markers, needs to reset the position
                            this.onLoop.dispatch(this);

                            if (this.currentMarker == '') {
                                //console.log('loop2');
                                this.currentTime = 0;
                                this.startTime = this.game.time.now;
                            } else {
                                //console.log('loop3');
                                this.play(this.currentMarker, 0, this.volume, true, true);
                            }
                        } else {
                            //console.log('stopping, no loop for marker');
                            this.stop();
                        }
                    } else {
                        if (this.loop) {
                            this.onLoop.dispatch(this);
                            this.play(this.currentMarker, 0, this.volume, true, true);
                        } else {
                            this.stop();
                        }
                    }
                }
            }
        };

        /**
        * Play this sound, or a marked section of it.
        * @param marker {string} Assets key of the sound you want to play.
        * @param [volume] {number} volume of the sound you want to play.
        * @param [loop] {boolean} loop when it finished playing? (Default to false)
        * @return {Sound} The playing sound object.
        */
        Sound.prototype.play = function (marker, position, volume, loop, forceRestart) {
            if (typeof marker === "undefined") { marker = ''; }
            if (typeof position === "undefined") { position = 0; }
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            if (typeof forceRestart === "undefined") { forceRestart = false; }
            if (this.isPlaying == true && forceRestart == false && this.override == false) {
                //  Use Restart instead
                return;
            }

            if (this.isPlaying && this.override) {
                if (this.usingWebAudio) {
                    if (typeof this._sound.stop === 'undefined') {
                        this._sound.noteOff(0);
                    } else {
                        this._sound.stop(0);
                    }
                } else if (this.usingAudioTag) {
                    this._sound.pause();
                    this._sound.currentTime = 0;
                }
            }

            this.currentMarker = marker;

            if (marker !== '' && this.markers[marker]) {
                this.position = this.markers[marker].start;
                this.volume = this.markers[marker].volume;
                this.loop = this.markers[marker].loop;
                this.duration = this.markers[marker].duration * 1000;

                //console.log('marker info loaded', this.loop, this.duration);
                this._tempMarker = marker;
                this._tempPosition = this.position;
                this._tempVolume = this.volume;
                this._tempLoop = this.loop;
            } else {
                this.position = position;
                this.volume = volume;
                this.loop = loop;
                this.duration = 0;

                this._tempMarker = marker;
                this._tempPosition = position;
                this._tempVolume = volume;
                this._tempLoop = loop;
            }

            if (this.usingWebAudio) {
                if (this.game.cache.isSoundDecoded(this.key)) {
                    if (this._buffer == null) {
                        this._buffer = this.game.cache.getSoundData(this.key);
                    }

                    //if (this._sound == null)
                    //{
                    this._sound = this.context.createBufferSource();
                    this._sound.buffer = this._buffer;
                    this._sound.connect(this.gainNode);
                    this.totalDuration = this._sound.buffer.duration;

                    if (this.duration == 0) {
                        this.duration = this.totalDuration * 1000;
                    }

                    if (this.loop && marker == '') {
                        this._sound.loop = true;
                    }

                    if (typeof this._sound.start === 'undefined') {
                        this._sound.noteGrainOn(0, this.position, this.duration / 1000);
                        //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
                    } else {
                        this._sound.start(0, this.position, this.duration / 1000);
                    }

                    this.isPlaying = true;
                    this.startTime = this.game.time.now;
                    this.currentTime = 0;
                    this.stopTime = this.startTime + this.duration;
                    this.onPlay.dispatch(this);
                    //console.log('playing, start', this.startTime, 'stop');
                } else {
                    this.pendingPlayback = true;

                    if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).isDecoding == false) {
                        this.game.sound.decode(this.key, this);
                    }
                }
            } else {
                if (this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).locked) {
                    //console.log('tried playing locked sound, pending set, reload started');
                    this.game.cache.reloadSound(this.key);
                    this.pendingPlayback = true;
                } else {
                    if (this._sound && this._sound.readyState == 4) {
                        if (this.duration == 0) {
                            this.duration = this.totalDuration * 1000;
                        }

                        //console.log('playing', this._sound);
                        this._sound.currentTime = this.position;
                        this._sound.muted = this._muted;

                        if (this._muted) {
                            this._sound.volume = 0;
                        } else {
                            this._sound.volume = this._volume;
                        }

                        this._sound.play();

                        this.isPlaying = true;
                        this.startTime = this.game.time.now;
                        this.currentTime = 0;
                        this.stopTime = this.startTime + this.duration;
                        this.onPlay.dispatch(this);
                    } else {
                        this.pendingPlayback = true;
                    }
                }
            }
        };

        Sound.prototype.restart = function (marker, position, volume, loop) {
            if (typeof marker === "undefined") { marker = ''; }
            if (typeof position === "undefined") { position = 0; }
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            this.play(marker, position, volume, loop, true);
        };

        Sound.prototype.pause = function () {
            if (this.isPlaying && this._sound) {
                this.stop();
                this.isPlaying = false;
                this.paused = true;
                this.onPause.dispatch(this);
            }
        };

        Sound.prototype.resume = function () {
            if (this.paused && this._sound) {
                if (this.usingWebAudio) {
                    if (typeof this._sound.start === 'undefined') {
                        this._sound.noteGrainOn(0, this.position, this.duration);
                        //this._sound.noteOn(0); // the zero is vitally important, crashes iOS6 without it
                    } else {
                        this._sound.start(0, this.position, this.duration);
                    }
                } else {
                    this._sound.play();
                }

                this.isPlaying = true;
                this.paused = false;
                this.onResume.dispatch(this);
            }
        };

        /**
        * Stop playing this sound.
        */
        Sound.prototype.stop = function () {
            if (this.isPlaying && this._sound) {
                if (this.usingWebAudio) {
                    if (typeof this._sound.stop === 'undefined') {
                        this._sound.noteOff(0);
                    } else {
                        this._sound.stop(0);
                    }
                } else if (this.usingAudioTag) {
                    this._sound.pause();
                    this._sound.currentTime = 0;
                }
            }

            this.isPlaying = false;

            var prevMarker = this.currentMarker;

            this.currentMarker = '';

            this.onStop.dispatch(this, prevMarker);
        };

        Object.defineProperty(Sound.prototype, "mute", {
            get: /**
            * Mute sounds.
            */
            function () {
                return this._muted;
            },
            set: function (value) {
                if (value) {
                    this._muted = true;

                    if (this.usingWebAudio) {
                        this._muteVolume = this.gainNode.gain.value;
                        this.gainNode.gain.value = 0;
                    } else if (this.usingAudioTag && this._sound) {
                        this._muteVolume = this._sound.volume;
                        this._sound.volume = 0;
                    }
                } else {
                    this._muted = false;

                    if (this.usingWebAudio) {
                        this.gainNode.gain.value = this._muteVolume;
                    } else if (this.usingAudioTag && this._sound) {
                        this._sound.volume = this._muteVolume;
                    }
                }

                this.onMute.dispatch(this);
            },
            enumerable: true,
            configurable: true
        });



        Object.defineProperty(Sound.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                this._volume = value;

                if (this.usingWebAudio) {
                    this.gainNode.gain.value = value;
                } else if (this.usingAudioTag && this._sound) {
                    this._sound.volume = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        return Sound;
    })();
    Phaser.Sound = Sound;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Animation
*
* An Animation instance contains a single animation and the controls to play it.
* It is created by the AnimationManager and belongs to Game Objects such as Sprite.
*
* @package    Phaser.Animation
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var Animation = (function () {
        /**
        * Animation constructor
        * Create a new <code>Animation</code>.
        *
        * @param parent {Sprite} Owner sprite of this animation.
        * @param frameData {FrameData} The FrameData object contains animation data.
        * @param name {string} Unique name of this animation.
        * @param frames {number[]/string[]} An array of numbers or strings indicating what frames to play in what order.
        * @param delay {number} Time between frames in ms.
        * @param looped {boolean} Whether or not the animation is looped or just plays once.
        */
        function Animation(game, parent, frameData, name, frames, delay, looped) {
            this.game = game;
            this._parent = parent;
            this._frames = frames;
            this._frameData = frameData;

            this.name = name;
            this.delay = 1000 / delay;
            this.looped = looped;

            this.isFinished = false;
            this.isPlaying = false;

            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
        }
        Object.defineProperty(Animation.prototype, "frameTotal", {
            get: function () {
                return this._frames.length;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Animation.prototype, "frame", {
            get: function () {
                if (this.currentFrame !== null) {
                    return this.currentFrame.index;
                } else {
                    return this._frameIndex;
                }
            },
            set: function (value) {
                this.currentFrame = this._frameData.getFrame(value);

                if (this.currentFrame !== null) {
                    this._parent.texture.width = this.currentFrame.width;
                    this._parent.texture.height = this.currentFrame.height;
                    this._frameIndex = value;
                }
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Play this animation.
        * @param frameRate {number} FrameRate you want to specify instead of using default.
        * @param loop {boolean} Whether or not the animation is looped or just plays once.
        */
        Animation.prototype.play = function (frameRate, loop) {
            if (typeof frameRate === "undefined") { frameRate = null; }
            if (typeof loop === "undefined") { loop = false; }
            if (frameRate !== null) {
                this.delay = 1000 / frameRate;
            }

            this.looped = loop;
            this.isPlaying = true;
            this.isFinished = false;

            this._timeLastFrame = this.game.time.now;
            this._timeNextFrame = this.game.time.now + this.delay;

            this._frameIndex = 0;

            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

            this._parent.events.onAnimationStart.dispatch(this._parent, this);

            return this;
        };

        /**
        * Play this animation from the first frame.
        */
        Animation.prototype.restart = function () {
            this.isPlaying = true;
            this.isFinished = false;

            this._timeLastFrame = this.game.time.now;
            this._timeNextFrame = this.game.time.now + this.delay;

            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
        };

        /**
        * Stop playing animation and set it finished.
        */
        Animation.prototype.stop = function () {
            this.isPlaying = false;
            this.isFinished = true;
        };

        /**
        * Update animation frames.
        */
        Animation.prototype.update = function () {
            if (this.isPlaying == true && this.game.time.now >= this._timeNextFrame) {
                this._frameIndex++;

                if (this._frameIndex == this._frames.length) {
                    if (this.looped) {
                        this._frameIndex = 0;
                        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                        this._parent.events.onAnimationLoop.dispatch(this._parent, this);
                    } else {
                        this.onComplete();
                    }
                } else {
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                }

                this._timeLastFrame = this.game.time.now;
                this._timeNextFrame = this.game.time.now + this.delay;

                return true;
            }

            return false;
        };

        /**
        * Clean up animation memory.
        */
        Animation.prototype.destroy = function () {
            this.game = null;
            this._parent = null;
            this._frames = null;
            this._frameData = null;
            this.currentFrame = null;
            this.isPlaying = false;
        };

        /**
        * Animation complete callback method.
        */
        Animation.prototype.onComplete = function () {
            this.isPlaying = false;
            this.isFinished = true;

            this._parent.events.onAnimationComplete.dispatch(this._parent, this);
        };
        return Animation;
    })();
    Phaser.Animation = Animation;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * AnimationManager
    *
    * Any Game Object that supports animation contains a single AnimationManager instance. It is used to add,
    * play and update Phaser.Animation objects.
    *
    * @package    Phaser.Components.AnimationManager
    * @author     Richard Davey <rich@photonstorm.com>
    * @copyright  2013 Photon Storm Ltd.
    * @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
    */
    (function (Components) {
        var AnimationManager = (function () {
            /**
            * AnimationManager constructor
            * Create a new <code>AnimationManager</code>.
            *
            * @param parent {Sprite} Owner sprite of this manager.
            */
            function AnimationManager(parent) {
                /**
                * Data contains animation frames.
                * @type {FrameData}
                */
                this._frameData = null;
                /**
                * When an animation frame changes you can choose to automatically update the physics bounds of the parent Sprite
                * to the width and height of the new frame. If you've set a specific physics bounds that you don't want changed during
                * animation then set this to false, otherwise leave it set to true.
                * @type {boolean}
                */
                this.autoUpdateBounds = true;
                /**
                * Keeps track of the current frame of animation.
                */
                this.currentFrame = null;
                this._parent = parent;
                this.game = parent.game;
                this._anims = {};
            }
            /**
            * Load animation frame data.
            * @param frameData Data to be loaded.
            */
            AnimationManager.prototype.loadFrameData = function (frameData) {
                this._frameData = frameData;

                this.frame = 0;
            };

            /**
            * Add a new animation.
            * @param name {string} What this animation should be called (e.g. "run").
            * @param frames {any[]} An array of numbers/strings indicating what frames to play in what order (e.g. [1, 2, 3] or ['run0', 'run1', run2]).
            * @param frameRate {number} The speed in frames per second that the animation should play at (e.g. 60 fps).
            * @param loop {boolean} Whether or not the animation is looped or just plays once.
            * @param useNumericIndex {boolean} Use number indexes instead of string indexes?
            * @return {Animation} The Animation that was created
            */
            AnimationManager.prototype.add = function (name, frames, frameRate, loop, useNumericIndex) {
                if (typeof frames === "undefined") { frames = null; }
                if (typeof frameRate === "undefined") { frameRate = 60; }
                if (typeof loop === "undefined") { loop = false; }
                if (typeof useNumericIndex === "undefined") { useNumericIndex = true; }
                if (this._frameData == null) {
                    return;
                }

                if (this._parent.events.onAnimationStart == null) {
                    this._parent.events.onAnimationStart = new Phaser.Signal();
                    this._parent.events.onAnimationComplete = new Phaser.Signal();
                    this._parent.events.onAnimationLoop = new Phaser.Signal();
                }

                if (frames == null) {
                    frames = this._frameData.getFrameIndexes();
                } else {
                    if (this.validateFrames(frames, useNumericIndex) == false) {
                        throw Error('Invalid frames given to Animation ' + name);
                        return;
                    }
                }

                if (useNumericIndex == false) {
                    frames = this._frameData.getFrameIndexesByName(frames);
                }

                this._anims[name] = new Phaser.Animation(this.game, this._parent, this._frameData, name, frames, frameRate, loop);

                this.currentAnim = this._anims[name];
                this.currentFrame = this.currentAnim.currentFrame;

                return this._anims[name];
            };

            /**
            * Check whether the frames is valid.
            * @param frames {any[]} Frames to be validated.
            * @param useNumericIndex {boolean} Does these frames use number indexes or string indexes?
            * @return {boolean} True if they're valid, otherwise return false.
            */
            AnimationManager.prototype.validateFrames = function (frames, useNumericIndex) {
                for (var i = 0; i < frames.length; i++) {
                    if (useNumericIndex == true) {
                        if (frames[i] > this._frameData.total) {
                            return false;
                        }
                    } else {
                        if (this._frameData.checkFrameName(frames[i]) == false) {
                            return false;
                        }
                    }
                }

                return true;
            };

            /**
            * Play animation with specific name.
            * @param name {string} The string name of the animation you want to play.
            * @param frameRate {number} FrameRate you want to specify instead of using default.
            * @param loop {boolean} Whether or not the animation is looped or just plays once.
            */
            AnimationManager.prototype.play = function (name, frameRate, loop) {
                if (typeof frameRate === "undefined") { frameRate = null; }
                if (typeof loop === "undefined") { loop = false; }
                if (this._anims[name]) {
                    if (this.currentAnim == this._anims[name]) {
                        if (this.currentAnim.isPlaying == false) {
                            return this.currentAnim.play(frameRate, loop);
                        }
                    } else {
                        this.currentAnim = this._anims[name];
                        return this.currentAnim.play(frameRate, loop);
                    }
                }
            };

            /**
            * Stop animation by name.
            * Current animation will be automatically set to the stopped one.
            */
            AnimationManager.prototype.stop = function (name) {
                if (this._anims[name]) {
                    this.currentAnim = this._anims[name];
                    this.currentAnim.stop();
                }
            };

            /**
            * Update animation and parent sprite's bounds.
            */
            AnimationManager.prototype.update = function () {
                if (this.currentAnim && this.currentAnim.update() == true) {
                    this.currentFrame = this.currentAnim.currentFrame;
                    this._parent.texture.width = this.currentFrame.width;
                    this._parent.texture.height = this.currentFrame.height;
                }
            };

            Object.defineProperty(AnimationManager.prototype, "frameData", {
                get: function () {
                    return this._frameData;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AnimationManager.prototype, "frameTotal", {
                get: function () {
                    if (this._frameData) {
                        return this._frameData.total;
                    } else {
                        return -1;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AnimationManager.prototype, "frame", {
                get: function () {
                    return this._frameIndex;
                },
                set: /**
                *
                * @param value
                */
                function (value) {
                    if (this._frameData && this._frameData.getFrame(value) !== null) {
                        this.currentFrame = this._frameData.getFrame(value);

                        this._parent.texture.width = this.currentFrame.width;
                        this._parent.texture.height = this.currentFrame.height;

                        if (this.autoUpdateBounds && this._parent['body']) {
                            this._parent.body.bounds.width = this.currentFrame.width;
                            this._parent.body.bounds.height = this.currentFrame.height;
                        }

                        this._frameIndex = value;
                    }
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AnimationManager.prototype, "frameName", {
                get: function () {
                    return this.currentFrame.name;
                },
                set: function (value) {
                    if (this._frameData && this._frameData.getFrameByName(value)) {
                        this.currentFrame = this._frameData.getFrameByName(value);

                        this._parent.texture.width = this.currentFrame.width;
                        this._parent.texture.height = this.currentFrame.height;

                        this._frameIndex = this.currentFrame.index;
                    } else {
                        throw new Error("Cannot set frameName: " + value);
                    }
                },
                enumerable: true,
                configurable: true
            });


            /**
            * Removes all related references
            */
            AnimationManager.prototype.destroy = function () {
                this._anims = {};
                this._frameData = null;
                this._frameIndex = 0;
                this.currentAnim = null;
                this.currentFrame = null;
            };
            return AnimationManager;
        })();
        Components.AnimationManager = AnimationManager;
    })(Phaser.Components || (Phaser.Components = {}));
    var Components = Phaser.Components;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Frame
*
* A Frame is a single frame of an animation and is part of a FrameData collection.
*
* @package    Phaser.Frame
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var Frame = (function () {
        /**
        * Frame constructor
        * Create a new <code>Frame</code> with specific position, size and name.
        *
        * @param x {number} X position within the image to cut from.
        * @param y {number} Y position within the image to cut from.
        * @param width {number} Width of the frame.
        * @param height {number} Height of the frame.
        * @param name {string} Name of this frame.
        */
        function Frame(x, y, width, height, name) {
            /**
            * Useful for Texture Atlas files. (is set to the filename value)
            */
            this.name = '';
            /**
            * Rotated? (not yet implemented)
            */
            this.rotated = false;
            /**
            * Either cw or ccw, rotation is always 90 degrees.
            */
            this.rotationDirection = 'cw';
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.name = name;

            this.rotated = false;
            this.trimmed = false;
        }
        /**
        * Set rotation of this frame. (Not yet supported!)
        */
        Frame.prototype.setRotation = function (rotated, rotationDirection) {
            //  Not yet supported
        };

        /**
        * Set trim of the frame.
        * @param trimmed {boolean} Whether this frame trimmed or not.
        * @param actualWidth {number} Actual width of this frame.
        * @param actualHeight {number} Actual height of this frame.
        * @param destX {number} Destination x position.
        * @param destY {number} Destination y position.
        * @param destWidth {number} Destination draw width.
        * @param destHeight {number} Destination draw height.
        */
        Frame.prototype.setTrim = function (trimmed, actualWidth, actualHeight, destX, destY, destWidth, destHeight) {
            //console.log('setTrim', trimmed, 'aw', actualWidth, 'ah', actualHeight, 'dx', destX, 'dy', destY, 'dw', destWidth, 'dh', destHeight);
            this.trimmed = trimmed;

            if (trimmed) {
                this.width = actualWidth;
                this.height = actualHeight;
                this.sourceSizeW = actualWidth;
                this.sourceSizeH = actualHeight;
                this.spriteSourceSizeX = destX;
                this.spriteSourceSizeY = destY;
                this.spriteSourceSizeW = destWidth;
                this.spriteSourceSizeH = destHeight;
            }
        };
        return Frame;
    })();
    Phaser.Frame = Frame;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* FrameData
*
* FrameData is a container for Frame objects, which are the internal representation of animation data in Phaser.
*
* @package    Phaser.FrameData
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var FrameData = (function () {
        /**
        * FrameData constructor
        */
        function FrameData() {
            this._frames = [];
            this._frameNames = [];
        }
        Object.defineProperty(FrameData.prototype, "total", {
            get: function () {
                return this._frames.length;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Add a new frame.
        * @param frame {Frame} The frame you want to add.
        * @return {Frame} The frame you just added.
        */
        FrameData.prototype.addFrame = function (frame) {
            frame.index = this._frames.length;

            this._frames.push(frame);

            if (frame.name !== '') {
                this._frameNames[frame.name] = frame.index;
            }

            return frame;
        };

        /**
        * Get a frame by its index.
        * @param index {number} Index of the frame you want to get.
        * @return {Frame} The frame you want.
        */
        FrameData.prototype.getFrame = function (index) {
            if (this._frames[index]) {
                return this._frames[index];
            }

            return null;
        };

        /**
        * Get a frame by its name.
        * @param name {string} Name of the frame you want to get.
        * @return {Frame} The frame you want.
        */
        FrameData.prototype.getFrameByName = function (name) {
            if (this._frameNames[name] !== '') {
                return this._frames[this._frameNames[name]];
            }

            return null;
        };

        /**
        * Check whether there's a frame with given name.
        * @param name {string} Name of the frame you want to check.
        * @return {boolean} True if frame with given name found, otherwise return false.
        */
        FrameData.prototype.checkFrameName = function (name) {
            if (this._frameNames[name] == null) {
                return false;
            }

            return true;
        };

        /**
        * Get ranges of frames in an array.
        * @param start {number} Start index of frames you want.
        * @param end {number} End index of frames you want.
        * @param [output] {Frame[]} result will be added into this array.
        * @return {Frame[]} Ranges of specific frames in an array.
        */
        FrameData.prototype.getFrameRange = function (start, end, output) {
            if (typeof output === "undefined") { output = []; }
            for (var i = start; i <= end; i++) {
                output.push(this._frames[i]);
            }

            return output;
        };

        /**
        * Get all indexes of frames by giving their name.
        * @param [output] {number[]} result will be added into this array.
        * @return {number[]} Indexes of specific frames in an array.
        */
        FrameData.prototype.getFrameIndexes = function (output) {
            if (typeof output === "undefined") { output = []; }
            output.length = 0;

            for (var i = 0; i < this._frames.length; i++) {
                output.push(i);
            }

            return output;
        };

        /**
        * Get the frame indexes by giving the frame names.
        * @param [output] {number[]} result will be added into this array.
        * @return {number[]} Names of specific frames in an array.
        */
        FrameData.prototype.getFrameIndexesByName = function (input) {
            var output = [];

            for (var i = 0; i < input.length; i++) {
                if (this.getFrameByName(input[i])) {
                    output.push(this.getFrameByName(input[i]).index);
                }
            }

            return output;
        };

        /**
        * Get all frames in this frame data.
        * @return {Frame[]} All the frames in an array.
        */
        FrameData.prototype.getAllFrames = function () {
            return this._frames;
        };

        /**
        * Get All frames with specific ranges.
        * @param range {number[]} Ranges in an array.
        * @return {Frame[]} All frames in an array.
        */
        FrameData.prototype.getFrames = function (range) {
            var output = [];

            for (var i = 0; i < range.length; i++) {
                output.push(this._frames[i]);
            }

            return output;
        };
        return FrameData;
    })();
    Phaser.FrameData = FrameData;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Cache
*
* A game only has one instance of a Cache and it is used to store all externally loaded assets such
* as images, sounds and data files as a result of Loader calls. Cache items use string based keys for look-up.
*/
var Phaser;
(function (Phaser) {
    var Cache = (function () {
        /**
        * Cache constructor
        */
        function Cache(game) {
            this.onSoundUnlock = new Phaser.Signal();
            this.game = game;

            this._canvases = {};
            this._images = {};
            this._sounds = {};
            this._text = {};
        }
        /**
        * Add a new canvas.
        * @param key {string} Asset key for this canvas.
        * @param canvas {HTMLCanvasElement} Canvas DOM element.
        * @param context {CanvasRenderingContext2D} Render context of this canvas.
        */
        Cache.prototype.addCanvas = function (key, canvas, context) {
            this._canvases[key] = { canvas: canvas, context: context };
        };

        /**
        * Add a new sprite sheet.
        * @param key {string} Asset key for the sprite sheet.
        * @param url {string} URL of this sprite sheet file.
        * @param data {object} Extra sprite sheet data.
        * @param frameWidth {number} Width of the sprite sheet.
        * @param frameHeight {number} Height of the sprite sheet.
        * @param frameMax {number} How many frames stored in the sprite sheet.
        */
        Cache.prototype.addSpriteSheet = function (key, url, data, frameWidth, frameHeight, frameMax) {
            this._images[key] = { url: url, data: data, spriteSheet: true, frameWidth: frameWidth, frameHeight: frameHeight };
            this._images[key].frameData = Phaser.AnimationLoader.parseSpriteSheet(this.game, key, frameWidth, frameHeight, frameMax);
        };

        /**
        * Add a new texture atlas.
        * @param key  {string} Asset key for the texture atlas.
        * @param url  {string} URL of this texture atlas file.
        * @param data {object} Extra texture atlas data.
        * @param atlasData {object} Texture atlas frames data.
        */
        Cache.prototype.addTextureAtlas = function (key, url, data, atlasData, format) {
            this._images[key] = { url: url, data: data, spriteSheet: true };

            if (format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                this._images[key].frameData = Phaser.AnimationLoader.parseJSONData(this.game, atlasData);
            } else if (format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING) {
                this._images[key].frameData = Phaser.AnimationLoader.parseXMLData(this.game, atlasData, format);
            }
        };

        /**
        * Add a new image.
        * @param key {string} Asset key for the image.
        * @param url {string} URL of this image file.
        * @param data {object} Extra image data.
        */
        Cache.prototype.addImage = function (key, url, data) {
            this._images[key] = { url: url, data: data, spriteSheet: false };
        };

        /**
        * Add a new sound.
        * @param key {string} Asset key for the sound.
        * @param url {string} URL of this sound file.
        * @param data {object} Extra sound data.
        */
        Cache.prototype.addSound = function (key, url, data, webAudio, audioTag) {
            if (typeof webAudio === "undefined") { webAudio = true; }
            if (typeof audioTag === "undefined") { audioTag = false; }
            var locked = this.game.sound.touchLocked;
            var decoded = false;

            if (audioTag) {
                decoded = true;
            }

            this._sounds[key] = { url: url, data: data, locked: locked, isDecoding: false, decoded: decoded, webAudio: webAudio, audioTag: audioTag };
        };

        Cache.prototype.reloadSound = function (key) {
            var _this = this;
            if (this._sounds[key]) {
                this._sounds[key].data.src = this._sounds[key].url;
                this._sounds[key].data.addEventListener('canplaythrough', function () {
                    return _this.reloadSoundComplete(key);
                }, false);
                this._sounds[key].data.load();
            }
        };

        Cache.prototype.reloadSoundComplete = function (key) {
            if (this._sounds[key]) {
                this._sounds[key].locked = false;
                this.onSoundUnlock.dispatch(key);
            }
        };

        Cache.prototype.updateSound = function (key, property, value) {
            if (this._sounds[key]) {
                this._sounds[key][property] = value;
            }
        };

        /**
        * Add a new decoded sound.
        * @param key {string} Asset key for the sound.
        * @param data {object} Extra sound data.
        */
        Cache.prototype.decodedSound = function (key, data) {
            this._sounds[key].data = data;
            this._sounds[key].decoded = true;
            this._sounds[key].isDecoding = false;
        };

        /**
        * Add a new text data.
        * @param key {string} Asset key for the text data.
        * @param url {string} URL of this text data file.
        * @param data {object} Extra text data.
        */
        Cache.prototype.addText = function (key, url, data) {
            this._text[key] = { url: url, data: data };
        };

        /**
        * Get canvas by key.
        * @param key Asset key of the canvas you want.
        * @return {object} The canvas you want.
        */
        Cache.prototype.getCanvas = function (key) {
            if (this._canvases[key]) {
                return this._canvases[key].canvas;
            }

            return null;
        };

        /**
        * Get image data by key.
        * @param key Asset key of the image you want.
        * @return {object} The image data you want.
        */
        Cache.prototype.getImage = function (key) {
            if (this._images[key]) {
                return this._images[key].data;
            }

            return null;
        };

        /**
        * Get frame data by key.
        * @param key Asset key of the frame data you want.
        * @return {object} The frame data you want.
        */
        Cache.prototype.getFrameData = function (key) {
            if (this._images[key] && this._images[key].spriteSheet == true) {
                return this._images[key].frameData;
            }

            return null;
        };

        /**
        * Get sound by key.
        * @param key Asset key of the sound you want.
        * @return {object} The sound you want.
        */
        Cache.prototype.getSound = function (key) {
            if (this._sounds[key]) {
                return this._sounds[key];
            }

            return null;
        };

        /**
        * Get sound data by key.
        * @param key Asset key of the sound you want.
        * @return {object} The sound data you want.
        */
        Cache.prototype.getSoundData = function (key) {
            if (this._sounds[key]) {
                return this._sounds[key].data;
            }

            return null;
        };

        /**
        * Check whether an asset is decoded sound.
        * @param key Asset key of the sound you want.
        * @return {object} The sound data you want.
        */
        Cache.prototype.isSoundDecoded = function (key) {
            if (this._sounds[key]) {
                return this._sounds[key].decoded;
            }
        };

        /**
        * Check whether an asset is decoded sound.
        * @param key Asset key of the sound you want.
        * @return {object} The sound data you want.
        */
        Cache.prototype.isSoundReady = function (key) {
            if (this._sounds[key] && this._sounds[key].decoded == true && this._sounds[key].locked == false) {
                return true;
            }

            return false;
        };

        /**
        * Check whether an asset is sprite sheet.
        * @param key Asset key of the sprite sheet you want.
        * @return {object} The sprite sheet data you want.
        */
        Cache.prototype.isSpriteSheet = function (key) {
            if (this._images[key]) {
                return this._images[key].spriteSheet;
            }
        };

        /**
        * Get text data by key.
        * @param key Asset key of the text data you want.
        * @return {object} The text data you want.
        */
        Cache.prototype.getText = function (key) {
            if (this._text[key]) {
                return this._text[key].data;
            }

            return null;
        };

        /**
        * Returns an array containing all of the keys of Images in the Cache.
        * @return {Array} The string based keys in the Cache.
        */
        Cache.prototype.getImageKeys = function () {
            var output = [];

            for (var item in this._images) {
                output.push(item);
            }

            return output;
        };

        /**
        * Returns an array containing all of the keys of Sounds in the Cache.
        * @return {Array} The string based keys in the Cache.
        */
        Cache.prototype.getSoundKeys = function () {
            var output = [];

            for (var item in this._sounds) {
                output.push(item);
            }

            return output;
        };

        /**
        * Returns an array containing all of the keys of Text Files in the Cache.
        * @return {Array} The string based keys in the Cache.
        */
        Cache.prototype.getTextKeys = function () {
            var output = [];

            for (var item in this._text) {
                output.push(item);
            }

            return output;
        };

        Cache.prototype.removeCanvas = function (key) {
            delete this._canvases[key];
        };

        Cache.prototype.removeImage = function (key) {
            delete this._images[key];
        };

        Cache.prototype.removeSound = function (key) {
            delete this._sounds[key];
        };

        Cache.prototype.removeText = function (key) {
            delete this._text[key];
        };

        /**
        * Clean up cache memory.
        */
        Cache.prototype.destroy = function () {
            for (var item in this._canvases) {
                delete this._canvases[item['key']];
            }

            for (var item in this._images) {
                delete this._images[item['key']];
            }

            for (var item in this._sounds) {
                delete this._sounds[item['key']];
            }

            for (var item in this._text) {
                delete this._text[item['key']];
            }
        };
        return Cache;
    })();
    Phaser.Cache = Cache;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Loader
*
* The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides for progress and completion callbacks.
*/
var Phaser;
(function (Phaser) {
    var Loader = (function () {
        /**
        * Loader constructor
        *
        * @param game {Phaser.Game} Current game instance.
        */
        function Loader(game) {
            /**
            * The crossOrigin value applied to loaded images
            * @type {string}
            */
            this.crossOrigin = '';
            this.game = game;

            this._keys = [];
            this._fileList = {};
            this._xhr = new XMLHttpRequest();
            this._queueSize = 0;
            this.isLoading = false;

            this.onFileComplete = new Phaser.Signal();
            this.onFileError = new Phaser.Signal();
            this.onLoadStart = new Phaser.Signal();
            this.onLoadComplete = new Phaser.Signal();
        }
        /**
        * Reset loader, this will remove all loaded assets.
        */
        Loader.prototype.reset = function () {
            this._queueSize = 0;
            this.isLoading = false;
        };

        Object.defineProperty(Loader.prototype, "queueSize", {
            get: function () {
                return this._queueSize;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Add a new image asset loading request with key and url.
        * @param key {string} Unique asset key of this image file.
        * @param url {string} URL of image file.
        */
        Loader.prototype.image = function (key, url, overwrite) {
            if (typeof overwrite === "undefined") { overwrite = false; }
            if (overwrite == true || this.checkKeyExists(key) == false) {
                this._queueSize++;
                this._fileList[key] = { type: 'image', key: key, url: url, data: null, error: false, loaded: false };
                this._keys.push(key);
            }
        };

        /**
        * Add a new sprite sheet loading request.
        * @param key {string} Unique asset key of the sheet file.
        * @param url {string} URL of sheet file.
        * @param frameWidth {number} Width of each single frame.
        * @param frameHeight {number} Height of each single frame.
        * @param frameMax {number} How many frames in this sprite sheet.
        */
        Loader.prototype.spritesheet = function (key, url, frameWidth, frameHeight, frameMax) {
            if (typeof frameMax === "undefined") { frameMax = -1; }
            if (this.checkKeyExists(key) === false) {
                this._queueSize++;
                this._fileList[key] = { type: 'spritesheet', key: key, url: url, data: null, frameWidth: frameWidth, frameHeight: frameHeight, frameMax: frameMax, error: false, loaded: false };
                this._keys.push(key);
            }
        };

        /**
        * Add a new texture atlas loading request.
        * @param key {string} Unique asset key of the texture atlas file.
        * @param textureURL {string} The url of the texture atlas image file.
        * @param [atlasURL] {string} The url of the texture atlas data file (json/xml)
        * @param [atlasData] {object} A JSON or XML data object.
        * @param [format] {number} A value describing the format of the data.
        */
        Loader.prototype.atlas = function (key, textureURL, atlasURL, atlasData, format) {
            if (typeof atlasURL === "undefined") { atlasURL = null; }
            if (typeof atlasData === "undefined") { atlasData = null; }
            if (typeof format === "undefined") { format = Loader.TEXTURE_ATLAS_JSON_ARRAY; }
            if (this.checkKeyExists(key) === false) {
                if (atlasURL !== null) {
                    //  A URL to a json/xml file has been given
                    this._queueSize++;
                    this._fileList[key] = { type: 'textureatlas', key: key, url: textureURL, atlasURL: atlasURL, data: null, format: format, error: false, loaded: false };
                    this._keys.push(key);
                } else {
                    if (format == Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                        if (typeof atlasData === 'string') {
                            atlasData = JSON.parse(atlasData);
                        }

                        this._queueSize++;
                        this._fileList[key] = { type: 'textureatlas', key: key, url: textureURL, data: null, atlasURL: null, atlasData: atlasData, format: format, error: false, loaded: false };
                        this._keys.push(key);
                    } else if (format == Loader.TEXTURE_ATLAS_XML_STARLING) {
                        if (typeof atlasData === 'string') {
                            var xml;

                            try  {
                                if (window['DOMParser']) {
                                    var domparser = new DOMParser();
                                    xml = domparser.parseFromString(atlasData, "text/xml");
                                } else {
                                    xml = new ActiveXObject("Microsoft.XMLDOM");
                                    xml.async = 'false';
                                    xml.loadXML(atlasData);
                                }
                            } catch (e) {
                                xml = undefined;
                            }

                            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                                throw new Error("Phaser.Loader. Invalid Texture Atlas XML given");
                            } else {
                                atlasData = xml;
                            }
                        }

                        this._queueSize++;
                        this._fileList[key] = { type: 'textureatlas', key: key, url: textureURL, data: null, atlasURL: null, atlasData: atlasData, format: format, error: false, loaded: false };
                        this._keys.push(key);
                    }
                }
            }
        };

        /**
        * Add a new audio file loading request.
        * @param key {string} Unique asset key of the audio file.
        * @param urls {Array} An array containing the URLs of the audio files, i.e.: [ 'jump.mp3', 'jump.ogg', 'jump.m4a' ]
        * @param autoDecode {boolean} When using Web Audio the audio files can either be decoded at load time or run-time. They can't be played until they are decoded, but this let's you control when that happens. Decoding is a non-blocking async process.
        */
        Loader.prototype.audio = function (key, urls, autoDecode) {
            if (typeof autoDecode === "undefined") { autoDecode = true; }
            if (this.checkKeyExists(key) === false) {
                this._queueSize++;
                this._fileList[key] = { type: 'audio', key: key, url: urls, data: null, buffer: null, error: false, loaded: false, autoDecode: autoDecode };
                this._keys.push(key);
            }
        };

        /**
        * Add a new text file loading request.
        * @param key {string} Unique asset key of the text file.
        * @param url {string} URL of text file.
        */
        Loader.prototype.text = function (key, url) {
            if (this.checkKeyExists(key) === false) {
                this._queueSize++;
                this._fileList[key] = { type: 'text', key: key, url: url, data: null, error: false, loaded: false };
                this._keys.push(key);
            }
        };

        /**
        * Remove loading request of a file.
        * @param key {string} Key of the file you want to remove.
        */
        Loader.prototype.removeFile = function (key) {
            delete this._fileList[key];
        };

        /**
        * Remove all file loading requests.
        */
        Loader.prototype.removeAll = function () {
            this._fileList = {};
        };

        /**
        * Load assets.
        */
        Loader.prototype.start = function () {
            if (this.isLoading) {
                return;
            }

            this.progress = 0;
            this.hasLoaded = false;
            this.isLoading = true;

            this.onLoadStart.dispatch(this.queueSize);

            if (this._keys.length > 0) {
                this._progressChunk = 100 / this._keys.length;
                this.loadFile();
            } else {
                this.progress = 100;
                this.hasLoaded = true;
                this.onLoadComplete.dispatch();
            }
        };

        /**
        * Load files. Private method ONLY used by loader.
        */
        Loader.prototype.loadFile = function () {
            var _this = this;
            var file = this._fileList[this._keys.pop()];

            switch (file.type) {
                case 'image':
                case 'spritesheet':
                case 'textureatlas':
                    file.data = new Image();
                    file.data.name = file.key;
                    file.data.onload = function () {
                        return _this.fileComplete(file.key);
                    };
                    file.data.onerror = function () {
                        return _this.fileError(file.key);
                    };
                    file.data.crossOrigin = this.crossOrigin;
                    file.data.src = file.url;
                    break;

                case 'audio':
                    file.url = this.getAudioURL(file.url);

                    if (file.url !== null) {
                        if (this.game.sound.usingWebAudio) {
                            this._xhr.open("GET", file.url, true);
                            this._xhr.responseType = "arraybuffer";
                            this._xhr.onload = function () {
                                return _this.fileComplete(file.key);
                            };
                            this._xhr.onerror = function () {
                                return _this.fileError(file.key);
                            };
                            this._xhr.send();
                        } else if (this.game.sound.usingAudioTag) {
                            if (this.game.sound.touchLocked) {
                                //  If audio is locked we can't do this yet, so need to queue this load request somehow. Bum.
                                file.data = new Audio();
                                file.data.name = file.key;
                                file.data.preload = 'auto';
                                file.data.src = file.url;
                                this.fileComplete(file.key);
                            } else {
                                file.data = new Audio();
                                file.data.name = file.key;
                                file.data.onerror = function () {
                                    return _this.fileError(file.key);
                                };
                                file.data.preload = 'auto';
                                file.data.src = file.url;
                                file.data.addEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete(file.key), false);
                                file.data.load();
                            }
                        }
                    }

                    break;

                case 'text':
                    this._xhr.open("GET", file.url, true);
                    this._xhr.responseType = "text";
                    this._xhr.onload = function () {
                        return _this.fileComplete(file.key);
                    };
                    this._xhr.onerror = function () {
                        return _this.fileError(file.key);
                    };
                    this._xhr.send();
                    break;
            }
        };

        Loader.prototype.getAudioURL = function (urls) {
            var extension;

            for (var i = 0; i < urls.length; i++) {
                extension = urls[i].toLowerCase();
                extension = extension.substr((Math.max(0, extension.lastIndexOf(".")) || Infinity) + 1);

                if (this.game.device.canPlayAudio(extension)) {
                    return urls[i];
                }
            }

            return null;
        };

        /**
        * Error occured when load a file.
        * @param key {string} Key of the error loading file.
        */
        Loader.prototype.fileError = function (key) {
            this._fileList[key].loaded = true;
            this._fileList[key].error = true;

            this.onFileError.dispatch(key);

            throw new Error("Phaser.Loader error loading file: " + key);

            this.nextFile(key, false);
        };

        /**
        * Called when a file is successfully loaded.
        * @param key {string} Key of the successfully loaded file.
        */
        Loader.prototype.fileComplete = function (key) {
            var _this = this;
            if (!this._fileList[key]) {
                throw new Error('Phaser.Loader fileComplete invalid key ' + key);
                return;
            }

            this._fileList[key].loaded = true;

            var file = this._fileList[key];
            var loadNext = true;

            switch (file.type) {
                case 'image':
                    this.game.cache.addImage(file.key, file.url, file.data);
                    break;

                case 'spritesheet':
                    this.game.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax);
                    break;

                case 'textureatlas':
                    if (file.atlasURL == null) {
                        this.game.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData, file.format);
                    } else {
                        //  Load the JSON or XML before carrying on with the next file
                        loadNext = false;
                        this._xhr.open("GET", file.atlasURL, true);
                        this._xhr.responseType = "text";

                        if (file.format == Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                            this._xhr.onload = function () {
                                return _this.jsonLoadComplete(file.key);
                            };
                        } else if (file.format == Loader.TEXTURE_ATLAS_XML_STARLING) {
                            this._xhr.onload = function () {
                                return _this.xmlLoadComplete(file.key);
                            };
                        }

                        this._xhr.onerror = function () {
                            return _this.dataLoadError(file.key);
                        };
                        this._xhr.send();
                    }
                    break;

                case 'audio':
                    if (this.game.sound.usingWebAudio) {
                        file.data = this._xhr.response;

                        this.game.cache.addSound(file.key, file.url, file.data, true, false);

                        if (file.autoDecode) {
                            this.game.cache.updateSound(key, 'isDecoding', true);

                            var that = this;
                            var key = file.key;

                            this.game.sound.context.decodeAudioData(file.data, function (buffer) {
                                if (buffer) {
                                    that.game.cache.decodedSound(key, buffer);
                                }
                            });
                        }
                    } else {
                        file.data.removeEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete);
                        this.game.cache.addSound(file.key, file.url, file.data, false, true);
                    }
                    break;

                case 'text':
                    file.data = this._xhr.response;
                    this.game.cache.addText(file.key, file.url, file.data);
                    break;
            }

            if (loadNext) {
                this.nextFile(key, true);
            }
        };

        /**
        * Successfully loaded a JSON file.
        * @param key {string} Key of the loaded JSON file.
        */
        Loader.prototype.jsonLoadComplete = function (key) {
            var data = JSON.parse(this._xhr.response);
            var file = this._fileList[key];

            this.game.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);

            this.nextFile(key, true);
        };

        /**
        * Error occured when load a JSON.
        * @param key {string} Key of the error loading JSON file.
        */
        Loader.prototype.dataLoadError = function (key) {
            var file = this._fileList[key];

            file.error = true;

            throw new Error("Phaser.Loader dataLoadError: " + key);

            this.nextFile(key, true);
        };

        Loader.prototype.xmlLoadComplete = function (key) {
            var atlasData = this._xhr.response;
            var xml;

            try  {
                if (window['DOMParser']) {
                    var domparser = new DOMParser();
                    xml = domparser.parseFromString(atlasData, "text/xml");
                } else {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = 'false';
                    xml.loadXML(atlasData);
                }
            } catch (e) {
                xml = undefined;
            }

            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                throw new Error("Phaser.Loader. Invalid XML given");
            }

            var file = this._fileList[key];
            this.game.cache.addTextureAtlas(file.key, file.url, file.data, xml, file.format);

            this.nextFile(key, true);
        };

        /**
        * Handle loading next file.
        * @param previousKey {string} Key of previous loaded asset.
        * @param success {boolean} Whether the previous asset loaded successfully or not.
        */
        Loader.prototype.nextFile = function (previousKey, success) {
            this.progress = Math.round(this.progress + this._progressChunk);

            if (this.progress > 100) {
                this.progress = 100;
            }

            this.onFileComplete.dispatch(this.progress, previousKey, success, this._queueSize - this._keys.length, this._queueSize);

            if (this._keys.length > 0) {
                this.loadFile();
            } else {
                this.hasLoaded = true;
                this.isLoading = false;

                this.removeAll();

                this.onLoadComplete.dispatch();
            }
        };

        /**
        * Check whether asset exists with a specific key.
        * @param key {string} Key of the asset you want to check.
        * @return {boolean} Return true if exists, otherwise return false.
        */
        Loader.prototype.checkKeyExists = function (key) {
            if (this._fileList[key]) {
                return true;
            } else {
                return false;
            }
        };
        Loader.TEXTURE_ATLAS_JSON_ARRAY = 0;
        Loader.TEXTURE_ATLAS_JSON_HASH = 1;
        Loader.TEXTURE_ATLAS_XML_STARLING = 2;
        return Loader;
    })();
    Phaser.Loader = Loader;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - AnimationLoader
*
* Responsible for parsing sprite sheet and JSON data into the internal FrameData format that Phaser uses for animations.
*/
var Phaser;
(function (Phaser) {
    var AnimationLoader = (function () {
        function AnimationLoader() {
        }
        AnimationLoader.parseSpriteSheet = /**
        * Parse a sprite sheet from asset data.
        * @param key {string} Asset key for the sprite sheet data.
        * @param frameWidth {number} Width of animation frame.
        * @param frameHeight {number} Height of animation frame.
        * @param frameMax {number} Number of animation frames.
        * @return {FrameData} Generated FrameData object.
        */
        function (game, key, frameWidth, frameHeight, frameMax) {
            //  How big is our image?
            var img = game.cache.getImage(key);

            if (img == null) {
                return null;
            }

            var width = img.width;
            var height = img.height;

            var row = Math.round(width / frameWidth);
            var column = Math.round(height / frameHeight);
            var total = row * column;

            if (frameMax !== -1) {
                total = frameMax;
            }

            if (width == 0 || height == 0 || width < frameWidth || height < frameHeight || total === 0) {
                throw new Error("AnimationLoader.parseSpriteSheet: width/height zero or width/height < given frameWidth/frameHeight");
                return null;
            }

            //  Let's create some frames then
            var data = new Phaser.FrameData();

            var x = 0;
            var y = 0;

            for (var i = 0; i < total; i++) {
                data.addFrame(new Phaser.Frame(x, y, frameWidth, frameHeight, ''));

                x += frameWidth;

                if (x === width) {
                    x = 0;
                    y += frameHeight;
                }
            }

            return data;
        };

        AnimationLoader.parseJSONData = /**
        * Parse frame datas from json.
        * @param json {object} Json data you want to parse.
        * @return {FrameData} Generated FrameData object.
        */
        function (game, json) {
            if (!json['frames']) {
                console.log(json);
                throw new Error("Phaser.AnimationLoader.parseJSONData: Invalid Texture Atlas JSON given, missing 'frames' array");
            }

            //  Let's create some frames then
            var data = new Phaser.FrameData();

            //  By this stage frames is a fully parsed array
            var frames = json['frames'];
            var newFrame;

            for (var i = 0; i < frames.length; i++) {
                newFrame = data.addFrame(new Phaser.Frame(frames[i].frame.x, frames[i].frame.y, frames[i].frame.w, frames[i].frame.h, frames[i].filename));
                newFrame.setTrim(frames[i].trimmed, frames[i].sourceSize.w, frames[i].sourceSize.h, frames[i].spriteSourceSize.x, frames[i].spriteSourceSize.y, frames[i].spriteSourceSize.w, frames[i].spriteSourceSize.h);
            }

            return data;
        };

        AnimationLoader.parseXMLData = function (game, xml, format) {
            if (!xml.getElementsByTagName('TextureAtlas')) {
                throw new Error("Phaser.AnimationLoader.parseXMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
            }

            //  Let's create some frames then
            var data = new Phaser.FrameData();

            var frames = xml.getElementsByTagName('SubTexture');

            var newFrame;

            for (var i = 0; i < frames.length; i++) {
                var frame = frames[i].attributes;

                newFrame = data.addFrame(new Phaser.Frame(frame.x.nodeValue, frame.y.nodeValue, frame.width.nodeValue, frame.height.nodeValue, frame.name.nodeValue));

                if (frame.frameX.nodeValue != '-0' || frame.frameY.nodeValue != '-0') {
                    newFrame.setTrim(true, frame.width.nodeValue, frame.height.nodeValue, Math.abs(frame.frameX.nodeValue), Math.abs(frame.frameY.nodeValue), frame.frameWidth.nodeValue, frame.frameHeight.nodeValue);
                }
            }

            return data;
        };
        return AnimationLoader;
    })();
    Phaser.AnimationLoader = AnimationLoader;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Tile
*
* A Tile is a single representation of a tile within a Tilemap
*/
var Phaser;
(function (Phaser) {
    var Tile = (function () {
        /**
        * Tile constructor
        * Create a new <code>Tile</code>.
        *
        * @param tilemap {Tilemap} the tilemap this tile belongs to.
        * @param index {number} The index of this tile type in the core map data.
        * @param width {number} Width of the tile.
        * @param height number} Height of the tile.
        */
        function Tile(game, tilemap, index, width, height) {
            /**
            * The virtual mass of the tile.
            * @type {number}
            */
            this.mass = 1.0;
            /**
            * Indicating collide with any object on the left.
            * @type {boolean}
            */
            this.collideLeft = false;
            /**
            * Indicating collide with any object on the right.
            * @type {boolean}
            */
            this.collideRight = false;
            /**
            * Indicating collide with any object on the top.
            * @type {boolean}
            */
            this.collideUp = false;
            /**
            * Indicating collide with any object on the bottom.
            * @type {boolean}
            */
            this.collideDown = false;
            /**
            * Enable separation at x-axis.
            * @type {boolean}
            */
            this.separateX = true;
            /**
            * Enable separation at y-axis.
            * @type {boolean}
            */
            this.separateY = true;
            this.game = game;
            this.tilemap = tilemap;
            this.index = index;

            this.width = width;
            this.height = height;
            this.allowCollisions = Phaser.Types.NONE;
        }
        /**
        * Clean up memory.
        */
        Tile.prototype.destroy = function () {
            this.tilemap = null;
        };

        /**
        * Set collision configs.
        * @param collision {number} Bit field of flags. (see Tile.allowCollision)
        * @param resetCollisions {boolean} Reset collision flags before set.
        * @param separateX {boolean} Enable seprate at x-axis.
        * @param separateY {boolean} Enable seprate at y-axis.
        */
        Tile.prototype.setCollision = function (collision, resetCollisions, separateX, separateY) {
            if (resetCollisions) {
                this.resetCollision();
            }

            this.separateX = separateX;
            this.separateY = separateY;

            this.allowCollisions = collision;

            if (collision & Phaser.Types.ANY) {
                this.collideLeft = true;
                this.collideRight = true;
                this.collideUp = true;
                this.collideDown = true;
                return;
            }

            if (collision & Phaser.Types.LEFT || collision & Phaser.Types.WALL) {
                this.collideLeft = true;
            }

            if (collision & Phaser.Types.RIGHT || collision & Phaser.Types.WALL) {
                this.collideRight = true;
            }

            if (collision & Phaser.Types.UP || collision & Phaser.Types.CEILING) {
                this.collideUp = true;
            }

            if (collision & Phaser.Types.DOWN || collision & Phaser.Types.CEILING) {
                this.collideDown = true;
            }
        };

        /**
        * Reset collision status flags.
        */
        Tile.prototype.resetCollision = function () {
            this.allowCollisions = Phaser.Types.NONE;
            this.collideLeft = false;
            this.collideRight = false;
            this.collideUp = false;
            this.collideDown = false;
        };

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        Tile.prototype.toString = function () {
            return "[{Tile (index=" + this.index + " collisions=" + this.allowCollisions + " width=" + this.width + " height=" + this.height + ")}]";
        };
        return Tile;
    })();
    Phaser.Tile = Tile;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Tilemap
*
* This GameObject allows for the display of a tilemap within the game world. Tile maps consist of an image, tile data and a size.
* Internally it creates a TilemapLayer for each layer in the tilemap.
*/
var Phaser;
(function (Phaser) {
    var Tilemap = (function () {
        /**
        * Tilemap constructor
        * Create a new <code>Tilemap</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param key {string} Asset key for this map.
        * @param mapData {string} Data of this map. (a big 2d array, normally in csv)
        * @param format {number} Format of this map data, available: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
        * @param resizeWorld {boolean} Resize the world bound automatically based on this tilemap?
        * @param tileWidth {number} Width of tiles in this map.
        * @param tileHeight {number} Height of tiles in this map.
        */
        function Tilemap(game, key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
            /**
            * z order value of the object.
            */
            this.z = -1;
            /**
            * Render iteration counter
            */
            this.renderOrderID = 0;
            /**
            * Tilemap collision callback.
            * @type {function}
            */
            this.collisionCallback = null;
            this.game = game;
            this.type = Phaser.Types.TILEMAP;

            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;

            this.z = -1;
            this.group = null;
            this.name = '';

            this.texture = new Phaser.Display.Texture(this);
            this.transform = new Phaser.Components.TransformManager(this);

            this.tiles = [];
            this.layers = [];

            this.mapFormat = format;

            switch (format) {
                case Tilemap.FORMAT_CSV:
                    this.parseCSV(game.cache.getText(mapData), key, tileWidth, tileHeight);
                    break;

                case Tilemap.FORMAT_TILED_JSON:
                    this.parseTiledJSON(game.cache.getText(mapData), key);
                    break;
            }

            if (this.currentLayer && resizeWorld) {
                this.game.world.setSize(this.currentLayer.widthInPixels, this.currentLayer.heightInPixels, true);
            }
        }
        /**
        * Parset csv map data and generate tiles.
        * @param data {string} CSV map data.
        * @param key {string} Asset key for tileset image.
        * @param tileWidth {number} Width of its tile.
        * @param tileHeight {number} Height of its tile.
        */
        Tilemap.prototype.parseCSV = function (data, key, tileWidth, tileHeight) {
            var layer = new Phaser.TilemapLayer(this, 0, key, Tilemap.FORMAT_CSV, 'TileLayerCSV' + this.layers.length.toString(), tileWidth, tileHeight);

            //  Trim any rogue whitespace from the data
            data = data.trim();

            var rows = data.split("\n");

            for (var i = 0; i < rows.length; i++) {
                var column = rows[i].split(",");

                if (column.length > 0) {
                    layer.addColumn(column);
                }
            }

            layer.updateBounds();

            var tileQuantity = layer.parseTileOffsets();

            this.currentLayer = layer;
            this.collisionLayer = layer;

            this.layers.push(layer);

            this.generateTiles(tileQuantity);
        };

        /**
        * Parse JSON map data and generate tiles.
        * @param data {string} JSON map data.
        * @param key {string} Asset key for tileset image.
        */
        Tilemap.prototype.parseTiledJSON = function (data, key) {
            //  Trim any rogue whitespace from the data
            data = data.trim();

            var json = JSON.parse(data);

            for (var i = 0; i < json.layers.length; i++) {
                var layer = new Phaser.TilemapLayer(this, i, key, Tilemap.FORMAT_TILED_JSON, json.layers[i].name, json.tilewidth, json.tileheight);

                if (!json.layers[i].data) {
                    continue;
                }

                layer.alpha = json.layers[i].opacity;
                layer.visible = json.layers[i].visible;
                layer.tileMargin = json.tilesets[0].margin;
                layer.tileSpacing = json.tilesets[0].spacing;

                var c = 0;
                var row;

                for (var t = 0; t < json.layers[i].data.length; t++) {
                    if (c == 0) {
                        row = [];
                    }

                    row.push(json.layers[i].data[t]);

                    c++;

                    if (c == json.layers[i].width) {
                        layer.addColumn(row);
                        c = 0;
                    }
                }

                layer.updateBounds();

                var tileQuantity = layer.parseTileOffsets();

                this.currentLayer = layer;
                this.collisionLayer = layer;

                this.layers.push(layer);
            }

            this.generateTiles(tileQuantity);
        };

        /**
        * Create tiles of given quantity.
        * @param qty {number} Quentity of tiles to be generated.
        */
        Tilemap.prototype.generateTiles = function (qty) {
            for (var i = 0; i < qty; i++) {
                this.tiles.push(new Phaser.Tile(this.game, this, i, this.currentLayer.tileWidth, this.currentLayer.tileHeight));
            }
        };

        Object.defineProperty(Tilemap.prototype, "widthInPixels", {
            get: function () {
                return this.currentLayer.widthInPixels;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Tilemap.prototype, "heightInPixels", {
            get: function () {
                return this.currentLayer.heightInPixels;
            },
            enumerable: true,
            configurable: true
        });

        //  Tile Collision
        /**
        * Set callback to be called when this tilemap collides.
        * @param context {object} Callback will be called with this context.
        * @param callback {function} Callback function.
        */
        Tilemap.prototype.setCollisionCallback = function (context, callback) {
            this.collisionCallbackContext = context;
            this.collisionCallback = callback;
        };

        /**
        * Set collision configs of tiles in a range index.
        * @param start {number} First index of tiles.
        * @param end {number} Last index of tiles.
        * @param collision {number} Bit field of flags. (see Tile.allowCollision)
        * @param resetCollisions {boolean} Reset collision flags before set.
        * @param separateX {boolean} Enable seprate at x-axis.
        * @param separateY {boolean} Enable seprate at y-axis.
        */
        Tilemap.prototype.setCollisionRange = function (start, end, collision, resetCollisions, separateX, separateY) {
            if (typeof collision === "undefined") { collision = Phaser.Types.ANY; }
            if (typeof resetCollisions === "undefined") { resetCollisions = false; }
            if (typeof separateX === "undefined") { separateX = true; }
            if (typeof separateY === "undefined") { separateY = true; }
            for (var i = start; i < end; i++) {
                this.tiles[i].setCollision(collision, resetCollisions, separateX, separateY);
            }
        };

        /**
        * Set collision configs of tiles with given index.
        * @param values {number[]} Index array which contains all tile indexes. The tiles with those indexes will be setup with rest parameters.
        * @param collision {number} Bit field of flags. (see Tile.allowCollision)
        * @param resetCollisions {boolean} Reset collision flags before set.
        * @param separateX {boolean} Enable seprate at x-axis.
        * @param separateY {boolean} Enable seprate at y-axis.
        */
        Tilemap.prototype.setCollisionByIndex = function (values, collision, resetCollisions, separateX, separateY) {
            if (typeof collision === "undefined") { collision = Phaser.Types.ANY; }
            if (typeof resetCollisions === "undefined") { resetCollisions = false; }
            if (typeof separateX === "undefined") { separateX = true; }
            if (typeof separateY === "undefined") { separateY = true; }
            for (var i = 0; i < values.length; i++) {
                this.tiles[values[i]].setCollision(collision, resetCollisions, separateX, separateY);
            }
        };

        //  Tile Management
        /**
        * Get the tile by its index.
        * @param value {number} Index of the tile you want to get.
        * @return {Tile} The tile with given index.
        */
        Tilemap.prototype.getTileByIndex = function (value) {
            if (this.tiles[value]) {
                return this.tiles[value];
            }

            return null;
        };

        /**
        * Get the tile located at specific position and layer.
        * @param x {number} X position of this tile located.
        * @param y {number} Y position of this tile located.
        * @param [layer] {number} layer of this tile located.
        * @return {Tile} The tile with specific properties.
        */
        Tilemap.prototype.getTile = function (x, y, layer) {
            if (typeof layer === "undefined") { layer = this.currentLayer.ID; }
            return this.tiles[this.layers[layer].getTileIndex(x, y)];
        };

        /**
        * Get the tile located at specific position (in world coordinate) and layer. (thus you give a position of a point which is within the tile)
        * @param x {number} X position of the point in target tile.
        * @param x {number} Y position of the point in target tile.
        * @param [layer] {number} layer of this tile located.
        * @return {Tile} The tile with specific properties.
        */
        Tilemap.prototype.getTileFromWorldXY = function (x, y, layer) {
            if (typeof layer === "undefined") { layer = this.currentLayer.ID; }
            return this.tiles[this.layers[layer].getTileFromWorldXY(x, y)];
        };

        /**
        * Gets the tile underneath the Input.x/y position
        * @param layer The layer to check, defaults to 0
        * @returns {Tile}
        */
        Tilemap.prototype.getTileFromInputXY = function (layer) {
            if (typeof layer === "undefined") { layer = this.currentLayer.ID; }
            return this.tiles[this.layers[layer].getTileFromWorldXY(this.game.input.worldX, this.game.input.worldY)];
        };

        /**
        * Get tiles overlaps the given object.
        * @param object {GameObject} Tiles you want to get that overlaps this.
        * @return {array} Array with tiles information. (Each contains x, y and the tile.)
        */
        Tilemap.prototype.getTileOverlaps = function (object) {
            return this.currentLayer.getTileOverlaps(object);
        };

        //  COLLIDE
        /**
        * Check whether this tilemap collides with the given game object or group of objects.
        * @param objectOrGroup {function} Target object of group you want to check.
        * @param callback {function} This is called if objectOrGroup collides the tilemap.
        * @param context {object} Callback will be called with this context.
        * @return {boolean} Return true if this collides with given object, otherwise return false.
        */
        Tilemap.prototype.collide = function (objectOrGroup, callback, context) {
            if (typeof objectOrGroup === "undefined") { objectOrGroup = null; }
            if (typeof callback === "undefined") { callback = null; }
            if (typeof context === "undefined") { context = null; }
            if (callback !== null && context !== null) {
                this.collisionCallback = callback;
                this.collisionCallbackContext = context;
            }

            if (objectOrGroup == null) {
                objectOrGroup = this.game.world.group;
            }

            if (objectOrGroup.isGroup == false) {
                this.collideGameObject(objectOrGroup);
            } else {
                objectOrGroup.forEachAlive(this, this.collideGameObject, true);
            }
        };

        /**
        * Check whether this tilemap collides with the given game object.
        * @param object {GameObject} Target object you want to check.
        * @return {boolean} Return true if this collides with given object, otherwise return false.
        */
        Tilemap.prototype.collideGameObject = function (object) {
            if (object.body.type == Phaser.Types.BODY_DYNAMIC && object.exists == true && object.body.allowCollisions != Phaser.Types.NONE) {
                this._tempCollisionData = this.collisionLayer.getTileOverlaps(object);

                if (this.collisionCallback !== null && this._tempCollisionData.length > 0) {
                    this.collisionCallback.call(this.collisionCallbackContext, object, this._tempCollisionData);
                }

                return true;
            } else {
                return false;
            }
        };

        /**
        * Set a tile to a specific layer.
        * @param x {number} X position of this tile.
        * @param y {number} Y position of this tile.
        * @param index {number} The index of this tile type in the core map data.
        * @param [layer] {number} which layer you want to set the tile to.
        */
        Tilemap.prototype.putTile = function (x, y, index, layer) {
            if (typeof layer === "undefined") { layer = this.currentLayer.ID; }
            this.layers[layer].putTile(x, y, index);
        };

        Tilemap.prototype.destroy = function () {
            this.texture = null;
            this.transform = null;

            this.tiles.length = 0;
            this.layers.length = 0;
        };
        Tilemap.FORMAT_CSV = 0;

        Tilemap.FORMAT_TILED_JSON = 1;
        return Tilemap;
    })();
    Phaser.Tilemap = Tilemap;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - TilemapLayer
*
* A Tilemap Layer. Tiled format maps can have multiple overlapping layers.
*/
var Phaser;
(function (Phaser) {
    var TilemapLayer = (function () {
        /**
        * TilemapLayer constructor
        * Create a new <code>TilemapLayer</code>.
        *
        * @param parent {Tilemap} The tilemap that contains this layer.
        * @param id {number} The ID of this layer within the Tilemap array.
        * @param key {string} Asset key for this map.
        * @param mapFormat {number} Format of this map data, available: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
        * @param name {string} Name of this layer, so you can get this layer by its name.
        * @param tileWidth {number} Width of tiles in this map.
        * @param tileHeight {number} Height of tiles in this map.
        */
        function TilemapLayer(parent, id, key, mapFormat, name, tileWidth, tileHeight) {
            /**
            * Controls whether update() and draw() are automatically called.
            * @type {boolean}
            */
            this.exists = true;
            /**
            * Controls whether draw() are automatically called.
            * @type {boolean}
            */
            this.visible = true;
            /**
            * How many tiles in each row.
            * Read-only variable, do NOT recommend changing after the map is loaded!
            * @type {number}
            */
            this.widthInTiles = 0;
            /**
            * How many tiles in each column.
            * Read-only variable, do NOT recommend changing after the map is loaded!
            * @type {number}
            */
            this.heightInTiles = 0;
            /**
            * Read-only variable, do NOT recommend changing after the map is loaded!
            * @type {number}
            */
            this.widthInPixels = 0;
            /**
            * Read-only variable, do NOT recommend changing after the map is loaded!
            * @type {number}
            */
            this.heightInPixels = 0;
            /**
            * Distance between REAL tiles to the tileset texture bound.
            * @type {number}
            */
            this.tileMargin = 0;
            /**
            * Distance between every 2 neighbor tile in the tileset texture.
            * @type {number}
            */
            this.tileSpacing = 0;
            this.parent = parent;
            this.game = parent.game;

            this.ID = id;
            this.name = name;
            this.mapFormat = mapFormat;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.boundsInTiles = new Phaser.Rectangle();

            this.texture = new Phaser.Display.Texture(this);
            this.transform = new Phaser.Components.TransformManager(this);

            if (key !== null) {
                this.texture.loadImage(key, false);
            } else {
                this.texture.opaque = true;
            }

            //  Handy proxies
            this.alpha = this.texture.alpha;

            this.mapData = [];
            this._tempTileBlock = [];
        }
        /**
        * Set a specific tile with its x and y in tiles.
        * @param x {number} X position of this tile in world coordinates.
        * @param y {number} Y position of this tile in world coordinates.
        * @param index {number} The index of this tile type in the core map data.
        */
        TilemapLayer.prototype.putTileWorldXY = function (x, y, index) {
            x = this.game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this.game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;

            if (y >= 0 && y < this.mapData.length) {
                if (x >= 0 && x < this.mapData[y].length) {
                    this.mapData[y][x] = index;
                }
            }
        };

        /**
        * Set a specific tile with its x and y in tiles.
        * @param x {number} X position of this tile.
        * @param y {number} Y position of this tile.
        * @param index {number} The index of this tile type in the core map data.
        */
        TilemapLayer.prototype.putTile = function (x, y, index) {
            if (y >= 0 && y < this.mapData.length) {
                if (x >= 0 && x < this.mapData[y].length) {
                    this.mapData[y][x] = index;
                }
            }
        };

        /**
        * Swap tiles with 2 kinds of indexes.
        * @param tileA {number} First tile index.
        * @param tileB {number} Second tile index.
        * @param [x] {number} specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
        * @param [y] {number} specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
        * @param [width] {number} specify a Rectangle of tiles to operate. The width in tiles.
        * @param [height] {number} specify a Rectangle of tiles to operate. The height in tiles.
        */
        TilemapLayer.prototype.swapTile = function (tileA, tileB, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);

            for (var r = 0; r < this._tempTileBlock.length; r++) {
                if (this._tempTileBlock[r].tile.index == tileA) {
                    this._tempTileBlock[r].newIndex = true;
                }

                if (this._tempTileBlock[r].tile.index == tileB) {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileA;
                }
            }

            for (var r = 0; r < this._tempTileBlock.length; r++) {
                if (this._tempTileBlock[r].newIndex == true) {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileB;
                }
            }
        };

        /**
        * Fill a tile block with a specific tile index.
        * @param index {number} Index of tiles you want to fill with.
        * @param [x] {number} x position (in tiles) of block's left-top corner.
        * @param [y] {number} y position (in tiles) of block's left-top corner.
        * @param [width] {number} width of block.
        * @param [height] {number} height of block.
        */
        TilemapLayer.prototype.fillTile = function (index, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);

            for (var r = 0; r < this._tempTileBlock.length; r++) {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = index;
            }
        };

        /**
        * Set random tiles to a specific tile block.
        * @param tiles {number[]} Tiles with indexes in this array will be randomly set to the given block.
        * @param [x] {number} x position (in tiles) of block's left-top corner.
        * @param [y] {number} y position (in tiles) of block's left-top corner.
        * @param [width] {number} width of block.
        * @param [height] {number} height of block.
        */
        TilemapLayer.prototype.randomiseTiles = function (tiles, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);

            for (var r = 0; r < this._tempTileBlock.length; r++) {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = this.game.math.getRandom(tiles);
            }
        };

        /**
        * Replace one kind of tiles to another kind.
        * @param tileA {number} Index of tiles you want to replace.
        * @param tileB {number} Index of tiles you want to set.
        * @param [x] {number} x position (in tiles) of block's left-top corner.
        * @param [y] {number} y position (in tiles) of block's left-top corner.
        * @param [width] {number} width of block.
        * @param [height] {number} height of block.
        */
        TilemapLayer.prototype.replaceTile = function (tileA, tileB, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);

            for (var r = 0; r < this._tempTileBlock.length; r++) {
                if (this._tempTileBlock[r].tile.index == tileA) {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileB;
                }
            }
        };

        /**
        * Get a tile block with specific position and size.(both are in tiles)
        * @param x {number} X position of block's left-top corner.
        * @param y {number} Y position of block's left-top corner.
        * @param width {number} Width of block.
        * @param height {number} Height of block.
        */
        TilemapLayer.prototype.getTileBlock = function (x, y, width, height) {
            var output = [];

            this.getTempBlock(x, y, width, height);

            for (var r = 0; r < this._tempTileBlock.length; r++) {
                output.push({ x: this._tempTileBlock[r].x, y: this._tempTileBlock[r].y, tile: this._tempTileBlock[r].tile });
            }

            return output;
        };

        /**
        * Get a tile with specific position (in world coordinate). (thus you give a position of a point which is within the tile)
        * @param x {number} X position of the point in target tile.
        * @param x {number} Y position of the point in target tile.
        */
        TilemapLayer.prototype.getTileFromWorldXY = function (x, y) {
            x = this.game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this.game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;

            return this.getTileIndex(x, y);
        };

        /**
        * Get tiles overlaps the given object.
        * @param object {GameObject} Tiles you want to get that overlaps this.
        * @return {array} Array with tiles informations. (Each contains x, y and the tile.)
        */
        TilemapLayer.prototype.getTileOverlaps = function (object) {
            if (object.body.bounds.x < 0 || object.body.bounds.x > this.widthInPixels || object.body.bounds.y < 0 || object.body.bounds.bottom > this.heightInPixels) {
                return;
            }

            //  What tiles do we need to check against?
            this._tempTileX = this.game.math.snapToFloor(object.body.bounds.x, this.tileWidth) / this.tileWidth;
            this._tempTileY = this.game.math.snapToFloor(object.body.bounds.y, this.tileHeight) / this.tileHeight;
            this._tempTileW = (this.game.math.snapToCeil(object.body.bounds.width, this.tileWidth) + this.tileWidth) / this.tileWidth;
            this._tempTileH = (this.game.math.snapToCeil(object.body.bounds.height, this.tileHeight) + this.tileHeight) / this.tileHeight;

            //  Loop through the tiles we've got and check overlaps accordingly (the results are stored in this._tempTileBlock)
            this._tempBlockResults = [];
            this.getTempBlock(this._tempTileX, this._tempTileY, this._tempTileW, this._tempTileH, true);

            /*
            for (var r = 0; r < this._tempTileBlock.length; r++)
            {
            if (this.game.world.physics.separateTile(object, this._tempTileBlock[r].x * this.tileWidth, this._tempTileBlock[r].y * this.tileHeight, this.tileWidth, this.tileHeight, this._tempTileBlock[r].tile.mass, this._tempTileBlock[r].tile.collideLeft, this._tempTileBlock[r].tile.collideRight, this._tempTileBlock[r].tile.collideUp, this._tempTileBlock[r].tile.collideDown, this._tempTileBlock[r].tile.separateX, this._tempTileBlock[r].tile.separateY) == true)
            {
            this._tempBlockResults.push({ x: this._tempTileBlock[r].x, y: this._tempTileBlock[r].y, tile: this._tempTileBlock[r].tile });
            }
            }
            */
            return this._tempBlockResults;
        };

        /**
        * Get a tile block with its position and size. (This method does not return, it'll set result to _tempTileBlock)
        * @param x {number} X position of block's left-top corner.
        * @param y {number} Y position of block's left-top corner.
        * @param width {number} Width of block.
        * @param height {number} Height of block.
        * @param collisionOnly {boolean} Whethor or not ONLY return tiles which will collide (its allowCollisions value is not Collision.NONE).
        */
        TilemapLayer.prototype.getTempBlock = function (x, y, width, height, collisionOnly) {
            if (typeof collisionOnly === "undefined") { collisionOnly = false; }
            if (x < 0) {
                x = 0;
            }

            if (y < 0) {
                y = 0;
            }

            if (width > this.widthInTiles) {
                width = this.widthInTiles;
            }

            if (height > this.heightInTiles) {
                height = this.heightInTiles;
            }

            this._tempTileBlock = [];

            for (var ty = y; ty < y + height; ty++) {
                for (var tx = x; tx < x + width; tx++) {
                    if (collisionOnly) {
                        if (this.mapData[ty] && this.mapData[ty][tx] && this.parent.tiles[this.mapData[ty][tx]].allowCollisions != Phaser.Types.NONE) {
                            this._tempTileBlock.push({ x: tx, y: ty, tile: this.parent.tiles[this.mapData[ty][tx]] });
                        }
                    } else {
                        if (this.mapData[ty] && this.mapData[ty][tx]) {
                            this._tempTileBlock.push({ x: tx, y: ty, tile: this.parent.tiles[this.mapData[ty][tx]] });
                        }
                    }
                }
            }
        };

        /**
        * Get the tile index of specific position (in tiles).
        * @param x {number} X position of the tile.
        * @param y {number} Y position of the tile.
        * @return {number} Index of the tile at that position. Return null if there isn't a tile there.
        */
        TilemapLayer.prototype.getTileIndex = function (x, y) {
            if (y >= 0 && y < this.mapData.length) {
                if (x >= 0 && x < this.mapData[y].length) {
                    return this.mapData[y][x];
                }
            }

            return null;
        };

        /**
        * Add a column of tiles into the layer.
        * @param column {string[]/number[]} An array of tile indexes to be added.
        */
        TilemapLayer.prototype.addColumn = function (column) {
            var data = [];

            for (var c = 0; c < column.length; c++) {
                data[c] = parseInt(column[c]);
            }

            if (this.widthInTiles == 0) {
                this.widthInTiles = data.length;
                this.widthInPixels = this.widthInTiles * this.tileWidth;
            }

            this.mapData.push(data);

            this.heightInTiles++;
            this.heightInPixels += this.tileHeight;
        };

        /**
        * Update boundsInTiles with widthInTiles and heightInTiles.
        */
        TilemapLayer.prototype.updateBounds = function () {
            this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);
        };

        /**
        * Parse tile offsets from map data.
        * @return {number} length of tileOffsets array.
        */
        TilemapLayer.prototype.parseTileOffsets = function () {
            this.tileOffsets = [];

            var i = 0;

            if (this.mapFormat == Phaser.Tilemap.FORMAT_TILED_JSON) {
                //  For some reason Tiled counts from 1 not 0
                this.tileOffsets[0] = null;
                i = 1;
            }

            for (var ty = this.tileMargin; ty < this.texture.height; ty += (this.tileHeight + this.tileSpacing)) {
                for (var tx = this.tileMargin; tx < this.texture.width; tx += (this.tileWidth + this.tileSpacing)) {
                    this.tileOffsets[i] = { x: tx, y: ty };
                    i++;
                }
            }

            return this.tileOffsets.length;
        };
        return TilemapLayer;
    })();
    Phaser.TilemapLayer = TilemapLayer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../../_definitions.ts" />
    /**
    * Phaser - ArcadePhysics - Body
    */
    (function (Physics) {
        var Body = (function () {
            function Body(sprite, type) {
                this.angularVelocity = 0;
                this.angularAcceleration = 0;
                this.angularDrag = 0;
                this.maxAngular = 10000;
                this.mass = 1;
                this._width = 0;
                this._height = 0;
                this.sprite = sprite;
                this.game = sprite.game;
                this.type = type;

                //  Fixture properties
                //  Will extend into its own class at a later date - can move the fixture defs there and add shape support, but this will do for 1.0 release
                this.bounds = new Phaser.Rectangle();

                this._width = sprite.width;
                this._height = sprite.height;

                //  Body properties
                //this.gravity = Vec2Utils.clone(ArcadePhysics.gravity);
                //this.bounce = Vec2Utils.clone(ArcadePhysics.bounce);
                this.velocity = new Phaser.Vec2();
                this.acceleration = new Phaser.Vec2();

                //this.drag = Vec2Utils.clone(ArcadePhysics.drag);
                this.maxVelocity = new Phaser.Vec2(10000, 10000);

                this.angularVelocity = 0;
                this.angularAcceleration = 0;
                this.angularDrag = 0;

                this.touching = Phaser.Types.NONE;
                this.wasTouching = Phaser.Types.NONE;
                this.allowCollisions = Phaser.Types.ANY;

                this.position = new Phaser.Vec2(sprite.x + this.bounds.halfWidth, sprite.y + this.bounds.halfHeight);
                this.oldPosition = new Phaser.Vec2(sprite.x + this.bounds.halfWidth, sprite.y + this.bounds.halfHeight);
                this.offset = new Phaser.Vec2();
            }
            Object.defineProperty(Body.prototype, "x", {
                get: function () {
                    return this.sprite.x + this.offset.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "y", {
                get: function () {
                    return this.sprite.y + this.offset.y;
                },
                enumerable: true,
                configurable: true
            });



            Object.defineProperty(Body.prototype, "width", {
                get: function () {
                    return this._width * this.sprite.transform.scale.x;
                },
                set: function (value) {
                    this._width = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "height", {
                get: function () {
                    return this._height * this.sprite.transform.scale.y;
                },
                set: function (value) {
                    this._height = value;
                },
                enumerable: true,
                configurable: true
            });

            Body.prototype.preUpdate = function () {
                this.oldPosition.copyFrom(this.position);

                this.bounds.x = this.x;
                this.bounds.y = this.y;
                this.bounds.width = this.width;
                this.bounds.height = this.height;
            };

            //  Shall we do this? Or just update the values directly in the separate functions? But then the bounds will be out of sync - as long as
            //  the bounds are updated and used in calculations then we can do one final sprite movement here I guess?
            Body.prototype.postUpdate = function () {
                if (this.type !== Phaser.Types.BODY_DISABLED) {
                    //this.game.world.physics.updateMotion(this);
                    this.wasTouching = this.touching;
                    this.touching = Phaser.Types.NONE;
                }

                this.position.setTo(this.x, this.y);
            };

            Object.defineProperty(Body.prototype, "hullWidth", {
                get: function () {
                    if (this.deltaX > 0) {
                        return this.bounds.width + this.deltaX;
                    } else {
                        return this.bounds.width - this.deltaX;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "hullHeight", {
                get: function () {
                    if (this.deltaY > 0) {
                        return this.bounds.height + this.deltaY;
                    } else {
                        return this.bounds.height - this.deltaY;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "hullX", {
                get: function () {
                    if (this.position.x < this.oldPosition.x) {
                        return this.position.x;
                    } else {
                        return this.oldPosition.x;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "hullY", {
                get: function () {
                    if (this.position.y < this.oldPosition.y) {
                        return this.position.y;
                    } else {
                        return this.oldPosition.y;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "deltaXAbs", {
                get: function () {
                    return (this.deltaX > 0 ? this.deltaX : -this.deltaX);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "deltaYAbs", {
                get: function () {
                    return (this.deltaY > 0 ? this.deltaY : -this.deltaY);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "deltaX", {
                get: function () {
                    return this.position.x - this.oldPosition.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Body.prototype, "deltaY", {
                get: function () {
                    return this.position.y - this.oldPosition.y;
                },
                enumerable: true,
                configurable: true
            });

            //  MOVE THESE TO A UTIL
            Body.prototype.render = function (context) {
                context.beginPath();
                context.strokeStyle = 'rgb(0,255,0)';
                context.strokeRect(this.position.x - this.bounds.halfWidth, this.position.y - this.bounds.halfHeight, this.bounds.width, this.bounds.height);
                context.stroke();
                context.closePath();

                //  center point
                context.fillStyle = 'rgb(0,255,0)';
                context.fillRect(this.position.x, this.position.y, 2, 2);

                if (this.touching & Phaser.Types.LEFT) {
                    context.beginPath();
                    context.strokeStyle = 'rgb(255,0,0)';
                    context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                    context.lineTo(this.position.x - this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                    context.stroke();
                    context.closePath();
                }
                if (this.touching & Phaser.Types.RIGHT) {
                    context.beginPath();
                    context.strokeStyle = 'rgb(255,0,0)';
                    context.moveTo(this.position.x + this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                    context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                    context.stroke();
                    context.closePath();
                }

                if (this.touching & Phaser.Types.UP) {
                    context.beginPath();
                    context.strokeStyle = 'rgb(255,0,0)';
                    context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                    context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y - this.bounds.halfHeight);
                    context.stroke();
                    context.closePath();
                }
                if (this.touching & Phaser.Types.DOWN) {
                    context.beginPath();
                    context.strokeStyle = 'rgb(255,0,0)';
                    context.moveTo(this.position.x - this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                    context.lineTo(this.position.x + this.bounds.halfWidth, this.position.y + this.bounds.halfHeight);
                    context.stroke();
                    context.closePath();
                }
            };

            /**
            * Render debug infos. (including name, bounds info, position and some other properties)
            * @param x {number} X position of the debug info to be rendered.
            * @param y {number} Y position of the debug info to be rendered.
            * @param [color] {number} color of the debug info to be rendered. (format is css color string)
            */
            Body.prototype.renderDebugInfo = function (x, y, color) {
                if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
                this.sprite.texture.context.fillStyle = color;
                this.sprite.texture.context.fillText('Sprite: (' + this.sprite.width + ' x ' + this.sprite.height + ')', x, y);

                //this.sprite.texture.context.fillText('x: ' + this._sprite.frameBounds.x.toFixed(1) + ' y: ' + this._sprite.frameBounds.y.toFixed(1) + ' rotation: ' + this._sprite.rotation.toFixed(1), x, y + 14);
                this.sprite.texture.context.fillText('x: ' + this.bounds.x.toFixed(1) + ' y: ' + this.bounds.y.toFixed(1) + ' rotation: ' + this.sprite.transform.rotation.toFixed(0), x, y + 14);
                this.sprite.texture.context.fillText('vx: ' + this.velocity.x.toFixed(1) + ' vy: ' + this.velocity.y.toFixed(1), x, y + 28);
                this.sprite.texture.context.fillText('acx: ' + this.acceleration.x.toFixed(1) + ' acy: ' + this.acceleration.y.toFixed(1), x, y + 42);
                this.sprite.texture.context.fillText('angVx: ' + this.angularVelocity.toFixed(1) + ' angAc: ' + this.angularAcceleration.toFixed(1), x, y + 56);
            };
            return Body;
        })();
        Physics.Body = Body;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Components - Events
    *
    * Signals that are dispatched by the Sprite and its various components
    */
    (function (Components) {
        var Events = (function () {
            /**
            * The Events component is a collection of events fired by the parent game object and its components.
            * @param parent The game object using this Input component
            */
            function Events(parent) {
                this.game = parent.game;
                this._parent = parent;

                this.onAddedToGroup = new Phaser.Signal();
                this.onRemovedFromGroup = new Phaser.Signal();
                this.onKilled = new Phaser.Signal();
                this.onRevived = new Phaser.Signal();
                this.onOutOfBounds = new Phaser.Signal();
            }
            return Events;
        })();
        Components.Events = Events;
    })(Phaser.Components || (Phaser.Components = {}));
    var Components = Phaser.Components;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - Sprite
*/
var Phaser;
(function (Phaser) {
    var Sprite = (function () {
        /**
        * Create a new <code>Sprite</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param [x] {number} the initial x position of the sprite.
        * @param [y] {number} the initial y position of the sprite.
        * @param [key] {string} Key of the graphic you want to load for this sprite.
        */
        function Sprite(game, x, y, key, frame) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof key === "undefined") { key = null; }
            if (typeof frame === "undefined") { frame = null; }
            /**
            * A boolean representing if the Sprite has been modified in any way via a scale, rotate, flip or skew.
            */
            this.modified = false;
            /**
            * x value of the object.
            */
            this.x = 0;
            /**
            * y value of the object.
            */
            this.y = 0;
            /**
            * z order value of the object.
            */
            this.z = -1;
            /**
            * Render iteration counter
            */
            this.renderOrderID = 0;
            this.game = game;
            this.type = Phaser.Types.SPRITE;

            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;

            this.x = x;
            this.y = y;
            this.z = -1;
            this.group = null;
            this.name = '';

            this.events = new Phaser.Components.Events(this);
            this.animations = new Phaser.Components.AnimationManager(this);
            this.input = new Phaser.Components.InputHandler(this);
            this.texture = new Phaser.Display.Texture(this);
            this.transform = new Phaser.Components.TransformManager(this);

            if (key !== null) {
                this.texture.loadImage(key, false);
            } else {
                this.texture.opaque = true;
            }

            if (frame !== null) {
                if (typeof frame == 'string') {
                    this.frameName = frame;
                } else {
                    this.frame = frame;
                }
            }

            this.worldView = new Phaser.Rectangle(x, y, this.width, this.height);
            this.cameraView = new Phaser.Rectangle(x, y, this.width, this.height);

            this.transform.setCache();

            this.outOfBounds = false;
            this.outOfBoundsAction = Phaser.Types.OUT_OF_BOUNDS_PERSIST;

            //  Handy proxies
            this.scale = this.transform.scale;
            this.alpha = this.texture.alpha;
            this.origin = this.transform.origin;
            this.crop = this.texture.crop;
        }
        Object.defineProperty(Sprite.prototype, "rotation", {
            get: /**
            * The rotation of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
            */
            function () {
                return this.transform.rotation;
            },
            set: /**
            * Set the rotation of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
            * The value is automatically wrapped to be between 0 and 360.
            */
            function (value) {
                this.transform.rotation = this.game.math.wrap(value, 360, 0);

                if (this.body) {
                    //this.body.angle = this.game.math.degreesToRadians(this.game.math.wrap(value, 360, 0));
                }
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Brings this Sprite to the top of its current Group, if set.
        */
        Sprite.prototype.bringToTop = function () {
            if (this.group) {
                //this.group.bringToTop(this);
            }
        };


        Object.defineProperty(Sprite.prototype, "alpha", {
            get: /**
            * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
            */
            function () {
                return this.texture.alpha;
            },
            set: /**
            * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
            */
            function (value) {
                this.texture.alpha = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Sprite.prototype, "frame", {
            get: /**
            * Get the animation frame number.
            */
            function () {
                return this.animations.frame;
            },
            set: /**
            * Set the animation frame by frame number.
            */
            function (value) {
                this.animations.frame = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Sprite.prototype, "frameName", {
            get: /**
            * Get the animation frame name.
            */
            function () {
                return this.animations.frameName;
            },
            set: /**
            * Set the animation frame by frame name.
            */
            function (value) {
                this.animations.frameName = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Sprite.prototype, "width", {
            get: function () {
                return this.texture.width * this.transform.scale.x;
            },
            set: function (value) {
                this.transform.scale.x = value / this.texture.width;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Sprite.prototype, "height", {
            get: function () {
                return this.texture.height * this.transform.scale.y;
            },
            set: function (value) {
                this.transform.scale.y = value / this.texture.height;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Pre-update is called right before update() on each object in the game loop.
        */
        Sprite.prototype.preUpdate = function () {
            this.transform.update();

            if (this.transform.scrollFactor.x != 1 && this.transform.scrollFactor.x != 0) {
                this.worldView.x = (this.x * this.transform.scrollFactor.x) - (this.width * this.transform.origin.x);
            } else {
                this.worldView.x = this.x - (this.width * this.transform.origin.x);
            }

            if (this.transform.scrollFactor.y != 1 && this.transform.scrollFactor.y != 0) {
                this.worldView.y = (this.y * this.transform.scrollFactor.y) - (this.height * this.transform.origin.y);
            } else {
                this.worldView.y = this.y - (this.height * this.transform.origin.y);
            }

            this.worldView.width = this.width;
            this.worldView.height = this.height;

            if (this.modified == false && (!this.transform.scale.equals(1) || !this.transform.skew.equals(0) || this.transform.rotation != 0 || this.transform.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY)) {
                this.modified = true;
            }
        };

        /**
        * Override this function to update your sprites position and appearance.
        */
        Sprite.prototype.update = function () {
        };

        /**
        * Automatically called after update() by the game loop for all 'alive' objects.
        */
        Sprite.prototype.postUpdate = function () {
            this.animations.update();

            this.checkBounds();

            if (this.modified == true && this.transform.scale.equals(1) && this.transform.skew.equals(0) && this.transform.rotation == 0 && this.transform.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false) {
                this.modified = false;
            }
        };

        Sprite.prototype.checkBounds = function () {
            if (Phaser.RectangleUtils.intersects(this.worldView, this.game.world.bounds)) {
                this.outOfBounds = false;
            } else {
                if (this.outOfBounds == false) {
                    this.events.onOutOfBounds.dispatch(this);
                }

                this.outOfBounds = true;

                if (this.outOfBoundsAction == Phaser.Types.OUT_OF_BOUNDS_KILL) {
                    this.kill();
                } else if (this.outOfBoundsAction == Phaser.Types.OUT_OF_BOUNDS_DESTROY) {
                    this.destroy();
                }
            }
        };

        /**
        * Clean up memory.
        */
        Sprite.prototype.destroy = function () {
            this.input.destroy();
        };

        /**
        * Handy for "killing" game objects.
        * Default behavior is to flag them as nonexistent AND dead.
        * However, if you want the "corpse" to remain in the game,
        * like to animate an effect or whatever, you should override this,
        * setting only alive to false, and leaving exists true.
        */
        Sprite.prototype.kill = function (removeFromGroup) {
            if (typeof removeFromGroup === "undefined") { removeFromGroup = false; }
            this.alive = false;
            this.exists = false;

            if (removeFromGroup && this.group) {
                //this.group.remove(this);
            }

            this.events.onKilled.dispatch(this);
        };

        /**
        * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
        * In practice, this is most often called by <code>Object.reset()</code>.
        */
        Sprite.prototype.revive = function () {
            this.alive = true;
            this.exists = true;

            this.events.onRevived.dispatch(this);
        };
        return Sprite;
    })();
    Phaser.Sprite = Sprite;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Components - TransformManager
    */
    (function (Components) {
        var TransformManager = (function () {
            /**
            * Creates a new TransformManager component
            * @param parent The game object using this transform
            */
            function TransformManager(parent) {
                this._dirty = false;
                /**
                * This value is added to the rotation of the object.
                * For example if you had a texture drawn facing straight up then you could set
                * rotationOffset to 90 and it would correspond correctly with Phasers right-handed coordinate system.
                * @type {number}
                */
                this.rotationOffset = 0;
                /**
                * The rotation of the object in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
                */
                this.rotation = 0;
                this.game = parent.game;
                this.parent = parent;

                this.local = new Phaser.Mat3();

                this.scrollFactor = new Phaser.Vec2(1, 1);
                this.origin = new Phaser.Vec2();
                this.scale = new Phaser.Vec2(1, 1);
                this.skew = new Phaser.Vec2();

                this.center = new Phaser.Point();
                this.upperLeft = new Phaser.Point();
                this.upperRight = new Phaser.Point();
                this.bottomLeft = new Phaser.Point();
                this.bottomRight = new Phaser.Point();

                this._pos = new Phaser.Point();
                this._scale = new Phaser.Point();
                this._size = new Phaser.Point();
                this._halfSize = new Phaser.Point();
                this._offset = new Phaser.Point();
                this._origin = new Phaser.Point();
                this._sc = new Phaser.Point();
                this._scA = new Phaser.Point();
            }
            Object.defineProperty(TransformManager.prototype, "distance", {
                get: /**
                * The distance from the center of the transform to the rotation origin.
                */
                function () {
                    return this._distance;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "angleToCenter", {
                get: /**
                * The angle between the center of the transform to the rotation origin.
                */
                function () {
                    return this._angle;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "offsetX", {
                get: /**
                * The offset on the X axis of the origin That is the difference between the top left of the Sprite and the origin.x.
                * So if the origin.x is 0 the offsetX will be 0. If the origin.x is 0.5 then offsetX will be sprite width / 2, and so on.
                */
                function () {
                    return this._offset.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "offsetY", {
                get: /**
                * The offset on the Y axis of the origin
                */
                function () {
                    return this._offset.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "halfWidth", {
                get: /**
                * Half the width of the parent sprite, taking into consideration scaling
                */
                function () {
                    return this._halfSize.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "halfHeight", {
                get: /**
                * Half the height of the parent sprite, taking into consideration scaling
                */
                function () {
                    return this._halfSize.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "sin", {
                get: /**
                * The equivalent of Math.sin(rotation + rotationOffset)
                */
                function () {
                    return this._sc.x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TransformManager.prototype, "cos", {
                get: /**
                * The equivalent of Math.cos(rotation + rotationOffset)
                */
                function () {
                    return this._sc.y;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Moves the sprite so its center is located on the given x and y coordinates.
            * Doesn't change the origin of the sprite.
            */
            TransformManager.prototype.centerOn = function (x, y) {
                this.parent.x = x + (this.parent.x - this.center.x);
                this.parent.y = y + (this.parent.y - this.center.y);

                this.setCache();
            };

            /**
            * Populates the transform cache. Called by the parent object on creation.
            */
            TransformManager.prototype.setCache = function () {
                this._pos.x = this.parent.x;
                this._pos.y = this.parent.y;
                this._halfSize.x = this.parent.width / 2;
                this._halfSize.y = this.parent.height / 2;
                this._offset.x = this.origin.x * this.parent.width;
                this._offset.y = this.origin.y * this.parent.height;
                this._angle = Math.atan2(this.halfHeight - this._offset.x, this.halfWidth - this._offset.y);
                this._distance = Math.sqrt(((this._offset.x - this._halfSize.x) * (this._offset.x - this._halfSize.x)) + ((this._offset.y - this._halfSize.y) * (this._offset.y - this._halfSize.y)));
                this._size.x = this.parent.width;
                this._size.y = this.parent.height;
                this._origin.x = this.origin.x;
                this._origin.y = this.origin.y;
                this._sc.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                this._sc.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                this._scA.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);
                this._scA.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);
                this._prevRotation = this.rotation;

                if (this.parent.texture && this.parent.texture.renderRotation) {
                    this._sc.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                    this._sc.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                } else {
                    this._sc.x = 0;
                    this._sc.y = 1;
                }

                this.center.x = this.parent.x + this._distance * this._scA.y;
                this.center.y = this.parent.y + this._distance * this._scA.x;

                this.upperLeft.setTo(this.center.x - this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                this.upperRight.setTo(this.center.x + this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);
                this.bottomLeft.setTo(this.center.x - this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                this.bottomRight.setTo(this.center.x + this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);

                this._pos.x = this.parent.x;
                this._pos.y = this.parent.y;
            };

            /**
            * Updates the local transform matrix and the cache values if anything has changed in the parent.
            */
            TransformManager.prototype.update = function () {
                //  Check cache
                this._dirty = false;

                if (this.parent.width !== this._size.x || this.parent.height !== this._size.y || this.origin.x !== this._origin.x || this.origin.y !== this._origin.y) {
                    this._halfSize.x = this.parent.width / 2;
                    this._halfSize.y = this.parent.height / 2;
                    this._offset.x = this.origin.x * this.parent.width;
                    this._offset.y = this.origin.y * this.parent.height;
                    this._angle = Math.atan2(this.halfHeight - this._offset.y, this.halfWidth - this._offset.x);
                    this._distance = Math.sqrt(((this._offset.x - this._halfSize.x) * (this._offset.x - this._halfSize.x)) + ((this._offset.y - this._halfSize.y) * (this._offset.y - this._halfSize.y)));

                    //  Store
                    this._size.x = this.parent.width;
                    this._size.y = this.parent.height;
                    this._origin.x = this.origin.x;
                    this._origin.y = this.origin.y;
                    this._dirty = true;
                }

                if (this.rotation != this._prevRotation) {
                    this._sc.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                    this._sc.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                    this._scA.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);
                    this._scA.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);

                    if (this.parent.texture.renderRotation) {
                        this._sc.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                        this._sc.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                    } else {
                        this._sc.x = 0;
                        this._sc.y = 1;
                    }

                    //  Store
                    this._prevRotation = this.rotation;
                    this._dirty = true;
                }

                if (this._dirty || this.parent.x != this._pos.x || this.parent.y != this._pos.y) {
                    this.center.x = this.parent.x + this._distance * this._scA.y;
                    this.center.y = this.parent.y + this._distance * this._scA.x;

                    this.upperLeft.setTo(this.center.x - this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                    this.upperRight.setTo(this.center.x + this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);
                    this.bottomLeft.setTo(this.center.x - this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                    this.bottomRight.setTo(this.center.x + this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);

                    this._pos.x = this.parent.x;
                    this._pos.y = this.parent.y;
                }

                if (this.parent.texture.flippedX) {
                    this.local.data[0] = this._sc.y * -this.scale.x;
                    this.local.data[3] = (this._sc.x * -this.scale.x) + this.skew.x;
                } else {
                    this.local.data[0] = this._sc.y * this.scale.x;
                    this.local.data[3] = (this._sc.x * this.scale.x) + this.skew.x;
                }

                if (this.parent.texture.flippedY) {
                    this.local.data[4] = this._sc.y * -this.scale.y;
                    this.local.data[1] = -(this._sc.x * -this.scale.y) + this.skew.y;
                } else {
                    this.local.data[4] = this._sc.y * this.scale.y;
                    this.local.data[1] = -(this._sc.x * this.scale.y) + this.skew.y;
                }

                //  Translate
                this.local.data[2] = this.parent.x;
                this.local.data[5] = this.parent.y;
            };
            return TransformManager;
        })();
        Components.TransformManager = TransformManager;
    })(Phaser.Components || (Phaser.Components = {}));
    var Components = Phaser.Components;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - ScrollRegion
*
* Creates a scrolling region within a ScrollZone.
* It is scrolled via the scrollSpeed.x/y properties.
*/
var Phaser;
(function (Phaser) {
    var ScrollRegion = (function () {
        /**
        * ScrollRegion constructor
        * Create a new <code>ScrollRegion</code>.
        *
        * @param x {number} X position in world coordinate.
        * @param y {number} Y position in world coordinate.
        * @param width {number} Width of this object.
        * @param height {number} Height of this object.
        * @param speedX {number} X-axis scrolling speed.
        * @param speedY {number} Y-axis scrolling speed.
        */
        function ScrollRegion(x, y, width, height, speedX, speedY) {
            this._anchorWidth = 0;
            this._anchorHeight = 0;
            this._inverseWidth = 0;
            this._inverseHeight = 0;
            /**
            * Will this region be rendered? (default to true)
            * @type {boolean}
            */
            this.visible = true;
            //	Our seamless scrolling quads
            this._A = new Phaser.Rectangle(x, y, width, height);
            this._B = new Phaser.Rectangle(x, y, width, height);
            this._C = new Phaser.Rectangle(x, y, width, height);
            this._D = new Phaser.Rectangle(x, y, width, height);
            this._scroll = new Phaser.Vec2();
            this._bounds = new Phaser.Rectangle(x, y, width, height);
            this.scrollSpeed = new Phaser.Vec2(speedX, speedY);
        }
        /**
        * Update region scrolling with tick time.
        * @param delta {number} Elapsed time since last update.
        */
        ScrollRegion.prototype.update = function (delta) {
            this._scroll.x += this.scrollSpeed.x;
            this._scroll.y += this.scrollSpeed.y;

            if (this._scroll.x > this._bounds.right) {
                this._scroll.x = this._bounds.x;
            }

            if (this._scroll.x < this._bounds.x) {
                this._scroll.x = this._bounds.right;
            }

            if (this._scroll.y > this._bounds.bottom) {
                this._scroll.y = this._bounds.y;
            }

            if (this._scroll.y < this._bounds.y) {
                this._scroll.y = this._bounds.bottom;
            }

            //	Anchor Dimensions
            this._anchorWidth = (this._bounds.width - this._scroll.x) + this._bounds.x;
            this._anchorHeight = (this._bounds.height - this._scroll.y) + this._bounds.y;

            if (this._anchorWidth > this._bounds.width) {
                this._anchorWidth = this._bounds.width;
            }

            if (this._anchorHeight > this._bounds.height) {
                this._anchorHeight = this._bounds.height;
            }

            this._inverseWidth = this._bounds.width - this._anchorWidth;
            this._inverseHeight = this._bounds.height - this._anchorHeight;

            //	Rectangle A
            this._A.setTo(this._scroll.x, this._scroll.y, this._anchorWidth, this._anchorHeight);

            //	Rectangle B
            this._B.y = this._scroll.y;
            this._B.width = this._inverseWidth;
            this._B.height = this._anchorHeight;

            //	Rectangle C
            this._C.x = this._scroll.x;
            this._C.width = this._anchorWidth;
            this._C.height = this._inverseHeight;

            //	Rectangle D
            this._D.width = this._inverseWidth;
            this._D.height = this._inverseHeight;
        };

        /**
        * Render this region to specific context.
        * @param context {CanvasRenderingContext2D} Canvas context this region will be rendered to.
        * @param texture {object} The texture to be rendered.
        * @param dx {number} X position in world coordinate.
        * @param dy {number} Y position in world coordinate.
        * @param width {number} Width of this region to be rendered.
        * @param height {number} Height of this region to be rendered.
        */
        ScrollRegion.prototype.render = function (context, texture, dx, dy, dw, dh) {
            if (this.visible == false) {
                return;
            }

            //  dx/dy are the world coordinates to render the FULL ScrollZone into.
            //  This ScrollRegion may be smaller than that and offset from the dx/dy coordinates.
            this.crop(context, texture, this._A.x, this._A.y, this._A.width, this._A.height, dx, dy, dw, dh, 0, 0);
            this.crop(context, texture, this._B.x, this._B.y, this._B.width, this._B.height, dx, dy, dw, dh, this._A.width, 0);
            this.crop(context, texture, this._C.x, this._C.y, this._C.width, this._C.height, dx, dy, dw, dh, 0, this._A.height);
            this.crop(context, texture, this._D.x, this._D.y, this._D.width, this._D.height, dx, dy, dw, dh, this._C.width, this._A.height);
            //context.fillStyle = 'rgb(255,255,255)';
            //context.font = '18px Arial';
            //context.fillText('RectangleA: ' + this._A.toString(), 32, 450);
            //context.fillText('RectangleB: ' + this._B.toString(), 32, 480);
            //context.fillText('RectangleC: ' + this._C.toString(), 32, 510);
            //context.fillText('RectangleD: ' + this._D.toString(), 32, 540);
        };

        /**
        * Crop part of the texture and render it to the given context.
        * @param context {CanvasRenderingContext2D} Canvas context the texture will be rendered to.
        * @param texture {object} Texture to be rendered.
        * @param srcX {number} Target region top-left x coordinate in the texture.
        * @param srcX {number} Target region top-left y coordinate in the texture.
        * @param srcW {number} Target region width in the texture.
        * @param srcH {number} Target region height in the texture.
        * @param destX {number} Render region top-left x coordinate in the context.
        * @param destX {number} Render region top-left y coordinate in the context.
        * @param destW {number} Target region width in the context.
        * @param destH {number} Target region height in the context.
        * @param offsetX {number} X offset to the context.
        * @param offsetY {number} Y offset to the context.
        */
        ScrollRegion.prototype.crop = function (context, texture, srcX, srcY, srcW, srcH, destX, destY, destW, destH, offsetX, offsetY) {
            offsetX += destX;
            offsetY += destY;

            if (srcW > (destX + destW) - offsetX) {
                srcW = (destX + destW) - offsetX;
            }

            if (srcH > (destY + destH) - offsetY) {
                srcH = (destY + destH) - offsetY;
            }

            srcX = Math.floor(srcX);
            srcY = Math.floor(srcY);
            srcW = Math.floor(srcW);
            srcH = Math.floor(srcH);
            offsetX = Math.floor(offsetX + this._bounds.x);
            offsetY = Math.floor(offsetY + this._bounds.y);

            if (srcW > 0 && srcH > 0) {
                context.drawImage(texture, srcX, srcY, srcW, srcH, offsetX, offsetY, srcW, srcH);
            }
        };
        return ScrollRegion;
    })();
    Phaser.ScrollRegion = ScrollRegion;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - ScrollZone
*
* Creates a scrolling region of the given width and height from an image in the cache.
* The ScrollZone can be positioned anywhere in-world like a normal game object, re-act to physics, collision, etc.
* The image within it is scrolled via ScrollRegions and their scrollSpeed.x/y properties.
* If you create a scroll zone larger than the given source image it will create a DynamicTexture and fill it with a pattern of the source image.
*/
var Phaser;
(function (Phaser) {
    var ScrollZone = (function (_super) {
        __extends(ScrollZone, _super);
        /**
        * ScrollZone constructor
        * Create a new <code>ScrollZone</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param key {string} Asset key for image texture of this object.
        * @param x {number} X position in world coordinate.
        * @param y {number} Y position in world coordinate.
        * @param [width] {number} width of this object.
        * @param [height] {number} height of this object.
        */
        function ScrollZone(game, key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            _super.call(this, game, x, y, key);

            this.type = Phaser.Types.SCROLLZONE;

            this.regions = [];

            if (this.texture.loaded) {
                if (width > this.width || height > this.height) {
                    //  Create our repeating texture (as the source image wasn't large enough for the requested size)
                    this.createRepeatingTexture(width, height);
                    this.width = width;
                    this.height = height;
                }

                //  Create a default ScrollRegion at the requested size
                this.addRegion(0, 0, this.width, this.height);

                if ((width < this.width || height < this.height) && width !== 0 && height !== 0) {
                    this.width = width;
                    this.height = height;
                }
            }
        }
        /**
        * Add a new region to this zone.
        * @param x {number} X position of the new region.
        * @param y {number} Y position of the new region.
        * @param width {number} Width of the new region.
        * @param height {number} Height of the new region.
        * @param [speedX] {number} x-axis scrolling speed.
        * @param [speedY] {number} y-axis scrolling speed.
        * @return {ScrollRegion} The newly added region.
        */
        ScrollZone.prototype.addRegion = function (x, y, width, height, speedX, speedY) {
            if (typeof speedX === "undefined") { speedX = 0; }
            if (typeof speedY === "undefined") { speedY = 0; }
            if (x > this.width || y > this.height || x < 0 || y < 0 || (x + width) > this.width || (y + height) > this.height) {
                throw Error('Invalid ScrollRegion defined. Cannot be larger than parent ScrollZone');
                return null;
            }

            this.currentRegion = new Phaser.ScrollRegion(x, y, width, height, speedX, speedY);

            this.regions.push(this.currentRegion);

            return this.currentRegion;
        };

        /**
        * Set scrolling speed of current region.
        * @param x {number} X speed of current region.
        * @param y {number} Y speed of current region.
        */
        ScrollZone.prototype.setSpeed = function (x, y) {
            if (this.currentRegion) {
                this.currentRegion.scrollSpeed.setTo(x, y);
            }

            return this;
        };

        /**
        * Update regions.
        */
        ScrollZone.prototype.update = function () {
            for (var i = 0; i < this.regions.length; i++) {
                this.regions[i].update(this.game.time.delta);
            }
        };

        /**
        * Create repeating texture with _texture, and store it into the _dynamicTexture.
        * Used to create texture when texture image is small than size of the zone.
        */
        ScrollZone.prototype.createRepeatingTexture = function (regionWidth, regionHeight) {
            //	Work out how many we'll need of the source image to make it tile properly
            var tileWidth = Math.ceil(this.width / regionWidth) * regionWidth;
            var tileHeight = Math.ceil(this.height / regionHeight) * regionHeight;

            var dt = new Phaser.Display.DynamicTexture(this.game, tileWidth, tileHeight);

            dt.context.rect(0, 0, tileWidth, tileHeight);
            dt.context.fillStyle = dt.context.createPattern(this.texture.imageTexture, "repeat");
            dt.context.fill();

            this.texture.loadDynamicTexture(dt);
        };
        return ScrollZone;
    })(Phaser.Sprite);
    Phaser.ScrollZone = ScrollZone;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/// <reference path="../_definitions.ts" />
/**
* Phaser - GameObjectFactory
*
* A quick way to create new world objects and add existing objects to the current world.
*/
var Phaser;
(function (Phaser) {
    var GameObjectFactory = (function () {
        /**
        * GameObjectFactory constructor
        * @param game {Game} A reference to the current Game.
        */
        function GameObjectFactory(game) {
            this.game = game;
            this._world = this.game.world;
        }
        /**
        * Create a new camera with specific position and size.
        *
        * @param x {number} X position of the new camera.
        * @param y {number} Y position of the new camera.
        * @param width {number} Width of the new camera.
        * @param height {number} Height of the new camera.
        * @returns {Camera} The newly created camera object.
        */
        GameObjectFactory.prototype.camera = function (x, y, width, height) {
            return this._world.cameras.addCamera(x, y, width, height);
        };

        /**
        * Create a new GeomSprite with specific position.
        *
        * @param x {number} X position of the new geom sprite.
        * @param y {number} Y position of the new geom sprite.
        * @returns {GeomSprite} The newly created geom sprite object.
        */
        //public geomSprite(x: number, y: number): GeomSprite {
        //    return <GeomSprite> this._world.group.add(new GeomSprite(this.game, x, y));
        //}
        /**
        * Create a new Button game object.
        *
        * @param [x] {number} X position of the button.
        * @param [y] {number} Y position of the button.
        * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this button.
        * @param [callback] {function} The function to call when this button is pressed
        * @param [callbackContext] {object} The context in which the callback will be called (usually 'this')
        * @param [overFrame] {string|number} This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
        * @param [outFrame] {string|number} This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
        * @param [downFrame] {string|number} This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
        * @returns {Button} The newly created button object.
        */
        GameObjectFactory.prototype.button = function (x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof key === "undefined") { key = null; }
            if (typeof callback === "undefined") { callback = null; }
            if (typeof callbackContext === "undefined") { callbackContext = null; }
            if (typeof overFrame === "undefined") { overFrame = null; }
            if (typeof outFrame === "undefined") { outFrame = null; }
            if (typeof downFrame === "undefined") { downFrame = null; }
            return this._world.group.add(new Phaser.UI.Button(this.game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame));
        };

        /**
        * Create a new Sprite with specific position and sprite sheet key.
        *
        * @param x {number} X position of the new sprite.
        * @param y {number} Y position of the new sprite.
        * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this sprite
        * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
        * @returns {Sprite} The newly created sprite object.
        */
        GameObjectFactory.prototype.sprite = function (x, y, key, frame) {
            if (typeof key === "undefined") { key = ''; }
            if (typeof frame === "undefined") { frame = null; }
            return this._world.group.add(new Phaser.Sprite(this.game, x, y, key, frame));
        };

        GameObjectFactory.prototype.audio = function (key, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            return this.game.sound.add(key, volume, loop);
        };

        /**
        * Create a new Sprite with the physics automatically created and set to DYNAMIC. The Sprite position offset is set to its center.
        *
        * @param x {number} X position of the new sprite.
        * @param y {number} Y position of the new sprite.
        * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this sprite
        * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
        * @param [bodyType] {number} The physics body type of the object (defaults to BODY_DYNAMIC)
        * @param [shapeType] The default body shape is either 0 for a Box or 1 for a Circle. See Sprite.body.addShape for custom shapes (polygons, etc)
        * @returns {Sprite} The newly created sprite object.
        */
        //public physicsSprite(x: number, y: number, key: string = '', frame? = null, bodyType: number = Phaser.Types.BODY_DYNAMIC, shapeType:number = 0): Sprite {
        //    return <Sprite> this._world.group.add(new Sprite(this.game, x, y, key, frame, bodyType, shapeType));
        //}
        /**
        * Create a new DynamicTexture with specific size.
        *
        * @param width {number} Width of the texture.
        * @param height {number} Height of the texture.
        * @returns {DynamicTexture} The newly created dynamic texture object.
        */
        GameObjectFactory.prototype.dynamicTexture = function (width, height) {
            return new Phaser.Display.DynamicTexture(this.game, width, height);
        };

        /**
        * Create a new object container.
        *
        * @param maxSize {number} Optional, capacity of this group.
        * @returns {Group} The newly created group.
        */
        GameObjectFactory.prototype.group = function (maxSize) {
            if (typeof maxSize === "undefined") { maxSize = 0; }
            return this._world.group.add(new Phaser.Group(this.game, maxSize));
        };

        /**
        * Create a new Particle.
        *
        * @return {Particle} The newly created particle object.
        */
        GameObjectFactory.prototype.particle = function () {
            return new Phaser.ArcadeParticle(this.game);
        };

        /**
        * Create a new Emitter.
        *
        * @param x {number} Optional, x position of the emitter.
        * @param y {number} Optional, y position of the emitter.
        * @param size {number} Optional, size of this emitter.
        * @return {Emitter} The newly created emitter object.
        */
        GameObjectFactory.prototype.emitter = function (x, y, size) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof size === "undefined") { size = 0; }
            return this._world.group.add(new Phaser.ArcadeEmitter(this.game, x, y, size));
        };

        /**
        * Create a new ScrollZone object with image key, position and size.
        *
        * @param key {string} Key to a image you wish this object to use.
        * @param x {number} X position of this object.
        * @param y {number} Y position of this object.
        * @param width number} Width of this object.
        * @param height {number} Height of this object.
        * @returns {ScrollZone} The newly created scroll zone object.
        */
        GameObjectFactory.prototype.scrollZone = function (key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            return this._world.group.add(new Phaser.ScrollZone(this.game, key, x, y, width, height));
        };

        /**
        * Create a new Tilemap.
        *
        * @param key {string} Key for tileset image.
        * @param mapData {string} Data of this tilemap.
        * @param format {number} Format of map data. (Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON)
        * @param [resizeWorld] {boolean} resize the world to make same as tilemap?
        * @param [tileWidth] {number} width of each tile.
        * @param [tileHeight] {number} height of each tile.
        * @return {Tilemap} The newly created tilemap object.
        */
        GameObjectFactory.prototype.tilemap = function (key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
            return this._world.group.add(new Phaser.Tilemap(this.game, key, mapData, format, resizeWorld, tileWidth, tileHeight));
        };

        /**
        * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
        *
        * @param obj {object} Object the tween will be run on.
        * @param [localReference] {bool} If true the tween will be stored in the object.tween property so long as it exists. If already set it'll be over-written.
        * @return {Phaser.Tween} The newly created tween object.
        */
        GameObjectFactory.prototype.tween = function (obj, localReference) {
            if (typeof localReference === "undefined") { localReference = false; }
            return this.game.tweens.create(obj, localReference);
        };

        /**
        * Add an existing Sprite to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param sprite The Sprite to add to the Game World
        * @return {Phaser.Sprite} The Sprite object
        */
        GameObjectFactory.prototype.existingSprite = function (sprite) {
            return this._world.group.add(sprite);
        };

        /**
        * Add an existing Group to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param group The Group to add to the Game World
        * @return {Phaser.Group} The Group object
        */
        GameObjectFactory.prototype.existingGroup = function (group) {
            return this._world.group.add(group);
        };

        /**
        * Add an existing Button to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param button The Button to add to the Game World
        * @return {Phaser.Button} The Button object
        */
        GameObjectFactory.prototype.existingButton = function (button) {
            return this._world.group.add(button);
        };

        /**
        * Add an existing GeomSprite to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param sprite The GeomSprite to add to the Game World
        * @return {Phaser.GeomSprite} The GeomSprite object
        */
        //public existingGeomSprite(sprite: GeomSprite): GeomSprite {
        //    return this._world.group.add(sprite);
        //}
        /**
        * Add an existing Emitter to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param emitter The Emitter to add to the Game World
        * @return {Phaser.Emitter} The Emitter object
        */
        GameObjectFactory.prototype.existingEmitter = function (emitter) {
            return this._world.group.add(emitter);
        };

        /**
        * Add an existing ScrollZone to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param scrollZone The ScrollZone to add to the Game World
        * @return {Phaser.ScrollZone} The ScrollZone object
        */
        GameObjectFactory.prototype.existingScrollZone = function (scrollZone) {
            return this._world.group.add(scrollZone);
        };

        /**
        * Add an existing Tilemap to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param tilemap The Tilemap to add to the Game World
        * @return {Phaser.Tilemap} The Tilemap object
        */
        GameObjectFactory.prototype.existingTilemap = function (tilemap) {
            return this._world.group.add(tilemap);
        };

        /**
        * Add an existing Tween to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param tween The Tween to add to the Game World
        * @return {Phaser.Tween} The Tween object
        */
        GameObjectFactory.prototype.existingTween = function (tween) {
            return this.game.tweens.add(tween);
        };
        return GameObjectFactory;
    })();
    Phaser.GameObjectFactory = GameObjectFactory;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - ArcadeEmitter
*
* Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
* continuous effects like rain and fire. All it really does is launch Particle objects out
* at set intervals, and fixes their positions and velocities accorindgly.
*/
var Phaser;
(function (Phaser) {
    var ArcadeEmitter = (function (_super) {
        __extends(ArcadeEmitter, _super);
        /**
        * Creates a new <code>Emitter</code> object at a specific position.
        * Does NOT automatically generate or attach particles!
        *
        * @param x {number} The X position of the emitter.
        * @param y {number} The Y position of the emitter.
        * @param [size] {number} Specifies a maximum capacity for this emitter.
        */
        function ArcadeEmitter(game, x, y, size) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof size === "undefined") { size = 0; }
            _super.call(this, game, size);

            this.x = x;
            this.y = y;
            this.width = 0;
            this.height = 0;
            this.minParticleSpeed = new Phaser.Vec2(-100, -100);
            this.maxParticleSpeed = new Phaser.Vec2(100, 100);
            this.minRotation = -360;
            this.maxRotation = 360;
            this.gravity = 0;
            this.particleClass = null;
            this.particleDrag = new Phaser.Vec2();
            this.frequency = 0.1;
            this.lifespan = 3;
            this.bounce = 0;
            this._quantity = 0;
            this._counter = 0;
            this._explode = true;
            this.on = false;

            this.exists = true;
            this.active = true;
            this.visible = true;
        }
        /**
        * Clean up memory.
        */
        ArcadeEmitter.prototype.destroy = function () {
            this.minParticleSpeed = null;
            this.maxParticleSpeed = null;
            this.particleDrag = null;
            this.particleClass = null;
            this._point = null;
            _super.prototype.destroy.call(this);
        };

        /**
        * This function generates a new array of particle sprites to attach to the emitter.
        *
        * @param graphics If you opted to not pre-configure an array of Sprite objects, you can simply pass in a particle image or sprite sheet.
        * @param quantity {number} The number of particles to generate when using the "create from image" option.
        * @param multiple {boolean} Whether the image in the Graphics param is a single particle or a bunch of particles (if it's a bunch, they need to be square!).
        * @param collide {number}  Whether the particles should be flagged as not 'dead' (non-colliding particles are higher performance).  0 means no collisions, 0-1 controls scale of particle's bounding box.
        *
        * @return  This Emitter instance (nice for chaining stuff together, if you're into that).
        */
        ArcadeEmitter.prototype.makeParticles = function (graphics, quantity, multiple, collide) {
            if (typeof quantity === "undefined") { quantity = 50; }
            if (typeof multiple === "undefined") { multiple = false; }
            if (typeof collide === "undefined") { collide = 0; }
            this.maxSize = quantity;

            var totalFrames = 1;

            /*
            if(Multiple)
            {
            var sprite:Sprite = new Sprite(this.game);
            sprite.loadGraphic(Graphics,true);
            totalFrames = sprite.frames;
            sprite.destroy();
            }
            */
            var randomFrame;
            var particle;
            var i = 0;

            while (i < quantity) {
                if (this.particleClass == null) {
                    particle = new Phaser.ArcadeParticle(this.game);
                } else {
                    particle = new this.particleClass(this.game);
                }

                if (multiple) {
                    /*
                    randomFrame = this.game.math.random()*totalFrames;
                    */
                } else {
                    if (graphics) {
                        particle.texture.loadImage(graphics);
                    }
                }

                if (collide > 0) {
                    //particle.body.allowCollisions = Types.ANY;
                    particle.body.type = Phaser.Types.BODY_DYNAMIC;
                    particle.width *= collide;
                    particle.height *= collide;
                } else {
                    //particle.body.allowCollisions = Types.NONE;
                }

                particle.exists = false;

                //  Center the origin for rotation assistance
                //particle.transform.origin.setTo(particle.body.bounds.halfWidth, particle.body.bounds.halfHeight);
                this.add(particle);

                i++;
            }

            return this;
        };

        ArcadeEmitter.prototype.preUpdate = function () {
        };
        ArcadeEmitter.prototype.postUpdate = function () {
        };

        /**
        * Called automatically by the game loop, decides when to launch particles and when to "die".
        */
        ArcadeEmitter.prototype.update = function () {
            if (this.on) {
                if (this._explode) {
                    this.on = false;

                    var i = 0;
                    var l = this._quantity;

                    if ((l <= 0) || (l > this.length)) {
                        l = this.length;
                    }

                    while (i < l) {
                        this.emitParticle();
                        i++;
                    }

                    this._quantity = 0;
                } else {
                    this._timer += this.game.time.elapsed;

                    while ((this.frequency > 0) && (this._timer > this.frequency) && this.on) {
                        this._timer -= this.frequency;
                        this.emitParticle();

                        if ((this._quantity > 0) && (++this._counter >= this._quantity)) {
                            this.on = false;
                            this._quantity = 0;
                        }
                    }
                }
            }

            _super.prototype.update.call(this);
        };

        /**
        * Call this function to turn off all the particles and the emitter.
        */
        ArcadeEmitter.prototype.kill = function () {
            this.on = false;
            this.alive = false;
            this.exists = false;
        };

        /**
        * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
        * In practice, this is most often called by <code>Object.reset()</code>.
        */
        ArcadeEmitter.prototype.revive = function () {
            this.alive = true;
            this.exists = true;
        };

        /**
        * Call this function to start emitting particles.
        *
        * @param explode {boolean} Whether the particles should all burst out at once.
        * @param lifespan {number} How long each particle lives once emitted. 0 = forever.
        * @param frequency {number} Ignored if Explode is set to true. Frequency is how often to emit a particle. 0 = never emit, 0.1 = 1 particle every 0.1 seconds, 5 = 1 particle every 5 seconds.
        * @param quantity {number} How many particles to launch. 0 = "all of the particles".
        */
        ArcadeEmitter.prototype.start = function (explode, lifespan, frequency, quantity) {
            if (typeof explode === "undefined") { explode = true; }
            if (typeof lifespan === "undefined") { lifespan = 0; }
            if (typeof frequency === "undefined") { frequency = 0.1; }
            if (typeof quantity === "undefined") { quantity = 0; }
            this.revive();

            this.visible = true;
            this.on = true;

            this._explode = explode;
            this.lifespan = lifespan;
            this.frequency = frequency;
            this._quantity += quantity;

            this._counter = 0;
            this._timer = 0;
        };

        /**
        * This function can be used both internally and externally to emit the next particle.
        */
        ArcadeEmitter.prototype.emitParticle = function () {
            var particle = this.recycle(Phaser.ArcadeParticle);

            particle.lifespan = this.lifespan;

            //particle.body.bounce.setTo(this.bounce, this.bounce);
            Phaser.SpriteUtils.reset(particle, this.x - (particle.width >> 1) + this.game.rnd.integer * this.width, this.y - (particle.height >> 1) + this.game.rnd.integer * this.height);
            particle.visible = true;

            if (this.minParticleSpeed.x != this.maxParticleSpeed.x) {
                particle.body.velocity.x = this.minParticleSpeed.x + this.game.rnd.integer * (this.maxParticleSpeed.x - this.minParticleSpeed.x);
            } else {
                particle.body.velocity.x = this.minParticleSpeed.x;
            }

            if (this.minParticleSpeed.y != this.maxParticleSpeed.y) {
                particle.body.velocity.y = this.minParticleSpeed.y + this.game.rnd.integer * (this.maxParticleSpeed.y - this.minParticleSpeed.y);
            } else {
                particle.body.velocity.y = this.minParticleSpeed.y;
            }

            if (this.minRotation != this.maxRotation && this.minRotation !== 0 && this.maxRotation !== 0) {
                particle.body.angularVelocity = this.minRotation + this.game.rnd.integer * (this.maxRotation - this.minRotation);
            } else {
                particle.body.angularVelocity = this.minRotation;
            }

            if (particle.body.angularVelocity != 0) {
                particle.rotation = this.game.rnd.integer * 360 - 180;
            }

            //particle.body.drag.x = this.particleDrag.x;
            //particle.body.drag.y = this.particleDrag.y;
            particle.onEmit();
        };

        /**
        * A more compact way of setting the width and height of the emitter.
        *
        * @param width {number} The desired width of the emitter (particles are spawned randomly within these dimensions).
        * @param height {number} The desired height of the emitter.
        */
        ArcadeEmitter.prototype.setSize = function (width, height) {
            this.width = width;
            this.height = height;
        };

        /**
        * A more compact way of setting the X velocity range of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        ArcadeEmitter.prototype.setXSpeed = function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minParticleSpeed.x = min;
            this.maxParticleSpeed.x = max;
        };

        /**
        * A more compact way of setting the Y velocity range of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        ArcadeEmitter.prototype.setYSpeed = function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minParticleSpeed.y = min;
            this.maxParticleSpeed.y = max;
        };

        /**
        * A more compact way of setting the angular velocity constraints of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        ArcadeEmitter.prototype.setRotation = function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minRotation = min;
            this.maxRotation = max;
        };

        /**
        * Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
        *
        * @param Object {object} The <code>Object</code> that you want to sync up with.
        */
        ArcadeEmitter.prototype.at = function (object) {
            //this.x = object.body.bounds.halfWidth - (this.width >> 1);
            //this.y = object.body.bounds.halfHeight - (this.height >> 1);
        };
        return ArcadeEmitter;
    })(Phaser.Group);
    Phaser.ArcadeEmitter = ArcadeEmitter;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - ArcadeParticle
*
* This is a simple particle class that extends a Sprite to have a slightly more
* specialised behaviour. It is used exclusively by the Emitter class and can be extended as required.
*/
var Phaser;
(function (Phaser) {
    var ArcadeParticle = (function (_super) {
        __extends(ArcadeParticle, _super);
        /**
        * Instantiate a new particle.  Like <code>Sprite</code>, all meaningful creation
        * happens during <code>loadGraphic()</code> or <code>makeGraphic()</code> or whatever.
        */
        function ArcadeParticle(game) {
            _super.call(this, game);

            this.body.type = Phaser.Types.BODY_DYNAMIC;
            this.lifespan = 0;
        }
        /**
        * The particle's main update logic.  Basically it checks to see if it should be dead yet.
        */
        ArcadeParticle.prototype.update = function () {
            if (this.lifespan <= 0) {
                return;
            }

            this.lifespan -= this.game.time.elapsed;

            if (this.lifespan <= 0) {
                this.kill();
            }
        };

        /**
        * Triggered whenever this object is launched by a <code>Emitter</code>.
        * You can override this to add custom behavior like a sound or AI or something.
        */
        ArcadeParticle.prototype.onEmit = function () {
        };
        return ArcadeParticle;
    })(Phaser.Sprite);
    Phaser.ArcadeParticle = ArcadeParticle;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - UI - Button
    */
    (function (UI) {
        var Button = (function (_super) {
            __extends(Button, _super);
            /**
            * Create a new <code>Button</code> object.
            *
            * @param game {Phaser.Game} Current game instance.
            * @param [x] {number} X position of the button.
            * @param [y] {number} Y position of the button.
            * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this button.
            * @param [callback] {function} The function to call when this button is pressed
            * @param [callbackContext] {object} The context in which the callback will be called (usually 'this')
            * @param [overFrame] {string|number} This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
            * @param [outFrame] {string|number} This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
            * @param [downFrame] {string|number} This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
            */
            function Button(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof key === "undefined") { key = null; }
                if (typeof callback === "undefined") { callback = null; }
                if (typeof callbackContext === "undefined") { callbackContext = null; }
                if (typeof overFrame === "undefined") { overFrame = null; }
                if (typeof outFrame === "undefined") { outFrame = null; }
                if (typeof downFrame === "undefined") { downFrame = null; }
                _super.call(this, game, x, y, key, outFrame);
                this._onOverFrameName = null;
                this._onOutFrameName = null;
                this._onDownFrameName = null;
                this._onUpFrameName = null;
                this._onOverFrameID = null;
                this._onOutFrameID = null;
                this._onDownFrameID = null;
                this._onUpFrameID = null;

                this.type = Phaser.Types.BUTTON;

                if (typeof overFrame == 'string') {
                    this._onOverFrameName = overFrame;
                } else {
                    this._onOverFrameID = overFrame;
                }

                if (typeof outFrame == 'string') {
                    this._onOutFrameName = outFrame;
                    this._onUpFrameName = outFrame;
                } else {
                    this._onOutFrameID = outFrame;
                    this._onUpFrameID = outFrame;
                }

                if (typeof downFrame == 'string') {
                    this._onDownFrameName = downFrame;
                } else {
                    this._onDownFrameID = downFrame;
                }

                //  These are the signals the game will subscribe to
                this.onInputOver = new Phaser.Signal();
                this.onInputOut = new Phaser.Signal();
                this.onInputDown = new Phaser.Signal();
                this.onInputUp = new Phaser.Signal();

                if (callback) {
                    this.onInputUp.add(callback, callbackContext);
                }

                this.input.start(0, false, true);

                //  Redirect the input events to here so we can handle animation updates, etc
                this.events.onInputOver.add(this.onInputOverHandler, this);
                this.events.onInputOut.add(this.onInputOutHandler, this);
                this.events.onInputDown.add(this.onInputDownHandler, this);
                this.events.onInputUp.add(this.onInputUpHandler, this);
            }
            //  TODO
            //public tabIndex: number;
            //public tabEnabled: boolean;
            //  ENTER or SPACE can activate this button if it has focus
            Button.prototype.onInputOverHandler = function (pointer) {
                if (this._onOverFrameName != null) {
                    this.frameName = this._onOverFrameName;
                } else if (this._onOverFrameID != null) {
                    this.frame = this._onOverFrameID;
                }

                if (this.onInputOver) {
                    this.onInputOver.dispatch(this, pointer);
                }
            };

            Button.prototype.onInputOutHandler = function (pointer) {
                if (this._onOutFrameName != null) {
                    this.frameName = this._onOutFrameName;
                } else if (this._onOutFrameID != null) {
                    this.frame = this._onOutFrameID;
                }

                if (this.onInputOut) {
                    this.onInputOut.dispatch(this, pointer);
                }
            };

            Button.prototype.onInputDownHandler = function (pointer) {
                if (this._onDownFrameName != null) {
                    this.frameName = this._onDownFrameName;
                } else if (this._onDownFrameID != null) {
                    this.frame = this._onDownFrameID;
                }

                if (this.onInputDown) {
                    this.onInputDown.dispatch(this, pointer);
                }
            };

            Button.prototype.onInputUpHandler = function (pointer) {
                if (this._onUpFrameName != null) {
                    this.frameName = this._onUpFrameName;
                } else if (this._onUpFrameID != null) {
                    this.frame = this._onUpFrameID;
                }

                if (this.onInputUp) {
                    this.onInputUp.dispatch(this, pointer);
                }
            };


            Object.defineProperty(Button.prototype, "priorityID", {
                get: function () {
                    return this.input.priorityID;
                },
                set: function (value) {
                    this.input.priorityID = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Button.prototype, "useHandCursor", {
                get: function () {
                    return this.input.useHandCursor;
                },
                set: function (value) {
                    this.input.useHandCursor = value;
                },
                enumerable: true,
                configurable: true
            });
            return Button;
        })(Phaser.Sprite);
        UI.Button = Button;
    })(Phaser.UI || (Phaser.UI = {}));
    var UI = Phaser.UI;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - CircleUtils
*
* A collection of methods useful for manipulating and comparing Circle objects.
*/
var Phaser;
(function (Phaser) {
    var CircleUtils = (function () {
        function CircleUtils() {
        }
        CircleUtils.clone = /**
        * Returns a new Circle object with the same values for the x, y, width, and height properties as the original Circle object.
        * @method clone
        * @param {Circle} a - The Circle object.
        * @param {Circle} [optional] out Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
        * @return {Phaser.Circle}
        **/
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Circle(); }
            return out.setTo(a.x, a.y, a.diameter);
        };

        CircleUtils.contains = /**
        * Return true if the given x/y coordinates are within the Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
        * @method contains
        * @param {Circle} a - The Circle object.
        * @param {Number} The X value of the coordinate to test.
        * @param {Number} The Y value of the coordinate to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        function (a, x, y) {
            if (x >= a.left && x <= a.right && y >= a.top && y <= a.bottom) {
                var dx = (a.x - x) * (a.x - x);
                var dy = (a.y - y) * (a.y - y);
                return (dx + dy) <= (a.radius * a.radius);
            }

            return false;
        };

        CircleUtils.containsPoint = /**
        * Return true if the coordinates of the given Point object are within this Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
        * @method containsPoint
        * @param {Circle} a - The Circle object.
        * @param {Point} The Point object to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        function (a, point) {
            return CircleUtils.contains(a, point.x, point.y);
        };

        CircleUtils.containsCircle = /**
        * Return true if the given Circle is contained entirely within this Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleToCircle instead.
        * @method containsCircle
        * @param {Circle} The Circle object to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        function (a, b) {
            //return ((a.radius + b.radius) * (a.radius + b.radius)) >= Collision.distanceSquared(a.x, a.y, b.x, b.y);
            return true;
        };

        CircleUtils.distanceBetween = /**
        * Returns the distance from the center of the Circle object to the given object (can be Circle, Point or anything with x/y properties)
        * @method distanceBetween
        * @param {Circle} a - The Circle object.
        * @param {Circle} b - The target object. Must have visible x and y properties that represent the center of the object.
        * @param {Boolean} [optional] round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between this Point object and the destination Point object.
        **/
        function (a, target, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = a.x - target.x;
            var dy = a.y - target.y;

            if (round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };

        CircleUtils.equals = /**
        * Determines whether the two Circle objects match. This method compares the x, y and diameter properties.
        * @method equals
        * @param {Circle} a - The first Circle object.
        * @param {Circle} b - The second Circle object.
        * @return {Boolean} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
        **/
        function (a, b) {
            return (a.x == b.x && a.y == b.y && a.diameter == b.diameter);
        };

        CircleUtils.intersects = /**
        * Determines whether the two Circle objects intersect.
        * This method checks the radius distances between the two Circle objects to see if they intersect.
        * @method intersects
        * @param {Circle} a - The first Circle object.
        * @param {Circle} b - The second Circle object.
        * @return {Boolean} A value of true if the specified object intersects with this Circle object; otherwise false.
        **/
        function (a, b) {
            return (Phaser.CircleUtils.distanceBetween(a, b) <= (a.radius + b.radius));
        };

        CircleUtils.circumferencePoint = /**
        * Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
        * @method circumferencePoint
        * @param {Circle} a - The first Circle object.
        * @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
        * @param {Boolean} asDegrees Is the given angle in radians (false) or degrees (true)?
        * @param {Phaser.Point} [optional] output An optional Point object to put the result in to. If none specified a new Point object will be created.
        * @return {Phaser.Point} The Point object holding the result.
        **/
        function (a, angle, asDegrees, out) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            if (asDegrees === true) {
                angle = angle * Phaser.GameMath.DEG_TO_RAD;
            }

            return out.setTo(a.x + a.radius * Math.cos(angle), a.y + a.radius * Math.sin(angle));
        };

        CircleUtils.intersectsRectangle = /*
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
        function (c, r) {
            var cx = Math.abs(c.x - r.x - r.halfWidth);
            var xDist = r.halfWidth + c.radius;

            if (cx > xDist) {
                return false;
            }

            var cy = Math.abs(c.y - r.y - r.halfHeight);
            var yDist = r.halfHeight + c.radius;

            if (cy > yDist) {
                return false;
            }

            if (cx <= r.halfWidth || cy <= r.halfHeight) {
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
/// <reference path="../_definitions.ts" />
/**
* Phaser - ColorUtils
*
* A collection of methods useful for manipulating color values.
*/
var Phaser;
(function (Phaser) {
    var ColorUtils = (function () {
        function ColorUtils() {
        }
        ColorUtils.getColor32 = /**
        * Given an alpha and 3 color values this will return an integer representation of it
        *
        * @param alpha {number} The Alpha value (between 0 and 255)
        * @param red   {number} The Red channel value (between 0 and 255)
        * @param green {number} The Green channel value (between 0 and 255)
        * @param blue  {number} The Blue channel value (between 0 and 255)
        *
        * @return  A native color value integer (format: 0xAARRGGBB)
        */
        function (alpha, red, green, blue) {
            return alpha << 24 | red << 16 | green << 8 | blue;
        };

        ColorUtils.getColor = /**
        * Given 3 color values this will return an integer representation of it
        *
        * @param red   {number} The Red channel value (between 0 and 255)
        * @param green {number} The Green channel value (between 0 and 255)
        * @param blue  {number} The Blue channel value (between 0 and 255)
        *
        * @return  A native color value integer (format: 0xRRGGBB)
        */
        function (red, green, blue) {
            return red << 16 | green << 8 | blue;
        };

        ColorUtils.getHSVColorWheel = /**
        * Get HSV color wheel values in an array which will be 360 elements in size
        *
        * @param	alpha	Alpha value for each color of the color wheel, between 0 (transparent) and 255 (opaque)
        *
        * @return	Array
        */
        function (alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var colors = [];

            for (var c = 0; c <= 359; c++) {
                colors[c] = Phaser.ColorUtils.getWebRGB(Phaser.ColorUtils.HSVtoRGB(c, 1.0, 1.0, alpha));
            }

            return colors;
        };

        ColorUtils.getComplementHarmony = /**
        * Returns a Complementary Color Harmony for the given color.
        * <p>A complementary hue is one directly opposite the color given on the color wheel</p>
        * <p>Value returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        *
        * @return 0xAARRGGBB format color value
        */
        function (color) {
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);

            var opposite = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 180, 359);

            return Phaser.ColorUtils.HSVtoRGB(opposite, 1.0, 1.0);
        };

        ColorUtils.getAnalogousHarmony = /**
        * Returns an Analogous Color Harmony for the given color.
        * <p>An Analogous harmony are hues adjacent to each other on the color wheel</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        * @param	threshold Control how adjacent the colors will be (default +- 30 degrees)
        *
        * @return 	Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
        */
        function (color, threshold) {
            if (typeof threshold === "undefined") { threshold = 30; }
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);

            if (threshold > 359 || threshold < 0) {
                throw Error("Color Warning: Invalid threshold given to getAnalogousHarmony()");
            }

            var warmer = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 359 - threshold, 359);
            var colder = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, threshold, 359);

            return { color1: color, color2: Phaser.ColorUtils.HSVtoRGB(warmer, 1.0, 1.0), color3: Phaser.ColorUtils.HSVtoRGB(colder, 1.0, 1.0), hue1: hsv.hue, hue2: warmer, hue3: colder };
        };

        ColorUtils.getSplitComplementHarmony = /**
        * Returns an Split Complement Color Harmony for the given color.
        * <p>A Split Complement harmony are the two hues on either side of the color's Complement</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        * @param	threshold Control how adjacent the colors will be to the Complement (default +- 30 degrees)
        *
        * @return 	Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
        */
        function (color, threshold) {
            if (typeof threshold === "undefined") { threshold = 30; }
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);

            if (threshold >= 359 || threshold <= 0) {
                throw Error("Phaser.ColorUtils Warning: Invalid threshold given to getSplitComplementHarmony()");
            }

            var opposite = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 180, 359);

            var warmer = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, opposite - threshold, 359);
            var colder = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, opposite + threshold, 359);

            return { color1: color, color2: Phaser.ColorUtils.HSVtoRGB(warmer, hsv.saturation, hsv.value), color3: Phaser.ColorUtils.HSVtoRGB(colder, hsv.saturation, hsv.value), hue1: hsv.hue, hue2: warmer, hue3: colder };
        };

        ColorUtils.getTriadicHarmony = /**
        * Returns a Triadic Color Harmony for the given color.
        * <p>A Triadic harmony are 3 hues equidistant from each other on the color wheel</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        *
        * @return 	Object containing 3 properties: color1 (the original color), color2 and color3 (the equidistant colors)
        */
        function (color) {
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);

            var triadic1 = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 120, 359);
            var triadic2 = Phaser.ColorUtils.game.math.wrapValue(triadic1, 120, 359);

            return { color1: color, color2: Phaser.ColorUtils.HSVtoRGB(triadic1, 1.0, 1.0), color3: Phaser.ColorUtils.HSVtoRGB(triadic2, 1.0, 1.0) };
        };

        ColorUtils.getColorInfo = /**
        * Returns a string containing handy information about the given color including string hex value,
        * RGB format information and HSL information. Each section starts on a newline, 3 lines in total.
        *
        * @param	color A color value in the format 0xAARRGGBB
        *
        * @return	string containing the 3 lines of information
        */
        function (color) {
            var argb = Phaser.ColorUtils.getRGB(color);
            var hsl = Phaser.ColorUtils.RGBtoHSV(color);

            //	Hex format
            var result = Phaser.ColorUtils.RGBtoHexstring(color) + "\n";

            //	RGB format
            result = result.concat("Alpha: " + argb.alpha + " Red: " + argb.red + " Green: " + argb.green + " Blue: " + argb.blue) + "\n";

            //	HSL info
            result = result.concat("Hue: " + hsl.hue + " Saturation: " + hsl.saturation + " Lightnes: " + hsl.lightness);

            return result;
        };

        ColorUtils.RGBtoHexstring = /**
        * Return a string representation of the color in the format 0xAARRGGBB
        *
        * @param	color The color to get the string representation for
        *
        * @return	A string of length 10 characters in the format 0xAARRGGBB
        */
        function (color) {
            var argb = Phaser.ColorUtils.getRGB(color);

            return "0x" + Phaser.ColorUtils.colorToHexstring(argb.alpha) + Phaser.ColorUtils.colorToHexstring(argb.red) + Phaser.ColorUtils.colorToHexstring(argb.green) + Phaser.ColorUtils.colorToHexstring(argb.blue);
        };

        ColorUtils.RGBtoWebstring = /**
        * Return a string representation of the color in the format #RRGGBB
        *
        * @param	color The color to get the string representation for
        *
        * @return	A string of length 10 characters in the format 0xAARRGGBB
        */
        function (color) {
            var argb = Phaser.ColorUtils.getRGB(color);

            return "#" + Phaser.ColorUtils.colorToHexstring(argb.red) + Phaser.ColorUtils.colorToHexstring(argb.green) + Phaser.ColorUtils.colorToHexstring(argb.blue);
        };

        ColorUtils.colorToHexstring = /**
        * Return a string containing a hex representation of the given color
        *
        * @param	color The color channel to get the hex value for, must be a value between 0 and 255)
        *
        * @return	A string of length 2 characters, i.e. 255 = FF, 0 = 00
        */
        function (color) {
            var digits = "0123456789ABCDEF";

            var lsd = color % 16;
            var msd = (color - lsd) / 16;

            var hexified = digits.charAt(msd) + digits.charAt(lsd);

            return hexified;
        };

        ColorUtils.HSVtoRGB = /**
        * Convert a HSV (hue, saturation, lightness) color space value to an RGB color
        *
        * @param	h 		Hue degree, between 0 and 359
        * @param	s 		Saturation, between 0.0 (grey) and 1.0
        * @param	v 		Value, between 0.0 (black) and 1.0
        * @param	alpha	Alpha value to set per color (between 0 and 255)
        *
        * @return 32-bit ARGB color value (0xAARRGGBB)
        */
        function (h, s, v, alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var result;

            if (s == 0.0) {
                result = Phaser.ColorUtils.getColor32(alpha, v * 255, v * 255, v * 255);
            } else {
                h = h / 60.0;
                var f = h - Math.floor(h);
                var p = v * (1.0 - s);
                var q = v * (1.0 - s * f);
                var t = v * (1.0 - s * (1.0 - f));

                switch (Math.floor(h)) {
                    case 0:
                        result = Phaser.ColorUtils.getColor32(alpha, v * 255, t * 255, p * 255);
                        break;

                    case 1:
                        result = Phaser.ColorUtils.getColor32(alpha, q * 255, v * 255, p * 255);
                        break;

                    case 2:
                        result = Phaser.ColorUtils.getColor32(alpha, p * 255, v * 255, t * 255);
                        break;

                    case 3:
                        result = Phaser.ColorUtils.getColor32(alpha, p * 255, q * 255, v * 255);
                        break;

                    case 4:
                        result = Phaser.ColorUtils.getColor32(alpha, t * 255, p * 255, v * 255);
                        break;

                    case 5:
                        result = Phaser.ColorUtils.getColor32(alpha, v * 255, p * 255, q * 255);
                        break;

                    default:
                        throw new Error("Phaser.ColorUtils.HSVtoRGB : Unknown color");
                }
            }

            return result;
        };

        ColorUtils.RGBtoHSV = /**
        * Convert an RGB color value to an object containing the HSV color space values: Hue, Saturation and Lightness
        *
        * @param	color In format 0xRRGGBB
        *
        * @return 	Object with the properties hue (from 0 to 360), saturation (from 0 to 1.0) and lightness (from 0 to 1.0, also available under .value)
        */
        function (color) {
            var rgb = Phaser.ColorUtils.getRGB(color);

            var red = rgb.red / 255;
            var green = rgb.green / 255;
            var blue = rgb.blue / 255;

            var min = Math.min(red, green, blue);
            var max = Math.max(red, green, blue);
            var delta = max - min;
            var lightness = (max + min) / 2;
            var hue;
            var saturation;

            if (delta == 0) {
                hue = 0;
                saturation = 0;
            } else {
                if (lightness < 0.5) {
                    saturation = delta / (max + min);
                } else {
                    saturation = delta / (2 - max - min);
                }

                var delta_r = (((max - red) / 6) + (delta / 2)) / delta;
                var delta_g = (((max - green) / 6) + (delta / 2)) / delta;
                var delta_b = (((max - blue) / 6) + (delta / 2)) / delta;

                if (red == max) {
                    hue = delta_b - delta_g;
                } else if (green == max) {
                    hue = (1 / 3) + delta_r - delta_b;
                } else if (blue == max) {
                    hue = (2 / 3) + delta_g - delta_r;
                }

                if (hue < 0) {
                    hue += 1;
                }

                if (hue > 1) {
                    hue -= 1;
                }
            }

            //	Keep the value with 0 to 359
            hue *= 360;
            hue = Math.round(hue);

            return { hue: hue, saturation: saturation, lightness: lightness, value: lightness };
        };

        ColorUtils.interpolateColor = /**
        *
        * @method interpolateColor
        * @param {Number} color1
        * @param {Number} color2
        * @param {Number} steps
        * @param {Number} currentStep
        * @param {Number} alpha
        * @return {Number}
        * @static
        */
        function (color1, color2, steps, currentStep, alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var src1 = Phaser.ColorUtils.getRGB(color1);
            var src2 = Phaser.ColorUtils.getRGB(color2);

            var r = (((src2.red - src1.red) * currentStep) / steps) + src1.red;
            var g = (((src2.green - src1.green) * currentStep) / steps) + src1.green;
            var b = (((src2.blue - src1.blue) * currentStep) / steps) + src1.blue;

            return Phaser.ColorUtils.getColor32(alpha, r, g, b);
        };

        ColorUtils.interpolateColorWithRGB = /**
        *
        * @method interpolateColorWithRGB
        * @param {Number} color
        * @param {Number} r2
        * @param {Number} g2
        * @param {Number} b2
        * @param {Number} steps
        * @param {Number} currentStep
        * @return {Number}
        * @static
        */
        function (color, r2, g2, b2, steps, currentStep) {
            var src = Phaser.ColorUtils.getRGB(color);

            var r = (((r2 - src.red) * currentStep) / steps) + src.red;
            var g = (((g2 - src.green) * currentStep) / steps) + src.green;
            var b = (((b2 - src.blue) * currentStep) / steps) + src.blue;

            return Phaser.ColorUtils.getColor(r, g, b);
        };

        ColorUtils.interpolateRGB = /**
        *
        * @method interpolateRGB
        * @param {Number} r1
        * @param {Number} g1
        * @param {Number} b1
        * @param {Number} r2
        * @param {Number} g2
        * @param {Number} b2
        * @param {Number} steps
        * @param {Number} currentStep
        * @return {Number}
        * @static
        */
        function (r1, g1, b1, r2, g2, b2, steps, currentStep) {
            var r = (((r2 - r1) * currentStep) / steps) + r1;
            var g = (((g2 - g1) * currentStep) / steps) + g1;
            var b = (((b2 - b1) * currentStep) / steps) + b1;

            return Phaser.ColorUtils.getColor(r, g, b);
        };

        ColorUtils.getRandomColor = /**
        * Returns a random color value between black and white
        * <p>Set the min value to start each channel from the given offset.</p>
        * <p>Set the max value to restrict the maximum color used per channel</p>
        *
        * @param	min		The lowest value to use for the color
        * @param	max 	The highest value to use for the color
        * @param	alpha	The alpha value of the returning color (default 255 = fully opaque)
        *
        * @return 32-bit color value with alpha
        */
        function (min, max, alpha) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 255; }
            if (typeof alpha === "undefined") { alpha = 255; }
            if (max > 255) {
                return Phaser.ColorUtils.getColor(255, 255, 255);
            }

            if (min > max) {
                return Phaser.ColorUtils.getColor(255, 255, 255);
            }

            var red = min + Math.round(Math.random() * (max - min));
            var green = min + Math.round(Math.random() * (max - min));
            var blue = min + Math.round(Math.random() * (max - min));

            return Phaser.ColorUtils.getColor32(alpha, red, green, blue);
        };

        ColorUtils.getRGB = /**
        * Return the component parts of a color as an Object with the properties alpha, red, green, blue
        *
        * <p>Alpha will only be set if it exist in the given color (0xAARRGGBB)</p>
        *
        * @param	color in RGB (0xRRGGBB) or ARGB format (0xAARRGGBB)
        *
        * @return Object with properties: alpha, red, green, blue
        */
        function (color) {
            return { alpha: color >>> 24, red: color >> 16 & 0xFF, green: color >> 8 & 0xFF, blue: color & 0xFF };
        };

        ColorUtils.getWebRGB = /**
        *
        * @method getWebRGB
        * @param {Number} color
        * @return {Any}
        */
        function (color) {
            var alpha = (color >>> 24) / 255;
            var red = color >> 16 & 0xFF;
            var green = color >> 8 & 0xFF;
            var blue = color & 0xFF;

            return 'rgba(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ',' + alpha.toString() + ')';
        };

        ColorUtils.getAlpha = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Alpha component of the color, will be between 0 and 255 (0 being no Alpha, 255 full Alpha)
        */
        function (color) {
            return color >>> 24;
        };

        ColorUtils.getAlphaFloat = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component as a value between 0 and 1
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent))
        */
        function (color) {
            return (color >>> 24) / 255;
        };

        ColorUtils.getRed = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Red component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Red component of the color, will be between 0 and 255 (0 being no color, 255 full Red)
        */
        function (color) {
            return color >> 16 & 0xFF;
        };

        ColorUtils.getGreen = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Green component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Green component of the color, will be between 0 and 255 (0 being no color, 255 full Green)
        */
        function (color) {
            return color >> 8 & 0xFF;
        };

        ColorUtils.getBlue = /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Blue component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Blue component of the color, will be between 0 and 255 (0 being no color, 255 full Blue)
        */
        function (color) {
            return color & 0xFF;
        };
        return ColorUtils;
    })();
    Phaser.ColorUtils = ColorUtils;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - PointUtils
*
* A collection of methods useful for manipulating and comparing Point objects.
*
* TODO: interpolate & polar
*/
var Phaser;
(function (Phaser) {
    var PointUtils = (function () {
        function PointUtils() {
        }
        PointUtils.add = /**
        * Adds the coordinates of two points together to create a new point.
        * @method add
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x + b.x, a.y + b.y);
        };

        PointUtils.subtract = /**
        * Subtracts the coordinates of two points to create a new point.
        * @method subtract
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x - b.x, a.y - b.y);
        };

        PointUtils.multiply = /**
        * Multiplies the coordinates of two points to create a new point.
        * @method subtract
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x * b.x, a.y * b.y);
        };

        PointUtils.divide = /**
        * Divides the coordinates of two points to create a new point.
        * @method subtract
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x / b.x, a.y / b.y);
        };

        PointUtils.clamp = /**
        * Clamps the Point object values to be between the given min and max
        * @method clamp
        * @param {Point} a - The point.
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        function (a, min, max) {
            Phaser.PointUtils.clampX(a, min, max);
            Phaser.PointUtils.clampY(a, min, max);
            return a;
        };

        PointUtils.clampX = /**
        * Clamps the x value of the given Point object to be between the min and max values.
        * @method clampX
        * @param {Point} a - The point.
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        function (a, min, max) {
            a.x = Math.max(Math.min(a.x, max), min);
            return a;
        };

        PointUtils.clampY = /**
        * Clamps the y value of the given Point object to be between the min and max values.
        * @method clampY
        * @param {Point} a - The point.
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        function (a, min, max) {
            a.y = Math.max(Math.min(a.y, max), min);
            return a;
        };

        PointUtils.clone = /**
        * Creates a copy of the given Point.
        * @method clone
        * @param {Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The new Point object.
        **/
        function (a, output) {
            if (typeof output === "undefined") { output = new Phaser.Point(); }
            return output.setTo(a.x, a.y);
        };

        PointUtils.distanceBetween = /**
        * Returns the distance between the two given Point objects.
        * @method distanceBetween
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @param {Boolean} round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between the two Point objects.
        **/
        function (a, b, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = a.x - b.x;
            var dy = a.y - b.y;

            if (round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };

        PointUtils.equals = /**
        * Determines whether the two given Point objects are equal. They are considered equal if they have the same x and y values.
        * @method equals
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @return {Boolean} A value of true if the Points are equal, otherwise false.
        **/
        function (a, b) {
            return (a.x == b.x && a.y == b.y);
        };

        PointUtils.rotate = /**
        * Determines a point between two specified points. The parameter f determines where the new interpolated point is located relative to the two end points specified by parameters pt1 and pt2.
        * The closer the value of the parameter f is to 1.0, the closer the interpolated point is to the first point (parameter pt1). The closer the value of the parameter f is to 0, the closer the interpolated point is to the second point (parameter pt2).
        * @method interpolate
        * @param {Point} pointA - The first Point object.
        * @param {Point} pointB - The second Point object.
        * @param {Number} f - The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
        * @return {Point} The new interpolated Point object.
        **/
        //static interpolate(pointA, pointB, f) {
        //}
        /**
        * Converts a pair of polar coordinates to a Cartesian point coordinate.
        * @method polar
        * @param {Number} length - The length coordinate of the polar pair.
        * @param {Number} angle - The angle, in radians, of the polar pair.
        * @return {Point} The new Cartesian Point object.
        **/
        //static polar(length, angle) {
        //}
        /**
        * Rotates a Point around the x/y coordinates given to the desired angle.
        * @param a {Point} The Point object to rotate.
        * @param x {number} The x coordinate of the anchor point
        * @param y {number} The y coordinate of the anchor point
        * @param {Number} angle The angle in radians (unless asDegrees is true) to rotate the Point to.
        * @param {Boolean} asDegrees Is the given rotation in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the Point and the anchor.
        * @return The modified point object
        */
        function (a, x, y, angle, asDegrees, distance) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof distance === "undefined") { distance = null; }
            if (asDegrees) {
                angle = angle * Phaser.GameMath.DEG_TO_RAD;
            }

            if (distance === null) {
                distance = Math.sqrt(((x - a.x) * (x - a.x)) + ((y - a.y) * (y - a.y)));
            }

            return a.setTo(x + distance * Math.cos(angle), y + distance * Math.sin(angle));
        };

        PointUtils.rotateAroundPoint = /**
        * Rotates a Point around the given Point to the desired angle.
        * @param a {Point} The Point object to rotate.
        * @param b {Point} The Point object to serve as point of rotation.
        * @param x {number} The x coordinate of the anchor point
        * @param y {number} The y coordinate of the anchor point
        * @param {Number} angle The angle in radians (unless asDegrees is true) to rotate the Point to.
        * @param {Boolean} asDegrees Is the given rotation in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the Point and the anchor.
        * @return The modified point object
        */
        function (a, b, angle, asDegrees, distance) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof distance === "undefined") { distance = null; }
            return Phaser.PointUtils.rotate(a, b.x, b.y, angle, asDegrees, distance);
        };
        return PointUtils;
    })();
    Phaser.PointUtils = PointUtils;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - RectangleUtils
*
* A collection of methods useful for manipulating and comparing Rectangle objects.
*
* TODO: Check docs + overlap + intersect + toPolygon?
*/
var Phaser;
(function (Phaser) {
    var RectangleUtils = (function () {
        function RectangleUtils() {
        }
        RectangleUtils.getTopLeftAsPoint = /**
        * Get the location of the Rectangles top-left corner as a Point object.
        * @method getTopLeftAsPoint
        * @param {Rectangle} a - The Rectangle object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x, a.y);
        };

        RectangleUtils.getBottomRightAsPoint = /**
        * Get the location of the Rectangles bottom-right corner as a Point object.
        * @method getTopLeftAsPoint
        * @param {Rectangle} a - The Rectangle object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.right, a.bottom);
        };

        RectangleUtils.inflate = /**
        * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
        * @method inflate
        * @param {Rectangle} a - The Rectangle object.
        * @param {Number} dx The amount to be added to the left side of the Rectangle.
        * @param {Number} dy The amount to be added to the bottom side of the Rectangle.
        * @return {Rectangle} This Rectangle object.
        **/
        function (a, dx, dy) {
            a.x -= dx;
            a.width += 2 * dx;

            a.y -= dy;
            a.height += 2 * dy;

            return a;
        };

        RectangleUtils.inflatePoint = /**
        * Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
        * @method inflatePoint
        * @param {Rectangle} a - The Rectangle object.
        * @param {Point} point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
        * @return {Rectangle} The Rectangle object.
        **/
        function (a, point) {
            return Phaser.RectangleUtils.inflate(a, point.x, point.y);
        };

        RectangleUtils.size = /**
        * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
        * @method size
        * @param {Rectangle} a - The Rectangle object.
        * @param {Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The size of the Rectangle object
        **/
        function (a, output) {
            if (typeof output === "undefined") { output = new Phaser.Point(); }
            return output.setTo(a.width, a.height);
        };

        RectangleUtils.clone = /**
        * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
        * @method clone
        * @param {Rectangle} a - The Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle}
        **/
        function (a, output) {
            if (typeof output === "undefined") { output = new Phaser.Rectangle(); }
            return output.setTo(a.x, a.y, a.width, a.height);
        };

        RectangleUtils.contains = /**
        * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
        * @method contains
        * @param {Rectangle} a - The Rectangle object.
        * @param {Number} x The x coordinate of the point to test.
        * @param {Number} y The y coordinate of the point to test.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        function (a, x, y) {
            return (x >= a.x && x <= a.right && y >= a.y && y <= a.bottom);
        };

        RectangleUtils.containsPoint = /**
        * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object. This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
        * @method containsPoint
        * @param {Rectangle} a - The Rectangle object.
        * @param {Point} point The point object being checked. Can be Point or any object with .x and .y values.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        function (a, point) {
            return Phaser.RectangleUtils.contains(a, point.x, point.y);
        };

        RectangleUtils.containsRect = /**
        * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
        * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
        * @method containsRect
        * @param {Rectangle} a - The first Rectangle object.
        * @param {Rectangle} b - The second Rectangle object.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        function (a, b) {
            if (a.volume > b.volume) {
                return false;
            }

            return (a.x >= b.x && a.y >= b.y && a.right <= b.right && a.bottom <= b.bottom);
        };

        RectangleUtils.equals = /**
        * Determines whether the two Rectangles are equal.
        * This method compares the x, y, width and height properties of each Rectangle.
        * @method equals
        * @param {Rectangle} a - The first Rectangle object.
        * @param {Rectangle} b - The second Rectangle object.
        * @return {Boolean} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
        **/
        function (a, b) {
            return (a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height);
        };

        RectangleUtils.intersection = /**
        * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
        * @method intersection
        * @param {Rectangle} a - The first Rectangle object.
        * @param {Rectangle} b - The second Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
        **/
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Rectangle(); }
            if (Phaser.RectangleUtils.intersects(a, b)) {
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
        * @param {Rectangle} a - The first Rectangle object.
        * @param {Rectangle} b - The second Rectangle object.
        * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
        * @return {Boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
        **/
        function (a, b, tolerance) {
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
        * @return {Boolean} A value of true if the specified object intersects with the Rectangle; otherwise false.
        **/
        function (a, left, right, top, bottom, tolerance) {
            if (typeof tolerance === "undefined") { tolerance = 0; }
            return !(left > a.right + tolerance || right < a.left - tolerance || top > a.bottom + tolerance || bottom < a.top - tolerance);
        };

        RectangleUtils.union = /**
        * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
        * @method union
        * @param {Rectangle} a - The first Rectangle object.
        * @param {Rectangle} b - The second Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that is the union of the two Rectangles.
        **/
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Rectangle(); }
            return out.setTo(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.right, b.right), Math.max(a.bottom, b.bottom));
        };
        return RectangleUtils;
    })();
    Phaser.RectangleUtils = RectangleUtils;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - SpriteUtils
*
* A collection of methods useful for manipulating and checking Sprites.
*/
var Phaser;
(function (Phaser) {
    var SpriteUtils = (function () {
        function SpriteUtils() {
        }
        SpriteUtils.updateCameraView = /**
        * Updates a Sprites cameraView Rectangle based on the given camera, sprite world position and rotation
        * @param camera {Camera} The Camera to use in the view
        * @param sprite {Sprite} The Sprite that will have its cameraView property modified
        * @return {Rectangle} A reference to the Sprite.cameraView property
        */
        function (camera, sprite) {
            if (sprite.rotation == 0 || sprite.texture.renderRotation == false) {
                //  Easy out
                sprite.cameraView.x = Math.floor(sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x) - (sprite.width * sprite.transform.origin.x));
                sprite.cameraView.y = Math.floor(sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y) - (sprite.height * sprite.transform.origin.y));
                sprite.cameraView.width = sprite.width;
                sprite.cameraView.height = sprite.height;
            } else {
                if (sprite.transform.origin.x == 0.5 && sprite.transform.origin.y == 0.5) {
                    Phaser.SpriteUtils._sin = sprite.transform.sin;
                    Phaser.SpriteUtils._cos = sprite.transform.cos;

                    if (Phaser.SpriteUtils._sin < 0) {
                        Phaser.SpriteUtils._sin = -Phaser.SpriteUtils._sin;
                    }

                    if (Phaser.SpriteUtils._cos < 0) {
                        Phaser.SpriteUtils._cos = -Phaser.SpriteUtils._cos;
                    }

                    sprite.cameraView.width = Math.round(sprite.height * Phaser.SpriteUtils._sin + sprite.width * Phaser.SpriteUtils._cos);
                    sprite.cameraView.height = Math.round(sprite.height * Phaser.SpriteUtils._cos + sprite.width * Phaser.SpriteUtils._sin);
                    sprite.cameraView.x = Math.round(sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x) - (sprite.cameraView.width * sprite.transform.origin.x));
                    sprite.cameraView.y = Math.round(sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y) - (sprite.cameraView.height * sprite.transform.origin.y));
                } else {
                    sprite.cameraView.x = Math.min(sprite.transform.upperLeft.x, sprite.transform.upperRight.x, sprite.transform.bottomLeft.x, sprite.transform.bottomRight.x);
                    sprite.cameraView.y = Math.min(sprite.transform.upperLeft.y, sprite.transform.upperRight.y, sprite.transform.bottomLeft.y, sprite.transform.bottomRight.y);
                    sprite.cameraView.width = Math.max(sprite.transform.upperLeft.x, sprite.transform.upperRight.x, sprite.transform.bottomLeft.x, sprite.transform.bottomRight.x) - sprite.cameraView.x;
                    sprite.cameraView.height = Math.max(sprite.transform.upperLeft.y, sprite.transform.upperRight.y, sprite.transform.bottomLeft.y, sprite.transform.bottomRight.y) - sprite.cameraView.y;
                }
            }

            return sprite.cameraView;
        };

        SpriteUtils.getAsPoints = function (sprite) {
            var out = [];

            //  top left
            out.push(new Phaser.Point(sprite.x, sprite.y));

            //  top right
            out.push(new Phaser.Point(sprite.x + sprite.width, sprite.y));

            //  bottom right
            out.push(new Phaser.Point(sprite.x + sprite.width, sprite.y + sprite.height));

            //  bottom left
            out.push(new Phaser.Point(sprite.x, sprite.y + sprite.height));

            return out;
        };

        SpriteUtils.overlapsXY = /**
        * Checks to see if some <code>GameObject</code> overlaps this <code>GameObject</code> or <code>Group</code>.
        * If the group has a LOT of things in it, it might be faster to use <code>Collision.overlaps()</code>.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param objectOrGroup {object} The object or group being tested.
        * @param inScreenSpace {boolean} Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether or not the objects overlap this.
        */
        /*
        static overlaps(objectOrGroup, inScreenSpace: boolean = false, camera: Camera = null): boolean {
        
        if (objectOrGroup.isGroup)
        {
        var results: boolean = false;
        var i: number = 0;
        var members = <Group> objectOrGroup.members;
        
        while (i < length)
        {
        if (this.overlaps(members[i++], inScreenSpace, camera))
        {
        results = true;
        }
        }
        
        return results;
        
        }
        
        if (!inScreenSpace)
        {
        return (objectOrGroup.x + objectOrGroup.width > this.x) && (objectOrGroup.x < this.x + this.width) &&
        (objectOrGroup.y + objectOrGroup.height > this.y) && (objectOrGroup.y < this.y + this.height);
        }
        
        if (camera == null)
        {
        camera = this.game.camera;
        }
        
        var objectScreenPos: Point = objectOrGroup.getScreenXY(null, camera);
        
        this.getScreenXY(this._point, camera);
        
        return (objectScreenPos.x + objectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) &&
        (objectScreenPos.y + objectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        }
        */
        /**
        * Checks to see if the given x and y coordinates overlaps this <code>Sprite</code>, taking scaling and rotation into account.
        * The coordinates must be given in world space, not local or camera space.
        *
        * @param sprite {Sprite} The Sprite to check. It will take scaling and rotation into account.
        * @param x {Number} The x coordinate in world space.
        * @param y {Number} The y coordinate in world space.
        *
        * @return   Whether or not the point overlaps this object.
        */
        function (sprite, x, y) {
            if (sprite.transform.rotation == 0) {
                return Phaser.RectangleUtils.contains(sprite.worldView, x, y);
            }

            if ((x - sprite.transform.upperLeft.x) * (sprite.transform.upperRight.x - sprite.transform.upperLeft.x) + (y - sprite.transform.upperLeft.y) * (sprite.transform.upperRight.y - sprite.transform.upperLeft.y) < 0) {
                return false;
            }

            if ((x - sprite.transform.upperRight.x) * (sprite.transform.upperRight.x - sprite.transform.upperLeft.x) + (y - sprite.transform.upperRight.y) * (sprite.transform.upperRight.y - sprite.transform.upperLeft.y) > 0) {
                return false;
            }

            if ((x - sprite.transform.upperLeft.x) * (sprite.transform.bottomLeft.x - sprite.transform.upperLeft.x) + (y - sprite.transform.upperLeft.y) * (sprite.transform.bottomLeft.y - sprite.transform.upperLeft.y) < 0) {
                return false;
            }

            if ((x - sprite.transform.bottomLeft.x) * (sprite.transform.bottomLeft.x - sprite.transform.upperLeft.x) + (y - sprite.transform.bottomLeft.y) * (sprite.transform.bottomLeft.y - sprite.transform.upperLeft.y) > 0) {
                return false;
            }

            return true;
        };

        SpriteUtils.overlapsPoint = /**
        * Checks to see if the given point overlaps this <code>Sprite</code>, taking scaling and rotation into account.
        * The point must be given in world space, not local or camera space.
        *
        * @param sprite {Sprite} The Sprite to check. It will take scaling and rotation into account.
        * @param point {Point} The point in world space you want to check.
        *
        * @return   Whether or not the point overlaps this object.
        */
        function (sprite, point) {
            return Phaser.SpriteUtils.overlapsXY(sprite, point.x, point.y);
        };

        SpriteUtils.onScreen = /**
        * Check and see if this object is currently on screen.
        *
        * @param camera {Camera} Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether the object is on screen or not.
        */
        function (sprite, camera) {
            if (typeof camera === "undefined") { camera = null; }
            if (camera == null) {
                camera = sprite.game.camera;
            }

            Phaser.SpriteUtils.getScreenXY(sprite, SpriteUtils._tempPoint, camera);

            return (Phaser.SpriteUtils._tempPoint.x + sprite.width > 0) && (Phaser.SpriteUtils._tempPoint.x < camera.width) && (Phaser.SpriteUtils._tempPoint.y + sprite.height > 0) && (Phaser.SpriteUtils._tempPoint.y < camera.height);
        };

        SpriteUtils.getScreenXY = /**
        * Call this to figure out the on-screen position of the object.
        *
        * @param point {Point} Takes a <code>Point</code> object and assigns the post-scrolled X and Y values of this object to it.
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {Point} The <code>Point</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
        */
        function (sprite, point, camera) {
            if (typeof point === "undefined") { point = null; }
            if (typeof camera === "undefined") { camera = null; }
            if (point == null) {
                point = new Phaser.Point();
            }

            if (camera == null) {
                camera = sprite.game.camera;
            }

            point.x = sprite.x - camera.x * sprite.transform.scrollFactor.x;
            point.y = sprite.y - camera.y * sprite.transform.scrollFactor.y;
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;

            return point;
        };

        SpriteUtils.reset = /**
        * Set the world bounds that this GameObject can exist within based on the size of the current game world.
        *
        * @param action {number} The action to take if the object hits the world bounds, either OUT_OF_BOUNDS_KILL or OUT_OF_BOUNDS_STOP
        */
        /*
        static setBoundsFromWorld(action: number = GameObject.OUT_OF_BOUNDS_STOP) {
        
        this.setBounds(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height);
        this.outOfBoundsAction = action;
        
        }
        */
        /**
        * Handy for reviving game objects.
        * Resets their existence flags and position.
        *
        * @param x {number} The new X position of this object.
        * @param y {number} The new Y position of this object.
        */
        function (sprite, x, y) {
            sprite.revive();

            //sprite.body.touching = Types.NONE;
            //sprite.body.wasTouching = Types.NONE;
            sprite.x = x;
            sprite.y = y;
            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;
            sprite.body.position.x = x;
            sprite.body.position.y = y;
        };

        SpriteUtils.setBounds = /**
        * Set the world bounds that this GameObject can exist within. By default a GameObject can exist anywhere
        * in the world. But by setting the bounds (which are given in world dimensions, not screen dimensions)
        * it can be stopped from leaving the world, or a section of it.
        *
        * @param x {number} x position of the bound
        * @param y {number} y position of the bound
        * @param width {number} width of its bound
        * @param height {number} height of its bound
        */
        function (x, y, width, height) {
            //this.worldBounds = new Quad(x, y, width, height);
        };
        return SpriteUtils;
    })();
    Phaser.SpriteUtils = SpriteUtils;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
/**
* Phaser - DebugUtils
*
* A collection of methods for displaying debug information about game objects.
*/
var Phaser;
(function (Phaser) {
    var DebugUtils = (function () {
        function DebugUtils() {
        }
        DebugUtils.start = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.currentX = x;
            Phaser.DebugUtils.currentY = y;
            Phaser.DebugUtils.currentColor = color;

            Phaser.DebugUtils.context.fillStyle = color;
            Phaser.DebugUtils.context.font = Phaser.DebugUtils.font;
        };

        DebugUtils.line = function (text, x, y) {
            if (typeof x === "undefined") { x = null; }
            if (typeof y === "undefined") { y = null; }
            if (x !== null) {
                Phaser.DebugUtils.currentX = x;
            }

            if (y !== null) {
                Phaser.DebugUtils.currentY = y;
            }

            if (Phaser.DebugUtils.renderShadow) {
                Phaser.DebugUtils.context.fillStyle = 'rgb(0,0,0)';
                Phaser.DebugUtils.context.fillText(text, Phaser.DebugUtils.currentX + 1, Phaser.DebugUtils.currentY + 1);
                Phaser.DebugUtils.context.fillStyle = Phaser.DebugUtils.currentColor;
            }

            Phaser.DebugUtils.context.fillText(text, Phaser.DebugUtils.currentX, Phaser.DebugUtils.currentY);

            Phaser.DebugUtils.currentY += Phaser.DebugUtils.lineHeight;
        };

        DebugUtils.renderSpriteCorners = function (sprite, color) {
            if (typeof color === "undefined") { color = 'rgb(255,0,255)'; }
            Phaser.DebugUtils.start(0, 0, color);

            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.upperLeft.x) + ' y: ' + Math.floor(sprite.transform.upperLeft.y), sprite.transform.upperLeft.x, sprite.transform.upperLeft.y);
            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.upperRight.x) + ' y: ' + Math.floor(sprite.transform.upperRight.y), sprite.transform.upperRight.x, sprite.transform.upperRight.y);
            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.bottomLeft.x) + ' y: ' + Math.floor(sprite.transform.bottomLeft.y), sprite.transform.bottomLeft.x, sprite.transform.bottomLeft.y);
            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.bottomRight.x) + ' y: ' + Math.floor(sprite.transform.bottomRight.y), sprite.transform.bottomRight.x, sprite.transform.bottomRight.y);
        };

        DebugUtils.renderSoundInfo = /**
        * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (sound, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);

            Phaser.DebugUtils.line('Sound: ' + sound.key + ' Locked: ' + sound.game.sound.touchLocked + ' Pending Playback: ' + sound.pendingPlayback);
            Phaser.DebugUtils.line('Decoded: ' + sound.isDecoded + ' Decoding: ' + sound.isDecoding);
            Phaser.DebugUtils.line('Total Duration: ' + sound.totalDuration + ' Playing: ' + sound.isPlaying);
            Phaser.DebugUtils.line('Time: ' + sound.currentTime);
            Phaser.DebugUtils.line('Volume: ' + sound.volume + ' Muted: ' + sound.mute);
            Phaser.DebugUtils.line('WebAudio: ' + sound.usingWebAudio + ' Audio: ' + sound.usingAudioTag);

            if (sound.currentMarker !== '') {
                Phaser.DebugUtils.line('Marker: ' + sound.currentMarker + ' Duration: ' + sound.duration);
                Phaser.DebugUtils.line('Start: ' + sound.markers[sound.currentMarker].start + ' Stop: ' + sound.markers[sound.currentMarker].stop);
                Phaser.DebugUtils.line('Position: ' + sound.position);
            }
        };

        DebugUtils.renderCameraInfo = /**
        * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (camera, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            Phaser.DebugUtils.line('Camera ID: ' + camera.ID + ' (' + camera.screenView.width + ' x ' + camera.screenView.height + ')');
            Phaser.DebugUtils.line('X: ' + camera.x + ' Y: ' + camera.y + ' Rotation: ' + camera.transform.rotation);
            Phaser.DebugUtils.line('WorldView X: ' + camera.worldView.x + ' Y: ' + camera.worldView.y + ' W: ' + camera.worldView.width + ' H: ' + camera.worldView.height);
            Phaser.DebugUtils.line('ScreenView X: ' + camera.screenView.x + ' Y: ' + camera.screenView.y + ' W: ' + camera.screenView.width + ' H: ' + camera.screenView.height);

            if (camera.worldBounds) {
                Phaser.DebugUtils.line('Bounds: ' + camera.worldBounds.width + ' x ' + camera.worldBounds.height);
            }
        };

        DebugUtils.renderPointer = /**
        * Renders the Pointer.circle object onto the stage in green if down or red if up.
        * @method renderDebug
        */
        function (pointer, hideIfUp, downColor, upColor, color) {
            if (typeof hideIfUp === "undefined") { hideIfUp = false; }
            if (typeof downColor === "undefined") { downColor = 'rgba(0,255,0,0.5)'; }
            if (typeof upColor === "undefined") { upColor = 'rgba(255,0,0,0.5)'; }
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            if (hideIfUp == true && pointer.isUp == true) {
                return;
            }

            Phaser.DebugUtils.context.beginPath();
            Phaser.DebugUtils.context.arc(pointer.x, pointer.y, pointer.circle.radius, 0, Math.PI * 2);

            if (pointer.active) {
                Phaser.DebugUtils.context.fillStyle = downColor;
            } else {
                Phaser.DebugUtils.context.fillStyle = upColor;
            }

            Phaser.DebugUtils.context.fill();
            Phaser.DebugUtils.context.closePath();

            //  Render the points
            Phaser.DebugUtils.context.beginPath();
            Phaser.DebugUtils.context.moveTo(pointer.positionDown.x, pointer.positionDown.y);
            Phaser.DebugUtils.context.lineTo(pointer.position.x, pointer.position.y);
            Phaser.DebugUtils.context.lineWidth = 2;
            Phaser.DebugUtils.context.stroke();
            Phaser.DebugUtils.context.closePath();

            //  Render the text
            Phaser.DebugUtils.start(pointer.x, pointer.y - 100, color);

            Phaser.DebugUtils.line('ID: ' + pointer.id + " Active: " + pointer.active);
            Phaser.DebugUtils.line('World X: ' + pointer.worldX + " World Y: " + pointer.worldY);
            Phaser.DebugUtils.line('Screen X: ' + pointer.x + " Screen Y: " + pointer.y);
            Phaser.DebugUtils.line('Duration: ' + pointer.duration + " ms");
        };

        DebugUtils.renderSpriteInputInfo = /**
        * Render Sprite Input Debug information
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (sprite, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);

            Phaser.DebugUtils.line('Sprite Input: (' + sprite.width + ' x ' + sprite.height + ')');
            Phaser.DebugUtils.line('x: ' + sprite.input.pointerX().toFixed(1) + ' y: ' + sprite.input.pointerY().toFixed(1));
            Phaser.DebugUtils.line('over: ' + sprite.input.pointerOver() + ' duration: ' + sprite.input.overDuration().toFixed(0));
            Phaser.DebugUtils.line('down: ' + sprite.input.pointerDown() + ' duration: ' + sprite.input.downDuration().toFixed(0));
            Phaser.DebugUtils.line('just over: ' + sprite.input.justOver() + ' just out: ' + sprite.input.justOut());
        };

        DebugUtils.renderInputInfo = /**
        * Render debug information about the Input object.
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);

            if (Phaser.DebugUtils.game.input.camera) {
                Phaser.DebugUtils.line('Input - Camera: ' + Phaser.DebugUtils.game.input.camera.ID);
            } else {
                Phaser.DebugUtils.line('Input - Camera: null');
            }

            Phaser.DebugUtils.line('X: ' + Phaser.DebugUtils.game.input.x + ' Y: ' + Phaser.DebugUtils.game.input.y);
            Phaser.DebugUtils.line('World X: ' + Phaser.DebugUtils.game.input.worldX + ' World Y: ' + Phaser.DebugUtils.game.input.worldY);
            Phaser.DebugUtils.line('Scale X: ' + Phaser.DebugUtils.game.input.scale.x.toFixed(1) + ' Scale Y: ' + Phaser.DebugUtils.game.input.scale.x.toFixed(1));
            Phaser.DebugUtils.line('Screen X: ' + Phaser.DebugUtils.game.input.activePointer.screenX + ' Screen Y: ' + Phaser.DebugUtils.game.input.activePointer.screenY);
        };

        DebugUtils.renderSpriteWorldView = function (sprite, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            Phaser.DebugUtils.line('Sprite World Coords (' + sprite.width + ' x ' + sprite.height + ')');
            Phaser.DebugUtils.line('x: ' + sprite.worldView.x + ' y: ' + sprite.worldView.y);
            Phaser.DebugUtils.line('bottom: ' + sprite.worldView.bottom + ' right: ' + sprite.worldView.right.toFixed(1));
        };

        DebugUtils.renderSpriteInfo = /**
        * Render debug infos. (including name, bounds info, position and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (sprite, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            Phaser.DebugUtils.line('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ') origin: ' + sprite.transform.origin.x + ' x ' + sprite.transform.origin.y);
            Phaser.DebugUtils.line('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1));
            Phaser.DebugUtils.line('wx: ' + sprite.worldView.x + ' wy: ' + sprite.worldView.y + ' ww: ' + sprite.worldView.width.toFixed(1) + ' wh: ' + sprite.worldView.height.toFixed(1) + ' wb: ' + sprite.worldView.bottom + ' wr: ' + sprite.worldView.right);
            Phaser.DebugUtils.line('sx: ' + sprite.transform.scale.x.toFixed(1) + ' sy: ' + sprite.transform.scale.y.toFixed(1));
            Phaser.DebugUtils.line('tx: ' + sprite.texture.width.toFixed(1) + ' ty: ' + sprite.texture.height.toFixed(1));
            Phaser.DebugUtils.line('center x: ' + sprite.transform.center.x + ' y: ' + sprite.transform.center.y);
            Phaser.DebugUtils.line('cameraView x: ' + sprite.cameraView.x + ' y: ' + sprite.cameraView.y + ' width: ' + sprite.cameraView.width + ' height: ' + sprite.cameraView.height);
            Phaser.DebugUtils.line('inCamera: ' + Phaser.DebugUtils.game.renderer.spriteRenderer.inCamera(Phaser.DebugUtils.game.camera, sprite));
        };

        DebugUtils.renderSpriteBounds = function (sprite, camera, color) {
            if (typeof camera === "undefined") { camera = null; }
            if (typeof color === "undefined") { color = 'rgba(0,255,0,0.2)'; }
            if (camera == null) {
                camera = Phaser.DebugUtils.game.camera;
            }

            var dx = sprite.worldView.x;
            var dy = sprite.worldView.y;

            Phaser.DebugUtils.context.fillStyle = color;
            Phaser.DebugUtils.context.fillRect(dx, dy, sprite.width, sprite.height);
        };

        DebugUtils.renderPixel = function (x, y, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,1)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.fillRect(x, y, 1, 1);
        };

        DebugUtils.renderPoint = function (point, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,1)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.fillRect(point.x, point.y, 1, 1);
        };

        DebugUtils.renderRectangle = function (rect, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,0.3)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        };

        DebugUtils.renderCircle = function (circle, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,0.3)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            Phaser.DebugUtils.context.fill();
        };

        DebugUtils.renderText = /**
        * Render text
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        function (text, x, y, color, font) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            if (typeof font === "undefined") { font = '16px Courier'; }
            Phaser.DebugUtils.context.font = font;
            Phaser.DebugUtils.context.fillStyle = color;
            Phaser.DebugUtils.context.fillText(text, x, y);
        };
        DebugUtils.font = '14px Courier';
        DebugUtils.lineHeight = 16;

        DebugUtils.renderShadow = true;
        return DebugUtils;
    })();
    Phaser.DebugUtils = DebugUtils;
})(Phaser || (Phaser = {}));
/// <reference path="../_definitions.ts" />
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../_definitions.ts" />
        (function (Headless) {
            var HeadlessRenderer = (function () {
                function HeadlessRenderer(game) {
                    this.game = game;
                }
                HeadlessRenderer.prototype.render = function () {
                    //  Nothing, headless remember?
                };

                HeadlessRenderer.prototype.renderGameObject = function (camera, object) {
                    //  Nothing, headless remember?
                };
                return HeadlessRenderer;
            })();
            Headless.HeadlessRenderer = HeadlessRenderer;
        })(Renderer.Headless || (Renderer.Headless = {}));
        var Headless = Renderer.Headless;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var CameraRenderer = (function () {
                function CameraRenderer(game) {
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._fx = 1;
                    this._fy = 1;
                    this._tx = 0;
                    this._ty = 0;
                    this._gac = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this.game = game;
                }
                CameraRenderer.prototype.preRender = function (camera) {
                    if (camera.visible == false || camera.transform.scale.x == 0 || camera.transform.scale.y == 0 || camera.texture.alpha < 0.1) {
                        return false;
                    }

                    if (this.game.device.patchAndroidClearRectBug) {
                        camera.texture.context.fillStyle = 'rgb(0,0,0)';
                        camera.texture.context.fillRect(0, 0, camera.width, camera.height);
                    } else {
                        camera.texture.context.clearRect(0, 0, camera.width, camera.height);
                    }

                    if (camera.texture.alpha !== 1 && camera.texture.context.globalAlpha != camera.texture.alpha) {
                        this._ga = camera.texture.context.globalAlpha;
                        camera.texture.context.globalAlpha = camera.texture.alpha;
                    }

                    if (camera.texture.opaque) {
                        camera.texture.context.fillStyle = camera.texture.backgroundColor;
                        camera.texture.context.fillRect(0, 0, camera.width, camera.height);
                    }

                    if (camera.texture.globalCompositeOperation) {
                        camera.texture.context.globalCompositeOperation = camera.texture.globalCompositeOperation;
                    }

                    camera.plugins.preRender();
                };

                CameraRenderer.prototype.postRender = function (camera) {
                    if (this._ga > -1) {
                        camera.texture.context.globalAlpha = this._ga;
                    }

                    camera.plugins.postRender();

                    //  Reset our temp vars
                    this._ga = -1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = camera.width;
                    this._sh = camera.height;
                    this._fx = camera.transform.scale.x;
                    this._fy = camera.transform.scale.y;
                    this._sin = 0;
                    this._cos = 1;
                    this._dx = camera.screenView.x;
                    this._dy = camera.screenView.y;
                    this._dw = camera.width;
                    this._dh = camera.height;

                    this.game.stage.context.save();

                    if (camera.texture.flippedX) {
                        this._fx = -camera.transform.scale.x;
                    }

                    if (camera.texture.flippedY) {
                        this._fy = -camera.transform.scale.y;
                    }

                    if (camera.modified) {
                        if (camera.transform.rotation !== 0 || camera.transform.rotationOffset !== 0) {
                            this._sin = Math.sin(camera.game.math.degreesToRadians(camera.transform.rotationOffset + camera.transform.rotation));
                            this._cos = Math.cos(camera.game.math.degreesToRadians(camera.transform.rotationOffset + camera.transform.rotation));
                        }

                        this.game.stage.context.setTransform(this._cos * this._fx, (this._sin * this._fx) + camera.transform.skew.x, -(this._sin * this._fy) + camera.transform.skew.y, this._cos * this._fy, this._dx, this._dy);

                        this._dx = camera.transform.origin.x * -this._dw;
                        this._dy = camera.transform.origin.y * -this._dh;
                    } else {
                        this._dx -= (this._dw * camera.transform.origin.x);
                        this._dy -= (this._dh * camera.transform.origin.y);
                    }

                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);

                    if (this._sw <= 0 || this._sh <= 0 || this._dw <= 0 || this._dh <= 0) {
                        this.game.stage.context.restore();
                        return false;
                    }

                    this.game.stage.context.drawImage(camera.texture.canvas, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);

                    this.game.stage.context.restore();
                };
                return CameraRenderer;
            })();
            Canvas.CameraRenderer = CameraRenderer;
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var GeometryRenderer = (function () {
                function GeometryRenderer(game) {
                    //  Local rendering related temp vars to help avoid gc spikes through constant var creation
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._fx = 1;
                    this._fy = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this.game = game;
                }
                GeometryRenderer.prototype.renderCircle = function (camera, circle, context, outline, fill, lineColor, fillColor, lineWidth) {
                    if (typeof outline === "undefined") { outline = false; }
                    if (typeof fill === "undefined") { fill = true; }
                    if (typeof lineColor === "undefined") { lineColor = 'rgb(0,255,0)'; }
                    if (typeof fillColor === "undefined") { fillColor = 'rgba(0,100,0.0.3)'; }
                    if (typeof lineWidth === "undefined") { lineWidth = 1; }
                    //  Reset our temp vars
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = circle.diameter;
                    this._sh = circle.diameter;
                    this._fx = 1;
                    this._fy = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this._dx = camera.screenView.x + circle.x - camera.worldView.x;
                    this._dy = camera.screenView.y + circle.y - camera.worldView.y;
                    this._dw = circle.diameter;
                    this._dh = circle.diameter;

                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);

                    this.game.stage.saveCanvasValues();

                    context.save();
                    context.lineWidth = lineWidth;
                    context.strokeStyle = lineColor;
                    context.fillStyle = fillColor;

                    context.beginPath();
                    context.arc(this._dx, this._dy, circle.radius, 0, Math.PI * 2);
                    context.closePath();

                    if (outline) {
                        //context.stroke();
                    }

                    if (fill) {
                        context.fill();
                    }

                    context.restore();

                    this.game.stage.restoreCanvasValues();

                    return true;
                };
                return GeometryRenderer;
            })();
            Canvas.GeometryRenderer = GeometryRenderer;
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var GroupRenderer = (function () {
                function GroupRenderer(game) {
                    //  Local rendering related temp vars to help avoid gc spikes through var creation
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._fx = 1;
                    this._fy = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this.game = game;
                }
                GroupRenderer.prototype.preRender = function (camera, group) {
                    if (group.visible == false || camera.transform.scale.x == 0 || camera.transform.scale.y == 0 || camera.texture.alpha < 0.1) {
                        return false;
                    }

                    //  Reset our temp vars
                    this._ga = -1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = group.texture.width;
                    this._sh = group.texture.height;
                    this._fx = group.transform.scale.x;
                    this._fy = group.transform.scale.y;
                    this._sin = 0;
                    this._cos = 1;

                    //this._dx = (camera.screenView.x * camera.scrollFactor.x) + camera.frameBounds.x - (camera.worldView.x * camera.scrollFactor.x);
                    //this._dy = (camera.screenView.y * camera.scrollFactor.y) + camera.frameBounds.y - (camera.worldView.y * camera.scrollFactor.y);
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = group.texture.width;
                    this._dh = group.texture.height;

                    if (group.texture.globalCompositeOperation) {
                        group.texture.context.save();
                        group.texture.context.globalCompositeOperation = group.texture.globalCompositeOperation;
                    }

                    if (group.texture.alpha !== 1 && group.texture.context.globalAlpha !== group.texture.alpha) {
                        this._ga = group.texture.context.globalAlpha;
                        group.texture.context.globalAlpha = group.texture.alpha;
                    }

                    if (group.texture.flippedX) {
                        this._fx = -group.transform.scale.x;
                    }

                    if (group.texture.flippedY) {
                        this._fy = -group.transform.scale.y;
                    }

                    if (group.modified) {
                        if (group.transform.rotation !== 0 || group.transform.rotationOffset !== 0) {
                            this._sin = Math.sin(group.game.math.degreesToRadians(group.transform.rotationOffset + group.transform.rotation));
                            this._cos = Math.cos(group.game.math.degreesToRadians(group.transform.rotationOffset + group.transform.rotation));
                        }

                        group.texture.context.save();

                        group.texture.context.setTransform(this._cos * this._fx, (this._sin * this._fx) + group.transform.skew.x, -(this._sin * this._fy) + group.transform.skew.y, this._cos * this._fy, this._dx, this._dy);

                        this._dx = -group.transform.origin.x;
                        this._dy = -group.transform.origin.y;
                    } else {
                        if (!group.transform.origin.equals(0)) {
                            this._dx -= group.transform.origin.x;
                            this._dy -= group.transform.origin.y;
                        }
                    }

                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);

                    if (group.texture.opaque) {
                        group.texture.context.fillStyle = group.texture.backgroundColor;
                        group.texture.context.fillRect(this._dx, this._dy, this._dw, this._dh);
                    }

                    if (group.texture.loaded) {
                        group.texture.context.drawImage(group.texture.texture, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);
                    }

                    return true;
                };

                GroupRenderer.prototype.postRender = function (camera, group) {
                    if (group.modified || group.texture.globalCompositeOperation) {
                        group.texture.context.restore();
                    }

                    if (this._ga > -1) {
                        group.texture.context.globalAlpha = this._ga;
                    }
                };
                return GroupRenderer;
            })();
            Canvas.GroupRenderer = GroupRenderer;
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var ScrollZoneRenderer = (function () {
                function ScrollZoneRenderer(game) {
                    //  Local rendering related temp vars to help avoid gc spikes through constant var creation
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._fx = 1;
                    this._fy = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this.game = game;
                }
                /**
                * Check whether this object is visible in a specific camera Rectangle.
                * @param camera {Rectangle} The Rectangle you want to check.
                * @return {boolean} Return true if bounds of this sprite intersects the given Rectangle, otherwise return false.
                */
                ScrollZoneRenderer.prototype.inCamera = function (camera, scrollZone) {
                    if (scrollZone.transform.scrollFactor.equals(0)) {
                        return true;
                    }

                    //return RectangleUtils.intersects(sprite.cameraView, camera.screenView);
                    return true;
                };

                ScrollZoneRenderer.prototype.render = function (camera, scrollZone) {
                    if (scrollZone.transform.scale.x == 0 || scrollZone.transform.scale.y == 0 || scrollZone.texture.alpha < 0.1 || this.inCamera(camera, scrollZone) == false) {
                        return false;
                    }

                    //  Reset our temp vars
                    this._ga = -1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = scrollZone.width;
                    this._sh = scrollZone.height;
                    this._fx = scrollZone.transform.scale.x;
                    this._fy = scrollZone.transform.scale.y;
                    this._sin = 0;
                    this._cos = 1;
                    this._dx = (camera.screenView.x * scrollZone.transform.scrollFactor.x) + scrollZone.x - (camera.worldView.x * scrollZone.transform.scrollFactor.x);
                    this._dy = (camera.screenView.y * scrollZone.transform.scrollFactor.y) + scrollZone.y - (camera.worldView.y * scrollZone.transform.scrollFactor.y);
                    this._dw = scrollZone.width;
                    this._dh = scrollZone.height;

                    if (scrollZone.texture.alpha !== 1) {
                        this._ga = scrollZone.texture.context.globalAlpha;
                        scrollZone.texture.context.globalAlpha = scrollZone.texture.alpha;
                    }

                    if (scrollZone.texture.flippedX) {
                        this._fx = -scrollZone.transform.scale.x;
                    }

                    if (scrollZone.texture.flippedY) {
                        this._fy = -scrollZone.transform.scale.y;
                    }

                    if (scrollZone.modified) {
                        if (scrollZone.texture.renderRotation == true && (scrollZone.rotation !== 0 || scrollZone.transform.rotationOffset !== 0)) {
                            this._sin = Math.sin(scrollZone.game.math.degreesToRadians(scrollZone.transform.rotationOffset + scrollZone.rotation));
                            this._cos = Math.cos(scrollZone.game.math.degreesToRadians(scrollZone.transform.rotationOffset + scrollZone.rotation));
                        }

                        scrollZone.texture.context.save();

                        scrollZone.texture.context.setTransform(this._cos * this._fx, (this._sin * this._fx) + scrollZone.transform.skew.x, -(this._sin * this._fy) + scrollZone.transform.skew.y, this._cos * this._fy, this._dx, this._dy);

                        this._dx = -scrollZone.transform.origin.x;
                        this._dy = -scrollZone.transform.origin.y;
                    } else {
                        if (!scrollZone.transform.origin.equals(0)) {
                            this._dx -= scrollZone.transform.origin.x;
                            this._dy -= scrollZone.transform.origin.y;
                        }
                    }

                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);

                    for (var i = 0; i < scrollZone.regions.length; i++) {
                        if (scrollZone.texture.isDynamic) {
                            scrollZone.regions[i].render(scrollZone.texture.context, scrollZone.texture.texture, this._dx, this._dy, this._dw, this._dh);
                        } else {
                            scrollZone.regions[i].render(scrollZone.texture.context, scrollZone.texture.texture, this._dx, this._dy, this._dw, this._dh);
                        }
                    }

                    if (scrollZone.modified) {
                        scrollZone.texture.context.restore();
                    }

                    if (this._ga > -1) {
                        scrollZone.texture.context.globalAlpha = this._ga;
                    }

                    this.game.renderer.renderCount++;

                    return true;
                };
                return ScrollZoneRenderer;
            })();
            Canvas.ScrollZoneRenderer = ScrollZoneRenderer;
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var SpriteRenderer = (function () {
                function SpriteRenderer(game) {
                    //  Local rendering related temp vars to help avoid gc spikes through constant var creation
                    //private _c: number = 0;
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this.game = game;
                }
                /**
                * Check whether this object is visible in a specific camera Rectangle.
                * @param camera {Rectangle} The Rectangle you want to check.
                * @return {boolean} Return true if bounds of this sprite intersects the given Rectangle, otherwise return false.
                */
                SpriteRenderer.prototype.inCamera = function (camera, sprite) {
                    if (sprite.transform.scrollFactor.equals(0)) {
                        return true;
                    }

                    //return RectangleUtils.intersects(sprite.cameraView, camera.screenView);
                    return true;
                };

                /**
                * Render this sprite to specific camera. Called by game loop after update().
                * @param camera {Camera} Camera this sprite will be rendered to.
                * @return {boolean} Return false if not rendered, otherwise return true.
                */
                SpriteRenderer.prototype.render = function (camera, sprite) {
                    Phaser.SpriteUtils.updateCameraView(camera, sprite);

                    if (sprite.transform.scale.x == 0 || sprite.transform.scale.y == 0 || sprite.texture.alpha < 0.1 || this.inCamera(camera, sprite) == false) {
                        return false;
                    }

                    //  Reset our temp vars
                    this._ga = -1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = sprite.texture.width;
                    this._sh = sprite.texture.height;

                    //this._dx = camera.screenView.x + sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x);
                    //this._dy = camera.screenView.y + sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y);
                    this._dx = sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x);
                    this._dy = sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y);
                    this._dw = sprite.texture.width;
                    this._dh = sprite.texture.height;

                    if (sprite.animations.currentFrame !== null) {
                        this._sx = sprite.animations.currentFrame.x;
                        this._sy = sprite.animations.currentFrame.y;

                        if (sprite.animations.currentFrame.trimmed) {
                            this._dx += sprite.animations.currentFrame.spriteSourceSizeX;
                            this._dy += sprite.animations.currentFrame.spriteSourceSizeY;
                            this._sw = sprite.animations.currentFrame.spriteSourceSizeW;
                            this._sh = sprite.animations.currentFrame.spriteSourceSizeH;
                            this._dw = sprite.animations.currentFrame.spriteSourceSizeW;
                            this._dh = sprite.animations.currentFrame.spriteSourceSizeH;
                        }
                    }

                    if (sprite.modified) {
                        camera.texture.context.save();

                        camera.texture.context.setTransform(sprite.transform.local.data[0], sprite.transform.local.data[3], sprite.transform.local.data[1], sprite.transform.local.data[4], this._dx, this._dy);

                        this._dx = sprite.transform.origin.x * -this._dw;
                        this._dy = sprite.transform.origin.y * -this._dh;
                    } else {
                        this._dx -= (this._dw * sprite.transform.origin.x);
                        this._dy -= (this._dh * sprite.transform.origin.y);
                    }

                    if (sprite.crop) {
                        this._sx += sprite.crop.x * sprite.transform.scale.x;
                        this._sy += sprite.crop.y * sprite.transform.scale.y;
                        this._sw = sprite.crop.width * sprite.transform.scale.x;
                        this._sh = sprite.crop.height * sprite.transform.scale.y;
                        this._dx += sprite.crop.x * sprite.transform.scale.x;
                        this._dy += sprite.crop.y * sprite.transform.scale.y;
                        this._dw = sprite.crop.width * sprite.transform.scale.x;
                        this._dh = sprite.crop.height * sprite.transform.scale.y;
                    }

                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);

                    if (this._sw <= 0 || this._sh <= 0 || this._dw <= 0 || this._dh <= 0) {
                        return false;
                    }

                    if (sprite.texture.globalCompositeOperation) {
                        camera.texture.context.save();
                        camera.texture.context.globalCompositeOperation = sprite.texture.globalCompositeOperation;
                    }

                    if (sprite.texture.alpha !== 1 && camera.texture.context.globalAlpha != sprite.texture.alpha) {
                        this._ga = sprite.texture.context.globalAlpha;
                        camera.texture.context.globalAlpha = sprite.texture.alpha;
                    }

                    if (sprite.texture.opaque) {
                        camera.texture.context.fillStyle = sprite.texture.backgroundColor;
                        camera.texture.context.fillRect(this._dx, this._dy, this._dw, this._dh);
                    }

                    if (sprite.texture.loaded) {
                        camera.texture.context.drawImage(sprite.texture.texture, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);
                    }

                    if (sprite.modified || sprite.texture.globalCompositeOperation) {
                        camera.texture.context.restore();
                    }

                    if (this._ga > -1) {
                        camera.texture.context.globalAlpha = this._ga;
                    }

                    sprite.renderOrderID = this.game.renderer.renderCount;

                    this.game.renderer.renderCount++;

                    return true;
                };
                return SpriteRenderer;
            })();
            Canvas.SpriteRenderer = SpriteRenderer;
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var TilemapRenderer = (function () {
                function TilemapRenderer(game) {
                    //  Local rendering related temp vars to help avoid gc spikes through constant var creation
                    this._ga = 1;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._tx = 0;
                    this._ty = 0;
                    this._tl = 0;
                    this._maxX = 0;
                    this._maxY = 0;
                    this._startX = 0;
                    this._startY = 0;
                    this.game = game;
                }
                /**
                * Render a tilemap to a specific camera.
                * @param camera {Camera} The camera this tilemap will be rendered to.
                */
                TilemapRenderer.prototype.render = function (camera, tilemap) {
                    //  Loop through the layers
                    this._tl = tilemap.layers.length;

                    for (var i = 0; i < this._tl; i++) {
                        if (tilemap.layers[i].visible == false || tilemap.layers[i].alpha < 0.1) {
                            continue;
                        }

                        var layer = tilemap.layers[i];

                        //  Work out how many tiles we can fit into our camera and round it up for the edges
                        this._maxX = this.game.math.ceil(camera.width / layer.tileWidth) + 1;
                        this._maxY = this.game.math.ceil(camera.height / layer.tileHeight) + 1;

                        //  And now work out where in the tilemap the camera actually is
                        this._startX = this.game.math.floor(camera.worldView.x / layer.tileWidth);
                        this._startY = this.game.math.floor(camera.worldView.y / layer.tileHeight);

                        if (this._startX < 0) {
                            this._startX = 0;
                        }

                        if (this._startY < 0) {
                            this._startY = 0;
                        }

                        if (this._maxX > layer.widthInTiles) {
                            this._maxX = layer.widthInTiles;
                        }

                        if (this._maxY > layer.heightInTiles) {
                            this._maxY = layer.heightInTiles;
                        }

                        if (this._startX + this._maxX > layer.widthInTiles) {
                            this._startX = layer.widthInTiles - this._maxX;
                        }

                        if (this._startY + this._maxY > layer.heightInTiles) {
                            this._startY = layer.heightInTiles - this._maxY;
                        }

                        //  Finally get the offset to avoid the blocky movement
                        //this._dx = (camera.screenView.x * layer.transform.scrollFactor.x) - (camera.worldView.x * layer.transform.scrollFactor.x);
                        //this._dy = (camera.screenView.y * layer.transform.scrollFactor.y) - (camera.worldView.y * layer.transform.scrollFactor.y);
                        //this._dx = (camera.screenView.x * this.scrollFactor.x) + this.x - (camera.worldView.x * this.scrollFactor.x);
                        //this._dy = (camera.screenView.y * this.scrollFactor.y) + this.y - (camera.worldView.y * this.scrollFactor.y);
                        this._dx = 0;
                        this._dy = 0;

                        this._dx += -(camera.worldView.x - (this._startX * layer.tileWidth));
                        this._dy += -(camera.worldView.y - (this._startY * layer.tileHeight));

                        this._tx = this._dx;
                        this._ty = this._dy;

                        if (layer.texture.alpha !== 1) {
                            this._ga = layer.texture.context.globalAlpha;
                            layer.texture.context.globalAlpha = layer.texture.alpha;
                        }

                        for (var row = this._startY; row < this._startY + this._maxY; row++) {
                            this._columnData = layer.mapData[row];

                            for (var tile = this._startX; tile < this._startX + this._maxX; tile++) {
                                if (layer.tileOffsets[this._columnData[tile]]) {
                                    layer.texture.context.drawImage(layer.texture.texture, layer.tileOffsets[this._columnData[tile]].x, layer.tileOffsets[this._columnData[tile]].y, layer.tileWidth, layer.tileHeight, this._tx, this._ty, layer.tileWidth, layer.tileHeight);
                                }

                                this._tx += layer.tileWidth;
                            }

                            this._tx = this._dx;
                            this._ty += layer.tileHeight;
                        }

                        if (this._ga > -1) {
                            layer.texture.context.globalAlpha = this._ga;
                        }
                    }

                    return true;
                };
                return TilemapRenderer;
            })();
            Canvas.TilemapRenderer = TilemapRenderer;
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var CanvasRenderer = (function () {
                function CanvasRenderer(game) {
                    this._c = 0;
                    this.game = game;

                    this.cameraRenderer = new Phaser.Renderer.Canvas.CameraRenderer(game);
                    this.groupRenderer = new Phaser.Renderer.Canvas.GroupRenderer(game);
                    this.spriteRenderer = new Phaser.Renderer.Canvas.SpriteRenderer(game);
                    this.geometryRenderer = new Phaser.Renderer.Canvas.GeometryRenderer(game);
                    this.scrollZoneRenderer = new Phaser.Renderer.Canvas.ScrollZoneRenderer(game);
                    this.tilemapRenderer = new Phaser.Renderer.Canvas.TilemapRenderer(game);
                }
                CanvasRenderer.prototype.render = function () {
                    this._cameraList = this.game.world.getAllCameras();
                    this.renderCount = 0;

                    for (this._c = 0; this._c < this._cameraList.length; this._c++) {
                        if (this._cameraList[this._c].visible) {
                            this.cameraRenderer.preRender(this._cameraList[this._c]);

                            this.game.world.group.render(this._cameraList[this._c]);

                            this.cameraRenderer.postRender(this._cameraList[this._c]);
                        }
                    }

                    this.renderTotal = this.renderCount;
                };

                CanvasRenderer.prototype.renderGameObject = function (camera, object) {
                    if (object.type == Phaser.Types.SPRITE || object.type == Phaser.Types.BUTTON) {
                        this.spriteRenderer.render(camera, object);
                    } else if (object.type == Phaser.Types.SCROLLZONE) {
                        this.scrollZoneRenderer.render(camera, object);
                    } else if (object.type == Phaser.Types.TILEMAP) {
                        this.tilemapRenderer.render(camera, object);
                    }
                };
                return CanvasRenderer;
            })();
            Canvas.CanvasRenderer = CanvasRenderer;
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
/// <reference path="_definitions.ts" />
/**
* World
*
* "This world is but a canvas to our imagination." - Henry David Thoreau
*
* A game has only one world. The world is an abstract place in which all game objects live. It is not bound
* by stage limits and can be any size. You look into the world via cameras. All game objects live within
* the world at world-based coordinates. By default a world is created the same size as your Stage.
*
* @package    Phaser.World
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var World = (function () {
        /**
        * World constructor
        * Create a new <code>World</code> with specific width and height.
        *
        * @param width {number} Width of the world bound.
        * @param height {number} Height of the world bound.
        */
        function World(game, width, height) {
            /**
            * Object container stores every object created with `create*` methods.
            * @type {Group}
            */
            this._groupCounter = 0;
            this.game = game;

            this.cameras = new Phaser.CameraManager(this.game, 0, 0, width, height);

            this.bounds = new Phaser.Rectangle(0, 0, width, height);
        }
        World.prototype.getNextGroupID = function () {
            return this._groupCounter++;
        };

        /**
        * Called once by Game during the boot process.
        */
        World.prototype.boot = function () {
            this.group = new Phaser.Group(this.game, 0);
        };

        /**
        * This is called automatically every frame, and is where main logic happens.
        */
        World.prototype.update = function () {
            this.group.update();
            this.cameras.update();
        };

        /**
        * This is called automatically every frame, and is where main logic happens.
        */
        World.prototype.postUpdate = function () {
            this.group.postUpdate();
            this.cameras.postUpdate();
        };

        /**
        * Clean up memory.
        */
        World.prototype.destroy = function () {
            this.group.destroy();
            this.cameras.destroy();
        };

        /**
        * Updates the size of this world.
        *
        * @param width {number} New width of the world.
        * @param height {number} New height of the world.
        * @param [updateCameraBounds] {boolean} Update camera bounds automatically or not. Default to true.
        */
        World.prototype.setSize = function (width, height, updateCameraBounds) {
            if (typeof updateCameraBounds === "undefined") { updateCameraBounds = true; }
            this.bounds.width = width;
            this.bounds.height = height;

            if (updateCameraBounds == true) {
                this.game.camera.setBounds(0, 0, width, height);
            }
            // dispatch world resize event
        };

        Object.defineProperty(World.prototype, "width", {
            get: function () {
                return this.bounds.width;
            },
            set: function (value) {
                this.bounds.width = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(World.prototype, "height", {
            get: function () {
                return this.bounds.height;
            },
            set: function (value) {
                this.bounds.height = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(World.prototype, "centerX", {
            get: function () {
                return this.bounds.halfWidth;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(World.prototype, "centerY", {
            get: function () {
                return this.bounds.halfHeight;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(World.prototype, "randomX", {
            get: function () {
                return Math.round(Math.random() * this.bounds.width);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(World.prototype, "randomY", {
            get: function () {
                return Math.round(Math.random() * this.bounds.height);
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Get all the cameras.
        *
        * @returns {array} An array contains all the cameras.
        */
        World.prototype.getAllCameras = function () {
            return this.cameras.getAll();
        };
        return World;
    })();
    Phaser.World = World;
})(Phaser || (Phaser = {}));
/// <reference path="_definitions.ts" />
/**
* Stage
*
* The Stage controls the canvas on which everything is displayed. It handles display within the browser,
* focus handling, game resizing, scaling and the pause, boot and orientation screens.
*
* @package    Phaser.Stage
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var Stage = (function () {
        /**
        * Stage constructor
        *
        * Create a new <code>Stage</code> with specific width and height.
        *
        * @param parent {number} ID of parent DOM element.
        * @param width {number} Width of the stage.
        * @param height {number} Height of the stage.
        */
        function Stage(game, parent, width, height) {
            var _this = this;
            /**
            * Background color of the stage (defaults to black). Set via the public backgroundColor property.
            * @type {string}
            */
            this._backgroundColor = 'rgb(0,0,0)';
            /**
            * Clear the whole stage every frame? (Default to true)
            * @type {boolean}
            */
            this.clear = true;
            /**
            * Do not use pause screen when game is paused?
            * (Default to false, aka always use PauseScreen)
            * @type {boolean}
            */
            this.disablePauseScreen = false;
            /**
            * Do not use boot screen when engine starts?
            * (Default to false, aka always use BootScreen)
            * @type {boolean}
            */
            this.disableBootScreen = false;
            /**
            * If set to true the game will never pause when the browser or browser tab loses focuses
            * @type {boolean}
            */
            this.disableVisibilityChange = false;
            this.game = game;

            this.canvas = document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;

            if ((parent !== '' || parent !== null) && document.getElementById(parent)) {
                document.getElementById(parent).appendChild(this.canvas);
                document.getElementById(parent).style.overflow = 'hidden';
            } else {
                document.body.appendChild(this.canvas);
            }

            //  Consume default actions on the canvas
            this.canvas.style.msTouchAction = 'none';
            this.canvas.style['ms-touch-action'] = 'none';
            this.canvas.style['touch-action'] = 'none';
            this.canvas.style.backgroundColor = 'rgb(0,0,0)';
            this.canvas.oncontextmenu = function (event) {
                event.preventDefault();
            };

            this.context = this.canvas.getContext('2d');

            this.css3 = new Phaser.Display.CSS3Filters(this.canvas);

            this.scaleMode = Phaser.StageScaleMode.NO_SCALE;
            this.scale = new Phaser.StageScaleMode(this.game, width, height);

            this.getOffset(this.canvas);
            this.bounds = new Phaser.Rectangle(this.offset.x, this.offset.y, width, height);
            this.aspectRatio = width / height;

            document.addEventListener('visibilitychange', function (event) {
                return _this.visibilityChange(event);
            }, false);
            document.addEventListener('webkitvisibilitychange', function (event) {
                return _this.visibilityChange(event);
            }, false);
            document.addEventListener('pagehide', function (event) {
                return _this.visibilityChange(event);
            }, false);
            document.addEventListener('pageshow', function (event) {
                return _this.visibilityChange(event);
            }, false);
            window.onblur = function (event) {
                return _this.visibilityChange(event);
            };
            window.onfocus = function (event) {
                return _this.visibilityChange(event);
            };
        }
        /**
        * Stage boot
        */
        Stage.prototype.boot = function () {
            this.bootScreen = new Phaser.BootScreen(this.game);
            this.pauseScreen = new Phaser.PauseScreen(this.game, this.width, this.height);
            this.orientationScreen = new Phaser.OrientationScreen(this.game);

            this.scale.setScreenSize(true);
        };

        /**
        * Update stage for rendering. This will handle scaling, clearing
        * and PauseScreen/BootScreen updating and rendering.
        */
        Stage.prototype.update = function () {
            this.scale.update();

            this.context.setTransform(1, 0, 0, 1, 0, 0);

            if (this.clear || (this.game.paused && this.disablePauseScreen == false)) {
                if (this.game.device.patchAndroidClearRectBug) {
                    this.context.fillStyle = 'rgb(0,0,0)';
                    this.context.fillRect(0, 0, this.width, this.height);
                } else {
                    this.context.clearRect(0, 0, this.width, this.height);
                }
            }

            if (this.game.paused && this.scale.incorrectOrientation) {
                this.orientationScreen.update();
                this.orientationScreen.render();
                return;
            }

            if (this.game.isRunning == false && this.disableBootScreen == false) {
                this.bootScreen.update();
                this.bootScreen.render();
            }

            if (this.game.paused && this.disablePauseScreen == false) {
                this.pauseScreen.update();
                this.pauseScreen.render();
            }
        };

        /**
        * This method is called when the canvas elements visibility is changed.
        */
        Stage.prototype.visibilityChange = function (event) {
            if (this.disableVisibilityChange) {
                return;
            }

            if (event.type == 'pagehide' || event.type == 'blur' || document['hidden'] == true || document['webkitHidden'] == true) {
                if (this.game.paused == false) {
                    this.pauseGame();
                }
            } else {
                if (this.game.paused == true) {
                    this.resumeGame();
                }
            }
        };

        Stage.prototype.enableOrientationCheck = function (forceLandscape, forcePortrait, imageKey) {
            if (typeof imageKey === "undefined") { imageKey = ''; }
            this.scale.forceLandscape = forceLandscape;
            this.scale.forcePortrait = forcePortrait;
            this.orientationScreen.enable(forceLandscape, forcePortrait, imageKey);

            if (forceLandscape || forcePortrait) {
                if ((this.scale.isLandscape && forcePortrait) || (this.scale.isPortrait && forceLandscape)) {
                    //  They are in the wrong orientation right now
                    this.game.paused = true;
                    this.scale.incorrectOrientation = true;
                } else {
                    this.scale.incorrectOrientation = false;
                }
            }
        };

        Stage.prototype.setImageRenderingCrisp = function () {
            this.canvas.style['image-rendering'] = 'crisp-edges';
            this.canvas.style['image-rendering'] = '-moz-crisp-edges';
            this.canvas.style['image-rendering'] = '-webkit-optimize-contrast';
            this.canvas.style['-ms-interpolation-mode'] = 'nearest-neighbor';
        };

        Stage.prototype.pauseGame = function () {
            this.game.paused = true;

            if (this.disablePauseScreen == false && this.pauseScreen) {
                this.pauseScreen.onPaused();
            }

            this.saveCanvasValues();
        };

        Stage.prototype.resumeGame = function () {
            if (this.disablePauseScreen == false && this.pauseScreen) {
                this.pauseScreen.onResume();
            }

            this.restoreCanvasValues();

            this.game.paused = false;
        };

        /**
        * Get the DOM offset values of the given element
        */
        Stage.prototype.getOffset = function (element, populateOffset) {
            if (typeof populateOffset === "undefined") { populateOffset = true; }
            var box = element.getBoundingClientRect();

            var clientTop = element.clientTop || document.body.clientTop || 0;
            var clientLeft = element.clientLeft || document.body.clientLeft || 0;
            var scrollTop = window.pageYOffset || element.scrollTop || document.body.scrollTop;
            var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;

            if (populateOffset) {
                this.offset = new Phaser.Point(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
                return this.offset;
            } else {
                return new Phaser.Point(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
            }
        };

        /**
        * Save current canvas properties (strokeStyle, lineWidth and fillStyle) for later using.
        */
        Stage.prototype.saveCanvasValues = function () {
            this.strokeStyle = this.context.strokeStyle;
            this.lineWidth = this.context.lineWidth;
            this.fillStyle = this.context.fillStyle;
        };

        /**
        * Restore current canvas values (strokeStyle, lineWidth and fillStyle) with saved values.
        */
        Stage.prototype.restoreCanvasValues = function () {
            this.context.strokeStyle = this.strokeStyle;
            this.context.lineWidth = this.lineWidth;
            this.context.fillStyle = this.fillStyle;

            if (this.game.device.patchAndroidClearRectBug) {
                this.context.fillStyle = 'rgb(0,0,0)';
                this.context.fillRect(0, 0, this.width, this.height);
            } else {
                this.context.clearRect(0, 0, this.width, this.height);
            }
        };


        Object.defineProperty(Stage.prototype, "backgroundColor", {
            get: function () {
                return this._backgroundColor;
            },
            set: function (color) {
                this.canvas.style.backgroundColor = color;
                this._backgroundColor = color;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "x", {
            get: function () {
                return this.bounds.x;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "y", {
            get: function () {
                return this.bounds.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "width", {
            get: function () {
                return this.bounds.width;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "height", {
            get: function () {
                return this.bounds.height;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "centerX", {
            get: function () {
                return this.bounds.halfWidth;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "centerY", {
            get: function () {
                return this.bounds.halfHeight;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "randomX", {
            get: function () {
                return Math.round(Math.random() * this.bounds.width);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "randomY", {
            get: function () {
                return Math.round(Math.random() * this.bounds.height);
            },
            enumerable: true,
            configurable: true
        });
        return Stage;
    })();
    Phaser.Stage = Stage;
})(Phaser || (Phaser = {}));
/// <reference path="_definitions.ts" />
/**
* State
*
* This is a base State class which can be extended if you are creating your game with TypeScript.
* It provides quick access to common functions such as the camera, cache, input, match, sound and more.
*
* @package    Phaser.State
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var State = (function () {
        /**
        * State constructor
        * Create a new <code>State</code>.
        */
        function State(game) {
            this.game = game;

            this.add = game.add;
            this.camera = game.camera;
            this.cache = game.cache;
            this.input = game.input;
            this.load = game.load;
            this.math = game.math;
            this.sound = game.sound;
            this.stage = game.stage;
            this.time = game.time;
            this.tweens = game.tweens;
            this.world = game.world;
        }
        //  Override these in your own States
        /**
        * Override this method to add some load operations.
        * If you need to use the loader, you may need to use them here.
        */
        State.prototype.init = function () {
        };

        /**
        * This method is called after the game engine successfully switches states.
        * Feel free to add any setup code here.(Do not load anything here, override init() instead)
        */
        State.prototype.create = function () {
        };

        /**
        * Put update logic here.
        */
        State.prototype.update = function () {
        };

        /**
        * Put render operations here.
        */
        State.prototype.render = function () {
        };

        /**
        * This method will be called when game paused.
        */
        State.prototype.paused = function () {
        };

        /**
        * This method will be called when the state is destroyed
        */
        State.prototype.destroy = function () {
        };
        return State;
    })();
    Phaser.State = State;
})(Phaser || (Phaser = {}));
/// <reference path="_definitions.ts" />
/**
* Game
*
* This is where the magic happens. The Game object is the heart of your game,
* providing quick access to common functions and handling the boot process.
*
* "Hell, there are no rules here - we're trying to accomplish something."
*                                                       Thomas A. Edison
*
* @package    Phaser.Game
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var Game = (function () {
        /**
        * Game constructor
        *
        * Instantiate a new <code>Phaser.Game</code> object.
        *
        * @constructor
        * @param callbackContext Which context will the callbacks be called with.
        * @param parent {string} ID of its parent DOM element.
        * @param width {number} The width of your game in game pixels.
        * @param height {number} The height of your game in game pixels.
        * @param preloadCallback {function} Preload callback invoked when init default screen.
        * @param createCallback {function} Create callback invoked when create default screen.
        * @param updateCallback {function} Update callback invoked when update default screen.
        * @param renderCallback {function} Render callback invoked when render default screen.
        * @param destroyCallback {function} Destroy callback invoked when state is destroyed.
        */
        function Game(callbackContext, parent, width, height, preloadCallback, createCallback, updateCallback, renderCallback, destroyCallback) {
            if (typeof parent === "undefined") { parent = ''; }
            if (typeof width === "undefined") { width = 800; }
            if (typeof height === "undefined") { height = 600; }
            if (typeof preloadCallback === "undefined") { preloadCallback = null; }
            if (typeof createCallback === "undefined") { createCallback = null; }
            if (typeof updateCallback === "undefined") { updateCallback = null; }
            if (typeof renderCallback === "undefined") { renderCallback = null; }
            if (typeof destroyCallback === "undefined") { destroyCallback = null; }
            var _this = this;
            /**
            * Whether load complete loading or not.
            * @type {boolean}
            */
            this._loadComplete = false;
            /**
            * Game is paused?
            * @type {boolean}
            */
            this._paused = false;
            /**
            * The state to be switched to in the next frame.
            * @type {State}
            */
            this._pendingState = null;
            /**
            * The current State object (defaults to null)
            * @type {State}
            */
            this.state = null;
            /**
            * This will be called when init states. (loading assets...)
            * @type {function}
            */
            this.onPreloadCallback = null;
            /**
            * This will be called when create states. (setup states...)
            * @type {function}
            */
            this.onCreateCallback = null;
            /**
            * This will be called when State is updated, this doesn't happen during load (see onLoadUpdateCallback)
            * @type {function}
            */
            this.onUpdateCallback = null;
            /**
            * This will be called when the State is rendered, this doesn't happen during load (see onLoadRenderCallback)
            * @type {function}
            */
            this.onRenderCallback = null;
            /**
            * This will be called before the State is rendered and before the stage is cleared
            * @type {function}
            */
            this.onPreRenderCallback = null;
            /**
            * This will be called when the State is updated but only during the load process
            * @type {function}
            */
            this.onLoadUpdateCallback = null;
            /**
            * This will be called when the State is rendered but only during the load process
            * @type {function}
            */
            this.onLoadRenderCallback = null;
            /**
            * This will be called when states paused.
            * @type {function}
            */
            this.onPausedCallback = null;
            /**
            * This will be called when the state is destroyed (i.e. swapping to a new state)
            * @type {function}
            */
            this.onDestroyCallback = null;
            /**
            * Whether the game engine is booted, aka available.
            * @type {boolean}
            */
            this.isBooted = false;
            /**
            * Is game running or paused?
            * @type {boolean}
            */
            this.isRunning = false;
            this.id = Phaser.GAMES.push(this) - 1;

            this.callbackContext = callbackContext;
            this.onPreloadCallback = preloadCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;

            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(function () {
                    return Phaser.GAMES[_this.id].boot(parent, width, height);
                });
            } else {
                document.addEventListener('DOMContentLoaded', Phaser.GAMES[this.id].boot(parent, width, height), false);
                window.addEventListener('load', Phaser.GAMES[this.id].boot(parent, width, height), false);
            }
        }
        /**
        * Initialize engine sub modules and start the game.
        * @param parent {string} ID of parent Dom element.
        * @param width {number} Width of the game screen.
        * @param height {number} Height of the game screen.
        */
        Game.prototype.boot = function (parent, width, height) {
            var _this = this;
            if (this.isBooted == true) {
                return;
            }

            if (!document.body) {
                setTimeout(function () {
                    return Phaser.GAMES[_this.id].boot(parent, width, height);
                }, 13);
            } else {
                document.removeEventListener('DOMContentLoaded', Phaser.GAMES[this.id].boot);
                window.removeEventListener('load', Phaser.GAMES[this.id].boot);

                this.onPause = new Phaser.Signal();
                this.onResume = new Phaser.Signal();

                this.device = new Phaser.Device();
                this.net = new Phaser.Net(this);
                this.math = new Phaser.GameMath(this);
                this.stage = new Phaser.Stage(this, parent, width, height);
                this.world = new Phaser.World(this, width, height);
                this.add = new Phaser.GameObjectFactory(this);
                this.cache = new Phaser.Cache(this);
                this.load = new Phaser.Loader(this);
                this.time = new Phaser.TimeManager(this);
                this.tweens = new Phaser.TweenManager(this);
                this.input = new Phaser.InputManager(this);
                this.sound = new Phaser.SoundManager(this);
                this.rnd = new Phaser.RandomDataGenerator([(Date.now() * Math.random()).toString()]);

                //this.physics = new Phaser.Physics.Manager(this);
                this.plugins = new Phaser.PluginManager(this, this);

                this.load.onLoadComplete.addOnce(this.loadComplete, this);

                this.setRenderer(Phaser.Types.RENDERER_CANVAS);

                this.world.boot();
                this.stage.boot();
                this.input.boot();

                this.isBooted = true;

                //  Set-up some static helper references
                Phaser.DebugUtils.game = this;
                Phaser.ColorUtils.game = this;
                Phaser.DebugUtils.context = this.stage.context;

                if (this.onPreloadCallback == null && this.onCreateCallback == null && this.onUpdateCallback == null && this.onRenderCallback == null && this._pendingState == null) {
                    this._raf = new Phaser.RequestAnimationFrame(this, this.bootLoop);
                } else {
                    this.isRunning = true;
                    this._loadComplete = false;

                    this._raf = new Phaser.RequestAnimationFrame(this, this.loop);

                    if (this._pendingState) {
                        this.switchState(this._pendingState, false, false);
                    } else {
                        this.startState();
                    }
                }
            }
        };

        /**
        * Called when the load has finished after preload was run.
        */
        Game.prototype.loadComplete = function () {
            this._loadComplete = true;
            this.onCreateCallback.call(this.callbackContext);
        };

        /**
        * The bootLoop is called while the game is still booting (waiting for the DOM and resources to be available)
        */
        Game.prototype.bootLoop = function () {
            this.tweens.update();
            this.input.update();
            this.stage.update();
        };

        /**
        * The pausedLoop is called when the game is paused.
        */
        Game.prototype.pausedLoop = function () {
            this.tweens.update();
            this.input.update();
            this.stage.update();
            this.sound.update();

            if (this.onPausedCallback !== null) {
                this.onPausedCallback.call(this.callbackContext);
            }
        };

        Game.prototype.emptyCallback = function () {
            //   Called by onUpdateCallback etc
        };

        /**
        * Game loop method will be called when it's running.
        */
        Game.prototype.loop = function () {
            this.plugins.preUpdate();

            this.tweens.update();
            this.input.update();
            this.stage.update();
            this.sound.update();

            //this.physics.update();
            this.world.update();
            this.plugins.update();

            if (this._loadComplete && this.onUpdateCallback) {
                this.onUpdateCallback.call(this.callbackContext);
            } else if (this._loadComplete == false && this.onLoadUpdateCallback) {
                this.onLoadUpdateCallback.call(this.callbackContext);
            }

            this.world.postUpdate();

            this.plugins.postUpdate();
            this.plugins.preRender();

            if (this._loadComplete && this.onPreRenderCallback) {
                this.onPreRenderCallback.call(this.callbackContext);
            }

            this.renderer.render();
            this.plugins.render();

            if (this._loadComplete && this.onRenderCallback) {
                this.onRenderCallback.call(this.callbackContext);
            } else if (this._loadComplete == false && this.onLoadRenderCallback) {
                this.onLoadRenderCallback.call(this.callbackContext);
            }

            this.plugins.postRender();
        };

        /**
        * Start current state.
        */
        Game.prototype.startState = function () {
            if (this.onPreloadCallback !== null) {
                this.load.reset();

                this.onPreloadCallback.call(this.callbackContext);

                if (this.load.queueSize == 0) {
                    if (this.onCreateCallback !== null) {
                        this.onCreateCallback.call(this.callbackContext);
                    }

                    this._loadComplete = true;
                } else {
                    //  Start the loader going as we have something in the queue
                    this.load.start();
                }
            } else {
                if (this.onCreateCallback !== null) {
                    this.onCreateCallback.call(this.callbackContext);
                }

                this._loadComplete = true;
            }
        };

        Game.prototype.setRenderer = function (renderer) {
            switch (renderer) {
                case Phaser.Types.RENDERER_AUTO_DETECT:
                    this.renderer = new Phaser.Renderer.Headless.HeadlessRenderer(this);
                    break;

                case Phaser.Types.RENDERER_AUTO_DETECT:
                case Phaser.Types.RENDERER_CANVAS:
                    this.renderer = new Phaser.Renderer.Canvas.CanvasRenderer(this);
                    break;
            }
        };

        /**
        * Set the most common state callbacks (init, create, update, render).
        * @param preloadCallback {function} Init callback invoked when init state.
        * @param createCallback {function} Create callback invoked when create state.
        * @param updateCallback {function} Update callback invoked when update state.
        * @param renderCallback {function} Render callback invoked when render state.
        * @param destroyCallback {function} Destroy callback invoked when state is destroyed.
        */
        Game.prototype.setCallbacks = function (preloadCallback, createCallback, updateCallback, renderCallback, destroyCallback) {
            if (typeof preloadCallback === "undefined") { preloadCallback = null; }
            if (typeof createCallback === "undefined") { createCallback = null; }
            if (typeof updateCallback === "undefined") { updateCallback = null; }
            if (typeof renderCallback === "undefined") { renderCallback = null; }
            if (typeof destroyCallback === "undefined") { destroyCallback = null; }
            this.onPreloadCallback = preloadCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;
        };

        /**
        * Switch to a new State.
        * @param state {State} The state you want to switch to.
        * @param [clearWorld] {boolean} clear everything in the world? (Default to true)
        * @param [clearCache] {boolean} clear asset cache? (Default to false and ONLY available when clearWorld=true)
        */
        Game.prototype.switchState = function (state, clearWorld, clearCache) {
            if (typeof clearWorld === "undefined") { clearWorld = true; }
            if (typeof clearCache === "undefined") { clearCache = false; }
            if (this.isBooted == false) {
                this._pendingState = state;
                return;
            }

            if (this.onDestroyCallback !== null) {
                this.onDestroyCallback.call(this.callbackContext);
            }

            this.input.reset(true);

            if (typeof state === 'function') {
                this.state = new state(this);
            }

            if (this.state['create'] || this.state['update']) {
                this.callbackContext = this.state;

                this.onPreloadCallback = null;
                this.onLoadRenderCallback = null;
                this.onLoadUpdateCallback = null;
                this.onCreateCallback = null;
                this.onUpdateCallback = null;
                this.onRenderCallback = null;
                this.onPreRenderCallback = null;
                this.onPausedCallback = null;
                this.onDestroyCallback = null;

                if (this.state['preload']) {
                    this.onPreloadCallback = this.state['preload'];
                }

                if (this.state['loadRender']) {
                    this.onLoadRenderCallback = this.state['loadRender'];
                }

                if (this.state['loadUpdate']) {
                    this.onLoadUpdateCallback = this.state['loadUpdate'];
                }

                if (this.state['create']) {
                    this.onCreateCallback = this.state['create'];
                }

                if (this.state['update']) {
                    this.onUpdateCallback = this.state['update'];
                }

                if (this.state['preRender']) {
                    this.onPreRenderCallback = this.state['preRender'];
                }

                if (this.state['render']) {
                    this.onRenderCallback = this.state['render'];
                }

                if (this.state['paused']) {
                    this.onPausedCallback = this.state['paused'];
                }

                if (this.state['destroy']) {
                    this.onDestroyCallback = this.state['destroy'];
                }

                if (clearWorld) {
                    this.world.destroy();

                    if (clearCache == true) {
                        this.cache.destroy();
                    }
                }

                this._loadComplete = false;

                this.startState();
            } else {
                throw new Error("Invalid State object given. Must contain at least a create or update function.");
            }
        };

        /**
        * Nuke the entire game from orbit
        */
        Game.prototype.destroy = function () {
            this.callbackContext = null;
            this.onPreloadCallback = null;
            this.onLoadRenderCallback = null;
            this.onLoadUpdateCallback = null;
            this.onCreateCallback = null;
            this.onUpdateCallback = null;
            this.onRenderCallback = null;
            this.onPausedCallback = null;
            this.onDestroyCallback = null;
            this.cache = null;
            this.input = null;
            this.load = null;
            this.sound = null;
            this.stage = null;
            this.time = null;
            this.world = null;
            this.isBooted = false;
        };

        Object.defineProperty(Game.prototype, "paused", {
            get: function () {
                return this._paused;
            },
            set: function (value) {
                if (value == true && this._paused == false) {
                    this._paused = true;
                    this.onPause.dispatch();
                    this.sound.pauseAll();
                    this._raf.callback = this.pausedLoop;
                } else if (value == false && this._paused == true) {
                    this._paused = false;
                    this.onResume.dispatch();
                    this.input.reset();
                    this.sound.resumeAll();

                    if (this.isRunning == false) {
                        this._raf.callback = this.bootLoop;
                    } else {
                        this._raf.callback = this.loop;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Game.prototype, "camera", {
            get: function () {
                return this.world.cameras.current;
            },
            enumerable: true,
            configurable: true
        });
        return Game;
    })();
    Phaser.Game = Game;
})(Phaser || (Phaser = {}));
/// <reference path="_definitions.ts" />
/**
* Phaser - http://www.phaser.io
*
* v1.0.0 - August 12th 2013
*
* A feature-packed 2D canvas game framework born from the firey pits of Flixel and
* constructed via plenty of blood, sweat, tears and coffee by Richard Davey (@photonstorm).
*
* Many thanks to Adam Saltsman (@ADAMATOMIC) for releasing Flixel, from both which Phaser
* and my love of game development originate.
*
* Follow Phaser progress at http://www.photonstorm.com
*
* "If you want your children to be intelligent,  read them fairy tales."
* "If you want them to be more intelligent, read them more fairy tales."
*                                                     -- Albert Einstein
*/
var Phaser;
(function (Phaser) {
    Phaser.VERSION = 'Phaser version 1.0.0';

    Phaser.GAMES = [];
})(Phaser || (Phaser = {}));
