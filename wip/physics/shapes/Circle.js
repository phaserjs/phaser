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
        * Phaser - Advanced Physics - Shape - Circle
        *
        * Based on the work Ju Hyung Lee started in JS PhyRus.
        */
        (function (Shapes) {
            var Circle = (function (_super) {
                __extends(Circle, _super);
                function Circle(radius, x, y) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                                _super.call(this, Physics.AdvancedPhysics.SHAPE_TYPE_CIRCLE);
                    x = Physics.AdvancedPhysics.pixelsToMeters(x);
                    y = Physics.AdvancedPhysics.pixelsToMeters(y);
                    radius = Physics.AdvancedPhysics.pixelsToMeters(radius);
                    this.center = new Phaser.Vec2(x, y);
                    this.radius = radius;
                    this.tc = new Phaser.Vec2();
                    this.finishVerts();
                }
                Circle.prototype.finishVerts = function () {
                    this.radius = Math.abs(this.radius);
                };
                Circle.prototype.duplicate = function () {
                    return new Circle(this.center.x, this.center.y, this.radius);
                };
                Circle.prototype.recenter = function (c) {
                    this.center.subtract(c);
                };
                Circle.prototype.transform = function (xf) {
                    Phaser.TransformUtils.transform(xf, this.center, this.center);
                    //this.center = xf.transform(this.center);
                                    };
                Circle.prototype.untransform = function (xf) {
                    Phaser.TransformUtils.untransform(xf, this.center, this.center);
                    //this.center = xf.untransform(this.center);
                                    };
                Circle.prototype.area = function () {
                    return Physics.AdvancedPhysics.areaForCircle(this.radius, 0);
                };
                Circle.prototype.centroid = function () {
                    return Phaser.Vec2Utils.clone(this.center);
                };
                Circle.prototype.inertia = function (mass) {
                    return Physics.AdvancedPhysics.inertiaForCircle(mass, this.center, this.radius, 0);
                };
                Circle.prototype.cacheData = function (xf) {
                    Phaser.TransformUtils.transform(xf, this.center, this.tc);
                    //this.tc = xf.transform(this.center);
                    this.bounds.mins.setTo(this.tc.x - this.radius, this.tc.y - this.radius);
                    this.bounds.maxs.setTo(this.tc.x + this.radius, this.tc.y + this.radius);
                };
                Circle.prototype.pointQuery = function (p) {
                    //return vec2.distsq(this.tc, p) < (this.r * this.r);
                    return Phaser.Vec2Utils.distanceSq(this.tc, p) < (this.radius * this.radius);
                };
                Circle.prototype.findVertexByPoint = function (p, minDist) {
                    var dsq = minDist * minDist;
                    if(Phaser.Vec2Utils.distanceSq(this.tc, p) < dsq) {
                        return 0;
                    }
                    return -1;
                };
                Circle.prototype.distanceOnPlane = function (n, d) {
                    Phaser.Vec2Utils.dot(n, this.tc) - this.radius - d;
                };
                return Circle;
            })(Phaser.Physics.Shape);
            Shapes.Circle = Circle;            
        })(Physics.Shapes || (Physics.Shapes = {}));
        var Shapes = Physics.Shapes;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
