/// <reference path="../../Phaser/Game.ts" />

class NPhysics {

    grav: number = 0.2;
    drag: number = 1;
    bounce: number = 0.3;
    friction: number = 0.05;

    min_f: number = 0;
    max_f: number = 1;

    min_b: number = 0;
    max_b: number = 1;

    min_g: number = 0;
    max_g = 1;

    xmin: number = 0;
    xmax: number = 800;
    ymin: number = 0;
    ymax: number = 600;

    objrad: number = 24;
    tilerad: number = 24*2;
    objspeed: number = 0.2;
    maxspeed: number = 20;

    public update() {
        //  demoObj.Verlet();
        //  demoObj.CollideVsWorldBounds();
    }

}

class AABB {
 
    constructor(x: number, y: number, xw, yw) {
        
        this.pos = new Phaser.Vector2(x, y);
        this.oldpos = this.pos.clone();
        this.xw = Math.abs(xw);
        this.yw = Math.abs(yw);
        this.aabbTileProjections = {};//hash object to hold tile-specific collision functions
        this.aabbTileProjections[TileMapCell.CTYPE_FULL] = this.ProjAABB_Full;
    }

    type:number = 0;
    pos: Phaser.Vector2;
    oldpos: Phaser.Vector2;
    xw: number;
    yw: number;
    aabbTileProjections;
    public oH: number;
    public oV: number;
    static COL_NONE = 0;
    static COL_AXIS = 1;
    static COL_OTHER = 2;

    public IntegrateVerlet() {

        //var d = DRAG;
        //var g = GRAV;
        var d = 1;
        var g = 0.2;

        var p = this.pos;
        var o = this.oldpos;
        var px, py;

        var ox = o.x; //we can't swap buffers since mcs/sticks point directly to vector2s..
        var oy = o.y;
        o.x = px = p.x;		//get vector values
        o.y = py = p.y;		//p = position  
        //o = oldposition

        //integrate	
        p.x += (d * px) - (d * ox);
        p.y += (d * py) - (d * oy) + g;

    }

    public ReportCollisionVsWorld(px, py, dx, dy, obj: TileMapCell) {

        var p = this.pos;
        var o = this.oldpos;

        //calc velocity
        var vx = p.x - o.x;
        var vy = p.y - o.y;

        //find component of velocity parallel to collision normal
        var dp = (vx * dx + vy * dy);
        var nx = dp * dx;//project velocity onto collision normal

        var ny = dp * dy;//nx,ny is normal velocity

        var tx = vx - nx;//px,py is tangent velocity
        var ty = vy - ny;

        //we only want to apply collision response forces if the object is travelling into, and not out of, the collision
        var b, bx, by, f, fx, fy;

        if (dp < 0)
        {
            //f = FRICTION;
            f = 0.05;
            fx = tx * f;
            fy = ty * f;

            //b = 1 + BOUNCE;//this bounce constant should be elsewhere, i.e inside the object/tile/etc..
            b = 1 + 0.3;//this bounce constant should be elsewhere, i.e inside the object/tile/etc..

            bx = (nx * b);
            by = (ny * b);

        }
        else
        {
            //moving out of collision, do not apply forces
            bx = by = fx = fy = 0;
        }

        p.x += px;//project object out of collision
        p.y += py;

        o.x += px + bx + fx;//apply bounce+friction impulses which alter velocity
        o.y += py + by + fy;

    }

    public CollideAABBVsWorldBounds() {
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
        if (0 < dx)
        {
            //object is colliding with XMIN
            this.ReportCollisionVsWorld(dx, 0, 1, 0, null);
        }
        else
        {
            //test XMAX
            dx = (p.x + xw) - XMAX;
            if (0 < dx)
            {
                //object is colliding with XMAX
                this.ReportCollisionVsWorld(-dx, 0, -1, 0, null);
            }
        }

        //collide vs. y-bounds
        //test YMIN
        var dy = YMIN - (p.y - yw);
        if (0 < dy)
        {
            //object is colliding with YMIN
            this.ReportCollisionVsWorld(0, dy, 0, 1, null);
        }
        else
        {
            //test YMAX
            dy = (p.y + yw) - YMAX;
            if (0 < dy)
            {
                //object is colliding with YMAX
                this.ReportCollisionVsWorld(0, -dy, 0, -1, null);
            }
        }
    }

