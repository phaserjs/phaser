/// <reference path="../../_definitions.ts" />

/**
* Phaser - Physics - Projection
*/

module Phaser.Physics.Projection {

    export class CircleFull {

        public static Collide(x, y, oH, oV, obj: Phaser.Physics.Circle, t: Phaser.Physics.TileMapCell) {

            //if we're colliding vs. the current cell, we need to project along the
            //smallest penetration vector.
            //if we're colliding vs. horiz. or vert. neighb, we simply project horiz/vert
            //if we're colliding diagonally, we need to collide vs. tile corner

            if (oH == 0)
            {
                if (oV == 0)
                {
                    //collision with current cell
                    if (x < y)
                    {
                        //penetration in x is smaller; project in x
                        var dx = obj.pos.x - t.pos.x;//get sign for projection along x-axis

                        //NOTE: should we handle the delta == 0 case?! and how? (project towards oldpos?)
                        if (dx < 0)
                        {
                            obj.ReportCollisionVsWorld(-x, 0, -1, 0, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                        else
                        {
                            obj.ReportCollisionVsWorld(x, 0, 1, 0, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                    }
                    else
                    {
                        //penetration in y is smaller; project in y		
                        var dy = obj.pos.y - t.pos.y;//get sign for projection along y-axis

                        //NOTE: should we handle the delta == 0 case?! and how? (project towards oldpos?)					
                        if (dy < 0)
                        {
                            obj.ReportCollisionVsWorld(0, -y, 0, -1, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                        else
                        {
                            obj.ReportCollisionVsWorld(0, y, 0, 1, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                    }
                }
                else
                {
                    //collision with vertical neighbor
                    obj.ReportCollisionVsWorld(0, y * oV, 0, oV, t);

                    return Phaser.Physics.Circle.COL_AXIS;
                }
            }
            else if (oV == 0)
            {
                //collision with horizontal neighbor
                obj.ReportCollisionVsWorld(x * oH, 0, oH, 0, t);
                return Phaser.Physics.Circle.COL_AXIS;
            }
            else
            {
                //diagonal collision

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

                    obj.ReportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                    return Phaser.Physics.Circle.COL_OTHER;
                }
            }

            return Phaser.Physics.Circle.COL_NONE;

        }

    }

}