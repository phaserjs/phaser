/// <reference path="../Game.ts" />

/**
* Phaser - Vector2
*
* A two dimensional vector.
* Contains methods and ideas from verlet-js by Sub Protocol, SAT.js by Jim Riecken and N by Metanet Software. Brandon Jones, Colin MacKenzie IV
*/

module Phaser.Math {

    export class Vec2 {

        /**
        * Creates a new Vector2 object.
        * @class Vector2
        * @constructor
        * @param {Number} x The x position of the vector
        * @param {Number} y The y position of the vector
        * @return {Vector2} This object
        **/
        constructor(x: number = 0, y: number = 0) {

            //var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;            
            this.x = x;
            this.y = y;

        }

        public x: number;
        public y: number;

        public setTo(x: number, y: number): Vector2 {
            this.x = x;
            this.y = y;
            return this;
        }

        /**
        * Add this vector to the given one and return the result.
        * 
        * @param {Vector2} v The other Vector.
        * @param {Vector2} The output Vector.
        * @return {Vector2} The new Vector
        */
        public add(v: Vector2, output?:Vector2 = new Vector2): Vector2 {
            return output.setTo(this.x + v.x, this.y + v.y);
        }

        /**
        * Subtract this vector to the given one and return the result.
        * 
        * @param {Vector2} v The other Vector.
        * @param {Vector2} The output Vector.
        * @return {Vector2} The new Vector
        */
        public sub(v: Vector2, output?:Vector2 = new Vector2): Vector2 {
            return output.setTo(this.x - v.x, this.y - v.y);
        }

        /**
        * Multiply this vector with the given one and return the result.
        * 
        * @param {Vector2} v The other Vector.
        * @param {Vector2} The output Vector.
        * @return {Vector2} The new Vector
        */
        public mul(v: Vector2, output?:Vector2 = new Vector2): Vector2 {
            return output.setTo(this.x * v.x, this.y * v.y);
        }

        /**
        * Divide this vector by the given one and return the result.
        * 
        * @param {Vector2} v The other Vector.
        * @param {Vector2} The output Vector.
        * @return {Vector2} The new Vector
        */
        public div(v: Vector2, output?:Vector2 = new Vector2): Vector2 {
            return output.setTo(this.x / v.x, this.y / v.y);
        }

        /**
        * Scale this vector by the given values and return the result.
        * 
        * @param {number} x The scaling factor in the x direction.
        * @param {?number=} y The scaling factor in the y direction.  If this
        *   is not specified, the x scaling factor will be used.
        * @return {Vector} The new Vector
        */
        public scale(x: number, y?:number = null, output?:Vector2 = new Vector2): Vector2 {

            if (y === null)
            {
                y = x;
            }

            return output.setTo(this.x * x, this.y * y);

        }

        /**
        * Rotate this vector by 90 degrees
        * 
        * @return {Vector} This for chaining.
        */
        public perp(output?: Vector2 = this): Vector2 {
            var x = this.x;
            return output.setTo(this.y, -x);
        }

        //  Same as copyFrom, used by VerletManager
        public mutableSet(v: Vector2): Vector2 {
            this.x = v.x;
            this.y = v.y;
            return this;
        }

        /**
        * Add another vector to this one.
        * 
        * @param {Vector} other The other Vector.
        * @return {Vector} This for chaining.
        */
        public mutableAdd(v: Vector2): Vector2 {
            this.x += v.x;
            this.y += v.y;
            return this;
        }

        /**
        * Subtract another vector from this one.
        * 
        * @param {Vector} other The other Vector.
        * @return {Vector} This for chaining.
        */
        public mutableSub(v: Vector2): Vector2 {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        }

        /**
        * Multiply another vector with this one.
        * 
        * @param {Vector} other The other Vector.
        * @return {Vector} This for chaining.
        */
        public mutableMul(v: Vector2): Vector2 {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        }

        /**
        * Divide this vector by another one.
        * 
        * @param {Vector} other The other Vector.
        * @return {Vector} This for chaining.
        */
        public mutableDiv(v: Vector2): Vector2 {
            this.x /= v.x;
            this.y /= v.y;
            return this;
        }

        /**
        * Scale this vector.
        * 
        * @param {number} x The scaling factor in the x direction.
        * @param {?number=} y The scaling factor in the y direction.  If this
        *   is not specified, the x scaling factor will be used.
        * @return {Vector} This for chaining.
        */
        public mutableScale(x: number, y?:number): Vector2 {
            this.x *= x;
            this.y *= y || x;
            return this;
        }

        /**
        * Multiply this vector by the given scalar.
        * 
        * @param {number} scalar
        * @return {Vector2} This for chaining.
        */
        public mutableMultiplyByScalar(scalar: number): Vector2 {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }

        /**
        * Divide this vector by the given scalar.
        * 
        * @param {number} scalar
        * @return {Vector2} This for chaining.
        */
        public mutableDivideByScalar(scalar: number): Vector2 {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        }


        /**
        * Reverse this vector.
        * 
        * @return {Vector} This for chaining.
        */
        public reverse(): Vector2 {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        }

