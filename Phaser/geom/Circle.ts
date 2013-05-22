/// <reference path="../Game.ts" />

/**
* Phaser - Circle
*
* A Circle object is an area defined by its position, as indicated by its center point (x,y) and diameter.
*/

module Phaser {

    export class Circle {

        /**
        * Creates a new Circle object with the center coordinate specified by the x and y parameters and the diameter specified by the diameter parameter. If you call this function without parameters, a circle with x, y, diameter and radius properties set to 0 is created.
        * @class Circle
        * @constructor
        * @param {Number} [x] The x coordinate of the center of the circle.
        * @param {Number} [y] The y coordinate of the center of the circle.
        * @param {Number} [diameter] The diameter of the circle.
        * @return {Circle} This circle object
        **/
        constructor(x: number = 0, y: number = 0, diameter: number = 0) {

            this._pos = new Vector2;
            this.setTo(x, y, diameter);

        }

        private _diameter: number = 0;
        private _radius: number = 0;
        private _pos: Vector2;

        /**
	     * The x coordinate of the center of the circle
	     * @property x
	     * @type Number
	     **/
        public x: number = 0;

        /**
	     * The y coordinate of the center of the circle
	     * @property y
	     * @type Number
	     **/
        public y: number = 0;

        /**
	     * The position of this Circle object represented by a Vector2
	     * @property pos
	     * @type Vector2
	     **/
        public get pos(): Vector2 {
            return this._pos.setTo(this.x, this.y);
        }

        /**
	     * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
	     * @method diameter
	     * @return {Number}
	     **/
        get diameter(): number {
            return this._diameter;
        }

        /**
	     * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
	     * @method diameter
	     * @param {Number} The diameter of the circle.
	     **/
        set diameter(value: number) {

            if (value > 0)
            {
                this._diameter = value;
                this._radius = value * 0.5;
            }

        }

        /**
	     * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
	     * @method radius
	     * @return {Number}
	     **/
        get radius(): number {

            return this._radius;

        }

        /**
	     * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
	     * @method radius
	     * @param {Number} The radius of the circle.
	     **/
        set radius(value: number) {

            if (value > 0)
            {
                this._radius = value;
                this._diameter = value * 2;
            }

        }

        /**
	     * The circumference of the circle.
	     * @method circumference
	     * @return {Number}
	     **/
        public circumference(): number {

            return 2 * (Math.PI * this._radius);

        }

        /**
	     * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
	     * @method bottom
	     * @return {Number}
	     **/
        get bottom(): number {

            return this.y + this._radius;

        }

        /**
	     * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
	     * @method bottom
	     * @param {Number} The value to adjust the height of the circle by.
	     **/
        set bottom(value: number) {

            if (!isNaN(value))
            {
                if (value < this.y)
                {
                    this._radius = 0;
                    this._diameter = 0;
                }
                else
                {

                    this.radius = value - this.y;
                }
            }

        }

        /**
	     * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
	     * @method left
	     * @return {Number} The x coordinate of the leftmost point of the circle.
	     **/
        get left(): number {

            return this.x - this._radius;

        }

        /**
	     * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
	     * @method left
	     * @param {Number} The value to adjust the position of the leftmost point of the circle by.
	     **/
        set left(value: number) {

            if (!isNaN(value))
            {
                if (value < this.x)
                {
                    this.radius = this.x - value;
                }
                else
                {
                    this._radius = 0;
                    this._diameter = 0;
                }
            }

        }

        /**
	     * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
	     * @method right
	     * @return {Number}
	     **/
        get right(): number {

            return this.x + this._radius;

        }

        /**
	     * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
	     * @method right
	     * @param {Number} The amount to adjust the diameter of the circle by.
	     **/
        set right(value: number) {

            if (!isNaN(value))
            {
                if (value > this.x)
                {
                    this.radius = value - this.x;
                }
                else
                {
                    this._radius = 0;
                    this._diameter = 0;
                }
            }

        }