    public render(context:CanvasRenderingContext2D) {
        
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

    }

    public ResolveBoxTile(x, y, box, t) {
        if (0 < t.ID)
        {
            return this.aabbTileProjections[t.CTYPE](x, y, box, t);
        }
        else
        {
            //trace("ResolveBoxTile() was called with an empty (or unknown) tile!: ID=" + t.ID + " ("+ t.i + "," + t.j + ")");
            return false;
        }
    }

    public ProjAABB_Full(x, y, obj, t) {
        var l = Math.sqrt(x * x + y * y);
        obj.ReportCollisionVsWorld(x, y, x / l, y / l, t);

        return AABB.COL_AXIS;
    }



}

class TileMapCell {

    //TILETYPE ENUMERATION
    static TID_EMPTY = 0;
    static TID_FULL = 1;//fullAABB tile
    static TID_45DEGpn = 2;//45-degree triangle, whose normal is (+ve,-ve)
    static TID_45DEGnn = 3;//(+ve,+ve)
    static TID_45DEGnp = 4;//(-ve,+ve)
    static TID_45DEGpp = 5;//(-ve,-ve)
    static TID_CONCAVEpn = 6;//1/4-circle cutout
    static TID_CONCAVEnn = 7;
    static TID_CONCAVEnp = 8;
    static TID_CONCAVEpp = 9;
    static TID_CONVEXpn = 10;//1/4/circle
    static TID_CONVEXnn = 11;
    static TID_CONVEXnp = 12;
    static TID_CONVEXpp = 13;
    static TID_22DEGpnS = 14;//22.5 degree slope
    static TID_22DEGnnS = 15;
    static TID_22DEGnpS = 16;
    static TID_22DEGppS = 17;
    static TID_22DEGpnB = 18;
    static TID_22DEGnnB = 19;
    static TID_22DEGnpB = 20;
    static TID_22DEGppB = 21;
    static TID_67DEGpnS = 22;//67.5 degree slope
    static TID_67DEGnnS = 23;
    static TID_67DEGnpS = 24;
    static TID_67DEGppS = 25;
    static TID_67DEGpnB = 26;
    static TID_67DEGnnB = 27;
    static TID_67DEGnpB = 28;
    static TID_67DEGppB = 29;
    static TID_HALFd = 30;//half-full tiles
    static TID_HALFr = 31;
    static TID_HALFu = 32;
    static TID_HALFl = 33;

    //collision shape  "types"
    static CTYPE_EMPTY = 0;
    static CTYPE_FULL = 1;
    static CTYPE_45DEG = 2;
    static CTYPE_CONCAVE = 6;
    static CTYPE_CONVEX = 10;
    static CTYPE_22DEGs = 14;
    static CTYPE_22DEGb = 18;
    static CTYPE_67DEGs = 22;
    static CTYPE_67DEGb = 26;
    static CTYPE_HALF = 30;

    ID;
    CTYPE;
    pos: Phaser.Vector2;
    xw;
    yw;
    minx;
    maxx;
    miny;
    maxy;
    signx;
    signy;
    sx;
    sy;

