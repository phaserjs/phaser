/// <reference path="../Game.ts" />

/**
* Phaser - Polygon
*
*/

module Phaser {

    export class Polygon {

        /**
        * A *convex* clockwise polygon
        * @class Polygon
        * @constructor
        * @param {Vec2} pos A vector representing the origin of the polygon (all other points are relative to this one)
        * @param {Array.<Vec2>} points An Array of vectors representing the points in the polygon, in clockwise order.
        **/
        constructor(pos?: Vec2 = new Vec2, points?: Vec2[] = [], parent?:any = null) {

            this.pos = pos;
            this.points = points;
            this.parent = parent;
            this.recalc();

        }

        public parent: any;
        public pos: Vec2;
        public points: Vec2[];
        public edges: Vec2[];
        public normals: Vec2[];

        /**
        * Recalculate the edges and normals of the polygon.  This
        * MUST be called if the points array is modified at all and
        * the edges or normals are to be accessed.
        */
        public recalc() {

            var points = this.points;
            var len = points.length;

            this.edges = [];
            this.normals = [];

            for (var i = 0; i < len; i++)
            {
                var p1 = points[i];
                var p2 = i < len - 1 ? points[i + 1] : points[0];
                var e = new Vec2().copyFrom(p2).sub(p1);
                var n = new Vec2().copyFrom(e).perp().normalize();
                this.edges.push(e);
                this.normals.push(n);
            }
        }

    }

}