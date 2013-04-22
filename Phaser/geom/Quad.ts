/// <reference path="../Game.ts" />

/**
* Phaser - Quad
*
* A Quad object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
* Very much like a Rectangle only without all of the additional methods and properties of that class.
*/

module Phaser {

    export class Quad {

        /**
        * Creates a new Quad object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a rectangle with x, y, width, and height properties set to 0 is created.
        * @class Quad
        * @constructor
        * @param {Number} x The x coordinate of the top-left corner of the quad.
        * @param {Number} y The y coordinate of the top-left corner of the quad.
        * @param {Number} width The width of the quad.
        * @param {Number} height The height of the quad.
        * @return {Quad } This object
        **/
        constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {

            this.setTo(x, y, width, height);

        }

        public x: number;
        public y: number;
        public width: number;
        public height: number;

        /**
        * Sets the Quad to the specified size.
        * @method setTo
        * @param {Number} x The x coordinate of the top-left corner of the quad.
        * @param {Number} y The y coordinate of the top-left corner of the quad.
        * @param {Number} width The width of the quad.
        * @param {Number} height The height of the quad.
        * @return {Quad} This object
        **/
        public setTo(x: number, y: number, width: number, height: number): Quad {

            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;

            return this;

        }


    }

}