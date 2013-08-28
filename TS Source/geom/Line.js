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
        Line.prototype.clone = /**
        *
        * @method clone
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        function (output) {
            if (typeof output === "undefined") { output = new Line(); }
            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        };
        Line.prototype.copyFrom = /**
        *
        * @method copyFrom
        * @param {Phaser.Line} source
        * @return {Phaser.Line}
        */
        function (source) {
            return this.setTo(source.x1, source.y1, source.x2, source.y2);
        };
        Line.prototype.copyTo = /**
        *
        * @method copyTo
        * @param {Phaser.Line} target
        * @return {Phaser.Line}
        */
        function (target) {
            return target.copyFrom(this);
        };
        Line.prototype.setTo = /**
        *
        * @method setTo
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} x2
        * @param {Number} y2
        * @return {Phaser.Line}
        */
        function (x1, y1, x2, y2) {
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
        Line.prototype.getY = /**
        *
        * @method getY
        * @param {Number} x
        * @return {Number}
        */
        function (x) {
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
        Line.prototype.isPointOnLine = /**
        *
        * @method isPointOnLine
        * @param {Number} x
        * @param {Number} y
        * @return {bool}
        */
        function (x, y) {
            if((x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1)) {
                return true;
            } else {
                return false;
            }
        };
        Line.prototype.isPointOnLineSegment = /**
        *
        * @method isPointOnLineSegment
        * @param {Number} x
        * @param {Number} y
        * @return {bool}
        */
        function (x, y) {
            var xMin = Math.min(this.x1, this.x2);
            var xMax = Math.max(this.x1, this.x2);
            var yMin = Math.min(this.y1, this.y2);
            var yMax = Math.max(this.y1, this.y2);
            if(this.isPointOnLine(x, y) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax)) {
                return true;
            } else {
                return false;
            }
        };
        Line.prototype.intersectLineLine = /**
        *
        * @method intersectLineLine
        * @param {Any} line
        * @return {Any}
        */
        function (line) {
            //return Phaser.intersectLineLine(this,line);
                    };
        Line.prototype.toString = /**
        *
        * @method perp
        * @param {Number} x
        * @param {Number} y
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        /*
        public perp(x: number, y: number, output: Line): Line {
        
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
        
        var pt = this.intersectLineLine({ x1: x, y1: y, x2: 0, y2: yInt });
        
        if (output)
        {
        output.setTo(x, y, pt.x, pt.y);
        }
        else
        {
        return new Line(x, y, pt.x, pt.y);
        }
        
        }
        */
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
        function () {
            return "[{Line (x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " y2=" + this.y2 + ")}]";
        };
        return Line;
    })();
    Phaser.Line = Line;    
})(Phaser || (Phaser = {}));
