/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../geom/Point.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="Manager.ts" />
/// <reference path="Body.ts" />
/// <reference path="Shape.ts" />

/**
* Phaser - Advanced Physics - Shape
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Advanced {

    export class ShapeCircle extends Phaser.Physics.Advanced.Shape implements IShape {

        constructor(radius: number, x?: number = 0, y?: number = 0) {

            super(Manager.SHAPE_TYPE_CIRCLE);

            this.center = new Phaser.Vec2(x, y);
            this.radius = radius;
            this.tc = new Phaser.Vec2;

            this.finishVerts();

        }

        public radius: number;
        public center: Phaser.Vec2;
        public tc: Phaser.Vec2;

        public finishVerts() {
            this.radius = Math.abs(this.radius);
        }

        public duplicate() {
            return new ShapeCircle(this.center.x, this.center.y, this.radius);
        }

        public recenter(c:Phaser.Vec2) {
            this.center.subtract(c);
        }

        public transform(xf: Transform) {

            Phaser.TransformUtils.transform(xf, this.center, this.center);
            //this.center = xf.transform(this.center);
        }

        public untransform(xf: Transform) {
            Phaser.TransformUtils.untransform(xf, this.center, this.center);
            //this.center = xf.untransform(this.center);
        }

        public area(): number {
            return Manager.areaForCircle(this.radius, 0);
        }

        public centroid(): Phaser.Vec2 {
            return Phaser.Vec2Utils.clone(this.center);
        }

        public inertia(mass: number): number {
            return Manager.inertiaForCircle(mass, this.center, this.radius, 0);
        }

        public cacheData(xf: Transform) {

            Phaser.TransformUtils.transform(xf, this.center, this.tc);
            //this.tc = xf.transform(this.center);

            this.bounds.mins.setTo(this.tc.x - this.radius, this.tc.y - this.radius);
            this.bounds.maxs.setTo(this.tc.x + this.radius, this.tc.y + this.radius);

        }

        public pointQuery(p:Phaser.Vec2): bool {
            //return vec2.distsq(this.tc, p) < (this.r * this.r);
            return Phaser.Vec2Utils.distanceSq(this.tc, p) < (this.radius * this.radius);
        }

        public findVertexByPoint(p:Phaser.Vec2, minDist: number): number {

            var dsq = minDist * minDist;

            if (Phaser.Vec2Utils.distanceSq(this.tc, p) < dsq)
            {
                return 0;
            }

            return -1;
        }

        public distanceOnPlane(n, d) {
            Phaser.Vec2Utils.dot(n, this.tc) - this.radius - d;
        }

    }

}