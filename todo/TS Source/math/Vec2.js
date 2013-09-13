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
        Vec2.prototype.copyFrom = /**
        * Copies the x and y properties from any given object to this Vec2.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {Vec2} This Vec2 object.
        **/
        function (source) {
            return this.setTo(source.x, source.y);
        };
        Vec2.prototype.setTo = /**
        * Sets the x and y properties of the Vector.
        * @param {Number} x The x position of the vector
        * @param {Number} y The y position of the vector
        * @return {Vec2} This object
        **/
        function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Vec2.prototype.add = /**
        * Add another vector to this one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        function (a) {
            this.x += a.x;
            this.y += a.y;
            return this;
        };
        Vec2.prototype.subtract = /**
        * Subtract another vector from this one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        Vec2.prototype.multiply = /**
        * Multiply another vector with this one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        function (v) {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        };
        Vec2.prototype.divide = /**
        * Divide this vector by another one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        function (v) {
            this.x /= v.x;
            this.y /= v.y;
            return this;
        };
        Vec2.prototype.length = /**
        * Get the length of this vector.
        *
        * @return {number} The length of this vector.
        */
        function () {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        };
        Vec2.prototype.lengthSq = /**
        * Get the length squared of this vector.
        *
        * @return {number} The length^2 of this vector.
        */
        function () {
            return (this.x * this.x) + (this.y * this.y);
        };
        Vec2.prototype.normalize = /**
        * Normalize this vector.
        *
        * @return {Vec2} This for chaining.
        */
        function () {
            var inv = (this.x != 0 || this.y != 0) ? 1 / Math.sqrt(this.x * this.x + this.y * this.y) : 0;
            this.x *= inv;
            this.y *= inv;
            return this;
        };
        Vec2.prototype.dot = /**
        * The dot product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a) {
            return ((this.x * a.x) + (this.y * a.y));
        };
        Vec2.prototype.cross = /**
        * The cross product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a) {
            return ((this.x * a.y) - (this.y * a.x));
        };
        Vec2.prototype.projectionLength = /**
        * The projection magnitude of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a) {
            var den = a.dot(a);
            if(den == 0) {
                return 0;
            } else {
                return Math.abs(this.dot(a) / den);
            }
        };
        Vec2.prototype.angle = /**
        * The angle between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a) {
            return Math.atan2(a.x * this.y - a.y * this.x, a.x * this.x + a.y * this.y);
        };
        Vec2.prototype.scale = /**
        * Scale this vector.
        *
        * @param {number} x The scaling factor in the x direction.
        * @param {?number=} y The scaling factor in the y direction.  If this is not specified, the x scaling factor will be used.
        * @return {Vec2} This for chaining.
        */
        function (x, y) {
            this.x *= x;
            this.y *= y || x;
            return this;
        };
        Vec2.prototype.multiplyByScalar = /**
        * Multiply this vector by the given scalar.
        *
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        };
        Vec2.prototype.multiplyAddByScalar = /**
        * Adds the given vector to this vector then multiplies by the given scalar.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        function (a, scalar) {
            this.x += a.x * scalar;
            this.y += a.y * scalar;
            return this;
        };
        Vec2.prototype.divideByScalar = /**
        * Divide this vector by the given scalar.
        *
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        function (scalar) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        };
        Vec2.prototype.reverse = /**
        * Reverse this vector.
        *
        * @return {Vec2} This for chaining.
        */
        function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        Vec2.prototype.equals = /**
        * Check if both the x and y of this vector equal the given value.
        *
        * @return {bool}
        */
        function (value) {
            return (this.x == value && this.y == value);
        };
        Vec2.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        function () {
            return "[{Vec2 (x=" + this.x + " y=" + this.y + ")}]";
        };
        return Vec2;
    })();
    Phaser.Vec2 = Vec2;    
})(Phaser || (Phaser = {}));
