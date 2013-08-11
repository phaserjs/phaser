var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Physics - TileMapCell
    */
    (function (Physics) {
        var TileMapCell = (function () {
            function TileMapCell(game, x, y, xw, yw) {
                this.game = game;
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
        Physics.TileMapCell = TileMapCell;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
