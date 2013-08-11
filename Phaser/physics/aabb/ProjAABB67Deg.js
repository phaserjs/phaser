var Phaser;
(function (Phaser) {
    (function (Physics) {
        /// <reference path="../../_definitions.ts" />
        /**
        * Phaser - Physics - Projection
        */
        (function (Projection) {
            var AABB67Deg = (function () {
                function AABB67Deg() {
                }
                AABB67Deg.CollideS = function (x, y, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;

                    var px = obj.pos.x - (signx * obj.xw);
                    var penX = t.pos.x - px;

                    if (0 < (penX * signx)) {
                        var ox = (obj.pos.x - (signx * obj.xw)) - (t.pos.x - (signx * t.xw));
                        var oy = (obj.pos.y - (signy * obj.yw)) - (t.pos.y + (signy * t.yw));

                        var sx = t.sx;
                        var sy = t.sy;

                        //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
                        //and we need to project it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                        var dp = (ox * sx) + (oy * sy);
                        if (dp < 0) {
                            //collision; project delta onto slope and use this to displace the object
                            sx *= -dp;
                            sy *= -dp;

                            var lenN = Math.sqrt(sx * sx + sy * sy);
                            var lenP = Math.sqrt(x * x + y * y);

                            var aX = Math.abs(penX);
                            if (lenP < lenN) {
                                if (aX < lenP) {
                                    obj.reportCollisionVsWorld(penX, 0, penX / aX, 0, t);

                                    return Phaser.Physics.AABB.COL_OTHER;
                                } else {
                                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                                    return Phaser.Physics.AABB.COL_AXIS;
                                }
                            } else {
                                if (aX < lenN) {
                                    obj.reportCollisionVsWorld(penX, 0, penX / aX, 0, t);

                                    return Phaser.Physics.AABB.COL_OTHER;
                                } else {
                                    obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);

                                    return Phaser.Physics.AABB.COL_OTHER;
                                }
                            }
                        }
                    }

                    //if we've reached this point, no collision has occured
                    return Phaser.Physics.AABB.COL_NONE;
                };

                AABB67Deg.CollideB = function (x, y, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;

                    var ox = (obj.pos.x - (signx * obj.xw)) - (t.pos.x + (signx * t.xw));
                    var oy = (obj.pos.y - (signy * obj.yw)) - (t.pos.y - (signy * t.yw));

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
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                            return Phaser.Physics.AABB.COL_AXIS;
                        } else {
                            obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);

                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                    }

                    return Phaser.Physics.AABB.COL_NONE;
                };
                return AABB67Deg;
            })();
            Projection.AABB67Deg = AABB67Deg;
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
