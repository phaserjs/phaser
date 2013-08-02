var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    (function (Physics) {
        /// <reference path="../../math/Vec2.ts" />
        /// <reference path="../../math/Vec2Utils.ts" />
        /// <reference path="../AdvancedPhysics.ts" />
        /// <reference path="../Body.ts" />
        /// <reference path="Shape.ts" />
        /**
        * Phaser - Advanced Physics - Shapes - Segment
        *
        * Based on the work Ju Hyung Lee started in JS PhyRus.
        */
        (function (Shapes) {
            var Segment = (function (_super) {
                __extends(Segment, _super);
                function Segment(a, b, radius) {
                                _super.call(this, Physics.AdvancedPhysics.SHAPE_TYPE_SEGMENT);
                    this.a = a.duplicate();
                    this.b = b.duplicate();
                    this.radius = radius;
                    this.normal = Phaser.Vec2Utils.perp(Phaser.Vec2Utils.subtract(b, a));
                    this.normal.normalize();
                    this.ta = new Phaser.Vec2();
                    this.tb = new Phaser.Vec2();
                    this.tn = new Phaser.Vec2();
                    this.finishVerts();
                }
                Segment.prototype.finishVerts = function () {
                    this.normal = Phaser.Vec2Utils.perp(Phaser.Vec2Utils.subtract(this.b, this.a));
                    this.normal.normalize();
                    this.radius = Math.abs(this.radius);
                };
                Segment.prototype.duplicate = function () {
                    return new Phaser.Physics.Shapes.Segment(this.a, this.b, this.radius);
                };
                Segment.prototype.recenter = function (c) {
                    this.a.subtract(c);
                    this.b.subtract(c);
                };
                Segment.prototype.transform = function (xf) {
                    Phaser.TransformUtils.transform(xf, this.a, this.a);
                    Phaser.TransformUtils.transform(xf, this.b, this.b);
                    //this.a = xf.transform(this.a);
                    //this.b = xf.transform(this.b);
                                    };
                Segment.prototype.untransform = function (xf) {
                    Phaser.TransformUtils.untransform(xf, this.a, this.a);
                    Phaser.TransformUtils.untransform(xf, this.b, this.b);
                    //this.a = xf.untransform(this.a);
                    //this.b = xf.untransform(this.b);
                                    };
                Segment.prototype.area = function () {
                    return Physics.AdvancedPhysics.areaForSegment(this.a, this.b, this.radius);
                };
                Segment.prototype.centroid = function () {
                    return Physics.AdvancedPhysics.centroidForSegment(this.a, this.b);
                };
                Segment.prototype.inertia = function (mass) {
                    return Physics.AdvancedPhysics.inertiaForSegment(mass, this.a, this.b);
                };
                Segment.prototype.cacheData = function (xf) {
                    Phaser.TransformUtils.transform(xf, this.a, this.ta);
                    Phaser.TransformUtils.transform(xf, this.b, this.tb);
                    //this.ta = xf.transform(this.a);
                    //this.tb = xf.transform(this.b);
                    this.tn = Phaser.Vec2Utils.perp(Phaser.Vec2Utils.subtract(this.tb, this.ta)).normalize();
                    var l;
                    var r;
                    var t;
                    var b;
                    if(this.ta.x < this.tb.x) {
                        l = this.ta.x;
                        r = this.tb.x;
                    } else {
                        l = this.tb.x;
                        r = this.ta.x;
                    }
                    if(this.ta.y < this.tb.y) {
                        b = this.ta.y;
                        t = this.tb.y;
                    } else {
                        b = this.tb.y;
                        t = this.ta.y;
                    }
                    this.bounds.mins.setTo(l - this.radius, b - this.radius);
                    this.bounds.maxs.setTo(r + this.radius, t + this.radius);
                };
                Segment.prototype.pointQuery = function (p) {
                    if(!this.bounds.containPoint(p)) {
                        return false;
                    }
                    var dn = Phaser.Vec2Utils.dot(this.tn, p) - Phaser.Vec2Utils.dot(this.ta, this.tn);
                    var dist = Math.abs(dn);
                    if(dist > this.radius) {
                        return false;
                    }
                    var dt = Phaser.Vec2Utils.cross(p, this.tn);
                    var dta = Phaser.Vec2Utils.cross(this.ta, this.tn);
                    var dtb = Phaser.Vec2Utils.cross(this.tb, this.tn);
                    if(dt <= dta) {
                        if(dt < dta - this.radius) {
                            return false;
                        }
                        return Phaser.Vec2Utils.distanceSq(this.ta, p) < (this.radius * this.radius);
                    } else if(dt > dtb) {
                        if(dt > dtb + this.radius) {
                            return false;
                        }
                        return Phaser.Vec2Utils.distanceSq(this.tb, p) < (this.radius * this.radius);
                    }
                    return true;
                };
                Segment.prototype.findVertexByPoint = function (p, minDist) {
                    var dsq = minDist * minDist;
                    if(Phaser.Vec2Utils.distanceSq(this.ta, p) < dsq) {
                        return 0;
                    }
                    if(Phaser.Vec2Utils.distanceSq(this.tb, p) < dsq) {
                        return 1;
                    }
                    return -1;
                };
                Segment.prototype.distanceOnPlane = function (n, d) {
                    var a = Phaser.Vec2Utils.dot(n, this.ta) - this.radius;
                    var b = Phaser.Vec2Utils.dot(n, this.tb) - this.radius;
                    return Math.min(a, b) - d;
                };
                return Segment;
            })(Phaser.Physics.Shape);
            Shapes.Segment = Segment;            
        })(Physics.Shapes || (Physics.Shapes = {}));
        var Shapes = Physics.Shapes;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
