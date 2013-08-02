/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="../AdvancedPhysics.ts" />
/// <reference path="../Body.ts" />
/// <reference path="../Plane.ts" />
/// <reference path="Shape.ts" />

/**
* Phaser - Advanced Physics - Shapes - Convex Polygon
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Shapes {

    export class Poly extends Phaser.Physics.Shape implements IShape {

        //  Verts is an optional array of objects, the objects must have public x and y properties which will be used
        //  to seed this polygon (i.e. Vec2 objects, or just straight JS objects) and must wind COUNTER clockwise
        constructor(verts?) {

            super(AdvancedPhysics.SHAPE_TYPE_POLY);

            this.verts = [];
            this.planes = [];
            this.tverts = [];
            this.tplanes = [];

            if (verts)
            {
                for (var i = 0; i < verts.length; i++)
                {
                    this.verts[i] = new Phaser.Vec2(verts[i].x, verts[i].y);
                    this.tverts[i] = this.verts[i];
                    //this.tverts[i] = new Phaser.Vec2(verts[i].x, verts[i].y);
                    this.tplanes[i] = new Phaser.Physics.Plane(new Phaser.Vec2, 0);
                }
            }

            this.finishVerts();

        }


        public finishVerts() {

            if (this.verts.length < 2)
            {
                this.convexity = false;
                this.planes = [];
                return;
            }

            this.convexity = true;
            this.tverts = [];
            this.tplanes = [];

            // Must be counter-clockwise verts
            for (var i = 0; i < this.verts.length; i++)
            {
                var a = this.verts[i];
                var b = this.verts[(i + 1) % this.verts.length];
                var n = Phaser.Vec2Utils.normalize(Phaser.Vec2Utils.perp(Phaser.Vec2Utils.subtract(a, b)));

                this.planes[i] = new Phaser.Physics.Plane(n, Phaser.Vec2Utils.dot(n, a));

                this.tverts[i] = Phaser.Vec2Utils.clone(this.verts[i]); // reference???
                //this.tverts[i] = this.verts[i]; // reference???

                this.tplanes[i] = new Phaser.Physics.Plane(new Phaser.Vec2, 0);
            }

            for (var i = 0; i < this.verts.length; i++)
            {
                //var b = this.verts[(i + 2) % this.verts.length];
                //var n = this.planes[i].normal;
                //var d = this.planes[i].d;

                if (Phaser.Vec2Utils.dot(this.planes[i].normal, this.verts[(i + 2) % this.verts.length]) - this.planes[i].d > 0)
                {
                    this.convexity = false;
                }
            }

        }

        public duplicate() {
            return new Phaser.Physics.Shapes.Poly(this.verts);
        }

        public recenter(c) {

            for (var i = 0; i < this.verts.length; i++)
            {
                this.verts[i].subtract(c);
            }

        }

        public transform(xf:Phaser.Transform) {

            for (var i = 0; i < this.verts.length; i++)
            {
                this.verts[i] = Phaser.TransformUtils.transform(xf, this.verts[i]);
                //this.verts[i] = xf.transform(this.verts[i]);
            }
        }

        public untransform(xf:Phaser.Transform) {

            for (var i = 0; i < this.verts.length; i++)
            {
                this.verts[i] = Phaser.TransformUtils.untransform(xf, this.verts[i]);
                //this.verts[i] = xf.untransform(this.verts[i]);
            }

        }

        public area(): number {
            return AdvancedPhysics.areaForPoly(this.verts);
        }

        public centroid(): Phaser.Vec2 {
            return AdvancedPhysics.centroidForPoly(this.verts);
        }

        public inertia(mass: number): number {
            return AdvancedPhysics.inertiaForPoly(mass, this.verts, new Phaser.Vec2);
        }

        public cacheData(xf:Transform) {

            this.bounds.clear();

            var numVerts = this.verts.length;

            AdvancedPhysics.write('----------- Poly cacheData = ' + numVerts);

            if (numVerts == 0)
            {
                return;
            }

            for (var i = 0; i < numVerts; i++)
            {
                this.tverts[i] = Phaser.TransformUtils.transform(xf, this.verts[i]);
                //this.tverts[i] = xf.transform(this.verts[i]);
                AdvancedPhysics.write('tvert' + i + ' = ' + this.tverts[i].toString());
            }

            if (numVerts < 2)
            {
                this.bounds.addPoint(this.tverts[0]);
                return;
            }

            for (var i = 0; i < numVerts; i++)
            {
                var a = this.tverts[i];
                var b = this.tverts[(i + 1) % numVerts];
                var n = Phaser.Vec2Utils.normalize(Phaser.Vec2Utils.perp(Phaser.Vec2Utils.subtract(a, b)));

		        AdvancedPhysics.write('a = ' + a.toString());
		        AdvancedPhysics.write('b = ' + b.toString());
		        AdvancedPhysics.write('n = ' + n.toString());

                this.tplanes[i].normal = n;
                this.tplanes[i].d = Phaser.Vec2Utils.dot(n, a);

		        AdvancedPhysics.write('tplanes' + i + ' n = ' + this.tplanes[i].normal.toString());
		        AdvancedPhysics.write('tplanes' + i + ' d = ' + this.tplanes[i].d.toString());

                this.bounds.addPoint(a);

            }

        }

        public pointQuery(p: Phaser.Vec2): bool {

            if (!this.bounds.containPoint(p))
            {
                return false;
            }

            return this.containPoint(p);
        }

        public findVertexByPoint(p:Phaser.Vec2, minDist: number): number {

            var dsq = minDist * minDist;

            for (var i = 0; i < this.tverts.length; i++)
            {
                if (Phaser.Vec2Utils.distanceSq(this.tverts[i], p) < dsq)
                {
                    return i;
                }
            }

            return -1;
        }

        public findEdgeByPoint(p: Phaser.Vec2, minDist: number): number {

            var dsq = minDist * minDist;
            var numVerts = this.tverts.length;

            for (var i = 0; i < this.tverts.length; i++)
            {
                var v1 = this.tverts[i];
                var v2 = this.tverts[(i + 1) % numVerts];
                var n = this.tplanes[i].normal;

                var dtv1 = Phaser.Vec2Utils.cross(v1, n);
                var dtv2 = Phaser.Vec2Utils.cross(v2, n);
                var dt = Phaser.Vec2Utils.cross(p, n);

                if (dt > dtv1)
                {
                    if (Phaser.Vec2Utils.distanceSq(v1, p) < dsq)
                    {
                        return i;
                    }
                }
                else if (dt < dtv2)
                {
                    if (Phaser.Vec2Utils.distanceSq(v2, p) < dsq)
                    {
                        return i;
                    }
                }
                else
                {
                    var dist = Phaser.Vec2Utils.dot(n, p) - Phaser.Vec2Utils.dot(n, v1);

                    if (dist * dist < dsq)
                    {
                        return i;
                    }
                }
            }

            return -1;

        }

        public distanceOnPlane(n: Phaser.Vec2, d:number) {

            var min: number = 999999;

            for (var i = 0; i < this.verts.length; i++)
            {
                min = Math.min(min, Phaser.Vec2Utils.dot(n, this.tverts[i]));
            }

            return min - d;

        }

        public containPoint(p: Phaser.Vec2) {

            for (var i = 0; i < this.verts.length; i++)
            {
                var plane = this.tplanes[i];

                if (Phaser.Vec2Utils.dot(plane.normal, p) - plane.d > 0)
                {
                    return false;
                }
            }

            return true;

        }

        public containPointPartial(p, n) {

            for (var i = 0; i < this.verts.length; i++)
            {
                var plane = this.tplanes[i];

                if (Phaser.Vec2Utils.dot(plane.normal, n) < 0.0001)
                {
                    continue;
                }

                if (Phaser.Vec2Utils.dot(plane.normal, p) - plane.d > 0)
                {
                    return false;
                }
            }

            return true;
        }

    }

}