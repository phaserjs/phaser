/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Ninja Physics AABB constructor.
*
* @class Phaser.Physics.Ninja.AABB
* @classdesc Arcade Physics Constructor
* @constructor
* @param {Phaser.Game} game reference to the current game instance.
*/
Phaser.Physics.Ninja.AABB = function (system, x, y, width, height) {
    
    this.system = system;
    this.pos = new Phaser.Point(x, y);
    this.oldpos = new Phaser.Point(x, y);

    this.xw = Math.abs(width / 2);
    this.yw = Math.abs(height / 2);

    this.width = width;
    this.height = height;

    this.oH = 0;
    this.oV = 0;

    //  Setting drag to 0 and friction to 0 means you get a normalised speed (px psec)
    this.drag = 1;
    this.friction = 0.05;
    this.gravityScale = 1;
    this.bounce = 0.3;
    this.velocity = new Phaser.Point();

    //  temp collision values
    this.px = 0;
    this.py = 0;

    //  collision mappings
    this.aabbTileProjections = {};
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_FULL] = this.projAABB_Full;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_45DEG] = this.projAABB_45Deg;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_CONCAVE] = this.projAABB_Concave;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_CONVEX] = this.projAABB_Convex;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_22DEGs] = this.projAABB_22DegS;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_22DEGb] = this.projAABB_22DegB;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_67DEGs] = this.projAABB_67DegS;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_67DEGb] = this.projAABB_67DegB;
    this.aabbTileProjections[Phaser.Physics.Ninja.Tile.TYPE_HALF] = this.projAABB_Half;

};

Phaser.Physics.Ninja.AABB.prototype.constructor = Phaser.Physics.Ninja.AABB;

Phaser.Physics.Ninja.AABB.COL_NONE = 0;
Phaser.Physics.Ninja.AABB.COL_AXIS = 1;
Phaser.Physics.Ninja.AABB.COL_OTHER = 2;

