/// <reference path="../../../math/Vec2.ts" />
/// <reference path="../../../math/Vec2Utils.ts" />
/// <reference path="../Manager.ts" />
/// <reference path="../Body.ts" />
/// <reference path="Shape.ts" />

/**
* Phaser - Advanced Physics - Shapes - Convex Polygon
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Advanced.Shapes {

    export class Poly extends Phaser.Physics.Advanced.Shape implements IShape {

        constructor(verts?:Phaser.Vec2[]) {

            super(Manager.SHAPE_TYPE_POLY);

            this.verts = [];
            this.planes = [];

            this.tverts = [];
            this.tplanes = [];

            if (verts)
            {
                for (var i = 0; i < verts.length; i++)
                {
                    this.verts[i] = Phaser.Vec2Utils.clone(verts[i]);
                    this.tverts[i] = this.verts[i];

                    this.tplanes[i] = {};
                    this.tplanes[i].n = new Phaser.Vec2;
                    this.tplanes[i].d = 0;
                }
            }

            this.finishVerts();

        }

        public verts: Phaser.Vec2[];
        public planes;

        public tverts;
        public tplanes;

        public convexity: bool;

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

                this.planes[i] = {};
                this.planes[i].n = n;
                this.planes[i].d = Phaser.Vec2Utils.dot(n, a);

                this.tverts[i] = this.verts[i];

                this.tplanes[i] = {};
                this.tplanes[i].n = new Phaser.Vec2;
                this.tplanes[i].d = 0;
            }

            for (var i = 0; i < this.verts.length; i++)
            {
                var b = this.verts[(i + 2) % this.verts.length];
                var n = this.planes[i].n;
                var d = this.planes[i].d;

                if (Phaser.Vec2Utils.dot(n, b) - d > 0)
                {
                    this.convexity = false;
                }
            }
        }

        public duplicate() {
            return new ShapePoly(this.verts);
        }

        public recenter(c) {

            for (var i = 0; i < this.verts.length; i++)
            {
                this.verts[i].subtract(c);
            }

        }

        public transform(xf) {
            for (var i = 0; i < this.verts.length; i++)
            {
                this.verts[i] = xf.transform(this.verts[i]);
            }
        }

        public untransform(xf) {
            for (var i = 0; i < this.verts.length; i++)
            {
                this.verts[i] = xf.untransform(this.verts[i]);
            }
        }

        public area(): number {
            return Manager.areaForPoly(this.verts);
        }

        public centroid(): Phaser.Vec2 {
            return Manager.centroidForPoly(this.verts);
        }

        public inertia(mass: number): number {
            return Manager.inertiaForPoly(mass, this.verts, new Phaser.Vec2);
        }

        public cacheData(xf:Transform) {

            this.bounds.clear();

            var numVerts = this.verts.length;

            //console.log('shapePoly cacheData', numVerts);

            if (numVerts == 0)
            {
                return;
            }

            for (var i = 0; i < numVerts; i++)
            {
                Phaser.TransformUtils.transform(xf, this.tverts[i], this.tverts[i]);
                //this.tverts[i] = xf.transform(this.verts[i]);
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

                this.tplanes[i].n = n;
                this.tplanes[i].d = Phaser.Vec2Utils.dot(n, a);

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
                var n = this.tplanes[i].n;

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

        public distanceOnPlane(n, d) {

            var min = 999999;

            for (var i = 0; i < this.verts.length; i++)
            {
                min = Math.min(min, Phaser.Vec2Utils.dot(n, this.tverts[i]));
            }

            return min - d;

        }

        public containPoint(p) {

            for (var i = 0; i < this.verts.length; i++)
            {
                var plane = this.tplanes[i];

                if (Phaser.Vec2Utils.dot(plane.n, p) - plane.d > 0)
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

                if (Phaser.Vec2Utils.dot(plane.n, n) < 0.0001)
                {
                    continue;
                }

                if (Phaser.Vec2Utils.dot(plane.n, p) - plane.d > 0)
                {
                    return false;
                }
            }

            return true;
        }

    }

}