        /**
	     * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
	     * @method bottom
	     * @return {Number}
	     **/
        get top(): number {

            return this.y - this._radius;

        }

        /**
	     * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
	     * @method bottom
	     * @param {Number} The amount to adjust the height of the circle by.
	     **/
        set top(value: number) {

            if (!isNaN(value))
            {
                if (value > this.y)
                {
                    this._radius = 0;
                    this._diameter = 0;
                }
                else
                {
                    this.radius = this.y - value;
                }
            }

        }

        /**
	     * Gets the area of this Circle.
	     * @method area
	     * @return {Number} This area of this circle.
	     **/
        get area(): number {

            if (this._radius > 0)
            {
                return Math.PI * this._radius * this._radius;
            }
            else
            {
                return 0;
            }

        }

        /**
	     * Determines whether or not this Circle object is empty.
	     * @method isEmpty
	     * @return {Boolean} A value of true if the Circle objects diameter is less than or equal to 0; otherwise false.
	     **/
        get isEmpty(): bool {

            if (this._diameter <= 0)
            {
                return true;
            }

            return false;

        }

        /**
	     * Whether the circle intersects with a line. Checks against infinite line defined by the two points on the line, not the line segment.
         * If you need details about the intersection then use Collision.lineToCircle instead.
	     * @method intersectCircleLine
	     * @param {Object} the line object to check.
	     * @return {Boolean}
	     **/
        public intersectCircleLine(line: Line): bool {

            return Collision.lineToCircle(line, this).result;

        }

        /**
	     * Returns a new Circle object with the same values for the x, y, width, and height properties as the original Circle object.
	     * @method clone
	     * @param {Circle} [optional] output Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
	     * @return {Phaser.Circle}
	     **/
        public clone(output?: Circle = new Circle): Circle {

            return output.setTo(this.x, this.y, this._diameter);

        }

        /**
	     * Return true if the given x/y coordinates are within this Circle object.
         * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
	     * @method contains
	     * @param {Number} The X value of the coordinate to test.
	     * @param {Number} The Y value of the coordinate to test.
	     * @return {Boolean} True if the coordinates are within this circle, otherwise false.
	     **/
        public contains(x: number, y: number): bool {

            return Collision.circleContainsPoint(this, <Point> { x: x, y: y }).result;

        }

        /**
	     * Return true if the coordinates of the given Point object are within this Circle object.
         * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
	     * @method containsPoint
	     * @param {Phaser.Point} The Point object to test.
	     * @return {Boolean} True if the coordinates are within this circle, otherwise false.
	     **/
        public containsPoint(point:Point): bool {

            return Collision.circleContainsPoint(this, point).result;

        }

        /**
	     * Return true if the given Circle is contained entirely within this Circle object.
         * If you need details about the intersection then use Phaser.Intersect.circleToCircle instead.
	     * @method containsCircle
	     * @param {Phaser.Circle} The Circle object to test.
	     * @return {Boolean} True if the coordinates are within this circle, otherwise false.
	     **/
        public containsCircle(circle:Circle): bool {

            return Collision.circleToCircle(this, circle).result;

        }

        /**
	     * Copies all of circle data from the source Circle object into the calling Circle object.
	     * @method copyFrom
	     * @param {Circle} rect The source circle object to copy from
	     * @return {Circle} This circle object
	     **/
        public copyFrom(source: Circle): Circle {

            return this.setTo(source.x, source.y, source.diameter);

        }

        /**
	     * Copies all of circle data from this Circle object into the destination Circle object.
	     * @method copyTo
	     * @param {Circle} circle The destination circle object to copy in to
	     * @return {Circle} The destination circle object
	     **/
        public copyTo(target: Circle) {

            return target.copyFrom(this);

        }

