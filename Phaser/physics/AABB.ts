/// <reference path="../_definitions.ts" />

/**
* Phaser - Physics - AABB
*/

module Phaser.Physics {

    export class AABB {

        constructor(game: Phaser.Game, x: number, y: number, width: number, height: number) {

            this.game = game;

            this.pos = new Phaser.Vec2(x, y);
            this.oldpos = new Phaser.Vec2(x, y);

            this.width = Math.abs(width);
            this.height = Math.abs(height);

            this.velocity = new Phaser.Vec2;
            this.acceleration = new Phaser.Vec2;
            this.bounce = new Phaser.Vec2(0, 0);

            //this.drag = new Phaser.Vec2(1, 1);
            //this.gravity = new Phaser.Vec2(0, 0.2);

            this.drag = new Phaser.Vec2(0, 0);
            this.gravity = new Phaser.Vec2(0, 2);

            this.maxVelocity = new Phaser.Vec2(1000, 1000);

            this.aabbTileProjections = {};
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_22DEGs] = Phaser.Physics.Projection.AABB22Deg.CollideS;
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_22DEGb] = Phaser.Physics.Projection.AABB22Deg.CollideB;
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_45DEG] = Phaser.Physics.Projection.AABB45Deg.Collide;
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_67DEGs] = Phaser.Physics.Projection.AABB67Deg.CollideS;
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_67DEGb] = Phaser.Physics.Projection.AABB67Deg.CollideB;
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONCAVE] = Phaser.Physics.Projection.AABBConcave.Collide;
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONVEX] = Phaser.Physics.Projection.AABBConvex.Collide;
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_FULL] = Phaser.Physics.Projection.AABBFull.Collide;
            this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_HALF] = Phaser.Physics.Projection.AABBHalf.Collide;

        }

        public game: Phaser.Game;

        public velocity: Phaser.Vec2;
        public acceleration: Phaser.Vec2;
        public drag: Phaser.Vec2;
        public gravity: Phaser.Vec2;
        public bounce: Phaser.Vec2;
        public maxVelocity: Phaser.Vec2;

        public static COL_NONE = 0;
        public static COL_AXIS = 1;
        public static COL_OTHER = 2;

        public type: number = 0;
        public pos: Phaser.Vec2;
        public oldpos: Phaser.Vec2;
        public width: number;
        public height: number;
        public oH: number;
        public oV: number;

        public _vx: number = 0;
        public _vy: number = 0;
        public _deltaX: number = 0;
        public _deltaY: number = 0;

        private aabbTileProjections;

        public update() {

            //  Add 'go to sleep' option

            this.oldpos.x = this.pos.x;		//get vector values
            this.oldpos.y = this.pos.y;		//p = position  

            this._vx = (this.game.physics.computeVelocity(this.velocity.x, this.gravity.x, this.acceleration.x, this.drag.x, this.maxVelocity.x) - this.velocity.x) / 2;
            this.velocity.x += this._vx;
            //this.pos.x += (this.velocity.x * this.game.time.physicsElapsed) + this.gravity.x;
            //this.pos.x += (this.velocity.x * this.game.time.physicsElapsed);
            this._deltaX = this.velocity.x * this.game.time.physicsElapsed;
            //body.aabb.pos.x += this._delta;

            this._vy = (this.game.physics.computeVelocity(this.velocity.y, this.gravity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y) - this.velocity.y) / 2;
            //this._vy = this.game.physics.computeVelocity(this.velocity.y, this.gravity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y);
            this.velocity.y += this._vy;
            //this.pos.y += (this.velocity.y * this.game.time.physicsElapsed) + this.gravity.y;
            //this.pos.y += (this.velocity.y * this.game.time.physicsElapsed);
            this._deltaY = this.velocity.y * this.game.time.physicsElapsed;

            this.pos.x += this._deltaX;
            this.pos.y += this._deltaY;

            //this.integrateVerlet();

            //var ox = this.oldpos.x;
            //var oy = this.oldpos.y;

        }

        public FFupdate() {

            this.oldpos.x = this.pos.x;		//get vector values
            this.oldpos.y = this.pos.y;		//p = position  

            if (this.acceleration.x != 0)
            {
                this.velocity.x += (this.acceleration.x / 1000 * this.game.time.delta);
            }

            if (this.acceleration.y != 0)
            {
                this.velocity.y += (this.acceleration.y / 1000 * this.game.time.delta);
            }

            this._vx = ((this.velocity.x / 1000) * this.game.time.delta);
            this._vy = ((this.velocity.y / 1000) * this.game.time.delta);

            if (this._vx != 0)
            {
                if (this.drag.x != 0)
                {
                    this._vx * this.drag.x;
                }

                if (this.gravity.x != 0)
                {
                    this._vx * this.gravity.x;
                }

                if (this.velocity.x > this.maxVelocity.x)
                {
                    this.velocity.x = this.maxVelocity.x;
                }
                else if (this.velocity.x < -this.maxVelocity.x)
                {
                    this.velocity.x = -this.maxVelocity.x;
                }
            }

            if (this._vy != 0)
            {
                if (this.drag.y != 0)
                {
                    this._vy * this.drag.y;
                }

                if (this.gravity.y != 0)
                {
                    this._vy * this.gravity.y;
                }

                if (this.velocity.y > this.maxVelocity.y)
                {
                    this.velocity.y = this.maxVelocity.y;
                }
                else if (this.velocity.y < -this.maxVelocity.y)
                {
                    this.velocity.y = -this.maxVelocity.y;
                }
            }

            this.pos.x += this._vx;
            this.pos.y += this._vy;

            //this._vx = (this.game.physics.computeVelocity(this.velocity.x, this.gravity.x, this.acceleration.x, this.fdrag.x, this.maxVelocity.x) - this.velocity.x) / 2;
            //this.velocity.x += this._vx;
            //this.pos.x += (this.velocity.x * this.game.time.physicsElapsed) + this.gravity.x;

            //this._vy = (this.game.physics.computeVelocity(this.velocity.y, this.gravity.y, this.acceleration.y, this.fdrag.y, this.maxVelocity.y) - this.velocity.y) / 2;
            //this.velocity.y += this._vy;
            //this.pos.y += (this.velocity.y * this.game.time.physicsElapsed) + this.gravity.y;

            //this.integrateVerlet();

            //var ox = this.oldpos.x;
            //var oy = this.oldpos.y;

            //this.oldpos.x = this.pos.x;		//get vector values
            //this.oldpos.y = this.pos.y;		//p = position  

            //integrate	
            //this.pos.x += (this.drag.x * this.pos.x) - (this.drag.x * ox) + this.gravity.x;
            //this.pos.y += (this.drag.y * this.pos.y) - (this.drag.y * oy) + this.gravity.y;

            //this._vx = (this.velocity.x / 1000 * this.game.time.delta);
            //this._vy = (this.velocity.y / 1000 * this.game.time.delta);
            //this._vx = 0.2;
            //this._vy = 0.2;

            //this.pos.x = this.oldpos.x + Math.min(20, Math.max(-20, this.pos.x - this.oldpos.x + this._vx));
            //this.pos.y = this.oldpos.y + Math.min(20, Math.max(-20, this.pos.y - this.oldpos.y + this._vy));

            //this.integrateVerlet();

        }

        public integrateVerlet() {

            var px = this.pos.x;
            var py = this.pos.y;

            var ox = this.oldpos.x;
            var oy = this.oldpos.y;

            this.oldpos.x = this.pos.x;		//get vector values
            this.oldpos.y = this.pos.y;		//p = position  

            //integrate	
            this.pos.x += (this.drag.x * px) - (this.drag.x * ox) + this.gravity.x;
            this.pos.y += (this.drag.y * py) - (this.drag.y * oy) + this.gravity.y;

        }

        public reportCollisionVsWorld(px: number, py: number, dx: number, dy: number, obj: TileMapCell = null) {

            //calc velocity (original way)
            //this._vx = this.pos.x - this.oldpos.x;
            //this._vy = this.pos.y - this.oldpos.y;
            //var vx = this.pos.x - this.oldpos.x;
            //var vy = this.pos.y - this.oldpos.y;

            //find component of velocity parallel to collision normal
            //var dp = (vx * dx + vy * dy);
            //var nx = dp * dx;//project velocity onto collision normal
            //var ny = dp * dy;//nx,ny is normal velocity

            //var tx = vx - nx;//px,py is tangent velocity
            //var ty = vy - ny;

            var dp = (this._vx * dx + this._vy * dy);
            var nx = dp * dx;//project velocity onto collision normal
            var ny = dp * dy;//nx,ny is normal velocity

            var tx = this._vx - nx;//px,py is tangent velocity
            var ty = this._vy - ny;

            //console.log('nxy', nx, ny);
            //console.log('nxy', nx, ny);
            //console.log('txy', tx, ty);

            this.pos.x += px;   //project object out of collision
            this.pos.y += py;

            //this.oldpos.x += px;
            //this.oldpos.y += py;
            //this.pos.x += px;
            //this.pos.y += py;

            //this.velocity.x += nx;
            //this.velocity.y += ny;

            //we only want to apply collision response forces if the object is travelling into, and not out of, the collision
            if (dp < 0)
            //if (1 < 0)
            {
                //  moving into collision, apply forces
                //var b = 1 + 0.5;//this bounce constant should be elsewhere, i.e inside the object/tile/etc..
                //var b = 0.5;//this bounce constant should be elsewhere, i.e inside the object/tile/etc..
                //var f = 0.05; // friction
                //var fx = tx * f;
                //var fy = ty * f;

                //this.oldpos.x += (nx * b) + fx;//apply bounce+friction impulses which alter velocity
                //this.oldpos.y += (ny * b) + fy;
                this.velocity.x += nx;
                this.velocity.y += ny;

                if (dx !== 0)
                {
//                    this.velocity.x *= -1 * this.bounce.x;
                }

                if (dy !== 0)
                {
  //                  this.velocity.y *= -1 * this.bounce.y;
                }
            }

        }

        public collideAABBVsTile(tile: Phaser.Physics.TileMapCell) {

            var pos = this.pos;
            var c = tile;

            var tx = c.pos.x;
            var ty = c.pos.y;
            var txw = c.xw;
            var tyw = c.yw;

            var dx = pos.x - tx;//tile->obj delta
            var px = (txw + this.width) - Math.abs(dx);//penetration depth in x

            if (0 < px)
            {
                var dy = pos.y - ty;//tile->obj delta
                var py = (tyw + this.height) - Math.abs(dy);//pen depth in y

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

                    this.resolveBoxTile(px, py, this, c);

                }
            }
        }

        public collideAABBVsWorldBounds() {

            var p = this.pos;
            var xw = this.width;
            var yw = this.height;
            var XMIN = 0;
            var XMAX = 800;
            var YMIN = 0;
            var YMAX = 600;

            //collide vs. x-bounds
            //test XMIN left side
            var dx = XMIN - (p.x - xw);
            if (0 < dx)
            {
                //object is colliding with XMIN
                this.reportCollisionVsWorld(dx, 0, 1, 0, null);
            }
            else
            {
                //test XMAX right side
                dx = (p.x + xw) - XMAX;
                if (0 < dx)
                {
                    //object is colliding with XMAX
                    this.reportCollisionVsWorld(-dx, 0, -1, 0, null);
                }
            }

            //collide vs. y-bounds
            //test YMIN top
            var dy = YMIN - (p.y - yw);
            if (0 < dy)
            {
                //object is colliding with YMIN
                this.reportCollisionVsWorld(0, dy, 0, 1, null);
            }
            else
            {
                //test YMAX bottom
                dy = (p.y + yw) - YMAX;
                if (0 < dy)
                {
                    //object is colliding with YMAX
                    this.reportCollisionVsWorld(0, -dy, 0, -1, null);
                }
            }
        }

        public resolveBoxTile(x, y, box, t) {

            if (0 < t.ID)
            {
                return this.aabbTileProjections[t.CTYPE](x, y, box, t);
            }
            else
            {
                //trace("resolveBoxTile() was called with an empty (or unknown) tile!: ID=" + t.ID + " ("+ t.i + "," + t.j + ")");
                return false;
            }
        }

        public render(context: CanvasRenderingContext2D) {

            context.beginPath();
            context.strokeStyle = 'rgb(0,255,0)';
            context.strokeRect(this.pos.x - this.width, this.pos.y - this.height, this.width * 2, this.height * 2);
            context.stroke();
            context.closePath();

            context.fillStyle = 'rgb(0,255,0)';
            context.fillRect(this.pos.x, this.pos.y, 2, 2);

        }

    }

}