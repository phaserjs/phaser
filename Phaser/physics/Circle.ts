/// <reference path="../_definitions.ts" />

/**
* Phaser - Physics - Circle
*/

module Phaser.Physics {

    export class Circle {

        constructor(game: Phaser.Game, x: number, y: number, radius:number) {

            this.game = game;

            this.pos = new Phaser.Vec2(x, y);
            this.oldpos = new Phaser.Vec2(x, y);
            this.radius = radius;

            this.circleTileProjections = {};
            this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_22DEGs] = Phaser.Physics.Projection.Circle22Deg.CollideS;
            this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_22DEGb] = Phaser.Physics.Projection.Circle22Deg.CollideB;
            this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_45DEG] = Phaser.Physics.Projection.Circle45Deg.Collide;
            this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_67DEGs] = Phaser.Physics.Projection.Circle67Deg.CollideS;
            this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_67DEGb] = Phaser.Physics.Projection.Circle67Deg.CollideB;
            this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONCAVE] = Phaser.Physics.Projection.CircleConcave.Collide;
            this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONVEX] = Phaser.Physics.Projection.CircleConvex.Collide;
            this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_FULL] = Phaser.Physics.Projection.CircleFull.Collide;
            this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_HALF] = Phaser.Physics.Projection.CircleHalf.Collide;

        }

        public game: Phaser.Game;

        public static COL_NONE = 0;
        public static COL_AXIS = 1;
        public static COL_OTHER = 2;

        public type: number = 1;
        public pos: Phaser.Vec2;
        public oldpos: Phaser.Vec2;
        public radius: number;
        public oH: number;  //  horizontal collision 
        public oV: number;  //  vertical collision 

        private circleTileProjections;

        public integrateVerlet() {

            var d = 1;      //  drag
            var g = 0.2;    //  gravity

            var p = this.pos;
            var o = this.oldpos;
            var px;
            var py;

            var ox = o.x;
            var oy = o.y;
            //o = oldposition
            o.x = px = p.x;		//get vector values
            o.y = py = p.y;		//p = position  

            //integrate	
            p.x += (d * px) - (d * ox);
            p.y += (d * py) - (d * oy) + g;

        }

        //  px projection vector
        //  dx surface normal
        public reportCollisionVsWorld(px: number, py: number, dx: number, dy: number, obj: Phaser.Physics.TileMapCell = null) {

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
                b = 1 + 0.9;//this bounce constant should be elsewhere, i.e inside the object/tile/etc..

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

        public collideCircleVsWorldBounds() {

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
                this.reportCollisionVsWorld(dx, 0, 1, 0, null);
            }
            else
            {
                //test XMAX
                dx = (p.x + r) - XMAX;
                if (0 < dx)
                {
                    //object is colliding with XMAX
                    this.reportCollisionVsWorld(-dx, 0, -1, 0, null);
                }
            }

            //collide vs. y-bounds
            //test YMIN
            var dy = YMIN - (p.y - r);

            if (0 < dy)
            {
                //object is colliding with YMIN
                this.reportCollisionVsWorld(0, dy, 0, 1, null);
            }
            else
            {
                //test YMAX
                dy = (p.y + r) - YMAX;
                if (0 < dy)
                {
                    //object is colliding with YMAX
                    this.reportCollisionVsWorld(0, -dy, 0, -1, null);
                }
            }
        }

        public render(context: CanvasRenderingContext2D) {

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

        public collideCircleVsTile(tile) {

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

                    this.resolveCircleTile(px, py, this.oH, this.oV, this, c);

                }
            }
        }

        public resolveCircleTile(x, y, oH, oV, obj, t) {

            if (0 < t.ID)
            {
                return this.circleTileProjections[t.CTYPE](x, y, oH, oV, obj, t);
            }
            else
            {
                console.log("resolveCircleTile() was called with an empty (or unknown) tile!: ID=" + t.ID + " (" + t.i + "," + t.j + ")");
                return false;
            }
        }

    }

}