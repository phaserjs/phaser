/// <reference path="../../_definitions.ts" />

/**
* Phaser - Physics - Projection
*/

module Phaser.Physics.Projection {

    export class AABB45Deg {

        public static Collide(x: number, y: number, obj: Phaser.Physics.AABB, t: Phaser.Physics.TileMapCell) {

            var signx = t.signx;
            var signy = t.signy;

            var ox = (obj.pos.x - (signx * obj.width)) - t.pos.x;//this gives is the coordinates of the innermost
            var oy = (obj.pos.y - (signy * obj.height)) - t.pos.y;//point on the AABB, relative to the tile center

            var sx = t.sx;
            var sy = t.sy;

            //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
            //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
            var dp = (ox * sx) + (oy * sy);

            if (dp < 0)
            {
                //collision; project delta onto slope and use this to displace the object
                sx *= -dp;//(sx,sy) is now the projection vector
                sy *= -dp;

                var lenN = Math.sqrt(sx * sx + sy * sy);
                var lenP = Math.sqrt(x * x + y * y);

                if (lenP < lenN)
                {
                    //project along axis
                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                    return Phaser.Physics.AABB.COL_AXIS;
                }
                else
                {
                    //project along slope
                    obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy);

                    return Phaser.Physics.AABB.COL_OTHER;
                }
            }

            return Phaser.Physics.AABB.COL_NONE;
        }
    }
}