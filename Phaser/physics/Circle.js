var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Physics - Circle
    */
    (function (Physics) {
        var Circle = (function () {
            function Circle(game, x, y, radius) {
                this.type = 1;
                this.game = game;

                this.pos = new Phaser.Vec2(x, y);
                this.oldpos = new Phaser.Vec2(x, y);
                this.radius = radius;

                this.circleTileProjections = {};
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_FULL] = Phaser.Physics.Projection.CircleFull.Collide;
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_45DEG] = Phaser.Physics.Projection.Circle45Deg.Collide;
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONCAVE] = Phaser.Physics.Projection.CircleConcave.Collide;
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONVEX] = Phaser.Physics.Projection.CircleConvex.Collide;
            }
            Circle.prototype.integrateVerlet = function () {
                var d = 1;
                var g = 0.2;

                var p = this.pos;
                var o = this.oldpos;
                var px;
                var py;

                var ox = o.x;
                var oy = o.y;

                //o = oldposition
                o.x = px = p.x;
                o.y = py = p.y;

                //integrate
                p.x += (d * px) - (d * ox);
                p.y += (d * py) - (d * oy) + g;
            };

            Circle.prototype.reportCollisionVsWorld = function (px, py, dx, dy, obj) {
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

            Circle.prototype.collideCircleVsWorldBounds = function () {
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
                    this.reportCollisionVsWorld(dx, 0, 1, 0, null);
                } else {
                    //test XMAX
                    dx = (p.x + r) - XMAX;
                    if (0 < dx) {
                        //object is colliding with XMAX
                        this.reportCollisionVsWorld(-dx, 0, -1, 0, null);
                    }
                }

                //collide vs. y-bounds
                //test YMIN
                var dy = YMIN - (p.y - r);

                if (0 < dy) {
                    //object is colliding with YMIN
                    this.reportCollisionVsWorld(0, dy, 0, 1, null);
                } else {
                    //test YMAX
                    dy = (p.y + r) - YMAX;
                    if (0 < dy) {
                        //object is colliding with YMAX
                        this.reportCollisionVsWorld(0, -dy, 0, -1, null);
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

            Circle.prototype.collideCircleVsTile = function (tile) {
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

                        this.resolveCircleTile(px, py, this.oH, this.oV, this, c);
                    }
                }
            };

            Circle.prototype.resolveCircleTile = function (x, y, oH, oV, obj, t) {
                if (0 < t.ID) {
                    return this.circleTileProjections[t.CTYPE](x, y, oH, oV, obj, t);
                } else {
                    console.log("resolveCircleTile() was called with an empty (or unknown) tile!: ID=" + t.ID + " (" + t.i + "," + t.j + ")");
                    return false;
                }
            };
            Circle.COL_NONE = 0;
            Circle.COL_AXIS = 1;
            Circle.COL_OTHER = 2;
            return Circle;
        })();
        Physics.Circle = Circle;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
