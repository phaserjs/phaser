var Phaser;
(function (Phaser) {
    (function (Physics) {
        /// <reference path="../../_definitions.ts" />
        /**
        * Phaser - Physics - Projection
        */
        (function (Projection) {
            var Circle67Deg = (function () {
                function Circle67Deg() { }
                Circle67Deg.CollideS = function CollideS(x, y, oH, oV, obj, t) {
                    //if the object is in a cell pointed at by signx, no collision will ever occur
                    //otherwise,
                    //
                    //if we're colliding diagonally:
                    //  -collide vs. the appropriate vertex
                    //if obj is in this tile: collide vs slope or vertex or axis
                    //if obj is vert neighb in direction of slope: collide vs. slope or vertex
                    //if obj is vert neighb against the slope:
                    //   if(distance in y from circle to 90deg corner of tile < 1/2 tileheight, collide vs. face)
                    //   else(collide vs. corner of slope) (vert collision with a non-grid-aligned vert)
                    //if obj is horiz neighb against direction of slope: collide vs. face
                    var signx = t.signx;
                    var signy = t.signy;
                    var sx;
                    var sy;
                    if(0 < (signx * oH)) {
                        //object will never collide vs tile, it can't reach that far
                        return Phaser.Physics.Circle.COL_NONE;
                    } else if(oH == 0) {
                        if(oV == 0) {
                            //colliding with current tile
                            //we could only be colliding vs the slope OR a vertex
                            //look at the vector form the closest vert to the circle to decide
                            sx = t.sx;
                            sy = t.sy;
                            var r = obj.radius;
                            var ox = obj.pos.x - t.pos.x;//this gives is the coordinates of the innermost
                            
                            var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//point on the circle, relative to the tile corner
                            
                            //if the component of (ox,oy) parallel to the normal's righthand normal
                            //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                            //then we project by the normal or axis, otherwise by the corner/vertex
                            //note that this is simply a VERY tricky/weird method of determining
                            //if the circle is in side the slope/face's voronoi region, or that of the vertex.
                            var perp = (ox * -sy) + (oy * sx);
                            if((perp * signx * signy) < 0) {
                                //collide vs. vertex
                                var len = Math.sqrt(ox * ox + oy * oy);
                                var pen = r - len;
                                if(0 < pen) {
                                    //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                                    ox /= len;
                                    oy /= len;
                                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            } else {
                                //collide vs. slope or vs axis
                                ox -= r * sx//this gives us the vector from
                                ;
                                oy -= r * sy//a point on the slope to the innermost point on the circle
                                ;
                                //if the dotprod of (ox,oy) and (sx,sy) is negative, the point on the circle is in the slope
                                //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                                var dp = (ox * sx) + (oy * sy);
                                var lenP;
                                if(dp < 0) {
                                    //collision; project delta onto slope and use this to displace the object
                                    sx *= -dp//(sx,sy) is now the projection vector
                                    ;
                                    sy *= -dp;
                                    var lenN = Math.sqrt(sx * sx + sy * sy);
                                    //find the smallest axial projection vector
                                    if(x < y) {
                                        //penetration in x is smaller
                                        lenP = x;
                                        y = 0;
                                        //get sign for projection along x-axis
                                        if((obj.pos.x - t.pos.x) < 0) {
                                            x *= -1;
                                        }
                                    } else {
                                        //penetration in y is smaller
                                        lenP = y;
                                        x = 0;
                                        //get sign for projection along y-axis
                                        if((obj.pos.y - t.pos.y) < 0) {
                                            y *= -1;
                                        }
                                    }
                                    if(lenP < lenN) {
                                        obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                        return Phaser.Physics.Circle.COL_AXIS;
                                    } else {
                                        obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                }
                            }
                        } else {
                            //colliding vertically
                            if((signy * oV) < 0) {
                                //colliding with face/edge OR with corner of wedge, depending on our position vertically
                                //collide vs. vertex
                                //get diag vertex position
                                var vx = t.pos.x;
                                var vy = t.pos.y - (signy * t.yw);
                                var dx = obj.pos.x - vx;//calc vert->circle vector
                                
                                var dy = obj.pos.y - vy;
                                if((dx * signx) < 0) {
                                    //colliding vs face
                                    obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    //colliding vs. vertex
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
                            } else {
                                //we could only be colliding vs the slope OR a vertex
                                //look at the vector form the closest vert to the circle to decide
                                sx = t.sx;
                                sy = t.sy;
                                var ox = obj.pos.x - (t.pos.x - (signx * t.xw));//this gives is the coordinates of the innermost
                                
                                var oy = obj.pos.y - (t.pos.y + (oV * t.yw));//point on the circle, relative to the closest tile vert
                                
                                //if the component of (ox,oy) parallel to the normal's righthand normal
                                //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                                //then we project by the vertex, otherwise by the normal.
                                //note that this is simply a VERY tricky/weird method of determining
                                //if the circle is in side the slope/face's voronio region, or that of the vertex.
                                var perp = (ox * -sy) + (oy * sx);
                                if(0 < (perp * signx * signy)) {
                                    //collide vs. vertex
                                    var len = Math.sqrt(ox * ox + oy * oy);
                                    var pen = obj.radius - len;
                                    if(0 < pen) {
                                        //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                                        ox /= len;
                                        oy /= len;
                                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                } else {
                                    //collide vs. slope
                                    //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                                    //penetrating the slope. note that this method of penetration calculation doesn't hold
                                    //in general (i.e it won't work if the circle is in the slope), but works in this case
                                    //because we know the circle is in a neighboring cell
                                    var dp = (ox * sx) + (oy * sy);
                                    var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..
                                    
                                    if(0 < pen) {
                                        //collision; circle out along normal by penetration amount
                                        obj.reportCollisionVsWorld(sx * pen, sy * pen, t.sx, t.sy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                }
                            }
                        }
                    } else if(oV == 0) {
                        //colliding horizontally; we can assume that (signy*oV) < 0
                        //due to the first conditional far above
                        obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                        return Phaser.Physics.Circle.COL_AXIS;
                    } else {
                        //colliding diagonally; due to the first conditional above,
                        //obj is vertically offset against slope, and offset in either direction horizontally
                        //collide vs. vertex
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
                Circle67Deg.CollideB = function CollideB(x, y, oH, oV, obj, t) {
                    //if we're colliding diagonally:
                    //  -if we're in the cell pointed at by the normal, collide vs slope, else
                    //  collide vs. the appropriate corner/vertex
                    //
                    //if obj is in this tile: collide as with aabb
                    //
                    //if obj is horiz or vertical neighbor AGAINST the slope: collide with edge
                    //
                    //if obj is vert neighb in direction of slope: collide vs. slope or vertex or halfedge
                    //
                    //if obj is horiz neighb in direction of slope: collide vs. slope or vertex
                    var signx = t.signx;
                    var signy = t.signy;
                    var sx;
                    var sy;
                    if(oH == 0) {
                        if(oV == 0) {
                            //colliding with current cell
                            sx = t.sx;
                            sy = t.sy;
                            var r = obj.radius;
                            var ox = (obj.pos.x - (sx * r)) - (t.pos.x + (signx * t.xw));//this gives is the coordinates of the innermost
                            
                            var oy = (obj.pos.y - (sy * r)) - (t.pos.y - (signy * t.yw));//point on the AABB, relative to a point on the slope
                            
                            //if the dotprod of (ox,oy) and (sx,sy) is negative, the point on the circle is in the slope
                            //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                            var dp = (ox * sx) + (oy * sy);
                            var lenP;
                            if(dp < 0) {
                                //collision; project delta onto slope and use this to displace the object
                                sx *= -dp//(sx,sy) is now the projection vector
                                ;
                                sy *= -dp;
                                var lenN = Math.sqrt(sx * sx + sy * sy);
                                //find the smallest axial projection vector
                                if(x < y) {
                                    //penetration in x is smaller
                                    lenP = x;
                                    y = 0;
                                    //get sign for projection along x-axis
                                    if((obj.pos.x - t.pos.x) < 0) {
                                        x *= -1;
                                    }
                                } else {
                                    //penetration in y is smaller
                                    lenP = y;
                                    x = 0;
                                    //get sign for projection along y-axis
                                    if((obj.pos.y - t.pos.y) < 0) {
                                        y *= -1;
                                    }
                                }
                                if(lenP < lenN) {
                                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        } else {
                            //colliding vertically
                            if((signy * oV) < 0) {
                                //colliding with face/edge
                                obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            } else {
                                //colliding with edge, slope, or vertex
                                var ox = obj.pos.x - t.pos.x;//this gives is the coordinates of the innermost
                                
                                var oy = obj.pos.y - (t.pos.y + (signy * t.yw));//point on the circle, relative to the closest tile vert
                                
                                if((ox * signx) < 0) {
                                    //we're colliding with the halfface
                                    obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    //colliding with the vertex or slope
                                    sx = t.sx;
                                    sy = t.sy;
                                    //if the component of (ox,oy) parallel to the normal's righthand normal
                                    //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                                    //then we project by the vertex, otherwise by the slope.
                                    //note that this is simply a VERY tricky/weird method of determining
                                    //if the circle is in side the slope/face's voronio region, or that of the vertex.
                                    var perp = (ox * -sy) + (oy * sx);
                                    if(0 < (perp * signx * signy)) {
                                        //collide vs. vertex
                                        var len = Math.sqrt(ox * ox + oy * oy);
                                        var pen = obj.radius - len;
                                        if(0 < pen) {
                                            //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                                            ox /= len;
                                            oy /= len;
                                            obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                            return Phaser.Physics.Circle.COL_OTHER;
                                        }
                                    } else {
                                        //collide vs. slope
                                        //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                                        //penetrating the slope. note that this method of penetration calculation doesn't hold
                                        //in general (i.e it won't work if the circle is in the slope), but works in this case
                                        //because we know the circle is in a neighboring cell
                                        var dp = (ox * sx) + (oy * sy);
                                        var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..
                                        
                                        if(0 < pen) {
                                            //collision; circle out along normal by penetration amount
                                            obj.reportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);
                                            return Phaser.Physics.Circle.COL_OTHER;
                                        }
                                    }
                                }
                            }
                        }
                    } else if(oV == 0) {
                        //colliding horizontally
                        if((signx * oH) < 0) {
                            //colliding with face/edge
                            obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        } else {
                            //we could only be colliding vs the slope OR a vertex
                            //look at the vector form the closest vert to the circle to decide
                            var slen = Math.sqrt(2 * 2 + 1 * 1);//the raw slope is (-2,-1)
                            
                            var sx = (signx * 2) / slen;//get slope _unit_ normal;
                            
                            var sy = (signy * 1) / slen;//raw RH normal is (1,-2)
                            
                            var ox = obj.pos.x - (t.pos.x + (signx * t.xw));//this gives is the coordinates of the innermost
                            
                            var oy = obj.pos.y - (t.pos.y - (signy * t.yw));//point on the circle, relative to the closest tile vert
                            
                            //if the component of (ox,oy) parallel to the normal's righthand normal
                            //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                            //then we project by the slope, otherwise by the vertex.
                            //note that this is simply a VERY tricky/weird method of determining
                            //if the circle is in side the slope/face's voronio region, or that of the vertex.
                            var perp = (ox * -sy) + (oy * sx);
                            if((perp * signx * signy) < 0) {
                                //collide vs. vertex
                                var len = Math.sqrt(ox * ox + oy * oy);
                                var pen = obj.radius - len;
                                if(0 < pen) {
                                    //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                                    ox /= len;
                                    oy /= len;
                                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            } else {
                                //collide vs. slope
                                //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                                //penetrating the slope. note that this method of penetration calculation doesn't hold
                                //in general (i.e it won't work if the circle is in the slope), but works in this case
                                //because we know the circle is in a neighboring cell
                                var dp = (ox * sx) + (oy * sy);
                                var pen = obj.radius - Math.abs(dp);//note: we don't need the abs because we know the dp will be positive, but just in case..
                                
                                if(0 < pen) {
                                    //collision; circle out along normal by penetration amount
                                    obj.reportCollisionVsWorld(sx * pen, sy * pen, t.sx, t.sy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        }
                    } else {
                        //colliding diagonally
                        if(0 < ((signx * oH) + (signy * oV))) {
                            //the dotprod of slope normal and cell offset is strictly positive,
                            //therefore obj is in the diagonal neighb pointed at by the normal.
                            //collide vs slope
                            sx = t.sx;
                            sy = t.sy;
                            var r = obj.radius;
                            var ox = (obj.pos.x - (sx * r)) - (t.pos.x + (signx * t.xw));//this gives is the coordinates of the innermost
                            
                            var oy = (obj.pos.y - (sy * r)) - (t.pos.y - (signy * t.yw));//point on the circle, relative to a point on the slope
                            
                            //if the dotprod of (ox,oy) and (sx,sy) is negative, the point on the circle is in the slope
                            //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                            var dp = (ox * sx) + (oy * sy);
                            if(dp < 0) {
                                //collision; project delta onto slope and use this to displace the object
                                //(sx,sy)*-dp is the projection vector
                                obj.reportCollisionVsWorld(-sx * dp, -sy * dp, t.sx, t.sy, t);
                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                            return Phaser.Physics.Circle.COL_NONE;
                        } else {
                            //collide vs the appropriate vertex
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
                    }
                    return Phaser.Physics.Circle.COL_NONE;
                };
                return Circle67Deg;
            })();
            Projection.Circle67Deg = Circle67Deg;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
