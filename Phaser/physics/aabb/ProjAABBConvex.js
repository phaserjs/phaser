var Phaser;
(function (Phaser) {
    (function (Physics) {
        /// <reference path="../../_definitions.ts" />
        /**
        * Phaser - Physics - Projection
        */
        (function (Projection) {
            var AABBConvex = (function () {
                function AABBConvex() {
                }
                AABBConvex.Collide = function (x, y, obj, t) {
                    //if distance from "innermost" corner of AABB is less than than tile radius,
                    //collision is occuring and we need to project
                    var signx = t.signx;
                    var signy = t.signy;

                    var ox = (obj.pos.x - (signx * obj.xw)) - (t.pos.x - (signx * t.xw));
                    var oy = (obj.pos.y - (signy * obj.yw)) - (t.pos.y - (signy * t.yw));
                    var len = Math.sqrt(ox * ox + oy * oy);

                    var twid = t.xw * 2;
                    var rad = Math.sqrt(twid * twid + 0);

                    //note that this should be precomputed at compile-time since it's constant
                    var pen = rad - len;
                    if (((signx * ox) < 0) || ((signy * oy) < 0)) {
                        //the test corner is "outside" the 1/4 of the circle we're interested in
                        var lenP = Math.sqrt(x * x + y * y);
                        obj.ReportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                        return Phaser.Physics.AABB.COL_AXIS;
                    } else if (0 < pen) {
                        //project along corner->circle vector
                        ox /= len;
                        oy /= len;
                        obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Phaser.Physics.AABB.COL_OTHER;
                    }

                    return Phaser.Physics.AABB.COL_NONE;
                };
                return AABBConvex;
            })();
            Projection.AABBConvex = AABBConvex;
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
