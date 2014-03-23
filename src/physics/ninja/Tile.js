/* jshint camelcase: false */
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Ninja Physics Tile constructor.
* A Tile is defined by its width, height and type. It's type can include slope data, such as 45 degree slopes, or convex slopes.
* Understand that for any type including a slope (types 2 to 29) the Tile must be SQUARE, i.e. have an equal width and height.
* Also note that as Tiles are primarily used for levels they have gravity disabled and world bounds collision disabled by default.
*
* Note: This class could be massively optimised and reduced in size. I leave that challenge up to you.
*
* @class Phaser.Physics.Ninja.Tile
* @classdesc The Ninja Physics Tile class. Based on code by Metanet Software.
* @constructor
* @param {Phaser.Physics.Ninja.Body} body - The body that owns this shape.
* @param {number} x - The x coordinate to create this shape at.
* @param {number} y - The y coordinate to create this shape at.
* @param {number} width - The width of this AABB.
* @param {number} height - The height of this AABB.
* @param {number} [type=1] - The type of Ninja shape to create. 1 = AABB, 2 = Circle or 3 = Tile.
*/
Phaser.Physics.Ninja.Tile = function (body, x, y, width, height, type) {

    if (typeof type === 'undefined') { type = Phaser.Physics.Ninja.Tile.EMPTY; }

    /**
    * @property {Phaser.Physics.Ninja.Body} system - A reference to the body that owns this shape.
    */
    this.body = body;

    /**
    * @property {Phaser.Physics.Ninja} system - A reference to the physics system.
    */
    this.system = body.system;

    /**
    * @property {number} id - The ID of this Tile.
    * @readonly
    */
    this.id = type;

    /**
    * @property {number} type - The type of this Tile.
    * @readonly
    */
    this.type = Phaser.Physics.Ninja.Tile.TYPE_EMPTY;

    /**
    * @property {Phaser.Point} pos - The position of this object.
    */
    this.pos = new Phaser.Point(x, y);

    /**
    * @property {Phaser.Point} oldpos - The position of this object in the previous update.
    */
    this.oldpos = new Phaser.Point(x, y);

    if (this.id > 1 && this.id < 30)
    {
        //  Tile Types 2 to 29 require square tile dimensions, so use the width as the base
        height = width;
    }

    /**
    * @property {number} xw - Half the width.
    * @readonly
    */
    this.xw = Math.abs(width / 2);

    /**
    * @property {number} xw - Half the height.
    * @readonly
    */
    this.yw = Math.abs(height / 2);

    /**
    * @property {number} width - The width.
    * @readonly
    */
    this.width = width;

    /**
    * @property {number} height - The height.
    * @readonly
    */
    this.height = height;

    /**
    * @property {Phaser.Point} velocity - The velocity of this object.
    */
    this.velocity = new Phaser.Point();

    /**
    * @property {number} signx - Internal var.
    * @private
    */
    this.signx = 0;

    /**
    * @property {number} signy - Internal var.
    * @private
    */
    this.signy = 0;

    /**
    * @property {number} sx - Internal var.
    * @private
    */
    this.sx = 0;

    /**
    * @property {number} sy - Internal var.
    * @private
    */
    this.sy = 0;

    //  By default Tiles disable gravity and world bounds collision
    this.body.gravityScale = 0;
    this.body.collideWorldBounds = false;

    if (this.id > 0)
    {
        this.setType(this.id);
    }

};

Phaser.Physics.Ninja.Tile.prototype.constructor = Phaser.Physics.Ninja.Tile;