        public edge(v: Vector2, output?: Vector2 = new Vector2): Vector2 {
            return this.sub(v, output);
        }

        public equals(v: Vector2): bool {
            return this.x == v.x && this.y == v.y;
        }

        public epsilonEquals(v: Vector2, epsilon:number): bool {
            return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon;
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
        * Get the length^2 of this vector.
        * 
        * @return {number} The length^2 of this vector.
        */
        public length2(): number {
            return (this.x * this.x) + (this.y * this.y);
        }

        /**
        * Get the distance between this vector and the given vector.
        * 
        * @return {Vector2} v The vector to check
        */
        public distance(v: Vector2): number {
            return Math.sqrt(this.distance2(v));
        }

        /**
        * Get the distance^2 between this vector and the given vector.
        * 
        * @return {Vector2} v The vector to check
        */
        public distance2(v: Vector2): number {
            return ((v.x - this.x) * (v.x - this.x)) + ((v.y - this.y) * (v.y - this.y));
        }

        /**
        * Project this vector on to another vector.
        * 
        * @param {Vector} other The vector to project onto.
        * @return {Vector} This for chaining.
        */
        public project(other: Vector2): Vector2 {

            var amt = this.dot(other) / other.length2();
            
            if (amt != 0)
            {
                this.x = amt * other.x;
                this.y = amt * other.y;
            }

            return this;

        }

        /**
        * Project this vector onto a vector of unit length.
        * 
        * @param {Vector} other The unit vector to project onto.
        * @return {Vector} This for chaining.
        */
        public projectN(other: Vector2): Vector2 {

            var amt = this.dot(other);
            
            if (amt != 0)
            {
                this.x = amt * other.x;
                this.y = amt * other.y;
            }

            return this;

        }

        /**
        * Reflect this vector on an arbitrary axis.
        * 
        * @param {Vector} axis The vector representing the axis.
        * @return {Vector} This for chaining.
        */
        public reflect(axis): Vector2 {

            var x = this.x;
            var y = this.y;
            this.project(axis).scale(2);
            this.x -= x;
            this.y -= y;

            return this;

        }

        /**
        * Reflect this vector on an arbitrary axis (represented by a unit vector)
        * 
        * @param {Vector} axis The unit vector representing the axis.
        * @return {Vector} This for chaining.
        */
        public reflectN(axis): Vector2 {

            var x = this.x;
            var y = this.y;
            this.projectN(axis).scale(2);
            this.x -= x;
            this.y -= y;

            return this;

        }

        public getProjectionMagnitude(v: Vector2): number {

            var den = v.dot(v);

            if (den == 0)
            {
                return 0;
            }
            else
            {
                return Math.abs(this.dot(v) / den);
            }

        }

        public direction(output?: Vector2 = new Vector2): Vector2 {

            output.copyFrom(this);
            return this.normalize(output);

        }

        public normalRightHand(output?: Vector2 = this): Vector2 {
            return output.setTo(this.y * -1, this.x);
        }

        /**
        * Normalize (make unit length) this vector.
        * 
        * @return {Vector} This for chaining.
        */
        public normalize(output?: Vector2 = this): Vector2 {

            var m = this.length();

            if (m != 0)
            {
                output.setTo(this.x / m, this.y / m);
            }

            return output;
        }

        public getMagnitude(): number {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        }

        /**
        * Get the dot product of this vector against another.
        * 
        * @param {Vector}  other The vector to dot this one against.
        * @return {number} The dot product.
        */
        public dot(v: Vector2): number {
            return ((this.x * v.x) + (this.y * v.y));
        }

        /**
        * Get the cross product of this vector against another.
        * 
        * @param {Vector}  other The vector to cross this one against.
        * @return {number} The cross product.
        */
        public cross(v: Vector2): number {
            return ((this.x * v.y) - (this.y * v.x));
        }

        /**
        * Get the angle between this vector and the given vector.
        * 
        * @return {Vector2} v The vector to check
        */
        public angle(v: Vector2): number {
            return Math.atan2(this.x * v.y - this.y * v.x, this.x * v.x + this.y * v.y);
        }

        public angle2(vLeft: Vector2, vRight: Vector2): number {
            return vLeft.sub(this).angle(vRight.sub(this));
        }

        /**
        * Rotate this vector around the origin to the given angle (theta) and return the result in a new Vector
        * 
        * @return {Vector2} v The vector to check
        */
        public rotate(origin, theta, output?: Vector2 = new Vector2): Vector2 {
            var x = this.x - origin.x;
            var y = this.y - origin.y;
            return output.setTo(x * Math.cos(theta) - y * Math.sin(theta) + origin.x, x * Math.sin(theta) + y * Math.cos(theta) + origin.y);
        }

        public clone(output?: Vector2 = new Vector2): Vector2 {
            return output.setTo(this.x, this.y);
        }

        public copyFrom(v: Vector2): Vector2 {
            this.x = v.x;
            this.y = v.y;
            return this;
        }

        public copyTo(v: Vector2): Vector2 {
            return v.setTo(this.x, this.y);
        }

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        public toString(): string {
            return "[{Vector2 (x=" + this.x + " y=" + this.y + ")}]";
        }

    }

}