        /**
	     * Returns the distance from the center of this Circle object to the given object (can be Circle, Point or anything with x/y values)
	     * @method distanceFrom
	     * @param {Circle/Point} target - The destination Point object.
	     * @param {Boolean} [optional] round - Round the distance to the nearest integer (default false)
	     * @return {Number} The distance between this Point object and the destination Point object.
	     **/
        public distanceTo(target: any, round?: bool = false): number {

            var dx = this.x - target.x;
            var dy = this.y - target.y;

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
	     * Determines whether the object specified in the toCompare parameter is equal to this Circle object. This method compares the x, y and diameter properties of an object against the same properties of this Circle object.
	     * @method equals
	     * @param {Circle} toCompare The circle to compare to this Circle object.
	     * @return {Boolean} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
	     **/
        public equals(toCompare: Circle): bool {

            if (this.x === toCompare.x && this.y === toCompare.y && this.diameter === toCompare.diameter)
            {
                return true;
            }

            return false;
        }

        /**
	     * Determines whether the Circle object specified in the toIntersect parameter intersects with this Circle object. This method checks the radius distances between the two Circle objects to see if they intersect.
	     * @method intersects
	     * @param {Circle} toIntersect The Circle object to compare against to see if it intersects with this Circle object.
	     * @return {Boolean} A value of true if the specified object intersects with this Circle object; otherwise false.
	     **/
        public intersects(toIntersect: Circle): bool {

            if (this.distanceTo(toIntersect, false) < (this._radius + toIntersect._radius)) {
                return true;
            }

            return false;

        }

        /**
	     * Returns a Point object containing the coordinates of a point on the circumference of this Circle based on the given angle.
	     * @method circumferencePoint
	     * @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
	     * @param {Boolean} asDegrees Is the given angle in radians (false) or degrees (true)?
	     * @param {Phaser.Point} [optional] output An optional Point object to put the result in to. If none specified a new Point object will be created.
	     * @return {Phaser.Point} The Point object holding the result.
	     **/
        public circumferencePoint(angle: number, asDegrees: bool = false, output?: Point = new Point): Point {

            if (asDegrees === true)
            {
                angle = angle * GameMath.DEG_TO_RAD;
            }

            output.x = this.x + this._radius * Math.cos(angle);
            output.y = this.y + this._radius * Math.sin(angle);

            return output;

        }

        /**
	     * Adjusts the location of the Circle object, as determined by its center coordinate, by the specified amounts.
	     * @method offset
	     * @param {Number} dx Moves the x value of the Circle object by this amount.
	     * @param {Number} dy Moves the y value of the Circle object by this amount.
	     * @return {Circle} This Circle object.
	     **/
        public offset(dx: number, dy: number): Circle {

            if (!isNaN(dx) && !isNaN(dy))
            {
                this.x += dx;
                this.y += dy;
            }

            return this;

        }

        /**
	     * Adjusts the location of the Circle object using a Point object as a parameter. This method is similar to the Circle.offset() method, except that it takes a Point object as a parameter.
	     * @method offsetPoint
	     * @param {Point} point A Point object to use to offset this Circle object.
	     * @return {Circle} This Circle object.
	     **/
        public offsetPoint(point: Point): Circle {

            return this.offset(point.x, point.y);

        }

        /**
	     * Sets the members of Circle to the specified values.
	     * @method setTo
	     * @param {Number} x The x coordinate of the center of the circle.
	     * @param {Number} y The y coordinate of the center of the circle.
	     * @param {Number} diameter The diameter of the circle in pixels.
	     * @return {Circle} This circle object
	     **/
        public setTo(x: number, y: number, diameter: number): Circle {

            this.x = x;
            this.y = y;
            this._diameter = diameter;
            this._radius = diameter * 0.5;

            return this;

        }

        /**
	     * Returns a string representation of this object.
	     * @method toString
	     * @return {string} a string representation of the instance.
	     **/
        public toString(): string {

            return "[{Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]";

        }

    }

}