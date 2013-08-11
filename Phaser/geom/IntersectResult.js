/// <reference path="../Game.ts" />
/**
* Phaser - IntersectResult
*
* A light-weight result object to hold the results of an intersection. For when you need more than just true/false.
*/
var Phaser;
(function (Phaser) {
    var IntersectResult = (function () {
        function IntersectResult() {
            /**
            * Did they intersect or not?
            * @property result
            * @type {Boolean}
            */
            this.result = false;
        }
        IntersectResult.prototype.setTo = /**
        *
        * @method setTo
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} [x2]
        * @param {Number} [y2]
        * @param {Number} [width]
        * @param {Number} [height]
        */
        function (x1, y1, x2, y2, width, height) {
            if (typeof x2 === "undefined") { x2 = 0; }
            if (typeof y2 === "undefined") { y2 = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            this.x = x1;
            this.y = y1;
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.width = width;
            this.height = height;
        };
        return IntersectResult;
    })();
    Phaser.IntersectResult = IntersectResult;    
})(Phaser || (Phaser = {}));
