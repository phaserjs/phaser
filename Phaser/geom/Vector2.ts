/// <reference path="../Game.ts" />

/**
* Phaser - Vector2
*
* A simple 2-dimensional vector class. Based on the one included with verlet-js by Sub Protocol released under MIT
*/

module Phaser {

    export class Vector2 {

        /**
        * Creates a new Vector2 object.
        * @class Vector2
        * @constructor
        * @param {Number} x The x coordinate of vector2
        * @param {Number} y The y coordinate of vector2
        * @return {Vector2} This object
        **/
        constructor(x: number = 0, y: number = 0) {

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

        public add(v: Vector2, output?:Vector2 = new Vector2): Vector2 {
            return output.setTo(this.x + v.x, this.y + v.y);
        }

        public sub(v: Vector2, output?:Vector2 = new Vector2): Vector2 {
            return output.setTo(this.x - v.x, this.y - v.y);
        }

        public mul(v: Vector2, output?:Vector2 = new Vector2): Vector2 {
            return output.setTo(this.x * v.x, this.y * v.y);
        }

        public div(v: Vector2, output?:Vector2 = new Vector2): Vector2 {
            return output.setTo(this.x / v.x, this.y / v.y);
        }

        public scale(coef: number, output?:Vector2 = new Vector2): Vector2 {
            return output.setTo(this.x * coef, this.y * coef);
        }

        public mutableSet(v: Vector2): Vector2 {
            this.x = v.x;
            this.y = v.y;
            return this;
        }

        public mutableAdd(v: Vector2): Vector2 {
            this.x += v.x;
            this.y += v.y;
            return this;
        }

        public mutableSub(v: Vector2): Vector2 {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        }

        public mutableMul(v: Vector2): Vector2 {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        }

        public mutableDiv(v: Vector2): Vector2 {
            this.x /= v.x;
            this.y /= v.y;
            return this;
        }

        public mutableScale(coef: number): Vector2 {
            this.x *= coef;
            this.y *= coef;
            return this;
        }

        public equals(v: Vector2): bool {
            return this.x == v.x && this.y == v.y;
        }

        public epsilonEquals(v: Vector2, epsilon:number): bool {
            return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon;
        }

        public length(): number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        public length2(): number {
            return this.x * this.x + this.y * this.y;
        }

        public dist(v: Vector2): number {
            return Math.sqrt(this.dist2(v));
        }

        public dist2(v: Vector2): number {
            return ((v.x - this.x) * (v.x - this.x)) + ((v.y - this.y) * (v.y - this.y));
        }

        public normal(output?: Vector2 = new Vector2) {
            var m = Math.sqrt(this.x * this.x + this.y * this.y);
            return output.setTo(this.x / m, this.y / m);
        }

        public dot(v: Vector2): number {
            return this.x * v.x + this.y * v.y;
        }

        public angle(v: Vector2): number {
            return Math.atan2(this.x * v.y - this.y * v.x, this.x * v.x + this.y * v.y);
        }

        public angle2(vLeft: Vector2, vRight: Vector2): number {
            return vLeft.sub(this).angle(vRight.sub(this));
        }

        public rotate(origin, theta, output?: Vector2 = new Vector2): Vector2 {
            var x = this.x - origin.x;
            var y = this.y - origin.y;
            return output.setTo(x * Math.cos(theta) - y * Math.sin(theta) + origin.x, x * Math.sin(theta) + y * Math.cos(theta) + origin.y);
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