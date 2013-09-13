/// <reference path="../../Phaser/Game.ts" />
var NPhysics = (function () {
    function NPhysics() {
        this.grav = 0.2;
        this.drag = 1;
        this.bounce = 0.3;
        this.friction = 0.05;
        this.min_f = 0;
        this.max_f = 1;
        this.min_b = 0;
        this.max_b = 1;
        this.min_g = 0;
        this.max_g = 1;
        this.xmin = 0;
        this.xmax = 800;
        this.ymin = 0;
        this.ymax = 600;
        this.objrad = 24;
        this.tilerad = 24 * 2;
        this.objspeed = 0.2;
        this.maxspeed = 20;
    }
    NPhysics.prototype.update = function () {
        //  demoObj.Verlet();
        //  demoObj.CollideVsWorldBounds();
    };
    return NPhysics;
})();

var AABB = (function () {
    function AABB(x, y, xw, yw) {
        this.type = 0;
        this.pos = new Phaser.Vec2(x, y);
        this.oldpos = Phaser.Vec2Utils.clone(this.pos);
        this.xw = Math.abs(xw);
        this.yw = Math.abs(yw);
        this.aabbTileProjections = {};
        this.aabbTileProjections[TileMapCell.CTYPE_FULL] = this.ProjAABB_Full;
        this.aabbTileProjections[TileMapCell.CTYPE_CONCAVE] = this.ProjAABB_Concave;
        this.aabbTileProjections[TileMapCell.CTYPE_CONVEX] = this.ProjAABB_Convex;
    }
    AABB.prototype.IntegrateVerlet = function () {
        //var d = DRAG;
        //var g = GRAV;
        var d = 1;
        var g = 0.2;

        var p = this.pos;
        var o = this.oldpos;
        var px, py;

        var ox = o.x;
        var oy = o.y;
        o.x = px = p.x;
        o.y = py = p.y;

        //o = oldposition
        //integrate
        p.x += (d * px) - (d * ox);
        p.y += (d * py) - (d * oy) + g;
    };

    AABB.prototype.ReportCollisionVsWorld = function (px, py, dx, dy, obj) {
        var p = this.pos;
        var o = this.oldpos;

        //calc velocity
        var vx = p.x - o.x;
        var vy = p.y - o.y;

        //find component of velocity parallel to collision normal
        var dp = (vx * dx + vy * dy);
        var nx = dp * dx;

        var ny = dp * dy;

        var tx = vx - nx;
        var ty = vy - ny;

        //we only want to apply collision response forces if the object is travelling into, and not out of, the collision
        var b, bx, by, f, fx, fy;

        if (dp < 0) {
            //f = FRICTION;
            f = 0.05;
            fx = tx * f;
            fy = ty * f;

            //b = 1 + BOUNCE;//this bounce constant should be elsewhere, i.e inside the object/tile/etc..
            b = 1 + 0.3;

            bx = (nx * b);
            by = (ny * b);
        } else {
            //moving out of collision, do not apply forces
            bx = by = fx = fy = 0;
        }

        p.x += px;
        p.y += py;

        o.x += px + bx + fx;
        o.y += py + by + fy;
    };

    AABB.prototype.CollideAABBVsTile = function (tile) {
        var pos = this.pos;
        var c = tile;

        var tx = c.pos.x;
        var ty = c.pos.y;
        var txw = c.xw;
        var tyw = c.yw;

        var dx = pos.x - tx;
        var px = (txw + this.xw) - Math.abs(dx);

        if (0 < px) {
            var dy = pos.y - ty;
            var py = (tyw + this.yw) - Math.abs(dy);

            if (0 < py) {
                if (px < py) {
                    if (dx < 0) {
                        //project to the left
                        px *= -1;
                        py = 0;
                    } else {
                        //proj to right
                        py = 0;
                    }
                } else {
                    if (dy < 0) {
                        //project up
                        px = 0;
                        py *= -1;
                    } else {
                        //project down
                        px = 0;
                    }
                }

                this.ResolveBoxTile(px, py, this, c);
            }
        }
    };

    AABB.prototype.CollideAABBVsWorldBounds = function () {
        var p = this.pos;
        var xw = this.xw;
        var yw = this.yw;
        var XMIN = 0;
        var XMAX = 800;
        var YMIN = 0;
        var YMAX = 600;

        //collide vs. x-bounds
        //test XMIN
        var dx = XMIN - (p.x - xw);
        if (0 < dx) {
            //object is colliding with XMIN
            this.ReportCollisionVsWorld(dx, 0, 1, 0, null);
        } else {
            //test XMAX
            dx = (p.x + xw) - XMAX;
            if (0 < dx) {
                //object is colliding with XMAX
                this.ReportCollisionVsWorld(-dx, 0, -1, 0, null);
            }
        }

        //collide vs. y-bounds
        //test YMIN
        var dy = YMIN - (p.y - yw);
        if (0 < dy) {
            //object is colliding with YMIN
            this.ReportCollisionVsWorld(0, dy, 0, 1, null);
        } else {
            //test YMAX
            dy = (p.y + yw) - YMAX;
            if (0 < dy) {
                //object is colliding with YMAX
                this.ReportCollisionVsWorld(0, -dy, 0, -1, null);
            }
        }
    };

    AABB.prototype.render = function (context) {
        context.beginPath();
        context.strokeStyle = 'rgb(0,255,0)';
        context.strokeRect(this.pos.x - this.xw, this.pos.y - this.yw, this.xw * 2, this.yw * 2);
        context.stroke();
        context.closePath();

        context.fillStyle = 'rgb(0,255,0)';
        context.fillRect(this.pos.x, this.pos.y, 2, 2);
        /*
        if (this.oH == 1)
        {
        context.beginPath();
        context.strokeStyle = 'rgb(255,0,0)';
        context.moveTo(this.pos.x - this.radius, this.pos.y - this.radius);
        context.lineTo(this.pos.x - this.radius, this.pos.y + this.radius);
        context.stroke();
        context.closePath();
        }
        else if (this.oH == -1)
        {
        context.beginPath();
        context.strokeStyle = 'rgb(255,0,0)';
        context.moveTo(this.pos.x + this.radius, this.pos.y - this.radius);
        context.lineTo(this.pos.x + this.radius, this.pos.y + this.radius);
        context.stroke();
        context.closePath();
        }
        
        if (this.oV == 1)
        {
        context.beginPath();
        context.strokeStyle = 'rgb(255,0,0)';
        context.moveTo(this.pos.x - this.radius, this.pos.y - this.radius);
        context.lineTo(this.pos.x + this.radius, this.pos.y - this.radius);
        context.stroke();
        context.closePath();
        }
        else if (this.oV == -1)
        {
        context.beginPath();
        context.strokeStyle = 'rgb(255,0,0)';
        context.moveTo(this.pos.x - this.radius, this.pos.y + this.radius);
        context.lineTo(this.pos.x + this.radius, this.pos.y + this.radius);
        context.stroke();
        context.closePath();
        }
        */
    };

    AABB.prototype.ResolveBoxTile = function (x, y, box, t) {
        if (0 < t.ID) {
            return this.aabbTileProjections[t.CTYPE](x, y, box, t);
        } else {
            //trace("ResolveBoxTile() was called with an empty (or unknown) tile!: ID=" + t.ID + " ("+ t.i + "," + t.j + ")");
            return false;
        }
    };

    AABB.prototype.ProjAABB_Full = function (x, y, obj, t) {
        var l = Math.sqrt(x * x + y * y);
        obj.ReportCollisionVsWorld(x, y, x / l, y / l, t);

        return AABB.COL_AXIS;
    };

    AABB.prototype.ProjAABB_Convex = function (x, y, obj, t) {
        //if distance from "innermost" corner of AABB is less than than tile radius,
        //collision is occuring and we need to project
        var signx = t.signx;
        var signy = t.signy;

        var ox = (obj.pos.x - (signx * obj.xw)) - (t.pos.x - (signx * t.xw));
        var oy = (obj.pos.y - (signy * obj.yw)) - (t.pos.y - (signy * t.yw));
        var len = Math.sqrt(ox * ox + oy * oy);

        var twid = t.xw * 2;
        var rad = Math.sqrt(twid * twid + 0);

        //note that this should be precomputed at compile-time since it's constant
        var pen = rad - len;
        if (((signx * ox) < 0) || ((signy * oy) < 0)) {
            //the test corner is "outside" the 1/4 of the circle we're interested in
            var lenP = Math.sqrt(x * x + y * y);
            obj.ReportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

            return AABB.COL_AXIS;
        } else if (0 < pen) {
            //project along corner->circle vector
            ox /= len;
            oy /= len;
            obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

            return AABB.COL_OTHER;
        }

        return AABB.COL_NONE;
    };

    AABB.prototype.ProjAABB_Concave = function (x, y, obj, t) {
        //if distance from "innermost" corner of AABB is further than tile radius,
        //collision is occuring and we need to project
        var signx = t.signx;
        var signy = t.signy;

        var ox = (t.pos.x + (signx * t.xw)) - (obj.pos.x - (signx * obj.xw));
        var oy = (t.pos.y + (signy * t.yw)) - (obj.pos.y - (signy * obj.yw));

        var twid = t.xw * 2;
        var rad = Math.sqrt(twid * twid + 0);

        //note that this should be precomputed at compile-time since it's constant
        var len = Math.sqrt(ox * ox + oy * oy);
        var pen = len - rad;
        if (0 < pen) {
            //collision; we need to either project along the axes, or project along corner->circlecenter vector
            var lenP = Math.sqrt(x * x + y * y);
            if (lenP < pen) {
                //it's shorter to move along axis directions
                obj.ReportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                return AABB.COL_AXIS;
            } else {
                //project along corner->circle vector
                ox /= len;
                oy /= len;

                obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                return AABB.COL_OTHER;
            }
        }

        return AABB.COL_NONE;
    };
    AABB.COL_NONE = 0;
    AABB.COL_AXIS = 1;
    AABB.COL_OTHER = 2;
    return AABB;
})();