Phaser.Physics.Ninja.Tile.prototype = {

    /**
    * Updates this objects position.
    *
    * @method Phaser.Physics.Ninja.Tile#integrate
    */
    integrate: function () {

        var px = this.pos.x;
        var py = this.pos.y;

        this.pos.x += (this.body.drag * this.pos.x) - (this.body.drag * this.oldpos.x);
        this.pos.y += (this.body.drag * this.pos.y) - (this.body.drag * this.oldpos.y) + (this.system.gravity * this.body.gravityScale);

        this.velocity.set(this.pos.x - px, this.pos.y - py);
        this.oldpos.set(px, py);

    },

    /**
    * Tiles cannot collide with the world bounds, it's up to you to keep them where you want them. But we need this API stub to satisfy the Body.
    *
    * @method Phaser.Physics.Ninja.Tile#collideWorldBounds
    */
    collideWorldBounds: function () {

        var dx = this.system.bounds.x - (this.pos.x - this.xw);

        if (0 < dx)
        {
            this.reportCollisionVsWorld(dx, 0, 1, 0, null);
        }
        else
        {
            dx = (this.pos.x + this.xw) - this.system.bounds.right;

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
            dy = (this.pos.y + this.yw) - this.system.bounds.bottom;

            if (0 < dy)
            {
                this.reportCollisionVsWorld(0, -dy, 0, -1, null);
            }
        }

    },

    /**
    * Process a world collision and apply the resulting forces.
    *
    * @method Phaser.Physics.Ninja.Tile#reportCollisionVsWorld
    * @param {number} px - The tangent velocity
    * @param {number} py - The tangent velocity
    * @param {number} dx - Collision normal
    * @param {number} dy - Collision normal
    * @param {number} obj - Object this Tile collided with
    */
    reportCollisionVsWorld: function (px, py, dx, dy) {
        var p = this.pos;
        var o = this.oldpos;

        //  Calc velocity
        var vx = p.x - o.x;
        var vy = p.y - o.y;

        //  Find component of velocity parallel to collision normal
        var dp = (vx * dx + vy * dy);
        var nx = dp * dx;   //project velocity onto collision normal

        var ny = dp * dy;   //nx,ny is normal velocity

        var tx = vx - nx;   //px,py is tangent velocity
        var ty = vy - ny;

        //  We only want to apply collision response forces if the object is travelling into, and not out of, the collision
        var b, bx, by, fx, fy;

        if (dp < 0)
        {
            fx = tx * this.body.friction;
            fy = ty * this.body.friction;

            b = 1 + this.body.bounce;

            bx = (nx * b);
            by = (ny * b);

            if (dx === 1)
            {
                this.body.touching.left = true;
            }
            else if (dx === -1)
            {
                this.body.touching.right = true;
            }

            if (dy === 1)
            {
                this.body.touching.up = true;
            }
            else if (dy === -1)
            {
                this.body.touching.down = true;
            }
        }
        else
        {
            //  Moving out of collision, do not apply forces
            bx = by = fx = fy = 0;
        }

        //  Project object out of collision
        p.x += px;
        p.y += py;

        //  Apply bounce+friction impulses which alter velocity
        o.x += px + bx + fx;
        o.y += py + by + fy;

    },

    /**
    * Tiles cannot collide with the world bounds, it's up to you to keep them where you want them. But we need this API stub to satisfy the Body.
    *
    * @method Phaser.Physics.Ninja.Tile#setType
    * @param {number} id - The type of Tile this will use, i.e. Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn, Phaser.Physics.Ninja.Tile.CONVEXpp, etc.
    */
    setType: function (id) {

        if (id === Phaser.Physics.Ninja.Tile.EMPTY)
        {
            this.clear();
        }
        else
        {
            this.id = id;
            this.updateType();
        }

        return this;

    },

    /**
    * Sets this tile to be empty.
    *
    * @method Phaser.Physics.Ninja.Tile#clear
    */
    clear: function () {

        this.id = Phaser.Physics.Ninja.Tile.EMPTY;
        this.updateType();

    },

    /**
    * Destroys this Tiles reference to Body and System.
    *
    * @method Phaser.Physics.Ninja.Tile#destroy
    */
    destroy: function () {

        this.body = null;
        this.system = null;

    },

    /**
    * This converts a tile from implicitly-defined (via id), to explicit (via properties).
    * Don't call directly, instead of setType.
    *
    * @method Phaser.Physics.Ninja.Tile#updateType
    * @private
    */
    updateType: function () {

        if (this.id === 0)
        {
            //EMPTY
            this.type = Phaser.Physics.Ninja.Tile.TYPE_EMPTY;
            this.signx = 0;
            this.signy = 0;
            this.sx = 0;
            this.sy = 0;

            return true;
        }

        //tile is non-empty; collide
        if (this.id < Phaser.Physics.Ninja.Tile.TYPE_45DEG)
        {
            //FULL
            this.type = Phaser.Physics.Ninja.Tile.TYPE_FULL;
            this.signx = 0;
            this.signy = 0;
            this.sx = 0;
            this.sy = 0;
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_CONCAVE)
        {
            //  45deg
            this.type = Phaser.Physics.Ninja.Tile.TYPE_45DEG;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn)
            {
                this.signx = 1;
                this.signy = -1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGnn)
            {
                this.signx = -1;
                this.signy = -1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGnp)
            {
                this.signx = -1;
                this.signy = 1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGpp)
            {
                this.signx = 1;
                this.signy = 1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_CONVEX)
        {
            //  Concave
            this.type = Phaser.Physics.Ninja.Tile.TYPE_CONCAVE;

            if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEpn)
            {
                this.signx = 1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEnn)
            {
                this.signx = -1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEnp)
            {
                this.signx = -1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEpp)
            {
                this.signx = 1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_22DEGs)
        {
            //  Convex
            this.type = Phaser.Physics.Ninja.Tile.TYPE_CONVEX;

            if (this.id == Phaser.Physics.Ninja.Tile.CONVEXpn)
            {
                this.signx = 1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONVEXnn)
            {
                this.signx = -1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONVEXnp)
            {
                this.signx = -1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONVEXpp)
            {
                this.signx = 1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_22DEGb)
        {
            //  22deg small
            this.type = Phaser.Physics.Ninja.Tile.TYPE_22DEGs;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnS)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnS)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpS)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGppS)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_67DEGs)
        {
            //  22deg big
            this.type = Phaser.Physics.Ninja.Tile.TYPE_22DEGb;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnB)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnB)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpB)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGppB)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_67DEGb)
        {
            //  67deg small
            this.type = Phaser.Physics.Ninja.Tile.TYPE_67DEGs;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnS)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnS)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpS)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGppS)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_HALF)
        {
            //  67deg big
            this.type = Phaser.Physics.Ninja.Tile.TYPE_67DEGb;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnB)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnB)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpB)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGppB)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else
            {
                return false;
            }
        }
        else
        {
            //  Half-full tile
            this.type = Phaser.Physics.Ninja.Tile.TYPE_HALF;

            if (this.id == Phaser.Physics.Ninja.Tile.HALFd)
            {
                this.signx = 0;
                this.signy = -1;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.HALFu)
            {
                this.signx = 0;
                this.signy = 1;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.HALFl)
            {
                this.signx = 1;
                this.signy = 0;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.HALFr)
            {
                this.signx = -1;
                this.signy = 0;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else
            {
                return false;
            }
        }
    }

};

