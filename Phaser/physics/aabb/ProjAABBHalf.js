var Phaser;
(function (Phaser) {
    (function (Physics) {
        /// <reference path="../../_definitions.ts" />
        /**
        * Phaser - Physics - Projection
        */
        (function (Projection) {
            var AABBHalf = (function () {
                function AABBHalf() {
                }
                AABBHalf.Collide = function (x, y, obj, t) {
                    //calculate the projection vector for the half-edge, and then
                    //(if collision is occuring) pick the minimum
                    var sx = t.signx;
                    var sy = t.signy;

                    var ox = (obj.pos.x - (sx * obj.xw)) - t.pos.x;
                    var oy = (obj.pos.y - (sy * obj.yw)) - t.pos.y;

                    //we perform operations analogous to the 45deg tile, except we're using
                    //an axis-aligned slope instead of an angled one..
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
                            //project along axis; note that we're assuming that this tile is horizontal OR vertical
                            //relative to the AABB's current tile, and not diagonal OR the current tile.
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                            return Phaser.Physics.AABB.COL_AXIS;
                        } else {
                            //note that we could use -= instead of -dp
                            obj.reportCollisionVsWorld(sx, sy, t.signx, t.signy, t);

                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                    }

                    return Phaser.Physics.AABB.COL_NONE;
                };
                return AABBHalf;
            })();
            Projection.AABBHalf = AABBHalf;
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
