var Phaser;
(function (Phaser) {
    (function (Physics) {
        /// <reference path="../../_definitions.ts" />
        /**
        * Phaser - Physics - Projection
        */
        (function (Projection) {
            var AABBConcave = (function () {
                function AABBConcave() {
                }
                AABBConcave.Collide = function (x, y, obj, t) {
                    //if distance from "innermost" corner of AABB is further than tile radius,
                    //collision is occuring and we need to project
                    var signx = t.signx;
                    var signy = t.signy;

                    var ox = (t.pos.x + (signx * t.xw)) - (obj.pos.x - (signx * obj.xw));
                    var oy = (t.pos.y + (signy * t.yw)) - (obj.pos.y - (signy * obj.yw));

                    var twid = t.xw * 2;
                    var rad = Math.sqrt(twid * twid + 0);

                    //note that this should be precomputed at compile-time since it's constant
                    var len = Math.sqrt(ox * ox + oy * oy);
                    var pen = len - rad;

                    if (0 < pen) {
                        //collision; we need to either project along the axes, or project along corner->circlecenter vector
                        var lenP = Math.sqrt(x * x + y * y);
                        if (lenP < pen) {
                            //it's shorter to move along axis directions
                            obj.ReportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                            return Phaser.Physics.AABB.COL_AXIS;
                        } else {
                            //project along corner->circle vector
                            ox /= len;
                            oy /= len;

                            obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                    }

                    return Phaser.Physics.AABB.COL_NONE;
                };
                return AABBConcave;
            })();
            Projection.AABBConcave = AABBConcave;
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
