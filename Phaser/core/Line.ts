/// <reference path="../Game.ts" />

/**
* Phaser - Line
*
* A Line object is an infinte line through space. The two sets of x/y coordinates define the Line Segment.
*/

module Phaser {

    export class Line {

        /**
        *
        * @constructor
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} x2
        * @param {Number} y2
        * @return {Phaser.Line} This Object
        */
        constructor(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0) {

            this.setTo(x1, y1, x2, y2);

        }

        /**
        *
        * @property x1
        * @type {Number}
        */
        public x1: number = 0;

        /**
        *
        * @property y1
        * @type {Number}
        */
        public y1: number = 0;

        /**
        *
        * @property x2
        * @type {Number}
        */
        public x2: number = 0;

        /**
        *
        * @property y2
        * @type {Number}
        */
        public y2: number = 0;

        /**
        *
        * @method clone
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        public clone(output?: Line = new Line): Line {

            return output.setTo(this.x1, this.y1, this.x2, this.y2);

        }

        /**
        *
        * @method copyFrom
        * @param {Phaser.Line} source
        * @return {Phaser.Line}
        */
        public copyFrom(source: Line): Line {

            return this.setTo(source.x1, source.y1, source.x2, source.y2);

        }

        /**
        *
        * @method copyTo
        * @param {Phaser.Line} target
        * @return {Phaser.Line}
        */
        public copyTo(target: Line): Line {

            return target.copyFrom(this);

        }

        /**
        *
        * @method setTo
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} x2
        * @param {Number} y2
        * @return {Phaser.Line}
        */
        public setTo(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0): Line {

            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;

            return this;

        }

        public get width(): number {

            return Math.max(this.x1, this.x2) - Math.min(this.x1, this.x2);

        }

        public get height(): number {

            return Math.max(this.y1, this.y2) - Math.min(this.y1, this.y2);

        }

        /**
        *
        * @method length
        * @return {Number}
        */
        public get length(): number {

            return Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) * (this.y2 - this.y1));

        }

        /**
        *
        * @method getY
        * @param {Number} x
        * @return {Number}
        */
        public getY(x: number): number {

            return this.slope * x + this.yIntercept;

        }

        /**
        *
        * @method angle
        * @return {Number}
        */
        public get angle(): number {

            return Math.atan2(this.x2 - this.x1, this.y2 - this.y1);

        }

        /**
        *
        * @method slope
        * @return {Number}
        */
        public get slope(): number {

            return (this.y2 - this.y1) / (this.x2 - this.x1);

        }

        /**
        *
        * @method perpSlope
        * @return {Number}
        */
        public get perpSlope(): number {

            return -((this.x2 - this.x1) / (this.y2 - this.y1));

        }

        /**
        *
        * @method yIntercept
        * @return {Number}
        */
        public get yIntercept(): number {

            return (this.y1 - this.slope * this.x1);

        }

        /**
        *
        * @method isPointOnLine
        * @param {Number} x
        * @param {Number} y
        * @return {Boolean}
        */
        public isPointOnLine(x: number, y: number): bool {

            if ((x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1))
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        /**
        *
        * @method isPointOnLineSegment
        * @param {Number} x
        * @param {Number} y
        * @return {Boolean}
        */
        public isPointOnLineSegment(x: number, y: number): bool {

            var xMin = Math.min(this.x1, this.x2);
            var xMax = Math.max(this.x1, this.x2);
            var yMin = Math.min(this.y1, this.y2);
            var yMax = Math.max(this.y1, this.y2);

            if (this.isPointOnLine(x, y) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax))
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        /**
        *
        * @method intersectLineLine
        * @param {Any} line
        * @return {Any}
        */
        public intersectLineLine(line): any {
            //return Phaser.intersectLineLine(this,line);
        }

        /**
        *
        * @method perp
        * @param {Number} x
        * @param {Number} y
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        public perp(x: number, y: number, output?: Line): Line {

            if (this.y1 === this.y2)
            {
                if (output)
                {
                    output.setTo(x, y, x, this.y1);
                }
                else
                {
                    return new Line(x, y, x, this.y1);
                }
            }

            var yInt: number = (y - this.perpSlope * x);

            var pt: any = this.intersectLineLine({ x1: x, y1: y, x2: 0, y2: yInt });

            if (output)
            {
                output.setTo(x, y, pt.x, pt.y);
            }
            else
            {
                return new Line(x, y, pt.x, pt.y);
            }

        }

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
        public toString(): string {

            return "[{Line (x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " y2=" + this.y2 + ")}]";

        }

    }

}