var TileMapCell = (function () {
    function TileMapCell(x, y, xw, yw) {
        this.ID = TileMapCell.TID_EMPTY;
        this.CTYPE = TileMapCell.CTYPE_EMPTY;

        this.pos = new Phaser.Vec2(x, y);
        this.xw = xw;
        this.yw = yw;
        this.minx = this.pos.x - this.xw;
        this.maxx = this.pos.x + this.xw;
        this.miny = this.pos.y - this.yw;
        this.maxy = this.pos.y + this.yw;

        //this stores tile-specific collision information
        this.signx = 0;
        this.signy = 0;
        this.sx = 0;
        this.sy = 0;
    }
    //these functions are used to update the cell
    //note: ID is assumed to NOT be "empty" state..
    //if it IS the empty state, the tile clears itself
    TileMapCell.prototype.SetState = function (ID) {
        if (ID == TileMapCell.TID_EMPTY) {
            this.Clear();
        } else {
            //set tile state to a non-emtpy value, and update it's edges and those of the neighbors
            this.ID = ID;
            this.UpdateType();
            //this.Draw();
        }
        return this;
    };

    TileMapCell.prototype.Clear = function () {
        //tile was on, turn it off
        this.ID = TileMapCell.TID_EMPTY;
        this.UpdateType();
        //this.Draw();
    };

    TileMapCell.prototype.render = function (context) {
        context.beginPath();
        context.strokeStyle = 'rgb(255,255,0)';
        context.strokeRect(this.minx, this.miny, this.xw * 2, this.yw * 2);
        context.strokeRect(this.pos.x, this.pos.y, 2, 2);
        context.closePath();
    };

    //this converts a tile from implicitly-defined (via ID), to explicit (via properties)
    TileMapCell.prototype.UpdateType = function () {
        if (0 < this.ID) {
            if (this.ID < TileMapCell.CTYPE_45DEG) {
                //TID_FULL
                this.CTYPE = TileMapCell.CTYPE_FULL;
                this.signx = 0;
                this.signy = 0;
                this.sx = 0;
                this.sy = 0;
            } else if (this.ID < TileMapCell.CTYPE_CONCAVE) {
                //45deg
                this.CTYPE = TileMapCell.CTYPE_45DEG;
                if (this.ID == TileMapCell.TID_45DEGpn) {
                    console.log('set tile as 45deg pn');
                    this.signx = 1;
                    this.signy = -1;
                    this.sx = this.signx / Math.SQRT2;
                    this.sy = this.signy / Math.SQRT2;
                } else if (this.ID == TileMapCell.TID_45DEGnn) {
                    this.signx = -1;
                    this.signy = -1;
                    this.sx = this.signx / Math.SQRT2;
                    this.sy = this.signy / Math.SQRT2;
                } else if (this.ID == TileMapCell.TID_45DEGnp) {
                    this.signx = -1;
                    this.signy = 1;
                    this.sx = this.signx / Math.SQRT2;
                    this.sy = this.signy / Math.SQRT2;
                } else if (this.ID == TileMapCell.TID_45DEGpp) {
                    this.signx = 1;
                    this.signy = 1;
                    this.sx = this.signx / Math.SQRT2;
                    this.sy = this.signy / Math.SQRT2;
                } else {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            } else if (this.ID < TileMapCell.CTYPE_CONVEX) {
                //concave
                this.CTYPE = TileMapCell.CTYPE_CONCAVE;
                if (this.ID == TileMapCell.TID_CONCAVEpn) {
                    this.signx = 1;
                    this.signy = -1;
                    this.sx = 0;
                    this.sy = 0;
                } else if (this.ID == TileMapCell.TID_CONCAVEnn) {
                    this.signx = -1;
                    this.signy = -1;
                    this.sx = 0;
                    this.sy = 0;
                } else if (this.ID == TileMapCell.TID_CONCAVEnp) {
                    this.signx = -1;
                    this.signy = 1;
                    this.sx = 0;
                    this.sy = 0;
                } else if (this.ID == TileMapCell.TID_CONCAVEpp) {
                    this.signx = 1;
                    this.signy = 1;
                    this.sx = 0;
                    this.sy = 0;
                } else {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            } else if (this.ID < TileMapCell.CTYPE_22DEGs) {
                //convex
                this.CTYPE = TileMapCell.CTYPE_CONVEX;
                if (this.ID == TileMapCell.TID_CONVEXpn) {
                    this.signx = 1;
                    this.signy = -1;
                    this.sx = 0;
                    this.sy = 0;
                } else if (this.ID == TileMapCell.TID_CONVEXnn) {
                    this.signx = -1;
                    this.signy = -1;
                    this.sx = 0;
                    this.sy = 0;
                } else if (this.ID == TileMapCell.TID_CONVEXnp) {
                    this.signx = -1;
                    this.signy = 1;
                    this.sx = 0;
                    this.sy = 0;
                } else if (this.ID == TileMapCell.TID_CONVEXpp) {
                    this.signx = 1;
                    this.signy = 1;
                    this.sx = 0;
                    this.sy = 0;
                } else {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            } else if (this.ID < TileMapCell.CTYPE_22DEGb) {
                //22deg small
                this.CTYPE = TileMapCell.CTYPE_22DEGs;
                if (this.ID == TileMapCell.TID_22DEGpnS) {
                    this.signx = 1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                } else if (this.ID == TileMapCell.TID_22DEGnnS) {
                    this.signx = -1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                } else if (this.ID == TileMapCell.TID_22DEGnpS) {
                    this.signx = -1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                } else if (this.ID == TileMapCell.TID_22DEGppS) {
                    this.signx = 1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                } else {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            } else if (this.ID < TileMapCell.CTYPE_67DEGs) {
                //22deg big
                this.CTYPE = TileMapCell.CTYPE_22DEGb;
                if (this.ID == TileMapCell.TID_22DEGpnB) {
                    this.signx = 1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                } else if (this.ID == TileMapCell.TID_22DEGnnB) {
                    this.signx = -1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                } else if (this.ID == TileMapCell.TID_22DEGnpB) {
                    this.signx = -1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                } else if (this.ID == TileMapCell.TID_22DEGppB) {
                    this.signx = 1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                } else {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            } else if (this.ID < TileMapCell.CTYPE_67DEGb) {
                //67deg small
                this.CTYPE = TileMapCell.CTYPE_67DEGs;
                if (this.ID == TileMapCell.TID_67DEGpnS) {
                    this.signx = 1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                } else if (this.ID == TileMapCell.TID_67DEGnnS) {
                    this.signx = -1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                } else if (this.ID == TileMapCell.TID_67DEGnpS) {
                    this.signx = -1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                } else if (this.ID == TileMapCell.TID_67DEGppS) {
                    this.signx = 1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                } else {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            } else if (this.ID < TileMapCell.CTYPE_HALF) {
                //67deg big
                this.CTYPE = TileMapCell.CTYPE_67DEGb;
                if (this.ID == TileMapCell.TID_67DEGpnB) {
                    this.signx = 1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                } else if (this.ID == TileMapCell.TID_67DEGnnB) {
                    this.signx = -1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                } else if (this.ID == TileMapCell.TID_67DEGnpB) {
                    this.signx = -1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                } else if (this.ID == TileMapCell.TID_67DEGppB) {
                    this.signx = 1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                } else {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            } else {
                //half-full tile
                this.CTYPE = TileMapCell.CTYPE_HALF;
                if (this.ID == TileMapCell.TID_HALFd) {
                    this.signx = 0;
                    this.signy = -1;
                    this.sx = this.signx;
                    this.sy = this.signy;
                } else if (this.ID == TileMapCell.TID_HALFu) {
                    this.signx = 0;
                    this.signy = 1;
                    this.sx = this.signx;
                    this.sy = this.signy;
                } else if (this.ID == TileMapCell.TID_HALFl) {
                    this.signx = 1;
                    this.signy = 0;
                    this.sx = this.signx;
                    this.sy = this.signy;
                } else if (this.ID == TileMapCell.TID_HALFr) {
                    this.signx = -1;
                    this.signy = 0;
                    this.sx = this.signx;
                    this.sy = this.signy;
                } else {
                    //trace("BAAD TILE!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            }
        } else {
            //TID_EMPTY
            this.CTYPE = TileMapCell.CTYPE_EMPTY;
            this.signx = 0;
            this.signy = 0;
            this.sx = 0;
            this.sy = 0;
        }
    };
    TileMapCell.TID_EMPTY = 0;
    TileMapCell.TID_FULL = 1;
    TileMapCell.TID_45DEGpn = 2;
    TileMapCell.TID_45DEGnn = 3;
    TileMapCell.TID_45DEGnp = 4;
    TileMapCell.TID_45DEGpp = 5;
    TileMapCell.TID_CONCAVEpn = 6;
    TileMapCell.TID_CONCAVEnn = 7;
    TileMapCell.TID_CONCAVEnp = 8;
    TileMapCell.TID_CONCAVEpp = 9;
    TileMapCell.TID_CONVEXpn = 10;
    TileMapCell.TID_CONVEXnn = 11;
    TileMapCell.TID_CONVEXnp = 12;
    TileMapCell.TID_CONVEXpp = 13;
    TileMapCell.TID_22DEGpnS = 14;
    TileMapCell.TID_22DEGnnS = 15;
    TileMapCell.TID_22DEGnpS = 16;
    TileMapCell.TID_22DEGppS = 17;
    TileMapCell.TID_22DEGpnB = 18;
    TileMapCell.TID_22DEGnnB = 19;
    TileMapCell.TID_22DEGnpB = 20;
    TileMapCell.TID_22DEGppB = 21;
    TileMapCell.TID_67DEGpnS = 22;
    TileMapCell.TID_67DEGnnS = 23;
    TileMapCell.TID_67DEGnpS = 24;
    TileMapCell.TID_67DEGppS = 25;
    TileMapCell.TID_67DEGpnB = 26;
    TileMapCell.TID_67DEGnnB = 27;
    TileMapCell.TID_67DEGnpB = 28;
    TileMapCell.TID_67DEGppB = 29;
    TileMapCell.TID_HALFd = 30;
    TileMapCell.TID_HALFr = 31;
    TileMapCell.TID_HALFu = 32;
    TileMapCell.TID_HALFl = 33;

    TileMapCell.CTYPE_EMPTY = 0;
    TileMapCell.CTYPE_FULL = 1;
    TileMapCell.CTYPE_45DEG = 2;
    TileMapCell.CTYPE_CONCAVE = 6;
    TileMapCell.CTYPE_CONVEX = 10;
    TileMapCell.CTYPE_22DEGs = 14;
    TileMapCell.CTYPE_22DEGb = 18;
    TileMapCell.CTYPE_67DEGs = 22;
    TileMapCell.CTYPE_67DEGb = 26;
    TileMapCell.CTYPE_HALF = 30;
    return TileMapCell;
})();

var Circle = (function () {
    function Circle(x, y, radius) {
        this.type = 1;
        this.pos = new Phaser.Vec2(x, y);
        this.oldpos = Phaser.Vec2Utils.clone(this.pos);
        this.radius = radius;
        this.circleTileProjections = {};
        this.circleTileProjections[TileMapCell.CTYPE_FULL] = this.ProjCircle_Full;
        this.circleTileProjections[TileMapCell.CTYPE_45DEG] = this.ProjCircle_45Deg;
        this.circleTileProjections[TileMapCell.CTYPE_CONCAVE] = this.ProjCircle_Concave;
        this.circleTileProjections[TileMapCell.CTYPE_CONVEX] = this.ProjCircle_Convex;
        //Proj_CircleTile[CTYPE_22DEGs] = ProjCircle_22DegS;
        //Proj_CircleTile[CTYPE_22DEGb] = ProjCircle_22DegB;
        //Proj_CircleTile[CTYPE_67DEGs] = ProjCircle_67DegS;
        //Proj_CircleTile[CTYPE_67DEGb] = ProjCircle_67DegB;
        //Proj_CircleTile[CTYPE_HALF] = ProjCircle_Half;
    }
    Circle.prototype.IntegrateVerlet = function () {
        //var d = DRAG;
        //var g = GRAV;
        var d = 1;
        var g = 0.2;

        var p = this.pos;
        var o = this.oldpos;
        var px, py;

        var ox = o.x;
        var oy = o.y;
        o.x = px = p.x;
        o.y = py = p.y;

        //o = oldposition
        //integrate
        p.x += (d * px) - (d * ox);
        p.y += (d * py) - (d * oy) + g;
    };

    Circle.prototype.ReportCollisionVsWorld = function (px, py, dx, dy, obj) {
        var p = this.pos;
        var o = this.oldpos;

        //calc velocity
        var vx = p.x - o.x;
        var vy = p.y - o.y;

        //find component of velocity parallel to collision normal
        var dp = (vx * dx + vy * dy);
        var nx = dp * dx;

        var ny = dp * dy;

        var tx = vx - nx;
        var ty = vy - ny;

        //we only want to apply collision response forces if the object is travelling into, and not out of, the collision
        var b, bx, by, f, fx, fy;

        if (dp < 0) {
            //f = FRICTION;
            f = 0.05;
            fx = tx * f;
            fy = ty * f;

            //b = 1 + BOUNCE;//this bounce constant should be elsewhere, i.e inside the object/tile/etc..
            b = 1 + 0.3;

            bx = (nx * b);
            by = (ny * b);
        } else {
            //moving out of collision, do not apply forces
            bx = by = fx = fy = 0;
        }

        p.x += px;
        p.y += py;

        o.x += px + bx + fx;
        o.y += py + by + fy;
    };

    Circle.prototype.CollideCircleVsWorldBounds = function () {
        var p = this.pos;
        var r = this.radius;
        var XMIN = 0;
        var XMAX = 800;
        var YMIN = 0;
        var YMAX = 600;

        //collide vs. x-bounds
        //test XMIN
        var dx = XMIN - (p.x - r);
        if (0 < dx) {
            //object is colliding with XMIN
            this.ReportCollisionVsWorld(dx, 0, 1, 0, null);
        } else {
            //test XMAX
            dx = (p.x + r) - XMAX;
            if (0 < dx) {
                //object is colliding with XMAX
                this.ReportCollisionVsWorld(-dx, 0, -1, 0, null);
            }
        }

        //collide vs. y-bounds
        //test YMIN
        var dy = YMIN - (p.y - r);
        if (0 < dy) {
            //object is colliding with YMIN
            this.ReportCollisionVsWorld(0, dy, 0, 1, null);
        } else {
            //test YMAX
            dy = (p.y + r) - YMAX;
            if (0 < dy) {
                //object is colliding with YMAX
                this.ReportCollisionVsWorld(0, -dy, 0, -1, null);
            }
        }
    };

    Circle.prototype.render = function (context) {
        context.beginPath();
        context.strokeStyle = 'rgb(0,255,0)';
        context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        context.stroke();
        context.closePath();

        if (this.oH == 1) {
            context.beginPath();
            context.strokeStyle = 'rgb(255,0,0)';
            context.moveTo(this.pos.x - this.radius, this.pos.y - this.radius);
            context.lineTo(this.pos.x - this.radius, this.pos.y + this.radius);
            context.stroke();
            context.closePath();
        } else if (this.oH == -1) {
            context.beginPath();
            context.strokeStyle = 'rgb(255,0,0)';
            context.moveTo(this.pos.x + this.radius, this.pos.y - this.radius);
            context.lineTo(this.pos.x + this.radius, this.pos.y + this.radius);
            context.stroke();
            context.closePath();
        }

        if (this.oV == 1) {
            context.beginPath();
            context.strokeStyle = 'rgb(255,0,0)';
            context.moveTo(this.pos.x - this.radius, this.pos.y - this.radius);
            context.lineTo(this.pos.x + this.radius, this.pos.y - this.radius);
            context.stroke();
            context.closePath();
        } else if (this.oV == -1) {
            context.beginPath();
            context.strokeStyle = 'rgb(255,0,0)';
            context.moveTo(this.pos.x - this.radius, this.pos.y + this.radius);
            context.lineTo(this.pos.x + this.radius, this.pos.y + this.radius);
            context.stroke();
            context.closePath();
        }
    };

    Circle.prototype.CollideCircleVsTile = function (tile) {
        var pos = this.pos;
        var r = this.radius;
        var c = tile;

        var tx = c.pos.x;
        var ty = c.pos.y;
        var txw = c.xw;
        var tyw = c.yw;

        var dx = pos.x - tx;
        var px = (txw + r) - Math.abs(dx);

        if (0 < px) {
            var dy = pos.y - ty;
            var py = (tyw + r) - Math.abs(dy);

            if (0 < py) {
                //object may be colliding with tile
                //determine grid/voronoi region of circle center
                this.oH = 0;
                this.oV = 0;
                if (dx < -txw) {
                    //circle is on left side of tile
                    this.oH = -1;
                } else if (txw < dx) {
                    //circle is on right side of tile
                    this.oH = 1;
                }

                if (dy < -tyw) {
                    //circle is on top side of tile
                    this.oV = -1;
                } else if (tyw < dy) {
                    //circle is on bottom side of tile
                    this.oV = 1;
                }

                this.ResolveCircleTile(px, py, this.oH, this.oV, this, c);
            }
        }
    };

    Circle.prototype.ResolveCircleTile = function (x, y, oH, oV, obj, t) {
        if (0 < t.ID) {
            return this.circleTileProjections[t.CTYPE](x, y, oH, oV, obj, t);
        } else {
            console.log("ResolveCircleTile() was called with an empty (or unknown) tile!: ID=" + t.ID + " (" + t.i + "," + t.j + ")");
            return false;
        }
    };

    Circle.prototype.ProjCircle_Full = function (x, y, oH, oV, obj, t) {
        if (oH == 0) {
            if (oV == 0) {
                if (x < y) {
                    //penetration in x is smaller; project in x
                    var dx = obj.pos.x - t.pos.x;

                    if (dx < 0) {
                        obj.ReportCollisionVsWorld(-x, 0, -1, 0, t);
                        return Circle.COL_AXIS;
                    } else {
                        obj.ReportCollisionVsWorld(x, 0, 1, 0, t);
                        return Circle.COL_AXIS;
                    }
                } else {
                    //penetration in y is smaller; project in y
                    var dy = obj.pos.y - t.pos.y;

                    if (dy < 0) {
                        obj.ReportCollisionVsWorld(0, -y, 0, -1, t);
                        return Circle.COL_AXIS;
                    } else {
                        obj.ReportCollisionVsWorld(0, y, 0, 1, t);
                        return Circle.COL_AXIS;
                    }
                }
            } else {
                //collision with vertical neighbor
                obj.ReportCollisionVsWorld(0, y * oV, 0, oV, t);

                return Circle.COL_AXIS;
            }
        } else if (oV == 0) {
            //collision with horizontal neighbor
            obj.ReportCollisionVsWorld(x * oH, 0, oH, 0, t);
            return Circle.COL_AXIS;
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

                return Circle.COL_OTHER;
            }
        }

        return Circle.COL_NONE;
    };

    Circle.prototype.ProjCircle_45Deg = function (x, y, oH, oV, obj, t) {
        //if we're colliding diagonally:
        //	-if obj is in the diagonal pointed to by the slope normal: we can't collide, do nothing
        //  -else, collide vs. the appropriate vertex
        //if obj is in this tile: perform collision as for aabb-ve-45deg
        //if obj is horiz OR very neighb in direction of slope: collide only vs. slope
        //if obj is horiz or vert neigh against direction of slope: collide vs. face
        var signx = t.signx;
        var signy = t.signy;
        var lenP;

        if (oH == 0) {
            if (oV == 0) {
                //colliding with current tile
                var sx = t.sx;
                var sy = t.sy;

                var ox = (obj.pos.x - (sx * obj.radius)) - t.pos.x;
                var oy = (obj.pos.y - (sy * obj.radius)) - t.pos.y;

                //if the dotprod of (ox,oy) and (sx,sy) is negative, the innermost point is in the slope
                //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
                var dp = (ox * sx) + (oy * sy);
                if (dp < 0) {
                    //collision; project delta onto slope and use this as the slope penetration vector
                    sx *= -dp;
                    sy *= -dp;

                    if (x < y) {
                        //penetration in x is smaller
                        lenP = x;
                        y = 0;

                        if ((obj.pos.x - t.pos.x) < 0) {
                            x *= -1;
                        }
                    } else {
                        //penetration in y is smaller
                        lenP = y;
                        x = 0;

                        if ((obj.pos.y - t.pos.y) < 0) {
                            y *= -1;
                        }
                    }

                    var lenN = Math.sqrt(sx * sx + sy * sy);

                    if (lenP < lenN) {
                        obj.ReportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                        return Circle.COL_AXIS;
                    } else {
                        obj.ReportCollisionVsWorld(sx, sy, t.sx, t.sy, t);

                        return Circle.COL_OTHER;
                    }
                }
            } else {
                if ((signy * oV) < 0) {
                    //colliding with face/edge
                    obj.ReportCollisionVsWorld(0, y * oV, 0, oV, t);

                    return Circle.COL_AXIS;
                } else {
                    //we could only be colliding vs the slope OR a vertex
                    //look at the vector form the closest vert to the circle to decide
                    var sx = t.sx;
                    var sy = t.sy;

                    var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                    var oy = obj.pos.y - (t.pos.y + (oV * t.yw));

                    //if the component of (ox,oy) parallel to the normal's righthand normal
                    //has the same sign as the slope of the slope (the sign of the slope's slope is signx*signy)
                    //then we project by the vertex, otherwise by the normal.
                    //note that this is simply a VERY tricky/weird method of determining
                    //if the circle is in side the slope/face's voronoi region, or that of the vertex.
                    var perp = (ox * -sy) + (oy * sx);
                    if (0 < (perp * signx * signy)) {
                        //collide vs. vertex
                        var len = Math.sqrt(ox * ox + oy * oy);
                        var pen = obj.radius - len;
                        if (0 < pen) {
                            //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                            ox /= len;
                            oy /= len;

                            obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                            return Circle.COL_OTHER;
                        }
                    } else {
                        //collide vs. slope
                        //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                        //penetrating the slope. note that this method of penetration calculation doesn't hold
                        //in general (i.e it won't work if the circle is in the slope), but works in this case
                        //because we know the circle is in a neighboring cell
                        var dp = (ox * sx) + (oy * sy);
                        var pen = obj.radius - Math.abs(dp);
                        if (0 < pen) {
                            //collision; circle out along normal by penetration amount
                            obj.ReportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);

                            return Circle.COL_OTHER;
                        }
                    }
                }
            }
        } else if (oV == 0) {
            if ((signx * oH) < 0) {
                //colliding with face/edge
                obj.ReportCollisionVsWorld(x * oH, 0, oH, 0, t);

                return Circle.COL_AXIS;
            } else {
                //we could only be colliding vs the slope OR a vertex
                //look at the vector form the closest vert to the circle to decide
                var sx = t.sx;
                var sy = t.sy;

                var ox = obj.pos.x - (t.pos.x + (oH * t.xw));
                var oy = obj.pos.y - (t.pos.y - (signy * t.yw));

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
                if ((perp * signx * signy) < 0) {
                    //collide vs. vertex
                    var len = Math.sqrt(ox * ox + oy * oy);
                    var pen = obj.radius - len;
                    if (0 < pen) {
                        //note: if len=0, then perp=0 and we'll never reach here, so don't worry about div-by-0
                        ox /= len;
                        oy /= len;

                        obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Circle.COL_OTHER;
                    }
                } else {
                    //collide vs. slope
                    //if the component of (ox,oy) parallel to the normal is less than the circle radius, we're
                    //penetrating the slope. note that this method of penetration calculation doesn't hold
                    //in general (i.e it won't work if the circle is in the slope), but works in this case
                    //because we know the circle is in a neighboring cell
                    var dp = (ox * sx) + (oy * sy);
                    var pen = obj.radius - Math.abs(dp);
                    if (0 < pen) {
                        //collision; circle out along normal by penetration amount
                        obj.ReportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);

                        return Circle.COL_OTHER;
                    }
                }
            }
        } else {
            if (0 < ((signx * oH) + (signy * oV))) {
                //the dotprod of slope normal and cell offset is strictly positive,
                //therefore obj is in the diagonal neighb pointed at by the normal, and
                //it cannot possibly reach/touch/penetrate the slope
                return Circle.COL_NONE;
            } else {
                //collide vs. vertex
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
                    return Circle.COL_OTHER;
                }
            }
        }

        return Circle.COL_NONE;
    };

    Circle.prototype.ProjCircle_Concave = function (x, y, oH, oV, obj, t) {
        //if we're colliding diagonally:
        //	-if obj is in the diagonal pointed to by the slope normal: we can't collide, do nothing
        //  -else, collide vs. the appropriate vertex
        //if obj is in this tile: perform collision as for aabb
        //if obj is horiz OR very neighb in direction of slope: collide vs vert
        //if obj is horiz or vert neigh against direction of slope: collide vs. face
        var signx = t.signx;
        var signy = t.signy;
        var lenP;

        if (oH == 0) {
            if (oV == 0) {
                //colliding with current tile
                var ox = (t.pos.x + (signx * t.xw)) - obj.pos.x;
                var oy = (t.pos.y + (signy * t.yw)) - obj.pos.y;

                var twid = t.xw * 2;
                var trad = Math.sqrt(twid * twid + 0);

                //note that this should be precomputed at compile-time since it's constant
                var len = Math.sqrt(ox * ox + oy * oy);
                var pen = (len + obj.radius) - trad;

                if (0 < pen) {
                    if (x < y) {
                        //penetration in x is smaller
                        lenP = x;
                        y = 0;

                        if ((obj.pos.x - t.pos.x) < 0) {
                            x *= -1;
                        }
                    } else {
                        //penetration in y is smaller
                        lenP = y;
                        x = 0;

                        if ((obj.pos.y - t.pos.y) < 0) {
                            y *= -1;
                        }
                    }

                    if (lenP < pen) {
                        obj.ReportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                        return Circle.COL_AXIS;
                    } else {
                        //we can assume that len >0, because if we're here then
                        //(len + obj.radius) > trad, and since obj.radius <= trad
                        //len MUST be > 0
                        ox /= len;
                        oy /= len;

                        obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Circle.COL_OTHER;
                    }
                } else {
                    return Circle.COL_NONE;
                }
            } else {
                if ((signy * oV) < 0) {
                    //colliding with face/edge
                    obj.ReportCollisionVsWorld(0, y * oV, 0, oV, t);

                    return Circle.COL_AXIS;
                } else {
                    //we could only be colliding vs the vertical tip
                    //get diag vertex position
                    var vx = t.pos.x - (signx * t.xw);
                    var vy = t.pos.y + (oV * t.yw);

                    var dx = obj.pos.x - vx;
                    var dy = obj.pos.y - vy;

                    var len = Math.sqrt(dx * dx + dy * dy);
                    var pen = obj.radius - len;
                    if (0 < pen) {
                        if (len == 0) {
                            //project out vertically
                            dx = 0;
                            dy = oV;
                        } else {
                            dx /= len;
                            dy /= len;
                        }

                        obj.ReportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                        return Circle.COL_OTHER;
                    }
                }
            }
        } else if (oV == 0) {
            if ((signx * oH) < 0) {
                //colliding with face/edge
                obj.ReportCollisionVsWorld(x * oH, 0, oH, 0, t);

                return Circle.COL_AXIS;
            } else {
                //we could only be colliding vs the horizontal tip
                //get diag vertex position
                var vx = t.pos.x + (oH * t.xw);
                var vy = t.pos.y - (signy * t.yw);

                var dx = obj.pos.x - vx;
                var dy = obj.pos.y - vy;

                var len = Math.sqrt(dx * dx + dy * dy);
                var pen = obj.radius - len;
                if (0 < pen) {
                    if (len == 0) {
                        //project out horizontally
                        dx = oH;
                        dy = 0;
                    } else {
                        dx /= len;
                        dy /= len;
                    }

                    obj.ReportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                    return Circle.COL_OTHER;
                }
            }
        } else {
            if (0 < ((signx * oH) + (signy * oV))) {
                //the dotprod of slope normal and cell offset is strictly positive,
                //therefore obj is in the diagonal neighb pointed at by the normal, and
                //it cannot possibly reach/touch/penetrate the slope
                return Circle.COL_NONE;
            } else {
                //collide vs. vertex
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

                    return Circle.COL_OTHER;
                }
            }
        }

        return Circle.COL_NONE;
    };

    Circle.prototype.ProjCircle_Convex = function (x, y, oH, oV, obj, t) {
        //if the object is horiz AND/OR vertical neighbor in the normal (signx,signy)
        //direction, collide vs. tile-circle only.
        //if we're colliding diagonally:
        //  -else, collide vs. the appropriate vertex
        //if obj is in this tile: perform collision as for aabb
        //if obj is horiz or vert neigh against direction of slope: collide vs. face
        var signx = t.signx;
        var signy = t.signy;
        var lenP;

        if (oH == 0) {
            if (oV == 0) {
                //colliding with current tile
                var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                var oy = obj.pos.y - (t.pos.y - (signy * t.yw));

                var twid = t.xw * 2;
                var trad = Math.sqrt(twid * twid + 0);

                //note that this should be precomputed at compile-time since it's constant
                var len = Math.sqrt(ox * ox + oy * oy);
                var pen = (trad + obj.radius) - len;

                if (0 < pen) {
                    if (x < y) {
                        //penetration in x is smaller
                        lenP = x;
                        y = 0;

                        if ((obj.pos.x - t.pos.x) < 0) {
                            x *= -1;
                        }
                    } else {
                        //penetration in y is smaller
                        lenP = y;
                        x = 0;

                        if ((obj.pos.y - t.pos.y) < 0) {
                            y *= -1;
                        }
                    }

                    if (lenP < pen) {
                        obj.ReportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                        return Circle.COL_AXIS;
                    } else {
                        //note: len should NEVER be == 0, because if it is,
                        //projeciton by an axis shoudl always be shorter, and we should
                        //never arrive here
                        ox /= len;
                        oy /= len;

                        obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Circle.COL_OTHER;
                    }
                }
            } else {
                if ((signy * oV) < 0) {
                    //colliding with face/edge
                    obj.ReportCollisionVsWorld(0, y * oV, 0, oV, t);

                    return Circle.COL_AXIS;
                } else {
                    //obj in neighboring cell pointed at by tile normal;
                    //we could only be colliding vs the tile-circle surface
                    var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                    var oy = obj.pos.y - (t.pos.y - (signy * t.yw));

                    var twid = t.xw * 2;
                    var trad = Math.sqrt(twid * twid + 0);

                    //note that this should be precomputed at compile-time since it's constant
                    var len = Math.sqrt(ox * ox + oy * oy);
                    var pen = (trad + obj.radius) - len;

                    if (0 < pen) {
                        //note: len should NEVER be == 0, because if it is,
                        //obj is not in a neighboring cell!
                        ox /= len;
                        oy /= len;

                        obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Circle.COL_OTHER;
                    }
                }
            }
        } else if (oV == 0) {
            if ((signx * oH) < 0) {
                //colliding with face/edge
                obj.ReportCollisionVsWorld(x * oH, 0, oH, 0, t);

                return Circle.COL_AXIS;
            } else {
                //obj in neighboring cell pointed at by tile normal;
                //we could only be colliding vs the tile-circle surface
                var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                var oy = obj.pos.y - (t.pos.y - (signy * t.yw));

                var twid = t.xw * 2;
                var trad = Math.sqrt(twid * twid + 0);

                //note that this should be precomputed at compile-time since it's constant
                var len = Math.sqrt(ox * ox + oy * oy);
                var pen = (trad + obj.radius) - len;

                if (0 < pen) {
                    //note: len should NEVER be == 0, because if it is,
                    //obj is not in a neighboring cell!
                    ox /= len;
                    oy /= len;

                    obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                    return Circle.COL_OTHER;
                }
            }
        } else {
            if (0 < ((signx * oH) + (signy * oV))) {
                //obj in diag neighb cell pointed at by tile normal;
                //we could only be colliding vs the tile-circle surface
                var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                var oy = obj.pos.y - (t.pos.y - (signy * t.yw));

                var twid = t.xw * 2;
                var trad = Math.sqrt(twid * twid + 0);

                //note that this should be precomputed at compile-time since it's constant
                var len = Math.sqrt(ox * ox + oy * oy);
                var pen = (trad + obj.radius) - len;

                if (0 < pen) {
                    //note: len should NEVER be == 0, because if it is,
                    //obj is not in a neighboring cell!
                    ox /= len;
                    oy /= len;

                    obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                    return Circle.COL_OTHER;
                }
            } else {
                //collide vs. vertex
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

                    return Circle.COL_OTHER;
                }
            }
        }

        return Circle.COL_NONE;
    };
    Circle.COL_NONE = 0;
    Circle.COL_AXIS = 1;
    Circle.COL_OTHER = 2;
    return Circle;
})();

(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {
        game.load.image('ball', 'assets/sprites/shinyball.png');
        game.load.image('card', 'assets/sprites/mana_card.png');
    }

    var cells;
    var physics;
    var b;
    var c;
    var t;
    var ball;
    var card;

    function create() {
        this.ball = game.add.sprite(0, 0, 'ball');
        this.ball.origin.setTo(0.5, 0.5);

        this.card = game.add.sprite(0, 0, 'card');
        this.card.rotation = 30;

        //this.card.origin.setTo(0.5, 0.5);
        this.physics = new NPhysics();
        this.c = new Circle(200, 100, 16);
        this.b = new AABB(200, 200, 74 / 2, 128 / 2);

        //  pos is center, not upper-left
        this.cells = [];

        var tid;

        for (var i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                console.log('pn');
                tid = TileMapCell.TID_CONCAVEpn;
            } else {
                console.log('nn');
                tid = TileMapCell.TID_CONCAVEnn;
            }

            //this.cells.push(new TileMapCell(100 + (i * 100), 400, 50, 100).SetState(TileMapCell.TID_FULL));
            this.cells.push(new TileMapCell(100 + (i * 100), 400, 50, 50).SetState(tid));
            //this.cells.push(new TileMapCell(100 + (i * 100), 500, 50, 50).SetState(TileMapCell.TID_FULL));
            //this.cells.push(new TileMapCell(100 + (i * 100), 500, 50, 50).SetState(TileMapCell.TID_CONCAVEpn));
        }
        //this.t = new TileMapCell(200, 500, 100, 100);
        //this.t.SetState(TileMapCell.TID_FULL);
        //this.t.SetState(TileMapCell.TID_45DEGpn);
        //this.t.SetState(TileMapCell.TID_CONCAVEpn);
        //this.t.SetState(TileMapCell.TID_CONVEXpn);
    }

    function update() {
        var fx = 0;
        var fy = 0;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            fx -= 0.2;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            fx += 0.2;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            fy -= 0.2 + 0.2;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            fy += 0.2;
        }

        //  update circle
        this.c.pos.x = this.c.oldpos.x + Math.min(20, Math.max(-20, this.c.pos.x - this.c.oldpos.x + fx));
        this.c.pos.y = this.c.oldpos.y + Math.min(20, Math.max(-20, this.c.pos.y - this.c.oldpos.y + fy));
        this.c.IntegrateVerlet();

        //  update box
        this.b.pos.x = this.b.oldpos.x + Math.min(40, Math.max(-40, this.b.pos.x - this.b.oldpos.x + fx));
        this.b.pos.y = this.b.oldpos.y + Math.min(40, Math.max(-40, this.b.pos.y - this.b.oldpos.y + fy));
        this.b.IntegrateVerlet();

        for (var i = 0; i < this.cells.length; i++) {
            this.c.CollideCircleVsTile(this.cells[i]);
            this.b.CollideAABBVsTile(this.cells[i]);
        }

        this.c.CollideCircleVsWorldBounds();
        this.b.CollideAABBVsWorldBounds();

        this.ball.x = this.c.pos.x;
        this.ball.y = this.c.pos.y;

        this.card.transform.centerOn(this.b.pos.x, this.b.pos.y);
        //this.card.x = this.b.pos.x;
        //this.card.y = this.b.pos.y;
    }

    function render() {
        this.c.render(game.stage.context);
        this.b.render(game.stage.context);

        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i].render(game.stage.context);
        }
    }
})();
