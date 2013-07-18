/// <reference path="../Game.ts" />

/**
* Phaser - Point
*
* The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
*/

module Phaser {

    export class Point {

        /**
        * Creates a new Point. If you pass no parameters a Point is created set to (0,0).
        * @class Point
        * @constructor
        * @param {Number} x The horizontal position of this Point (default 0)
        * @param {Number} y The vertical position of this Point (default 0)
        **/
        constructor(x: number = 0, y: number = 0) {

            this.x = x;
            this.y = y;

        }

        x: number;
        y: number;

        /**
         * Copies the x and y properties from any given object to this Point.
         * @method copyFrom
         * @param {any} source - The object to copy from.
         * @return {Point} This Point object.
         **/
        public copyFrom(source: any): Point {
            return this.setTo(source.x, source.y);
        }

        /**
        * Inverts the x and y values of this Point
        * @method invert
        * @return {Point} This Point object.
        **/
        public invert(): Point {
            return this.setTo(this.y, this.x);
        }

        /**
         * Sets the x and y values of this MicroPoint object to the given coordinates.
         * @method setTo
         * @param {Number} x - The horizontal position of this point.
         * @param {Number} y - The vertical position of this point.
         * @return {MicroPoint} This MicroPoint object. Useful for chaining method calls.
         **/
        public setTo(x: number, y: number): Point {

            this.x = x;
            this.y = y;

            return this;

        }

        /**
         * Returns a string representation of this object.
         * @method toString
         * @return {string} a string representation of the instance.
         **/
        public toString(): string {
            return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
        }

    }

}