Phaser.Physics.Ninja.AABB.prototype = {

    /**
    * Updates this AABBs position.
    *
    * @method Phaser.Physics.Ninja.AABB#integrate
    */
    integrate: function () {

        var px = this.pos.x;
        var py = this.pos.y;

        //  integrate
        this.pos.x += (this.drag * this.pos.x) - (this.drag * this.oldpos.x);
        this.pos.y += (this.drag * this.pos.y) - (this.drag * this.oldpos.y) + (this.system.gravity * this.gravityScale);

        //  store
        this.velocity.set(this.pos.x - px, this.pos.y - py);
        this.oldpos.set(px, py);

    },

    /**
    * Process a world collision and apply the resulting forces.
    *
    * @method Phaser.Physics.Ninja.AABB#reportCollisionVsWorld
    * @param {number} px - The tangent velocity
    * @param {number} py - The tangent velocity
    * @param {number} dx - Collision normal
    * @param {number} dy - Collision normal
    * @param {number} obj - Object this AABB collided with
    */
    reportCollisionVsWorld: function (px, py, dx, dy, obj) {

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
            fx = tx * this.friction;
            fy = ty * this.friction;

            b = 1 + this.bounce;

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

    },

    /**
    * Collides this AABB against a Tile.
    *
    * @method Phaser.Physics.Ninja.AABB#collideAABBVsTile
    * @param {Phaser.Physics.Ninja.Tile} tile - The Tile to collide against.
    */
    collideAABBVsTile: function (tile) {

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

                return this.resolveTile(px, py, this, c);
            }
        }

        return false;

    },

    /**
    * Collides this AABB against the world bounds.
    *
    * @method Phaser.Physics.Ninja.AABB#collideWorldBounds
    */
    collideWorldBounds: function () {

        var p = this.pos;
        var xw = this.xw;
        var yw = this.yw;

        var XMIN = this.system.bounds.x;
        var XMAX = this.system.bounds.width;
        var YMIN = this.system.bounds.y;
        var YMAX = this.system.bounds.height;

        var dx = this.system.bounds.x - (this.pos.x - this.xw);

        if (0 < dx)
        {
            this.reportCollisionVsWorld(dx, 0, 1, 0, null);
        }
        else
        {
            dx = (this.pos.x + this.xw) - this.system.bounds.width;

            if (0 < dx)
            {
                this.reportCollisionVsWorld(-dx, 0, -1, 0, null);
            }
        }

        var dy = this.system.bounds.y - (this.pos.y - this.yw);

        if (0 < dy)
        {
            this.reportCollisionVsWorld(0, dy, 0, 1, null);
        }
        else
        {
            dy = (this.pos.y + this.yw) - this.system.bounds.height;

            if (0 < dy)
            {
                this.reportCollisionVsWorld(0, -dy, 0, -1, null);
            }
        }

    },

    /**
    * Renders this AABB to the context.
    *
    * @method Phaser.Physics.Ninja.AABB#render
    */
    render: function (context) {
        
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

    },

    /**
    * Resolves tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#resolveTile
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} body - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} tile - The Tile involved in the collision.
    * @return {boolean} True if the collision was processed, otherwise false.
    */
    resolveTile: function (x, y, body, tile) {

        if (0 < tile.id)
        {
            return this.aabbTileProjections[tile.type](x, y, body, tile);
        }
        else
        {
            console.warn("Ninja.AABB.resolveTile was called with an empty (or unknown) tile!: id=" + tile.id + ")");
            return false;
        }

    },

    /**
    * Resolves Full tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_Full
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_Full: function (x, y, obj, t) {

        var l = Math.sqrt(x * x + y * y);
        obj.reportCollisionVsWorld(x, y, x / l, y / l, t);

        return Phaser.Physics.Ninja.AABB.COL_AXIS;

    },

    /**
    * Resolves Half tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_Half
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_Half: function (x, y, obj, t) {

        //signx or signy must be 0; the other must be -1 or 1
        //calculate the projection vector for the half-edge, and then 
        //(if collision is occuring) pick the minimum
        
        var sx = t.signx;
        var sy = t.signy;
            
        var ox = (obj.pos.x - (sx*obj.xw)) - t.pos.x;//this gives is the coordinates of the innermost
        var oy = (obj.pos.y - (sy*obj.yw)) - t.pos.y;//point on the AABB, relative to the tile center

        //we perform operations analogous to the 45deg tile, except we're using 
        //an axis-aligned slope instead of an angled one..

        //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
        //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
        var dp = (ox*sx) + (oy*sy);

        if (dp < 0)
        {
            //collision; project delta onto slope and use this to displace the object
            sx *= -dp;//(sx,sy) is now the projection vector
            sy *= -dp;      
                
            var lenN = Math.sqrt(sx*sx + sy*sy);
            var lenP = Math.sqrt(x*x + y*y);
            
            if (lenP < lenN)
            {
                //project along axis; note that we're assuming that this tile is horizontal OR vertical
                //relative to the AABB's current tile, and not diagonal OR the current tile.
                obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                return Phaser.Physics.Ninja.AABB.COL_AXIS;
            }
            else
            {       
                //note that we could use -= instead of -dp
                obj.reportCollisionVsWorld(sx,sy,t.signx, t.signy, t);
                    
                return Phaser.Physics.Ninja.AABB.COL_OTHER;
            }
        }
            
        return Phaser.Physics.Ninja.AABB.COL_NONE;

    },

    /**
    * Resolves 45 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_45Deg
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_45Deg: function (x, y, obj, t) {

        var signx = t.signx;
        var signy = t.signy;

        var ox = (obj.pos.x - (signx*obj.xw)) - t.pos.x;//this gives is the coordinates of the innermost
        var oy = (obj.pos.y - (signy*obj.yw)) - t.pos.y;//point on the AABB, relative to the tile center

        var sx = t.sx;
        var sy = t.sy;
            
        //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
        //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
        var dp = (ox*sx) + (oy*sy);

        if (dp < 0)
        {
            //collision; project delta onto slope and use this to displace the object
            sx *= -dp;//(sx,sy) is now the projection vector
            sy *= -dp;      
            
            var lenN = Math.sqrt(sx*sx + sy*sy);
            var lenP = Math.sqrt(x*x + y*y);

            if (lenP < lenN)
            {
                //project along axis
                obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                return Phaser.Physics.Ninja.AABB.COL_AXIS;
            }
            else
            {
                //project along slope
                obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy);

                return Phaser.Physics.Ninja.AABB.COL_OTHER;
            }
        }
        
        return Phaser.Physics.Ninja.AABB.COL_NONE;
    },

    /**
    * Resolves 22 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_22DegS
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_22DegS: function (x, y, obj, t) {
        
        var signx = t.signx;
        var signy = t.signy;

        //first we need to check to make sure we're colliding with the slope at all
        var py = obj.pos.y - (signy*obj.yw);
        var penY = t.pos.y - py;//this is the vector from the innermost point on the box to the highest point on
                                //the tile; if it is positive, this means the box is above the tile and
                                //no collision is occuring
        if (0 < (penY*signy))
        {
            var ox = (obj.pos.x - (signx*obj.xw)) - (t.pos.x + (signx*t.xw));//this gives is the coordinates of the innermost
            var oy = (obj.pos.y - (signy*obj.yw)) - (t.pos.y - (signy*t.yw));//point on the AABB, relative to a point on the slope
                                                        
            var sx = t.sx;//get slope unit normal
            var sy = t.sy;
            
            //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
            //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
            var dp = (ox*sx) + (oy*sy);

            if (dp < 0)
            {
                //collision; project delta onto slope and use this to displace the object
                sx *= -dp;//(sx,sy) is now the projection vector
                sy *= -dp;      

                var lenN = Math.sqrt(sx*sx + sy*sy);
                var lenP = Math.sqrt(x*x + y*y);
                
                var aY = Math.abs(penY);

                if (lenP < lenN)
                {
                    if (aY < lenP)
                    {
                        obj.reportCollisionVsWorld(0, penY, 0, penY/aY, t);
                        
                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);
                        
                        return Phaser.Physics.Ninja.AABB.COL_AXIS;
                    }
                }
                else
                {
                    if (aY < lenN)
                    {
                        obj.reportCollisionVsWorld(0, penY, 0, penY/aY, t);
                        
                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy,t);

                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                }
            }
        }
        
        //if we've reached this point, no collision has occured
        return Phaser.Physics.Ninja.AABB.COL_NONE;
    },

    /**
    * Resolves 22 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_22DegB
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_22DegB: function (x, y, obj, t) {

        var signx = t.signx;
        var signy = t.signy;

        var ox = (obj.pos.x - (signx*obj.xw)) - (t.pos.x - (signx*t.xw));//this gives is the coordinates of the innermost
        var oy = (obj.pos.y - (signy*obj.yw)) - (t.pos.y + (signy*t.yw));//point on the AABB, relative to a point on the slope
            
        var sx = t.sx;//get slope unit normal
        var sy = t.sy;
            
        //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
        //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
        var dp = (ox*sx) + (oy*sy);

        if (dp < 0)
        {
            //collision; project delta onto slope and use this to displace the object
            sx *= -dp;//(sx,sy) is now the projection vector
            sy *= -dp;      

            var lenN = Math.sqrt(sx*sx + sy*sy);
            var lenP = Math.sqrt(x*x + y*y);

            if (lenP < lenN)
            {
                obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);
                    
                return Phaser.Physics.Ninja.AABB.COL_AXIS;
            }
            else
            {       
                obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy,t);
                                    
                return Phaser.Physics.Ninja.AABB.COL_OTHER;
            }
        
        }
            
        return Phaser.Physics.Ninja.AABB.COL_NONE;

    },

    /**
    * Resolves 67 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_67DegS
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_67DegS: function (x, y, obj, t) {

        var signx = t.signx;
        var signy = t.signy;

        var px = obj.pos.x - (signx*obj.xw);
        var penX = t.pos.x - px;

        if (0 < (penX*signx))
        {
            var ox = (obj.pos.x - (signx*obj.xw)) - (t.pos.x - (signx*t.xw));//this gives is the coordinates of the innermost
            var oy = (obj.pos.y - (signy*obj.yw)) - (t.pos.y + (signy*t.yw));//point on the AABB, relative to a point on the slope

            var sx = t.sx;//get slope unit normal
            var sy = t.sy;
            
            //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
            //and we need to project it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
            var dp = (ox*sx) + (oy*sy);

            if (dp < 0)
            {
                //collision; project delta onto slope and use this to displace the object
                sx *= -dp;//(sx,sy) is now the projection vector
                sy *= -dp;      

                var lenN = Math.sqrt(sx*sx + sy*sy);
                var lenP = Math.sqrt(x*x + y*y);

                var aX = Math.abs(penX);

                if (lenP < lenN)
                {
                    if (aX < lenP)
                    {
                        obj.reportCollisionVsWorld(penX, 0, penX/aX, 0, t);
                        
                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                    else
                    {
                        obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);
                        
                        return Phaser.Physics.Ninja.AABB.COL_AXIS;
                    }
                }
                else
                {
                    if (aX < lenN)
                    {
                        obj.reportCollisionVsWorld(penX, 0, penX/aX, 0, t);
                        
                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                    else
                    {               
                        obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy,t);

                        return Phaser.Physics.Ninja.AABB.COL_OTHER;
                    }
                }
            }
        }
        
        //if we've reached this point, no collision has occured
        return Phaser.Physics.Ninja.AABB.COL_NONE;    

    },

    /**
    * Resolves 67 Degree tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_67DegB
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_67DegB: function (x, y, obj, t) {

        var signx = t.signx;
        var signy = t.signy;
            
        var ox = (obj.pos.x - (signx*obj.xw)) - (t.pos.x + (signx*t.xw));//this gives is the coordinates of the innermost
        var oy = (obj.pos.y - (signy*obj.yw)) - (t.pos.y - (signy*t.yw));//point on the AABB, relative to a point on the slope
                                                        
        var sx = t.sx;//get slope unit normal
        var sy = t.sy;
            
        //if the dotprod of (ox,oy) and (sx,sy) is negative, the corner is in the slope
        //and we need toproject it out by the magnitude of the projection of (ox,oy) onto (sx,sy)
        var dp = (ox*sx) + (oy*sy);

        if (dp < 0)
        {
            //collision; project delta onto slope and use this to displace the object
            sx *= -dp;//(sx,sy) is now the projection vector
            sy *= -dp;      
                
            var lenN = Math.sqrt(sx*sx + sy*sy);
            var lenP = Math.sqrt(x*x + y*y);
                
            if (lenP < lenN)
            {
                obj.reportCollisionVsWorld(x,y,x/lenP, y/lenP, t);

                return Phaser.Physics.Ninja.AABB.COL_AXIS;
            }
            else
            {       
                obj.reportCollisionVsWorld(sx,sy,t.sx,t.sy,t);
                    
                return Phaser.Physics.Ninja.AABB.COL_OTHER;
            }
        }
            
        return Phaser.Physics.Ninja.AABB.COL_NONE;    
    },

    /**
    * Resolves Convex tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_Convex
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_Convex: function (x, y, obj, t) {

        //if distance from "innermost" corner of AABB is less than than tile radius,
        //collision is occuring and we need to project

        var signx = t.signx;
        var signy = t.signy;

        var ox = (obj.pos.x - (signx * obj.xw)) - (t.pos.x - (signx * t.xw));//(ox,oy) is the vector from the circle center to
        var oy = (obj.pos.y - (signy * obj.yw)) - (t.pos.y - (signy * t.yw));//the AABB
        var len = Math.sqrt(ox * ox + oy * oy);

        var twid = t.xw * 2;
        var rad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
        //note that this should be precomputed at compile-time since it's constant

        var pen = rad - len;

        if (((signx * ox) < 0) || ((signy * oy) < 0))
        {
            //the test corner is "outside" the 1/4 of the circle we're interested in
            var lenP = Math.sqrt(x * x + y * y);
            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

            return Phaser.Physics.Ninja.AABB.COL_AXIS;//we need to report 		
        }
        else if (0 < pen)
        {
            //project along corner->circle vector
            ox /= len;
            oy /= len;
            obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

            return Phaser.Physics.Ninja.AABB.COL_OTHER;
        }

        return Phaser.Physics.Ninja.AABB.COL_NONE;

    },

    /**
    * Resolves Concave tile collision.
    *
    * @method Phaser.Physics.Ninja.AABB#projAABB_Concave
    * @param {number} x - Penetration depth on the x axis.
    * @param {number} y - Penetration depth on the y axis.
    * @param {Phaser.Physics.Ninja.AABB} obj - The AABB involved in the collision.
    * @param {Phaser.Physics.Ninja.Tile} t - The Tile involved in the collision.
    * @return {number} The result of the collision.
    */
    projAABB_Concave: function (x, y, obj, t) {

        //if distance from "innermost" corner of AABB is further than tile radius,
        //collision is occuring and we need to project

        var signx = t.signx;
        var signy = t.signy;

        var ox = (t.pos.x + (signx * t.xw)) - (obj.pos.x - (signx * obj.xw));//(ox,oy) is the vector form the innermost AABB corner to the
        var oy = (t.pos.y + (signy * t.yw)) - (obj.pos.y - (signy * obj.yw));//circle's center

        var twid = t.xw * 2;
        var rad = Math.sqrt(twid * twid + 0);//this gives us the radius of a circle centered on the tile's corner and extending to the opposite edge of the tile;
        //note that this should be precomputed at compile-time since it's constant

        var len = Math.sqrt(ox * ox + oy * oy);
        var pen = len - rad;

        if (0 < pen)
        {
            //collision; we need to either project along the axes, or project along corner->circlecenter vector

            var lenP = Math.sqrt(x * x + y * y);

            if (lenP < pen)
            {
                //it's shorter to move along axis directions
                obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);

                return Phaser.Physics.Ninja.AABB.COL_AXIS;
            }
            else
            {
                //project along corner->circle vector
                ox /= len;//len should never be 0, since if it IS 0, rad should be > than len
                oy /= len;//and we should never reach here

                obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);

                return Phaser.Physics.Ninja.AABB.COL_OTHER;
            }

        }

        return Phaser.Physics.Ninja.AABB.COL_NONE;
		
    }

}
