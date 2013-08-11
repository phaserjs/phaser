/// <reference path="../_definitions.ts" />

/**
* Phaser - Physics - AABB
*/

module Phaser.Physics {

    export class AABB {

        constructor(game: Phaser.Game, x: number, y: number, xw: number, yw: number) {

            this.game = game;

            this.pos = new Phaser.Vec2(x, y);
            this.oldpos = new Phaser.Vec2(x, y);

            this.xw = Math.abs(xw);
            this.yw = Math.abs(yw);

            this.aabbTileProjections = {};
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_FULL] = Phaser.Physics.Projection.AABBFull.Collide;
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONCAVE] = Phaser.Physics.Projection.AABBConcave.Collide;
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONVEX] = Phaser.Physics.Projection.AABBConvex.Collide;

        }

        public game: Phaser.Game;

        public static COL_NONE = 0;
        public static COL_AXIS = 1;
        public static COL_OTHER = 2;

        public type: number = 0;
        public pos: Phaser.Vec2;
        public oldpos: Phaser.Vec2;
        public xw: number;
        public yw: number;
        public oH: number;
        public oV: number;

        private aabbTileProjections;

        public IntegrateVerlet() {

            var d = 1;      //  global drag
            var g = 0.2;    //  global gravity

            var p = this.pos;
            var o = this.oldpos;
            var px;
            var py;

            //o = oldposition
            var ox = o.x;
            var oy = o.y;
            o.x = px = p.x;		//get vector values
            o.y = py = p.y;		//p = position  

            //integrate	
            p.x += (d * px) - (d * ox);
            p.y += (d * py) - (d * oy) + g;

        }

        public ReportCollisionVsWorld(px: number, py: number, dx: number, dy: number, obj: TileMapCell) {

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


        public CollideAABBVsTile(tile:Phaser.Physics.TileMapCell) {

            var pos = this.pos;
            var c = tile;

            var tx = c.pos.x;
            var ty = c.pos.y;
            var txw = c.xw;
            var tyw = c.yw;

            var dx = pos.x - tx;//tile->obj delta
            var px = (txw + this.xw) - Math.abs(dx);//penetration depth in x

            if (0 < px)
            {
                var dy = pos.y - ty;//tile->obj delta
                var py = (tyw + this.yw) - Math.abs(dy);//pen depth in y

                if (0 < py)
                {
                    //object may be colliding with tile; call tile-specific collision function

                    //calculate projection vectors
                    if (px < py)
                    {
                        //project in x
                        if (dx < 0)
                        {
                            //project to the left
                            px *= -1;
                            py = 0;
                        }
                        else
                        {
                            //proj to right
                            py = 0;
                        }
                    }
                    else
                    {
                        //project in y
                        if (dy < 0)
                        {
                            //project up
                            px = 0;
                            py *= -1;
                        }
                        else
                        {
                            //project down
                            px = 0;
                        }
                    }

                    this.ResolveBoxTile(px, py, this, c);

                }
            }
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

        public render(context: CanvasRenderingContext2D) {

            context.beginPath();
            context.strokeStyle = 'rgb(0,255,0)';
            context.strokeRect(this.pos.x - this.xw, this.pos.y - this.yw, this.xw * 2, this.yw * 2);
            context.stroke();
            context.closePath();

            context.fillStyle = 'rgb(0,255,0)';
            context.fillRect(this.pos.x, this.pos.y, 2, 2);

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

    }

}