/**
* @name Phaser.Physics.Ninja.Tile#x
* @property {number} x - The x position.
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "x", {

    get: function () {
        return this.pos.x - this.xw;
    },

    set: function (value) {
        this.pos.x = value;
    }

});

/**
* @name Phaser.Physics.Ninja.Tile#y
* @property {number} y - The y position.
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "y", {

    get: function () {
        return this.pos.y - this.yw;
    },

    set: function (value) {
        this.pos.y = value;
    }

});

/**
* @name Phaser.Physics.Ninja.Tile#bottom
* @property {number} bottom - The bottom value of this Body (same as Body.y + Body.height)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "bottom", {

    get: function () {
        return this.pos.y + this.yw;
    }

});

/**
* @name Phaser.Physics.Ninja.Tile#right
* @property {number} right - The right value of this Body (same as Body.x + Body.width)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "right", {

    get: function () {
        return this.pos.x + this.xw;
    }

});

Phaser.Physics.Ninja.Tile.EMPTY = 0;
Phaser.Physics.Ninja.Tile.FULL = 1;//fullAABB tile
Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn = 2;//45-degree triangle, whose normal is (+ve,-ve)
Phaser.Physics.Ninja.Tile.SLOPE_45DEGnn = 3;//(+ve,+ve)
Phaser.Physics.Ninja.Tile.SLOPE_45DEGnp = 4;//(-ve,+ve)
Phaser.Physics.Ninja.Tile.SLOPE_45DEGpp = 5;//(-ve,-ve)
Phaser.Physics.Ninja.Tile.CONCAVEpn = 6;//1/4-circle cutout
Phaser.Physics.Ninja.Tile.CONCAVEnn = 7;
Phaser.Physics.Ninja.Tile.CONCAVEnp = 8;
Phaser.Physics.Ninja.Tile.CONCAVEpp = 9;
Phaser.Physics.Ninja.Tile.CONVEXpn = 10;//1/4/circle
Phaser.Physics.Ninja.Tile.CONVEXnn = 11;
Phaser.Physics.Ninja.Tile.CONVEXnp = 12;
Phaser.Physics.Ninja.Tile.CONVEXpp = 13;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnS = 14;//22.5 degree slope
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnS = 15;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpS = 16;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGppS = 17;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnB = 18;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnB = 19;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpB = 20;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGppB = 21;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnS = 22;//67.5 degree slope
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnS = 23;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpS = 24;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGppS = 25;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnB = 26;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnB = 27;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpB = 28;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGppB = 29;
Phaser.Physics.Ninja.Tile.HALFd = 30;//half-full tiles
Phaser.Physics.Ninja.Tile.HALFr = 31;
Phaser.Physics.Ninja.Tile.HALFu = 32;
Phaser.Physics.Ninja.Tile.HALFl = 33;

Phaser.Physics.Ninja.Tile.TYPE_EMPTY = 0;
Phaser.Physics.Ninja.Tile.TYPE_FULL = 1;
Phaser.Physics.Ninja.Tile.TYPE_45DEG = 2;
Phaser.Physics.Ninja.Tile.TYPE_CONCAVE = 6;
Phaser.Physics.Ninja.Tile.TYPE_CONVEX = 10;
Phaser.Physics.Ninja.Tile.TYPE_22DEGs = 14;
Phaser.Physics.Ninja.Tile.TYPE_22DEGb = 18;
Phaser.Physics.Ninja.Tile.TYPE_67DEGs = 22;
Phaser.Physics.Ninja.Tile.TYPE_67DEGb = 26;
Phaser.Physics.Ninja.Tile.TYPE_HALF = 30;
