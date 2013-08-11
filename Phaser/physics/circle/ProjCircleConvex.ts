/// <reference path="../../_definitions.ts" />

/**
* Phaser - Physics - Projection
*/

module Phaser.Physics.Projection {

    export class CircleConvex {

        public static Collide(x, y, oH, oV, obj: Phaser.Physics.Circle, t: Phaser.Physics.TileMapCell) {

            //if the object is horiz AND/OR vertical neighbor in the normal (signx,signy)
            //direction, collide vs. tile-circle only.
            //if we're colliding diagonally:
            //  -else, collide vs. the appropriate vertex
            //if obj is in this tile: perform collision as for aabb
            //if obj is horiz or vert neigh against direction of slope: collide vs. face

            var signx = t.signx;
            var signy = t.signy;
            var lenP;

            if (oH == 0)
            {
                if (oV == 0)
                {
                    //colliding with current tile


                    var ox = obj.pos.x - (t.pos.x - (signx * t.xw));//(ox,oy) is the vector from the tile-circle to 
                    var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//the circle's center

                    var twid = t.xw * 2;
                    var trad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
                    //note that this should be precomputed at compile-time since it's constant

                    var len = Math.sqrt(ox * ox + oy * oy);
                    var pen = (trad + obj.radius) - len;

                    if (0 < pen)
                    {
                        //find the smallest axial projection vector
                        if (x < y)
                        {
                            //penetration in x is smaller
                            lenP = x;
                            y = 0;

                            //get sign for projection along x-axis		
                            if ((obj.pos.x - t.pos.x) < 0)
                            {
                                x *= -1;
                            }
                        }
                        else
                        {
                            //penetration in y is smaller
                            lenP = y;
                            x = 0;

                            //get sign for projection along y-axis		
                            if ((obj.pos.y - t.pos.y) < 0)
                            {
                                y *= -1;
                            }
                        }


                        if (lenP < pen)
                        {
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                        else
                        {
                            //note: len should NEVER be == 0, because if it is, 
                            //projeciton by an axis shoudl always be shorter, and we should
                            //never arrive here
                            ox /= len;
                            oy /= len;

                            obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                            return Phaser.Physics.Circle.COL_OTHER;

                        }
                    }
                }
                else
                {
                    //colliding vertically
                    if ((signy * oV) < 0)
                    {
                        //colliding with face/edge
                        obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);

                        return Phaser.Physics.Circle.COL_AXIS;
                    }
                    else
                    {
                        //obj in neighboring cell pointed at by tile normal;
                        //we could only be colliding vs the tile-circle surface

                        var ox = obj.pos.x - (t.pos.x - (signx * t.xw));//(ox,oy) is the vector from the tile-circle to 
                        var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//the circle's center

                        var twid = t.xw * 2;
                        var trad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
                        //note that this should be precomputed at compile-time since it's constant

                        var len = Math.sqrt(ox * ox + oy * oy);
                        var pen = (trad + obj.radius) - len;

                        if (0 < pen)
                        {

                            //note: len should NEVER be == 0, because if it is, 
                            //obj is not in a neighboring cell!
                            ox /= len;
                            oy /= len;

                            obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                            return Phaser.Physics.Circle.COL_OTHER;
                        }
                    }
                }
            }
            else if (oV == 0)
            {
                //colliding horizontally
                if ((signx * oH) < 0)
                {
                    //colliding with face/edge
                    obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);

                    return Phaser.Physics.Circle.COL_AXIS;
                }
                else
                {
                    //obj in neighboring cell pointed at by tile normal;
                    //we could only be colliding vs the tile-circle surface

                    var ox = obj.pos.x - (t.pos.x - (signx * t.xw));//(ox,oy) is the vector from the tile-circle to 
                    var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//the circle's center

                    var twid = t.xw * 2;
                    var trad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
                    //note that this should be precomputed at compile-time since it's constant

                    var len = Math.sqrt(ox * ox + oy * oy);
                    var pen = (trad + obj.radius) - len;

                    if (0 < pen)
                    {

                        //note: len should NEVER be == 0, because if it is, 
                        //obj is not in a neighboring cell!
                        ox /= len;
                        oy /= len;

                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Phaser.Physics.Circle.COL_OTHER;
                    }
                }
            }
            else
            {
                //colliding diagonally
                if (0 < ((signx * oH) + (signy * oV)))
                {
                    //obj in diag neighb cell pointed at by tile normal;
                    //we could only be colliding vs the tile-circle surface

                    var ox = obj.pos.x - (t.pos.x - (signx * t.xw));//(ox,oy) is the vector from the tile-circle to 
                    var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//the circle's center

                    var twid = t.xw * 2;
                    var trad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
                    //note that this should be precomputed at compile-time since it's constant

                    var len = Math.sqrt(ox * ox + oy * oy);
                    var pen = (trad + obj.radius) - len;

                    if (0 < pen)
                    {

                        //note: len should NEVER be == 0, because if it is, 
                        //obj is not in a neighboring cell!
                        ox /= len;
                        oy /= len;

                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Phaser.Physics.Circle.COL_OTHER;
                    }
                }
                else
                {
                    //collide vs. vertex
                    //get diag vertex position
                    var vx = t.pos.x + (oH * t.xw);
                    var vy = t.pos.y + (oV * t.yw);

                    var dx = obj.pos.x - vx;//calc vert->circle vector		
                    var dy = obj.pos.y - vy;

                    var len = Math.sqrt(dx * dx + dy * dy);
                    var pen = obj.radius - len;
                    if (0 < pen)
                    {
                        //vertex is in the circle; project outward
                        if (len == 0)
                        {
                            //project out by 45deg
                            dx = oH / Math.SQRT2;
                            dy = oV / Math.SQRT2;
                        }
                        else
                        {
                            dx /= len;
                            dy /= len;
                        }

                        obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                        return Phaser.Physics.Circle.COL_OTHER;
                    }

                }

            }

            return Phaser.Physics.Circle.COL_NONE;

        }
    }

}