    constructor(x,y,xw,yw) {

	    this.ID = TileMapCell.TID_EMPTY; //all tiles start empty
	    this.CTYPE = TileMapCell.CTYPE_EMPTY;

	    this.pos = new Phaser.Vector2(x,y);	//setup collision properties
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
    SetState(ID) {
        if (ID == TileMapCell.TID_EMPTY)
        {
            this.Clear();
        }
        else
        {
            //set tile state to a non-emtpy value, and update it's edges and those of the neighbors
            this.ID = ID;
            this.UpdateType();
            //this.Draw();
        }
        return this;
    }

    Clear() {
        //tile was on, turn it off
        this.ID = TileMapCell.TID_EMPTY
        this.UpdateType();
        //this.Draw();
    }

    public render(context: CanvasRenderingContext2D) {
        
        context.beginPath();
        context.strokeStyle = 'rgb(255,255,0)';
        context.strokeRect(this.minx, this.miny, this.xw * 2, this.yw * 2);
        context.strokeRect(this.pos.x, this.pos.y, 2, 2);
        context.closePath();

    }

    //this converts a tile from implicitly-defined (via ID), to explicit (via properties)
    UpdateType() {
        if (0 < this.ID)
        {
            //tile is non-empty; collide
            if (this.ID < TileMapCell.CTYPE_45DEG)
            {
                //TID_FULL
                this.CTYPE = TileMapCell.CTYPE_FULL;
                this.signx = 0;
                this.signy = 0;
                this.sx = 0;
                this.sy = 0;

            }
            else if (this.ID < TileMapCell.CTYPE_CONCAVE)
                {

                //45deg
                this.CTYPE = TileMapCell.CTYPE_45DEG;
                if (this.ID == TileMapCell.TID_45DEGpn)
                {
                    console.log('set tile as 45deg pn');
                    this.signx = 1;
                    this.signy = -1;
                    this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                    this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)				

                }
                else if (this.ID == TileMapCell.TID_45DEGnn)
                    {
                    this.signx = -1;
                    this.signy = -1;
                    this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                    this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)				

                }
                else if (this.ID == TileMapCell.TID_45DEGnp)
                    {
                    this.signx = -1;
                    this.signy = 1;
                    this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                    this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)				
                }
                else if (this.ID == TileMapCell.TID_45DEGpp)
                    {
                    this.signx = 1;
                    this.signy = 1;
                    this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                    this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)				
                }
                else
                {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            }
            else if (this.ID < TileMapCell.CTYPE_CONVEX)
                {

                //concave
                this.CTYPE = TileMapCell.CTYPE_CONCAVE;
                if (this.ID == TileMapCell.TID_CONCAVEpn)
                {
                    this.signx = 1;
                    this.signy = -1;
                    this.sx = 0;
                    this.sy = 0;
                }
                else if (this.ID == TileMapCell.TID_CONCAVEnn)
                    {
                    this.signx = -1;
                    this.signy = -1;
                    this.sx = 0;
                    this.sy = 0;
                }
                else if (this.ID == TileMapCell.TID_CONCAVEnp)
                    {
                    this.signx = -1;
                    this.signy = 1;
                    this.sx = 0;
                    this.sy = 0;
                }
                else if (this.ID == TileMapCell.TID_CONCAVEpp)
                    {
                    this.signx = 1;
                    this.signy = 1;
                    this.sx = 0;
                    this.sy = 0;
                }
                else
                {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            }
            else if (this.ID < TileMapCell.CTYPE_22DEGs)
                {

                //convex
                this.CTYPE = TileMapCell.CTYPE_CONVEX;
                if (this.ID == TileMapCell.TID_CONVEXpn)
                {
                    this.signx = 1;
                    this.signy = -1;
                    this.sx = 0;
                    this.sy = 0;
                }
                else if (this.ID == TileMapCell.TID_CONVEXnn)
                    {
                    this.signx = -1;
                    this.signy = -1;
                    this.sx = 0;
                    this.sy = 0;
                }
                else if (this.ID == TileMapCell.TID_CONVEXnp)
                    {
                    this.signx = -1;
                    this.signy = 1;
                    this.sx = 0;
                    this.sy = 0;
                }
                else if (this.ID == TileMapCell.TID_CONVEXpp)
                    {
                    this.signx = 1;
                    this.signy = 1;
                    this.sx = 0;
                    this.sy = 0;
                }
                else
                {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            }
            else if (this.ID < TileMapCell.CTYPE_22DEGb)
                {

                //22deg small
                this.CTYPE = TileMapCell.CTYPE_22DEGs;
                if (this.ID == TileMapCell.TID_22DEGpnS)
                {
                    this.signx = 1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                }
                else if (this.ID == TileMapCell.TID_22DEGnnS)
                    {
                    this.signx = -1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                }
                else if (this.ID == TileMapCell.TID_22DEGnpS)
                    {
                    this.signx = -1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                }
                else if (this.ID == TileMapCell.TID_22DEGppS)
                    {
                    this.signx = 1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                }
                else
                {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            }
            else if (this.ID < TileMapCell.CTYPE_67DEGs)
                {

                //22deg big
                this.CTYPE = TileMapCell.CTYPE_22DEGb;
                if (this.ID == TileMapCell.TID_22DEGpnB)
                {
                    this.signx = 1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                }
                else if (this.ID == TileMapCell.TID_22DEGnnB)
                    {
                    this.signx = -1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                }
                else if (this.ID == TileMapCell.TID_22DEGnpB)
                    {
                    this.signx = -1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                }
                else if (this.ID == TileMapCell.TID_22DEGppB)
                    {
                    this.signx = 1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 1) / slen;
                    this.sy = (this.signy * 2) / slen;
                }
                else
                {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            }
            else if (this.ID < TileMapCell.CTYPE_67DEGb)
                {

                //67deg small
                this.CTYPE = TileMapCell.CTYPE_67DEGs;
                if (this.ID == TileMapCell.TID_67DEGpnS)
                {
                    this.signx = 1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                }
                else if (this.ID == TileMapCell.TID_67DEGnnS)
                    {
                    this.signx = -1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                }
                else if (this.ID == TileMapCell.TID_67DEGnpS)
                    {
                    this.signx = -1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                }
                else if (this.ID == TileMapCell.TID_67DEGppS)
                    {
                    this.signx = 1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                }
                else
                {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            }
            else if (this.ID < TileMapCell.CTYPE_HALF)
                {

                //67deg big
                this.CTYPE = TileMapCell.CTYPE_67DEGb;
                if (this.ID == TileMapCell.TID_67DEGpnB)
                {
                    this.signx = 1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                }
                else if (this.ID == TileMapCell.TID_67DEGnnB)
                    {
                    this.signx = -1;
                    this.signy = -1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                }
                else if (this.ID == TileMapCell.TID_67DEGnpB)
                    {
                    this.signx = -1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                }
                else if (this.ID == TileMapCell.TID_67DEGppB)
                    {
                    this.signx = 1;
                    this.signy = 1;
                    var slen = Math.sqrt(2 * 2 + 1 * 1);
                    this.sx = (this.signx * 2) / slen;
                    this.sy = (this.signy * 1) / slen;
                }
                else
                {
                    //trace("BAAAD TILE!!!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }
            }
            else
            {
                //half-full tile
                this.CTYPE = TileMapCell.CTYPE_HALF;
                if (this.ID == TileMapCell.TID_HALFd)
                {
                    this.signx = 0;
                    this.signy = -1;
                    this.sx = this.signx;
                    this.sy = this.signy;
                }
                else if (this.ID == TileMapCell.TID_HALFu)
                    {
                    this.signx = 0;
                    this.signy = 1;
                    this.sx = this.signx;
                    this.sy = this.signy;
                }
                else if (this.ID == TileMapCell.TID_HALFl)
                    {
                    this.signx = 1;
                    this.signy = 0;
                    this.sx = this.signx;
                    this.sy = this.signy;
                }
                else if (this.ID == TileMapCell.TID_HALFr)
                    {
                    this.signx = -1;
                    this.signy = 0;
                    this.sx = this.signx;
                    this.sy = this.signy;
                }
                else
                {
                    //trace("BAAD TILE!!!: ID=" + this.ID + " ("+ t.i + "," + t.j + ")");
                    return false;
                }

            }

        }
        else
        {
            //TID_EMPTY
            this.CTYPE = TileMapCell.CTYPE_EMPTY;
            this.signx = 0;
            this.signy = 0;
            this.sx = 0;
            this.sy = 0;
        }
    }

}

class Circle {

    constructor(x, y, radius) {

        this.pos = new Phaser.Vector2(x, y);
        this.oldpos = this.pos.clone();
        this.radius = radius;
        this.circleTileProjections = {};//hash object to hold tile-specific collision functions
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

    type:number = 1;
    pos: Phaser.Vector2;
    oldpos: Phaser.Vector2;
    radius: number;
    circleTileProjections;
    public oH: number;
    public oV: number;
    static COL_NONE = 0;
    static COL_AXIS = 1;
    static COL_OTHER = 2;

    public IntegrateVerlet() {

        //var d = DRAG;
        //var g = GRAV;
        var d = 1;
        var g = 0.2;

        var p = this.pos;
        var o = this.oldpos;
        var px, py;

        var ox = o.x; //we can't swap buffers since mcs/sticks point directly to vector2s..
        var oy = o.y;
        o.x = px = p.x;		//get vector values
        o.y = py = p.y;		//p = position  
        //o = oldposition

        //integrate	
        p.x += (d * px) - (d * ox);
        p.y += (d * py) - (d * oy) + g;

    }

    public ReportCollisionVsWorld(px, py, dx, dy, obj: TileMapCell) {

        var p = this.pos;
        var o = this.oldpos;

        //calc velocity
        var vx = p.x - o.x;
        var vy = p.y - o.y;

        //find component of velocity parallel to collision normal
        var dp = (vx * dx + vy * dy);
        var nx = dp * dx;//project velocity onto collision normal

        var ny = dp * dy;//nx,ny is normal velocity

        var tx = vx - nx;//px,py is tangent velocity
        var ty = vy - ny;

        //we only want to apply collision response forces if the object is travelling into, and not out of, the collision
        var b, bx, by, f, fx, fy;

        if (dp < 0)
        {
            //f = FRICTION;
            f = 0.05;
            fx = tx * f;
            fy = ty * f;

            //b = 1 + BOUNCE;//this bounce constant should be elsewhere, i.e inside the object/tile/etc..
            b = 1 + 0.3;//this bounce constant should be elsewhere, i.e inside the object/tile/etc..

            bx = (nx * b);
            by = (ny * b);

        }
        else
        {
            //moving out of collision, do not apply forces
            bx = by = fx = fy = 0;
        }

        p.x += px;//project object out of collision
        p.y += py;

        o.x += px + bx + fx;//apply bounce+friction impulses which alter velocity
        o.y += py + by + fy;

    }

    public CollideCircleVsWorldBounds() {
        var p = this.pos;
        var r = this.radius;
        var XMIN = 0;
        var XMAX = 800;
        var YMIN = 0;
        var YMAX = 600;

        //collide vs. x-bounds
        //test XMIN
        var dx = XMIN - (p.x - r);
        if (0 < dx)
        {
            //object is colliding with XMIN
            this.ReportCollisionVsWorld(dx, 0, 1, 0, null);
        }
        else
        {
            //test XMAX
            dx = (p.x + r) - XMAX;
            if (0 < dx)
            {
                //object is colliding with XMAX
                this.ReportCollisionVsWorld(-dx, 0, -1, 0, null);
            }
        }

        //collide vs. y-bounds
        //test YMIN
        var dy = YMIN - (p.y - r);
        if (0 < dy)
        {
            //object is colliding with YMIN
            this.ReportCollisionVsWorld(0, dy, 0, 1, null);
        }
        else
        {
            //test YMAX
            dy = (p.y + r) - YMAX;
            if (0 < dy)
            {
                //object is colliding with YMAX
                this.ReportCollisionVsWorld(0, -dy, 0, -1, null);
            }
        }
    }

    public render(context:CanvasRenderingContext2D) {
        
        context.beginPath();
        context.strokeStyle = 'rgb(0,255,0)';
        context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        context.stroke();
        context.closePath();

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

    }

    public CollideCircleVsTile(tile) {
        var pos = this.pos;
        var r = this.radius;
        var c = tile;

        var tx = c.pos.x;
        var ty = c.pos.y;
        var txw = c.xw;
        var tyw = c.yw;

        var dx = pos.x - tx;//tile->obj delta
        var px = (txw + r) - Math.abs(dx);//penetration depth in x

        if (0 < px)
        {
            var dy = pos.y - ty;//tile->obj delta
            var py = (tyw + r) - Math.abs(dy);//pen depth in y

            if (0 < py)
            {
                //object may be colliding with tile

                //determine grid/voronoi region of circle center
                this.oH = 0;
                this.oV = 0;
                if (dx < -txw)
                {
                    //circle is on left side of tile
                    this.oH = -1;
                }
                else if (txw < dx)
                {
                    //circle is on right side of tile
                    this.oH = 1;
                }

                if (dy < -tyw)
                {
                    //circle is on top side of tile
                    this.oV = -1;
                }
                else if (tyw < dy)
                {
                    //circle is on bottom side of tile
                    this.oV = 1;
                }

                this.ResolveCircleTile(px, py, this.oH, this.oV, this, c);

            }
        }
    }

    public ResolveCircleTile(x, y, oH, oV, obj, t) {

        if (0 < t.ID)
        {
            return this.circleTileProjections[t.CTYPE](x, y, oH, oV, obj, t);
        }
        else
        {
            console.log("ResolveCircleTile() was called with an empty (or unknown) tile!: ID=" + t.ID + " (" + t.i + "," + t.j + ")");
            return false;
        }
    }

    public ProjCircle_Full(x, y, oH, oV, obj:Circle, t:TileMapCell) {

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
                        return Circle.COL_AXIS;
                    }
                    else
                    {
                        obj.ReportCollisionVsWorld(x, 0, 1, 0, t);
                        return Circle.COL_AXIS;
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
                        return Circle.COL_AXIS;
                    }
                    else
                    {
                        obj.ReportCollisionVsWorld(0, y, 0, 1, t);
                        return Circle.COL_AXIS;
                    }
                }
            }
            else
            {
                //collision with vertical neighbor
                obj.ReportCollisionVsWorld(0, y * oV, 0, oV, t);

                return Circle.COL_AXIS;
            }
        }
        else if (oV == 0)
            {
            //collision with horizontal neighbor
            obj.ReportCollisionVsWorld(x * oH, 0, oH, 0, t);
            return Circle.COL_AXIS;
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

                return Circle.COL_OTHER;
            }
        }

