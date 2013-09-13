var Phaser;
(function (Phaser) {
    (function (Physics) {
        /// <reference path="../../_definitions.ts" />
        /**
        * Phaser - Physics - Projection
        */
        (function (Projection) {
            var CircleHalf = (function () {
                function CircleHalf() { }
                CircleHalf.Collide = function Collide(x, y, oH, oV, obj, t) {
                    //if obj is in a neighbor pointed at by the halfedge normal,
                    //we'll never collide (i.e if the normal is (0,1) and the obj is in the DL.D, or R neighbors)
                    //
                    //if obj is in a neigbor perpendicular to the halfedge normal, it might
                    //collide with the halfedge-vertex, or with the halfedge side.
                    //
                    //if obj is in a neigb pointing opposite the halfedge normal, obj collides with edge
                    //
                    //if obj is in a diagonal (pointing away from the normal), obj collides vs vertex
                    //
                    //if obj is in the halfedge cell, it collides as with aabb
                    var signx = t.signx;
                    var signy = t.signy;
                    var celldp = (oH * signx + oV * signy);//this tells us about the configuration of cell-offset relative to tile normal
                    
                    if(0 < celldp) {
                        //obj is in "far" (pointed-at-by-normal) neighbor of halffull tile, and will never hit
                        return Phaser.Physics.Circle.COL_NONE;
                    } else if(oH == 0) {
                        if(oV == 0) {
                            //colliding with current tile
                            var r = obj.radius;
                            var ox = (obj.pos.x - (signx * r)) - t.pos.x;//this gives is the coordinates of the innermost
                            
                            var oy = (obj.pos.y - (signy * r)) - t.pos.y;//point on the circle, relative to the tile center
                            
                            //we perform operations analogous to the 45deg tile, except we're using
                            //an axis-aligned slope instead of an angled one..
                            var sx = signx;
                            var sy = signy;
                            //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
                            //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                            var dp = (ox * sx) + (oy * sy);
                            if(dp < 0) {
                                //collision; project delta onto slope and use this to displace the object
                                sx *= -dp//(sx,sy) is now the projection vector
                                ;
                                sy *= -dp;
                                var lenN = Math.sqrt(sx * sx + sy * sy);
                                var lenP = Math.sqrt(x * x + y * y);
                                if(lenP < lenN) {
                                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    obj.reportCollisionVsWorld(sx, sy, t.signx, t.signy);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        } else {
                            //colliding vertically
                            if(celldp == 0) {
                                var r = obj.radius;
                                var dx = obj.pos.x - t.pos.x;
                                //we're in a cell perpendicular to the normal, and can collide vs. halfedge vertex
                                //or halfedge side
                                if((dx * signx) < 0) {
                                    //collision with halfedge side
                                    obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    //collision with halfedge vertex
                                    var dy = obj.pos.y - (t.pos.y + oV * t.yw);//(dx,dy) is now the vector from the appropriate halfedge vertex to the circle
                                    
                                    var len = Math.sqrt(dx * dx + dy * dy);
                                    var pen = obj.radius - len;
                                    if(0 < pen) {
                                        //vertex is in the circle; project outward
                                        if(len == 0) {
                                            //project out by 45deg
                                            dx = signx / Math.SQRT2;
                                            dy = oV / Math.SQRT2;
                                        } else {
                                            dx /= len;
                                            dy /= len;
                                        }
                                        obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                }
                            } else {
                                //due to the first conditional (celldp >0), we know we're in the cell "opposite" the normal, and so
                                //we can only collide with the cell edge
                                //collision with vertical neighbor
                                obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            }
                        }
                    } else if(oV == 0) {
                        //colliding horizontally
                        if(celldp == 0) {
                            var r = obj.radius;
                            var dy = obj.pos.y - t.pos.y;
                            //we're in a cell perpendicular to the normal, and can collide vs. halfedge vertex
                            //or halfedge side
                            if((dy * signy) < 0) {
                                //collision with halfedge side
                                obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            } else {
                                //collision with halfedge vertex
                                var dx = obj.pos.x - (t.pos.x + oH * t.xw);//(dx,dy) is now the vector from the appropriate halfedge vertex to the circle
                                
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var pen = obj.radius - len;
                                if(0 < pen) {
                                    //vertex is in the circle; project outward
                                    if(len == 0) {
                                        //project out by 45deg
                                        dx = signx / Math.SQRT2;
                                        dy = oV / Math.SQRT2;
                                    } else {
                                        dx /= len;
                                        dy /= len;
                                    }
                                    obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        } else {
                            //due to the first conditional (celldp >0), we know w're in the cell "opposite" the normal, and so
                            //we can only collide with the cell edge
                            obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                    } else {
                        //colliding diagonally; we know, due to the initial (celldp >0) test which has failed
                        //if we've reached this point, that we're in a diagonal neighbor on the non-normal side, so
                        //we could only be colliding with the cell vertex, if at all.
                        //get diag vertex position
                        var vx = t.pos.x + (oH * t.xw);
                        var vy = t.pos.y + (oV * t.yw);
                        var dx = obj.pos.x - vx;//calc vert->circle vector
                        
                        var dy = obj.pos.y - vy;
                        var len = Math.sqrt(dx * dx + dy * dy);
                        var pen = obj.radius - len;
                        if(0 < pen) {
                            //vertex is in the circle; project outward
                            if(len == 0) {
                                //project out by 45deg
                                dx = oH / Math.SQRT2;
                                dy = oV / Math.SQRT2;
                            } else {
                                dx /= len;
                                dy /= len;
                            }
                            obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                            return Phaser.Physics.Circle.COL_OTHER;
                        }
                    }
                    return Phaser.Physics.Circle.COL_NONE;
                };
                return CircleHalf;
            })();
            Projection.CircleHalf = CircleHalf;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
