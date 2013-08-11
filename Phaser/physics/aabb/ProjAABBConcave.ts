/// <reference path="../../_definitions.ts" />

/**
* Phaser - Physics - Projection
*/

module Phaser.Physics.Projection {

    export class AABBConcave {

        public static Collide(x: number, y: number, obj: Phaser.Physics.AABB, t: Phaser.Physics.TileMapCell) {

            //if distance from "innermost" corner of AABB is further than tile radius,
            //collision is occuring and we need to project

            var signx = t.signx;
            var signy = t.signy;

            var ox = (t.pos.x + (signx * t.xw)) - (obj.pos.x - (signx * obj.xw));//(ox,oy) is the vector form the innermost AABB corner to the
            var oy = (t.pos.y + (signy * t.yw)) - (obj.pos.y - (signy * obj.yw));//circle's center

            var twid = t.xw * 2;
            var rad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
            //note that this should be precomputed at compile-time since it's constant

            var len = Math.sqrt(ox * ox + oy * oy);
            var pen = len - rad;

            if (0 < pen)
            {
                //collision; we need to either project along the axes, or project along corner->circlecenter vector

                var lenP = Math.sqrt(x * x + y * y);
                if (lenP < pen)
                {
                    //it's shorter to move along axis directions
                    obj.ReportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                    return Phaser.Physics.AABB.COL_AXIS;
                }
                else
                {
                    //project along corner->circle vector
                    ox /= len;//len should never be 0, since if it IS 0, rad should be > than len
                    oy /= len;//and we should never reach here

                    obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                    return Phaser.Physics.AABB.COL_OTHER;
                }

            }

            return Phaser.Physics.AABB.COL_NONE;

        }

    }

}