/// <reference path="../../../math/Vec2.ts" />
/// <reference path="../../../math/Vec2Utils.ts" />
/// <reference path="../Manager.ts" />
/// <reference path="../Body.ts" />
/// <reference path="Shape.ts" />

/**
* Phaser - Advanced Physics - Shapes - Segment
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Advanced.Shapes {

    export class Segment extends Phaser.Physics.Advanced.Shape implements IShape {

        constructor(a, b, radius: number) {

            super(Manager.SHAPE_TYPE_SEGMENT);

            this.a = a.duplicate();
            this.b = b.duplicate();
            this.radius = radius;

            this.normal = Phaser.Vec2Utils.perp(Phaser.Vec2Utils.subtract(b, a));
            this.normal.normalize();

            this.ta = new Phaser.Vec2;
            this.tb = new Phaser.Vec2;
            this.tn = new Phaser.Vec2;

            this.finishVerts();

        }

        public a: Phaser.Vec2;
        public b: Phaser.Vec2;
        public radius: number;

        public normal: Phaser.Vec2;
        public ta: Phaser.Vec2;
        public tb: Phaser.Vec2;
        public tn: Phaser.Vec2;

        public finishVerts() {

            this.normal = Phaser.Vec2Utils.perp(Phaser.Vec2Utils.subtract(this.b, this.a));
            this.normal.normalize();

            this.radius = Math.abs(this.radius);

        }

        public duplicate() {
            return new Phaser.Physics.Advanced.Shapes.Segment(this.a, this.b, this.radius);
        }

        public recenter(c) {
            this.a.subtract(c);
            this.b.subtract(c);
        }

        public transform(xf:Transform) {

            Phaser.TransformUtils.transform(xf, this.a, this.a);
            Phaser.TransformUtils.transform(xf, this.b, this.b);
            
            //this.a = xf.transform(this.a);
            //this.b = xf.transform(this.b);

        }

        public untransform(xf:Transform) {

            Phaser.TransformUtils.untransform(xf, this.a, this.a);
            Phaser.TransformUtils.untransform(xf, this.b, this.b);

            //this.a = xf.untransform(this.a);
            //this.b = xf.untransform(this.b);

        }

        public area(): number {
            return Manager.areaForSegment(this.a, this.b, this.radius);
        }

        public centroid(): Phaser.Vec2 {
            return Manager.centroidForSegment(this.a, this.b);
        }

        public inertia(mass: number): number {
            return Manager.inertiaForSegment(mass, this.a, this.b);
        }

        public cacheData(xf:Transform) {

            Phaser.TransformUtils.transform(xf, this.a, this.ta);
            Phaser.TransformUtils.transform(xf, this.b, this.tb);

            //this.ta = xf.transform(this.a);
            //this.tb = xf.transform(this.b);

            this.tn = Phaser.Vec2Utils.perp(Phaser.Vec2Utils.subtract(this.tb, this.ta)).normalize();

            var l;
            var r;
            var t;
            var b;

            if (this.ta.x < this.tb.x)
            {
                l = this.ta.x;
                r = this.tb.x;
            }
            else
            {
                l = this.tb.x;
                r = this.ta.x;
            }

            if (this.ta.y < this.tb.y)
            {
                b = this.ta.y;
                t = this.tb.y;
            } else
            {
                b = this.tb.y;
                t = this.ta.y;
            }

            this.bounds.mins.setTo(l - this.radius, b - this.radius);
            this.bounds.maxs.setTo(r + this.radius, t + this.radius);

        }

        public pointQuery(p: Phaser.Vec2): bool {

            if (!this.bounds.containPoint(p))
            {
                return false;
            }

            var dn = Phaser.Vec2Utils.dot(this.tn, p) - Phaser.Vec2Utils.dot(this.ta, this.tn);
            var dist = Math.abs(dn);

            if (dist > this.radius)
            {
                return false;
            }

            var dt = Phaser.Vec2Utils.cross(p, this.tn);
            var dta = Phaser.Vec2Utils.cross(this.ta, this.tn);
            var dtb = Phaser.Vec2Utils.cross(this.tb, this.tn);

            if (dt <= dta)
            {
                if (dt < dta - this.radius)
                {
                    return false;
                }

                return Phaser.Vec2Utils.distanceSq(this.ta, p) < (this.radius * this.radius);
            }
            else if (dt > dtb)
            {
                if (dt > dtb + this.radius)
                {
                    return false;
                }

                return Phaser.Vec2Utils.distanceSq(this.tb, p) < (this.radius * this.radius);
            }

            return true;
        }

        public findVertexByPoint(p:Phaser.Vec2, minDist: number): number {

            var dsq = minDist * minDist;

            if (Phaser.Vec2Utils.distanceSq(this.ta, p) < dsq)
            {
                return 0;
            }

            if (Phaser.Vec2Utils.distanceSq(this.tb, p) < dsq)
            {
                return 1;
            }

            return -1;
        }

        public distanceOnPlane(n, d) {

            var a = Phaser.Vec2Utils.dot(n, this.ta) - this.radius;
            var b = Phaser.Vec2Utils.dot(n, this.tb) - this.radius;

            return Math.min(a, b) - d;
        }

    }

}