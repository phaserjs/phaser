/// <reference path="../_definitions.ts" />

/**
* Phaser - Physics - TileMapCell
*/

module Phaser.Physics {

    export class TileMapCell {

        constructor(game: Phaser.Game, x: number, y: number, xw: number, yw: number) {

            this.game = game;
            this.ID = TileMapCell.TID_EMPTY; //all tiles start empty
            this.CTYPE = TileMapCell.CTYPE_EMPTY;

            this.pos = new Phaser.Vec2(x, y);	//setup collision properties
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

        public game: Phaser.Game;

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
        pos: Phaser.Vec2;
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

}