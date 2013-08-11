/// <reference path="../Game.ts" />
/// <reference path="Polygon.ts" />
/**
* Phaser - Response
*
*/
var Phaser;
(function (Phaser) {
    var Response = (function () {
        /**
        * An object representing the result of an intersection. Contain information about:
        * - The two objects participating in the intersection
        * - The vector representing the minimum change necessary to extract the first object
        *   from the second one.
        * - Whether the first object is entirely inside the second, or vice versa.
        *
        * @constructor
        */
        function Response() {
            this.a = null;
            this.b = null;
            this.overlapN = new Vector2();
            this.overlapV = new Vector2();
            this.clear();
        }
        Response.prototype.clear = /**
        * Set some values of the response back to their defaults.  Call this between tests if
        * you are going to reuse a single Response object for multiple intersection tests (recommented)
        *
        * @return {Response} This for chaining
        */
        function () {
            this.aInB = true;
            this.bInA = true;
            this.overlap = Number.MAX_VALUE;
            return this;
        };
        return Response;
    })();
    Phaser.Response = Response;    
})(Phaser || (Phaser = {}));
