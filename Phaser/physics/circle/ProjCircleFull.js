var Phaser;
(function (Phaser) {
    (function (Physics) {
        /// <reference path="../../_definitions.ts" />
        /**
        * Phaser - Physics - Projection
        */
        (function (Projection) {
            var CircleFull = (function () {
                function CircleFull() {
                }
                CircleFull.Collide = function (x, y, oH, oV, obj, t) {
                    if (oH == 0) {
                        if (oV == 0) {
                            if (x < y) {
                                //penetration in x is smaller; project in x
                                var dx = obj.pos.x - t.pos.x;

                                if (dx < 0) {
                                    obj.ReportCollisionVsWorld(-x, 0, -1, 0, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    obj.ReportCollisionVsWorld(x, 0, 1, 0, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                }
                            } else {
                                //penetration in y is smaller; project in y
                                var dy = obj.pos.y - t.pos.y;

                                if (dy < 0) {
                                    obj.ReportCollisionVsWorld(0, -y, 0, -1, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    obj.ReportCollisionVsWorld(0, y, 0, 1, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                }
                            }
                        } else {
                            //collision with vertical neighbor
                            obj.ReportCollisionVsWorld(0, y * oV, 0, oV, t);

                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                    } else if (oV == 0) {
                        //collision with horizontal neighbor
                        obj.ReportCollisionVsWorld(x * oH, 0, oH, 0, t);
                        return Phaser.Physics.Circle.COL_AXIS;
                    } else {
                        //diagonal collision
                        //get diag vertex position
                        var vx = t.pos.x + (oH * t.xw);
                        var vy = t.pos.y + (oV * t.yw);

                        var dx = obj.pos.x - vx;
                        var dy = obj.pos.y - vy;

                        var len = Math.sqrt(dx * dx + dy * dy);
                        var pen = obj.radius - len;
                        if (0 < pen) {
                            if (len == 0) {
                                //project out by 45deg
                                dx = oH / Math.SQRT2;
                                dy = oV / Math.SQRT2;
                            } else {
                                dx /= len;
                                dy /= len;
                            }

                            obj.ReportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                            return Phaser.Physics.Circle.COL_OTHER;
                        }
                    }

                    return Phaser.Physics.Circle.COL_NONE;
                };
                return CircleFull;
            })();
            Projection.CircleFull = CircleFull;
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
