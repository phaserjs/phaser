/// <reference path="../Game.ts" />
/// <reference path="Polygon.ts" />

/**
* Phaser - Response
*
*/

module Phaser {

    export class Response {

        /**
        * An object representing the result of an intersection. Contain information about:
        * - The two objects participating in the intersection
        * - The vector representing the minimum change necessary to extract the first object
        *   from the second one.
        * - Whether the first object is entirely inside the second, or vice versa.
        * 
        * @constructor
        */  
        constructor() {

            this.a = null;
            this.b = null;
            this.overlapN = new Vec2;
            this.overlapV = new Vec2;

            this.clear();

        }

        /**
        * The first object in the collision
        */
        public a;

        /**
        * The second object in the collision
        */
        public b;

        /**
        * The shortest colliding axis (unit-vector)
        */
        public overlapN: Vec2;

        /**
        * The overlap vector (i.e. overlapN.scale(overlap, overlap)).
        * If this vector is subtracted from the position of `a`, `a` and `b` will no longer be colliding.
        */
        public overlapV: Vec2;

        /**
        * Whether the first object is completely inside the second.
        */
        public aInB: bool;

        /**
        * Whether the second object is completely inside the first.
        */
        public bInA: bool;

        /**
        * Magnitude of the overlap on the shortest colliding axis
        */
        public overlap: number;

        /**
        * Set some values of the response back to their defaults.  Call this between tests if 
        * you are going to reuse a single Response object for multiple intersection tests (recommented)
        * 
        * @return {Response} This for chaining
        */
        public clear() {

            this.aInB = true;
            this.bInA = true;
            this.overlap = Number.MAX_VALUE;

            return this;

        }

    }

}