        return Circle.COL_NONE;

    }

    public ProjCircle_45Deg(x, y, oH, oV, obj: Circle, t: TileMapCell) {

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
                        obj.ReportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                        return Circle.COL_AXIS;
                    }
                    else
                    {
                        obj.ReportCollisionVsWorld(sx, sy, t.sx, t.sy, t);

                        return Circle.COL_OTHER;
                    }
                }

            }
            else
            {
                //colliding vertically
                if ((signy * oV) < 0)
                {
                    //colliding with face/edge
                    obj.ReportCollisionVsWorld(0, y * oV, 0, oV, t);

                    return Circle.COL_AXIS;
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

                            obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                            return Circle.COL_OTHER;
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
                            obj.ReportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);

                            return Circle.COL_OTHER;
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
                obj.ReportCollisionVsWorld(x * oH, 0, oH, 0, t);

                return Circle.COL_AXIS;
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

                        obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Circle.COL_OTHER;
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
                        obj.ReportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);

                        return Circle.COL_OTHER;
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
                return Circle.COL_NONE;
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

                    obj.ReportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                    return Circle.COL_OTHER;
                }

            }

        }

        return Circle.COL_NONE;
    }

    public ProjCircle_Concave(x, y, oH, oV, obj: Circle, t: TileMapCell) {

        //if we're colliding diagonally:
        //	-if obj is in the diagonal pointed to by the slope normal: we can't collide, do nothing
        //  -else, collide vs. the appropriate vertex
        //if obj is in this tile: perform collision as for aabb
        //if obj is horiz OR very neighb in direction of slope: collide vs vert
        //if obj is horiz or vert neigh against direction of slope: collide vs. face

        var signx = t.signx;
        var signy = t.signy;
        var lenP;

        if (oH == 0)
        {
            if (oV == 0)
            {
                //colliding with current tile

                var ox = (t.pos.x + (signx * t.xw)) - obj.pos.x;//(ox,oy) is the vector from the circle to 
                var oy = (t.pos.y + (signy * t.yw)) - obj.pos.y;//tile-circle's center

                var twid = t.xw * 2;
                var trad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
                //note that this should be precomputed at compile-time since it's constant

                var len = Math.sqrt(ox * ox + oy * oy);
                var pen = (len + obj.radius) - trad;

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
                        obj.ReportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                        return Circle.COL_AXIS;
                    }
                    else
                    {
                        //we can assume that len >0, because if we're here then
                        //(len + obj.radius) > trad, and since obj.radius <= trad
                        //len MUST be > 0
                        ox /= len;
                        oy /= len;

                        obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Circle.COL_OTHER;
                    }
                }
                else
                {
                    return Circle.COL_NONE;
                }

            }
            else
            {
                //colliding vertically
                if ((signy * oV) < 0)
                {
                    //colliding with face/edge
                    obj.ReportCollisionVsWorld(0, y * oV, 0, oV, t);

                    return Circle.COL_AXIS;
                }
                else
                {
                    //we could only be colliding vs the vertical tip

                    //get diag vertex position
                    var vx = t.pos.x - (signx * t.xw);
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
                            //project out vertically
                            dx = 0;
                            dy = oV;
                        }
                        else
                        {
                            dx /= len;
                            dy /= len;
                        }

                        obj.ReportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                        return Circle.COL_OTHER;
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
                obj.ReportCollisionVsWorld(x * oH, 0, oH, 0, t);

                return Circle.COL_AXIS;
            }
            else
            {
                //we could only be colliding vs the horizontal tip

                //get diag vertex position
                var vx = t.pos.x + (oH * t.xw);
                var vy = t.pos.y - (signy * t.yw);

                var dx = obj.pos.x - vx;//calc vert->circle vector		
                var dy = obj.pos.y - vy;

                var len = Math.sqrt(dx * dx + dy * dy);
                var pen = obj.radius - len;
                if (0 < pen)
                {
                    //vertex is in the circle; project outward
                    if (len == 0)
                    {
                        //project out horizontally
                        dx = oH;
                        dy = 0;
                    }
                    else
                    {
                        dx /= len;
                        dy /= len;
                    }

                    obj.ReportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                    return Circle.COL_OTHER;
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
                return Circle.COL_NONE;
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

                    obj.ReportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                    return Circle.COL_OTHER;
                }

            }

        }

        return Circle.COL_NONE;

    }

    public ProjCircle_Convex(x, y, oH, oV, obj: Circle, t: TileMapCell) {
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
                        obj.ReportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                        return Circle.COL_AXIS;
                    }
                    else
                    {
                        //note: len should NEVER be == 0, because if it is, 
                        //projeciton by an axis shoudl always be shorter, and we should
                        //never arrive here
                        ox /= len;
                        oy /= len;

                        obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Circle.COL_OTHER;

                    }
                }
            }
            else
            {
                //colliding vertically
                if ((signy * oV) < 0)
                {
                    //colliding with face/edge
                    obj.ReportCollisionVsWorld(0, y * oV, 0, oV, t);

                    return Circle.COL_AXIS;
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

                        obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                        return Circle.COL_OTHER;
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
                obj.ReportCollisionVsWorld(x * oH, 0, oH, 0, t);

                return Circle.COL_AXIS;
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

                    obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                    return Circle.COL_OTHER;
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

                    obj.ReportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                    return Circle.COL_OTHER;
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

                    obj.ReportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);

                    return Circle.COL_OTHER;
                }

            }

        }

        return Circle.COL_NONE;

    }

}



