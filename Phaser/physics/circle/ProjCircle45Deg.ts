/// <reference path="../../_definitions.ts" />

/**
* Phaser - Physics - Projection
*/

module Phaser.Physics.Projection {

    export class Circle45Deg {

        public static Collide(x, y, oH, oV, obj: Phaser.Physics.Circle, t: Phaser.Physics.TileMapCell) {

            //if we're colliding diagonally:
            //	-if obj is in the diagonal pointed to by the slope normal: we can't collide, do nothing
            //  -else, collide vs. the appropriate vertex
            //if obj is in this tile: perform collision as for aabb-ve-45deg
            //if obj is horiz OR very neighb in direction of slope: collide only vs. slope
            //if obj is horiz or vert neigh against direction of slope: collide vs. face

            var signx = t.signx;
            var signy = t.signy;
            var lenP;

            if (oH == 0)
            {
                if (oV == 0)
                {
                    //colliding with current tile

                    var sx = t.sx;
                    var sy = t.sy;

                    var ox = (obj.pos.x - (sx * obj.radius)) - t.pos.x;//this gives is the coordinates of the innermost
                    var oy = (obj.pos.y - (sy * obj.radius)) - t.pos.y;//point on the circle, relative to the tile center	

                    //if the dotprod of (ox,oy) and (sx,sy) is negative, the innermost point is in the slope
                    //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                    var dp = (ox * sx) + (oy * sy);
                    if (dp < 0)
                    {
                        //collision; project delta onto slope and use this as the slope penetration vector
                        sx *= -dp;//(sx,sy) is now the penetration vector
                        sy *= -dp;

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

                        var lenN = Math.sqrt(sx * sx + sy * sy);

                        if (lenP < lenN)
                        {
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                        else
                        {
                            obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);

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
                        //we could only be colliding vs the slope OR a vertex
                        //look at the vector form the closest vert to the circle to decide

                        var sx = t.sx;
                        var sy = t.sy;

                        var ox = obj.pos.x - (t.pos.x - (signx * t.xw));//this gives is the coordinates of the innermost
                        var oy = obj.pos.y - (t.pos.y + (oV * t.yw));//point on the circle, relative to the closest tile vert	

                        //if the component of (ox,oy) parallel to the normal's righthand normal
                        //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                        //then we project by the vertex, otherwise by the normal.
                        //note that this is simply a VERY tricky/weird method of determining 
                        //if the circle is in side the slope/face's voronoi region, or that of the vertex.											  
                        var perp = (ox * -sy) + (oy * sx);
                        if (0 < (perp * signx * signy))
                        {
                            //collide vs. vertex
                            var len = Math.sqrt(ox * ox + oy * oy);
                            var pen = obj.radius - len;
                            if (0 < pen)
                            {
                                //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                                ox /= len;
                                oy /= len;

                                obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                        }
                        else
                        {
                            //collide vs. slope

                            //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                            //penetrating the slope. note that this method of penetration calculation doesn't hold
                            //in general (i.e it won't work if the circle is in the slope), but works in this case
                            //because we know the circle is in a neighboring cell
                            var dp = (ox * sx) + (oy * sy);
                            var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..
                            if (0 < pen)
                            {
                                //collision; circle out along normal by penetration amount
                                obj.reportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);

                                return Phaser.Physics.Circle.COL_OTHER;
                            }
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
                    //we could only be colliding vs the slope OR a vertex
                    //look at the vector form the closest vert to the circle to decide

                    var sx = t.sx;
                    var sy = t.sy;

                    var ox = obj.pos.x - (t.pos.x + (oH * t.xw));//this gives is the coordinates of the innermost
                    var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//point on the circle, relative to the closest tile vert	

                    //if the component of (ox,oy) parallel to the normal's righthand normal
                    //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                    //then we project by the normal, otherwise by the vertex.
                    //(NOTE: this is the opposite logic of the vertical case;
                    // for vertical, if the perp prod and the slope's slope agree, it's outside.
                    // for horizontal, if the perp prod and the slope's slope agree, circle is inside.
                    //  ..but this is only a property of flahs' coord system (i.e the rules might swap
                    // in righthanded systems))
                    //note that this is simply a VERY tricky/weird method of determining 
                    //if the circle is in side the slope/face's voronio region, or that of the vertex.											  
                    var perp = (ox * -sy) + (oy * sx);
                    if ((perp * signx * signy) < 0)
                    {
                        //collide vs. vertex
                        var len = Math.sqrt(ox * ox + oy * oy);
                        var pen = obj.radius - len;
                        if (0 < pen)
                        {
                            //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                            ox /= len;
                            oy /= len;

                            obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                            return Phaser.Physics.Circle.COL_OTHER;
                        }
                    }
                    else
                    {
                        //collide vs. slope

                        //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                        //penetrating the slope. note that this method of penetration calculation doesn't hold
                        //in general (i.e it won't work if the circle is in the slope), but works in this case
                        //because we know the circle is in a neighboring cell
                        var dp = (ox * sx) + (oy * sy);
                        var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..
                        if (0 < pen)
                        {
                            //collision; circle out along normal by penetration amount
                            obj.reportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);

                            return Phaser.Physics.Circle.COL_OTHER;
                        }
                    }
                }
            }
            else
            {
                //colliding diagonally
                if (0 < ((signx * oH) + (signy * oV)))
                {
                    //the dotprod of slope normal and cell offset is strictly positive,
                    //therefore obj is in the diagonal neighb pointed at by the normal, and
                    //it cannot possibly reach/touch/penetrate the slope
                    return Phaser.Physics.Circle.COL_NONE;
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
