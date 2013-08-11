var Phaser;
(function (Phaser) {
    (function (Physics) {
        /// <reference path="../../_definitions.ts" />
        /**
        * Phaser - Physics - Projection
        */
        (function (Projection) {
            var AABB45Deg = (function () {
                function AABB45Deg() {
                }
                AABB45Deg.Collide = function (x, y, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;

                    var ox = (obj.pos.x - (signx * obj.xw)) - t.pos.x;
                    var oy = (obj.pos.y - (signy * obj.yw)) - t.pos.y;

                    var sx = t.sx;
                    var sy = t.sy;

                    //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
                    //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                    var dp = (ox * sx) + (oy * sy);

                    if (dp < 0) {
                        //collision; project delta onto slope and use this to displace the object
                        sx *= -dp;
                        sy *= -dp;

                        var lenN = Math.sqrt(sx * sx + sy * sy);
                        var lenP = Math.sqrt(x * x + y * y);

                        if (lenP < lenN) {
                            //project along axis
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                            return Phaser.Physics.AABB.COL_AXIS;
                        } else {
                            //project along slope
                            obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy);

                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                    }

                    return Phaser.Physics.AABB.COL_NONE;
                };
                return AABB45Deg;
            })();
            Projection.AABB45Deg = AABB45Deg;
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
