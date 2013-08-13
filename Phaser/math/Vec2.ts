/// <reference path="../_definitions.ts" />

/**
* Phaser - Vec2
*
* A Vector 2
*/

module Phaser {

    export class Vec2 {

        /**
        * Creates a new Vec2 object.
        * @class Vec2
        * @constructor
        * @param {Number} x The x position of the vector
        * @param {Number} y The y position of the vector
        * @return {Vec2} This object
        **/
        constructor(x: number = 0, y: number = 0) {

            this.x = x;
            this.y = y;

            return this;

        }

        /**
	     * The x coordinate of the vector
	     * @property x
	     * @type Number
	     **/
        public x: number;

        /**
	     * The y coordinate of the vector
	     * @property y
	     * @type Number
	     **/
        public y: number;

        /**
         * Copies the x and y properties from any given object to this Vec2.
         * @method copyFrom
         * @param {any} source - The object to copy from.
         * @return {Vec2} This Vec2 object.
         **/
        public copyFrom(source: any): Phaser.Vec2 {
            return this.setTo(source.x, source.y);
        }

        /**
        * Sets the x and y properties of the Vector.
        * @param {Number} x The x position of the vector
        * @param {Number} y The y position of the vector
        * @return {Vec2} This object
        **/
        public setTo(x: number, y: number): Phaser.Vec2 {

            this.x = x;
            this.y = y;
            return this;

        }

        /**
        * Add another vector to this one.
        * 
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        public add(a: Phaser.Vec2): Phaser.Vec2 {

            this.x += a.x;
            this.y += a.y;
            return this;

        }

        /**
        * Subtract another vector from this one.
        * 
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        public subtract(v: Phaser.Vec2): Phaser.Vec2 {

            this.x -= v.x;
            this.y -= v.y;
            return this;

        }

        /**
        * Multiply another vector with this one.
        * 
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        public multiply(v: Phaser.Vec2): Phaser.Vec2 {

            this.x *= v.x;
            this.y *= v.y;
            return this;

        }

        /**
        * Divide this vector by another one.
        * 
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        public divide(v: Phaser.Vec2): Phaser.Vec2 {

            this.x /= v.x;
            this.y /= v.y;
            return this;

        }

        /**
        * Get the length of this vector.
        * 
        * @return {number} The length of this vector.
        */
        public length(): number {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        }

        /**
        * Get the length squared of this vector.
        * 
        * @return {number} The length^2 of this vector.
        */
        public lengthSq(): number {
            return (this.x * this.x) + (this.y * this.y);
        }

        /**
        * Normalize this vector.
        * 
        * @return {Vec2} This for chaining.
        */
        public normalize(): Phaser.Vec2 {

	        var inv = (this.x != 0 || this.y != 0) ? 1 / Math.sqrt(this.x * this.x + this.y * this.y) : 0;
	        this.x *= inv;
	        this.y *= inv;
	        return this;

        }

        /**
        * The dot product of two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        public dot(a: Phaser.Vec2): number {
            return ((this.x * a.x) + (this.y * a.y));
        }

        /**
        * The cross product of two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        public cross(a: Phaser.Vec2): number {
            return ((this.x * a.y) - (this.y * a.x));
        }

        /**
        * The projection magnitude of two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        public projectionLength(a: Phaser.Vec2): number {

            var den: number = a.dot(a);

            if (den == 0)
            {
                return 0;
            }
            else
            {
                return Math.abs(this.dot(a) / den);
            }

        }

        /**
        * The angle between two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        public angle(a: Phaser.Vec2): number {
            return Math.atan2(a.x * this.y - a.y * this.x, a.x * this.x + a.y * this.y);
        }

        /**
        * Scale this vector.
        * 
        * @param {number} x The scaling factor in the x direction.
        * @param {?number=} y The scaling factor in the y direction.  If this is not specified, the x scaling factor will be used.
        * @return {Vec2} This for chaining.
        */
        public scale(x: number, y: number): Phaser.Vec2 {

            this.x *= x;
            this.y *= y || x;
            return this;

        }

        /**
        * Multiply this vector by the given scalar.
        * 
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        public multiplyByScalar(scalar: number): Phaser.Vec2 {

            this.x *= scalar;
            this.y *= scalar;
            return this;

        }

        /**
        * Adds the given vector to this vector then multiplies by the given scalar.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        public multiplyAddByScalar(a: Phaser.Vec2, scalar: number): Phaser.Vec2 {

            this.x += a.x * scalar;
            this.y += a.y * scalar;
            return this;

        }

        /**
        * Divide this vector by the given scalar.
        * 
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        public divideByScalar(scalar: number): Phaser.Vec2 {

            this.x /= scalar;
            this.y /= scalar;
            return this;

        }

        /**
        * Reverse this vector.
        * 
        * @return {Vec2} This for chaining.
        */
        public reverse(): Phaser.Vec2 {

            this.x = -this.x;
            this.y = -this.y;
            return this;

        }

        /**
        * Check if both the x and y of this vector equal the given value.
        * 
        * @return {bool}
        */
        public equals(value): bool {
            return (this.x == value && this.y == value);
        }

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        public toString(): string {
            return "[{Vec2 (x=" + this.x + " y=" + this.y + ")}]";
        }

    }

}