(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {

        myGame.loader.addImageFile('atari1', 'assets/sprites/atari130xe.png');
        myGame.loader.load();

    }

    var cells;
    var physics: NPhysics;
    var b: Circle;
    var c: Circle;
    var t: TileMapCell;

    function create() {

        this.physics = new NPhysics();
        this.c = new Circle(200, 100, 25);
        this.b = new AABB(200, 200, 50, 50);

        //  pos is center, not upper-left
        this.cells = [];

        var tid;

        for (var i = 0; i < 10; i++)
        {
            if (i % 2 == 0)
            {
                console.log('pn');
                tid = TileMapCell.TID_CONCAVEpn;
            }
            else
            {
                console.log('nn');
                tid = TileMapCell.TID_CONCAVEnn;
            }

            //this.cells.push(new TileMapCell(100 + (i * 100), 500, 50, 50).SetState(tid));
            this.cells.push(new TileMapCell(100 + (i * 100), 500, 50, 50).SetState(TileMapCell.TID_FULL));
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

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            fx -= 0.2;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            fx += 0.2;
        }

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            fy -= 0.2 + 0.2;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            fy += 0.2;
        }

        //  update circle
        var p = this.c.pos;
        var o = this.c.oldpos;
        var vx = p.x - o.x;
        var vy = p.y - o.y;
        var newx = Math.min(20, Math.max(-20, vx+fx));
        var newy = Math.min(20, Math.max(-20, vy+fy));
        p.x = o.x + newx;
        p.y = o.y + newy;
        this.c.IntegrateVerlet();

        //  update box
        var p = this.b.pos;
        var o = this.b.oldpos;
        var vx = p.x - o.x;
        var vy = p.y - o.y;
        var newx = Math.min(20, Math.max(-20, vx+fx));
        var newy = Math.min(20, Math.max(-20, vy+fy));
        p.x = o.x + newx;
        p.y = o.y + newy;
        this.b.IntegrateVerlet();


        for (var i = 0; i < this.cells.length; i++)
        {
            this.c.CollideCircleVsTile(this.cells[i]);
            //this.cells[i].render(myGame.stage.context);
        }

        this.c.CollideCircleVsWorldBounds();
        this.b.CollideAABBVsWorldBounds();

    }

    function render() {

        this.c.render(myGame.stage.context);
        this.b.render(myGame.stage.context);

        for (var i = 0; i < this.cells.length; i++)
        {
            this.cells[i].render(myGame.stage.context);
        }

    }

})();
