/// <reference path="../../_definitions.ts" />

/**
* Phaser - Physics - Projection
*/

module Phaser.Physics.Projection {

    export class AABB22Deg {

        public static CollideS(x: number, y: number, obj: Phaser.Physics.AABB, t: Phaser.Physics.TileMapCell) {

            var signx = t.signx;
            var signy = t.signy;

            //first we need to check to make sure we're colliding with the slope at all
            var py = obj.pos.y - (signy * obj.yw);
            var penY = t.pos.y - py;//this is the vector from the innermost point on the box to the highest point on
            //the tile; if it is positive, this means the box is above the tile and
            //no collision is occuring

            if (0 < (penY * signy))
            {

                var ox = (obj.pos.x - (signx * obj.xw)) - (t.pos.x + (signx * t.xw));//this gives is the coordinates of the innermost
                var oy = (obj.pos.y - (signy * obj.yw)) - (t.pos.y - (signy * t.yw));//point on the AABB, relative to a point on the slope

                var sx = t.sx;//get slope unit normal
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

                    var aY = Math.abs(penY);
                    if (lenP < lenN)
                    {
                        if (aY < lenP)
                        {
                            obj.reportCollisionVsWorld(0, penY, 0, penY / aY, t);

                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                        else
                        {
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                            return Phaser.Physics.AABB.COL_AXIS;
                        }
                    }
                    else
                    {
                        if (aY < lenN)
                        {
                            obj.reportCollisionVsWorld(0, penY, 0, penY / aY, t);

                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                        else
                        {
                            obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);

                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                    }
                }
            }

            //if we've reached this point, no collision has occured
            return Phaser.Physics.AABB.COL_NONE;

        }

        public static CollideB(x: number, y: number, obj: Phaser.Physics.AABB, t: Phaser.Physics.TileMapCell) {

            var signx = t.signx;
            var signy = t.signy;

            var ox = (obj.pos.x - (signx * obj.xw)) - (t.pos.x - (signx * t.xw));//this gives is the coordinates of the innermost
            var oy = (obj.pos.y - (signy * obj.yw)) - (t.pos.y + (signy * t.yw));//point on the AABB, relative to a point on the slope

            var sx = t.sx;//get slope unit normal
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
                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                    return Phaser.Physics.AABB.COL_AXIS;
                }
                else
                {
                    obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);

                    return Phaser.Physics.AABB.COL_OTHER;
                }

            }

            return Phaser.Physics.AABB.COL_NONE;

        }

    }

}