var Phaser;
(function (Phaser) {
    /// <reference path="../math/Vec2.ts" />
    /// <reference path="../geom/Point.ts" />
    /// <reference path="../math/Vec2Utils.ts" />
    /// <reference path="shapes/Shape.ts" />
    /// <reference path="shapes/Circle.ts" />
    /// <reference path="shapes/Poly.ts" />
    /// <reference path="shapes/Segment.ts" />
    /// <reference path="AdvancedPhysics.ts" />
    /// <reference path="Body.ts" />
    /// <reference path="Contact.ts" />
    /**
    * Phaser - Advanced Physics - Collision Handlers
    *
    * Based on the work Ju Hyung Lee started in JS PhyRus.
    */
    (function (Physics) {
        var Collision = (function () {
            function Collision() { }
            Collision.prototype.collide = function (a, b, contacts) {
                //  Circle (a is the circle)
                if(a.type == Physics.AdvancedPhysics.SHAPE_TYPE_CIRCLE) {
                    if(b.type == Physics.AdvancedPhysics.SHAPE_TYPE_CIRCLE) {
                        return this.circle2Circle(a, b, contacts);
                    } else if(b.type == Physics.AdvancedPhysics.SHAPE_TYPE_SEGMENT) {
                        return this.circle2Segment(a, b, contacts);
                    } else if(b.type == Physics.AdvancedPhysics.SHAPE_TYPE_POLY) {
                        return this.circle2Poly(a, b, contacts);
                    }
                }
                //  Segment (a is the segment)
                if(a.type == Physics.AdvancedPhysics.SHAPE_TYPE_SEGMENT) {
                    if(b.type == Physics.AdvancedPhysics.SHAPE_TYPE_CIRCLE) {
                        return this.circle2Segment(b, a, contacts);
                    } else if(b.type == Physics.AdvancedPhysics.SHAPE_TYPE_SEGMENT) {
                        return this.segment2Segment(a, b, contacts);
                    } else if(b.type == Physics.AdvancedPhysics.SHAPE_TYPE_POLY) {
                        return this.segment2Poly(a, b, contacts);
                    }
                }
                //  Poly (a is the poly)
                if(a.type == Physics.AdvancedPhysics.SHAPE_TYPE_POLY) {
                    if(b.type == Physics.AdvancedPhysics.SHAPE_TYPE_CIRCLE) {
                        return this.circle2Poly(b, a, contacts);
                    } else if(b.type == Physics.AdvancedPhysics.SHAPE_TYPE_SEGMENT) {
                        return this.segment2Poly(b, a, contacts);
                    } else if(b.type == Physics.AdvancedPhysics.SHAPE_TYPE_POLY) {
                        return this.poly2Poly(a, b, contacts);
                    }
                }
            };
            Collision.prototype._circle2Circle = function (c1, r1, c2, r2, contactArr) {
                var rmax = r1 + r2;
                var t = new Phaser.Vec2();
                //var t = vec2.sub(c2, c1);
                Phaser.Vec2Utils.subtract(c2, c1, t);
                var distsq = t.lengthSq();
                if(distsq > rmax * rmax) {
                    return 0;
                }
                var dist = Math.sqrt(distsq);
                var p = new Phaser.Vec2();
                Phaser.Vec2Utils.multiplyAdd(c1, t, 0.5 + (r1 - r2) * 0.5 / dist, p);
                //var p = vec2.mad(c1, t, 0.5 + (r1 - r2) * 0.5 / dist);
                var n = new Phaser.Vec2();
                //var n = (dist != 0) ? vec2.scale(t, 1 / dist) : vec2.zero;
                if(dist != 0) {
                    Phaser.Vec2Utils.scale(t, 1 / dist, n);
                }
                var d = dist - rmax;
                contactArr.push(new Physics.Contact(p, n, d, 0));
                return 1;
            };
            Collision.prototype.circle2Circle = function (circ1, circ2, contactArr) {
                return this._circle2Circle(circ1.tc, circ1.radius, circ2.tc, circ2.radius, contactArr);
            };
            Collision.prototype.circle2Segment = function (circ, seg, contactArr) {
                var rsum = circ.radius + seg.radius;
                // Normal distance from segment
                var dn = Phaser.Vec2Utils.dot(circ.tc, seg.tn) - Phaser.Vec2Utils.dot(seg.ta, seg.tn);
                var dist = (dn < 0 ? dn * -1 : dn) - rsum;
                if(dist > 0) {
                    return 0;
                }
                // Tangential distance along segment
                var dt = Phaser.Vec2Utils.cross(circ.tc, seg.tn);
                var dtMin = Phaser.Vec2Utils.cross(seg.ta, seg.tn);
                var dtMax = Phaser.Vec2Utils.cross(seg.tb, seg.tn);
                if(dt < dtMin) {
                    if(dt < dtMin - rsum) {
                        return 0;
                    }
                    return this._circle2Circle(circ.tc, circ.radius, seg.ta, seg.radius, contactArr);
                } else if(dt > dtMax) {
                    if(dt > dtMax + rsum) {
                        return 0;
                    }
                    return this._circle2Circle(circ.tc, circ.radius, seg.tb, seg.radius, contactArr);
                }
                var n = new Phaser.Vec2();
                if(dn > 0) {
                    n.copyFrom(seg.tn);
                } else {
                    Phaser.Vec2Utils.negative(seg.tn, n);
                }
                //var n = (dn > 0) ? seg.tn : vec2.neg(seg.tn);
                var c1 = new Phaser.Vec2();
                Phaser.Vec2Utils.multiplyAdd(circ.tc, n, -(circ.radius + dist * 0.5), c1);
                var c2 = new Phaser.Vec2();
                Phaser.Vec2Utils.negative(n, c2);
                contactArr.push(new Physics.Contact(c1, c2, dist, 0));
                //contactArr.push(new Contact(vec2.mad(circ.tc, n, -(circ.r + dist * 0.5)), vec2.neg(n), dist, 0));
                return 1;
            };
            Collision.prototype.circle2Poly = function (circ, poly, contactArr) {
                var minDist = -999999;
                var minIdx = -1;
                for(var i = 0; i < poly.verts.length; i++) {
                    var plane = poly.tplanes[i];
                    var dist = Phaser.Vec2Utils.dot(circ.tc, plane.normal) - plane.d - circ.radius;
                    if(dist > 0) {
                        return 0;
                    } else if(dist > minDist) {
                        minDist = dist;
                        minIdx = i;
                    }
                }
                var n = poly.tplanes[minIdx].normal;
                var a = poly.tverts[minIdx];
                var b = poly.tverts[(minIdx + 1) % poly.verts.length];
                var dta = Phaser.Vec2Utils.cross(a, n);
                var dtb = Phaser.Vec2Utils.cross(b, n);
                var dt = Phaser.Vec2Utils.cross(circ.tc, n);
                if(dt > dta) {
                    return this._circle2Circle(circ.tc, circ.radius, a, 0, contactArr);
                } else if(dt < dtb) {
                    return this._circle2Circle(circ.tc, circ.radius, b, 0, contactArr);
                }
                var c1 = new Phaser.Vec2();
                Phaser.Vec2Utils.multiplyAdd(circ.tc, n, -(circ.radius + minDist * 0.5), c1);
                var c2 = new Phaser.Vec2();
                Phaser.Vec2Utils.negative(n, c2);
                contactArr.push(new Physics.Contact(c1, c2, minDist, 0));
                //contactArr.push(new Contact(vec2.mad(circ.tc, n, -(circ.r + minDist * 0.5)), vec2.neg(n), minDist, 0));
                return 1;
            };
            Collision.prototype.segmentPointDistanceSq = function (seg, p) {
                var w = new Phaser.Vec2();
                var d = new Phaser.Vec2();
                Phaser.Vec2Utils.subtract(p, seg.ta, w);
                Phaser.Vec2Utils.subtract(seg.tb, seg.ta, d);
                //var w = vec2.sub(p, seg.ta);
                //var d = vec2.sub(seg.tb, seg.ta);
                var proj = w.dot(d);
                if(proj <= 0) {
                    return w.dot(w);
                }
                var vsq = d.dot(d);
                if(proj >= vsq) {
                    return w.dot(w) - 2 * proj + vsq;
                }
                return w.dot(w) - proj * proj / vsq;
            };
            Collision.prototype.segment2Segment = // FIXME and optimise me lots!!!
            function (seg1, seg2, contactArr) {
                var d = [];
                d[0] = this.segmentPointDistanceSq(seg1, seg2.ta);
                d[1] = this.segmentPointDistanceSq(seg1, seg2.tb);
                d[2] = this.segmentPointDistanceSq(seg2, seg1.ta);
                d[3] = this.segmentPointDistanceSq(seg2, seg1.tb);
                var idx1 = d[0] < d[1] ? 0 : 1;
                var idx2 = d[2] < d[3] ? 2 : 3;
                var idxm = d[idx1] < d[idx2] ? idx1 : idx2;
                var s, t;
                var u = Phaser.Vec2Utils.subtract(seg1.tb, seg1.ta);
                var v = Phaser.Vec2Utils.subtract(seg2.tb, seg2.ta);
                switch(idxm) {
                    case 0:
                        s = Phaser.Vec2Utils.dot(Phaser.Vec2Utils.subtract(seg2.ta, seg1.ta), u) / Phaser.Vec2Utils.dot(u, u);
                        s = s < 0 ? 0 : (s > 1 ? 1 : s);
                        t = 0;
                        break;
                    case 1:
                        s = Phaser.Vec2Utils.dot(Phaser.Vec2Utils.subtract(seg2.tb, seg1.ta), u) / Phaser.Vec2Utils.dot(u, u);
                        s = s < 0 ? 0 : (s > 1 ? 1 : s);
                        t = 1;
                        break;
                    case 2:
                        s = 0;
                        t = Phaser.Vec2Utils.dot(Phaser.Vec2Utils.subtract(seg1.ta, seg2.ta), v) / Phaser.Vec2Utils.dot(v, v);
                        t = t < 0 ? 0 : (t > 1 ? 1 : t);
                        break;
                    case 3:
                        s = 1;
                        t = Phaser.Vec2Utils.dot(Phaser.Vec2Utils.subtract(seg1.tb, seg2.ta), v) / Phaser.Vec2Utils.dot(v, v);
                        t = t < 0 ? 0 : (t > 1 ? 1 : t);
                        break;
                }
                var minp1 = Phaser.Vec2Utils.multiplyAdd(seg1.ta, u, s);
                var minp2 = Phaser.Vec2Utils.multiplyAdd(seg2.ta, v, t);
                return this._circle2Circle(minp1, seg1.radius, minp2, seg2.radius, contactArr);
            };
            Collision.prototype.findPointsBehindSeg = // Identify vertexes that have penetrated the segment.
            function (contactArr, seg, poly, dist, coef) {
                var dta = Phaser.Vec2Utils.cross(seg.tn, seg.ta);
                var dtb = Phaser.Vec2Utils.cross(seg.tn, seg.tb);
                var n = new Phaser.Vec2();
                Phaser.Vec2Utils.scale(seg.tn, coef, n);
                //var n = vec2.scale(seg.tn, coef);
                for(var i = 0; i < poly.verts.length; i++) {
                    var v = poly.tverts[i];
                    if(Phaser.Vec2Utils.dot(v, n) < Phaser.Vec2Utils.dot(seg.tn, seg.ta) * coef + seg.radius) {
                        var dt = Phaser.Vec2Utils.cross(seg.tn, v);
                        if(dta >= dt && dt >= dtb) {
                            contactArr.push(new Physics.Contact(v, n, dist, (poly.id << 16) | i));
                        }
                    }
                }
            };
            Collision.prototype.segment2Poly = function (seg, poly, contactArr) {
                var seg_td = Phaser.Vec2Utils.dot(seg.tn, seg.ta);
                var seg_d1 = poly.distanceOnPlane(seg.tn, seg_td) - seg.radius;
                if(seg_d1 > 0) {
                    return 0;
                }
                var n = new Phaser.Vec2();
                Phaser.Vec2Utils.negative(seg.tn, n);
                var seg_d2 = poly.distanceOnPlane(n, -seg_td) - seg.radius;
                //var seg_d2 = poly.distanceOnPlane(vec2.neg(seg.tn), -seg_td) - seg.r;
                if(seg_d2 > 0) {
                    return 0;
                }
                var poly_d = -999999;
                var poly_i = -1;
                for(var i = 0; i < poly.verts.length; i++) {
                    var plane = poly.tplanes[i];
                    var dist = seg.distanceOnPlane(plane.normal, plane.d);
                    if(dist > 0) {
                        return 0;
                    }
                    if(dist > poly_d) {
                        poly_d = dist;
                        poly_i = i;
                    }
                }
                var poly_n = new Phaser.Vec2();
                Phaser.Vec2Utils.negative(poly.tplanes[poly_i].normal, poly_n);
                //var poly_n = vec2.neg(poly.tplanes[poly_i].n);
                var va = new Phaser.Vec2();
                Phaser.Vec2Utils.multiplyAdd(seg.ta, poly_n, seg.radius, va);
                //var va = vec2.mad(seg.ta, poly_n, seg.r);
                var vb = new Phaser.Vec2();
                Phaser.Vec2Utils.multiplyAdd(seg.tb, poly_n, seg.radius, vb);
                //var vb = vec2.mad(seg.tb, poly_n, seg.r);
                if(poly.containPoint(va)) {
                    contactArr.push(new Physics.Contact(va, poly_n, poly_d, (seg.id << 16) | 0));
                }
                if(poly.containPoint(vb)) {
                    contactArr.push(new Physics.Contact(vb, poly_n, poly_d, (seg.id << 16) | 1));
                }
                // Floating point precision problems here.
                // This will have to do for now.
                poly_d -= 0.1;
                if(seg_d1 >= poly_d || seg_d2 >= poly_d) {
                    if(seg_d1 > seg_d2) {
                        this.findPointsBehindSeg(contactArr, seg, poly, seg_d1, 1);
                    } else {
                        this.findPointsBehindSeg(contactArr, seg, poly, seg_d2, -1);
                    }
                }
                // If no other collision points are found, try colliding endpoints.
                if(contactArr.length == 0) {
                    var poly_a = poly.tverts[poly_i];
                    var poly_b = poly.tverts[(poly_i + 1) % poly.verts.length];
                    if(this._circle2Circle(seg.ta, seg.radius, poly_a, 0, contactArr)) {
                        return 1;
                    }
                    if(this._circle2Circle(seg.tb, seg.radius, poly_a, 0, contactArr)) {
                        return 1;
                    }
                    if(this._circle2Circle(seg.ta, seg.radius, poly_b, 0, contactArr)) {
                        return 1;
                    }
                    if(this._circle2Circle(seg.tb, seg.radius, poly_b, 0, contactArr)) {
                        return 1;
                    }
                }
                return contactArr.length;
            };
            Collision.prototype.findMSA = // Find the minimum separating axis for the given poly and plane list.
            function (poly, planes, num) {
                var min_dist = -999999;
                var min_index = -1;
                for(var i = 0; i < num; i++) {
                    var dist = poly.distanceOnPlane(planes[i].normal, planes[i].d);
                    if(dist > 0) {
                        // no collision
                        return {
                            dist: 0,
                            index: -1
                        };
                    } else if(dist > min_dist) {
                        min_dist = dist;
                        min_index = i;
                    }
                }
                //  new object - see what we can do here
                return {
                    dist: min_dist,
                    index: min_index
                };
            };
            Collision.prototype.findVertsFallback = function (contactArr, poly1, poly2, n, dist) {
                var num = 0;
                for(var i = 0; i < poly1.verts.length; i++) {
                    var v = poly1.tverts[i];
                    if(poly2.containPointPartial(v, n)) {
                        contactArr.push(new Physics.Contact(v, n, dist, (poly1.id << 16) | i));
                        num++;
                    }
                }
                for(var i = 0; i < poly2.verts.length; i++) {
                    var v = poly2.tverts[i];
                    if(poly1.containPointPartial(v, n)) {
                        contactArr.push(new Physics.Contact(v, n, dist, (poly2.id << 16) | i));
                        num++;
                    }
                }
                return num;
            };
            Collision.prototype.findVerts = // Find the overlapped vertices.
            function (contactArr, poly1, poly2, n, dist) {
                var num = 0;
                for(var i = 0; i < poly1.verts.length; i++) {
                    var v = poly1.tverts[i];
                    if(poly2.containPoint(v)) {
                        contactArr.push(new Physics.Contact(v, n, dist, (poly1.id << 16) | i));
                        num++;
                    }
                }
                for(var i = 0; i < poly2.verts.length; i++) {
                    var v = poly2.tverts[i];
                    if(poly1.containPoint(v)) {
                        contactArr.push(new Physics.Contact(v, n, dist, (poly2.id << 16) | i));
                        num++;
                    }
                }
                return num > 0 ? num : this.findVertsFallback(contactArr, poly1, poly2, n, dist);
            };
            Collision.prototype.poly2Poly = function (poly1, poly2, contactArr) {
                var msa1 = this.findMSA(poly2, poly1.tplanes, poly1.verts.length);
                if(msa1.index == -1) {
                    console.log('poly2poly 0', msa1);
                    return 0;
                }
                var msa2 = this.findMSA(poly1, poly2.tplanes, poly2.verts.length);
                if(msa2.index == -1) {
                    console.log('poly2poly 1', msa2);
                    return 0;
                }
                // Penetration normal direction should be from poly1 to poly2
                if(msa1.dist > msa2.dist) {
                    return this.findVerts(contactArr, poly1, poly2, poly1.tplanes[msa1.index].normal, msa1.dist);
                }
                return this.findVerts(contactArr, poly1, poly2, Phaser.Vec2Utils.negative(poly2.tplanes[msa2.index].normal), msa2.dist);
            };
            return Collision;
        })();
        Physics.Collision = Collision;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
