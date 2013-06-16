/// <reference path="../Game.ts" />
/// <reference path="Vec2.ts" />

/**
* Phaser - Vec2Utils
*
* A collection of methods useful for manipulating and performing operations on 2D vectors.
*
*/

module Phaser {

    export class Vec2Utils {

        /**
        * Adds two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors.
        */
        static add(a: Vec2, b: Vec2, out?: Vec2 = new Vec2): Vec2 {
            return out.setTo(a.x + b.x, a.y + b.y);
        }

        /**
        * Subtracts two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the difference of the two vectors.
        */
        static subtract(a: Vec2, b: Vec2, out?: Vec2 = new Vec2): Vec2 {
            return out.setTo(a.x - b.x, a.y - b.y);
        }

        /**
        * Multiplies two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors multiplied.
        */
        static multiply(a: Vec2, b: Vec2, out?: Vec2 = new Vec2): Vec2 {
            return out.setTo(a.x * b.x, a.y * b.y);
        }

        /**
        * Divides two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors divided.
        */
        static divide(a: Vec2, b: Vec2, out?: Vec2 = new Vec2): Vec2 {
            return out.setTo(a.x / b.x, a.y / b.y);
        }

        /**
        * Scales a 2D vector.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {number} s Scaling value.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        static scale(a: Vec2, s: number, out?: Vec2 = new Vec2): Vec2 {
            return out.setTo(a.x * s, a.y * s);
        }

        /**
        * Adds two 2D vectors together and multiplies the result by the given scalar.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {number} s Scaling value.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors added and multiplied.
        */
        static multiplyAdd(a: Vec2, b: Vec2, s: number, out?: Vec2 = new Vec2): Vec2 {
            return out.setTo(a.x + b.x * s, a.y + b.y * s);
        }

        /**
        * Return a negative vector.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the negative vector.
        */
        static negative(a: Vec2, out?: Vec2 = new Vec2): Vec2 {
            return out.setTo(-a.x, -a.y);
        }

        /**
        * Return a perpendicular vector (90 degrees rotation)
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        static perp(a: Vec2, out?: Vec2 = new Vec2): Vec2 {
            return out.setTo(-a.y, a.x);
        }

        /**
        * Return a perpendicular vector (-90 degrees rotation)
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        static rperp(a: Vec2, out?: Vec2 = new Vec2): Vec2 {
            return out.setTo(a.y, -a.x);
        }

        /**
        * Checks if two 2D vectors are equal.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Boolean}
        */
        static equals(a: Vec2, b: Vec2): bool {
            return a.x == b.x && a.y == b.y;
        }

        /**
        * 
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} epsilon 
        * @return {Boolean}
        */
        static epsilonEquals(a: Vec2, b: Vec2, epsilon: number): bool {
            return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
        }

        /**
        * Get the distance between two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static distance(a: Vec2, b: Vec2): number {
            return Math.sqrt(Vec2Utils.distanceSq(a, b));
        }

        /**
        * Get the distance squared between two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static distanceSq(a: Vec2, b: Vec2): number {
            return ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y));
        }

        /**
        * Project two 2D vectors onto another vector.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static project(a: Vec2, b: Vec2, out?: Vec2 = new Vec2): Vec2 {

            var amt = a.dot(b) / b.lengthSq();

            if (amt != 0)
            {
                out.setTo(amt * b.x, amt * b.y);
            }

            return out;

        }

        /**
        * Project this vector onto a vector of unit length.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static projectUnit(a: Vec2, b: Vec2, out?: Vec2 = new Vec2): Vec2 {

            var amt = a.dot(b);

            if (amt != 0)
            {
                out.setTo(amt * b.x, amt * b.y);
            }

            return out;

        }

        /**
        * Right-hand normalize (make unit length) a 2D vector.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static normalRightHand(a: Vec2, out?: Vec2 = this): Vec2 {
            return out.setTo(a.y * -1, a.x);
        }

        /**
        * Normalize (make unit length) a 2D vector.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static normalize(a: Vec2, out?: Vec2 = new Vec2): Vec2 {

            var m = a.length();

            if (m != 0)
            {
                out.setTo(a.x / m, a.y / m);
            }

            return out;
        }

        /**
        * The dot product of two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static dot(a: Vec2, b: Vec2): number {
            return ((a.x * b.x) + (a.y * b.y));
        }

        /**
        * The cross product of two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static cross(a: Vec2, b: Vec2): number {
            return ((a.x * b.y) - (a.y * b.x));
        }

        /**
        * The angle between two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static angle(a: Vec2, b: Vec2): number {
            return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
        }

        /**
        * The angle squared between two 2D vectors.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static angleSq(a: Vec2, b: Vec2): number {
            return a.subtract(b).angle(b.subtract(a));
        }

        /**
        * Rotate a 2D vector around the origin to the given angle (theta).
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Number} theta The angle of rotation in radians.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static rotateAroundOrigin(a: Vec2, b: Vec2, theta: number, out?: Vec2 = new Vec2): Vec2 {
            var x = a.x - b.x;
            var y = a.y - b.y;
            return out.setTo(x * Math.cos(theta) - y * Math.sin(theta) + b.x, x * Math.sin(theta) + y * Math.cos(theta) + b.y);
        }

        /**
        * Rotate a 2D vector to the given angle (theta).
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Number} theta The angle of rotation in radians.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static rotate(a: Vec2, theta: number, out?: Vec2 = new Vec2): Vec2 {

            var c = Math.cos(theta);
            var s = Math.sin(theta);

            return out.setTo(a.x * c - a.y * s, a.x * s + a.y * c);

        }

        /**
        * Clone a 2D vector.
        * 
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is a copy of the source Vec2.
        */
        static clone(a: Vec2, out?: Vec2 = new Vec2): Vec2 {
            return out.setTo(a.x, a.y);
        }

        /**
        * Reflect this vector on an arbitrary axis.
        * 
        * @param {Vec2} axis The vector representing the axis.
        * @return {Vec2} This for chaining.
        */
        /*
        static reflect(axis): Vec2 {

            var x = this.x;
            var y = this.y;
            this.project(axis).scale(2);
            this.x -= x;
            this.y -= y;

            return this;

        }
        */

        /**
        * Reflect this vector on an arbitrary axis (represented by a unit vector)
        * 
        * @param {Vec2} axis The unit vector representing the axis.
        * @return {Vec2} This for chaining.
        */
        /*
        static reflectN(axis): Vec2 {

            var x = this.x;
            var y = this.y;
            this.projectN(axis).scale(2);
            this.x -= x;
            this.y -= y;

            return this;

        }

        static getMagnitude(): number {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        }
        */

    }

}